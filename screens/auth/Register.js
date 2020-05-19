import React, { useState } from "react";
import { Dimensions, ImageBackground, View, Text, StyleSheet, Image, TextInput, ScrollView, KeyboardAvoidingView } from "react-native";
import { Picker } from "react-native";
import Constants from "expo-constants";
import AppText from "../../resource/AppText";
import { AppButton } from "../../resource/AppButton";
import { AntDesign } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Logo = require("../../assets/vlogo.png");
const DoneIcon = require("../../assets/done.png");
const BackgroundImage = require("../../assets/backnet.jpg");

export default function Register({ navigation }) {
  const [stage, setStage] = useState(1);
  const [upperContentHeight, SetUpperContentHeight] = useState(0);

  const updateUpperContentHeight = (event) => {
    SetUpperContentHeight(event.nativeEvent.layout.height);
  };

  const nextStage = () => {
    setStage(stage + 1);
  };

  const registrationProcess = () => {
    switch (stage) {
      case 1:
        return (
          <View style={styles.container}>
            <View style={styles.innerContainer}>
              <View onLayout={updateUpperContentHeight}>
                <View style={styles.logo}>
                  <Image source={Logo} style={{ marginTop: 10, height: 40, width: 100 }} />
                  <AppText bold="true" styles={{ fontSize: 30, color: "#FFFFFF", textTransform: "uppercase" }}>
                    VetroPay
                  </AppText>
                </View>
                {/** Welcome Text */}
                <View style={styles.welcomeText}>
                  <AppText bold="true" styles={{ fontSize: 20, color: "#FFFFFF" }}>
                    Hey,
                  </AppText>
                  <AppText styles={{ fontSize: 14, color: "#FFFFFF", marginTop: 8 }}>
                    <Text style={{ fontWeight: "700" }}>Sign up here to continue</Text>
                  </AppText>
                </View>
              </View>

              <KeyboardAvoidingView behavior="height" enabled keyboardVerticalOffset={250}>
                <ScrollView
                  style={{
                    ...styles.formContainer,
                    height: Dimensions.get("window").height - upperContentHeight - (Constants.statusBarHeight + 56) + 10 /** +10 == Margin Bottom Set */,
                  }}
                >
                  <View style={{ marginTop: 15, marginLeft: 24, marginRight: 24 }}>
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
                    <TextInput style={{ ...styles.textInput, marginTop: 20 }} placeholder="Full Name" placeholderTextColor="#000000" />

                    <TextInput style={{ ...styles.textInput, marginTop: 20 }} placeholder="Phone Number" placeholderTextColor="#000000" />
                    <TextInput style={{ ...styles.textInput, marginTop: 20 }} placeholder="Password" placeholderTextColor="#000000" textContentType="password" secureTextEntry />

                    <TextInput
                      style={{ ...styles.textInput, marginTop: 20 }}
                      placeholder="Confirm Password"
                      placeholderTextColor="#000000"
                      textContentType="password"
                      secureTextEntry
                    />

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
                      onPress={() => nextStage()}
                    >
                      <AppText bold="true" styles={{ color: "#FFFFFF", fontSize: 18 }}>
                        Sign Up
                      </AppText>
                    </AppButton>

                    <AppText styles={{ marginTop: 30, marginBottom: 10, fontSize: 16, textAlign: "center" }}>
                      <Text style={{ fontWeight: "500" }}>
                        Already a user?{" "}
                        <Text onPress={() => navigation.navigate("Login")} style={{ color: "#266DDC", fontWeight: "bold" }}>
                          Log In
                        </Text>
                      </Text>
                    </AppText>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.container}>
            <View style={styles.innerContainer}>
              <View onLayout={updateUpperContentHeight}>
                <View style={styles.logo}>
                  <Image source={Logo} style={{ marginTop: 10, height: 40, width: 100 }} />
                  <AppText bold="true" styles={{ fontSize: 30, color: "#FFFFFF", textTransform: "uppercase" }}>
                    VetroPay
                  </AppText>
                </View>
                {/** Welcome Text */}
                <View style={styles.welcomeText}>
                  <AppText bold="true" styles={{ fontSize: 20, color: "#FFFFFF" }}>
                    Authentication
                  </AppText>
                  <AppText styles={{ fontSize: 14, color: "#FFFFFF", marginTop: 8 }}>
                    <Text style={{ fontWeight: "700" }}>Enter authentication code sent to your Phone</Text>
                  </AppText>
                </View>
              </View>
              <KeyboardAvoidingView behavior="height" enabled keyboardVerticalOffset={250}>
                <ScrollView
                  style={{
                    ...styles.formContainer,
                    height: Dimensions.get("window").height - upperContentHeight - (Constants.statusBarHeight + 56) + 10 /** +10 == Margin Bottom Set */,
                  }}
                >
                  <View style={{ marginTop: 15, marginLeft: 24, marginRight: 24 }}>
                    <TextInput style={styles.textInput} placeholder="Authentication Code" placeholderTextColor="#000000" />

                    <AppButton
                      styles={{
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 64,
                        backgroundColor: "#266DDC",
                        borderWidth: 1,
                        borderColor: "#266ddc",
                        height: 44,
                        borderRadius: 8,
                        elevation: 4,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => nextStage()}
                    >
                      <AppText bold="true" styles={{ color: "#FFFFFF", fontSize: 18 }}>
                        Continue
                      </AppText>{" "}
                      <AntDesign color="#FFFFFF" name="arrowright" size={16} />
                    </AppButton>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.container}>
            <View style={styles.innerContainer}>
              <View onLayout={updateUpperContentHeight}>
                <View style={styles.logo}>
                  <Image source={Logo} style={{ marginTop: 10, height: 40, width: 100 }} />
                  <AppText bold="true" styles={{ fontSize: 30, color: "#FFFFFF", textTransform: "uppercase" }}>
                    VetroPay
                  </AppText>
                </View>
                {/** Welcome Text */}
                <View style={styles.welcomeText}>
                  <AppText bold="true" styles={{ fontSize: 20, color: "#FFFFFF" }}>
                    Transaction Pin
                  </AppText>
                  <AppText styles={{ fontSize: 14, color: "#FFFFFF", marginTop: 8 }}>
                    <Text style={{ fontWeight: "700" }}>Set your transaction pin</Text>
                  </AppText>
                </View>
              </View>
              <KeyboardAvoidingView behavior="height" enabled keyboardVerticalOffset={250}>
                <ScrollView
                  style={{
                    ...styles.formContainer,
                    height: Dimensions.get("window").height - upperContentHeight - (Constants.statusBarHeight + 56) + 10 /** +10 == Margin Bottom Set */,
                  }}
                >
                  <View style={{ marginTop: 15, marginLeft: 24, marginRight: 24 }}>
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
                        <Picker.Item label="--- Select Security Question ---" value="" />
                        <Picker.Item label="Gift/Shopping" value="gift" />
                        <Picker.Item label="School Fees" value="schoolFees" />
                        <Picker.Item label="Airtime/Internet/Cable Bill" value="aic" />
                        <Picker.Item label="Electricity/Water/Gas/Fuel" value="aic" />
                        <Picker.Item label="Transport/Food" value="aic" />
                        <Picker.Item label="Business/Official" value="aic" />
                        <Picker.Item label="Donations/Tithes/Offerings" value="aic" />
                        <Picker.Item label="Personal/Others" value="aic" />
                      </Picker>
                    </View>

                    <TextInput style={{ ...styles.textInput, marginTop: 20 }} placeholder="Enter Security Answer" placeholderTextColor="#000000" />
                    <TextInput style={{ ...styles.textInput, marginTop: 20 }} placeholder="Set Transaction Pin" placeholderTextColor="#000000" />
                    <TextInput style={{ ...styles.textInput, marginTop: 20 }} placeholder="Confirm Transaction Pin" placeholderTextColor="#000000" />

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
                      onPress={() => nextStage()}
                    >
                      <AppText bold="true" styles={{ color: "#FFFFFF", fontSize: 18 }}>
                        Complete
                      </AppText>
                    </AppButton>

                    <AppText styles={{ marginTop: 30, marginBottom: 10, fontSize: 16, textAlign: "center" }}>
                      <Text style={{ fontWeight: "700", color: "#266DDC" }}>What is transaction pin?</Text>
                    </AppText>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.container}>
            <View style={styles.innerContainer}>
              <View onLayout={updateUpperContentHeight}>
                <View style={styles.logo}>
                  <Image source={Logo} style={{ marginTop: 10, height: 40, width: 100 }} />
                  <AppText bold="true" styles={{ fontSize: 30, color: "#FFFFFF", textTransform: "uppercase" }}>
                    VetroPay
                  </AppText>
                </View>
                {/** Welcome Text */}
                <View style={styles.welcomeText}>
                  <AppText bold="true" styles={{ fontSize: 20, color: "#FFFFFF" }}>
                    Account Created
                  </AppText>
                  <AppText styles={{ fontSize: 14, color: "#FFFFFF", marginTop: 8 }}>
                    <Text style={{ fontWeight: "700" }}>Your account has been created</Text>
                  </AppText>
                </View>
              </View>

              <ScrollView
                style={{
                  ...styles.formContainer,
                  height: Dimensions.get("window").height - upperContentHeight - (Constants.statusBarHeight + 56) + 10 /** +10 == Margin Bottom Set */,
                }}
              >
                <View style={{ marginTop: 15, marginLeft: 24, marginRight: 24 }}>
                  <Image source={DoneIcon} style={{ marginTop: 40, justifyContent: "center", alignSelf: "center" }} />
                  <AppText bold="true" styles={{ fontSize: 16, color: "rgba(0, 0, 0, 0.8)", marginTop: 40, textAlign: "center" }}>
                    Congratulations!
                  </AppText>
                  <AppText styles={{ fontSize: 14, color: "rgba(0, 0, 0, 0.8)", marginTop: 16, textAlign: "center" }}>
                    <Text style={{ fontWeight: "700" }}>Congratulations your account has been created and your transaction pin has been successfully set.</Text>
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
                    onPress={() => navigation.navigate("Login")}
                  >
                    <AppText bold="true" styles={{ color: "#FFFFFF", fontSize: 18 }}>
                      Go to Login
                    </AppText>
                  </AppButton>
                </View>
              </ScrollView>
            </View>
          </View>
        );
    }
  };
  return (
    <ImageBackground source={BackgroundImage} style={{ flex: 1 }} imageStyle={{ resizeMode: "cover" }}>
      {registrationProcess()}
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
