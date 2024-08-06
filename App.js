import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import React from "react";
import { Provider } from "react-redux";
import store from "./containers/store/store";
import { NativeBaseProvider } from "native-base";
import Approot from "./AppRoot";

export default function App() {
  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <Approot />
      </NativeBaseProvider>
    </Provider>
  );
}