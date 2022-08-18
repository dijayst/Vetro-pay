import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { Dimensions, View, Text, StyleSheet, Modal, TextInput } from "react-native";
import { ImageBackground } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import AppText from "../../resources/AppText";
import { PrimaryButton } from "../../resources/AppButton";

import { getBank } from "../../containers/banks/action";
const BankBackgroundImage = require("../../assets/rectangle.png");
import { BankWalletSvgComponent, SuccessfulSvgComponent } from "../../resources/Svg";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Spinner, useToast, Box, Text as NativeBaseText } from "native-base";

import { userBankWithdraw } from "../../containers/banks/action";
import { toastColorObject } from "../../resources/rStyledComponent";

export default function Withdraw({ navigation }) {
  const toast = useToast();
  const dispatch = useDispatch();

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [accountBalance, setAccountBalance] = useState(0);
  const [userBankInfo, setUserBankInfo] = useState({ status: "unknown" });
  const [userBankError, setUserBankError] = useState(true);
  const [displaySpinner, setDisplaySpinner] = useState(false);
  const [withdrawalData, setWithdrawalData] = useState({
    payload: {
      amount: "",
      transactionCharge: "0.00",
    },
  });

  const userTransactions = useSelector((state) => state.transactions.usertransactions);
  const userBank = useSelector((state) => state.banks.banks);
  const prevUserBank = usePrevious(userBank);
  const userAuthentication = useSelector((state) => state.authentication.user);
  const currency = userAuthentication.country == "NIGERIA" ? "NGN" : "KES";

  const withdrawToBankResponse = useSelector((state) => state.banks.bankwithdraw);
  const prevWithdrawToBankResponse = usePrevious(withdrawToBankResponse);

  const submitWithdrawalData = () => {
    if (withdrawalData.payload.amount == "" || Number(withdrawalData.payload.amount) < 500) {
      //Look into Country difference
      toast.show({
        render: () => (
          <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
            <NativeBaseText style={{ color: "#FFFFFF" }}>Amount cannot be less than 500</NativeBaseText>
          </Box>
        ),
      });
    } else {
      setDisplaySpinner(true);
      dispatch(userBankWithdraw(withdrawalData.payload.amount));
    }
  };

  useEffect(() => {
    /**NAVIGATIOON */
    navigation.addListener("didFocus", () => {
      dispatch(getBank());
    });
  }, [navigation]);

  useEffect(() => {
    setAccountBalance(userTransactions[userTransactions.length - 1]["data"].wallet_info.current_balance);
  }, [userTransactions]);

  useEffect(() => {
    if (prevUserBank) {
      setUserBankInfo(userBank);
      if (userBankInfo.status == "success") {
        //console.log(userBankInfo);
        setUserBankError(false);
      }
    } else {
      dispatch(getBank());
    }

    if (prevWithdrawToBankResponse) {
      if (prevWithdrawToBankResponse.length !== withdrawToBankResponse.length) {
        if (withdrawToBankResponse[withdrawToBankResponse.length - 1]["status"] == "success") {
          setDisplaySpinner(false);
          setModalOpen(true);
        } else {
          setDisplaySpinner(false);
          toast.show({
            render: () => (
              <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
                <NativeBaseText style={{ color: "#FFFFFF" }}>{`${withdrawToBankResponse[withdrawToBankResponse.length - 1]["message"]}`}</NativeBaseText>
              </Box>
            ),
          });
        }
      }
    }
  });

  return (
    <KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={10} enableOnAndroid={true} extraHeight={Platform.select({ android: 150 })} style={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {/** Successful Transaction Modal */}
        <Modal transparent visible={modalOpen} animationType="slide">
          <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)", height: 1000 }}>
            <View style={{ ...styles.modalContent, borderColor: "#266ddc", borderWidth: 2 }}>
              {/** Modal Header */}
              <View style={{ marginTop: 16, flexDirection: "row", justifyContent: "flex-end" }}>
                <MaterialIcons color="grey" name="close" size={24} onPress={() => setModalOpen(false)} style={{ paddingRight: 10 }} />
              </View>
              {/** End Modal Header */}

              <View style={{ marginTop: 50, justifyContent: "center", alignItems: "center" }}>
                <SuccessfulSvgComponent />
              </View>

              <AppText bold="true" styles={{ fontSize: 18, marginTop: 16, textAlign: "center" }}>
                Transaction Successful
              </AppText>
              <AppText styles={{ fontSize: 15, marginTop: 16, textAlign: "center" }}>
                Your withdrawal of {currency} {withdrawalData.payload.amount} to your Bank account was Successful
              </AppText>

              <View style={{ marginTop: 24, alignItems: "center" }}>
                <PrimaryButton
                  onPress={() => {
                    setWithdrawalData({
                      payload: {
                        transactionCharge: "0.00",
                        amount: "",
                      },
                    });
                    setModalOpen(false);
                  }}
                >
                  <AppText bold="true" styles={{ color: "#fff", fontSize: 16 }}>
                    Done
                  </AppText>
                </PrimaryButton>
              </View>
            </View>
          </View>
        </Modal>
        {/** End Modal */}
        <View style={styles.upperBackGround}></View>

        <View style={styles.balanceUpBackGround}>
          <AppText bold="true" styles={{ fontSize: 18, textTransform: "uppercase", color: "#FFFFFF" }}>
            Withdraw to Bank
          </AppText>

          <View style={styles.recordForm}>
            <View style={{ marginTop: 8, paddingLeft: 4, paddingRight: 4 }}>
              <AppText bold="true" styles={{ display: `${userBankInfo.status == "success" ? "none" : `${userBankInfo.status == "unknown" ? "none" : "flex"}`}` }}>
                <Text style={{ color: "red" }}>
                  You do not have a National bank account linked to your vetropay digital wallet.{" "}
                  <Text style={{ color: "#266ddc", textTransform: "uppercase" }} onPress={() => navigation.navigate("LinkBank")}>
                    Click here
                  </Text>{" "}
                  to update your bank details.
                </Text>
              </AppText>

              {userBankInfo.status == "success" ? (
                <ImageBackground source={BankBackgroundImage} style={{ flex: 1, height: 126, opacity: 0.75, borderBottomLeftRadius: 8, borderRadius: 8 }}>
                  <View style={{ flex: 1, backgroundColor: "rgba(36, 109, 220, 0.5)" }}>
                    <View style={{ marginVertical: 10, marginHorizontal: 10, flexDirection: "row" }}>
                      <BankWalletSvgComponent />
                      <View style={{ marginLeft: 40 }}>
                        {/**Bank name */}
                        <AppText styles={{ fontSize: 16, color: "rgba(255, 255, 255, 0.9)" }}>Bank Name</AppText>
                        <AppText bold="true" styles={{ fontSize: 16, color: "#FFFFFF" }}>
                          {userBankInfo["data"].bank_name}
                        </AppText>

                        {/** Bank Accoun Number */}

                        <AppText styles={{ marginTop: 10, fontSize: 16, color: "rgba(255, 255, 255, 0.9)" }}>Account Number</AppText>
                        <AppText bold="true" styles={{ fontSize: 16, color: "#FFFFFF" }}>
                          {userBankInfo["data"].bank_account_number}
                        </AppText>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              ) : (
                <Text></Text> //"Empty"
              )}

              <View style={styles.formGroup}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>Amount ({currency})</Text>
                </AppText>
                <TextInput
                  style={{ ...styles.textInput, borderColor: "#266ddc" }}
                  placeholder="Enter Amount"
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    setWithdrawalData((prevState) => ({
                      ...prevState,
                      payload: {
                        ...prevState.payload,
                        amount: text,
                      },
                    }))
                  }
                  value={withdrawalData.payload.amount}
                />
              </View>

              <View style={styles.formGroup}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>Transaction Charge</Text>
                </AppText>
                <TextInput
                  style={{ ...styles.textInput, borderColor: "#266ddc", backgroundColor: "#F0F0F8" }}
                  defaultValue={`${currency} ${accountBalance > 0 ? "50" : withdrawalData.payload.transactionCharge}`}
                  editable={false}
                />
              </View>

              <View style={{ ...styles.formGroup, alignItems: "center", display: `${!displaySpinner ? "flex" : "none"}` }}>
                <PrimaryButton disabled={userBankError} onPress={() => submitWithdrawalData()}>
                  <AppText bold="true" styles={{ color: "#fff", fontSize: 16 }}>
                    Withdraw
                  </AppText>
                </PrimaryButton>
              </View>

              <View style={{ justifyContent: "center", display: `${displaySpinner ? "flex" : "none"}` }}>
                <Spinner color="blue.700" size="lg" />
              </View>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

Withdraw.propType = {
  getBank: PropTypes.func,
  userBankWithdraw: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 1000,
    marginTop: 8,
    backgroundColor: "#F0F0F8",
  },

  headerText: {
    fontSize: 20,
    color: "#266ddc",
  },
  upperBackGround: {
    width: Dimensions.get("window").width,
    height: 131,
    backgroundColor: "rgba(38, 109, 220, 0.6)",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  balanceUpBackGround: {
    position: "absolute",
    width: "100%",
    paddingHorizontal: 10,
  },
  recordForm: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderTopRightRadius: 4,
  },
  textInput: {
    height: 45,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderTopRightRadius: 4,

    borderColor: "#ddd",
  },
  formGroup: {
    marginBottom: 8,
    marginTop: 8,
  },

  modalContent: {
    flex: 1,
    marginTop: 80,
    borderRadius: 5,
    marginBottom: 100,
    marginLeft: 20,
    marginRight: 20,
    paddingHorizontal: 10,
    backgroundColor: "#F0F0F8",
  },
});
