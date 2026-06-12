# Fundamentação clínica do Plim

**Desenvolvedor:** Linyker Mendes Coelho
**Colaboração clínica:** Flávia Franco, Livia Britto, Liliane Ganzerli de Souza e Andreia Reis (enfermeiras, estudantes do Albert Einstein)
**Contexto:** trabalho desenvolvido para apresentação no Seminário de Estomaterapia, Albert Einstein (São Paulo)

> **Status: rascunho para validação da especialista.** Este documento foi escrito pelo desenvolvedor mapeando as decisões do app aos conceitos de uroterapia que as inspiraram. Ele NÃO é verdade clínica: precisa ser revisado, corrigido e assinado por profissional de saúde (enfermeira especialista e/ou fisioterapeuta pélvica) antes de ser apresentado como fundamentação. As perguntas em aberto estão na última seção.

## O que o Plim é

Ferramenta de apoio à **uroterapia padrão** (urotherapy) para crianças de 4 a 10 anos em tratamento de enurese, bexiga hiperativa, constipação e incontinência. O app não diagnostica, não trata sozinho e não substitui o acompanhamento profissional: ele transforma as tarefas que o tratamento já pede (diário, hidratação, rotina de banheiro, exercícios) em algo que a criança quer fazer.

## Mapa: feature do app → conceito clínico

| Feature | Conceito clínico | Referência de partida |
|---------|-----------------|----------------------|
| Diário de micção (horário, volume estimado em copos, cor da urina, gatilhos) | O diário miccional é a base da avaliação e do acompanhamento na uroterapia padrão recomendada pela ICCS | Nieuwhof-Leppink et al., ICCS standardization document de uroterapia (J Pediatr Urol, 2021) |
| Diário de evacuação com escala de Bristol ilustrada | Classificação da consistência fecal; constipação funcional frequentemente coexiste com sintomas urinários (disfunção vesico-intestinal) | Lewis & Heaton (1997); critérios de Roma IV para desordens funcionais pediátricas (Hyams et al., 2016) |
| Registro de escape com acolhimento (sem punição, mesmas estrelas) | Uroterapia comportamental orienta nunca punir acidentes; culpa e vergonha pioram adesão e o dado honesto vale mais que o dado bonito | ICCS enuresis (Nevéus et al., 2020) |
| Lembretes programados de banheiro (7 horários padrão) | Micção programada (timed voiding), componente da uroterapia padrão | ICCS uroterapia (2021) |
| Missão diária de água + histórico de copos | Ingestão hídrica adequada e distribuída ao longo do dia, evitando concentração à noite | a confirmar com a especialista (valores no app: 6 a 8 copos, 1,2 a 1,5 L/dia) |
| Jogo Foguete (segurar = contrair, soltar = relaxar, descanso obrigatório ≥ contração, séries por idade) | Treino da musculatura do assoalho pélvico com proporção contração/descanso; o app funciona como metrônomo lúdico, não como biofeedback | a validar com fisioterapeuta pélvica (protocolos no app: 3s/6s x5 até 5 anos; 5s/10s x6 de 6 a 7; 8s/10s x8 de 8+) |
| Jogo Balão (inspirar 4s, segurar 2s, expirar 6s) | Respiração diafragmática para relaxamento do assoalho pélvico, útil na evacuação e na micção disfuncional | a validar |
| Jogo Pulo do Sapo (toques rápidos em ritmo) | Coordenação e contrações rápidas (fibras de contração rápida) | a validar |
| Conteúdo educativo (postura no vaso, pés apoiados, sem pressa, relaxar a barriga) | Educação e desmistificação, primeiro pilar da uroterapia; postura de evacuação com apoio dos pés | ICCS uroterapia (2021) |
| Relatório PDF para o profissional | O diário só tem valor clínico se chega a quem prescreve; exportação resume eventos, tendência de escapes e hidratação | |

## Decisões de produto com justificativa clínica

