import React, { lazy, Suspense } from "react";
import { View } from "react-native";
import AppText from "../resource/AppText";
import { createStackNavigator } from "react-navigation-stack";
import Header from "../resource/Header";
import Settings from "../screens/settings/Settings";
import Help from "../screens/settings/Help";
import Account from "../screens/settings/Account";
import QRcode from "../screens/settings/QRcode";
import Kyc from "../screens/settings/Kyc";
import Email from "../screens/settings/Email";
import ChangePasswordPin from "../screens/settings/ChangePasswordPin";
import ChangePassword from "../screens/settings/ChangePassword";
import ChangePin from "../screens/settings/ChangePin";
const BusinessLink = lazy(() => import("../screens/settings/BusinessLink"));

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
  Help: {
    screen: Help,
    navigationOptions: ({ navigation }) => {
      return {
        title: "Help",
        headerStyle: { backgroundColor: "#266ddc" },
        headerTitleStyle: { color: "#fff", fontWeight: "700" },
        headerTintColor: "#fff",
      };
    },
  },
  Account: {
    screen: Account,
    navigationOptions: ({ navigation }) => {
      return {
        title: "Account",
        headerStyle: { backgroundColor: "#266ddc" },
        headerTitleStyle: { color: "#fff", fontWeight: "700" },
        headerTintColor: "#fff",
      };
    },
  },
  QRcode: {
    screen: QRcode,
    navigationOptions: ({ navigation }) => {
      return {
        title: "QRcode",
        headerStyle: { backgroundColor: "#266ddc" },
        headerTitleStyle: { color: "#fff", fontWeight: "700" },
        headerTintColor: "#fff",
      };
    },
  },
  Kyc: {
    screen: Kyc,
    navigationOptions: ({ navigation }) => {
      return {
        title: "KYC",
        headerStyle: { backgroundColor: "#266ddc" },
        headerTitleStyle: { color: "#fff", fontWeight: "700" },
        headerTintColor: "#fff",
      };
    },
  },

  Email: {
    screen: Email,
    navigationOptions: ({ navigation }) => {
      return {
        title: "Email",
        headerStyle: { backgroundColor: "#266ddc" },
        headerTitleStyle: { color: "#fff", fontWeight: "700" },
        headerTintColor: "#fff",
      };
    },
  },
  ChangePasswordPin: {
    screen: ChangePasswordPin,
    navigationOptions: ({ navigation }) => {
      return {
        title: "Change Password/Pin",
        headerStyle: { backgroundColor: "#266ddc" },
        headerTitleStyle: { color: "#fff", fontWeight: "700" },
        headerTintColor: "#fff",
      };
    },
  },
  ChangePassword: {
    screen: ChangePassword,
    navigationOptions: ({ navigation }) => {
      return {
        title: "Change Password",
        headerStyle: { backgroundColor: "#266ddc" },
        headerTitleStyle: { color: "#fff", fontWeight: "700" },
        headerTintColor: "#fff",
      };
    },
  },
  ChangePin: {
    screen: ChangePin,
    navigationOptions: ({ navigation }) => {
      return {
        title: "Change Pin",
        headerStyle: { backgroundColor: "#266ddc" },
        headerTitleStyle: { color: "#fff", fontWeight: "700" },
        headerTintColor: "#fff",
      };
    },
  },
  BusinessLink: {
    screen: () => {
      return (
        <View>
          <Suspense
            fallback={
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: "50%" }}>
                <AppText styles={{ fontSize: 18 }}>Loading...</AppText>
              </View>
            }
          >
            <BusinessLink />
          </Suspense>
        </View>
      );
    },
    navigationOptions: ({ navigation }) => {
      return {
        title: "Link Business",
        headerStyle: { backgroundColor: "#266ddc" },
        headerTitleStyle: { color: "#fff", fontWeight: "700" },
        headerTintColor: "#fff",
      };
    },
  },
};

const SettingsStack = createStackNavigator(screens);

export default SettingsStack;
