import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AppText from "../../resources/AppText";
import { numberWithCommas } from "../../resources/MetaFunctions";
import { usePrevious } from "../../resources/utils";
import { toastColorObject } from "../../resources/rStyledComponent";
import { useToast, Box, Text as NativeBaseText, Spinner } from "native-base";
import { getUsdTransactions, withdrawFromUsdWallet } from "../../containers/blockchain/action";
import { Picker as RNPicker } from "@react-native-picker/picker";
import { Select } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Withdraw({ navigation }) {
  const toast = useToast();
  const dispatch = useDispatch();
  const Picker = Platform.OS == "android" ? RNPicker : Select;
  const [userUsdAmount, setUserUsdAmount] = useState("");
  const [userDestinationAccount, setUserDestinationAccount] = useState({
    payload: {
      destination: "",
      accountNo: "",
      bankName: "",
      recipientName: "",
      priority: "",
    },
  });
  const [displaySpinner, setDisplaySpinner] = useState(false);
  const [transactionPin, setTransactionPin] = useState("");
  const usdTransactions = useSelector((state) => state.blockchain.usd);
  const withdrawUsdResponse = useSelector((state) => state.blockchain.withdrawusd);
  const prevWithdrawUsdResponse = usePrevious(withdrawUsdResponse);

  useEffect(() => {
    if (userUsdAmount != "" && withdrawUsdResponse.length && withdrawUsdResponse.length != prevWithdrawUsdResponse?.length) {
      if (withdrawUsdResponse[withdrawUsdResponse.length - 1]?.status == "success") {
        setDisplaySpinner(false);
        Alert.alert("Transfer successful", `Confirmation may be delayed for transfers to Bank. High priority transactions are fulfilled earlier. 🎉`, [
          {
            text: "Go Home",
            onPress: () => {
              dispatch(getUsdTransactions());
              navigation.goBack();
            },
          },
        ]);
      } else {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>{withdrawUsdResponse[withdrawUsdResponse.length - 1]?.message}</NativeBaseText>
            </Box>
          ),
        });
        setDisplaySpinner(false);
      }
    }
  }, [withdrawUsdResponse]);

  const proceedToInitiateUsdWithdrawal = () => {
    if (userDestinationAccount.payload.destination === "") {
      toast.show({
        render: () => (
          <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
            <NativeBaseText style={{ color: "#FFFFFF" }}>Destination Account not set</NativeBaseText>
          </Box>
        ),
      });
    } else if (userDestinationAccount.payload.destination === "NGN") {
      //Perform Checks
      if (transactionPin == "" || transactionPin.length < 6) {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>Invalid transaction pin</NativeBaseText>
            </Box>
          ),
        });
      } else {
        //Intiate Transaction
        setDisplaySpinner(true);
        dispatch(
          withdrawFromUsdWallet(
            userDestinationAccount.payload.destination,
            userDestinationAccount.payload.priority,
            userUsdAmount,
            userDestinationAccount.payload.recipientName,
            userDestinationAccount.payload.bankName,
            userDestinationAccount.payload.accountNo,
            transactionPin
          )
        );
      }
    } else if (userDestinationAccount.payload.destination === "USD") {
      if (
        userDestinationAccount.payload.bankName == "" ||
        userDestinationAccount.payload.accountNo == "" ||
        userDestinationAccount.payload.accountNo.length < 6 ||
        userDestinationAccount.payload.recipientName == "" ||
        userDestinationAccount.payload.recipientName.length < 3 ||
        userDestinationAccount.payload.priority == "" ||
        userUsdAmount < 50 ||
        transactionPin == "" ||
        transactionPin.length < 6
      ) {
        if (userDestinationAccount.payload.bankName == "") {
          toast.show({
            render: () => (
              <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
                <NativeBaseText style={{ color: "#FFFFFF" }}>Select Bank</NativeBaseText>
              </Box>
            ),
          });
        } else if (userDestinationAccount.payload.accountNo == "" || userDestinationAccount.payload.accountNo.length < 6) {
          toast.show({
            render: () => (
              <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
                <NativeBaseText style={{ color: "#FFFFFF" }}>Input correct recipient account</NativeBaseText>
              </Box>
            ),
          });
        } else if (userDestinationAccount.payload.recipientName == "" || userDestinationAccount.payload.recipientName.length < 3) {
          toast.show({
            render: () => (
              <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
                <NativeBaseText style={{ color: "#FFFFFF" }}>Recipient account name cannot be less than 3 character</NativeBaseText>
              </Box>
            ),
          });
        } else if (userDestinationAccount.payload.priority == "") {
          toast.show({
            render: () => (
              <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
                <NativeBaseText style={{ color: "#FFFFFF" }}>Kindly select preferred priority</NativeBaseText>
              </Box>
            ),
          });
        } else if (userUsdAmount < 50) {
          toast.show({
            render: () => (
              <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
                <NativeBaseText style={{ color: "#FFFFFF" }}>USD Bank Withdrawal cannot be less than $50</NativeBaseText>
              </Box>
            ),
          });
        } else if (transactionPin == "" || transactionPin.length < 6) {
          toast.show({
            render: () => (
              <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
                <NativeBaseText style={{ color: "#FFFFFF" }}>Invalid transaction pin</NativeBaseText>
              </Box>
            ),
          });
        }
      } else {
        // Initiate Transaction
        setDisplaySpinner(true);
        dispatch(
          withdrawFromUsdWallet(
            userDestinationAccount.payload.destination,
            userDestinationAccount.payload.priority,
            userUsdAmount,
            userDestinationAccount.payload.recipientName,
            userDestinationAccount.payload.bankName,
            userDestinationAccount.payload.accountNo,
            transactionPin
          )
        );
      }
    }
  };

  return (
    <KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={10} enableOnAndroid={true} extraHeight={Platform.select({ android: 150 })} style={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={{ margin: 10 }}>
          <AppText bold>Available Balance:</AppText>
          <AppText bold styles={{ fontSize: 18 }}>
            ${Number(usdTransactions?.balance).toFixed(2)}
          </AppText>

          <View
            style={{
              marginTop: 20,
              borderWidth: 0.5,
              borderColor: "#266ddc",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <Picker
              style={{ height: 45 }}
              onValueChange={(itemValue, itemIndex) => {
                setUserDestinationAccount((prevState) => ({
                  ...prevState,
                  payload: {
                    ...prevState.payload,
                    destination: itemValue,
                  },
                }));
              }}
              accessibilityLabel="Choose Country"
              borderColor={"transparent"}
              selectedValue={userDestinationAccount.payload.destination}
            >
              <Picker.Item label="--- Select Destination Account---" value="" />
              <Picker.Item label="NGN Wallet" value="NGN" />
              <Picker.Item label="USD Domiciliary Account" value="USD" />
            </Picker>
          </View>

          {userDestinationAccount.payload.destination === "USD" && (
            <Fragment>
              {/** BANK DETAILS */}

              <View
                style={{
                  marginTop: 15,
                  borderWidth: 0.5,
                  borderColor: "#266ddc",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <Picker
                  style={{ height: 45 }}
                  onValueChange={(itemValue, itemIndex) => {
                    setUserDestinationAccount((prevState) => ({
                      ...prevState,
                      payload: {
                        ...prevState.payload,
                        bankName: itemValue,
                      },
                    }));
                  }}
                  borderColor={"transparent"}
                  selectedValue={userDestinationAccount.payload.bankName}
                >
                  <Picker.Item label="--- Select Bank ---" value="" />
                  <Picker.Item label="Access Bank" value="Access Bank" />
                  <Picker.Item label="GT Bank" value="GT Bank" />
                  <Picker.Item label="Providus Bank" value="Providus Bank" />
                  <Picker.Item label="United Bank for Africa" value="UBA" />
                  <Picker.Item label="Zenith Bank" value="Zenith Bank" />
                </Picker>
              </View>

              <TextInput
                style={{ ...styles.textInput, marginTop: 15 }}
                placeholder="Account Name"
                placeholderTextColor="gray"
                value={userDestinationAccount.payload.recipientName}
                onChangeText={(value) =>
                  setUserDestinationAccount((prevState) => ({
                    ...prevState,
                    payload: {
                      ...prevState.payload,
                      recipientName: value,
                    },
                  }))
                }
              />

              <TextInput
                style={{ ...styles.textInput, marginTop: 5 }}
                placeholder="Account Number"
                placeholderTextColor="gray"
                keyboardType="numeric"
                value={userDestinationAccount.payload.accountNo}
                onChangeText={(value) =>
                  setUserDestinationAccount((prevState) => ({
                    ...prevState,
                    payload: {
                      ...prevState.payload,
                      accountNo: value,
                    },
                  }))
                }
              />

              <View
                style={{
                  marginTop: 5,
                  borderWidth: 0.5,
                  borderColor: "#266ddc",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <Picker
                  style={{ height: 45 }}
                  onValueChange={(itemValue, itemIndex) => {
                    setUserDestinationAccount((prevState) => ({
                      ...prevState,
                      payload: {
                        ...prevState.payload,
                        priority: itemValue,
                      },
                    }));
                  }}
                  borderColor={"transparent"}
                  selectedValue={userDestinationAccount.payload.priority}
                >
                  <Picker.Item label="--- Set Priority ---" value="" />
                  <Picker.Item label="High (Same Day)" value="24h" />
                  <Picker.Item label="Low (2 - 3 Days)" value="52h" />
                </Picker>
              </View>

              {/** END BANK DETAILS */}
            </Fragment>
          )}

          <TextInput
            style={{ ...styles.textInput, marginTop: 10 }}
            placeholder="Amount in USD"
            placeholderTextColor="gray"
            keyboardType="numeric"
            value={userUsdAmount}
            onChangeText={(value) => setUserUsdAmount(value)}
          />

          <TextInput
            style={{ ...styles.textInput, marginTop: 5 }}
            placeholder="Transaction Pin"
            placeholderTextColor="gray"
            keyboardType="numeric"
            secureTextEntry={true}
            value={transactionPin}
            onChangeText={(value) => setTransactionPin(value)}
          />

          {userUsdAmount <= usdTransactions?.balance ? (
            <Fragment>
              <View style={styles.creditBox}>
                <AppText>
                  You will receive: {`${userDestinationAccount.payload.destination !== "USD" ? "₦" : "$"}`}
                  {userUsdAmount > 0
                    ? userDestinationAccount.payload.destination === "USD"
                      ? numberWithCommas(userUsdAmount)
                      : numberWithCommas(userUsdAmount * usdTransactions.usd_ngn_current)
                    : "0.00"}
                </AppText>
              </View>
              {userDestinationAccount.payload.destination === "USD" && (
                <View style={{ backgroundColor: "lightblue", padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
                  <AntDesign name="infocirlce" size={20} color="#198754" style={{ marginTop: 5 }} />
                  <View>
                    <AppText bold styles={{ color: "#040404", lineHeight: 22, marginLeft: 10 }}>
                      $2,500 Maximum daily withdrawal.
                    </AppText>
                    <AppText bold styles={{ color: "#040404", lineHeight: 22, marginLeft: 10 }}>
                      Processing fee (2-3 days) : $0 Free
                    </AppText>
                    <AppText bold styles={{ color: "#040404", lineHeight: 22, marginLeft: 10 }}>
                      Processing fee (Same day / 24hrs): +$2.50
                    </AppText>
                  </View>
                </View>
              )}
            </Fragment>
          ) : (
            <View style={{ ...styles.creditBox, backgroundColor: "#da534f" }}>
              <AppText>Insufficient Balance</AppText>
            </View>
          )}

          {!displaySpinner ? (
            <TouchableOpacity
              disabled={Number(userUsdAmount) < 1 || userUsdAmount > usdTransactions?.balance}
              onPress={() => proceedToInitiateUsdWithdrawal()}
              style={{ width: "100%", backgroundColor: "#266ddc", marginTop: 20, justifyContent: "center", height: 45, borderRadius: 5, alignItems: "center" }}
            >
              <AppText styles={{ color: "#ffffff", fontSize: 16 }} bold>
                Withdraw
              </AppText>
            </TouchableOpacity>
          ) : (
            <View style={{ justifyContent: "center", alignItems: "center", marginTop: 20 }}>
              <Spinner size="lg" color="#266ddc" />
            </View>
          )}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  textInput: {
    height: 45,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 0.5,
    borderColor: "#266ddc",
    borderRadius: 10,
    borderBottomColor: "#266DDC",
  },
  creditBox: {
    backgroundColor: "lightgreen",
    padding: 10,
    borderRadius: 5,
  },

  transferContainer: {
    marginTop: 20,
    backgroundColor: "#ffffff",
    padding: 10,
    width: "90%",
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
});
