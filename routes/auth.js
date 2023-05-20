import React from "react";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import AuthHome from "../screens/auth/AuthHome";
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";

const Stack = createStackNavigator();

export default function AuthStack() {
  const linking = {
    prefixes: ["vetropay://"],
    config: {
      screens: {
        Login: "transfer/:recipient",
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen
          name="AuthHome"
          options={{
            headerShown: false,
          }}
          component={AuthHome}
        />

        <Stack.Screen
          name="Login"
          options={{
            ...TransitionPresets.SlideFromRightIOS,
            headerShown: false,
            gestureDirection: "horizontal",
          }}
          component={Login}
        />

        <Stack.Screen
          name="Register"
          options={{
            ...TransitionPresets.SlideFromRightIOS,
            headerShown: false,
            gestureDirection: "horizontal",
          }}
          component={Register}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
