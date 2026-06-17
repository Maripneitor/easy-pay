## 2024-06-17 - React Native List Optimization
**Learning:** Using map() inside ScrollView for long lists causes severe performance issues in React Native, leading to dropped frames and high memory usage.
**Action:** Always replace ScrollView + map() with FlatList or FlashList for rendering lists of items, especially dynamic or potentially long lists like groups, notifications, or history items.
