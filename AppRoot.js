import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import Navigator from "./routes/drawer";
import AuthNavigator from "./routes/authStack";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import { StatusBar } from "expo-status-bar";
import { connect } from "react-redux";

import store from "./containers/store/store";
import { loadUser } from "./containers/authentication/action";
import { Toast, Root } from "native-base";

class AppRoot extends Component {
  constructor() {
    super();
    this.state = {
      fontsLoaded: false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Quicksand: require("./assets/fonts/Quicksand-Regular.ttf"),
      QuicksandBold: require("./assets/fonts/Quicksand-Bold.ttf"),
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
    });
    this.setState({ fontsLoaded: true });

    store.dispatch(loadUser());
  }

  componentDidUpdate(prevProps) {
    const { error, message } = this.props;

    if (error !== prevProps.error) {
      if (error.msg.phone_number) {
        Toast.show({
          text: `Phone Number: ${error.msg.phone_number.join()}`,
          type: "danger",
          duration: 5000,
        });
      }
      if (error.msg.password) {
        Toast.show({
          text: `Password: ${error.msg.password.join()}`,
          type: "danger",
          duration: 5000,
        });
      }

      if (error.msg.non_field_errors) {
        Toast.show({
          text: error.msg.non_field_errors.join(),
          type: "danger",
          duration: 5000,
        });
      }

      if (error.msg.status == "failed") {
        Toast.show({
          text: error.msg.message,
          type: "danger",
          duration: 5000,
        });
      }

      if (error.msg.detail) {
        Toast.show({
          text: "User not signed in", //Authentication credentials were not provided.
          buttonText: "Ok",
          duration: 3000,
        });
      }
    }
  }
  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    }
    return (
      <Root>
        <View style={styles.container}>
          {this.props.auth.isAuthenticated && <Navigator />}
          {!this.props.auth.isAuthenticated && <AuthNavigator />}
          <StatusBar style="light" translucent={true} backgroundColor="#00000066" />
        </View>
      </Root>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.authentication,
  error: state.errors,
  message: state.messages,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default connect(mapStateToProps)(AppRoot);
