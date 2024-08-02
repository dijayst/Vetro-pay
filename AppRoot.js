import React, { useState, useEffect, useRef, Fragment } from "react";
import { StyleSheet, View, Platform, AppState } from "react-native";
import Navigator from "./routes/main";
import AuthNavigator from "./routes/auth";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useSelector, useDispatch } from "react-redux";
import { loadUser, logout } from "./containers/authentication/action";
import { useToast, Box, Text as NativeBaseText } from "native-base";
import * as SecureStore from "expo-secure-store";
import { usePrevious } from "./resources/utils";
import { toastColorObject } from "./resources/rStyledComponent";
import { SafeAreaView } from "react-native-safe-area-context";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function AppRoot() {
  const toast = useToast();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.authentication);
  const prevAuth = usePrevious(auth);
  const error = useSelector((state) => state.errors);
  const prevError = usePrevious(error);
  const message = useSelector((state) => state.messages);
  const prevMessage = usePrevious(message);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [storedFirstName, setStoredFirstName] = useState("");
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    Font.loadAsync({
      Quicksand: require("./assets/fonts/Quicksand-Regular.ttf"),
      QuicksandBold: require("./assets/fonts/Quicksand-Bold.ttf"),
    }).then(() => setFontsLoaded(true));

    //Get user details is on mobile device
    if (Platform.OS == "android") {
      SecureStore.getItemAsync("firstName", SecureStore.WHEN_UNLOCKED).then(
        (data) => setStoredFirstName(data)
      );
    } else {
      SecureStore.getItemAsync("firstName").then((data) =>
        setStoredFirstName(data)
      );
    }
    dispatch(loadUser());

    async function splashScreenDismiss() {
      await SplashScreen.hideAsync();
    }
    splashScreenDismiss();
  }, []);

  useEffect(() => {
    if (auth.isAuthenticated && auth.token !== null) {
      if (storedFirstName == null) {
        // Store User detail if not available
        if (Platform.OS == "android") {
          SecureStore.setItemAsync(
            "firstName",
            auth.user.fullname.split(" ")[0],
            SecureStore.WHEN_UNLOCKED
          );
          SecureStore.setItemAsync(
            "phoneNumber",
            auth.user.phone_number,
            SecureStore.WHEN_UNLOCKED
          );
        } else {
          SecureStore.setItemAsync(
            "firstName",
            auth.user.fullname.split(" ")[0]
          );
          SecureStore.setItemAsync("phoneNumber", auth.user.phone_number);
        }
      }
    }

    if (error && error.dateTime !== prevError?.dateTime) {
      if (error.msg.phone_number) {
        toast.show({
          render: () => (
            <Box
              bg={toastColorObject["danger"]}
              px="2"
              py="2"
              rounded="sm"
              mb={5}
            >
              <NativeBaseText
                style={{ color: "#FFFFFF" }}
              >{`Phone Number: ${error.msg.phone_number.join()}`}</NativeBaseText>
            </Box>
          ),
        });
      }
      if (error.msg.password) {
        toast.show({
          render: () => (
            <Box
              bg={toastColorObject["danger"]}
              px="2"
              py="2"
              rounded="sm"
              mb={5}
            >
              <NativeBaseText
                style={{ color: "#FFFFFF" }}
              >{`Password: ${error.msg.password.join()}`}</NativeBaseText>
            </Box>
          ),
        });
      }

      if (error.msg.non_field_errors) {
        toast.show({
          render: () => (
            <Box
              bg={toastColorObject["danger"]}
              px="2"
              py="2"
              rounded="sm"
              mb={5}
            >
              <NativeBaseText style={{ color: "#FFFFFF" }}>
                {error.msg.non_field_errors.join()}
              </NativeBaseText>
            </Box>
          ),
        });
      }

      if (error.msg.status == "failed") {
        toast.show({
          render: () => (
            <Box
              bg={toastColorObject["danger"]}
              px="2"
              py="2"
              rounded="sm"
              mb={5}
            >
              <NativeBaseText style={{ color: "#FFFFFF" }}>
                {error.msg.message}
              </NativeBaseText>
            </Box>
          ),
        });
      }

      if (error.msg.detail) {
        //Authentication credentials were not provided.
        toast.show({
          render: () => (
            <Box
              bg={toastColorObject["default"]}
              px="2"
              py="2"
              rounded="sm"
              mb={5}
            >
              <NativeBaseText style={{ color: "#FFFFFF" }}>
                User not signed in
              </NativeBaseText>
            </Box>
          ),
        });
      }
    }
  }, [error, auth]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          //App has come to the foreground
          let appStateLastActive;
          if (Platform.OS == "android") {
            await SecureStore.getItemAsync(
              "lastActive",
              SecureStore.WHEN_UNLOCKED
            ).then((data) => {
              appStateLastActive = data;
            });
          } else {
            await SecureStore.getItemAsync("lastActive").then((data) => {
              appStateLastActive = data;
            });
          }

          if (
            new Date() - (new Date(appStateLastActive) || new Date()) >
            60000
          ) {
            dispatch(logout());
          }
        }

        if (appState.current.match(/inactive|background/)) {
          if (Platform.OS == "android") {
            await SecureStore.setItemAsync(
              "lastActive",
              new Date().toString(),
              SecureStore.WHEN_UNLOCKED
            );
          } else {
            await SecureStore.setItemAsync("lastActive", new Date().toString());
          }
        }

        appState.current = nextAppState;
        //console.log("AppState", appState.current);
      }
    );

    return () => {
      subscription.remove();
    };
  }, [appState]);

  return (
    <Fragment>
      <View style={styles.container}>
        <SafeAreaView />
        {auth.isAuthenticated && <Navigator />}
        {!auth.isAuthenticated && <AuthNavigator />}
        <StatusBar
          style="light"
          translucent={true}
          backgroundColor="#00000066"
        />
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
