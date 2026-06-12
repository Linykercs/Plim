# Backend do Plim: plano de arquitetura

Este documento descreve como eu construiria o backend do Plim quando ele sair do modo 100% local. A ordem das fases importa mais que a stack: cada fase só se justifica quando a anterior cria a necessidade real.

## Princípios

1. **Offline-first é inegociável.** A criança registra no banheiro, no carro, na casa da avó, muitas vezes sem sinal. O app já funciona 100% local (Zustand + AsyncStorage) e isso deve continuar verdade para sempre. O backend existe para sincronizar, fazer backup e compartilhar, nunca como dependência para o app abrir.

2. **Dados de saúde de criança são o caso mais sensível da LGPD.** Diário miccional e evacuatório é dado de saúde (art. 11, dado sensível) de menor de idade (art. 14, exige consentimento específico de pelo menos um dos pais). Toda decisão de arquitetura parte de minimização: coletar o mínimo, reter o mínimo, e dar ao responsável o botão de apagar tudo.

3. **Começar pequeno.** BaaS gerenciado antes de API própria. API própria antes de qualquer coisa distribuída. O domínio do Plim é um diário com sincronização, não precisa de microsserviço.

## Fases

### Fase 0 (atual): 100% local

O risco real de hoje não é falta de servidor, é **perda do aparelho = perda de meses de histórico clínico**. O passo mais barato antes de qualquer backend:

- Exportar/importar backup manual: um JSON do estado do store, cifrado com uma frase escolhida pelo responsável, salvo via `expo-sharing` (Drive, e-mail, etc.). Cabe numa tela nova em Ajustes dos pais e não exige servidor nenhum.

### Fase 1: Supabase (sync + backup + multi-dispositivo)

Quando: assim que existir um piloto com famílias reais, porque aí perder dados deixa de ser aceitável.

Por que Supabase e não Firebase: Postgres relacional (o modelo do Plim é relacional), Row Level Security nativa para o isolamento por responsável, auth pronta, tier gratuito generoso, e exportar os dados para fora (se um dia migrar) é trivial porque é SQL padrão.

O que entra nesta fase:
- Conta do **responsável** (e-mail, Google, Apple via Supabase Auth). A criança nunca tem conta, e-mail nem identidade própria no sistema.
- Sincronização do diário, estrelas, recompensas e configurações.
- Restauração completa ao trocar de aparelho.

### Fase 2: API dedicada

Quando (e somente quando) surgir uma destas necessidades:
- Painel web para o profissional de saúde acompanhar pacientes.
- Relatórios gerados no servidor.
- Integração com clínicas ou prontuários.

Stack sugerida: NestJS + Postgres (mantendo o mesmo banco da Fase 1, a API entra na frente, nada se reescreve). Java/Spring é alternativa válida se quiser alinhar com a stack que você já opera no dia a dia, mas para projeto solo o custo de manutenção do Node tende a ser menor e o TypeScript é compartilhado com o app.

## Autenticação e perfis

```
guardian (conta autenticada)
  └── kid_profile (1..n filhos, sem credenciais próprias)
        └── dados clínicos e de gamificação
```

- O portão parental (PIN) continua sendo local do aparelho, não vai para o servidor.
- **Profissional de saúde**: convite gerado pelo responsável, com token de escopo somente leitura, por criança, com expiração e revogação. O responsável sempre enxerga quem tem acesso e pode cortar.

## Modelo de dados (espelha o store atual)

Esboço das tabelas principais:

| Tabela | Conteúdo | Observação |
|--------|----------|------------|
| `guardians` | id, auth_id, consentimento (timestamp + versão dos termos) | |
| `kids` | id, guardian_id, apelido, idade, condições, avatar | apelido, nunca nome completo obrigatório |
| `diary_entries` | id (UUID do cliente), kid_id, type (mic/evac/inc), payload jsonb, created_at | **append-only** |
| `water_log` | kid_id, date, cups | |
| `alarms` | kid_id, label, time, days, on, kind | |
| `rewards` | kid_id, name, icon, cost | |
| `redemptions` | id, reward_id, status, redeemed_at | |
| `star_ledger` | id (UUID do cliente), kid_id, delta, reason, created_at | ver abaixo |
| `avatar_unlocks` | kid_id, avatar_index | |

