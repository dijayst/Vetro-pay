import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import Transfer from "../screens/transfer/Transfer";
import Header from "../resource/Header";
import SendMoney from "../screens/transfer/SendMoney";
import Withdraw from "../screens/transfer/Withdraw";
import LinkBank from "../screens/transfer/LinkBank";
import ScanPay from "../screens/transfer/ScanPay";
import TransferBusiness from "../screens/transfer/TransferBusiness";
import SendMoneyBusiness from "../screens/transfer/SendMoneyBusiness";

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
  ScanPay: {
    screen: ScanPay,
    navigationOptions: ({ navigation }) => {
      return {
        title: "Scan to Pay",
        headerStyle: { backgroundColor: "#266ddc" },
        headerTitleStyle: { color: "#fff", fontWeight: "700" },
        headerTintColor: "#fff",
      };
    },
  },
  TransferBusiness: {
    screen: TransferBusiness,
    navigationOptions: ({ navigation }) => {
      return {
        title: "Business Transfer",
        headerStyle: { backgroundColor: "#266ddc" },
        headerTitleStyle: { color: "#fff", fontWeight: "700" },
        headerTintColor: "#fff",
      };
    },
  },
  SendMoneyBusiness: {
    screen: SendMoneyBusiness,
    navigationOptions: ({ navigation }) => {
      return {
        title: "Send to Business",
        headerStyle: { backgroundColor: "#266ddc" },
        headerTitleStyle: { color: "#fff", fontWeight: "700" },
        headerTintColor: "#fff",
      };
    },
  },
};

const TransferFundStack = createStackNavigator(screens);

export default TransferFundStack;
