# Fundamentação clínica do Plim

**Desenvolvedor:** Linyker Mendes Coelho
**Equipe colaboradora:** Flávia Franco, Lívia Britto, Liliane Ganzerli de Souza e Andreia Reis (Pós-Graduandas em Estomaterapia, Hospital Israelita Albert Einstein)
**Contexto:** trabalho desenvolvido para apresentação no Seminário de Estomaterapia, Hospital Israelita Albert Einstein (São Paulo)

> **Status: em validação com a equipe.** Este documento mapeia as decisões do app aos conceitos de uroterapia que as inspiraram. **Atualização (12/06/2026):** os protocolos de exercícios (contração lenta, contração rápida e respiração) e as metas de hidratação por idade foram validados pela equipe da Pós-Graduação em Estomaterapia, com confirmação docente, e já estão incorporados ao aplicativo. As perguntas ainda em aberto estão na última seção.

## Desenvolvimento do projeto

O aplicativo Plim foi desenvolvido por Linyker Mendes Coelho em conjunto com alunas da Pós-Graduação em Estomaterapia do Hospital Israelita Albert Einstein, por meio de um processo colaborativo de construção, discussão clínica e desenvolvimento conceitual voltado à reabilitação pélvica pediátrica.

A participação da equipe contribuiu para a definição das funcionalidades do aplicativo, elaboração dos conteúdos educativos, adequação da linguagem infantil e alinhamento dos recursos gamificados aos princípios da uroterapia e da reabilitação pélvica baseada em evidências.

**Equipe colaboradora:**

- Linyker Mendes Coelho, Desenvolvedor
- Flávia Franco, Pós-Graduanda em Estomaterapia
- Lívia Britto, Pós-Graduanda em Estomaterapia
- Liliane Ganzerli de Souza, Pós-Graduanda em Estomaterapia
- Andreia Reis, Pós-Graduanda em Estomaterapia

## O que o Plim é

Ferramenta de apoio à **uroterapia padrão** (urotherapy) para crianças de 4 a 10 anos em tratamento de enurese, bexiga hiperativa, constipação e incontinência. O app não diagnostica, não trata sozinho e não substitui o acompanhamento profissional: ele transforma as tarefas que o tratamento já pede (diário, hidratação, rotina de banheiro, exercícios) em algo que a criança quer fazer.

## Mapa: feature do app → conceito clínico

| Feature | Conceito clínico | Referência de partida |
|---------|-----------------|----------------------|
| Diário de micção (horário, volume estimado em copos, cor da urina, gatilhos) | O diário miccional é a base da avaliação e do acompanhamento na uroterapia padrão recomendada pela ICCS | Nieuwhof-Leppink et al., ICCS standardization document de uroterapia (J Pediatr Urol, 2021) |
| Diário de evacuação com escala de Bristol ilustrada | Classificação da consistência fecal; constipação funcional frequentemente coexiste com sintomas urinários (disfunção vesico-intestinal) | Lewis & Heaton (1997); critérios de Roma IV para desordens funcionais pediátricas (Hyams et al., 2016) |
| Registro de escape com acolhimento (sem punição, mesmas estrelas) | Uroterapia comportamental orienta nunca punir acidentes; culpa e vergonha pioram adesão e o dado honesto vale mais que o dado bonito | ICCS enuresis (Nevéus et al., 2020) |
| Lembretes programados de banheiro (7 horários padrão) | Micção programada (timed voiding), componente da uroterapia padrão | ICCS uroterapia (2021) |
| Missão diária de água + histórico de copos | Ingestão hídrica adequada e distribuída ao longo do dia: 1 a 3 anos 800 a 1000 mL; 4 a 8 anos 1000 a 1400 mL; 9 a 13 anos 1400 a 2000 mL. Estratégia: 1 copo de água após cada micção (≈ 6 a 8 copos/dia) | **Validado pela equipe (orientações de uroterapia, 12/06/2026)** |
| Jogo Foguete (segurar = contrair, soltar = relaxar, descanso obrigatório) | Contração lenta do assoalho pélvico: contração 5s, relaxamento 5s, 10 repetições, 3 séries/dia; o app funciona como metrônomo lúdico, não como biofeedback | **Validado pela equipe (12/06/2026)** |
| Jogo Balão (ciclos de respiração guiada) | Respiração diafragmática: 5 a 10 ciclos, 3 vezes ao dia, antes dos exercícios do assoalho pélvico | **Validado pela equipe (12/06/2026)** |
| Jogo Pulo do Sapo (3 séries de 10 toques rápidos) | Contrações rápidas: 10 contrações rápidas consecutivas, intervalo de 30 segundos, 3 séries | **Validado pela equipe (12/06/2026)** |
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

As perguntas sobre protocolos de exercício e metas de hidratação foram respondidas pela equipe em 12/06/2026 e incorporadas ao app. Permanecem em aberto:

1. Os 7 lembretes padrão de micção programada (7h30 a 20h30, mais 2h opcional) fazem sentido como default?
2. Os rótulos infantis da escala de Bristol no app estão fiéis às 7 categorias?
3. A lista de condições no onboarding (enurese, bexiga hiperativa, constipação, incontinência fecal, treino de desfralde, "não sei") cobre o necessário? Os nomes leigos estão bons?
4. O texto educativo ("evite refrigerante, suco de laranja e limão irritam a bexiga") está correto e completo?
5. O treino ativo de assoalho pélvico é indicado para todas as condições cobertas, ou deveria ser liberado pelo profissional caso a caso?

## Referências de partida

> Atenção: conferir edição, ano e conteúdo antes de citar em trabalho acadêmico. Esta lista foi montada de memória pelo desenvolvedor como ponto de partida da revisão bibliográfica, não como bibliografia final.

- Nieuwhof-Leppink AJ, et al. *Definitions, indications and practice of urotherapy in children and adolescents: an ICCS standardization document.* Journal of Pediatric Urology, 2021.
- Nevéus T, et al. *Management and treatment of nocturnal enuresis: an updated standardization document from the ICCS.* Journal of Pediatric Urology, 2020.
- Austin PF, et al. *The standardization of terminology of lower urinary tract function in children and adolescents (ICCS).* Neurourology and Urodynamics, 2016.
- Lewis SJ, Heaton KW. *Stool form scale as a useful guide to intestinal transit time.* Scandinavian Journal of Gastroenterology, 1997.
- Hyams JS, et al. *Functional disorders: children and adolescents (Rome IV).* Gastroenterology, 2016.
