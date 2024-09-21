import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="AddCattle" />
      <Stack.Screen name="AddCattle2" />
      <Stack.Screen name="AddCattle3" />
      <Stack.Screen name="ViewData" />
      {/* <Stack.Screen name="Update" /> */}
      <Stack.Screen name="MilkData" />
      <Stack.Screen name="MilkEntry" />
      <Stack.Screen name="batchEntry" />
      <Stack.Screen name="VaccineUpdate" />
      <Stack.Screen name="VaccineUpdateDupe" />
      <Stack.Screen name="VaccinationInfo" />
      <Stack.Screen name="VaccineDewormingTable" />
      <Stack.Screen name="MonthlyVaccinations" />

      <Stack.Screen name="DewormingUpdate" />
      <Stack.Screen name="reGroup" />
      <Stack.Screen name="MilkAlertsScreen" />
      <Stack.Screen name="user" />
    </Stack>
  );
}