**Extrato de estrelas em vez de saldo**: cada ganho e cada gasto é uma linha (`delta` positivo ou negativo, `reason` tipo `mission:mic`, `redeem:r3`). O saldo é a soma, `starsLifetime` é a soma dos créditos. Isso elimina conflito de saldo entre dois aparelhos sincronizando, dá trilha de auditoria de graça e torna as conquistas recomputáveis no servidor.

## Sincronização

O domínio ajuda muito aqui: quase tudo é **append-only**.

- `diary_entries` e `star_ledger` nascem com UUID gerado no cliente. Sync = empurrar pendências + puxar incrementais por `created_at`. Idempotência pelo UUID, sem conflito possível.
- Configurações (alarmes, recompensas, paleta, perfil): last-write-wins por `updated_at`, suficiente para o caso de uso (um responsável, raramente dois aparelhos editando junto).
- Fila de mutações offline persistida no mesmo AsyncStorage, com retry e backoff quando a rede volta.
- **Não usar CRDT nem sync engine genérico**: é complexidade que esse domínio não pede.

## Segurança e LGPD

- **RLS em todas as tabelas** filtrando por `guardian_id`: mesmo um bug na API não vaza dados entre famílias.
- TLS em trânsito, criptografia em repouso (Supabase já entrega).
- **Consentimento**: registrado no onboarding com timestamp e versão dos termos, revogável.
- **Exclusão (art. 18)**: função única que apaga tudo de uma criança, exposta como botão em Ajustes dos pais. Testar de verdade, incluindo backups.
- **Portabilidade**: o export JSON/PDF que já existe no app cumpre o papel.
- **Telemetria**: apenas eventos agregados e anônimos (ex.: "missão completada"), nunca conteúdo do diário, e com opt-in do responsável.
- **Push**: o payload da notificação nunca carrega dado clínico. "O Plim sente sua falta!" sim, "3 escapes esta semana" jamais, porque notificação aparece em tela bloqueada.

## Notificações

- Os alarmes diários da criança continuam **locais** (`expo-notifications`), funcionam offline e não dependem de servidor.
- Push remoto (Expo Push Service, gratuito) só para o responsável: inatividade prolongada, prêmio marcado como entregue, novidades. Volume baixo, sem infraestrutura própria.

## Relatório para o profissional

- Curto prazo: o PDF local (`expo-print`) já atende a consulta.
- Fase 2: link web somente leitura com os gráficos (página estática + token de convite). Melhor que PDF por WhatsApp: sempre atualizado e revogável.

## Esboço de API (Fase 2)

```
POST   /sync                      # batch: entries + ledger pendentes, retorna incrementais
GET    /kids/:id/entries?since=   # pull incremental
POST   /kids/:id/shares           # cria convite para profissional
DELETE /kids/:id                  # exclusão LGPD completa
```

Exemplo de item no batch de sync:

```json
{
  "id": "9f1c2e3a-...",
  "kid_id": "...",
  "type": "mic",
  "payload": { "cups": 1, "color": "c2", "triggers": ["es"] },
  "created_at": "2026-06-12T14:32:00-03:00"
}
```

## Custos

Supabase free tier (500 MB, 50k usuários auth) aguenta MVP e pilotos com folga; Expo Push é gratuito. Total: R$ 0 até validar o produto com famílias reais, que é exatamente quando se deve gastar.

## O que NÃO fazer agora

- Microsserviços, filas, Kubernetes: é um diário com sync.
- Login ou identidade para a criança: risco LGPD sem benefício.
- Validação server-side da gamificação (anti-cheat): confiar no cliente é aceitável, o "atacante" é uma criança de 7 anos e o prêmio é um sorvete.
- IA ou analytics sobre os dados clínicos antes de base legal e anonimização bem resolvidas.
