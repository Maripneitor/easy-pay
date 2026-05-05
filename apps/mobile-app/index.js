import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import React from 'react';

// Bypassing the automatic EXPO_ROUTER_APP_ROOT which fails in monorepos
// by explicitly providing the context to require.context
export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
