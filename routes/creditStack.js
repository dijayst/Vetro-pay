import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import Header from "../resource/Header";
import Credit from "../screens/credit/Credit";
import CreditHistoryMain from "../screens/credit/CreditHistoryMain";
import RequestCredit from "../screens/credit/RequestCredit";

const screens = {
  Credit: {
    screen: Credit,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={navigation} title="Vetro Credit" />,
        headerStyle: { backgroundColor: "#266ddc" },
      };
    },
  },
  CreditHistoryMain: {
    screen: CreditHistoryMain,
    navigationOptions: ({ navigation }) => {
      return {
        title: "Vetro Credit",
        headerStyle: { backgroundColor: "#266ddc" },
        headerTitleStyle: { color: "#fff", fontWeight: "700" },
        headerTintColor: "#fff",
      };
    },
  },
  RequestCredit: {
    screen: RequestCredit,
    navigationOptions: ({ navigation }) => {
      return {
        title: "Request Credit",
        headerStyle: { backgroundColor: "#266ddc" },
        headerTitleStyle: { color: "#fff", fontWeight: "700" },
        headerTintColor: "#fff",
      };
    },
  },
};

const CreditStack = createStackNavigator(screens);

export default CreditStack;
