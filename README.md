# 🐸 Plim — App de Reabilitação Pélvica Pediátrica

> App lúdico para crianças de 4-10 anos em tratamento de enurrese, bexiga hiperativa, constipação e incontinência pélvica. Gamificação com mascote-sapo, diário miccional/evacuatório, minigames e sistema de recompensas reais.

[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2056-000020?logo=expo)](https://docs.expo.dev/versions/v56.0.0/)
[![React Native](https://img.shields.io/badge/React%20Native-0.85-61DAFB?logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-lightgrey)](https://docs.expo.dev/)

---

## Visão geral

**Plim** tem três áreas principais:

| Área | Descrição |
|------|-----------|
| 🧒 **App da Criança** | Interface lúdica com mascote Plim (sapo), missões diárias, minigames terapêuticos e lojinha de recompensas |
| 👨‍👩‍👧 **App dos Pais** | Dashboards, gráficos de evolução, gerenciamento de recompensas e exportação de relatório PDF para o médico/fisio |
| 🎮 **Minigames** | Foguete (contração), Balão (relaxamento) e Sapo Pulo (coordenação) |

---

## Stack técnica

| Camada | Tecnologia |
|--------|-----------|
| Framework | [Expo SDK 56](https://docs.expo.dev/versions/v56.0.0/) + React Native 0.85 |
| Linguagem | TypeScript 6 (strict) |
| Navegação | [React Navigation 7](https://reactnavigation.org/) — Native Stack + Bottom Tabs |
| Estado global | [Zustand 5](https://zustand-demo.pmnd.rs/) |
| Animações | [Reanimated 4](https://docs.swmansion.com/react-native-reanimated/) |
| Ilustrações | [react-native-svg](https://github.com/software-mansion/react-native-svg) (SVG paramétrico do mascote) |
| Fontes | Fredoka (títulos) + Nunito (UI) via `@expo-google-fonts` |
| Gradientes | `expo-linear-gradient` |

---

## Paleta de cores — Fresh Mint (padrão)

| Token | Hex | Uso |
|-------|-----|-----|
| `primary` | `#5FCB8E` | verde menta — mascote, CTAs, sucesso |
| `primaryDark` | `#3DA070` | sombra de botão estilo Duolingo |
| `secondary` | `#7DC9E8` | azul céu — xixi, água |
| `accent` | `#FFCE5C` | amarelo sol — estrelas, recompensas |
| `coral` | `#FF8A7A` | alertas, escape, jogos |
| `bg` | `#FFF7EC` | fundo creme quente |
| `surface` | `#FFFFFF` | cards |
| `text` | `#1F3A4D` | texto principal |
| `muted` | `#6B8499` | texto secundário |

Paletas alternativas: **Ocean** (azul) e **Sweet** (lavanda) disponíveis em `src/theme/palettes.ts`.

---

## Estrutura de pastas

```
plim/
├── src/
│   ├── theme/
│   │   ├── palettes.ts        # Fresh / Ocean / Sweet
│   │   ├── tokens.ts          # spacing, radius, shadow
│   │   └── typography.ts      # fontFamily, fontSize, letterSpacing
│   ├── components/
│   │   ├── mascot/
│   │   │   ├── PlimMascot.tsx  # SVG paramétrico — 6 moods
│   │   │   └── PlimLogo.tsx    # 4 variantes de logo
│   │   └── ui/                 # Button, Card, TopBar, TabBar (próximas fases)
│   ├── screens/
│   │   ├── SplashScreen.tsx    # ✅ animação spring + bolhas flutuantes
│   │   ├── ProfileSelectScreen.tsx  # placeholder
│   │   └── ...                 # próximas telas
│   ├── navigation/
│   │   ├── types.ts            # RootStackParamList etc.
│   │   └── RootNavigator.tsx   # Stack principal
│   ├── store/
│   │   └── useAppStore.ts      # Zustand — profile, stars, diary, alarms, rewards
│   └── games/                  # minigames (próximas fases)
├── assets/
├── App.tsx                     # entry — carrega fontes, SplashScreen nativa
├── app.json                    # configuração Expo
└── babel.config.js
```

---

## Mascote — "Plim, o sapo"

SVG paramétrico 200×200 viewBox implementado em `src/components/mascot/PlimMascot.tsx`.

**Moods disponíveis:**

| Mood | Uso |
|------|-----|
| `happy` | padrão, home |
| `cheer` | celebração, conquistas |
| `sleepy` | modo noturno, lembretes |
| `focus` | durante jogo/exercício |
| `water` | diário de xixi, hidratação |
| `splash` | logo variante D, erros |

**Cores do mascote são props** — permite 6 avatares coloridos desbloqueáveis por estrelas.

---

## Modelo de dados (Zustand)

```ts
// Stars e recompensas
earnStars(n: number)         // após registro bom ou jogo
redeemReward(id: string)     // troca estrelas por prêmio
setSavingFor(id: string|null) // marca meta de recompensa

// Diário
addEntry(DiaryEntry)         // miccional | evacuatório | escape

// Missões diárias
completeMission('mic'|'water'|'game'|'learn')

// Alarmes
toggleAlarm(id: string)      // liga/desliga lembrete
```

---

## Rodando o projeto

### Pré-requisitos
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- [Expo Go](https://expo.dev/go) no celular (iOS ou Android)

### Instalação

```bash
git clone https://github.com/SEU_USUARIO/plim.git
cd plim
npm install
```

### Desenvolvimento

```bash
# Inicia o Metro bundler + QR code
npm start

# Direto no Android (emulador ou USB)
npm run android

# Direto no iOS (somente macOS)
npm run ios
```

Escaneie o QR code com o Expo Go para testar no celular.

---

## Roadmap de telas

| # | Tela | Status |
|---|------|--------|
| 0 | Splash (animação) | ✅ Feito |
| 1 | Onboarding (5 passos) | 🔜 Próximo |
| 2 | Profile Select | 🔜 Próximo |
| 3 | Home (criança) | ⏳ |
| 4 | Diário (menu) | ⏳ |
| 5 | Diário Miccional | ⏳ |
| 6 | Diário Evacuatório (Bristol) | ⏳ |
| 7 | Lembretes / Alarmes | ⏳ |
| 8-9 | Aprender (orientações) | ⏳ |
| 10 | Hub de Jogos | ⏳ |
| 11 | 🚀 Game Foguete | ⏳ |
| 12 | 🎈 Game Balão | ⏳ |
| 13 | 🐸 Game Sapo Pulo | ⏳ |
| 14 | 🛍 Lojinha (recompensas reais) | ⏳ |
| 15 | Conquistas & Avatares | ⏳ |
| 16-17 | Pais — Overview | ⏳ |
| 18 | Pais — Diário completo | ⏳ |
| 19 | Pais — Evolução (gráficos) | ⏳ |
| 20 | Pais — Relatório PDF | ⏳ |
| 21 | Pais — Recompensas CRUD | ⏳ |
| 22 | Pais — Ajustes | ⏳ |

---

## Decisões técnicas abertas

1. **Backend**: app funciona 100% local (AsyncStorage → SQLite). Sync com Supabase/Firebase é futuro opcional.
2. **Biofeedback**: v1 simula por toque na tela. v2 pode integrar sensores Bluetooth.
3. **Relatório PDF**: `expo-print` + `expo-sharing` — template HTML do design handoff vira o layout.
4. **Multi-perfil**: schema (`KidProfile`) já suporta múltiplos filhos, falta o seletor de perfil.
5. **Notificações**: `expo-notifications` agenda as `Alarm[]` como notificações locais recorrentes.

---

## Design handoff

Design original em `downloads/design_handoff_plim/` com:
- `README.md` — especificação completa de todas as telas
- `screenshots/` — 23 screenshots de referência
- `src/` — protótipos HTML/JSX de comportamento

Abrir `Plim.html` com `npx serve .` para visualizar o protótipo completo no browser.

---

## Licença

Projeto privado — uso exclusivo do titular.
