import React, { useEffect, useState, useRef, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PayWithFlutterwave } from "flutterwave-react-native";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Clipboard, TextInput } from "react-native";
import AppText from "../resources/AppText";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { loadUser } from "../containers/authentication/action";
import { Spinner, useToast, Box, Text as NativeBaseText } from "native-base";
import FLW_LOGO from "../assets/FLW-logo.png";
import { cardDeposit, tokenDeposit } from "../containers/deposit/action";
import { getUserTransaction } from "../containers/transactions/action";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { getCards } from "../containers/cards/action";
import { toastColorObject } from "../resources/rStyledComponent";

export default function DepositFund({ navigation }) {
  const toast = useToast();
  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const userAuthentication = useSelector((state) => state.authentication.user);
  const cardDepositResponse = useSelector((state) => state.deposit.card);
  const tokenDepositResponse = useSelector((state) => state.deposit.token);
  const userCards = useSelector((state) => state.cards.cards);
  const prevCardDepositResponse = usePrevious(cardDepositResponse);
  const prevTokenDepositResponse = usePrevious(tokenDepositResponse);
  const [amount, setAmount] = useState({
    value: "",
    error: false,
    errorMessage: "",
  });
  const [displaySpinner, setDisplaySpinner] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    /**NAVIGATIOON */
    navigation.addListener("focus", () => {
      dispatch(loadUser());
      dispatch(getCards());
    });
  }, [navigation]);

  useEffect(() => {
    if (cardDepositResponse.length && cardDepositResponse.length !== prevCardDepositResponse?.length) {
      if (cardDepositResponse[cardDepositResponse.length - 1]["status"] == "success") {
        // RELOAD TRANSACTION HISTORY
        dispatch(getUserTransaction(""));
      } else {
        // SHOW ERROR
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>{cardDepositResponse[cardDepositResponse.length - 1]["message"]}</NativeBaseText>
            </Box>
          ),
        });
      }
    }

    if (Number(amount.value) !== NaN && Number(amount.value) > 99.99 && tokenDepositResponse.length && tokenDepositResponse.length !== prevTokenDepositResponse?.length) {
      if (tokenDepositResponse[tokenDepositResponse.length - 1]["status"] == "success") {
        // RELOAD TRANSACTION HISTORY
        dispatch(getUserTransaction(""));

        Alert.alert("Deposit successful", "Your account has been credited", [
          {
            text: "Ok",
            onPress: () => {},
          },
        ]);

        setAmount({
          value: "",
          error: false,
          errorMessage: "",
        });
        setDisplaySpinner(false);
      } else {
        // SHOW ERROR
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>{tokenDepositResponse[tokenDepositResponse.length - 1]["message"]}</NativeBaseText>
            </Box>
          ),
        });

        setDisplaySpinner(false);
      }
    }
  }, [cardDepositResponse, tokenDepositResponse]);

  const copyToClipBoard = () => {
    if (userAuthentication.email == "") {
      Alert.alert("Complete Profile Information", "Add your Email address to obtain a personal National Bank Account linked to VetroPay", [
        {
          text: "Ok",
          onPress: () => {
            navigation.navigate("Settings");
          },
        },
      ]);
    } else {
      Clipboard.setString(`${userAuthentication.nuban}`);
      toast.show({
        render: () => (
          <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
            <NativeBaseText style={{ color: "#FFFFFF" }}>Copied to clipboard</NativeBaseText>
          </Box>
        ),
      });
    }
  };

  const handleOnRedirect = (data) => {
    if (data?.status == "successful") {
      Alert.alert("Deposit successful", "Your account has been credited", [
        {
          text: "Ok",
          onPress: () => {},
        },
        // Pass to Backend
        dispatch(cardDeposit(data.tx_ref, data.transaction_id, userAuthentication.phone_number)),
        /**
          * Object {
            "status": "successful",
            "transaction_id": "3323109",
            "tx_ref": "flw_tx_ref_TI106cF6OV",
          }
         */
      ]);
      setAmount((prevState) => ({
        ...prevState,
        amount: 0,
      }));
    }
  };

  /* An example function to generate a random transaction reference */
  const generateTransactionRef = (length) => {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return `flw_tx_ref_${result}`;
  };

  const debitKnownCard = (cardId) => {
    setDisplaySpinner(true);
    dispatch(tokenDeposit(cardId, amount.value));
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={10} enableOnAndroid={true} extraHeight={Platform.select({ android: 150 })} style={{ flexGrow: 1 }}>
        <View style={{ marginTop: 16, paddingHorizontal: 10 }}>
          <AppText bold="true" styles={{ fontSize: 16 }}>
            Deposit Account Information:
          </AppText>

          <View style={{ marginTop: 10, height: 100, backgroundColor: "#ffffff", alignItems: "center", justifyContent: "center", elevation: 4, borderRadius: 15 }}>
            <AppText bold="true" styles={{ fontSize: 18, textAlign: "center" }}>
              Bank: Providus Bank
            </AppText>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
              <AppText bold="true" styles={{ fontSize: 18, textAlign: "center" }}>
                Number: {userAuthentication.nuban}
              </AppText>
              <TouchableOpacity onPress={() => copyToClipBoard()}>
                <View>
                  <MaterialCommunityIcons name={userAuthentication.nuban[0] == "*" ? "eye-off-outline" : "content-copy"} style={{ marginLeft: 5 }} size={30} color="#266ddc" />
                </View>
              </TouchableOpacity>
            </View>
            <AppText bold="true" styles={{ fontSize: 18, textAlign: "center", color: "#266ddc", textTransform: "capitalize" }}>
              {userAuthentication.fullname}
            </AppText>
          </View>

          <View style={{ marginTop: 16 }}>
            <AppText bold="true" styles={{ textAlign: "center", fontSize: 18 }}>
              How to fund your Vetropay Account
            </AppText>

            <AppText styles={{ marginTop: 10 }}>
              <Text style={{ fontWeight: "700" }}>1. Mobile, Internet Banking or USSD</Text>
            </AppText>
            <AppText styles={{ paddingHorizontal: 10, marginTop: 5 }}>(a). Make a fund transfer to your Providus Bank Account details above.</AppText>

            <AppText styles={{ paddingHorizontal: 10, marginTop: 5 }}>(b). Your VetroPay balance will be credited automatically @ Zero charge. Cheers!</AppText>
          </View>

          <View style={{ marginTop: 16 }}>
            <AppText styles={{ marginTop: 10 }}>
              <Text style={{ fontWeight: "700" }}>2. Debit Cards e.g Visa, MasterCard, Verve etc.</Text>
            </AppText>

            <TextInput
              editable={!displaySpinner}
              placeholder="Enter Amount"
              keyboardType="number-pad"
              value={amount.value}
              style={{ borderColor: "#fb9129", marginTop: 15, height: 50, paddingHorizontal: 10, borderWidth: 1, borderRadius: 5 }}
              onChangeText={(text) => {
                setAmount({
                  value: text,
                  error: false,
                  errorMessage: "",
                });
              }}
            />
            {amount.error && <AppText styles={{ color: "red", fontSize: 12 }}>{amount.errorMessage}</AppText>}

            <View style={{ backgroundColor: "#fc9c3d", marginTop: 5, padding: 5, borderRadius: 3 }}>
              <AppText>Processing Fee: NGN {Number(Math.min(Number(amount.value) * 0.014, 2000)).toFixed(2)}</AppText>
            </View>

            {!displaySpinner && (
              <Fragment>
                {/** CARDS */}
                {userCards.length > 0 ? (
                  <View>
                    {userCards
                      .filter((data) => data.primary == true)
                      .map((data, index) => {
                        return (
                          <View key={index}>
                            {Number(amount.value) !== NaN && Number(amount.value) > 99.99 ? (
                              <TouchableOpacity onPress={() => debitKnownCard(data.pk)} style={{ ...styles.cardContainer, marginTop: 20 }}>
                                <View>
                                  <AppText bold styles={{ fontSize: 16 }}>
                                    {data["details"]["type"]} - **** {data["details"]["last_4digits"]}
                                  </AppText>
                                  <AppText>
                                    {data["details"]["issuer"].slice(0, 16)}/ {data["details"]["country"]}
                                  </AppText>
                                </View>
                                <FontAwesome name="credit-card-alt" size={24} color="#266ddc" />
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity disabled style={{ ...styles.cardContainer, marginTop: 20, opacity: 0.3 }}>
                                <View>
                                  <AppText bold styles={{ fontSize: 16 }}>
                                    {data["details"]["type"]} - **** {data["details"]["last_4digits"]}
                                  </AppText>
                                  <AppText>
                                    {data["details"]["issuer"].slice(0, 16)}/ {data["details"]["country"]}
                                  </AppText>
                                </View>
                                <FontAwesome name="credit-card-alt" size={24} color="#266ddc" />
                              </TouchableOpacity>
                            )}
                          </View>
                        );
                      })}
                  </View>
                ) : (
                  <View></View>
                )}

                {Number(amount.value) !== NaN && Number(amount.value) > 99.99 ? (
                  <PayWithFlutterwave
                    onRedirect={handleOnRedirect}
                    options={{
                      tx_ref: generateTransactionRef(10),
                      //authorization: "FLWPUBK_TEST-027039407f038ace6e72f7225463538c-X",
                      authorization: "FLWPUBK-8eb02ef54745a2638cf6e092e65b96e6-X",
                      customer: {
                        email: userAuthentication.email || `${userAuthentication.phone_number}@vetropay.com`,
                      },
                      amount: parseInt(amount.value),
                      currency: "NGN",
                      payment_options: "card",
                    }}
                    customButton={(props) => (
                      <TouchableOpacity
                        style={{
                          marginTop: 20,
                          height: 50,
                          borderRadius: 5,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                          borderColor: "#fb9129",
                          elevation: 4,
                          backgroundColor: "#ffffff",
                        }}
                        // onPress={(e) => {
                        //   if (Number(amount.value) < 100) {
                        //     setAmount((prevState) => ({
                        //       ...prevState,
                        //       error: true,
                        //       errorMessage: "Amount cannot be less than 100",
                        //     }));
                        //   } else {
                        //     props.onPress(e);
                        //   }
                        // }}
                        onPress={props.onPress}
                      >
                        <AppText bold styles={{ fontSize: 18, marginRight: 8 }}>
                          Pay with{" "}
                        </AppText>
                        <Image source={FLW_LOGO} style={{ height: 50, width: 150, resizeMode: "contain" }} />
                      </TouchableOpacity>
                    )}
                  />
                ) : (
                  <TouchableOpacity
                    disabled
                    style={{
                      opacity: 0.3,
                      marginTop: 20,
                      height: 50,
                      borderRadius: 5,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      borderColor: "#fb9129",
                      elevation: 4,
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <AppText bold styles={{ fontSize: 18, marginRight: 8 }}>
                      Pay with{" "}
                    </AppText>
                    <Image source={FLW_LOGO} style={{ height: 50, width: 150, resizeMode: "contain" }} />
                  </TouchableOpacity>
                )}
              </Fragment>
            )}

            {displaySpinner && (
              <View style={{ marginTop: 20 }}>
                <Spinner color="#266ddc" />
              </View>
            )}
          </View>

          {/** End Note */}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    height: 80,
    borderRadius: 10,
    elevation: 4,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
