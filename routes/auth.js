import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Onboarding from "../screens/auth/Onboarding";
import AuthHome from "../screens/auth/AuthHome";
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";
import Calculator from "../screens/auth/Calculator";
import Welcome from "../screens/auth/Welcome";
import FXrate from "../screens/auth/FXrate";

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
          name="OnboardingScreen"
          options={{
            headerShown: false,
          }}
          component={Onboarding}
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
          name="Welcome"
          options={{
            ...TransitionPresets.SlideFromRightIOS,
            headerShown: false,
            gestureDirection: "horizontal",
          }}
          component={Welcome}
        />
        
        <Stack.Screen
          name="Calculator"
          options={{
            ...TransitionPresets.SlideFromRightIOS,
            headerShown: false,
            gestureDirection: "horizontal",
          }}
          component={Calculator}
        />


<Stack.Screen
          name="FXrate"
          options={{
            ...TransitionPresets.SlideFromRightIOS,
            headerShown: false,
            gestureDirection: "horizontal",
          }}
          component={FXrate}
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
