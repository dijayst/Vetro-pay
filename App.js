import React, { Component } from "react";
import { Provider } from "react-redux";
import store from "./containers/store/store";
import AppRoot from "./AppRoot";

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppRoot />
      </Provider>
    );
  }
}
