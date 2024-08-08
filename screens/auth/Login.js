import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import AppText from "../../resources/AppText";
import { AppButton } from "../../resources/AppButton";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
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
import VETROPAY_LOGO from "../../assets/logomark_full_horizontal.png";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Login({ navigation, route }) {
  const toast = useToast();
  const Picker = Platform.OS == "android" ? RNPicker : Select;
  const [storedFirstName, setStoredFirstName] = useState("");
  const [deeplinkUrl, setDeepLinkUrl] = useState(null);
  const [storedPhoneNumberData, setStoredPhoneNumberData] = useState("");
  const [storedPassData, setStoredPassData] = useState("");
  const [biometricHardware, setBiometricHardware] = useState(false);
  const [biometricHardwareType, setBiometricHardwareType] = useState([]);
  const [biometricHardwareTypeSet, setBiometricHardwareTypeSet] =
    useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    payload: {
      country: "NIGERIA",
      phoneNumber: "",
      password: "",
    },
  });
  const [displaySpinner, setDisplaySpinner] = useState(false);

  if (Platform.OS == "android") {
    SecureStore.getItemAsync("firstName", SecureStore.WHEN_UNLOCKED).then(
      (data) => setStoredFirstName(data)
    );
    SecureStore.getItemAsync("phoneNumber", SecureStore.WHEN_UNLOCKED).then(
      (data) => setStoredPhoneNumberData(data)
    );
    SecureStore.getItemAsync("pass", SecureStore.WHEN_UNLOCKED).then((data) =>
      setStoredPassData(data)
    );
  } else {
    SecureStore.getItemAsync("firstName").then((data) =>
      setStoredFirstName(data)
    );
    SecureStore.getItemAsync("phoneNumber").then((data) =>
      setStoredPhoneNumberData(data)
    );
    SecureStore.getItemAsync("pass").then((data) => setStoredPassData(data));
  }

  const netInfo = useNetInfo();
  const dispatch = useDispatch();
  const userAuth = useSelector((state) => state.authentication);

  useEffect(() => {
    if (route.params) {
      let recipient = route.params?.recipient;
      //let amount = route.params?.amount || "";
      if (recipient) {
        setDeepLinkUrl(route.path);
      }
    }
  }, [navigation]);

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
    if (
      !(
        loginData.payload.phoneNumber.length >= 7 &&
        12 > loginData.payload.phoneNumber.length
      ) ||
      loginData.payload.password.length < 8
    ) {
      if (
        !(
          loginData.payload.phoneNumber.length >= 7 &&
          12 > loginData.payload.phoneNumber.length
        )
      ) {
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
                Invalid Phone number
              </NativeBaseText>
            </Box>
          ),
        });
      } else if (loginData.payload.password.length < 8) {
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
                Incorrect password
              </NativeBaseText>
            </Box>
          ),
        });
      }
    } else {
      if (Platform.OS == "android") {
        SecureStore.setItemAsync(
          "pass",
          loginData.payload.password,
          SecureStore.WHEN_UNLOCKED
        );
        SecureStore.setItemAsync(
          "lastActive",
          new Date().toString(),
          SecureStore.WHEN_UNLOCKED
        );
      } else {
        SecureStore.setItemAsync("pass", loginData.payload.password);
        SecureStore.setItemAsync("lastActive", new Date().toString());
      }
      setDisplaySpinner(true);
      dispatch(
        login(
          getMobileNumberCountryCode(
            loginData.payload.country,
            loginData.payload.phoneNumber
          ),
          loginData.payload.password,
          deeplinkUrl
        )
      );
    }
  };

  const loginUserFunctionII = () => {
    if (loginData.payload.password.length < 8) {
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
              Incorrect password
            </NativeBaseText>
          </Box>
        ),
      });
    } else {
      if (Platform.OS == "android") {
        SecureStore.setItemAsync(
          "pass",
          loginData.payload.password,
          SecureStore.WHEN_UNLOCKED
        );
        SecureStore.setItemAsync(
          "lastActive",
          new Date().toString(),
          SecureStore.WHEN_UNLOCKED
        );
      } else {
        SecureStore.setItemAsync("pass", loginData.payload.password);
        SecureStore.setItemAsync("lastActive", new Date().toString());
      }
      setDisplaySpinner(true);
      dispatch(
        login(storedPhoneNumberData, loginData.payload.password, deeplinkUrl)
      );
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
    let hardware =
      await LocalAuthentication.supportedAuthenticationTypesAsync();
    setBiometricHardwareType(hardware);
    setBiometricHardwareTypeSet(true);
  };

  const handleLoginPress = async () => {
    checkForBiometrics();
  };

  const handleBiometricAuthentication = async () => {
    let result = await LocalAuthentication.authenticateAsync();
    if (result.success) {
      if (Platform.OS == "android") {
        SecureStore.setItemAsync(
          "lastActive",
          new Date().toString(),
          SecureStore.WHEN_UNLOCKED
        );
      } else {
        SecureStore.setItemAsync("lastActive", new Date().toString());
      }
      setDisplaySpinner(true);
      dispatch(login(storedPhoneNumberData, storedPassData, deeplinkUrl));
    }
  };

  const _forgotPasswordViewHandler = async (hash) => {
    await WebBrowser.openBrowserAsync(
      "https://vetropay.com/customer-care-portal"
    );
  };

  const clearUserDeviceDetails = () => {
    if (Platform.OS == "android") {
      SecureStore.deleteItemAsync("firstName", SecureStore.WHEN_UNLOCKED).then(
        (data) => setStoredFirstName(null)
      );
      SecureStore.deleteItemAsync(
        "phoneNumber",
        SecureStore.WHEN_UNLOCKED
      ).then((data) => setStoredPhoneNumberData(null));
      SecureStore.deleteItemAsync("pass", SecureStore.WHEN_UNLOCKED).then(
        (data) => setStoredPassData(null)
      );
    } else {
      SecureStore.deleteItemAsync("firstName").then((data) =>
        setStoredFirstName(null)
      );
      SecureStore.deleteItemAsync("phoneNumber").then((data) =>
        setStoredPhoneNumberData(null)
      );
      SecureStore.deleteItemAsync("pass").then((data) =>
        setStoredPassData(null)
      );
    }
  };

  const forgotPasswordSignUpComponent = ({ newUser }) => {
    return (
      <View style={{ marginTop: 25 }}>
        <AppText
          bold="true"
          styles={{
            ...styles.loginIntro,
            marginBottom: 10,
            textAlign: "center",
            color: "#266ddc",
            fontSize: 16,
          }}
        >
          {newUser ? (
            <Text onPress={() => _forgotPasswordViewHandler()}>
              Forgot Password
            </Text>
          ) : (
            <AppText
              bold="true"
              styles={{
                ...styles.loginIntro,
                marginBottom: 30,
                textAlign: "center",
                fontSize: 16,
              }}
            >
              Forgot Password?{" "}
              <Text
                style={{ color: "#266ddc" }}
                onPress={() => navigation.navigate("Register")}
              >
                Click here to Reset
              </Text>
            </AppText>
          )}
        </AppText>

        {newUser && (
          <AppText
            bold="true"
            styles={{
              ...styles.loginIntro,
              marginBottom: 30,
              textAlign: "center",
              fontSize: 16,
            }}
          >
            Don't have an account?{" "}
            <Text
              style={{ color: "#266ddc" }}
              onPress={() => navigation.navigate("Register")}
            >
              Sign up
            </Text>
          </AppText>
        )}
      </View>
    );
  };

  const serveWithSavedData = () => {
    return (
      <View style={styles.viewContainer}>
        <AppText bold styles={{ fontSize: 25 }}>
          Welcome, {storedFirstName}
        </AppText>
        <AppText regular styles={{ ...styles.loginIntro, marginTop: 7 }}>
          Sign in with password or Biometrics to continue.
        </AppText>

        <View style={{ marginTop: 32 }}>
          <AppText bold styles={{ fontSize: 16 }}>
            Password
          </AppText>
          <View
            style={{
              ...styles.textInput,
              marginTop: 8,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextInput
              style={{ flexBasis: "80%" }}
              placeholder="Enter Password"
              placeholderTextColor="gray"
              textContentType="password"
              secureTextEntry={!showPassword}
              autoComplete="off"
              onChangeText={(text) => onValueChange("password", text)}
            />
            {loginData.payload.password.length > 0 && (
              <TouchableOpacity
                onPress={() => setShowPassword((prevState) => !prevState)}
              >
                <FontAwesome5
                  name={showPassword ? "eye-slash" : "eye"}
                  size={15}
                  color="gray"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-around",
            display: `${!displaySpinner ? "flex" : "none"}`,
          }}
        >
          <AppButton
            styles={{ ...styles.loginButton, width: "80%" }}
            onPress={() => loginUserFunctionII()}
          >
            <AppText styles={styles.buttonText}>Sign in</AppText>
          </AppButton>

          {biometricHardwareType.includes(1) && (
            <AppButton
              styles={styles.thumbButton}
              onPress={() => handleLoginPress()}
            >
              <MaterialCommunityIcons
                name="fingerprint"
                size={24}
                color="white"
              />
            </AppButton>
          )}

          {biometricHardwareType.includes(2) && (
            <TouchableOpacity
              style={styles.thumbButton}
              onPress={() => handleLoginPress()}
            >
              <Image
                style={{ height: 30, width: 30, resizeMode: "contain" }}
                source={require("../../assets/face.png")}
              />
            </TouchableOpacity>
          )}

          {biometricHardwareType.length == 0 && (
            <AppButton styles={styles.thumbButton}>
              <MaterialIcons name="lock" size={24} color="white" />
            </AppButton>
          )}
        </View>

        <View
          style={{
            justifyContent: "center",
            display: `${displaySpinner ? "flex" : "none"}`,
          }}
        >
          <Spinner color="blue.700" size="lg" />
        </View>

        <AppText
          bold="true"
          styles={{
            ...styles.loginIntro,
            marginTop: 25,
            textAlign: "center",
            color: "#266ddc",
            fontSize: 16,
          }}
        >
          <Text onPress={() => clearUserDeviceDetails()}>
            Not You? <Text style={{ color: "#FF3B30" }}>Remove Account</Text>
          </Text>
        </AppText>

        {forgotPasswordSignUpComponent({ newUser: false })}
      </View>
    );
  };

  const serveasNew = () => {
    return (
      <View style={styles.viewContainer}>
        <AppText bold styles={{ fontSize: 25 }}>
          Log in to your account,
        </AppText>
        <AppText regular styles={{ ...styles.loginIntro, marginTop: 7 }}>
          Sign in to your account to continue enjoying VetroPay.
        </AppText>

        <View style={{ marginTop: 32 }}>
          <View
            style={{
              marginTop: 10,
              borderWidth: 0.5,
              borderColor: "#266ddc",
              borderRadius: 8,
              height: 56,
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
            keyboardType="numeric"
            autoComplete="off"
            onChangeText={(text) => onValueChange("phoneNumber", text)}
          />

          <View
            style={{
              ...styles.textInput,
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextInput
              style={{ flexBasis: "80%" }}
              placeholder="Password"
              placeholderTextColor="gray"
              textContentType="password"
              secureTextEntry={!showPassword}
              autoComplete="off"
              onChangeText={(text) => onValueChange("password", text)}
            />
            {loginData.payload.password.length > 0 && (
              <TouchableOpacity
                onPress={() => setShowPassword((prevState) => !prevState)}
              >
                <FontAwesome5
                  name={showPassword ? "eye-slash" : "eye"}
                  size={15}
                  color="gray"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <AppButton
            styles={{
              ...styles.loginButton,
              width: "100%",
              display: `${!displaySpinner ? "flex" : "none"}`,
            }}
            onPress={() => loginUserFunction()}
          >
            <AppText bold styles={styles.buttonText}>
              Sign In
            </AppText>
          </AppButton>
          <View
            style={{
              justifyContent: "center",
              display: `${displaySpinner ? "flex" : "none"}`,
            }}
          >
            <Spinner color="blue.700" size="lg" />
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableAutomaticScroll
      extraScrollHeight={10}
      enableOnAndroid={true}
      extraHeight={Platform.select({ android: 150 })}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Image
          source={VETROPAY_LOGO}
          style={{
            marginTop: 40,
            height: 50,
            width: 150,
            resizeMode: "contain",
            alignSelf: "center",
          }}
        />
        <OfflineNotice variant={netInfo.isConnected} />
        {/* {storedFirstName !== null && serveWithSavedData()}
        {storedFirstName == null && serveasNew()} */}

        {serveWithSavedData()}

        {/* {storedFirstName == null &&
          forgotPasswordSignUpComponent({ newUser: true })} */}
      </View>
    </KeyboardAwareScrollView>
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
    marginTop: 35,
  },
  loginIntro: {
    color: "gray",
  },
  textInput: {
    height: 56,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 0.5,
    borderColor: "#266ddc",
    borderRadius: 8,
    borderBottomColor: "#266DDC",
  },
  loginButton: {
    marginTop: 10,
    backgroundColor: "#266ddc",
    width: "70%",
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    elevation: 3,
    borderRadius: 8,
  },
  thumbButton: {
    marginTop: 10,
    backgroundColor: "#266ddc",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    elevation: 3,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
});
