import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import Header from "../resource/Header";
import Settings from "../screens/settings/Settings";

const screens = {
  Settings: {
    screen: Settings,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={navigation} title="Settings" />,
        headerStyle: { backgroundColor: "#266ddc" },
      };
    },
  },
};

const SettingsStack = createStackNavigator(screens);

export default SettingsStack;
