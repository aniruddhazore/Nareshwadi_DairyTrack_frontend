import { FontAwesome, AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <FontAwesome5 name="home" size={24} color="black" />
            ) : (
              <AntDesign name="home" size={24} color="black" />
            ),
        }}
      />

<Tabs.Screen
        name="Reports"
        options={{
          // tabBarLabel: "Reports",
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialCommunityIcons name="notebook-check" size={24} color="black" />
            ) : (
              <MaterialCommunityIcons name="notebook-check-outline" size={24} color="black" />
            ),
        }}
      />
    </Tabs>
  );
}