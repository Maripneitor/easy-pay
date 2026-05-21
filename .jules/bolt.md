## 2026-05-21 - [Expo React Native Web Context Trap]
**Learning:** Expo Go and Expo Router crashes or compilation issues sometimes occur when trying to access `typeof window !== 'undefined'` due to how the environment interprets React Native. `typeof globalThis` combined with `'window' in globalThis` avoids runtime traps that break `window.location` references.
**Action:** Use `(globalThis as any).window` for safe access if cross-platform environments (like PWA vs Native) behave unpredictably.
