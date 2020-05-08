import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import FinanceVisualizer from "../screens/FinanceVisualizer";
import Header from "../resource/Header";

const screens = {
  FinanceVisualizer: {
    screen: FinanceVisualizer,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={navigation} title="Visualizer" />,
        headerStyle: { backgroundColor: "#266ddc" }
      };
    }
  }
};

const VisualizerStack = createStackNavigator(screens);

export default VisualizerStack;
