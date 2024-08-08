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
  depositTrxPrompt,
  getTrxTransactions,
} from "../../containers/blockchain/action";
import { AntDesign } from "@expo/vector-icons";

export default function Deposit({ navigation }) {
  const toast = useToast();
  const dispatch = useDispatch();
  const Picker = Platform.OS == "android" ? RNPicker : Select;
  const trxTransactions = useSelector((state) => state.blockchain.trx);
  const trxDepositResponse = useSelector(
    (state) => state.blockchain.deposittrx
  );
  const prevTrxDepositResponse = usePrevious(trxDepositResponse);
  const [userTrxDepositDetails, setUserTrxDepositDetails] = useState({
    payload: {
      source: "",
      amount: "",
    },
  });
  const [displaySpinner, setDisplaySpinner] = useState(false);

  useEffect(() => {
    if (
      userTrxDepositDetails.payload.amount != "" &&
      trxDepositResponse.length &&
      trxDepositResponse.length != prevTrxDepositResponse?.length
    ) {
      if (
        trxDepositResponse[trxDepositResponse.length - 1]?.status == "success"
      ) {
        setDisplaySpinner(false);
        Alert.alert(
          "Deposit successful",
          `Equivalent TRX will be credited into your account. Thank you  🎉`,
          [
            {
              text: "Go Home",
              onPress: () => {
                dispatch(getTrxTransactions());
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
                {trxDepositResponse[trxDepositResponse.length - 1]?.message}
              </NativeBaseText>
            </Box>
          ),
        });
        setDisplaySpinner(false);
      }
    }
  }, [trxDepositResponse]);

  const proceedTrxDeposit = () => {
    let trxAmount;
    if (userTrxDepositDetails.payload.source == "NGN") {
      trxAmount =
        Number(
          userTrxDepositDetails.payload.amount /
            +trxTransactions.ngn_usd_current
        ) / trxTransactions.tron_value;
    } else {
      trxAmount = Number(
        userTrxDepositDetails.payload.amount / trxTransactions.tron_value
      );
    }

    if (userTrxDepositDetails.payload.source == "") {
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
    } else {
      if (trxAmount < 20) {
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
                TRX topup cannot be less than 20 TRX
              </NativeBaseText>
            </Box>
          ),
        });
      } else if (trxAmount > 45000) {
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
                TRX topup from VetroPay cannot be more than 45,000 TRX per month
              </NativeBaseText>
            </Box>
          ),
        });
      } else {
        setDisplaySpinner(true);
        dispatch(
          depositTrxPrompt(
            userTrxDepositDetails.payload.amount,
            userTrxDepositDetails.payload.source
          )
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ margin: 10 }}>
        <AppText bold>Fund your Tron TRX Wallet</AppText>

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
              setUserTrxDepositDetails((prevState) => ({
                ...prevState,
                payload: {
                  ...prevState.payload,
                  source: itemValue,
                },
              }));
            }}
            accessibilityLabel="Choose Country"
            borderColor={"transparent"}
            selectedValue={userTrxDepositDetails.payload.source}
          >
            <Picker.Item label="--- Select Payment Method---" value="" />
            <Picker.Item label="NGN Wallet" value="NGN" />
            {/* <Picker.Item label="USD Wallet" value="USD" /> */}
          </Picker>
        </View>

        <TextInput
          style={{ ...styles.textInput, marginTop: 15 }}
          placeholder="Amount"
          placeholderTextColor="gray"
          keyboardType="numeric"
          value={userTrxDepositDetails.payload.amount}
          onChangeText={(value) =>
            setUserTrxDepositDetails((prevState) => ({
              ...prevState,
              payload: {
                ...prevState.payload,
                amount: value,
              },
            }))
          }
        />

        <View style={styles.creditBox}>
          {userTrxDepositDetails.payload.source === "NGN" ? (
            <AppText>
              You will receive: TRX
              {userTrxDepositDetails.payload.amount > 0
                ? numberWithCommas(
                    Number(
                      userTrxDepositDetails.payload.amount /
                        +trxTransactions.ngn_usd_current
                    ) / trxTransactions.tron_value
                  )
                : "0.000000"}
            </AppText>
          ) : (
            <AppText>
              You will receive: TRX
              {userTrxDepositDetails.payload.amount > 0
                ? numberWithCommas(
                    Number(
                      userTrxDepositDetails.payload.amount /
                        trxTransactions.tron_value
                    )
                  )
                : "0.000000"}
            </AppText>
          )}
        </View>

        <View
          style={{
            backgroundColor: "lightblue",
            padding: 10,
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <AntDesign
            name="infocirlce"
            size={20}
            color="#198754"
            style={{ marginTop: 5 }}
          />
          <View>
            <AppText
              bold
              styles={{
                color: "#040404",
                lineHeight: 22,
                marginLeft: 10,
                marginRight: 7,
              }}
            >
              Customers may only purchase limited TRX directly from our reserves
              per month. While there are no limits on how much TRX customers can
              hold in their TRX wallet, direct Naira purchase is limited to
              45,000 TRX per month. Thank you.
            </AppText>
          </View>
        </View>

        {!displaySpinner ? (
          <Fragment>
            <TouchableOpacity
              disabled={Number(userTrxDepositDetails.payload.amount) < 1}
              onPress={() => proceedTrxDeposit()}
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
