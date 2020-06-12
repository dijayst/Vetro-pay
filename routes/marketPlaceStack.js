import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import Header from "../resource/Header";
import WebView from "../screens/marketplace/WebView";

const screens = {
  MarketPlace: {
    screen: WebView,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={navigation} title="Market Place" />,
        headerStyle: { backgroundColor: "#266ddc" },
      };
    },
  },
};

const MarketPlaceStack = createStackNavigator(screens);

export default MarketPlaceStack;
