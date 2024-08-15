import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  Fragment,
} from "react";
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
import chip_extraction from "../../assets/chip_extraction.png";
import sim_card from "../../assets/sim_card.png";
import GLO from "../../assets/GLO.png";
import MTN from "../../assets/MTN.png";
import calculate from "../../assets/calculate.png";
import currency_exchange from "../../assets/currency_exchange.png";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BottomSheet, {
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";

export default function Login({ navigation, route }) {
  const toast = useToast();
  const openTelcoModalRef = useRef(null);
  const openExtraModalRef = useRef(null);
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
  const [openTelcoModal, setOpenTelcoModal] = useState(true);
  const [openExtraModal, setOpenExtraModal] = useState(true);
  const bottomSheetModalSnapPoints = useMemo(() => ["1%", "50%", "70%"], []);

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

  const handleOpenTelcoModal = () => {
    openTelcoModalRef.current?.expand();
    setOpenTelcoModal(true);
  };

  const closeTelcoModal = () => {
    setOpenTelcoModal(!openTelcoModal);
    openTelcoModalRef.current?.close();
  };

  const handleOpenExtraModal = () => {
    openExtraModalRef.current?.expand();
    setOpenExtraModal(true);
  };

  const closeExtraModal = () => {
    setOpenExtraModal(!openExtraModal);
    openExtraModal.current?.close();
  };

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

  const bottomSheetComponent = () => {
    return (
      <View style={styles.bottomsheetContainer}>
        <TouchableOpacity
          style={styles.bottomActionCTAContainer}
          onPress={() => handleOpenTelcoModal()}
        >
          <Image
            source={sim_card}
            style={{ height: 22, width: 22, resizeMode: "contain" }}
          />
          <AppText medium styles={styles.bottomActionCTAText}>
            Telco Balance
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomActionCTAContainer}
          onPress={() => handleOpenExtraModal()}
        >
          <Image
            source={chip_extraction}
            style={{ height: 22, width: 22, resizeMode: "contain" }}
          />
          <AppText medium styles={styles.bottomActionCTAText}>
            Extras
          </AppText>
        </TouchableOpacity>

        {/** REFRENCED MODAL IS AVAILABLE AT THE TAIL END OF THE FILE */}
      </View>
    );
  };

  const serveWithSavedData = () => {
    return (
      <Fragment>
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

            {biometricHardwareType.includes(1) &&
              !biometricHardwareType.includes(2) && (
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
        {bottomSheetComponent()}
      </Fragment>
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

  const renderBackdrop = (props) => (
    <BottomSheetBackdrop {...props} opacity={0.5} />
  );

  const handleSheetChanges = useCallback((index) => {}, []);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableAutomaticScroll
      extraScrollHeight={10}
      enableOnAndroid={true}
      extraHeight={Platform.select({ android: 150 })}
      showsVerticalScrollIndicator={false}
    >
      <BottomSheetModalProvider>
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

        {/** BOTTOM SHEET MODAL */}
        <Fragment>
          <BottomSheet
            backdropComponent={renderBackdrop}
            onChange={handleSheetChanges}
            ref={openTelcoModalRef}
            index={0}
            snapPoints={bottomSheetModalSnapPoints}
            onClose={() => setOpenTelcoModal(false)}
            enablePanDownToClose
            handleIndicatorStyle={{ backgroundColor: "#C0C0C0", marginTop: 16 }}
          >
            <View
              style={{
                flex: 1,
                padding: 20,
                height: "100%",
                flex: 1,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 16,
                height: 200,
                backgroundColor: "#F9FAFA",
              }}
            >
              <AppText
                bold
                styles={{ fontSize: 20, fontWeight: "500", marginTop: 4 }}
              >
                Telco Balance
              </AppText>
              {/** TELCO ELEMENT CONTAINER */}
              <View
                style={{
                  flexDirection: "column",
                  gap: 8,
                  height: 150,
                  backgroundColor: "#F4F4F4",
                  marginTop: 8,
                  padding: 20,
                  gap: 6,
                  borderRadius: 8,
                }}
              >
                {/** UPPER ROW INFORMATION */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {/** MOBILE INFO */}
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    {/** MOBILE OPERATOR LOGO */}
                    <Image
                      source={MTN}
                      style={{
                        height: 40,
                        width: 40,
                        resizeMode: "contain",
                      }}
                    />
                    {/** END MOBILE OPERATOR LOGO */}

                    {/** MOBILE PHONE NUMBER */}
                    <AppText
                      bold
                      style={{
                        fontSize: 14,
                        color: "#121212",
                      }}
                    >
                      0801 000 0000
                    </AppText>
                    {/** END MOBILE PHONE NUMBER */}
                  </View>
                  {/** END MOBILE INFO */}

                  {/** SIM ICON */}
                  <View style={{ flexDirection: "row", gap: 4 }}>
                    <Image
                      source={sim_card}
                      style={{
                        height: 22,
                        width: 22,
                        resizeMode: "contain",
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        marginTop: 3,
                        color: "#266DDC",
                        fontWeight: "500",
                      }}
                    >
                      SIM 1
                    </Text>
                  </View>
                  {/** END SIM ICON */}
                </View>
                {/** END UPPER ROW INFORMATION */}

                <View
                  style={{
                    marginTop: 12,
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  {/** CHECK AIRTIME BALANCE */}
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#266DDC",
                      height: 40,
                      width: "45%",
                      borderRadius: 4,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() => {
                      /**
                       * LEAVE DOCUMENTATION HERE TO HIGHLIGHT "react-native-phone-call" VS "react-native-immediate-phone-call"
                       * 
                      const args = {
                        number: "*310#".replace("*", "%2a").replace("#", "%23"), // String value with the number to call
                        prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call
                        skipCanOpen: true, // Skip the canOpenURL check
                      };
                      call(args).catch(console.error)
                       */

                      let number = "*310#";
                      RNImmediatePhoneCall.immediatePhoneCall(number);
                    }}
                  >
                    <AppText
                      bold
                      styles={{
                        fontSize: 12,
                        color: "#FFFFFF",
                      }}
                      numberOfLines={1}
                    >
                      Check Airtime Balance
                    </AppText>
                  </TouchableOpacity>
                  {/** END CHECK AIRTIME BALANCE */}

                  {/** CHECK DATA BALANCE */}
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#F4F4F4",
                      height: 40,
                      width: "45%",
                      borderRadius: 4,
                      alignItems: "center",
                      justifyContent: "center",
                      borderColor: "#266DDC",
                      borderWidth: 1.5,
                      borderRadius: 4,
                    }}
                    onPress={() => {
                      let number = "*312#";
                      RNImmediatePhoneCall.immediatePhoneCall(number);
                    }}
                  >
                    <AppText
                      bold
                      styles={{
                        fontSize: 12,
                        color: "#266DDC",
                      }}
                      numberOfLines={1}
                    >
                      Check Data Balance
                    </AppText>
                  </TouchableOpacity>
                  {/** CHECK DATA BALANCE */}
                </View>
              </View>
              {/** END TELCO ELEMENT CONTAINER */}




              <View
                style={{
                  flexDirection: "column",
                  gap: 8,
                  height: 150,
                  backgroundColor: "#F4F4F4",
                  marginTop: 8,
                  padding: 20,
                  gap: 6,
                  borderRadius: 8,
                }}
              >
                {/** UPPER ROW INFORMATION */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {/** MOBILE INFO */}
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    {/** MOBILE OPERATOR LOGO */}
                    <Image
                      source={GLO}
                      style={{
                        height: 40,
                        width: 40,
                        resizeMode: "contain",
                      }}
                    />
                    {/** END MOBILE OPERATOR LOGO */}

                    {/** MOBILE PHONE NUMBER */}
                    <AppText
                      bold
                      style={{
                        fontSize: 14,
                        color: "#121212",
                      }}
                    >
                      0801 000 0000
                    </AppText>
                    {/** END MOBILE PHONE NUMBER */}
                  </View>
                  {/** END MOBILE INFO */}

                  {/** SIM ICON */}
                  <View style={{ flexDirection: "row", gap: 4 }}>
                    <Image
                      source={sim_card}
                      style={{
                        height: 22,
                        width: 22,
                        resizeMode: "contain",
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        marginTop: 3,
                        color: "#266DDC",
                        fontWeight: "500",
                      }}
                    >
                      SIM 2
                    </Text>
                  </View>
                  {/** END SIM ICON */}
                </View>
                {/** END UPPER ROW INFORMATION */}

                <View
                  style={{
                    marginTop: 12,
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  {/** CHECK AIRTIME BALANCE */}
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#266DDC",
                      height: 40,
                      width: "45%",
                      borderRadius: 4,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() => {
                      /**
                       * LEAVE DOCUMENTATION HERE TO HIGHLIGHT "react-native-phone-call" VS "react-native-immediate-phone-call"
                       * 
                      const args = {
                        number: "*310#".replace("*", "%2a").replace("#", "%23"), // String value with the number to call
                        prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call
                        skipCanOpen: true, // Skip the canOpenURL check
                      };
                      call(args).catch(console.error)
                       */

                      let number = "*310#";
                      RNImmediatePhoneCall.immediatePhoneCall(number);
                    }}
                  >
                    <AppText
                      bold
                      styles={{
                        fontSize: 12,
                        color: "#FFFFFF",
                      }}
                      numberOfLines={1}
                    >
                      Check Airtime Balance
                    </AppText>
                  </TouchableOpacity>
                  {/** END CHECK AIRTIME BALANCE */}

                  {/** CHECK DATA BALANCE */}
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#F4F4F4",
                      height: 40,
                      width: "45%",
                      borderRadius: 4,
                      alignItems: "center",
                      justifyContent: "center",
                      borderColor: "#266DDC",
                      borderWidth: 1.5,
                      borderRadius: 4,
                    }}
                    onPress={() => {
                      let number = "*312#";
                      RNImmediatePhoneCall.immediatePhoneCall(number);
                    }}
                  >
                    <AppText
                      bold
                      styles={{
                        fontSize: 12,
                        color: "#266DDC",
                      }}
                      numberOfLines={1}
                    >
                      Check Data Balance
                    </AppText>
                  </TouchableOpacity>
                  {/** CHECK DATA BALANCE */}
                </View>
              </View>
            </View>
          </BottomSheet>

          <BottomSheet
            backdropComponent={renderBackdrop}
            onChange={handleSheetChanges}
            ref={openExtraModalRef}
            index={0}
            snapPoints={bottomSheetModalSnapPoints}
            onClose={() => setOpenExtraModal(false)}
            enablePanDownToClose
            handleIndicatorStyle={{ backgroundColor: "#C0C0C0", marginTop: 16 }}
          >
            <View style={{ flex: 1, padding: 20, height: "100%" }}>
              <AppText
                bold
                styles={{ fontSize: 20, fontWeight: "500", color: "#000000" }}
              >
                Extras
              </AppText>
              <View style={{ flexDirection: "row", gap: 8, marginTop: 16 ,justifyContent:"center",alignItems:"center"}}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#F4F4F4",
                    height: 100,
                    width: 156,
                    borderRadius: 4,
                    flexDirection: "column",
                    borderColor: "#266DDC",
                    borderWidth: 1,
                    justifyContent:"center",
                    alignItems:"center"
                 
                  }}
                  onPress={() => navigation.navigate("Calculator")}
                >
                  <Image
                    source={calculate}
                    style={{
                      height: 40,
                      width: 40,
                      resizeMode: "contain",
                      marginLeft: 12,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      padding: 9,
                      color: "#266DDC",
                      fontWeight: "500",
                    }}
                    numberOfLines={1}
                  >
                    Calculator
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#F4F4F4",
                    height: 100,
                    width: 156,
                    borderRadius: 4,
                    flexDirection: "column",
                    justifyContent:"center",
                    alignItems:"center"
                  }}
                  onPress={() => navigation.navigate("FXrate")}
                >
                  <Image
                    source={currency_exchange}
                    style={{
                      height: 40,
                      width: 40,
                      resizeMode: "contain",
                      marginLeft: 12,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      padding: 9,
                      color: "#266DDC",
                      fontWeight: "500",
                    }}
                    numberOfLines={1}
                  >
                    FX Rates
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheet>
        </Fragment>
        {/** END BOTTOM SHEET MODAL */}
      </BottomSheetModalProvider>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
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
  bottomsheetContainer: {
    height: 56,
    marginBottom: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  bottomActionCTAText: {
    color: "#266DDC",
    lineHeight: 26,
    fontSize: 14,
    marginLeft: 4,
  },
  bottomActionCTAContainer: {
    backgroundColor: "#D4E2F8",
    borderRadius: 4,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    width: "40%",
    flexDirection: "row",
  },
});
