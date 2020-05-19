import React from "react";
import { View, Text, StyleSheet, Image, TextInput, Picker, ImageBackground } from "react-native";
import Constants from "expo-constants";
import AppText from "../../resource/AppText";
import { AppButton } from "../../resource/AppButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Logo = require("../../assets/vlogo.png");
const BackgroundImage = require("../../assets/backnet.jpg");

export default function Login({ navigation }) {
  return (
    <ImageBackground source={BackgroundImage} style={{ flex: 1 }} imageStyle={{ resizeMode: "cover" }}>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.logo}>
            <Image source={Logo} style={{ marginTop: 10, height: 40, width: 100 }} />
            <AppText bold="true" styles={{ fontSize: 30, color: "#FFFFFF", textTransform: "uppercase" }}>
              VetroPay
            </AppText>
          </View>
          {/** Welcome Text */}
          <View style={styles.welcomeText}>
            <AppText bold="true" styles={{ fontSize: 20, color: "#FFFFFF" }}>
              Welcome,
            </AppText>
            <AppText styles={{ fontSize: 14, color: "#FFFFFF", marginTop: 8 }}>
              <Text style={{ fontWeight: "700" }}>Login to your Account</Text>
            </AppText>
          </View>
          <View style={styles.formContainer}>
            <KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={10} enableOnAndroid={true} extraHeight={Platform.select({ android: 150 })} style={{ flexGrow: 1 }}>
              <View style={{ marginTop: 32, marginLeft: 24, marginRight: 24 }}>
                <View
                  style={{
                    marginTop: 10,
                    borderWidth: 0.5,
                    borderColor: "#266ddc",
                    borderColor: "transparent",
                    borderBottomColor: "#266DDC",
                  }}
                >
                  <Picker style={{ height: 40 }}>
                    <Picker.Item label="🇳🇬  Nigeria" value="Nigeria" />
                    <Picker.Item label="🇰🇪  Kenya" value="Kenya" />
                  </Picker>
                </View>
                <TextInput style={{ ...styles.textInput, marginTop: 20 }} placeholder="Phone Number" placeholderTextColor="#000000" />
                <TextInput style={{ ...styles.textInput, marginTop: 20 }} placeholder="Password" placeholderTextColor="#000000" />
                <AppText bold="true" styles={{ marginTop: 16, color: "#266DDC", fontSize: 16, textAlign: "right" }}>
                  Forgot Password?
                </AppText>

                <AppButton
                  styles={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 40,
                    backgroundColor: "#266DDC",
                    borderWidth: 1,
                    borderColor: "#266ddc",
                    height: 44,
                    borderRadius: 8,
                    elevation: 4,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AppText bold="true" styles={{ color: "#FFFFFF", fontSize: 18 }}>
                    Log In
                  </AppText>
                </AppButton>

                <AppText styles={{ marginTop: 40, fontSize: 16, textAlign: "center" }}>
                  <Text style={{ fontWeight: "500" }}>
                    Not a user?{" "}
                    <Text onPress={() => navigation.navigate("Register")} style={{ color: "#266DDC", fontWeight: "bold" }}>
                      Sign up here
                    </Text>
                  </Text>
                </AppText>
              </View>
            </KeyboardAwareScrollView>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(38, 109, 220, 0.6)",
  },
  innerContainer: {
    marginTop: Constants.statusBarHeight + 56, //56 == Navigation Header Height
  },
  logo: {
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    marginTop: 24,
    marginLeft: 24,
  },
  formContainer: {
    marginTop: 23,
    backgroundColor: "#FFFFFF",
    height: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  textInput: {
    height: 40,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 0.5,
    borderColor: "transparent",
    borderBottomColor: "#266DDC",
  },
});
