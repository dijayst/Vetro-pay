import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Keyboard, Dimensions, View, Text, StyleSheet, Image, TextInput, Picker, ImageBackground, TouchableWithoutFeedback, ScrollView, KeyboardAvoidingView } from "react-native";
import Constants from "expo-constants";
import AppText from "../../resource/AppText";
import { AppButton } from "../../resource/AppButton";
import { Toast, Spinner } from "native-base";
import { login } from "../../containers/authentication/action";

const Logo = require("../../assets/vlogo.png");
const BackgroundImage = require("../../assets/backnet.jpg");

export default function Login({ navigation }) {
  const [displaySpinner, setDisplaySpinner] = useState(false);
  const [upperContentHeight, SetUpperContentHeight] = useState(0);

  const [loginData, setLoginData] = useState({
    payload: {
      country: "NIGERIA",
      phoneNumber: "",
      password: "",
    },
  });

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const updateUpperContentHeight = (event) => {
    SetUpperContentHeight(event.nativeEvent.layout.height);
  };

  const dispatch = useDispatch();

  const onValueChange = (fieldName, value) => {
    if (fieldName == "phoneNumber") {
      setLoginData((prevState) => ({
        ...prevState,
        payload: {
          ...prevState.payload,
          phoneNumber: value,
        },
      }));
    } else if (fieldName == "password") {
      setLoginData((prevState) => ({
        ...prevState,
        payload: {
          ...prevState.payload,
          password: value,
        },
      }));
    }
  };

  const getMobileNumberCountryCode = (country, mobileNumber) => {
    if (country == "NIGERIA") {
      return "+234" + mobileNumber.substring(1);
    } else if (country == "KENYA") {
      return "+254" + mobileNumber.substring(1);
    }
  };

  const loginUserFunction = () => {
    if (!(loginData.payload.phoneNumber.length >= 7 && 12 > loginData.payload.phoneNumber.length) || loginData.payload.password.length < 8) {
      if (!(loginData.payload.phoneNumber.length >= 7 && 12 > loginData.payload.phoneNumber.length)) {
        Toast.show({
          text: "Invalid Phone number",
          duration: 3000,
          type: "danger",
        });
      } else if (loginData.payload.password.length < 8) {
        Toast.show({
          text: "Incorrect password",
          duration: 3000,
          type: "danger",
        });
      }
    } else {
      setDisplaySpinner(true);
      dispatch(login(getMobileNumberCountryCode(loginData.payload.country, loginData.payload.phoneNumber), loginData.payload.password));
    }
  };

  useEffect(() => {
    setDisplaySpinner(false); // This should be controlled; as loader stops spinning early before loggin user in

    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const forgotPasswordAlert = () => {
    Toast.show({
      text: `Please visit "𝘃𝗲𝘁𝗿𝗼𝗽𝗮𝘆.𝗰𝗼𝗺/𝗰𝘂𝘀𝘁𝗼𝗺𝗲𝗿-𝗰𝗮𝗿𝗲-𝗽𝗼𝗿𝘁𝗮𝗹"  in your browser to reset your password.`,
      duration: 5000,
      type: "success",
    });
  };
  return (
    <ImageBackground source={BackgroundImage} style={{ flex: 1 }} imageStyle={{ resizeMode: "cover" }}>
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
                Welcome,
              </AppText>
              <AppText styles={{ fontSize: 14, color: "#FFFFFF", marginTop: 8 }}>
                <Text style={{ fontWeight: "700" }}>Login to your Account</Text>
              </AppText>
            </View>
          </View>
          <KeyboardAvoidingView extr behavior="height" enabled keyboardVerticalOffset={236}>
            <ScrollView
              style={{
                ...styles.formContainer,
                height: Dimensions.get("window").height - upperContentHeight - (Constants.statusBarHeight + 56) + 20 /** +20 to offset the 'Signup' margin boottom set*/,
              }}
              keyboardShouldPersistTaps="handled"
            >
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
                  <Picker
                    style={{ height: 40 }}
                    onValueChange={(itemValue, itemIndex) => {
                      setLoginData((prevState) => ({
                        ...prevState,
                        payload: {
                          ...prevState.payload,
                          country: itemValue,
                        },
                      }));
                    }}
                    selectedValue={loginData.payload.country}
                  >
                    <Picker.Item label="🇳🇬  Nigeria" value="NIGERIA" />
                    <Picker.Item label="🇰🇪  Kenya" value="KENYA" />
                  </Picker>
                </View>
                <TextInput
                  style={{ ...styles.textInput, marginTop: 20 }}
                  placeholder="Phone Number"
                  placeholderTextColor="#000000"
                  textContentType="telephoneNumber"
                  keyboardType="visible-password"
                  onChangeText={(text) => onValueChange("phoneNumber", text)}
                />
                <TextInput
                  style={{ ...styles.textInput, marginTop: 20 }}
                  placeholder="Password"
                  placeholderTextColor="#000000"
                  textContentType="password"
                  secureTextEntry
                  onChangeText={(text) => onValueChange("password", text)}
                />
                <TouchableWithoutFeedback onPress={() => forgotPasswordAlert()}>
                  <View>
                    <AppText bold="true" styles={{ marginTop: 16, color: "#266DDC", fontSize: 16, textAlign: "right" }}>
                      Forgot Password?
                    </AppText>
                  </View>
                </TouchableWithoutFeedback>

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
                    display: `${!displaySpinner ? "flex" : "none"}`,
                  }}
                  onPress={() => loginUserFunction()}
                >
                  <AppText bold="true" styles={{ color: "#FFFFFF", fontSize: 18 }}>
                    Log In
                  </AppText>
                </AppButton>
                <View style={{ justifyContent: "center", display: `${displaySpinner ? "flex" : "none"}` }}>
                  <Spinner color="blue" />
                </View>

                <AppText styles={{ marginTop: 40, fontSize: 16, textAlign: "center", marginBottom: 20 }}>
                  <Text style={{ fontWeight: "500" }}>
                    Not a user?{" "}
                    <Text
                      onPress={() => {
                        if (isKeyboardVisible) {
                          Keyboard.dismiss();
                        } else {
                          navigation.navigate("Register");
                        }
                      }}
                      style={{ color: "#266DDC", fontWeight: "bold" }}
                    >
                      Sign up here
                    </Text>
                  </Text>
                </AppText>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    </ImageBackground>
  );
}

Login.propTypes = {
  login: PropTypes.func,
};

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
