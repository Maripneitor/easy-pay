## 2026-05-08 - [React Native Dependencies]
**Learning:** React native modules (`react-native-reanimated`, `react-native-safe-area-context`, `react-native-screens`) should be strictly pinned. Floating versions (`^`) lead to version mismatch during installation that breaks the repo completely.
**Action:** Always strictly pin exact versions for Expo native packages and run `npm install --legacy-peer-deps`.
