import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import Transfer from "../screens/transfer/Transfer";
import Header from "../resource/Header";
import SendMoney from "../screens/transfer/SendMoney";
import Withdraw from "../screens/transfer/Withdraw";
import LinkBank from "../screens/transfer/LinkBank";

const screens = {
  Transfer: {
    screen: Transfer,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={navigation} title="Fund Transfer" />,
        headerStyle: { backgroundColor: "#266ddc" },
      };
    },
  },
  SendMoney: {
    screen: SendMoney,
    navigationOptions: ({ navigation }) => {
      return {
        title: "Fund Transfer",
        headerStyle: { backgroundColor: "#266ddc" },
        headerTitleStyle: { color: "#fff", fontWeight: "700" },
        headerTintColor: "#fff",
      };
    },
  },
  Withdraw: {
    screen: Withdraw,
    navigationOptions: ({ navigation }) => {
      return {
        title: "Fund Transfer",
        headerStyle: { backgroundColor: "#266ddc" },
        headerTitleStyle: { color: "#fff", fontWeight: "700" },
        headerTintColor: "#fff",
      };
    },
  },
  LinkBank: {
    screen: LinkBank,
    navigationOptions: ({ navigation }) => {
      return {
        title: "Fund Transfer",
        headerStyle: { backgroundColor: "#266ddc" },
        headerTitleStyle: { color: "#fff", fontWeight: "700" },
        headerTintColor: "#fff",
      };
    },
  },
};

const TransferFundStack = createStackNavigator(screens);

export default TransferFundStack;
