import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Settings from "../screens/settings/Settings";
import Help from "../screens/settings/Help";
import Account from "../screens/settings/Account";
import QRcode from "../screens/settings/QRcode";
import Kyc from "../screens/settings/Kyc";
import Email from "../screens/settings/Email";
import ChangePasswordPin from "../screens/settings/ChangePasswordPin";
import ChangePassword from "../screens/settings/ChangePassword";
import ChangePin from "../screens/settings/ChangePin";
import BusinessLink from "../screens/settings/BusinessLink";
import LinkedCards from "../screens/settings/LinkedCards";

const Stack = createStackNavigator();

export default function NotificationStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false
      }}
    >
      <Stack.Screen
        name="SettingsHome"
        options={{
          title: "Settings",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={Settings}
      />

      <Stack.Screen
        name="Help"
        options={{
          title: "Help",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={Help}
      />

      <Stack.Screen
        name="Account"
        options={{
          title: "Account",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={Account}
      />

      <Stack.Screen
        name="QRcode"
        options={{
          title: "QRcode",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={QRcode}
      />

      <Stack.Screen
        name="Kyc"
        options={{
          title: "KYC",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={Kyc}
      />

      <Stack.Screen
        name="Email"
        options={{
          title: "Email",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={Email}
      />

      <Stack.Screen
        name="ChangePasswordPin"
        options={{
          title: "Change Password/Pin",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={ChangePasswordPin}
      />

      <Stack.Screen
        name="ChangePassword"
        options={{
          title: "Change Password",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={ChangePassword}
      />

      <Stack.Screen
        name="ChangePin"
        options={{
          title: "Change Pin",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={ChangePin}
      />

      <Stack.Screen
        name="BusinessLink"
        options={{
          title: "Link Business",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={BusinessLink}
      />

      <Stack.Screen
        name="LinkedCards"
        options={{
          title: "Linked Cards",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={LinkedCards}
      />
    </Stack.Navigator>
  );
}
