import React from "react";
import { createStackNavigator, TransitionPresets } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Header from "../resource/Header";

import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";

const screens = {
  Login: {
    screen: Login,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={navigation} title="Login" />,
        headerShown: false,
      };
    },
  },

  Register: {
    screen: Register,
    navigationOptions: ({ navigation }) => {
      return {
        ...TransitionPresets.SlideFromRightIOS,
        gestureDirection: "horizontal-inverted",
        headerTitle: () => <Header navigation={navigation} title="Register" />,
        headerShown: false,
      };
    },
  },
};

export default createAppContainer(createStackNavigator(screens));
