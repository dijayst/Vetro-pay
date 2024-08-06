import React from "react";
import { StyleSheet, Text, View, ImageBackground, Pressable, ActivityIndicator } from "react-native";
import { useAssets } from "expo-asset";
//const BackgroundImage = require("../../assets/authHome.png");

export default function AuthHome({ navigation }) {
  const [BackgroundImage, error] = useAssets(require("../../assets/splash.png"));
  return (
    <>
    {BackgroundImage ? <Pressable onPress={() => navigation.navigate("Slide")} style={{ flex: 1 }}>
      <ImageBackground source={BackgroundImage} style={{ flex: 1 }} imageStyle={{ resizeMode: "cover" }}>
        <View style={styles.overlay}>
        </View>
      </ImageBackground>
    </Pressable>: 
    <View style={{ height: '100%', alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator color={"#266ddc"} size="large" />
    </View>
    }
    </>
  );
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
