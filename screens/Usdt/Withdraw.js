import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, TextInput, StyleSheet, Pressable, TouchableOpacity, Alert } from "react-native";
import AppText from "../../resources/AppText";
import { numberWithCommas } from "../../resources/MetaFunctions";
import { usePrevious } from "../../resources/utils";
import { HR, toastColorObject } from "../../resources/rStyledComponent";
import { useToast, Box, Text as NativeBaseText, Spinner } from "native-base";
import { getTrxFees, getUsdtTransactions, postTrxTransaction } from "../../containers/blockchain/action";

export default function Withdraw({ navigation }) {
  const toast = useToast();
  const dispatch = useDispatch();
  const [userUsdtAmount, setUserUsdtAmount] = useState("");
  const [displaySpinner, setDisplaySpinner] = useState(false);
  const [transactionPin, setTransactionPin] = useState("");
  const [fee, setFee] = useState({
    known: false,
    amount: "",
  });
  const usdtTransactions = useSelector((state) => state.blockchain.usdt);
  const USD_RATE = usdtTransactions?.usd_ngn_current;
  const TRON_VALUE_IN_USD = Number(usdtTransactions?.tron_value);
  const blockchainFees = useSelector((state) => state.blockchain.fees);
  const prevBlockchainFees = usePrevious(blockchainFees);
  const postedTransactions = useSelector((state) => state.blockchain.posts);
  const prevPostedTransactions = usePrevious(postedTransactions);

  useEffect(() => {
    setFee({
      known: false,
      amount: "",
    });
  }, []);

  useEffect(() => {
    if (userUsdtAmount != "" && blockchainFees.length && blockchainFees.length != prevBlockchainFees?.length) {
      if (blockchainFees[blockchainFees.length - 1]?.status == "success") {
        setFee({
          known: true,
          amount: blockchainFees[blockchainFees.length - 1]?.data?.fee,
        });
        setDisplaySpinner(false);
      } else {
        setDisplaySpinner(false);
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>{blockchainFees[blockchainFees.length - 1]?.message}</NativeBaseText>
            </Box>
          ),
        });
      }
    }
  }, [blockchainFees]);

  useEffect(() => {
    if (userUsdtAmount != "" && postedTransactions.length && postedTransactions.length != prevPostedTransactions?.length) {
      if (postedTransactions[postedTransactions.length - 1]?.status == "success") {
        setDisplaySpinner(false);
        Alert.alert("Transfer successful", `${userUsdtAmount} USDT withdraw 🎉\n\nCheck NGN Wallet 😉`, [
          {
            text: "Go Home",
            onPress: () => {
              dispatch(getUsdtTransactions());
              navigation.goBack();
            },
          },
        ]);
      } else {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>{postedTransactions[postedTransactions.length - 1]?.message}</NativeBaseText>
            </Box>
          ),
        });
        setDisplaySpinner(false);
      }
    }
  }, [postedTransactions]);

  const getTransactionFee = () => {
    if (Number(userUsdtAmount) > 0) {
      setDisplaySpinner(true);
      dispatch(getTrxFees("withdraw", "USDT", usdtTransactions?.address?.base58));
    }
  };

  const completeUsdtTransfer = () => {
    if (transactionPin == "" || usdtTransactions?.balance?.balance < Number(userUsdtAmount)) {
      let message;
      if (transactionPin === "") {
        message = "Transaction Pin not set";
      } else if (usdtTransactions?.balance?.balance < Number(amount) + Number(VETROPAY_FEE)) {
        message = "Insufficient USDT balance.";
      }

      toast.show({
        render: () => (
          <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
            <NativeBaseText style={{ color: "#FFFFFF" }}>{message}</NativeBaseText>
          </Box>
        ),
      });
    } else {
      // SEND TRANSACTION
      setDisplaySpinner(true);
      dispatch(postTrxTransaction("withdraw", "USDT", usdtTransactions?.address?.base58, userUsdtAmount, transactionPin));
    }
  };
  return (
    <View style={styles.container}>
      {fee.known == false ? (
        <View style={{ margin: 10 }}>
          <AppText bold>Available Balance:</AppText>
          <AppText bold styles={{ fontSize: 18 }}>
            ₮{Number(usdtTransactions?.balance?.balance).toFixed(2)}
          </AppText>

          <TextInput
            style={{ ...styles.textInput, marginTop: 20 }}
            placeholder="Amount in USDT"
            placeholderTextColor="gray"
            keyboardType="numeric"
            value={userUsdtAmount}
            onChangeText={(value) => setUserUsdtAmount(value)}
          />

          {userUsdtAmount <= usdtTransactions?.balance?.balance ? (
            <View style={styles.creditBox}>
              <AppText>You will receive: ₦{userUsdtAmount > 0 ? numberWithCommas(userUsdtAmount * USD_RATE) : "0.00"}</AppText>
            </View>
          ) : (
            <View style={{ ...styles.creditBox, backgroundColor: "#da534f" }}>
              <AppText>Insufficient Balance</AppText>
            </View>
          )}

          {!displaySpinner ? (
            <TouchableOpacity
              disabled={Number(userUsdtAmount) < 1 || userUsdtAmount > usdtTransactions?.balance?.balance}
              onPress={() => getTransactionFee()}
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
      ) : (
        <View style={{ margin: 10, justifyContent: "center", alignItems: "center" }}>
          <AppText bold styles={{ fontSize: 25, color: "grey", marginTop: 15 }}>
            -{userUsdtAmount} USDT
          </AppText>
          <AppText>≈ {userUsdtAmount} USD</AppText>

          <View style={styles.transferContainer}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <AppText bold styles={{ color: "#36454F" }}>
                Expected Deposit
              </AppText>
              <AppText styles={{ fontSize: 12 }}>₦{numberWithCommas(userUsdtAmount * USD_RATE)}</AppText>
            </View>
          </View>

          <View style={styles.transferContainer}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <AppText bold styles={{ color: "#36454F" }}>
                Network Fee
              </AppText>
              <AppText styles={{ fontSize: 12 }}>
                {Number(fee.amount).toFixed(2)} TRX (${Number(fee.amount * TRON_VALUE_IN_USD).toFixed(2)})
              </AppText>
            </View>
            <HR style={{ marginVertical: 10, borderBottomColor: "grey" }} />
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <AppText bold styles={{ color: "#36454F" }}>
                Max Total
              </AppText>
              <AppText styles={{ fontSize: 12 }}>${(Number(fee.amount * TRON_VALUE_IN_USD) + Number(userUsdtAmount)).toFixed(2)}</AppText>
            </View>
          </View>

          <AppText styles={{ fontSize: 12, color: "#5cb85c", marginTop: 10 }}>Network fee may cost less than estimated. Cheers!</AppText>

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
              onPress={() => completeUsdtTransfer()}
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
            style={{ marginTop: 20 }}
            onPress={() => {
              setFee({
                known: false,
                amount: "",
              });
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
