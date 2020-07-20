import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Dimensions, Modal, ImageBackground, View, Text, StyleSheet, Image, TextInput, ScrollView, KeyboardAvoidingView } from "react-native";
import { Picker } from "react-native";
import Constants from "expo-constants";
import AppText from "../../resource/AppText";
import { AppButton, PrimaryButton } from "../../resource/AppButton";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContentStage, setModalContentStage] = useState(1);

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
      registerData.payload.transactionPin.length > 6 ||
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
      } else if (registerData.payload.transactionPin.length < 6 || Number(registerData.payload.transactionPin) == NaN || registerData.payload.transactionPin.length > 6) {
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
                  keyboardShouldPersistTaps="always"
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

                    <AppText styles={{ marginTop: 10 }}>
                      By proceeding you agree to our{" "}
                      <Text style={{ color: "#266ddc", fontWeight: "700" }} onPress={() => setModalOpen(true)}>
                        Privacy Policy and Terms of Service
                      </Text>
                    </AppText>

                    <AppText styles={{ marginTop: 30, marginBottom: 30, fontSize: 16, textAlign: "center" }}>
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
                  keyboardShouldPersistTaps="always"
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
                  keyboardShouldPersistTaps="always"
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
                keyboardShouldPersistTaps="always"
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
      {/** T & C Modal */}
      <Modal visible={modalOpen} animationType="slide">
        <View style={styles.modalContent}>
          {modalContentStage == 1 ? (
            <View>
              <View
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  zIndex: 1,
                }}
              >
                <PrimaryButton onPress={() => setModalContentStage(2)}>
                  <AppText bold="true" styles={{ color: "#fff", marginLeft: 2, fontSize: 16 }}>
                    Go to T&C
                  </AppText>
                </PrimaryButton>
              </View>
              <MaterialIcons name="close" size={24} onPress={() => setModalOpen(false)} style={styles.modalClose} />

              <View style={{ marginTop: 16 }}>
                <ScrollView style={{ height: Dimensions.get("window").height - 90 }}>
                  <AppText bold="true" styles={{ textAlign: "center", fontSize: 18 }}>
                    "VetroPay Mobile" Privacy Policy
                  </AppText>
                  <AppText styles={{ fontSize: 16, marginTop: 5 }}>Thank you for choosing VetroPay!</AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    The website: https://vetropay.com (its sub-domains, affliated websites, and any services made available therefrom, including mobile applications or hardware
                    products)(the "Platform") is operated by <Text style={{ fontWeight: "700" }}>Ancla Technologies LTD</Text>. We respect your privacy rights and recognize the
                    importance of protecting data collected from you and about you. This privacy policy describes how we collect, use, share and protect that data.
                  </AppText>
                  <AppText bold="true">Your continued use of this service constitutes your acceptance of this Privacy Policy.</AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    1. Collection of Data
                  </AppText>
                  <AppText styles={{ paddingHorizontal: 20 }}>"We collect personal data when you voluntarily provide it to us."</AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    We collect personal data from you at different juncture on the Platform. Personal data means information that can reasonably be used to identify you personally
                    (such as name, phone number, address, email address, Bank verification Number, ID card). We collect this personal data when you voluntarily provide it to us
                    (such as when you submit a KYC verification request). You can choose not to provide the requested data, but you might not be able to take advantage of certain
                    Platform features.
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    2. Use of Collected Data
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    We collect and use the types of data described above to assist in the administration and operation of the Platform and to provide you an efficient, meaningful,
                    and customized experience. We may use the data to:
                  </AppText>
                  <AppText styles={{ paddingHorizontal: 20 }}>
                    (a) Fulfill our obligations with respect to the reason you volunteered the data (e.g., to respond to an inquiry, evaluate your credit application, record
                    transaction details or history etc.);
                  </AppText>
                  <AppText styles={{ paddingHorizontal: 20, marginTop: 5 }}>(b) Allow you to enjoy full features of the Platform;</AppText>
                  <AppText styles={{ paddingHorizontal: 20, marginTop: 5 }}>(c) Improve the Platform or our products, events and services;</AppText>
                  <AppText styles={{ paddingHorizontal: 20, marginTop: 5 }}>(c) Optimize your experience;</AppText>
                  <AppText styles={{ paddingHorizontal: 20, marginTop: 5 }}>(d) For any other purpose with your consent or as permitted by law.</AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    Additionally, we may use the data for marketing purposes to: Provide you with additional information regarding products, events and services from Ancla
                    Technologies, and its subsidiaries and affiliated companies via email or through advertising on various social media platforms or websites (both desktop and
                    mobile) that you may visit.{" "}
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    3. Data Security
                  </AppText>
                  <AppText styles={{ paddingHorizontal: 20 }}>"Your password and security questions are fully encrpyted."</AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    This Platform has security measures in place to protect the loss or alteration of the information under our control. All the data regarding customers, users,
                    their device information and data are stored on a server. This server is located in a locked and guarded space and only authorized personnel have access to the
                    database containing the stored information. Data such as password and security answers can only be made available by you as it is completely obfuscated and
                    fully encrpyted.
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    4. How We Share Data
                  </AppText>
                  <AppText styles={{ paddingHorizontal: 20, marginTop: 5 }}>
                    1. <Text style={{ fontWeight: "700" }}>Affiliates and Subsidiaries.</Text> We may share your data collected on this Platform with our subsidiaries or affiliated
                    companies.
                  </AppText>

                  <AppText styles={{ paddingHorizontal: 20, marginTop: 5 }}>
                    2. <Text style={{ fontWeight: "700" }}>Service Providers. </Text>
                    We may provide collected data to our service providers. They may use your data to perform services for us and may have access to, store and process your
                    personal data to provide services on our behalf.
                  </AppText>

                  <AppText styles={{ paddingHorizontal: 20, marginTop: 5 }}>
                    3. <Text style={{ fontWeight: "700" }}>Law Enforcement and Safety.</Text> We may also share or disclose your data to comply with a court order or other legal
                    obligation, to enforce the Platform terms of use, and to protect the rights, property or safety of our users. We may disclose data to government or law
                    enforcement officials or private parties as we determine, in our sole and absolute discretion, is necessary or appropriate to respond to claims or to comply
                    with legal processes, to comply with laws, regulations or ordinances or to prevent or stop illegal, unethical or actionable activity.
                  </AppText>

                  <AppText styles={{ paddingHorizontal: 20, marginTop: 5 }}>
                    4. <Text style={{ fontWeight: "700" }}>Business Transfer</Text> In the event that Ancla Technologies undergoes a merger, acquisition by another company or sale
                    of its assets, your data will, in most instances, be part of the assets transferred.
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    4. Protection and Retention of Data
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    All Ancla Technologies products are built with strong security features that continuously protect your information. The insights we gain from maintaining our
                    services help us detect and automatically block security threats from ever reaching you. And if we do detect something risky that we think you should know
                    about, we’ll notify you and help guide you through steps to stay better protected.
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    We retain data only as long as necessary in light of the reasons it was collected as set forth in this Privacy Policy, or until you inform us you wish to have
                    your data deleted, whichever comes first. Please note that we may retain your data for longer periods of time as necessary to comply with our legal obligations
                    or respond to governmental authorities.
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    5. Children and Parents
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    We do not target or knowingly or intentionally collect personally identifiable information from children under the age of 18. By using this Platform, you have
                    represented and warranted that you are either at least 18 years of age or using the Platform with the supervision of a parent or guardian. If you become aware
                    that your child has provided us with personal information without your consent, please email us at support@vetropay.com.
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    6. Miscellaneous
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    From time to time, we may update this Privacy Policy to reflect, among other things, changes in the law or our data collection and use practices and such
                    modifications shall be effective upon posting by VetroPay. Your continued use of the Platform after an updated Privacy Policy signifies your acceptance of the
                    updated Privacy Policy. It is important that you review this Privacy Policy regularly to ensure you are updated as to any changes. If we make a material change
                    to this Privacy Policy, as determined in our sole discretion, we will notify you via email.
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    7. Contact Us
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    If you have any general questions about this Privacy Policy or other aspects of the Platform or would like to correct, update or erase data provided to us,
                    please email us at support@vetropay.com or write to us at:
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>VetroPay, Ancla Technologies LTD</AppText>
                  <AppText>Attention: VetroPay Mobile Privacy Policy</AppText>
                  <AppText>3 Alara Street, Sabo-Yaba</AppText>
                  <AppText>Lagos Mainland, Lagos, Nigeria.</AppText>
                  <View style={{ marginTop: 70 }}></View>
                </ScrollView>
              </View>
            </View>
          ) : (
            <View>
              <View
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  zIndex: 1,
                }}
              >
                <PrimaryButton onPress={() => setModalContentStage(1)}>
                  <AppText bold="true" styles={{ color: "#fff", marginLeft: 2, fontSize: 16 }}>
                    Go to PP
                  </AppText>
                </PrimaryButton>
              </View>
              <MaterialIcons
                name="close"
                size={24}
                onPress={() => {
                  setModalOpen(false);
                  setModalContentStage(1);
                }}
                style={styles.modalClose}
              />
              <View style={{ marginTop: 16 }}>
                <ScrollView style={{ height: Dimensions.get("window").height - 90 }}>
                  <AppText bold="true" styles={{ textAlign: "center", fontSize: 18 }}>
                    "VetroPay Mobile" Terms of Service
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    Foreword
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    <Text style={{ fontWeight: "700", textTransform: "uppercase" }}>Our Vision:</Text> To become your official payment partner.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    <Text style={{ fontWeight: "700", textTransform: "uppercase" }}>Our Mission:</Text> To enable you pay and get paid in an efficient, safe and most convinient
                    means whilst reducing the transaction charges required to the optimum.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    We intend to achieve this by creating a network of individuals like you, merchants and businesses around the world all operating within this{" "}
                    <Text style={{ fontWeight: "700" }}>Vetro-Payment-Network</Text>. This allows you to send money to family and friends, pay for goods and services locally or
                    internationally without having to worry about hefty duties or transaction charges.
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    We also help you keep track of your payment history like never before, giving you in-depth insights to your transaction records.{" "}
                    <Text style={{ fontWeight: "700" }}>Imagine being able to say for certain how much you had spent every year since 2004?</Text> That's one of the many advantages
                    of using VetroPay; Record Keeping! We help you keep and curate your transaction history; requestable at any instance in time.
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    We know you need access to Credit; Our system relies on an independent (yet collaborative) credit scoring algorithm derived from your profile, transaction
                    activity within our network and your existing national credit history.
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    I consider it vital to share my enthusiasm and optimism with you, because I believe it will not be sustainable unless you are part of this long-term goal and
                    vision.
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>We remain committed to your service. Thank you for choosing VetroPay.</AppText>
                  <AppText bold="true" styles={{ textAlign: "right", marginTop: 10 }}>
                    Olamigoke Philp A.
                  </AppText>
                  <AppText styles={{ textAlign: "right" }}>CEO, Ancla Technologies LTD</AppText>

                  <AppText bold="true" styles={{ textAlign: "center", fontSize: 18, marginTop: 25 }}>
                    Terms of Service
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    These Terms of Service ("Terms") govern your access to and use of VetroPay. Please read these Terms carefully and contact us if you have any questions. By
                    accessing our services on the Platform (including deposits, withdrawals, local and international fund transfers, credit facility, purchase and other transaction
                    history), you agree to be bound by these Terms and by our Privacy Policy<Text style={{ fontSize: 9 }}>[1]</Text>.
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    1. Opening an Account & KYC
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    (a). You are responsible for maintaining adequate security and control of any and all IDs, passwords, personal identification numbers, or any other codes that
                    you use to access your VetroPay account and the VetroPay services.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    (b). In order to open and maintain a VetroPay account, you must list your correct country/region of residence and provide us with correct and updated account
                    information, including but not limited to personal information, financial information related to you.
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    (c). You agree that the information supplied in your registration and KYC<Text style={{ fontSize: 9 }}>[Know Your Customer]</Text> verification process is in
                    all respects complete, accurate and truthful.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    (d). You agree to immediately notify VetroPay of any change/loss of mobile phone number or email address, and failing such notification, any notice or
                    transactional advice to you is effectively sent to last known address.
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    2. Holding a VetroPay Balance
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    (a). Any VetroPay balance you hold represents an unsecured claim against VetroPay (Ancla Technologies LTD). VetroPay combines your balance with the balances of
                    other users and invests those funds in liquid investments.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    (b). VetroPay will neither use these funds for its operating expenses or any other corporate purposes nor will it voluntarily make these funds available to its
                    creditors in the event of bankruptcy.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    (c). You will not receive interest or other earnings on the amounts in your balance. You agree VetroPay shall own the interest or other earnings on these
                    investments. You agree to assign any rights to any interest derived from your funds to VetroPay.
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    3. Adding funds to your balance
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    (a). You can add funds to your VetroPay account by making a National bank transfer to the VetrPay Bank account details made available on the Platform's ("Add
                    fund option") with the appropriate reference details.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>(b). A Vetropay Smart Transfer from another registered User</AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    The amount transferred will be held as a balance in your VetroPay account. Debit and Credit cards cannot be used to add funds to your VetroPay balance.
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    4. Withdrawing funds from your balance
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    (a). If you have a VetroPay balance, log into your VetroPay account to request transfer to bank account linked to your VetroPay account.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    (b). Depending on the country or region in a particular country which your account is registered, you may be able to withdraw your funds through a third party
                    service provider.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    (c). We may set limits on your withdrawals, and you can view any withdrawal limit by logging into your VetroPay account. Completing the following steps can help
                    us verify your VetroPay account, which may allow us to remove any withdrawal cap:
                  </AppText>
                  <AppText styles={{ paddingHorizontal: 20 }}>(i). Updating up your national bank account information.</AppText>
                  <AppText styles={{ paddingHorizontal: 20 }}>(ii). Completing your KYC verification process.</AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    5. Local Transfer
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    Fund transfer within two registered VetroPay user is termed a "Smart Transfer". All local (Intra - National) funds transfer on VetroPay essentially remains
                    free. i.e at Zero (0.00) transaction charge. A typical Smart Transfer takes only just about half of a second.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    The VetroPay payment network also allows for electronic fund transfer to non-registered individuals. This local (intra-National) transfer method attracts a
                    transaction fee (a derivative of the standard national bank transfer charges) payable by the receiver upon claiming any funds sent.
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    6. International Transfer (How we convert currency)
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    If your Smart Transfer invloves currency conversion, it will be completed at a set transaction fee comprising of the exchange rate we set for the relevant
                    currency exchange. (The transaction exchange rate is adjusted regularly), this transaction fee will also includes a{" "}
                    <Text style={{ fontWeight: "700" }}>currency conversion fee</Text> applied and retained by us on a base exchange rate to form the rate applicable to your
                    conversion. The base exchange rate is based on rates within the wholesale currency markets on the conversion day or the prior Business Day; or, if required by
                    law or regulation, set at the relevant government reference rate(s).
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    7. VetroPay MarketPlace
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    VetoPay market place is a bill payment center for Airtime, Utility bills etc. serving as a generic payment portal for all our partnered merchants, businesses
                    and Institutions.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>MarketPlace facilitates payments between you and your favourite brands & service providers.</AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    8. Vetro Credit
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    (a) Vetro Credit relies on an independent (yet collaborative) credit scoring algorithm derived from your profile, transaction activities within our network and
                    your existing national credit history. Vetro Credit is an optional service made available to users. Users in their sole-discretion may or may not choose to
                    utilize this Platform feature.
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>(b). Vetro Credit option is made available to users on a month-to-month performance assesment:</AppText>
                  <AppText styles={{ paddingHorizontal: 20 }}>(i). User has been registered for at least 90 days;</AppText>
                  <AppText styles={{ paddingHorizontal: 20 }}>(ii). User has a positive credit record with the National Credit Bureau;</AppText>
                  <AppText styles={{ paddingHorizontal: 20 }}>(iii). User has no outstanding debt with VetroPay;</AppText>
                  <AppText styles={{ paddingHorizontal: 20 }}>
                    (iv). User has performed a minimum of NGN 10,000 or KES 3,000 worth of transaction value in the preceeding month
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    (c). Vetro Credit upon disbursement can only be used for purchase of services or products on VertoPay MarketPlace or on our Partnered Merchants digital
                    platforms offering Vetropay as a payment option.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    (d). All Credit disbursed is expected to be paid back within 30 days from disbursement date. Delayed repayment can essentially lead to{" "}
                    <Text style={{ fontWeight: "700" }}>Penal Charges,</Text> discontinuance of service which may involve filling an offical report to the appropriate national
                    credit authorities.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>(e). Vetro Credit is non transferable.</AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    (f). Interest rate on Credits provided may vary from country to country. Interest rates are specified at the point of request and reiterated before completing
                    request.
                  </AppText>

                  <AppText bold="true" styles={{ marginTop: 5, color: "red" }}>
                    (g). Penal Charges on delayed repayment:
                  </AppText>
                  <AppText styles={{ paddingHorizontal: 20 }}>(i). 10 days past Due Date attracts a Default Penalty of 1% on compounded Total Amount Payable.</AppText>
                  <AppText styles={{ paddingHorizontal: 20 }}>(ii). 30 days past Due Date attracts a Default Penalty of 1% on compounded Total Amount Payable.</AppText>
                  <AppText styles={{ paddingHorizontal: 20 }}>
                    (iii). 60 days past Due Date attracts a Default Penalty of 1.5% on compounded Total Amount Payable (and every 30 days thereafter).
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    9. Account Statements
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    You have the right to receive an account statement showing your VetroPay account activity. You may view your VetroPay account statement by logging into your
                    VetroPay account.
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    10. User Accountability
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    You acknowledge and recognize that your Transaction PIN is your security check for effecting payments, transfers and withdrawals on the VetroPay Mobile
                    Platform, You undertake to be fully and solely responsible for all risks that may arise from the Transactions as well or together with all losses which may be
                    suffered by You as a result of any unauthorized transfer of monies or other Transactions in your account as a result of the use of your Transaction PIN on the
                    VetroPay Mobile Platform. PIN will serve as the default authentication for transaction authentication. Password will serve as default authentication for login.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    Furthermore, You acknowledge and consent that neither VetroPay nor Ancla Technologies (nor It's parent company, in the event of an acquisition or merger) would
                    be liable for any loss, fraudulent or unauthorized access or transfer of monies, that may occur on your account as a result of processing Transactions
                    consummated on your account through VetroPay Mobile Platform.
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    11. Acceptance of "Terms of Service"
                  </AppText>

                  <AppText styles={{ marginTop: 10 }}>
                    By accessing our Products and Services, you agree to be bound by these Terms and by our Privacy Policy. If you have any questions, please email us at
                    support@vetropay.com or write to us at:
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>VetroPay, Ancla Technologies LTD</AppText>
                  <AppText>Attention: VetroPay Mobile Term of Service</AppText>
                  <AppText>3 Alara Street, Sabo-Yaba</AppText>
                  <AppText>Lagos Mainland, Lagos, Nigeria.</AppText>
                  <View style={{ marginTop: 70 }}></View>
                </ScrollView>
              </View>
            </View>
          )}
        </View>
      </Modal>
      {/** End T&C Modal */}
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
  modalClose: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    padding: 10,
    borderRadius: 4,
    alignSelf: "center",
    elevation: 4,
    backgroundColor: "#FFFFFF",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#F0F0F8",
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
