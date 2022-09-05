import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Notifications from "../screens/notification/Notifications";
import NotificationMessage from "../screens/notification/NotificationMessage";

const Stack = createStackNavigator();

export default function NotificationStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false
      }}
    >
      <Stack.Screen
        name="NotificationsHome"
        options={{
          title: "Notifications",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={Notifications}
      />
      <Stack.Screen
        name="NotificationMessage"
        options={{
          title: "Message",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={NotificationMessage}
      />
    </Stack.Navigator>
  );
}
