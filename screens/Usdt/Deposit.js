import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import React, { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AppText from "../../resources/AppText";
import { Picker as RNPicker } from "@react-native-picker/picker";
import { Select } from "native-base";
import { numberWithCommas } from "../../resources/utils/MetaFunctions";
import { toastColorObject } from "../../resources/rStyledComponent";
import { useToast, Box, Text as NativeBaseText, Spinner } from "native-base";
import { usePrevious } from "../../resources/utils";
import {
  depositUsdtFromNgnWallet,
  getUsdtTransactions,
} from "../../containers/blockchain/action";

export default function Deposit({ navigation }) {
  const toast = useToast();
  const dispatch = useDispatch();
  const Picker = Platform.OS == "android" ? RNPicker : Select;
  const usdtTransactions = useSelector((state) => state.blockchain.usdt);
  const usdtDepositResponse = useSelector(
    (state) => state.blockchain.depositusdt
  );
  const prevUsdDepositResponse = usePrevious(usdtDepositResponse);
  const [userUsdtDepositDetails, setUserUsdtDepositDetails] = useState({
    payload: {
      source: "",
      amount: "",
    },
  });
  const [displaySpinner, setDisplaySpinner] = useState(false);

  useEffect(() => {
    if (
      userUsdtDepositDetails.payload.amount != "" &&
      usdtDepositResponse.length &&
      usdtDepositResponse.length != prevUsdDepositResponse?.length
    ) {
      if (
        usdtDepositResponse[usdtDepositResponse.length - 1]?.status == "success"
      ) {
        setDisplaySpinner(false);
        Alert.alert(
          "Deposit successful",
          `Equivalent USDT will be credited into your account. Thank you  🎉`,
          [
            {
              text: "Go Home",
              onPress: () => {
                dispatch(getUsdtTransactions());
                navigation.goBack();
              },
            },
          ]
        );
      } else {
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
                {usdtDepositResponse[usdtDepositResponse.length - 1]?.message}
              </NativeBaseText>
            </Box>
          ),
        });
        setDisplaySpinner(false);
      }
    }
  }, [usdtDepositResponse]);

  const proceedUsdtDeposit = () => {
    if (
      userUsdtDepositDetails.payload.source == "" ||
      Number(userUsdtDepositDetails.payload.amount) < 1000
    ) {
      if (userUsdtDepositDetails.payload.source == "") {
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
                Payment method not set
              </NativeBaseText>
            </Box>
          ),
        });
      } else if (Number(userUsdtDepositDetails.payload.amount) < 1000) {
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
                Naira conversion cannot be less than ₦1000
              </NativeBaseText>
            </Box>
          ),
        });
      }
    } else {
      setDisplaySpinner(true);
      dispatch(depositUsdtFromNgnWallet(userUsdtDepositDetails.payload.amount));
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ margin: 10 }}>
        <AppText bold>Fund your VetroPay USDT Wallet</AppText>

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
              setUserUsdtDepositDetails((prevState) => ({
                ...prevState,
                payload: {
                  ...prevState.payload,
                  source: itemValue,
                },
              }));
            }}
            accessibilityLabel="Choose Country"
            borderColor={"transparent"}
            selectedValue={userUsdtDepositDetails.payload.source}
          >
            <Picker.Item label="--- Select Payment Method---" value="" />
            <Picker.Item label="NGN Wallet" value="NGN" />
            {/* <Picker.Item label="Debit/Credit Card" value="USD" /> */}
          </Picker>
        </View>

        <TextInput
          style={{ ...styles.textInput, marginTop: 15 }}
          placeholder="Amount"
          placeholderTextColor="gray"
          keyboardType="numeric"
          value={userUsdtDepositDetails.payload.amount}
          onChangeText={(value) =>
            setUserUsdtDepositDetails((prevState) => ({
              ...prevState,
              payload: {
                ...prevState.payload,
                amount: value,
              },
            }))
          }
        />

        <View style={styles.creditBox}>
          {userUsdtDepositDetails.payload.source !== "NGN" ? (
            <AppText>
              You will receive: $
              {userUsdtDepositDetails.payload.amount > 0
                ? numberWithCommas(userUsdtDepositDetails.payload.amount)
                : "0.00"}
            </AppText>
          ) : (
            <AppText>
              You will receive: $
              {userUsdtDepositDetails.payload.amount > 0
                ? numberWithCommas(
                    userUsdtDepositDetails.payload.amount /
                      Number(usdtTransactions.ngn_usd_current)
                  )
                : "0.00"}
            </AppText>
          )}
        </View>

        {!displaySpinner ? (
          <Fragment>
            <TouchableOpacity
              disabled={Number(userUsdtDepositDetails.payload.amount) < 1}
              onPress={() => proceedUsdtDeposit()}
              style={{
                width: "100%",
                backgroundColor: "#266ddc",
                marginTop: 20,
                justifyContent: "center",
                height: 45,
                borderRadius: 5,
                alignItems: "center",
              }}
            >
              <AppText styles={{ color: "#ffffff", fontSize: 16 }} bold>
                Deposit
              </AppText>
            </TouchableOpacity>
          </Fragment>
        ) : (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Spinner size="lg" color="#266ddc" />
          </View>
        )}
      </View>
    </View>
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
