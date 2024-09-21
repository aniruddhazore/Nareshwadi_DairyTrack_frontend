import { Stack } from "expo-router";
// import { ScreenStackHeaderLeftView } from "react-native-screens";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerTitle: "Reports"  }} />
    </Stack>
  );
}