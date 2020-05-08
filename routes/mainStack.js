import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import Home from "../screens/Home";
import AddRecord from "../screens/AddRecord";

import Header from "../resource/Header";

const screens = {
  Home: {
    screen: Home,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={navigation} title="VetroPay" />,
        headerStyle: { backgroundColor: "#266ddc" }
      };
    }
  },
  AddRecord: {
    screen: AddRecord,
    navigationOptions: ({ navigation }) => {
      return {
        title: "Add Transaction",
        headerStyle: { backgroundColor: "#266ddc" },
        headerTitleStyle: { color: "#fff", fontWeight: "700" },
        headerTintColor: "#fff"
      };
    }
  }
};

const MainStack = createStackNavigator(screens);

export default MainStack;
