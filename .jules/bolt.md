## 2026-06-02 - List Performance Optimizations in React Native
**Learning:** Using `<FlatList scrollEnabled={false}>` inside an existing `<ScrollView>` is an anti-pattern that defeats the purpose of virtualization because all list items will render immediately anyway.
**Action:** If refactoring the entire outer `<ScrollView>` to a `<FlatList>` with `ListHeaderComponent` is too invasive, it is better and more correct to optimize the `.map()` loop inside the `<ScrollView>` by extracting the list items into dedicated `React.memo()` components to prevent unnecessary re-renders of the list items.
