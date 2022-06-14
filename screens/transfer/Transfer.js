import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, ScrollView, StyleSheet, TouchableNativeFeedback, TouchableOpacity, TextInput, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AppText from "../../resources/AppText";
import { SendMoneySvgComponent, WithdrawToBankComponent, ScanQRComponent } from "../../resources/Svg";
import { PrimaryButton } from "../../resources/AppButton";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { numberWithCommas } from "../../resources/MetaFunctions";
import { Spinner, useToast, Box, Text as NativeBaseText } from "native-base";
import { getFxRates } from "../../containers/transactions/action";
import { toastColorObject } from "../../resources/rStyledComponent";
const INTERNATIONAL = "international";
const LOCAL = "local";

function Separator() {
  return <View style={styles.separator} />;
}

export default function Transfer({ navigation }) {
  const toast = useToast();
  const dispatch = useDispatch();
  const userAuthentication = useSelector((state) => state.authentication.user);
  const availableCountries = useSelector((state) => state.transactions.fxrates);
  const [transferState, setTransferState] = useState(LOCAL);
  const [amount, setAmount] = useState("");
  const [beneficiaryAmount, setBeneficiaryAmount] = useState("");
  const [beneficiaryCurrency, setBeneficiaryCurrency] = useState(availableCountries[0]);
  const [displaySpinner, setDisplaySpinner] = useState(false);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["1%", "55%"], []);

  useEffect(() => {
    dispatch(getFxRates());
  }, []);

  useEffect(() => {
    setBeneficiaryCurrency(availableCountries[0]);
  }, [availableCountries]);

  const renderBackdrop = useCallback((props) => <BottomSheetBackdrop {...props} />, []);
  const handleSheetChanges = useCallback((index) => {
    //console.log("handleSheetChanges", index);
  }, []);

  const handleSheetCloseRequest = (data) => {
    setBeneficiaryCurrency(data);
    bottomSheetRef.current.close();
  };

  const handleProcessTransaction = () => {
    if (Number(amount) < beneficiaryCurrency.minimum) {
      toast.show({
        render: () => (
          <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
            <NativeBaseText style={{ color: "#FFFFFF" }}>{`${beneficiaryCurrency.short} transactions cannot be less than ₦${numberWithCommas(
              beneficiaryCurrency.minimum
            )}`}</NativeBaseText>
          </Box>
        ),
      });
    } else {
      setDisplaySpinner(true);
      setTimeout(() => {
        setDisplaySpinner(false);
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>{`Incomplete KYC. Kindly contact support`}</NativeBaseText>
            </Box>
          ),
        });
      }, 2500);
    }
  };

  const renderTransferState = () => {
    if (transferState == LOCAL) {
      return (
        <View style={styles.listContainer}>
          {/** Send Money */}
          <TouchableNativeFeedback
            onPress={() => {
              if (userAuthentication.linked_business) {
                navigation.navigate("TransferBusiness");
              } else {
                navigation.navigate("SendMoney");
              }
            }}
          >
            <View style={styles.listItem}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                  <SendMoneySvgComponent />
                  <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                    Send money
                  </AppText>
                </View>

                <View>
                  <AntDesign name="right" color="grey" size={20} />
                </View>
              </View>
            </View>
          </TouchableNativeFeedback>
          {/** End Send Money */}
          <Separator />
          {/** Withdraw to bank */}
          <TouchableNativeFeedback onPress={() => navigation.navigate("Withdraw")}>
            <View style={styles.listItem}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                  <WithdrawToBankComponent />
                  <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                    Withdraw to Bank
                  </AppText>
                </View>

                <View>
                  <AntDesign name="right" color="grey" size={20} />
                </View>
              </View>
            </View>
          </TouchableNativeFeedback>
          {/** End Withdraw to bank */}
          <Separator />
          {/** Scan QR */}
          <TouchableNativeFeedback onPress={() => navigation.navigate("ScanPay")}>
            <View style={styles.listItem}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                  <ScanQRComponent />
                  <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                    Scan to Pay (QR)
                  </AppText>
                </View>

                <View>
                  <AntDesign name="right" color="grey" size={20} />
                </View>
              </View>
            </View>
          </TouchableNativeFeedback>
          {/** End Scan QR */}
        </View>
      );
    } else {
      return (
        <View style={styles.internationalContainer}>
          {/**Amount To Send */}
          <View style={styles.internationalAmountContainer}>
            <AppText styles={styles.internationalText}>Amount to Send</AppText>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TextInput
                keyboardType="number-pad"
                style={{ height: "100%", width: "50%", fontSize: 20, fontWeight: "bold" }}
                selectionColor="#000000"
                placeholder="0.00"
                value={amount}
                onChangeText={(text) => {
                  setAmount(text.replace(/\s/g, ""));
                  setBeneficiaryAmount(numberWithCommas(Number(text) / beneficiaryCurrency.rate));
                }}
              />
              <View>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: "#2b2b2b" }} bold>
                  🇳🇬 NGN
                </Text>
              </View>
            </View>
          </View>
          <View style={{ marginLeft: 10 }}>
            <Entypo name="flow-line" size={24} color="grey" />
            <Entypo name="flow-line" size={24} color="grey" style={{ marginTop: -9.8 }} />

            <AppText>
              Fx Rate ={" "}
              <AppText styles={{ color: "#266ddc" }} bold>
                {beneficiaryCurrency.short} {Number(beneficiaryCurrency.rate).toFixed(2)}
              </AppText>
              /NGN
            </AppText>

            <Entypo name="flow-line" size={24} color="grey" style={{ marginTop: 2 }} />
            <Entypo name="flow-line" size={24} color="grey" style={{ marginTop: -9.8 }} />

            <AppText>
              Processing Fee ={" "}
              <AppText styles={{ color: "#266ddc" }} bold>
                ₦{numberWithCommas(beneficiaryCurrency.fee)}
              </AppText>
            </AppText>

            <Entypo name="flow-line" size={24} color="grey" style={{ marginTop: 2 }} />
            <Entypo name="flow-line" size={24} color="grey" style={{ marginTop: -9.8 }} />

            <AppText>
              Total ={" "}
              <AppText styles={{ color: "#266ddc" }} bold>
                ₦{numberWithCommas(Number(amount) + Number(beneficiaryCurrency.fee))}
              </AppText>
            </AppText>

            <Entypo name="flow-line" size={24} color="grey" style={{ marginTop: 2 }} />
            <Entypo name="flow-line" size={24} color="grey" style={{ marginTop: -9.8 }} />

            {/**Amount Receiver */}
            <View style={styles.internationalAmountContainer}>
              <AppText styles={styles.internationalText}>Beneficiary will get</AppText>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View pointerEvents="none" style={{ width: "50%" }}>
                  <TextInput
                    keyboardType="number-pad"
                    style={{ height: "100%", width: "100%", fontSize: 20, fontWeight: "bold" }}
                    selectionColor="#000000"
                    placeholder="0.00"
                    value={beneficiaryAmount}
                  />
                </View>
                <TouchableOpacity onPress={() => bottomSheetRef.current?.expand()} style={{ flexDirection: "row" }}>
                  <Text style={{ fontSize: 18, fontWeight: "bold", color: "#2b2b2b" }} bold>
                    {beneficiaryCurrency.emoji} {beneficiaryCurrency.short}
                  </Text>

                  <MaterialIcons name="keyboard-arrow-down" size={24} color="grey" />
                </TouchableOpacity>
              </View>
            </View>

            {!displaySpinner ? (
              <PrimaryButton onPress={() => handleProcessTransaction()} on styles={{ width: "100%", marginTop: 20, height: 50 }}>
                <AppText bold styles={{ color: "#FFFFFF", fontSize: 16 }}>
                  Continue
                </AppText>
              </PrimaryButton>
            ) : (
              <View>
                <Spinner color="#266ddc" size="large" />
              </View>
            )}
          </View>
        </View>
      );
    }
  };

  return (
    <BottomSheetModalProvider>
      <ScrollView style={styles.container}>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <TouchableOpacity
            onPress={() => {
              setTransferState(LOCAL);
            }}
            style={{ width: "50%", justifyContent: "center", alignItems: "center" }}
          >
            <AppText>Local</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setTransferState(INTERNATIONAL);
            }}
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          >
            <AppText>International</AppText>
          </TouchableOpacity>
        </View>
        <View style={{ position: "relative", marginTop: 10, flexDirection: "column" }}>
          <View style={{ ...styles.separator, marginLeft: 0 }} />
          <View
            style={{
              ...styles.separator,
              marginLeft: 0,
              position: "absolute",
              width: "50%",
              borderBottomWidth: 3,
              borderBottomColor: "#266ddc",
              alignSelf: transferState == LOCAL ? "flex-start" : "flex-end",
            }}
          />
        </View>
        {renderTransferState()}
      </ScrollView>
      <BottomSheet ref={bottomSheetRef} index={0} enablePanDownToClose={true} snapPoints={snapPoints} backdropComponent={renderBackdrop} onChange={handleSheetChanges}>
        <View style={{ paddingHorizontal: 20 }}>
          {availableCountries.map((data, index) => {
            return (
              <View style={{ marginBottom: 20, marginTop: 15, flexDirection: "row", justifyContent: "space-between" }} key={index}>
                <AppText styles={{ fontSize: 18 }}>
                  {data.emoji} &nbsp; &nbsp; {data.currency} ({data.short})
                </AppText>

                <TouchableOpacity onPress={() => handleSheetCloseRequest(data)} style={styles.currencyRadioContainer}>
                  <View style={{ ...styles.currencyRadioContainerInner, backgroundColor: `${beneficiaryCurrency.short == data.short ? "#0bc8a5" : "#FFFFFF"}` }}></View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </BottomSheet>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F8",
  },
  separator: {
    marginVertical: 2,
    marginLeft: "10%",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  listContainer: {
    backgroundColor: "#FFFFFF",
    marginTop: 30,
    elevation: 2,
  },

  listItem: {
    height: 50,
    paddingHorizontal: 10,
    justifyContent: "center",
  },

  internationalContainer: {
    paddingVertical: 30,
    paddingHorizontal: 10,
  },

  internationalAmountContainer: {
    backgroundColor: "#FFFFFF",
    height: 70,
    width: "100%",
    alignSelf: "center",
    borderColor: "#EAE7C6",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  internationalText: {
    fontSize: 12,
    color: "#5D8BF4",
  },
  currencyRadioContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "grey",
    justifyContent: "center",
    alignItems: "center",
  },

  currencyRadioContainerInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