Estas regras estão implementadas no código e documentadas no README. Qualquer feature nova deve respeitá-las:

1. **Recompensa-se o comportamento, nunca o resultado fisiológico.** Registrar um escape vale exatamente as mesmas estrelas que registrar um xixi no banheiro. Se o resultado "bom" valesse mais, o app ensinaria a criança a esconder acidentes (corrompendo o diário) ou a restringir líquidos (risco). Noites secas geram celebração emocional do mascote, nunca moeda.
2. **Acidente não é falha.** A tela de escape usa linguagem de acolhimento ("acontece com todo sapo") e visual idêntico ao resto do app, sem cores punitivas.
3. **Sem sequência (streak) que zera.** O progresso é "dias ativos", que só cresce. Sistemas de streak punitivos geram ansiedade em adultos; em criança em tratamento de continência, ansiedade é contraproducente clinicamente.
4. **A criança é a heroína, não a paciente.** A narrativa inverte o papel: ela cuida da Lagoa do Plim. O foco emocional sai do corpo dela e vai para um amigo que depende dela, reduzindo vergonha.
5. **Limites de recompensa.** Teto de estrelas por dia evita uso compulsivo dos jogos e mantém a motivação extrínseca (prêmios reais dos pais) subordinada à intrínseca (história, mascote).

## Limitações que devem ficar explícitas

- O celular **não sente a contração** do assoalho pélvico. Os jogos marcam o ritmo do exercício; o ensino do gesto correto ("apertar como quem segura o xixi") é responsabilidade do profissional, e o app assume que isso foi orientado em consulta.
- O app não tem inteligência diagnóstica: não interpreta os dados, só os organiza para o profissional.
- Dados ficam 100% no aparelho (sem servidor). Bom para privacidade, mas perda do aparelho perde o histórico (mitigação planejada em `docs/BACKEND.md`).
- Volumes de micção são estimados pela criança em "copos", não medidos.

## Perguntas para a especialista validar

1. Os valores de hidratação (6 a 8 copos, 1,2 a 1,5 L/dia para 4 a 10 anos) estão corretos? Devem variar por peso ou idade?
2. O protocolo do Foguete por faixa etária (3s/6s x5; 5s/10s x6; 8s/10s x8) é adequado? Treino de assoalho pélvico ativo é indicado para todas as condições cobertas, ou deveria ser liberado pelo profissional por criança?
3. Os 7 lembretes padrão de micção programada (7h30 a 20h30, mais 2h opcional) fazem sentido como default?
4. Os rótulos infantis da escala de Bristol no app estão fiéis às 7 categorias?
5. A lista de condições no onboarding (enurese, bexiga hiperativa, constipação, incontinência fecal, treino de desfralde, "não sei") cobre o necessário? Os nomes leigos estão bons?
6. O texto educativo ("evite refrigerante, suco de laranja e limão irritam a bexiga") está correto e completo?
7. Há contraindicação em incentivar o jogo Balão como rotina pré-evacuação?

## Referências de partida

> Atenção: conferir edição, ano e conteúdo antes de citar em trabalho acadêmico. Esta lista foi montada de memória pelo desenvolvedor como ponto de partida da revisão bibliográfica, não como bibliografia final.

- Nieuwhof-Leppink AJ, et al. *Definitions, indications and practice of urotherapy in children and adolescents: an ICCS standardization document.* Journal of Pediatric Urology, 2021.
- Nevéus T, et al. *Management and treatment of nocturnal enuresis: an updated standardization document from the ICCS.* Journal of Pediatric Urology, 2020.
- Austin PF, et al. *The standardization of terminology of lower urinary tract function in children and adolescents (ICCS).* Neurourology and Urodynamics, 2016.
- Lewis SJ, Heaton KW. *Stool form scale as a useful guide to intestinal transit time.* Scandinavian Journal of Gastroenterology, 1997.
- Hyams JS, et al. *Functional disorders: children and adolescents (Rome IV).* Gastroenterology, 2016.
