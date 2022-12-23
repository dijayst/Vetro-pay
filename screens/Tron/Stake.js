import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import AppText from "../../resources/AppText";
import { HR, toastColorObject } from "../../resources/rStyledComponent";
import { useToast, Box, Text as NativeBaseText, Spinner } from "native-base";
import { PrimaryButton } from "../../resources/AppButton";
import { customTrxWithCommas, usePrevious } from "../../resources/utils";
import BottomSheet, { BottomSheetModalProvider, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { freezeTrxPrompt, unFreezeTrxPrompt } from "../../containers/blockchain/action";

export default function Stake({ navigation }) {
  const toast = useToast();
  const dispatch = useDispatch();
  const [actionState, setActionState] = useState(""); // STAKE or UNSTAKE
  const [transactionPin, setTransactionPin] = useState("");
  const [amount, setAmount] = useState("");
  const trxTransactions = useSelector((state) => state.blockchain.trx);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["1%", "90%"], []);
  const [displaySpinner, setDisplaySpinner] = useState(false);

  const freezeTrxResponse = useSelector((state) => state.blockchain.freezetrx);
  const prevFreezeTrxResponse = usePrevious(freezeTrxResponse);

  const renderBackdrop = useCallback((props) => <BottomSheetBackdrop {...props} />, []);
  const handleSheetChanges = useCallback((index) => {}, []);

  useEffect(() => {
    if (actionState != "" && freezeTrxResponse.length && freezeTrxResponse.length != prevFreezeTrxResponse?.length) {
      if (freezeTrxResponse[freezeTrxResponse.length - 1]?.status == "success") {
        setDisplaySpinner(false);
        setAmount("");
        setTransactionPin("");
        Alert.alert("Freeze TRX successful", `${amount} TRX ${actionState == "STAKE" ? "frozen" : "unfrozen"} 🎉`, [
          {
            text: "Close",
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
              <NativeBaseText style={{ color: "#FFFFFF" }}>{freezeTrxResponse[freezeTrxResponse.length - 1]?.message}</NativeBaseText>
            </Box>
          ),
        });
        setAmount("");
        setTransactionPin("");
        setDisplaySpinner(false);
      }
    }
  }, [freezeTrxResponse]);

  const freezeTrxFunction = () => {
    if (amount == "" || Number(amount) > trxTransactions?.balance?.balance || transactionPin == "" || transactionPin.length < 6) {
      if (amount == "") {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>{`Amount not set`}</NativeBaseText>
            </Box>
          ),
        });
      } else if (Number(amount) > trxTransactions?.balance?.balance) {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>{`Insufficient balance`}</NativeBaseText>
            </Box>
          ),
        });
      } else if (transactionPin == "" || transactionPin.length < 6) {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>{`Incorrect Pin`}</NativeBaseText>
            </Box>
          ),
        });
      }
    } else {
      // Display Spinner && Close Popup
      bottomSheetRef.current.close();
      setDisplaySpinner(true);
      dispatch(freezeTrxPrompt(amount, transactionPin));
    }
  };

  const unFreezeTrxFunction = () => {
    if (transactionPin == "" || transactionPin.length < 6) {
      toast.show({
        render: () => (
          <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
            <NativeBaseText style={{ color: "#FFFFFF" }}>{`Incorrect Pin`}</NativeBaseText>
          </Box>
        ),
      });
    } else {
      // Display Spinner && Close Popup
      bottomSheetRef.current.close();
      setDisplaySpinner(true);
      dispatch(unFreezeTrxPrompt(transactionPin));
    }
  };

  return (
    <BottomSheetModalProvider style={styles.container}>
      <ScrollView style={{ flex: 1, margin: 10 }}>
        <View style={styles.dataRow}>
          <AppText styles={styles.dataRowText}>Available TRX</AppText>
          <AppText styles={styles.dataRowText}>{customTrxWithCommas(Number(trxTransactions?.balance?.balance).toFixed(6))}</AppText>
        </View>
        <HR />

        {/** */}
        <View style={styles.dataRow}>
          <AppText styles={styles.dataRowText}>Staked TRX</AppText>
          <AppText styles={styles.dataRowText}>{trxTransactions?.balance?.frozenForBandWidth} TRX</AppText>
        </View>
        <HR />
        {/** */}

        {/** */}
        <View style={styles.dataRow}>
          <AppText styles={styles.dataRowText}>Minimum Amount</AppText>
          <AppText styles={styles.dataRowText}>1 TRX</AppText>
        </View>
        <HR />
        {/** */}

        {/** */}
        <View style={styles.dataRow}>
          <AppText styles={styles.dataRowText}>Lock Time</AppText>
          <AppText styles={styles.dataRowText}>3 days</AppText>
        </View>
        <HR />
        {/** */}

        {!displaySpinner ? (
          <View style={{ width: "100%" }}>
            <PrimaryButton
              onPress={() => {
                setActionState("UNSTAKE");
                bottomSheetRef.current?.expand();
              }}
              disabled={trxTransactions?.balance?.frozenForBandWidth < 1}
              styles={{ width: "100%", backgroundColor: "#266ddc", marginTop: 20, justifyContent: "center", height: 45, borderRadius: 5, alignItems: "center" }}
            >
              <AppText styles={{ color: "#ffffff", fontSize: 16 }} bold>
                Unstake
              </AppText>
            </PrimaryButton>

            <PrimaryButton
              onPress={() => {
                setActionState("STAKE");
                bottomSheetRef.current?.expand();
              }}
              styles={{ width: "100%", backgroundColor: "#266ddc", marginTop: 20, justifyContent: "center", height: 45, borderRadius: 5, alignItems: "center" }}
            >
              <AppText styles={{ color: "#ffffff", fontSize: 16 }} bold>
                Stake
              </AppText>
            </PrimaryButton>
          </View>
        ) : (
          <View style={{ justifyContent: "center", alignItems: "center", marginTop: 20 }}>
            <Spinner size="lg" color="#266ddc" />
          </View>
        )}
        <AppText bold styles={{ marginTop: 20, marginBottom: 50 }}>
          Please Note: TRX Resource delegation is currently unavailable on VetroPay. We understand that there are risks associated with staking your tokens with Validators, we are
          currently working on an improved process {"&"} guidline for Stakes.
        </AppText>
      </ScrollView>
      <BottomSheet ref={bottomSheetRef} index={0} enablePanDownToClose={true} snapPoints={snapPoints} backdropComponent={renderBackdrop} onChange={handleSheetChanges}>
        {actionState == "STAKE" ? (
          <View style={{ paddingHorizontal: 20 }}>
            <AppText bold>Enter TRX Amount to Freeze</AppText>
            <TextInput
              style={{ ...styles.textInput, marginTop: 15 }}
              placeholder="Amount"
              placeholderTextColor="gray"
              keyboardType="numeric"
              value={amount}
              onChangeText={(value) => setAmount(value)}
            />

            <AppText bold>Transaction Pin</AppText>
            <TextInput
              style={{ ...styles.textInput, marginTop: 15 }}
              placeholder="Transaction Pin"
              placeholderTextColor="gray"
              keyboardType="numeric"
              value={transactionPin}
              secureTextEntry={true}
              onChangeText={(value) => setTransactionPin(value)}
            />

            <TouchableOpacity
              onPress={() => {
                freezeTrxFunction();
              }}
              style={{ width: "100%", backgroundColor: "#266ddc", marginTop: 20, justifyContent: "center", height: 45, borderRadius: 5, alignItems: "center" }}
            >
              <AppText styles={{ color: "#ffffff", fontSize: 16 }} bold>
                Complete
              </AppText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 20 }}>
            <AppText bold styles={{ fontSize: 18 }}>
              Un-Freeze {trxTransactions?.balance?.frozenForBandWidth} TRX
            </AppText>
            <AppText bold styles={{ marginTop: 20 }}>
              Transaction Pin
            </AppText>
            <TextInput
              style={{ ...styles.textInput, marginTop: 15 }}
              placeholder="Transaction Pin"
              placeholderTextColor="gray"
              keyboardType="numeric"
              value={transactionPin}
              secureTextEntry={true}
              onChangeText={(value) => setTransactionPin(value)}
            />

            <TouchableOpacity
              onPress={() => {
                unFreezeTrxFunction();
              }}
              style={{ width: "100%", backgroundColor: "#266ddc", marginTop: 20, justifyContent: "center", height: 45, borderRadius: 5, alignItems: "center" }}
            >
              <AppText styles={{ color: "#ffffff", fontSize: 16 }} bold>
                Complete
              </AppText>
            </TouchableOpacity>
          </View>
        )}
      </BottomSheet>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dataRowText: {
    fontSize: 17,
    marginTop: 10,
    marginBottom: 15,
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
});
