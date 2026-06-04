## 2024-06-04 - [Expo Cross-Platform Crash]
**Learning:** Expo cross-platform context crashes occur when `window` is defined as `global` in React Native but `window.location` is undefined. Using `typeof window !== 'undefined'` is not enough to prevent crashes on native platforms.
**Action:** Use `(globalThis as any).window?.location?.hostname` to safely access `window.location.hostname` across web and native without throwing errors.
