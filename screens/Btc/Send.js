import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, Pressable, Alert } from "react-native";
import AppText from "../../resources/AppText";
import { useSelector, useDispatch } from "react-redux";
import { HR, toastColorObject } from "../../resources/rStyledComponent";
import { useToast, Box, Text as NativeBaseText, Spinner } from "native-base";
import { numberWithCommas, ONE_BTC_TO_SATS, usePrevious } from "../../resources/utils";
import { getBtcFees, getBtcTransactions, postBtcTransaction } from "../../containers/blockchain/action";
import { AntDesign } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Send({ navigation }) {
  const toast = useToast();
  const dispatch = useDispatch();
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [amountUSD, setAmountUSD] = useState("0");
  const [displaySpinner, setDisplaySpinner] = useState(false);
  const [activeCurrencyMode, setActiveCurrencyMode] = useState("BTC");
  const [transactionPin, setTransactionPin] = useState("");
  const [fee, setFee] = useState({
    known: false,
    amount: "",
    vetropayFee: "",
    totalPlusAmountToTransferPlusAmountFeesPlusVetroPayFee: "",
  });

  const userAuthentication = useSelector((state) => state.authentication.user);
  const btcTransactions = useSelector((state) => state.blockchain.btc);
  const blockchainFees = useSelector((state) => state.blockchain.fees);
  const prevBlockchainFees = usePrevious(blockchainFees);
  const postedTransactions = useSelector((state) => state.blockchain.posts);
  const prevPostedTransactions = usePrevious(postedTransactions);
  const BTC_VALUE_IN_USD = Number(btcTransactions?.btc_value);
  const VETROPAY_FEE = Number(btcTransactions?.vetropay_usdt_fee);

  useEffect(() => {
    if (recipientAddress != "" && blockchainFees.length && blockchainFees.length != prevBlockchainFees?.length) {
      if (blockchainFees[blockchainFees.length - 1]?.status == "success") {
        setFee({
          known: true,
          amount: blockchainFees[blockchainFees.length - 1]?.data?.fee?.tx?.fees,
          vetropayFee: blockchainFees[blockchainFees.length - 1]?.data?.fee?.tx?.outputs[1]?.value,
          totalPlusAmountToTransferPlusAmountFeesPlusVetroPayFee:
            blockchainFees[blockchainFees.length - 1]?.data?.fee?.tx?.fees +
            blockchainFees[blockchainFees.length - 1]?.data?.fee?.tx?.outputs[0]?.value +
            blockchainFees[blockchainFees.length - 1]?.data?.fee?.tx?.outputs[1]?.value,
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
    if (recipientAddress != "" && postedTransactions.length && postedTransactions.length != prevPostedTransactions?.length) {
      if (postedTransactions[postedTransactions.length - 1]?.status == "success") {
        setDisplaySpinner(false);
        Alert.alert("Transfer successful", `${amount} ${activeCurrencyMode} sent 🎉`, [
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

  useEffect(() => {
    setFee({
      known: false,
      amount: "",
    });
  }, []);

  useEffect(() => {
    if (Number(amount) > 0) {
      if (activeCurrencyMode == "BTC") {
        let usdValue = Number(Number(amount) * BTC_VALUE_IN_USD).toFixed(2);
        setAmountUSD(usdValue);
      } else if (activeCurrencyMode == "SATS") {
        let usdValue = Number((Number(amount) / ONE_BTC_TO_SATS) * BTC_VALUE_IN_USD).toFixed(2);
        setAmountUSD(usdValue);
      } else {
        setAmountUSD(0);
      }
    }
  }, [amount, activeCurrencyMode]);

  const getTransactionFee = () => {
    if (recipientAddress.match(`^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$`) === null || recipientAddress == btcTransactions?.address?.address || amount === "" || 0 > Number(amount)) {
      let message;
      if (recipientAddress.match(`^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$`) === null) {
        message = "Invalid wallet address";
      } else if (recipientAddress == btcTransactions?.address?.address) {
        message = "Cannot transfer to self";
      } else if (amount === "") {
        message = "Amount should be set";
      } else {
        message = "Amount cannot be less than 0 or less";
      }

      toast.show({
        render: () => (
          <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
            <NativeBaseText style={{ color: "#FFFFFF" }}>{message}</NativeBaseText>
          </Box>
        ),
      });
    } else {
      let amountBtc = activeCurrencyMode == "BTC" ? amount : Number(amount) / ONE_BTC_TO_SATS;
      setDisplaySpinner(true);
      dispatch(getBtcFees("transfer", "BTC", recipientAddress, "high", amountBtc));
    }
  };

  const completeUsdtTransfer = () => {
    if (transactionPin == "" || btcTransactions?.balance?.balance < Number(amount) + Number(VETROPAY_FEE)) {
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
      let amountBtc = activeCurrencyMode == "BTC" ? amount : Number(amount) / ONE_BTC_TO_SATS;
      dispatch(postBtcTransaction("transfer", "BTC", recipientAddress, amountBtc, "high", transactionPin));
    }
  };
  return (
    <KeyboardAwareScrollView style={styles.container}>
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
          <AppText>Recipient Address</AppText>
          <TextInput
            style={{ ...styles.textInput, marginTop: 10 }}
            placeholder="Paste Recipient address"
            placeholderTextColor="gray"
            value={recipientAddress}
            onChangeText={(value) => setRecipientAddress(value)}
          />

          <View style={{ marginTop: 15 }}>
            <AppText>Amount (≈ ${numberWithCommas(Number(amountUSD).toFixed(2))})</AppText>
            <TextInput
              style={{ ...styles.textInput, marginTop: 10 }}
              placeholder="Enter Amount to Send"
              placeholderTextColor="gray"
              keyboardType="numeric"
              value={amount}
              onChangeText={(value) => {
                setAmount(value);
              }}
            />
          </View>

          {activeCurrencyMode == "SATS" && (
            <View style={{ backgroundColor: "lightblue", padding: 10, borderRadius: 10, flexDirection: "row", alignItems: "center", marginTop: 10 }}>
              <AntDesign name="infocirlce" size={20} color="#198754" style={{ marginTop: 5 }} />
              <View>
                <AppText bold styles={{ color: "#040404", lineHeight: 22, marginLeft: 10, marginRight: 7 }}>
                  Satoshi (SATS) are smaller denomination of the Bitcoin. Microtransactions and payments are easier and more readable with Sats.
                </AppText>
              </View>
            </View>
          )}

          {!displaySpinner ? (
            <TouchableOpacity
              onPress={() => getTransactionFee()}
              style={{ width: "100%", backgroundColor: "#266ddc", marginTop: 20, justifyContent: "center", height: 45, borderRadius: 5, alignItems: "center" }}
            >
              <AppText styles={{ color: "#ffffff", fontSize: 16 }} bold>
                Proceed
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
            -{activeCurrencyMode == "BTC" ? +amount * ONE_BTC_TO_SATS : numberWithCommas(+amount)} SATS
          </AppText>
          <AppText>{activeCurrencyMode == "BTC" ? Number(amount).toFixed(8) : Number(+amount / ONE_BTC_TO_SATS).toFixed(8)} BTC</AppText>
          <AppText>
            ≈{" "}
            {activeCurrencyMode == "BTC"
              ? numberWithCommas(Number(+amount * BTC_VALUE_IN_USD).toFixed(2))
              : numberWithCommas(Number((+amount / ONE_BTC_TO_SATS) * BTC_VALUE_IN_USD).toFixed(2))}{" "}
            USD
          </AppText>

          <View style={styles.transferContainer}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <AppText bold styles={{ color: "#36454F" }}>
                From
              </AppText>
              <AppText styles={{ fontSize: 12 }}>
                ({userAuthentication.fullname.split(" ")[0]}) {`${btcTransactions?.address?.address.substr(0, 7)}....${btcTransactions?.address?.address.substr(27)}`}
              </AppText>
            </View>
            <HR style={{ marginVertical: 10, borderBottomColor: "grey" }} />
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <AppText bold styles={{ color: "#36454F" }}>
                To
              </AppText>
              <AppText styles={{ fontSize: 12 }}>{recipientAddress}</AppText>
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
                VetroPay Fee
              </AppText>
              <AppText styles={{ fontSize: 12 }}>{numberWithCommas(Number(fee.vetropayFee))} Sats</AppText>
            </View>
            <HR style={{ marginVertical: 10, borderBottomColor: "grey" }} />
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <AppText bold styles={{ color: "#36454F" }}>
                Max Total
              </AppText>
              <AppText styles={{ fontSize: 12 }}>
                {numberWithCommas(fee.totalPlusAmountToTransferPlusAmountFeesPlusVetroPayFee)} Sats ($
                {Number((+fee.totalPlusAmountToTransferPlusAmountFeesPlusVetroPayFee / ONE_BTC_TO_SATS) * BTC_VALUE_IN_USD).toFixed(2)})
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
