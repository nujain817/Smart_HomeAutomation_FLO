# HomeOne — client prototype

A clickable mobile prototype of **HomeOne**, the unified smart home & energy app described in the PRD
*Unified Smart Home & Energy Experience* (Oct 2026). It is built with Expo (React Native) so the same
code runs on iPhone and Android through Expo Go, and as a web link you can share with a client.

All data is mocked in memory. Placeholders from the design, such as `[Name]`, `[Home name]` and `[$1.40]`,
are kept on purpose so they can be swapped for client-specific copy.

## Source material

- [`docs/PRD_Unified_Smart_Home_Energy_Experience.pdf`](docs/PRD_Unified_Smart_Home_Energy_Experience.pdf) — product requirements
- [`docs/HomeOne_Mobile_App_Designs.html`](docs/HomeOne_Mobile_App_Designs.html) — the six screen designs (open in a browser)

## Run it

```bash
npm install
npx expo start          # scan the QR code with Expo Go (iOS / Android)
npm run web             # or open in a browser
```

Build a static web version (for example, to host on Netlify, Vercel or S3):

```bash
npm run build:web       # outputs to dist/ — serve it as a single-page app
```

## Screens

| Screen | Route | Source |
| --- | --- | --- |
| Welcome | `/` | Design 01 |
| Home dashboard | `/home` | Design 02 · FR-1, FR-2, FR-3 |
| Air conditioner | `/device/ac` | Design 03 · FR-10, FR-13 |
| Energy insights | `/energy` | Design 04 · FR-8, FR-9, FR-16 |
| Scenes & automations | `/scenes` | Design 05 · FR-5, FR-6, FR-7 |
| Notifications | `/alerts` | Design 06 · FR-17, FR-20 |
| Room detail | `/room/[id]` | Added in the same visual language · FR-2 |
| Peak plan | `/plan` | Added · journey 4, FR-9 |
| Automation builder | `/rule-builder` | Added · FR-6 |
| Add devices / Commission a home | `/add-device` | Added · FR-4, journey 9 |
| Profile | `/profile` | Added · FR-15, FR-18, privacy & accessibility |

## What's interactive

- Running a scene (Home chips or Scenes grid) changes lights, shades and climate across rooms, and
  shows a confirmation with estimated savings and **Undo**.
- AC power, mode, set-point dial, fan, timer, auto-eco and the comfort-vs-savings slider. The Home
  living-room card reflects them.
- **Undo** and **Why?** on automated actions (shades), as the PRD's safety requirement asks.
- The peak-tariff card lets you open the plan (each step can be toggled), skip it for today, or override it.
- Energy period switcher (Day/Week/Month) redraws the usage-vs-baseline chart; tariff and monthly-report sheets.
- Suggested automation → **Add automation**; the no-code builder with templates; automation toggles.
- Notification filters, Snooze and inline actions; the urgent count drives the badge on the tab bar.
- Add-device discovery simulation and an installer handover flow (from "Commission a home" on Welcome).
- Profile → Simple mode enlarges text across the app.

## Project layout

```
src/
  app/            Expo Router routes (each file is a screen)
    (tabs)/       Home, Scenes, Energy, Alerts, Profile + custom pill tab bar
  components/     UI primitives (Txt, Card, Toggle, Segmented…), Icon set, Sheet, Toast
  state/          Mock data and the shared HomeContext
  theme/          Colours and typography tokens taken from the design
```
