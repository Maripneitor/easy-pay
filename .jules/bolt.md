
## 2026-06-09 - [Expo Web Build NativeWind CSS Error]
**Learning:** Expo web builds can sometimes fail when Metro cannot find dynamically generated NativeWind cache files (e.g. `node_modules/.cache/nativewind/global.css`).
**Action:** Before running `npx expo export -p web`, ensure the cache directory and file exist by running `mkdir -p node_modules/.cache/nativewind && touch node_modules/.cache/nativewind/global.css`.

## 2026-06-09 - [React.memo and Referential Equality in Maps]
**Learning:** Extracting list items to `React.memo` components is only effective if the props passed to them maintain referential equality. Passing inline arrow functions directly in a `.map()` block defeats the memoization.
**Action:** When extracting components from a `.map()`, also extract any event handlers passed as props and wrap them in `useCallback` at the parent level, or manage state directly inside the child component if appropriate.
