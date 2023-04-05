import { View, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import React, { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AppText from "../../resources/AppText";
import { Picker as RNPicker } from "@react-native-picker/picker";
import { Select } from "native-base";
import { toastColorObject } from "../../resources/rStyledComponent";
import { useToast, Box, Text as NativeBaseText, Spinner } from "native-base";
import { usePrevious, numberWithCommas } from "../../resources/utils";
import { depositBtcPrompt, getBtcTransactions } from "../../containers/blockchain/action";
import { AntDesign } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Deposit({ navigation }) {
  const toast = useToast();
  const dispatch = useDispatch();
  const Picker = Platform.OS == "android" ? RNPicker : Select;
  const btcTransactions = useSelector((state) => state.blockchain.btc);
  const btcDepositResponse = useSelector((state) => state.blockchain.depositbtc);
  const prevBtcDepositResponse = usePrevious(btcDepositResponse);
  const [userBtcDepositDetails, setUserBtcDepositDetails] = useState({
    payload: {
      source: "",
      amount: "",
    },
  });
  const [displaySpinner, setDisplaySpinner] = useState(false);
  const MAX_BTC_RESERVE_PURCHASE_LIMIT_IN_USD = Number(2500);
  const MIN_BTC_RESERVE_PURCHASE_LIMIT_IN_USD = Number(5);

  useEffect(() => {
    if (userBtcDepositDetails.payload.amount != "" && btcDepositResponse.length && btcDepositResponse.length != prevBtcDepositResponse?.length) {
      if (btcDepositResponse[btcDepositResponse.length - 1]?.status == "success") {
        setDisplaySpinner(false);
        Alert.alert("Deposit successful", `Equivalent BTC will be credited into your account. Thank you  🎉`, [
          {
            text: "Go Home",
            onPress: () => {
              dispatch(getBtcTransactions());
              navigation.goBack();
            },
          },
        ]);
      } else {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>{btcDepositResponse[btcDepositResponse.length - 1]?.message}</NativeBaseText>
            </Box>
          ),
        });
        setDisplaySpinner(false);
      }
    }
  }, [btcDepositResponse]);

  const proceedBtcDeposit = () => {
    let btcAmount;
    if (userBtcDepositDetails.payload.source == "NGN") {
      btcAmount = Number(userBtcDepositDetails.payload.amount / +btcTransactions.ngn_usd_current) / btcTransactions.btc_value;
    } else {
      btcAmount = Number(userBtcDepositDetails.payload.amount / btcTransactions.btc_value);
    }

    if (userBtcDepositDetails.payload.source == "") {
      toast.show({
        render: () => (
          <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
            <NativeBaseText style={{ color: "#FFFFFF" }}>Payment method not set</NativeBaseText>
          </Box>
        ),
      });
    } else {
      if (btcAmount < Number(MIN_BTC_RESERVE_PURCHASE_LIMIT_IN_USD / btcTransactions.btc_value)) {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>
                BTC topup cannot be less than {Number(MIN_BTC_RESERVE_PURCHASE_LIMIT_IN_USD / btcTransactions.btc_value).toFixed(8)} BTC
              </NativeBaseText>
            </Box>
          ),
        });
      } else if (btcAmount > Number(MAX_BTC_RESERVE_PURCHASE_LIMIT_IN_USD / btcTransactions.btc_value)) {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>
                BTC topup from VetroPay cannot be more than {Number(MAX_BTC_RESERVE_PURCHASE_LIMIT_IN_USD / btcTransactions.btc_value).toFixed(8)} BTC daily
              </NativeBaseText>
            </Box>
          ),
        });
      } else {
        setDisplaySpinner(true);
        dispatch(depositBtcPrompt(userBtcDepositDetails.payload.amount, userBtcDepositDetails.payload.source));
      }
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={{ margin: 10 }}>
        <AppText bold>Fund your Bitcoin Wallet</AppText>

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
              setUserBtcDepositDetails((prevState) => ({
                ...prevState,
                payload: {
                  ...prevState.payload,
                  source: itemValue,
                },
              }));
            }}
            accessibilityLabel="Choose Country"
            borderColor={"transparent"}
            selectedValue={userBtcDepositDetails.payload.source}
          >
            <Picker.Item label="--- Select Payment Method---" value="" />
            <Picker.Item label="NGN Wallet" value="NGN" />
            <Picker.Item label="USD Wallet" value="USD" />
          </Picker>
        </View>

        <TextInput
          style={{ ...styles.textInput, marginTop: 15 }}
          placeholder="Amount"
          placeholderTextColor="gray"
          keyboardType="numeric"
          value={userBtcDepositDetails.payload.amount}
          onChangeText={(value) =>
            setUserBtcDepositDetails((prevState) => ({
              ...prevState,
              payload: {
                ...prevState.payload,
                amount: value,
              },
            }))
          }
        />

        <View style={styles.creditBox}>
          {userBtcDepositDetails.payload.source === "NGN" ? (
            <AppText>
              You will receive: BTC{" "}
              {userBtcDepositDetails.payload.amount > 0
                ? Number(Number(userBtcDepositDetails.payload.amount / +btcTransactions.ngn_usd_current) / btcTransactions.btc_value).toFixed(8)
                : "0.000000"}
            </AppText>
          ) : (
            <AppText>
              You will receive: BTC {userBtcDepositDetails.payload.amount > 0 ? Number(+userBtcDepositDetails.payload.amount / btcTransactions.btc_value).toFixed(8) : "0.000000"}
            </AppText>
          )}
        </View>

        <View style={{ backgroundColor: "lightblue", padding: 10, borderRadius: 10, flexDirection: "row", alignItems: "center", marginTop: 10 }}>
          <AntDesign name="infocirlce" size={20} color="#198754" style={{ marginTop: 5 }} />
          <View>
            <AppText bold styles={{ color: "#040404", lineHeight: 22, marginLeft: 10, marginRight: 7 }}>
              Customers may only purchase limited BTC directly from our reserves per day/month. While there are no limits on how much customers can hold in their BTC wallet, direct
              Naira purchase is limited to $2,500 worth of BTC per day. Thank you.
            </AppText>
          </View>
        </View>

        {!displaySpinner ? (
          <Fragment>
            <TouchableOpacity
              disabled={Number(userBtcDepositDetails.payload.amount) < 1}
              onPress={() => proceedBtcDeposit()}
              style={{ width: "100%", backgroundColor: "#266ddc", marginTop: 20, justifyContent: "center", height: 45, borderRadius: 5, alignItems: "center" }}
            >
              <AppText styles={{ color: "#ffffff", fontSize: 16 }} bold>
                Deposit
              </AppText>
            </TouchableOpacity>
          </Fragment>
        ) : (
          <View style={{ justifyContent: "center", alignItems: "center", marginTop: 20 }}>
            <Spinner size="lg" color="#266ddc" />
          </View>
        )}
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
});
