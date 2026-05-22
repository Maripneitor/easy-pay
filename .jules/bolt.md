## 2024-05-22 - Safely access window in React Native Expo Go
**Learning:** In React Native Expo Go environments, `window` might be defined as `global`, but `window.location` is `undefined`. Directly checking `typeof window !== 'undefined'` and accessing `window.location.hostname` will lead to a runtime crash.
**Action:** Use optional chaining or proper type checks like `(globalThis as any).window?.location?.hostname` to ensure safe access to browser-specific properties while sharing code between web and mobile Expo environments.
