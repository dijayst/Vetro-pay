import React, { useState, useEffect, useRef ,Fragment,useMemo,useCallback} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dimensions, Modal, View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity,Platform,FlatList } from "react-native";
import AppText from "../../resources/AppText";
import { AppButton, PrimaryButton } from "../../resources/AppButton";
import { AntDesign, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import logo_mark from "../../assets/logo_mark.png";
import { Spinner, useToast, Box, Text as NativeBaseText } from "native-base";
import { postPreReg, postRegAuth, registerUser } from "../../containers/regvalidate/action";
import { toastColorObject } from "../../resources/rStyledComponent";
import { Picker as RNPicker } from "@react-native-picker/picker";
import { Select } from "native-base";
import GLO from "../../assets/GLO.png";
import MTN from "../../assets/MTN.png";
import chip_extraction from "../../assets/chip_extraction.png";
import sim_card from "../../assets/sim_card.png";
import {
  normalizeFontSize
} from "../../resources/utils";
import Fontisto from '@expo/vector-icons/Fontisto';
import DateTimePicker from '@react-native-community/datetimepicker';
import BottomSheet, {
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";

const DoneIcon = require("../../assets/done.png");

export default function Register({ navigation }) {
  
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


  const [selectedLanguage, setSelectedLanguage] = useState('');

  const languages = [
    { label: 'English', value: 'EN',image: require('../../assets/english.png')  },
    { label: 'Français', value: 'FR',image: require('../../assets/french.png')  },
    { label: 'Chiness', value: 'FN',image: require('../../assets/chinese.png')  },
  ];


  const [openCountryModal, setOpenCountryModal] = useState(true);
 
  const handleOpenCountryModal = () => {
    openCountryModalRef.current?.expand();
    setOpenCountryModal(true);
  };

  const bottomSheetModalSnapPointsforcountry = useMemo(() => ["1%", "50%", "70%", "75%"], []);
 
  const openCountryModalRef = useRef(null);


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
  const renderBackdrop = (props) => (
    <BottomSheetBackdrop {...props} opacity={0.5} />
  );

  
  const handleSheetChanges = useCallback((index) => {}, []);

  
   const handleCountrySelect = (value) => {
  setRegisterData(prevData => ({
    ...prevData,
    payload: {
      ...prevData.payload,
      selectedCountry: value
    }
  }));
  setOpenCountryModal(false); // Close modal
};


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
    setIsPickerVisible(false); 
  };

  

  const toast = useToast();
  const Picker = Platform.OS == "android" ? RNPicker : Select;
  const [stage, setStage] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [registerData, setRegisterData] = useState({
    payload: {
      country:  [

        { label: '🇳🇬 Nigeria', value: 'NIGERIA' },
        { label: '🇰🇪 Kenya', value: 'KENYA' },
        { label: '🇬🇧 UK', value: 'UK' },
        { label: '🇨🇲 Cameroon', value: 'CAMEROON' },
        { label: '🇨🇳 China', value: 'CHINA' },
      ],
      selectedCountry: "",
      firstName: "",
      lastName: "",
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
          toast.show({
            render: () => (
              <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
                <NativeBaseText style={{ color: "#FFFFFF" }}>{preRegResponse[preRegResponse.length - 1]["message"]}</NativeBaseText>
              </Box>
            ),
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
          toast.show({
            render: () => (
              <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
                <NativeBaseText style={{ color: "#FFFFFF" }}>{regAuthResponse[regAuthResponse.length - 1]["message"]}</NativeBaseText>
              </Box>
            ),
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
  const goTotransactionpin = async () => {
    if (registerData.payload.phoneNumber.length >= 7 && 12 > registerData.payload.phoneNumber.length) {
      toast.show({
        render: () => (
          <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
            <NativeBaseText style={{ color: "#FFFFFF" }}>Invalid Phone number</NativeBaseText>
          </Box>
        ),
      });
    } else {
      setDisplaySpinner(true);
  
      // Dispatch the action and await its result
    }
    setDisplaySpinner(false);
    goToNextSlide()
  };
  


  const goToAuthCode = () => {
    if (
      registerData.payload.firstName.length < 2 ||
      registerData.payload.lastName.length < 2 ||
      registerData.payload.password.length < 8 ||
      registerData.payload.password !== registerData.payload.confirmPassword
    ) {
      if (registerData.payload.firstName === "" || registerData.payload.lastName === "") {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>First name and Last name must be added</NativeBaseText>
            </Box>
          ),
        });
      } else if (registerData.payload.firstName.length < 2 || registerData.payload.lastName.length < 2) {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>Name cannot be less than 2 Characters</NativeBaseText>
            </Box>
          ),
        });
      }  else if (registerData.payload.password.length < 8) {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>Password cannot be less than 8 characters</NativeBaseText>
            </Box>
          ),
        });
      } else if (registerData.payload.password !== registerData.payload.confirmPassword) {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>"Confirm password" not the same as "Password"</NativeBaseText>
            </Box>
          ),
        });
      }
    } else {
      setDisplaySpinner(true);
      dispatch(postPreReg(registerData.payload.country, registerData.payload.phoneNumber, `${registerData.payload.firstName} ${registerData.payload.lastName}`));
      goToNextSlide();
      
    }
  };

  const goToSecurityPin = async() => {
    if (Number(registerData.payload.authCode) == NaN || registerData.payload.authCode == "") {
      toast.show({
        render: () => (
          <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
            <NativeBaseText style={{ color: "#FFFFFF" }}>Auth code incorrect</NativeBaseText>
          </Box>
        ),
      });
    }  else {
      setDisplaySpinner(true);
      dispatch(postRegAuth(registerData.payload.country, registerData.payload.phoneNumber, registerData.payload.authCode));
   goToNextSlide()
    }
  };


  
  const completeRegistration = () => {
    if (
       registerData.payload.transactionPin.length < 6 ||
      registerData.payload.transactionPin.length > 6 ||
      Number(registerData.payload.transactionPin) == NaN ||
      registerData.payload.transactionPin !== registerData.payload.confirmTransactionPin
    ) {
        if (registerData.payload.transactionPin.length < 6 || Number(registerData.payload.transactionPin) == NaN || registerData.payload.transactionPin.length > 6) {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>Transaction Pin must be 6 digit (numbers only)</NativeBaseText>
            </Box>
          ),
        });
      } else if (registerData.payload.transactionPin !== registerData.payload.confirmTransactionPin) {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>"Transaction Pin" and "Confirm transaction pin" must be the same</NativeBaseText>
            </Box>
          ),
        });
      }
    } else {
      setDisplaySpinner(true);
      dispatch(
        registerUser(
          registerData.payload.country,
          registerData.payload.phoneNumber,
          `${registerData.payload.firstName} ${registerData.payload.lastName}`,
          registerData.payload.password,
          registerData.payload.securityQuestion,
          registerData.payload.securityAnswer,
          registerData.payload.transactionPin
        )
      );
      navigation.navigate("Login")
    }
  };

  const onValueChange = (fieldName, value) => {
    if (fieldName == "firstName") {
      setRegisterData((prevState) => ({
        ...prevState,
        payload: {
          ...prevState.payload,
          firstName: value.replace(/\s\s+/g, " "),
        },
      }));
    } else if (fieldName == "lastName") {
      setRegisterData((prevState) => ({
        ...prevState,
        payload: {
          ...prevState.payload,
          lastName: value.replace(/\s/g, ""),
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

  const pickcountry = () => {
    return (

<View  style={styles.bottomsheetContainer1}>
 <View
           style={{
            flex:1
           }}
         >


    <View style={{alignItems:"flex-end"}}>
<AppButton onPress={() => handleOpenCountryModal()} 
 styles={{
             marginTop: 15,
             borderRadius: 4,
             height: 37,
             width:85,
             justifyContent:"center",
             alignItems:"center",
             backgroundColor:"#F4F4F4",
           }}>
       
       

        <AppText style={styles.buttonText}>
        {registerData.payload.selectedCountry
            ? registerData.payload.country.find(c => c.value === registerData.payload.selectedCountry)?.label
            : '🇳🇬 '}
        </AppText>
     </AppButton>

     
</View>

         </View>
         </View>
     
    );};
  
  const registrationProcess = () => {
    return (
      <ScrollView style={styles.container}>
      <Image
        source={logo_mark}
        style={{
          marginTop: 40, 
          height: 53,    
          width: 41,    
          resizeMode: "contain",
          marginHorizontal:20
        }}
      />
          
       
  
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
    {/*   <Picker
                    style={{ height: 45 }}
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
                    borderColor={"transparent"}
                  >
                    <Picker.Item label="🇳🇬  Nigeria" value="NIGERIA" />
                    <Picker.Item label="🇰🇪  Kenya" value="KENYA" />
                  </Picker>*/}
      {pickcountry()}
      
              <AppText medium styles={{ fontSize: 25,color:"#000000" }}>
              Create Your Account
              </AppText>
              <AppText regular styles={{ ...styles.loginIntro1, marginTop: 8 }}>
              Enter Your Details To Create Account
              </AppText>
      
      
              <View style={{flexDirection:"column",marginTop:40,gap:24 }}>
             
                <View >
      
                <AppText medium style={{ ...styles.Lable,fontSize:16}}>First Name</AppText>
               <TextInput
                    style={{ ...styles.textInput,}}
                    placeholder="First Name"
                    placeholderTextColor="#A0A0A0"
                    value={registerData.payload.firstName}
                    onChangeText={(text) => onValueChange("firstName", text)}
                   
                    />
                </View>
                <View>
                  <AppText medium style={{ ...styles.Lable,fontSize:16}}>Last Name</AppText>
                  <TextInput
                 style={{ ...styles.textInput,}}
                  placeholder="Last Name"
                  placeholderTextColor="#A0A0A0" 
                  value={registerData.payload.lastName}
                  onChangeText={(text) => onValueChange("lastName", text)}
                 />
                </View>
               
               <View>
               <AppText medium style={{ ...styles.Lable,fontSize:16}}>Password</AppText>
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
                    autoComplete="off"
                    secureTextEntry={!showPassword}
                    onChangeText={(text) => onValueChange("password", text)}
               
                />
                 {registerData.payload.password.length > 0 && (
                    <TouchableOpacity onPress={() => setShowPassword((prevState) => !prevState)}>
                      <FontAwesome5 name={showPassword ? "eye-slash" : "eye"} size={15} color="gray" />
                    </TouchableOpacity>
                  )}
                </View>
               </View>
      <View>
      <AppText medium style={{ ...styles.Lable,fontSize:16}}>Confirm Password</AppText>
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
                    autoComplete="off"
                    secureTextEntry={!showPassword}
                    onChangeText={(text) => onValueChange("confirmPassword", text)}
                 
                  />
                       {registerData.payload.password.length > 0 && (
                    <TouchableOpacity onPress={() => setShowPassword((prevState) => !prevState)}>
                      <FontAwesome5 name={showPassword ? "eye-slash" : "eye"} size={15} color="gray" />
                    </TouchableOpacity>
                  )}
                </View>
      
      </View>
               
      
      
              </View>

      <View >
      <AppButton styles={{ ...styles.signupButton, display: `${!displaySpinner ? "flex" : "none"}` }} onPress={() => goToNextSlide()}>
                  <AppText bold="true" styles={{ color: "#FFFFFF", fontSize: 16 }}>
                   Proceed
                  </AppText>
                </AppButton>
                <View style={{ justifyContent: "center", display: `${displaySpinner ? "flex" : "none"}` }}>
                  <Spinner color="blue.700" size="lg" />
                </View>

      </View>
             
              <View style={{ marginTop: 25 }}>
          <AppText
            medium
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
                    textContentType="telephoneNumber"
                    keyboardType="numeric"
                    onChangeText={(text) => onValueChange("phoneNumber", text)}
                      />
                
      </View>
      
      <View >
      <AppButton styles={{ ...styles.signupButton, display: `${!displaySpinner ? "flex" : "none"}` }} onPress={() => goTotransactionpin()}>
                  <AppText bold="true" styles={{ color: "#FFFFFF", fontSize: 16 }}>
                   Proceed
                  </AppText>
                </AppButton>
                <View style={{ justifyContent: "center", display: `${displaySpinner ? "flex" : "none"}` }}>
                <Spinner color="blue.700" size="lg" />
              </View>
             

      </View>
     
      <View style={{ marginTop: 25 }}>
          <AppText
            medium
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
              <AppText regular styles={{ ...styles.loginIntro1, marginTop: 8,color:"#414141" }}>
              Enter 6 digit code sent to your phone number
             </AppText>
      
      
             <View style={{display:"flex",flexDirection:"row",gap:12,marginTop:24,justifyContent:"center",alignItems:"center"}}>
             <TextInput
                style={{ ...styles.textInput,}}
                placeholder="Authentication Code"
                placeholderTextColor="gray"
                keyboardType="visible-password"
                onChangeText={(text) => onValueChange("authCode", text)}
              />
        </View>
      
        <View style={{ marginTop: 16 }}>
         <AppText
            regular
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
      
      
        <View >
      <AppButton styles={{ ...styles.signupButton, display: `${!displaySpinner ? "flex" : "none"}` }} onPress={() => goToSecurityPin()}>
                  <AppText bold="true" styles={{ color: "#FFFFFF", fontSize: 16 }}>
                   Proceed
                  </AppText>
                </AppButton>
                <View style={{ justifyContent: "center", display: `${displaySpinner ? "flex" : "none"}` }}>
                  <Spinner color="blue.700" size="lg" />
                </View>

      </View>
      
      
      </View>
      
     
      <View style={[styles.slide,{ width }]}>
      
      <View style={{marginTop:24,}}>
      
      <TouchableOpacity  onPress={goToPreviousSlide}>
      <MaterialIcons name="keyboard-backspace" size={24} color="#1C1B1F" />
      </TouchableOpacity>
      
      </View>
      
      <AppText medium styles={{ fontSize: 25,marginTop:11 }}>
      Create Transaction Pin  🔑
              </AppText>
              <AppText regular styles={{ ...styles.loginIntro1, marginTop: 8,color:"#414141"}}>
              Create a 4 digit code for your transactions
                </AppText>
      
     
      
      
              <View style={{flexDirection:"column",marginTop:40,gap:24 }}>
             
                <View >
      
                <AppText medium styles={{ ...styles.Lable,fontSize:16}}>Transaction Pin</AppText>
               <TextInput
                    style={{ ...styles.textInput,}}
                    placeholder="Create Transaction Pin"
                    placeholderTextColor="#A0A0A0"
                    maxLength={6}
                    textContentType="password"
                    secureTextEntry
                    onChangeText={(text) => onValueChange("transactionPin", text)}
                 />
                </View>
      
                <View>
                  <AppText medium styles={{ ...styles.Lable,fontSize:16}}>Confirm Pin</AppText>
                  <TextInput
                 style={{ ...styles.textInput,}}
                  placeholder="Re-Enter Transaction Pin"
                  placeholderTextColor="#A0A0A0"
                  maxLength={6}
                  textContentType="password"
                  secureTextEntry
                  onChangeText={(text) => onValueChange("confirmTransactionPin", text)}
            
                   />
                </View>
           </View>
      
           <View >
      <AppButton styles={{ ...styles.signupButton, display: `${!displaySpinner ? "flex" : "none"}` }} onPress={() => completeRegistration()}>
                  <AppText bold="true" styles={{ color: "#FFFFFF", fontSize: 16 }}>
                   Proceed
                  </AppText>
                </AppButton>
                <View style={{ justifyContent: "center", display: `${displaySpinner ? "flex" : "none"}` }}>
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
      
           <View >
      <AppButton styles={{ ...styles.signupButton, display: `${!displaySpinner ? "flex" : "none"}` }} onPress={() => goToNextSlide()}>
                  <AppText bold="true" styles={{ color: "#FFFFFF", fontSize: 16 }}>
                   Proceed
                  </AppText>
                </AppButton>
                <View style={{ justifyContent: "center", display: `${displaySpinner ? "flex" : "none"}` }}>
                  <Spinner color="blue.700" size="lg" />
                </View>

      </View>
       
      </View>

      
      
      </ScrollView>
      
      
      
      </View>
      </ScrollView>
          );
  };

  return (
    <View style={styles.container}>
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
      <Fragment>
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
            data={registerData.payload.country}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
              style={[
                styles.countryItem,
                registerData.payload ?.payload?.country === item.value && styles.selectedCountry,
              ]}
                onPress={() => handleCountrySelect(item.value)}
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
              style={{
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
    </View>
  );
}

const styles = StyleSheet.create({
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
  container: {
    backgroundColor: "#f2f2f2",
    flex: 1,
   // justifyContent: "center",
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
  signupButton: {
    marginTop: 10,
    backgroundColor: "#266ddc",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    elevation: 3,
    borderRadius: 8,
    height:56
  },

countryItem:{
padding:10
},
  bottomsheetContainer1: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
   
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
