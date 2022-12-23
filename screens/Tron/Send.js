import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, Pressable, Alert } from "react-native";
import AppText from "../../resources/AppText";
import { useSelector, useDispatch } from "react-redux";
import { HR, toastColorObject } from "../../resources/rStyledComponent";
import { useToast, Box, Text as NativeBaseText, Spinner } from "native-base";
import { usePrevious } from "../../resources/utils";
import { getTrxFees, getTrxTransactions, postTrxTransaction } from "../../containers/blockchain/action";

export default function Send({ navigation }) {
  const toast = useToast();
  const dispatch = useDispatch();
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [displaySpinner, setDisplaySpinner] = useState(false);
  const [transactionPin, setTransactionPin] = useState("");
  const [fee, setFee] = useState({
    known: false,
    amount: "",
  });

  const userAuthentication = useSelector((state) => state.authentication.user);
  const trxTransactions = useSelector((state) => state.blockchain.trx);
  const blockchainFees = useSelector((state) => state.blockchain.fees);
  const prevBlockchainFees = usePrevious(blockchainFees);
  const postedTransactions = useSelector((state) => state.blockchain.posts);
  const prevPostedTransactions = usePrevious(postedTransactions);
  const TRON_VALUE_IN_USD = Number(trxTransactions?.tron_value);

  useEffect(() => {
    if (recipientAddress != "" && blockchainFees.length && blockchainFees.length != prevBlockchainFees?.length) {
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
    if (recipientAddress != "" && postedTransactions.length && postedTransactions.length != prevPostedTransactions?.length) {
      if (postedTransactions[postedTransactions.length - 1]?.status == "success") {
        setDisplaySpinner(false);
        Alert.alert("Transfer successful", `${amount} TRX sent 🎉`, [
          {
            text: "Go Home",
            onPress: () => {
              dispatch(getTrxTransactions());
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

  const getTransactionFee = () => {
    if (recipientAddress.match(`T[A-Za-z1-9]{33}`) === null || recipientAddress == trxTransactions?.address?.base58 || amount === "" || Number(amount) < 1) {
      let message;
      if (recipientAddress.match(`T[A-Za-z1-9]{33}`) === null) {
        message = "Invalid wallet address";
      } else if (recipientAddress == trxTransactions?.address?.base58) {
        message = "Cannot transfer to self";
      } else if (amount === "") {
        message = "Amount should be set";
      } else {
        message = "Amount cannot be less than 1";
      }

      toast.show({
        render: () => (
          <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
            <NativeBaseText style={{ color: "#FFFFFF" }}>{message}</NativeBaseText>
          </Box>
        ),
      });
    } else {
      setDisplaySpinner(true);
      dispatch(getTrxFees("transfer", "TRX", recipientAddress));
    }
  };

  const completeTrxTransfer = () => {
    if (transactionPin == "" || trxTransactions?.balance?.balance < Number(amount)) {
      let message;
      if (transactionPin === "") {
        message = "Transaction Pin not set";
      } else if (trxTransactions?.balance?.balance < Number(amount)) {
        message = "Insufficient TRX balance.";
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
      dispatch(postTrxTransaction("transfer", "TRX", recipientAddress, amount, transactionPin));
    }
  };
  return (
    <View style={styles.container}>
      {fee.known == false ? (
        <View style={{ margin: 10 }}>
          <AppText>Recipient Address</AppText>
          <TextInput
            style={{ ...styles.textInput, marginTop: 10 }}
            placeholder="Paste Recipient address"
            placeholderTextColor="gray"
            value={recipientAddress}
            onChangeText={(value) => setRecipientAddress(value)}
          />

          <View style={{ marginTop: 15 }}>
            <AppText>Amount</AppText>
            <TextInput
              style={{ ...styles.textInput, marginTop: 10 }}
              placeholder="Enter Amount to Send"
              placeholderTextColor="gray"
              keyboardType="numeric"
              value={amount}
              onChangeText={(value) => setAmount(value)}
            />
          </View>

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
            -{amount} TRX
          </AppText>
          <AppText>≈ {Number(amount * TRON_VALUE_IN_USD).toFixed(2)} USD</AppText>

          <View style={styles.transferContainer}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <AppText bold styles={{ color: "#36454F" }}>
                From
              </AppText>
              <AppText styles={{ fontSize: 12 }}>
                ({userAuthentication.fullname.split(" ")[0]}) {`${trxTransactions?.address?.base58.substr(0, 7)}....${trxTransactions?.address?.base58.substr(27)}`}
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
              {fee.amount > 0 ? (
                <AppText styles={{ fontSize: 12 }}>
                  {Number(fee.amount).toFixed(2)} TRX (${Number(fee.amount * TRON_VALUE_IN_USD).toFixed(2)})
                </AppText>
              ) : (
                <AppText styles={{ fontSize: 12 }}>Free</AppText>
              )}
            </View>
            <HR style={{ marginVertical: 10, borderBottomColor: "grey" }} />
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <AppText bold styles={{ color: "#36454F" }}>
                Max Total
              </AppText>
              <AppText styles={{ fontSize: 12 }}>${(Number(fee.amount * TRON_VALUE_IN_USD) + Number(amount) * TRON_VALUE_IN_USD).toFixed(2)}</AppText>
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
              onPress={() => completeTrxTransfer()}
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
