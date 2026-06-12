# 🐸 Plim — App de Reabilitação Pélvica Pediátrica

> App lúdico para crianças de 5 a 11 anos em tratamento de enurese, bexiga hiperativa, constipação e incontinência pélvica. Gamificação com mascote-sapo, diário miccional/evacuatório, minigames terapêuticos e recompensas reais curadas pelos pais.

**Desenvolvedor:** Linyker Mendes Coelho
**Equipe colaboradora:** Flávia Franco, Lívia Britto, Liliane Ganzerli de Souza e Andreia Reis (Pós-Graduandas em Estomaterapia, Hospital Israelita Albert Einstein)
**Contexto:** desenvolvido em processo colaborativo com alunas da Pós-Graduação em Estomaterapia do Hospital Israelita Albert Einstein, para apresentação no Seminário de Estomaterapia (São Paulo)

[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2056-000020?logo=expo)](https://docs.expo.dev/versions/v56.0.0/)
[![React Native](https://img.shields.io/badge/React%20Native-0.85-61DAFB?logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-lightgrey)](https://docs.expo.dev/)

---

## Visão geral

| Área | Descrição |
|------|-----------|
| 🧒 **App da Criança** | Home com a Lagoa do Plim que floresce com o uso, missões diárias, diários de xixi/cocô/escape, 3 minigames, lojinha e conquistas |
| 👨‍👩‍👧 **App dos Pais** | Visão geral com métricas, diário completo, gráficos de evolução, relatório PDF, gestão de recompensas e ajustes |
| 🎮 **Minigames** | Foguete (contração com descanso obrigatório), Balão (respiração guiada) e Pulo do Sapo (coordenação) |

---

## Princípios clínicos da gamificação

Regras que o código segue e que **não devem ser quebradas** em features futuras:

1. **Recompensa-se o comportamento, nunca o resultado clínico.** Registrar um escape vale as mesmas estrelas que registrar um xixi no banheiro. Noite seca gera celebração do mascote, não moeda. Motivo: se escape valesse menos, a criança aprenderia a esconder acidentes, destruindo o valor clínico do diário.
2. **Acidente nunca é punição.** A tela de escape usa o mood `splash` do Plim com acolhimento ("Acontece com todo sapo, até comigo").
3. **Sem streak que zera.** O progresso é contado em dias ativos, que só crescem. Dia sem registro é neutro.
4. **Sem farm de estrelas.** Jogos dão recompensa cheia só na primeira conclusão do dia; repetir vale 1 estrela. Tentar sempre rende pelo menos 1, nunca zero.
5. **Protocolo respeitado nos exercícios.** O Foguete impõe descanso maior ou igual à contração entre as repetições.

---

## Stack técnica

| Camada | Tecnologia |
|--------|-----------|
| Framework | [Expo SDK 56](https://docs.expo.dev/versions/v56.0.0/) + React Native 0.85 |
| Linguagem | TypeScript 5.8 (strict) |
| Navegação | [React Navigation 7](https://reactnavigation.org/): Native Stack + Bottom Tabs |
| Estado global | [Zustand 5](https://zustand-demo.pmnd.rs/) com persistência em AsyncStorage |
| Animações | [Reanimated 4](https://docs.swmansion.com/react-native-reanimated/) |
| Ilustrações | [react-native-svg](https://github.com/software-mansion/react-native-svg): mascote e lagoa paramétricos |
| Leitura assistida | `expo-speech` (voz pt-BR para quem ainda não lê) |
| Notificações | `expo-notifications` (alarmes locais) |
| Relatório | `expo-print` + `expo-sharing` (PDF para o médico) |
| Fontes | Fredoka (títulos) + Nunito (UI) via `@expo-google-fonts` |

---

## Paleta de cores — Fresh Mint (padrão)

| Token | Hex | Uso |
|-------|-----|-----|
| `primary` | `#5FCB8E` | verde menta: mascote, superfícies, sucesso |
| `primaryDark` | `#3DA070` | tom de apoio do primary |
| `btn` / `btnDark` | `#2E8B5F` / `#1F6B47` | fundo de botões de ação (contraste >4:1 com texto branco) |
| `secondary` | `#7DC9E8` | azul céu: xixi, água |
| `accent` | `#FFCE5C` | amarelo sol: estrelas (apenas em ícones) |
| `accentText` | `#9A7200` | âmbar legível quando o accent vira texto |
| `coral` / `coralDark` | `#FF8A7A` / `#D54B38` | alertas suaves, botões de parar |
| `bg` | `#FFF7EC` | fundo creme quente |
| `surface` | `#FFFFFF` | cards |
| `text` | `#1F3A4D` | texto principal |
| `muted` | `#54707F` | texto secundário (4.5:1 sobre o bg) |

Paletas alternativas: **Ocean** (azul) e **Sweet** (lavanda) em `src/theme/palettes.ts`. Acessibilidade: o amarelo nunca é usado como cor de texto, botões de ação usam os tokens `btn`, alvos de toque mínimos de 44px.

---

## Estrutura de pastas

```
plim/
├── src/
│   ├── theme/                  # palettes (3 temas), tokens, typography
│   ├── content/
│   │   ├── plimVoice.ts        # frases do Plim por contexto
│   │   └── lagoon.ts           # 5 fases da Lagoa por dias ativos
│   ├── components/
│   │   ├── mascot/             # PlimMascot (SVG, 6 moods) + PlimLogo
│   │   ├── lagoon/             # LagoonScene (SVG por fase)
│   │   ├── diary/              # BristolGlyph, ClockFace, CupGlyph, PoopBlob
│   │   └── ui/                 # PlimButton, PlimIcon
│   ├── screens/
│   │   ├── SplashScreen / Onboarding / ProfileSelect
│   │   ├── kid/                # Home, diários (mic/evac/inc), jogos,
│   │   │                       # Learn, Store, Alarms, Achievements
│   │   └── parent/             # Overview, Diary, Chart, Report, Settings
│   ├── navigation/             # Root stack + tabs (kid e parent)
│   ├── services/
│   │   ├── notifications.ts    # alarmes locais
│   │   └── speech.ts           # leitura assistida pt-BR
│   └── store/
│       └── useAppStore.ts      # Zustand: profile, stars, diário, missões...
├── docs/
│   ├── BACKEND.md              # plano de arquitetura do backend (fases, LGPD, sync)
│   └── CLINICO.md              # fundamentação clínica (rascunho p/ validação da especialista)
├── assets/
└── App.tsx
```

---

## Mascote — "Plim, o sapo"

SVG paramétrico em `src/components/mascot/PlimMascot.tsx`, cores via props (6 avatares desbloqueáveis na lojinha por 25⭐, o do onboarding é grátis).

| Mood | Uso no app |
|------|-----------|
| `happy` | padrão, home |
| `cheer` | celebrações, fim de jogo, conquistas |
| `sleepy` | lembretes noturnos |
| `focus` | durante o Pulo do Sapo |
| `water` | recompensa do diário de xixi |
| `splash` | registro de escape (acolhimento) |

A voz do mascote vem de `src/content/plimVoice.ts` (frases por contexto, sorteadas) e é falada em voz alta via `expo-speech`.

---

## Economia de estrelas

| Ação | Estrelas | Limite |
|------|----------|--------|
| Registrar xixi **ou escape** | 3 | 1x/dia (missão `mic`) |
| Registrar cocô | 5 | 1x/dia (missão `evac`) |
| Beber 2 copos de água | 2 | 1x/dia (missão `water`) |
| Completar um jogo | 5 a 10 | recompensa cheia 1x/dia, repetição vale 1 |
| Aprender (respiração ou 2 categorias) | 2 | 1x/dia (missão `learn`) |

`starsLifetime` acumula o total ganho na vida (nunca diminui) e alimenta as conquistas. As recompensas reais são cadastradas pelos pais e marcadas como entregues no painel.

---

## Rodando o projeto

### Pré-requisitos
- Node.js 18+
- [Expo Go](https://expo.dev/go) no celular, ou emulador Android

### Instalação e desenvolvimento

```bash
git clone https://github.com/Linykercs/plim.git
cd plim
npm install

npm start          # Metro bundler + QR code
npm run android    # direto no emulador/USB
npm run ios        # somente macOS
```

Typecheck: `npx tsc --noEmit`

---

## Status das telas

Todas as 22 telas do roteiro original estão implementadas: splash, onboarding (5 passos), seleção de perfil, home da criança com Lagoa evolutiva, 3 diários, lembretes, conteúdo educativo, hub + 3 minigames, lojinha com avatares, conquistas, e o painel dos pais completo (overview, diário, gráficos, PDF, recompensas, ajustes).

### Próximos passos

- Dificuldade dos jogos adaptativa por idade (4-5 / 6-7 / 8-10 anos)
- Feedback visual ao registrar água na Home
- Celebração quando a Lagoa muda de fase
- Sons nos minigames
- Testes unitários da lógica clínica (economia, dias ativos, fases da lagoa)
- Backend: ver [`docs/BACKEND.md`](docs/BACKEND.md)
- Validação clínica: ver [`docs/CLINICO.md`](docs/CLINICO.md)

> 💡 **Demonstração**: em Pais → Configurações → Demonstração, o botão "Carregar dados de exemplo" preenche o app com 3 semanas de uso realista (lagoa na fase 3, gráficos e relatório PDF populados).

---

## Backend

O app é 100% offline-first (AsyncStorage) e deve continuar assim. O plano de evolução para sync, backup e compartilhamento com profissionais de saúde, incluindo as considerações de LGPD para dados de saúde de menores, está documentado em [`docs/BACKEND.md`](docs/BACKEND.md).

---

## Licença

Projeto privado. Uso exclusivo do titular.
