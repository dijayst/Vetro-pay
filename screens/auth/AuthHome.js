import React from "react";
import { StyleSheet, Text, View, ImageBackground, TouchableWithoutFeedbackBase, Pressable } from "react-native";
import AppText from "../../resources/AppText";
import { AppButton } from "../../resources/AppButton";
import * as Facebook from "expo-facebook";
import { useAssets } from "expo-asset";
import AppLoading from "expo-app-loading";
//const BackgroundImage = require("../../assets/authHome.png");

export default function AuthHome({ navigation }) {
  Facebook.initializeAsync({ appId: "713268446200988", appName: "VetroPay Mobile", autoLogAppEvents: true });
  const [BackgroundImage, error] = useAssets(require("../../assets/authHome.png"));

  if (BackgroundImage) {
    return (
      <Pressable onPress={() => navigation.navigate("Login")} style={{ flex: 1 }}>
        <ImageBackground source={BackgroundImage} style={{ flex: 1 }} imageStyle={{ resizeMode: "cover" }}>
          <View style={styles.overlay}>
            {/* <View style={{ flex: 1 }}>
            <AppText bold="true" styles={styles.title}>
              {"<<<"} VetroPay {">>>"}
            </AppText>

            <AppText styles={styles.base}>Welcome to Vetro-World</AppText>
          </View>
          <View style={styles.footer}>
            <AppText styles={styles.footerAimText}>...your official payment partner</AppText>
            <View style={{ alignItems: "center" }}>
              <AppButton styles={styles.continueButton} onPress={() => navigation.navigate("Login")}>
                <Text style={styles.buttonText}>Continue</Text>
              </AppButton>
            </View>
          </View> */}
          </View>
        </ImageBackground>
      </Pressable>
    );
  } else {
    return <AppLoading />;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    //backgroundColor: "rgba(0,0,0,0.3)",
  },
  title: {
    color: "white",
    fontSize: 20,
    marginTop: 90,
    paddingHorizontal: 20,
    textAlign: "center",
  },
  base: {
    color: "white",
    alignItems: "flex-end",
    textAlign: "center",
  },
  footer: {
    height: 150,
  },
  footerAimText: {
    marginTop: 20,
    textAlign: "center",
    color: "white",
  },
  continueButton: {
    marginTop: 10,
    backgroundColor: "#266ddc",
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },
});
