import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import FinanceVisualizer from "../screens/visualizer/FinanceVisualizer";
import Header from "../resource/Header";

const screens = {
  FinanceVisualizer: {
    screen: FinanceVisualizer,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={navigation} title="Finance Visualizer" />,
        headerStyle: { backgroundColor: "#266ddc" },
      };
    },
  },
};

const VisualizerStack = createStackNavigator(screens);

export default VisualizerStack;
