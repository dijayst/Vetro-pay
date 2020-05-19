import React from "react";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createAppContainer } from "react-navigation";
import MainStack from "./mainStack";
import VisualizerStack from "./financeVisualizerStack";
import BillPayment from "../screens/BillPayment";
import Support from "../screens/Support";
import Settings from "../screens/Settings";
import Logout from "../screens/Logout";
import { Feather } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";

const RootDrawerNavigation = createDrawerNavigator({
  Home: {
    screen: MainStack,
    navigationOptions: {
      drawerIcon: <Feather name="home" size={15} />,
    },
  },
  FinanceVisualizer: {
    screen: VisualizerStack,
    navigationOptions: {
      title: "Finance Visualizer",
      drawerIcon: <SimpleLineIcons name="graph" size={15} />,
    },
  },
  BillPayment: {
    screen: BillPayment,
    navigationOptions: {
      title: "Pay Bills",
      drawerIcon: <Feather name="send" size={15} />,
    },
  },
  Transfer: {
    screen: BillPayment,
    navigationOptions: {
      drawerIcon: <Feather name="send" size={15} />,
    },
  },
  Settings: {
    screen: Settings,
    navigationOptions: {
      drawerIcon: <Feather name="settings" size={15} />,
    },
  },
  Support: {
    screen: Support,
    navigationOptions: {
      drawerIcon: <Feather name="info" size={15} />,
    },
  },
  Logout: {
    screen: Logout,
    navigationOptions: {
      drawerIcon: <Feather name="log-out" size={15} />,
    },
  },
});

export default createAppContainer(RootDrawerNavigation);
