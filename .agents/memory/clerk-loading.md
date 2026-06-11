---
name: Clerk blank screen on launch
description: ClerkLoaded renders nothing while Clerk initializes, causing a blank screen on cold start
---

`<ClerkLoaded>` only renders children after Clerk session is fully loaded. On a cold start (first install, or slow network), this takes 1-3 seconds. During this time the app shows a blank screen (black after splash hides).

**The fix:** Add `<ClerkLoading>` before `<ClerkLoaded>` with an ActivityIndicator:
```jsx
<ClerkLoading>
  <View style={{ flex: 1, backgroundColor: "#0A0714", alignItems: "center", justifyContent: "center" }}>
    <ActivityIndicator size="large" color="#8B5CF6" />
  </View>
</ClerkLoading>
<ClerkLoaded>
  {/* app content */}
</ClerkLoaded>
```

Import: `ClerkLoading` from `@clerk/expo` (alongside ClerkLoaded).
