import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import Navigator from "./routes/drawer";
import AuthNavigator from "./routes/authStack";
import { AppLoading } from "expo";
import * as Font from "expo-font";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      fontsLoaded: false,
      isAuth: false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Quicksand: require("./assets/fonts/Quicksand-Regular.ttf"),
      QuicksandBold: require("./assets/fonts/Quicksand-Bold.ttf"),
    });
    this.setState({ fontsLoaded: true });
  }
  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    }
    return (
      <View style={styles.container}>
        {this.state.isAuth && <Navigator />}
        {!this.state.isAuth && <AuthNavigator />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
