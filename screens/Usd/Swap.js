import { View, StyleSheet, TextInput, TouchableOpacity, Pressable, Alert } from "react-native";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HR } from "../../resources/rStyledComponent";
import { useState } from "react";
import AppText from "../../resources/AppText";
import { AntDesign } from "@expo/vector-icons";
import { numberWithCommas, usePrevious } from "../../resources/utils";
import { useToast, Box, Text as NativeBaseText, Spinner } from "native-base";
import { toastColorObject } from "../../resources/rStyledComponent";
import { getUsdTransactions, getUsdtTransactions, swapUsdForUsdt } from "../../containers/blockchain/action";

export default function Swap({ navigation }) {
  const toast = useToast();
  const dispatch = useDispatch();
  const userAuthentication = useSelector((state) => state.authentication.user);
  const usdTransactions = useSelector((state) => state.blockchain.usd);
  const usdtTransactions = useSelector((state) => state.blockchain.usdt);

  const usdUsdtSwapResponse = useSelector((state) => state.blockchain.usdusdtswap);
  const prevUsdUsdtSwapResponse = usePrevious(usdUsdtSwapResponse);

  const [amount, setAmount] = useState("");
  const [displaySpinner, setDisplaySpinner] = useState(false);
  const [transactionPin, setTransactionPin] = useState("");
  const [transactionStage, setTransactionStage] = useState(0);

  useEffect(() => {
    dispatch(getUsdtTransactions());
  }, []);

  useEffect(() => {
    if (amount != "" && usdUsdtSwapResponse.length && usdUsdtSwapResponse.length != prevUsdUsdtSwapResponse?.length) {
      if (usdUsdtSwapResponse[usdUsdtSwapResponse.length - 1]?.status == "success") {
        setDisplaySpinner(false);
        Alert.alert("Transfer successful", `Equivalent USDT will be remitted into your account between 5AM - 6AM (WAT). 🎉`, [
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
              <NativeBaseText style={{ color: "#FFFFFF" }}>{usdUsdtSwapResponse[usdUsdtSwapResponse.length - 1]?.message}</NativeBaseText>
            </Box>
          ),
        });
        setDisplaySpinner(false);
      }
    }
  }, [usdUsdtSwapResponse]);

  const proceedToNextStage = () => {
    if (amount == "" || Number(amount) < 1) {
      toast.show({
        render: () => (
          <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
            <NativeBaseText style={{ color: "#FFFFFF" }}>Input a valid amount</NativeBaseText>
          </Box>
        ),
      });
    } else {
      setTransactionStage(transactionStage + 1);
    }
  };
  const completeUsdSwap = () => {
    if (transactionPin == "" || transactionPin.length < 6 || Number(amount) < 15) {
      if (transactionPin == "" || transactionPin.length < 6) {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>Input transaction pin</NativeBaseText>
            </Box>
          ),
        });
      } else if (Number(amount) < 15) {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>USD - USDT swap amount cannot be less than $15</NativeBaseText>
            </Box>
          ),
        });
      }
    } else {
      setDisplaySpinner(true);
      dispatch(swapUsdForUsdt(amount, transactionPin));
    }
  };

  return (
    <View style={styles.container}>
      {transactionStage === 0 ? (
        <View style={{ margin: 10 }}>
          <AppText bold>Available Balance:</AppText>
          <AppText bold styles={{ fontSize: 18 }}>
            ${Number(usdTransactions.balance).toFixed(2)}
          </AppText>
          <View style={{ marginTop: 15 }}>
            <TextInput
              style={{ ...styles.textInput, marginTop: 10 }}
              placeholder="Enter USD Amount to Convert"
              placeholderTextColor="gray"
              keyboardType="numeric"
              value={amount}
              onChangeText={(value) => setAmount(value)}
            />
          </View>

          <View style={{ backgroundColor: "lightblue", padding: 10, borderRadius: 10, flexDirection: "row", alignItems: "center", marginTop: 10 }}>
            <AntDesign name="infocirlce" size={20} color="#198754" style={{ marginTop: 5 }} />
            <View>
              <AppText bold styles={{ color: "#040404", lineHeight: 22, marginLeft: 10 }}>
                $1 = ₮{usdTransactions.vetropay_usdt_from_usd_sale_value}
              </AppText>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => proceedToNextStage()}
            style={{ width: "100%", backgroundColor: "#266ddc", marginTop: 20, justifyContent: "center", height: 45, borderRadius: 5, alignItems: "center" }}
          >
            <AppText styles={{ color: "#ffffff", fontSize: 16 }} bold>
              Proceed
            </AppText>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ margin: 10, justifyContent: "center", alignItems: "center" }}>
          <AppText bold styles={{ fontSize: 25, color: "grey", marginTop: 15 }}>
            +{numberWithCommas(Number(amount).toFixed(2))} USDT
          </AppText>
          <AppText>≈ {numberWithCommas(amount)} USD</AppText>

          <View style={styles.transferContainer}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <AppText bold styles={{ color: "#36454F" }}>
                To
              </AppText>
              <AppText styles={{ fontSize: 12 }}>
                ({userAuthentication.fullname.split(" ")[0]}) {`${usdtTransactions?.address?.base58.substr(0, 7)}....${usdtTransactions?.address?.base58.substr(27)}`}
              </AppText>
            </View>
          </View>

          <View style={styles.transferContainer}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <AppText bold styles={{ color: "#36454F" }}>
                VetroPay Fee
              </AppText>
              <AppText styles={{ fontSize: 12 }}>${Number(usdTransactions.vetropay_usd_to_usdt_fee).toFixed(2)}</AppText>
            </View>
            <HR style={{ marginVertical: 10, borderBottomColor: "grey" }} />
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <AppText bold styles={{ color: "#36454F" }}>
                Total
              </AppText>
              <AppText styles={{ fontSize: 12 }}>${numberWithCommas((Number(amount) + Number(usdTransactions.vetropay_usd_to_usdt_fee)).toFixed(2))}</AppText>
            </View>
          </View>

          <AppText styles={{ fontSize: 13, color: "#5cb85c", marginTop: 10 }}>
            Dear Customer, our USD to USDT conversions currently happens only between (5AM - 6AM) WAT daily. New transactions may be pending till the next window. Thank you.
          </AppText>

          <TextInput
            style={{ ...styles.textInput, marginTop: 15, width: "90%" }}
            placeholder="Transaction Pin"
            placeholderTextColor="gray"
            keyboardType="numeric"
            value={transactionPin}
            secureTextEntry={true}
            onChangeText={(value) => setTransactionPin(value)}
          />

          {!displaySpinner ? (
            <TouchableOpacity
              onPress={() => completeUsdSwap()}
              style={{ width: "90%", backgroundColor: "#266ddc", marginTop: 20, justifyContent: "center", height: 45, borderRadius: 5, alignItems: "center" }}
            >
              <AppText styles={{ color: "#ffffff", fontSize: 16 }} bold>
                Complete
              </AppText>
            </TouchableOpacity>
          ) : (
            <View style={{ justifyContent: "center", alignItems: "center", marginTop: 20 }}>
              <Spinner size="lg" color="#266ddc" />
            </View>
          )}

          <Pressable
            disabled={displaySpinner}
            style={{ marginTop: 20 }}
            onPress={() => {
              setTransactionStage(0);
            }}
          >
            <AppText bold styles={{ color: "#da534f" }}>
              Cancel Transaction
            </AppText>
          </Pressable>
        </View>
      )}
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
