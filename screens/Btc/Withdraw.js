import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, TextInput, StyleSheet, Pressable, TouchableOpacity, Alert } from "react-native";
import AppText from "../../resources/AppText";
import { ONE_BTC_TO_SATS, usePrevious, numberWithCommas } from "../../resources/utils";
import { HR, toastColorObject } from "../../resources/rStyledComponent";
import { useToast, Box, Text as NativeBaseText, Spinner } from "native-base";
import { getBtcFees, getBtcTransactions, postBtcTransaction } from "../../containers/blockchain/action";
import { VETROPAY_ADMIN_BTC_ADDRESS } from "../../containers/rootAction/env";

export default function Withdraw({ navigation }) {
  const toast = useToast();
  const dispatch = useDispatch();
  const [userAmount, setUserAmount] = useState("");
  const [displaySpinner, setDisplaySpinner] = useState(false);
  const [transactionPin, setTransactionPin] = useState("");
  const [activeCurrencyMode, setActiveCurrencyMode] = useState("BTC");
  const [fee, setFee] = useState({
    known: false,
    amount: "",
    totalPlusAmountToTransferPlusAmountFees: "",
  });
  const btcTransactions = useSelector((state) => state.blockchain.btc);
  const USD_RATE = btcTransactions?.ngn_usd_current;
  const BTC_VALUE_IN_USD = Number(btcTransactions?.btc_value);
  const blockchainFees = useSelector((state) => state.blockchain.fees);
  const prevBlockchainFees = usePrevious(blockchainFees);
  const postedTransactions = useSelector((state) => state.blockchain.posts);
  const prevPostedTransactions = usePrevious(postedTransactions);

  useEffect(() => {
    setFee({
      known: false,
      amount: "",
      totalPlusAmountToTransferPlusAmountFees: "",
    });
  }, []);

  useEffect(() => {
    if (userAmount != "" && blockchainFees.length && blockchainFees.length != prevBlockchainFees?.length) {
      if (blockchainFees[blockchainFees.length - 1]?.status == "success") {
        setFee({
          known: true,
          amount: blockchainFees[blockchainFees.length - 1]?.data?.fee?.tx?.fees,
          totalPlusAmountToTransferPlusAmountFees:
            blockchainFees[blockchainFees.length - 1]?.data?.fee?.tx?.fees + blockchainFees[blockchainFees.length - 1]?.data?.fee?.tx?.outputs[0]?.value,
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
    if (userAmount != "" && postedTransactions.length && postedTransactions.length != prevPostedTransactions?.length) {
      if (postedTransactions[postedTransactions.length - 1]?.status == "success") {
        setDisplaySpinner(false);
        Alert.alert("Transfer successful", `${userAmount} ${activeCurrencyMode} 🎉\n\nBTC withdrawal may take up to 6 -10 minutes. Check NGN Wallet 😉`, [
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
              <NativeBaseText style={{ color: "#FFFFFF" }}>{postedTransactions[postedTransactions.length - 1]?.message}</NativeBaseText>
            </Box>
          ),
        });
        setDisplaySpinner(false);
      }
    }
  }, [postedTransactions]);

  const getTransactionFee = () => {
    if (Number(userAmount) > 0) {
      setDisplaySpinner(true);
      let amountBtc = activeCurrencyMode == "BTC" ? userAmount : Number(userAmount) / ONE_BTC_TO_SATS;
      setDisplaySpinner(true);
      dispatch(getBtcFees("withdraw", "BTC", VETROPAY_ADMIN_BTC_ADDRESS, "high", amountBtc));
    }
  };

  const completeUsdtTransfer = () => {
    if (transactionPin == "" || btcTransactions?.balance?.balance < Number(userAmount)) {
      let message;
      if (transactionPin === "") {
        message = "Transaction Pin not set";
      } else if (btcTransactions?.balance?.balance < Number(amount) + Number(VETROPAY_FEE)) {
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
      let amountBtc = activeCurrencyMode == "BTC" ? userAmount : Number(userAmount) / ONE_BTC_TO_SATS;
      dispatch(postBtcTransaction("transfer", "BTC", VETROPAY_ADMIN_BTC_ADDRESS, amountBtc, "high", transactionPin));
    }
  };
  return (
    <View style={styles.container}>
      {fee.known == false ? (
        <View style={{ margin: 10 }}>
          {/** BTC/SATS SWITCH TAB */}
          <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 20, marginTop: 5 }}>
            <View style={{ flexDirection: "row", borderWidth: 0.5, borderRadius: 5, width: 180, height: 45, backgroundColor: "FFFFFF", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => {
                  setActiveCurrencyMode("BTC");
                }}
                style={{
                  ...styles.btcSatsdefaultTextContainer,
                  backgroundColor: activeCurrencyMode == "BTC" ? "#266ddc" : "#F2F2F2",
                  borderBottomLeftRadius: activeCurrencyMode == "BTC" ? 5 : 0,
                  borderTopLeftRadius: activeCurrencyMode == "BTC" ? 5 : 0,
                }}
              >
                <AppText>BTC</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setActiveCurrencyMode("SATS");
                }}
                style={{
                  ...styles.btcSatsdefaultTextContainer,
                  backgroundColor: activeCurrencyMode == "SATS" ? "#266ddc" : "#F2F2F2",
                  borderBottomRightRadius: activeCurrencyMode == "SATS" ? 5 : 0,
                  borderTopRightRadius: activeCurrencyMode == "SATS" ? 5 : 0,
                }}
              >
                <AppText>SATS</AppText>
              </TouchableOpacity>
            </View>
          </View>
          {/** END BTC/SATS SWITCH TAB */}

          <AppText bold>Available Balance:</AppText>
          <AppText bold styles={{ fontSize: 18 }}>
            ₿ {Number(btcTransactions?.balance?.balance / ONE_BTC_TO_SATS).toFixed(8)}{" "}
            <AppText bold styles={{ color: "grey", fontSize: 14 }}>
              ({numberWithCommas(Number(btcTransactions?.balance?.balance))} SATS)
            </AppText>
          </AppText>

          <TextInput
            style={{ ...styles.textInput, marginTop: 20 }}
            placeholder={`Amount in ${activeCurrencyMode}`}
            placeholderTextColor="gray"
            keyboardType="numeric"
            value={userAmount}
            onChangeText={(value) => setUserAmount(value)}
          />

          {(activeCurrencyMode == "BTC" && +userAmount * ONE_BTC_TO_SATS <= btcTransactions?.balance?.balance) ||
          (activeCurrencyMode == "SATS" && userAmount <= btcTransactions?.balance?.balance) ? (
            <View style={styles.creditBox}>
              <AppText>
                You will receive: ₦
                {userAmount > 0
                  ? `${
                      activeCurrencyMode == "BTC"
                        ? numberWithCommas(Number(+userAmount * BTC_VALUE_IN_USD * USD_RATE).toFixed(2))
                        : numberWithCommas(Number((+userAmount / ONE_BTC_TO_SATS) * BTC_VALUE_IN_USD * USD_RATE).toFixed(2))
                    }`
                  : "0.00"}
              </AppText>
            </View>
          ) : (
            <View style={{ ...styles.creditBox, backgroundColor: "#da534f" }}>
              <AppText>Insufficient Balance</AppText>
            </View>
          )}

          {!displaySpinner ? (
            <TouchableOpacity
              disabled={Number(userAmount) < 1 || userAmount > btcTransactions?.balance?.balance}
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
            -{activeCurrencyMode == "BTC" ? +userAmount * ONE_BTC_TO_SATS : numberWithCommas(+userAmount)} SATS
          </AppText>
          <AppText>{activeCurrencyMode == "BTC" ? Number(userAmount).toFixed(8) : Number(+userAmount / ONE_BTC_TO_SATS).toFixed(8)} BTC</AppText>
          <AppText>
            ≈{" "}
            {activeCurrencyMode == "BTC"
              ? numberWithCommas(Number(+userAmount * BTC_VALUE_IN_USD).toFixed(2))
              : numberWithCommas(Number((+userAmount / ONE_BTC_TO_SATS) * BTC_VALUE_IN_USD).toFixed(2))}{" "}
            USD
          </AppText>

          <View style={styles.transferContainer}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <AppText bold styles={{ color: "#36454F" }}>
                Expected Deposit
              </AppText>
              <AppText styles={{ fontSize: 12 }}>
                ₦
                {activeCurrencyMode == "BTC"
                  ? numberWithCommas(Number(+userAmount * BTC_VALUE_IN_USD * USD_RATE).toFixed(2))
                  : numberWithCommas(Number((+userAmount / ONE_BTC_TO_SATS) * BTC_VALUE_IN_USD * USD_RATE).toFixed(2))}
              </AppText>
            </View>
          </View>

          <View style={styles.transferContainer}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <AppText bold styles={{ color: "#36454F" }}>
                Network Fee
              </AppText>
              <AppText styles={{ fontSize: 12 }}>
                {numberWithCommas(Number(fee.amount))} Sats (${Number((fee.amount / ONE_BTC_TO_SATS) * BTC_VALUE_IN_USD).toFixed(2)})
              </AppText>
            </View>
            <HR style={{ marginVertical: 10, borderBottomColor: "grey" }} />
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <AppText bold styles={{ color: "#36454F" }}>
                Max Total
              </AppText>
              <AppText styles={{ fontSize: 12 }}>
                {numberWithCommas(fee.totalPlusAmountToTransferPlusAmountFees)} Sats ($
                {Number((+fee.totalPlusAmountToTransferPlusAmountFees / ONE_BTC_TO_SATS) * BTC_VALUE_IN_USD).toFixed(2)})
              </AppText>
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
  btcSatsdefaultTextContainer: {
    width: "50%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
