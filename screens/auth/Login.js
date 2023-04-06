import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, StyleSheet, TextInput, Text, Alert, Image, TouchableOpacity, Platform } from "react-native";
import AppText from "../../resources/AppText";
import { AppButton } from "../../resources/AppButton";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { Spinner, useToast, Box, Text as NativeBaseText } from "native-base";
import { useNetInfo } from "@react-native-community/netinfo";
import OfflineNotice from "../../resources/OfflineNotice";
import * as LocalAuthentication from "expo-local-authentication";
import { login } from "../../containers/authentication/action";
import * as WebBrowser from "expo-web-browser";
import { toastColorObject } from "../../resources/rStyledComponent";
import { Picker as RNPicker } from "@react-native-picker/picker";
import { Select } from "native-base";

export default function Login({ navigation }) {
  const toast = useToast();
  const Picker = Platform.OS == "android" ? RNPicker : Select;
  const [storedFirstName, setStoredFirstName] = useState("");
  const [storedPhoneNumberData, setStoredPhoneNumberData] = useState("");
  const [storedPassData, setStoredPassData] = useState("");
  const [biometricHardware, setBiometricHardware] = useState(false);
  const [biometricHardwareType, setBiometricHardwareType] = useState([]);
  const [biometricHardwareTypeSet, setBiometricHardwareTypeSet] = useState(false);

  const [loginData, setLoginData] = useState({
    payload: {
      country: "NIGERIA",
      phoneNumber: "",
      password: "",
    },
  });
  const [displaySpinner, setDisplaySpinner] = useState(false);

  if (Platform.OS == "android") {
    SecureStore.getItemAsync("firstName", SecureStore.WHEN_UNLOCKED).then((data) => setStoredFirstName(data));
    SecureStore.getItemAsync("phoneNumber", SecureStore.WHEN_UNLOCKED).then((data) => setStoredPhoneNumberData(data));
    SecureStore.getItemAsync("pass", SecureStore.WHEN_UNLOCKED).then((data) => setStoredPassData(data));
  } else {
    SecureStore.getItemAsync("firstName").then((data) => setStoredFirstName(data));
    SecureStore.getItemAsync("phoneNumber").then((data) => setStoredPhoneNumberData(data));
    SecureStore.getItemAsync("pass").then((data) => setStoredPassData(data));
  }

  const netInfo = useNetInfo();
  const dispatch = useDispatch();
  const userAuth = useSelector((state) => state.authentication);

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
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>Invalid Phone number</NativeBaseText>
            </Box>
          ),
        });
      } else if (loginData.payload.password.length < 8) {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>Incorrect password</NativeBaseText>
            </Box>
          ),
        });
      }
    } else {
      if (Platform.OS == "android") {
        SecureStore.setItemAsync("pass", loginData.payload.password, SecureStore.WHEN_UNLOCKED);
      } else {
        SecureStore.setItemAsync("pass", loginData.payload.password);
      }
      setDisplaySpinner(true);
      dispatch(login(getMobileNumberCountryCode(loginData.payload.country, loginData.payload.phoneNumber), loginData.payload.password));
    }
  };

  const loginUserFunctionII = () => {
    if (loginData.payload.password.length < 8) {
      toast.show({
        render: () => (
          <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
            <NativeBaseText style={{ color: "#FFFFFF" }}>Incorrect password</NativeBaseText>
          </Box>
        ),
      });
    } else {
      if (Platform.OS == "android") {
        SecureStore.setItemAsync("pass", loginData.payload.password, SecureStore.WHEN_UNLOCKED);
      } else {
        SecureStore.setItemAsync("pass", loginData.payload.password);
      }
      setDisplaySpinner(true);
      dispatch(login(storedPhoneNumberData, loginData.payload.password));
    }
  };

  useEffect(() => {
    setDisplaySpinner(false);
  }, [userAuth]);

  useEffect(() => {
    checkDeviceHardware();
  });

  const checkDeviceHardware = async () => {
    let compatible = await LocalAuthentication.hasHardwareAsync();
    if (compatible) {
      setBiometricHardware(true);
      if (!biometricHardwareTypeSet) {
        checkDeviceHardwareType();
      }
    } else {
      setBiometricHardware(false);
    }
  };

  const checkForBiometrics = async () => {
    let biometricRecords = await LocalAuthentication.isEnrolledAsync();
    if (!biometricRecords) {
      Alert.alert("No Biometrics Found");
    } else {
      handleBiometricAuthentication();
    }
  };

  const checkDeviceHardwareType = async () => {
    let hardware = await LocalAuthentication.supportedAuthenticationTypesAsync();
    setBiometricHardwareType(hardware);
    setBiometricHardwareTypeSet(true);
  };

  const handleLoginPress = async () => {
    checkForBiometrics();
  };

  const handleBiometricAuthentication = async () => {
    let result = await LocalAuthentication.authenticateAsync();
    if (result.success) {
      setDisplaySpinner(true);
      dispatch(login(storedPhoneNumberData, storedPassData));
    }
  };

  const _forgotPasswordViewHandler = async (hash) => {
    await WebBrowser.openBrowserAsync("https://vetropay.com/customer-care-portal");
  };

  const clearUserDeviceDetails = () => {
    if (Platform.OS == "android") {
      SecureStore.deleteItemAsync("firstName", SecureStore.WHEN_UNLOCKED).then((data) => setStoredFirstName(null));
      SecureStore.deleteItemAsync("phoneNumber", SecureStore.WHEN_UNLOCKED).then((data) => setStoredPhoneNumberData(null));
      SecureStore.deleteItemAsync("pass", SecureStore.WHEN_UNLOCKED).then((data) => setStoredPassData(null));
    } else {
      SecureStore.deleteItemAsync("firstName").then((data) => setStoredFirstName(null));
      SecureStore.deleteItemAsync("phoneNumber").then((data) => setStoredPhoneNumberData(null));
      SecureStore.deleteItemAsync("pass").then((data) => setStoredPassData(null));
    }
  };

  const serveWithSavedData = () => {
    return (
      <View style={styles.viewContainer}>
        <AppText bold="true" styles={styles.loginBold}>
          Welcome, {storedFirstName}
        </AppText>
        <AppText bold="true" styles={styles.loginIntro}>
          Please sign in to continue.
        </AppText>

        <View>
          <TextInput
            style={{ ...styles.textInput, marginTop: 20 }}
            placeholder="Password"
            placeholderTextColor="gray"
            textContentType="password"
            secureTextEntry
            autoComplete="off"
            onChangeText={(text) => onValueChange("password", text)}
          />
        </View>

        <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-around", display: `${!displaySpinner ? "flex" : "none"}` }}>
          <AppButton styles={styles.loginButton} onPress={() => loginUserFunctionII()}>
            <AppText styles={styles.buttonText}>Sign in</AppText>
          </AppButton>

          {biometricHardwareType.includes(1) && (
            <AppButton styles={styles.thumbButton} onPress={() => handleLoginPress()}>
              <MaterialCommunityIcons name="fingerprint" size={24} color="white" />
            </AppButton>
          )}

          {biometricHardwareType.includes(2) && (
            <TouchableOpacity style={styles.thumbButton} onPress={() => handleLoginPress()}>
              <Image style={{ height: 30, width: 30, resizeMode: "contain" }} source={require("../../assets/face.png")} />
            </TouchableOpacity>
          )}

          {biometricHardwareType.length == 0 && (
            <AppButton styles={styles.thumbButton}>
              <MaterialIcons name="lock" size={24} color="white" />
            </AppButton>
          )}
        </View>

        <View style={{ justifyContent: "center", display: `${displaySpinner ? "flex" : "none"}` }}>
          <Spinner color="blue.700" size="lg" />
        </View>

        <AppText bold="true" styles={{ ...styles.loginIntro, marginTop: 20, textAlign: "center", color: "#266ddc" }}>
          <Text onPress={() => clearUserDeviceDetails()}>Not You</Text>
        </AppText>
      </View>
    );
  };

  const serveasNew = () => {
    return (
      <View style={styles.viewContainer}>
        <AppText bold="true" styles={styles.loginBold}>
          Welcome,
        </AppText>
        <AppText bold="true" styles={styles.loginIntro}>
          Please sign in to continue.
        </AppText>

        <View>
          <View
            style={{
              marginTop: 10,
              borderWidth: 0.5,
              borderColor: "#266ddc",
              borderRadius: 15,
              overflow: "hidden",
            }}
          >
            <Picker
              style={{ height: 45 }}
              onValueChange={(itemValue, itemIndex) => {
                setLoginData((prevState) => ({
                  ...prevState,
                  payload: {
                    ...prevState.payload,
                    country: itemValue,
                  },
                }));
              }}
              accessibilityLabel="Choose Country"
              borderColor={"transparent"}
              selectedValue={loginData.payload.country}
            >
              <Picker.Item label="🇳🇬  Nigeria" value="NIGERIA" />
              <Picker.Item label="🇰🇪  Kenya" value="KENYA" />
            </Picker>
          </View>

          <TextInput
            style={{ ...styles.textInput, marginTop: 20 }}
            placeholder="Phone Number"
            placeholderTextColor="gray"
            textContentType="telephoneNumber"
            keyboardType="visible-password"
            autoComplete="off"
            onChangeText={(text) => onValueChange("phoneNumber", text)}
          />

          <TextInput
            style={{ ...styles.textInput, marginTop: 10 }}
            placeholder="Password"
            placeholderTextColor="gray"
            textContentType="password"
            secureTextEntry
            autoComplete="off"
            onChangeText={(text) => onValueChange("password", text)}
          />
        </View>

        <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-around" }}>
          <AppButton styles={{ ...styles.loginButton, width: "100%", display: `${!displaySpinner ? "flex" : "none"}` }} onPress={() => loginUserFunction()}>
            <AppText styles={styles.buttonText}>Sign in</AppText>
          </AppButton>
          <View style={{ justifyContent: "center", display: `${displaySpinner ? "flex" : "none"}` }}>
            <Spinner color="blue.700" size="lg" />
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <OfflineNotice variant={netInfo.isConnected} />
      {storedFirstName !== null && serveWithSavedData()}
      {storedFirstName == null && serveasNew()}

      <View>
        <AppText bold="true" styles={{ ...styles.loginIntro, marginBottom: 10, textAlign: "center", color: "#266ddc" }}>
          <Text onPress={() => _forgotPasswordViewHandler()}>Forgot Password</Text>
        </AppText>

        <AppText bold="true" styles={{ ...styles.loginIntro, marginBottom: 30, textAlign: "center" }}>
          Don't have an account?{" "}
          <Text style={{ color: "#266ddc" }} onPress={() => navigation.navigate("Register")}>
            Sign up
          </Text>
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f2f2",
    flex: 1,
    justifyContent: "center",
  },
  viewContainer: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },
  loginBold: {
    fontSize: 25,
  },
  loginIntro: {
    color: "gray",
  },
  textInput: {
    height: 45,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 0.5,
    borderColor: "#266ddc",
    borderRadius: 15,
    borderBottomColor: "#266DDC",
  },
  loginButton: {
    marginTop: 10,
    backgroundColor: "#266ddc",
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    elevation: 3,
    borderRadius: 25,
  },
  thumbButton: {
    marginTop: 10,
    backgroundColor: "#266ddc",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    elevation: 3,
    borderRadius: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
});
