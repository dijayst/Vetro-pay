import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Dimensions, ImageBackground, View, Text, StyleSheet, Image, TextInput, ScrollView, KeyboardAvoidingView } from "react-native";
import { Picker } from "react-native";
import Constants from "expo-constants";
import AppText from "../../resource/AppText";
import { AppButton } from "../../resource/AppButton";
import { AntDesign } from "@expo/vector-icons";
import { Toast, Spinner } from "native-base";
import { postPreReg, postRegAuth, registerUser } from "../../containers/regvalidate/action";

const Logo = require("../../assets/vlogo.png");
const DoneIcon = require("../../assets/done.png");
const BackgroundImage = require("../../assets/backnet.jpg");

export default function Register({ navigation }) {
  const [stage, setStage] = useState(1);
  const [upperContentHeight, SetUpperContentHeight] = useState(0);
  const [registerData, setRegisterData] = useState({
    payload: {
      country: "NIGERIA",
      fullName: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      authCode: "",
      securityQuestion: "",
      securityAnswer: "",
      transactionPin: "",
      confirmTransactionPin: "",
    },
  });

  const [displaySpinner, setDisplaySpinner] = useState(false);

  /**State  ==> Props */
  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const dispatch = useDispatch();
  const preRegResponse = useSelector((state) => state.regvalidate.prereg);
  const prevPreRegResponse = usePrevious(preRegResponse); // prefix "prev" only exist onChange

  const regAuthResponse = useSelector((state) => state.regvalidate.regauth);
  const prevRegAuthResponse = usePrevious(regAuthResponse);

  const registerUserResponse = useSelector((state) => state.regvalidate.register);
  const prevRegisterUserResponse = usePrevious(registerUserResponse);

  useEffect(() => {
    /** PRE-REG */
    if (prevPreRegResponse) {
      if (prevPreRegResponse.length !== preRegResponse.length) {
        if (preRegResponse[preRegResponse.length - 1]["status"] == "success") {
          setDisplaySpinner(false);
          setStage(2); //Proceeds to Authentication Code Stage
        } else {
          setDisplaySpinner(false);
          Toast.show({
            text: preRegResponse[preRegResponse.length - 1]["message"],
            duration: 5000,
            type: "danger",
          });
        }
      }
    }
    /** END PRE-REG */

    /** REG AUTHENTICATION CODE */
    if (prevRegAuthResponse) {
      if (prevRegAuthResponse.length !== regAuthResponse.length) {
        if (regAuthResponse[regAuthResponse.length - 1]["status"] == "success") {
          setDisplaySpinner(false);
          setStage(3); //Proceeds to Security & Transaction PIN Stage
        } else {
          setDisplaySpinner(false);
          Toast.show({
            text: regAuthResponse[regAuthResponse.length - 1]["message"],
            duration: 5000,
            type: "danger",
          });
        }
      }
    }
    /** END REG AUTHENTICATION CODE */

    /** REGISTER USER */
    if (prevRegisterUserResponse) {
      if (prevRegisterUserResponse.length !== registerUserResponse.length) {
        if (registerUserResponse[registerUserResponse.length - 1]["status"] == "success") {
          setDisplaySpinner(false);
          setStage(4); //Proceed to Congratulations Stage
        } else {
          //No definite method specified
        }
      }
    }

    /** END REGISTER USER */
  });

  const updateUpperContentHeight = (event) => {
    SetUpperContentHeight(event.nativeEvent.layout.height);
  };

  const goToAuthCode = () => {
    if (
      !registerData.payload.fullName.replace(/\s\s+/g, " ").includes(" ") ||
      registerData.payload.fullName.length < 6 ||
      !(registerData.payload.phoneNumber.length >= 7 && 12 > registerData.payload.phoneNumber.length) ||
      registerData.payload.password.length < 8 ||
      registerData.payload.password !== registerData.payload.confirmPassword
    ) {
      if (!registerData.payload.fullName.replace(/\s\s+/g, " ").includes(" ")) {
        Toast.show({
          text: "First name and Last name must be added",
          duration: 3000,
          type: "danger",
        });
      } else if (registerData.payload.fullName.length < 6) {
        Toast.show({
          text: "Name cannot be less than 6 Characters",
          duration: 3000,
          type: "danger",
        });
      } else if (!(registerData.payload.phoneNumber.length >= 7 && 12 > registerData.payload.phoneNumber.length)) {
        Toast.show({
          text: "Invalid Phone number",
          duration: 3000,
          type: "danger",
        });
      } else if (registerData.payload.password.length < 8) {
        Toast.show({
          text: "Password cannot be less than 8 characters",
          duration: 3000,
          type: "danger",
        });
      } else if (registerData.payload.password !== registerData.payload.confirmPassword) {
        Toast.show({
          text: '"Confirm password" not the same as "Password" ',
          duration: 3000,
          type: "danger",
        });
      }
    } else {
      setDisplaySpinner(true);
      dispatch(postPreReg(registerData.payload.country, registerData.payload.phoneNumber, registerData.payload.fullName));
    }
  };

  const goToSecurityPin = () => {
    if (Number(registerData.payload.authCode) == NaN || Number(registerData.payload.authCode) < 11234 || Number(registerData.payload.authCode) > 99000) {
      Toast.show({
        text: "Auth code incorrect",
        duration: 3000,
        type: "danger",
      });
    } else {
      setDisplaySpinner(true);
      dispatch(postRegAuth(registerData.payload.country, registerData.payload.phoneNumber, registerData.payload.authCode));
    }
  };

  const completeRegistration = () => {
    if (
      registerData.payload.securityQuestion == "" ||
      registerData.payload.securityAnswer == "" ||
      registerData.payload.securityAnswer.replace(/\s\s+/g, " ") == " " ||
      registerData.payload.transactionPin.length < 6 ||
      Number(registerData.payload.transactionPin) == NaN ||
      registerData.payload.transactionPin !== registerData.payload.confirmTransactionPin
    ) {
      if (registerData.payload.securityQuestion == "") {
        Toast.show({
          text: "Select security question",
          duration: 3000,
          type: "danger",
        });
      } else if (registerData.payload.securityAnswer == "" || registerData.payload.securityAnswer.replace(/\s\s+/g, " ") == " ") {
        Toast.show({
          text: "Input Security Answer",
          duration: 3000,
          type: "danger",
        });
      } else if (registerData.payload.transactionPin.length < 6 || Number(registerData.payload.transactionPin) == NaN) {
        Toast.show({
          text: "Transaction Pin must be 6 digit (numbers only)",
          duration: 3000,
          type: "danger",
        });
      } else if (registerData.payload.transactionPin !== registerData.payload.confirmTransactionPin) {
        Toast.show({
          text: '"Transaction Pin" and "Confirm transaction pin" must be the same',
          duration: 3000,
          type: "danger",
        });
      }
    } else {
      setDisplaySpinner(true);
      dispatch(
        registerUser(
          registerData.payload.country,
          registerData.payload.phoneNumber,
          registerData.payload.fullName,
          registerData.payload.password,
          registerData.payload.securityQuestion,
          registerData.payload.securityAnswer,
          registerData.payload.transactionPin
        )
      );
    }
  };

  const onValueChange = (fieldName, value) => {
    if (fieldName == "fullName") {
      setRegisterData((prevState) => ({
        ...prevState,
        payload: {
          ...prevState.payload,
          fullName: value,
        },
      }));
    } else if (fieldName == "phoneNumber") {
      setRegisterData((prevState) => ({
        ...prevState,
        payload: {
          ...prevState.payload,
          phoneNumber: value,
        },
      }));
    } else if (fieldName == "password") {
      setRegisterData((prevState) => ({
        ...prevState,
        payload: {
          ...prevState.payload,
          password: value,
        },
      }));
    } else if (fieldName == "confirmPassword") {
      setRegisterData((prevState) => ({
        ...prevState,
        payload: {
          ...prevState.payload,
          confirmPassword: value,
        },
      }));
    } else if (fieldName == "authCode") {
      setRegisterData((prevState) => ({
        ...prevState,
        payload: {
          ...prevState.payload,
          authCode: value,
        },
      }));
    } else if (fieldName == "securityAnswer") {
      setRegisterData((prevState) => ({
        ...prevState,
        payload: {
          ...prevState.payload,
          securityAnswer: value,
        },
      }));
    } else if (fieldName == "transactionPin") {
      setRegisterData((prevState) => ({
        ...prevState,
        payload: {
          ...prevState.payload,
          transactionPin: value,
        },
      }));
    } else if (fieldName == "confirmTransactionPin") {
      setRegisterData((prevState) => ({
        ...prevState,
        payload: {
          ...prevState.payload,
          confirmTransactionPin: value,
        },
      }));
    }
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
                      <Picker
                        style={{ height: 40 }}
                        onValueChange={(itemValue, itemIndex) => {
                          setRegisterData((prevState) => ({
                            ...prevState,
                            payload: {
                              ...prevState.payload,
                              country: itemValue,
                            },
                          }));
                        }}
                        selectedValue={registerData.payload.country}
                      >
                        <Picker.Item label="🇳🇬  Nigeria" value="NIGERIA" />
                        <Picker.Item label="🇰🇪  Kenya" value="KENYA" />
                      </Picker>
                    </View>
                    <TextInput
                      style={{ ...styles.textInput, marginTop: 20 }}
                      value={registerData.payload.fullName}
                      onChangeText={(text) => onValueChange("fullName", text)}
                      placeholder="Full Name"
                      placeholderTextColor="#000000"
                    />

                    <TextInput
                      style={{ ...styles.textInput, marginTop: 20 }}
                      textContentType="telephoneNumber"
                      placeholder="Phone Number"
                      keyboardType="visible-password"
                      placeholderTextColor="#000000"
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

                    <TextInput
                      style={{ ...styles.textInput, marginTop: 20 }}
                      placeholder="Confirm Password"
                      placeholderTextColor="#000000"
                      textContentType="password"
                      secureTextEntry
                      onChangeText={(text) => onValueChange("confirmPassword", text)}
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
                        display: `${!displaySpinner ? "flex" : "none"}`,
                        borderRadius: 8,
                        elevation: 4,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => goToAuthCode()}
                    >
                      <AppText bold="true" styles={{ color: "#FFFFFF", fontSize: 18 }}>
                        Sign Up
                      </AppText>
                    </AppButton>
                    <View style={{ justifyContent: "center", display: `${displaySpinner ? "flex" : "none"}` }}>
                      <Spinner color="blue" />
                    </View>

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
                    <TextInput
                      style={styles.textInput}
                      placeholder="Authentication Code"
                      placeholderTextColor="#000000"
                      keyboardType="visible-password"
                      onChangeText={(text) => onValueChange("authCode", text)}
                    />

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
                        display: `${!displaySpinner ? "flex" : "none"}`,
                        borderRadius: 8,
                        elevation: 4,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => goToSecurityPin()}
                    >
                      <AppText bold="true" styles={{ color: "#FFFFFF", fontSize: 18 }}>
                        Continue
                      </AppText>{" "}
                      <AntDesign color="#FFFFFF" name="arrowright" size={16} />
                    </AppButton>
                    <View style={{ justifyContent: "center", display: `${displaySpinner ? "flex" : "none"}` }}>
                      <Spinner color="blue" />
                    </View>
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
                      <Picker
                        style={{ height: 40, flex: 1, flexWrap: "wrap" }}
                        onValueChange={(itemValue, itemIndex) => {
                          setRegisterData((prevState) => ({
                            ...prevState,
                            payload: {
                              ...prevState.payload,
                              securityQuestion: itemValue,
                            },
                          }));
                        }}
                        selectedValue={registerData.payload.securityQuestion}
                      >
                        <Picker.Item label="--- Select Security Question ---" value="" />
                        <Picker.Item label="Your oldest sibling's middle name?" value="1" />
                        <Picker.Item label="Your Mom & Dad met in which city? " value="2" />
                        <Picker.Item label="Your first car?" value="3" />
                        <Picker.Item label="The first name of your best friend in High School?" value="4" />
                        <Picker.Item label="The name of your first pet?" value="5" />
                        <Picker.Item label="The name of the street where you grew up?" value="6" />
                      </Picker>
                    </View>

                    <TextInput
                      style={{ ...styles.textInput, marginTop: 20 }}
                      placeholder="Enter Security Answer"
                      placeholderTextColor="#000000"
                      onChangeText={(text) => onValueChange("securityAnswer", text)}
                    />
                    <TextInput
                      style={{ ...styles.textInput, marginTop: 20 }}
                      placeholder="Set Transaction Pin"
                      placeholderTextColor="#000000"
                      maxLength={6}
                      textContentType="password"
                      secureTextEntry
                      onChangeText={(text) => onValueChange("transactionPin", text)}
                    />
                    <TextInput
                      style={{ ...styles.textInput, marginTop: 20 }}
                      placeholder="Confirm Transaction Pin"
                      placeholderTextColor="#000000"
                      maxLength={6}
                      textContentType="password"
                      secureTextEntry
                      onChangeText={(text) => onValueChange("confirmTransactionPin", text)}
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
                        display: `${!displaySpinner ? "flex" : "none"}`,
                        borderRadius: 8,
                        elevation: 4,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => completeRegistration()}
                    >
                      <AppText bold="true" styles={{ color: "#FFFFFF", fontSize: 18 }}>
                        Complete
                      </AppText>
                    </AppButton>
                    <View style={{ justifyContent: "center", display: `${displaySpinner ? "flex" : "none"}` }}>
                      <Spinner color="blue" />
                    </View>

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

Register.propTypes = {
  postPreReg: PropTypes.func,
  postRegAuth: PropTypes.func,
  registerUser: PropTypes.func,
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
