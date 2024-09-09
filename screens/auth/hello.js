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
    Platform,Dimensions,ScrollView,Modal,FlatList
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
  import logo from "../../assets/logo.png";
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
  import {
    normalizeFontSize
  } from "../../resources/utils";
  import Fontisto from '@expo/vector-icons/Fontisto';
  import DateTimePicker from '@react-native-community/datetimepicker';
  
  
  
  export default function Login({ navigation, route }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
   
    const scrollViewRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0); // Track the current slide
  
    const { width } = Dimensions.get('window');
  
    const goToNextSlide = () => {
   if (currentSlide < 4) {
    scrollViewRef.current.scrollTo({ x: (currentSlide + 1) * width, animated: true });
    setCurrentSlide(currentSlide + 1);
  }
    };
  
    const goToPreviousSlide = () => {
     if (currentSlide > 0) {
      scrollViewRef.current.scrollTo({ x: (currentSlide - 1) * width, animated: true });
      setCurrentSlide(currentSlide - 1);
    }
    };
  
    const [emailverify, setemailverify] = useState({
      input1: "",
      inputverify1:true,
      input2: "",
      inputverify2:true,
      input3:"",
      inputverify3:true,
      input4:"",
      inputverify4:true,
    });
  
  
    const handleOpenCountryModal = () => {
      openCountryModalRef.current?.expand();
      setOpenCountryModal(true);
    };
  
    const [selectedLanguage, setSelectedLanguage] = useState('');
  
    const languages = [
      { label: 'English', value: 'EN',image: require('../../assets/english.png')  },
      { label: 'Français', value: 'FR',image: require('../../assets/french.png')  },
      { label: 'Chiness', value: 'FN',image: require('../../assets/chiness.png')  },
    ];
  
  
    const countries9 = [
      { name: 'Nigeria', code: 'ngn',image: require('../../assets/ngn.png') },
      { name: 'China', code: 'china',image: require('../../assets/chiness.png') },
      { name: 'Ghana', code: 'ghana',image: require('../../assets/ghana.png') },
      { name: 'Kenya', code: 'Kenya',image: require('../../assets/kenya.png') },
     
      // Add more countries as needed
    ];
    const renderItem = ({ item }) => (
      <TouchableOpacity
        style={styles.countryItem}
        onPress={() => handleCountrySelect(item)}
      >
          <Image 
              source={item.image} 
              style={{ width: 80, height: 76, }} 
            />
        <Text style={styles.countryText}>{item.name}</Text>
      </TouchableOpacity>
    );
    
    const selectCountry = (country) => {
      setLoginData((prevState) => ({
        ...prevState,
        payload: {
          ...prevState.payload,
          country,
        },
      }));
      //bottomSheetRef.current?.close(); // Close the bottom sheet after selection
    };
  
    const countries = [
  
      { label: '🇳🇬 Nigeria', value: 'NIGERIA' },
      { label: '🇰🇪 Kenya', value: 'KENYA' },
      { label: '🇬🇧 UK', value: 'UK' },
      { label: '🇨🇲 Cameroon', value: 'CAMEROON' },
      { label: '🇨🇳 China', value: 'CHINA' },
    ];
    
   // const selectedCountry = countries.find(    (country) => country.value === loginData?.payload?.country  );
   
  
  
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
  
    const onChange = (event, selectedDate) => {
      setShowPicker(Platform.OS === 'ios');
      if (selectedDate) {
        setDate(selectedDate);
      }
    };
  
    const showDatePicker = () => {
      setShowPicker(true);
    };
    
    
    const [selectedValue, setSelectedValue] = useState('');
    const [isPickerVisible, setIsPickerVisible] = useState(false);
  
    const togglePicker = () => {
      setIsPickerVisible(!isPickerVisible);
    };
  
    const onageChange = (itemValue) => {
      setSelectedValue(itemValue);
      setIsPickerVisible(false); // Hide the picker after selecting a value
    };
  
    const toast = useToast();
    const openTelcoModalRef = useRef(null);
    const openExtraModalRef = useRef(null);
    const openCountryModalRef = useRef(null);
  
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
    const [openCountryModal, setOpenCountryModal] = useState(true);
    const bottomSheetModalSnapPoints = useMemo(() => ["1%", "50%", "70%"], []);
    
    const bottomSheetModalSnapPointsforcountry = useMemo(() => ["1%", "50%", "70%", "80%"], []);
   
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
  
  
      {goToNextSlide()}
  
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
  const alreadycreatedaccount=()=>{
    return(
      <View style={{ marginTop: 25 }}>
          <AppText
            bold="true"
            styles={{
              ...styles.loginIntro,
              marginBottom: 10,
              textAlign: "center",
              color: "#414141",
              fontSize: 16,
            }}
          >
          Already Have An Account?{" "}
          <Text
            style={{ color: "#266ddc" }}
            onPress={() => navigation.navigate("Login")}
          >
          Log in
          </Text>
        </AppText>
    </View>
    );
  }
  
  
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
  
    const pickcountry = () => {
      return (
  
  <View  style={styles.bottomsheetContainer1}>
   <View
             style={{
              flex:1
             }}
           >
  
  
      <View style={{alignItems:"flex-end"}}>
  <AppButton onPress={() => handleOpenCountryModal()}  styles={{
               marginTop: 20,
               borderRadius: 4,
               height: 37,
               width:85,
               justifyContent:"center",
               alignItems:"center",
               backgroundColor:"#F4F4F4",
             }}>
         
         
  
          <AppText style={styles.buttonText}>
           {countries.find(c => c.value === loginData.payload.country)?.label || 'Select a Country'}
          </AppText>
       </AppButton>
  
       
  </View>
  
           </View>
           </View>
       
      );};
  
  
    const serveasNew = () => {
  
  
      return (
        
  <View style={styles.viewContainer1}>
  <View style={styles.dotsContainer}>
    {[0, 1, 2,3,4].map((_, index) => (
      <View
        key={index}
        style={[
          styles.dot,
          { opacity: currentSlide >= index ? 1 : 0.3 }, // Change opacity for current and previous dots
        ]}
      />
    ))}
  </View>
        
  <ScrollView
  horizontal
  pagingEnabled
  showsHorizontalScrollIndicator={false}
  scrollEnabled={false} 
  ref={scrollViewRef}
  >
  
  
  <View style={[styles.slide, { width }]}>
  
  {pickcountry()}
  
          <AppText medium styles={{ fontSize: 25,marginTop:100,color:"red" }}>
          Create Your Account
          </AppText>
          <AppText regular styles={{ ...styles.loginIntro1, marginTop: 8 }}>
          Enter Your Details To Create Account
          </AppText>
  
  
          <View style={{flexDirection:"column",marginTop:40,gap:24 }}>
         
            <View >
  
            <AppText medium styles={{ ...styles.Lable,fontSize:16}}>First Name</AppText>
           <TextInput
                style={{ ...styles.textInput,}}
                placeholder="First Name"
                placeholderTextColor="#A0A0A0"
                  />
            </View>
            <View>
              <AppText medium styles={{ ...styles.Lable,fontSize:16}}>Last Name</AppText>
              <TextInput
             style={{ ...styles.textInput,}}
              placeholder="Last Name"
              placeholderTextColor="#A0A0A0"
               />
            </View>
       
  
           <View>
           <AppText medium styles={{ ...styles.Lable,fontSize:16}}>Password</AppText>
           <View
              style={{
                ...styles.textInput,
                
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
             
              <TextInput
                style={{ flexBasis: "80%" }}
                placeholder="create password"
                placeholderTextColor="#A0A0A0"
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
  <View>
  <AppText medium styles={{ ...styles.Lable,fontSize:16}}>Confirm Password</AppText>
  <View
              style={{
                ...styles.textInput,
               
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              
              <TextInput
                style={{ flexBasis: "80%" }}
                placeholder="re-enter password"
                placeholderTextColor="#A0A0A0"
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
                width: "100%",marginTop:85,
                display: `${!displaySpinner ? "flex" : "none"}`,
              }}
              onPress={() => loginUserFunction()}
            >
              <AppText bold styles={styles.buttonText1}>
              Proceed
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
  
  
  <View style={[styles.slide, { width }]}>
    <TouchableOpacity style={{marginTop:24}} onPress={goToPreviousSlide}>
  <MaterialIcons name="keyboard-backspace" size={24} color="#1C1B1F" />
  </TouchableOpacity>
  
  <AppText medium styles={{ fontSize: 25,marginTop:11 }}>
  Phone Number
          </AppText>
          <AppText regular styles={{ ...styles.loginIntro1, marginTop: 8 }}>
          Confirm Your Phone Number
          </AppText>
  
  
  
  
  
  <View style={{flexDirection:"column",marginTop:40}}>
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
                        medium
                        style={{
                          fontSize: 14,
                          color: "#000000",
                        }}
                      >
                       MTN-NG
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
                       medium
                        style={{
                          fontSize: 14,
                          color: "#000000",
                        }}
                      >
                        GLO-NG
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
  
  <View >
    <AppText medium styles={{ fontSize: 14,marginTop:24,color:"#121212" }}>Or Enter Phone Number</AppText>
    <TextInput
                style={{ ...styles.textInput,}}
                placeholder="Enter Phone Number"
                placeholderTextColor="#A0A0A0"
                  />
            
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
                width: "100%",marginTop:15,
               
              }}
              onPress={() => loginUserFunction()}
            >
              <AppText bold styles={styles.buttonText1}>
              Proceed
              </AppText>
            </AppButton>
        
           
          </View>
  
  
  </View>
  
  
  <View style={[styles.slide,{ width }]}>
  
  <View style={{marginTop:24,}}>
  
  <TouchableOpacity  onPress={goToPreviousSlide}>
  <MaterialIcons name="keyboard-backspace" size={24} color="#1C1B1F" />
  </TouchableOpacity>
  
  </View>
  
  <AppText medium styles={{ fontSize: 25,marginTop:11 }}>
  Create Transaction Pin
          </AppText>
          <AppText regular styles={{ ...styles.loginIntro1, marginTop: 8 }}>
          Create a 4 digit code for your transactions
            </AppText>
  
  
  
  
          <View style={{flexDirection:"column",marginTop:40,gap:24 }}>
         
            <View >
  
            <AppText medium styles={{ ...styles.Lable,fontSize:16}}>Transaction Pin</AppText>
           <TextInput
                style={{ ...styles.textInput,}}
                placeholder="Create Transaction Pin"
                placeholderTextColor="#A0A0A0"
                   />
            </View>
  
            <View>
              <AppText medium styles={{ ...styles.Lable,fontSize:16}}>Confirm Pin</AppText>
              <TextInput
             style={{ ...styles.textInput,}}
              placeholder="Re-Enter Transaction Pin"
              placeholderTextColor="#A0A0A0"
               />
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
                ...styles.loginButton,marginTop:186,
                width: "100%",
                display: `${!displaySpinner ? "flex" : "none"}`,
              }}
              onPress={() => loginUserFunction()}
            >
              <AppText bold styles={styles.buttonText}>
              Sign Up
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
          <View style={{ marginTop:8}}>
     <AppText
         medium
          styles={{
            ...styles.loginIntro,
            textAlign: "center",
            fontSize: 14,
            color:"#000000"
          }}
        >
        By creating account, you acknowledge and accept our <Text
            style={{ color: "#266ddc" }}
            onPress={() => navigation.navigate("Login")}
          > Terms of Service</Text> <Text>and</Text>{" "}
          <Text
            style={{ color: "#266ddc" }}
            onPress={() => navigation.navigate("Login")}
          >
           Privacy Policy
          </Text>
        </AppText>
    </View>
  </View>
  
  
  
  <View style={[styles.slide,{ width }]}>
  
  <View style={{marginTop:24,}}>
  
  <TouchableOpacity  onPress={goToPreviousSlide}>
  <MaterialIcons name="keyboard-backspace" size={24} color="#1C1B1F" />
  </TouchableOpacity>
  </View>
  
  <AppText medium styles={{ fontSize: 25,marginTop:11 }}>
  Enter OTP
          </AppText>
          <AppText regular styles={{ ...styles.loginIntro1, marginTop: 8 }}>
          Enter 4 digit code sent to your phone number
         </AppText>
  
  
         <View style={{display:"flex",flexDirection:"row",gap:12,marginTop:24,justifyContent:"center",alignItems:"center"}}>
        <TextInput
            style={styles.input}
            value={emailverify.input1}
            maxLength={1}
          />
  
           <TextInput
          style={styles.input}
          value={emailverify.input2}
          maxLength={1}
        />
  
         <TextInput
        style={styles.input}
        value={emailverify.input3}
        maxLength={1}
      /> 
      <TextInput
      style={styles.input}
      value={emailverify.input4}
     maxLength={1}
    />
    </View>
  
    <View style={{ marginTop: 16 }}>
     <AppText
         medium
          styles={{
            ...styles.loginIntro,
            marginBottom: 30,
            textAlign: "center",
            fontSize: 16,
            color:"#000000"
          }}
        >
          Didn’t get the code?{" "}
          <Text
            style={{ color: "#266ddc" }}
            onPress={() => navigation.navigate("Login")}
          >
         Resend it
          </Text>
        </AppText>
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
                ...styles.loginButton,marginTop:320,
                width: "100%",
                display: `${!displaySpinner ? "flex" : "none"}`,
              }}
              onPress={() => loginUserFunction()}
            >
              <AppText bold styles={styles.buttonText}>
              Proceed
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
  
  
  <View style={[styles.slide,{ width }]}>
  <View>
  
        {/* Modal to show the Picker */}
       
      </View>
  <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:24,}}>
  
  <TouchableOpacity  onPress={goToPreviousSlide}>
  <MaterialIcons name="keyboard-backspace" size={24} color="#1C1B1F" />
  </TouchableOpacity>
  <TouchableOpacity >
            <AppText
              bolder
              styles={{
                fontSize: normalizeFontSize(16),
                color: "#266ddc",
              }}
            >
              Skip
            </AppText>
          </TouchableOpacity>
  </View>
  
  <AppText medium styles={{ fontSize: 25,marginTop:11 }}>
  Enter Your Birthday
          </AppText>
          <AppText regular styles={{ ...styles.loginIntro1, marginTop: 8 }}>
          Get a surprise and a  handwritten Card from our CEO on your next birthday 
          </AppText>
  
          <View style={{flexDirection:"column",marginTop:40,gap:24 }}>
        
          <View>
  
            <AppText medium styles={{ ...styles.Lable,fontSize:16}}>Age Bracket</AppText>
            <View  style={{ ...styles.textInput, flexDirection: "row",justifyContent: "space-between", alignItems: "center",}}>
         <TextInput
                 style={{ flexBasis: "80%" }}
                placeholder="Select age bracket(optional)"
                placeholderTextColor="#A0A0A0"
                value={selectedValue}
                     /> 
              <TouchableOpacity >
                <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
              </TouchableOpacity> 
               {/**
               *  {isPickerVisible && (
          <Modal transparent={true} animationType="slide">
            <View  style={{ ...styles.textInput,backgroundColor:"red"}}>
              <View >
                <Picker
                  selectedValue={selectedValue}
                  onageChange={(itemValue) => onageChange(itemValue)}
                >
                  <Picker.Item label="18-24" value="18-24" />
                  <Picker.Item label="25-34" value="25-34" />
                  <Picker.Item label="35-44" value="35-44" />
                  <Picker.Item label="45-54" value="45-54" />
                  <Picker.Item label="55+" value="55+" />
                </Picker>
              </View>
            </View>
          </Modal>
        )}
               */}
             
              </View>
             
            </View>
  
            <View >
              <AppText medium styles={{ ...styles.Lable,fontSize:16}}>Enter Birthdate</AppText>
              <View  style={{
                ...styles.textInput,
               
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",}}>
          
              <TextInput
             style={{ flexBasis: "80%" }}
              placeholder="24th march"
              placeholderTextColor="#A0A0A0"
              value={date.toLocaleDateString()}
              autoComplete="off"
             />
             <TouchableOpacity onPress={showDatePicker}>
                <Fontisto style={{ justifyContent: "center" }} name="date" size={24} color="#266DDC"  />
              </TouchableOpacity>
              {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}
            </View>
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
                ...styles.loginButton,marginTop:85,
                width: "100%",
                display: `${!displaySpinner ? "flex" : "none"}`,
              }}
              onPress={() => loginUserFunction()}
            >
              <AppText bold styles={styles.buttonText}>
              Sign Up
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
  </ScrollView>
  
  
  
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
          {storedFirstName == null ? (
     
      <Image
        source={logo}
        style={{
          marginTop: 40, 
          height: 53,    
          width: 41,    
          resizeMode: "contain",
          marginHorizontal:20
        }}
      />
    ) : (
     
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
    )}
          
            <OfflineNotice variant={netInfo.isConnected} />
   
  {/** BOTTOM SHEET MODAL */}
       
            {storedFirstName !== null && serveWithSavedData()}
          {storedFirstName == null && serveasNew()} 
  
          {storedFirstName !== null ? (
          forgotPasswordSignUpComponent({ newUser: true })
        ) : (
          alreadycreatedaccount()
        )} 
  
  
  {/**
     {storedFirstName == null &&
           forgotPasswordSignUpComponent({ newUser: true })} 
         alreadycreatedaccount()}
   */}
  
  
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
              <View style={{ flex: 1, padding: 20, height: "100%",backgroundColor: "#F9FAFA", }}>
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
            
            <BottomSheet
         ref={openCountryModalRef}
         snapPoints={bottomSheetModalSnapPointsforcountry}
         backdropComponent={renderBackdrop}
         onChange={handleSheetChanges}
         index={0}
         onClose={() => setOpenCountryModal(false)}
         enablePanDownToClose
         handleIndicatorStyle={{ backgroundColor: "#C0C0C0", marginTop: 16 }}
     >
  
  
  <View style={styles.sheetContent}>
    <View>
            <AppText medium styles={{...styles.label,fontSize:20,marginTop:40}}>Select Your Country:</AppText>
            <FlatList
              data={countries}
              numColumns={0}
              keyExtractor={(item) => item.value}
              style={{marginTop:8,}}
              renderItem={({ item }) => (
                <TouchableOpacity
                style={[
                  styles.countryItem,
                  loginData?.payload?.country === item.value && styles.selectedCountry,
                ]}
                onPress={() => selectCountry(item.value)}
              >
                  <AppText styles={styles.countryText}>{item.label}</AppText>
                </TouchableOpacity>
              )}
            />
  
  
  
  <AppText medium styles={{ fontSize: 20, marginTop: 32, }}>Language:</AppText>
          <View style={styles.pickerContainer}>
  
            {languages.map((language) => (
              <TouchableOpacity
                key={language.value}
                style={[
                  styles.languageOption,
                  selectedLanguage === language.value && styles.selectedLanguage,
                ]}
                onPress={() => {
                  setSelectedLanguage(language.value);
                }}
              >
                <Image 
              source={language.image} 
              style={{ width: 80, height: 76,marginTop:8  }} 
            />
             <AppText medium styles={styles.languageText}>{language.label}</AppText>
              
              </TouchableOpacity>
            ))}
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
                width: "100%",marginTop:31,
                display: `${!displaySpinner ? "flex" : "none"}`,
              }}
              onPress={() => loginUserFunction()}
            >
              <AppText bold styles={styles.buttonText}>
              Done
              </AppText>
            </AppButton>
        
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
    viewContainer1: {
      //flex: 1,
      //backgroundColor:"red",
    },
    loginIntro: {
      color: "gray",
    },
    loginIntro1:{
      color:"#414141"
    },
    textInput: {
      height: 56,
      marginTop: 10,
      marginBottom: 10,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderWidth: 0.5,
      borderColor: "#D9D9D9",
      borderRadius: 8,
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
    loginButton1: {
      backgroundColor: "#266ddc",
      width: "70%",
      height: 56,
      alignItems: "center",
      justifyContent: "center",
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
    bottomsheetContainer1: {
      marginBottom: 50,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
     
    },
    bottomActionCTAText: {
      color: "#266DDC",
      lineHeight: 26,
      fontSize: 14,
     
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
    slide: {
      paddingHorizontal:20
    },
    dotsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      marginTop:16
    },
    dot: {
      width: 85,
      height: 4,
      borderRadius: 5,
      backgroundColor: '#266DDC',
      marginHorizontal: 5,
    },
    Lable:{
      color:"#121212",
    }, 
    input: {
      paddingHorizontal: 20,
      fontSize:20,
      paddingVertical: 6,
      width:56,
      height:56,
      color:"#000000",
      borderRadius:8,
      backgroundColor:"#F4F4F4"
    },
  
    pickerContainer: {
      marginTop: 8,
      backgroundColor: '#fff',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap:10
    
    },
    languageOption: {
    
    },
    languageText: {
      marginTop:8,
      fontSize: 14,
      color:"#000000",
      
      
    },
    
    buttonText: {
      color: "white",
      fontWeight: "500",
      fontSize: 16,
    },
    buttonText1: {
      color: '#FFFFFF',
      fontSize: 16,
    },
    selectedCountry: {
      backgroundColor: '#e0e0e0',
    },
    countryText: {
      fontSize: 24, // Adjust font size to fit flag icons
      color:"#000000",
    },
    sheetContent:{
      flex: 1, paddingHorizontal: 20
    }
  });
  
  
  
  
  
  
  
  
  
  
  {/**
  
  
  
     <View>
       <Picker
                 style={{ width: '100%' }}
                 
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
                 <Picker.Item label="🇳🇬 Nigeria " value="NIGERIA" />
                 <Picker.Item label="🇰🇪  Kenya" value="KENYA" />
               </Picker> 
  </View>
  
  
  
  
  
      <View style={{ flex: 1, padding: 16 }}>
           <Text style={{ fontSize: 18, marginBottom: 10 }}>Select your country:</Text>
         {/**
          *  <TouchableOpacity onPress={() => openCountryModalRef.current.expand()}>
         <Text>Select-Country</Text>
       </TouchableOpacity>
  
          * <CountryPicker
             withFilter
             withFlag
             withCountryNameButton
             withCallingCode
             withAlphaFilter
             withEmoji
             onSelect={(country) => {
               console.log(country);
             }}
             containerButtonStyle={{ alignItems: 'center' }}
           /> */}  {/*
           </View>
  
           <View
                style={{
                  marginTop: 10,
                  borderWidth: 0.5,
                  borderColor: "#266ddc",
                  borderRadius: 8,
                  height: 560,
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
                  <Picker.Item label="🇳🇬 " value="NIGERIA" />
                  <Picker.Item label="🇰🇪  Kenya" value="KENYA" />
                </Picker>
              </View>
           
           <Picker
                 style={{ width: '100%' }}
                 
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
                 <Picker.Item label="🇳🇬 Nigeria " value="NIGERIA" />
                 <Picker.Item label="🇰🇪  Kenya" value="KENYA" />
               </Picker> 
               
               */}
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
               <ScrollView>
              
               <View style={{ marginTop: 100 }}></View>
             
               <View style={styles.viewContainer}>
              
                 {/** Welcome Text */}
                 <AppText bold="true" styles={styles.loginBold}>
                   Hey 👋🏿,
                 </AppText>
                 <AppText bold="true" styles={styles.loginIntro}>
                   Sign up here to continue
                 </AppText>
   
                 <View>
                  
                   <TextInput
                     style={{ ...styles.textInput, marginTop: 20 }}
                     value={registerData.payload.firstName}
                     onChangeText={(text) => onValueChange("firstName", text)}
                     placeholder="First Name"
                     placeholderTextColor="gray"
                   />
   
                   <TextInput
                     style={{ ...styles.textInput }}
                     value={registerData.payload.lastName}
                     onChangeText={(text) => onValueChange("lastName", text)}
                     placeholder="Surname / Last Name"
                     placeholderTextColor="gray"
                   />
   
                   <TextInput
                     style={{ ...styles.textInput, marginTop: 10 }}
                     textContentType="telephoneNumber"
                     placeholder="Phone Number"
                     keyboardType="numeric"
                     placeholderTextColor="gray"
                     onChangeText={(text) => onValueChange("phoneNumber", text)}
                   />
   
                   <View style={{ ...styles.textInput, marginTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                     <TextInput
                       style={{ flexBasis: "80%" }}
                       placeholder="Password"
                       placeholderTextColor="gray"
                       textContentType="password"
                       secureTextEntry={!showPassword}
                       onChangeText={(text) => onValueChange("password", text)}
                     />
                     {registerData.payload.password.length > 0 && (
                       <TouchableOpacity onPress={() => setShowPassword((prevState) => !prevState)}>
                         <FontAwesome5 name={showPassword ? "eye-slash" : "eye"} size={15} color="gray" />
                       </TouchableOpacity>
                     )}
                     </View>
   
                     <View style={{ ...styles.textInput, marginTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                       <TextInput
                         style={{ flexBasis: "80%" }}
                         placeholder="Confirm Password"
                         placeholderTextColor="gray"
                         textContentType="password"
                         secureTextEntry={!showPassword}
                         onChangeText={(text) => onValueChange("confirmPassword", text)}
                       />
                       {registerData.payload.confirmPassword.length > 0 && (
                           <TouchableOpacity onPress={() => setShowPassword((prevState) => !prevState)}>
                             <FontAwesome5 name={showPassword ? "eye-slash" : "eye"} size={15} color="gray" />
                           </TouchableOpacity>
                         )}
                     </View>
   
                   <AppButton styles={{ ...styles.signupButton, display: `${!displaySpinner ? "flex" : "none"}` }} onPress={() => goToAuthCode()}>
                     <AppText bold="true" styles={{ color: "#FFFFFF", fontSize: 18 }}>
                       Sign Up
                     </AppText>
                   </AppButton>
                   <View style={{ justifyContent: "center", display: `${displaySpinner ? "flex" : "none"}` }}>
                     <Spinner color="blue.700" size="lg" />
                   </View>
   
                   <AppText styles={{ marginTop: 10 }}>
                     By proceeding you agree to our{" "}
                     <Text style={{ color: "#266ddc", fontWeight: "700" }} onPress={() => setModalOpen(true)}>
                       Privacy Policy and Terms of Service
                     </Text>
                   </AppText>
   
                   <AppText styles={{ marginTop: 30, marginBottom: 50, fontSize: 16, textAlign: "center" }}>
                     <Text style={{ fontWeight: "500" }}>
                       Already a user?{" "}
                       <Text onPress={() => navigation.navigate("Login")} style={{ color: "#266DDC", fontWeight: "bold" }}>
                         Log In
                       </Text>
                     </Text>
                   </AppText>
                 </View>
               </View>
             </ScrollView>