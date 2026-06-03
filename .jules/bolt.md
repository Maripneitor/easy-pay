## 2026-06-03 - [Fix Metro NativeWind Build Error]
**Learning:** Expo SDK 54 / NativeWind 4 sometimes fails to resolve `.web.css` outputs from cache on web builds.
**Action:** When debugging Metro bundler "None of these files exist" for `global.css` cache, investigate `metro.config.cjs` settings for resolver extensions. Ensure `css` is in `sourceExts`.

## 2026-06-03 - [React.memo Optimization Anti-Pattern]
**Learning:** Extracting list components into `React.memo` is only effective if the `onPress` callbacks passed to them have stable references (via `useCallback`). Passing inline arrow functions directly in the `.map` inside JSX will still cause unnecessary re-renders.
**Action:** Always verify that handler functions passed to `React.memo` components are wrapped in `useCallback` or pass raw arguments and use a stable reference from the parent.
