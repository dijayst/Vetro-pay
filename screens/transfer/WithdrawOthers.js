import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { Dimensions, View, Text, StyleSheet, TextInput, Platform, Modal } from "react-native";
import { Picker as RNPicker } from "@react-native-picker/picker";
import { Select } from "native-base";
import AppText from "../../resources/AppText";
import { PrimaryButton } from "../../resources/AppButton";
import { Spinner, useToast, Box, Text as NativeBaseText } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { MaterialIcons } from "@expo/vector-icons";
import { resolveBank, userThirdPartyBankWithdraw } from "../../containers/banks/action";
import { toastColorObject } from "../../resources/rStyledComponent";
import { nigeriaBanks } from "../../resources/utils";
import { SuccessfulSvgComponent } from "../../resources/Svg";
const kenyaBanks = [{ bankCode: "000", bankName: "#Error" }];

export default function WithdrawOthers({ navigation }) {
  const dispatch = useDispatch();
  const toast = useToast();
  const Picker = Platform.OS == "android" ? RNPicker : Select;
  const userAuthentication = useSelector((state) => state.authentication.user);
  const userTransactions = useSelector((state) => state.transactions.usertransactions);
  const currency = userAuthentication.country == "NIGERIA" ? "NGN" : "KES";
  const [modalOpen, setModalOpen] = useState(false);
  const [accountBalance, setAccountBalance] = useState(0);
  const [bankValid, setBankValid] = useState(false);
  const [displaySpinner, setDisplaySpinner] = useState(false);

  const [thirdPartyBankTransferData, setThirdPartyBankTransferData] = useState({
    payload: {
      bankName: "",
      accountNo: "",
      customerName: "",
      amount: "",
      transactionPin: "",
    },
  });

  useEffect(() => {
    setAccountBalance(userTransactions[userTransactions.length - 1]["data"].wallet_info.current_balance);
  }, [userTransactions]);

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const resolveBankResponse = useSelector((state) => state.banks.resolvebank);
  const prevResolveBankResponse = usePrevious(resolveBankResponse);

  const withdrawToBankResponse = useSelector((state) => state.banks.bankwithdraw);
  const prevWithdrawToBankResponse = usePrevious(withdrawToBankResponse);

  const validateBankInputData = () => {
    if (thirdPartyBankTransferData.payload.bankName == "" || thirdPartyBankTransferData.payload.accountNo == "") {
      if (thirdPartyBankTransferData.payload.bankName == "") {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>Select Bank name</NativeBaseText>
            </Box>
          ),
        });
      } else if (thirdPartyBankTransferData.payload.accountNo == "") {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>Input Bank account number</NativeBaseText>
            </Box>
          ),
        });
      }
    } else {
      dispatch(resolveBank(thirdPartyBankTransferData.payload.bankName, thirdPartyBankTransferData.payload.accountNo));
      setDisplaySpinner(true);
    }
  };

  const initiateThirdPartyBankTransfer = () => {
    if (thirdPartyBankTransferData.payload.amount == "" || Number(thirdPartyBankTransferData.payload.amount) < 100) {
      toast.show({
        render: () => (
          <Box bg={toastColorObject["success"]} px="2" py="2" rounded="sm" mb={5}>
            <NativeBaseText style={{ color: "#FFFFFF" }}>
              Third party bank transfer cannot be less than ₦100. Would you mind telling your receiver about VetroPay? Transfer is free, NO LIMIT
            </NativeBaseText>
          </Box>
        ),
      });
    } else {
      dispatch(
        userThirdPartyBankWithdraw(
          thirdPartyBankTransferData.payload.amount,
          thirdPartyBankTransferData.payload.bankName,
          thirdPartyBankTransferData.payload.accountNo,
          thirdPartyBankTransferData.payload.customerName,
          thirdPartyBankTransferData.payload.transactionPin
        )
      );
      setDisplaySpinner(true);
    }
  };

  useEffect(() => {
    if (prevResolveBankResponse) {
      if (prevResolveBankResponse.length !== resolveBankResponse.length) {
        if (resolveBankResponse[resolveBankResponse.length - 1]["status"] == true) {
          setBankValid(true);
          setThirdPartyBankTransferData((prevState) => ({
            ...prevState,
            payload: {
              ...prevState.payload,
              customerName: resolveBankResponse[resolveBankResponse.length - 1]["data"]["account_name"],
            },
          }));
          setDisplaySpinner(false);
        } else {
          setDisplaySpinner(false);
          toast.show({
            render: () => (
              <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
                <NativeBaseText style={{ color: "#FFFFFF" }}>Unable to resolve bank account details</NativeBaseText>
              </Box>
            ),
          });
        }
      }
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
                {currency} {thirdPartyBankTransferData.payload.amount} sent to "{thirdPartyBankTransferData.payload.customerName}" was Successful
              </AppText>

              <View style={{ marginTop: 24, alignItems: "center" }}>
                <PrimaryButton
                  onPress={() => {
                    setModalOpen(false);
                    navigation.navigate("HomeHome");
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
            Withdrawal {">"} Others
          </AppText>

          <View style={styles.recordForm}>
            <View style={{ marginTop: 8, paddingLeft: 4, paddingRight: 4 }}>
              <View style={styles.formGroup}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>Bank Name</Text>
                </AppText>
                <View
                  style={{
                    marginTop: 10,
                    borderWidth: 1,
                    borderColor: "#266ddc",
                    borderTopLeftRadius: 4,
                    borderBottomLeftRadius: 4,
                    borderBottomRightRadius: 4,
                    borderTopRightRadius: 4,
                  }}
                >
                  <Picker
                    style={{ height: 45 }}
                    onValueChange={(itemValue, itemIndex) => {
                      setThirdPartyBankTransferData((prevState) => ({
                        ...prevState,
                        payload: {
                          ...prevState.payload,
                          bankName: itemValue,
                        },
                      }));
                    }}
                    selectedValue={thirdPartyBankTransferData.payload.bankName}
                  >
                    <Picker.Item label="--- Select Bank ---" value="" />

                    {userAuthentication.country == "NIGERIA"
                      ? nigeriaBanks.map((data, index) => {
                          return <Picker.Item key={index} label={data.bankName} value={data.bankCode} />;
                        })
                      : kenyaBanks.map((data, index) => {
                          return <Picker.Item key={index} label={data.bankName} value={data.bankCode} />;
                        })}
                  </Picker>
                </View>
              </View>
              <View style={styles.formGroup}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>Bank Account Number</Text>
                </AppText>
                <TextInput
                  style={{ ...styles.textInput, borderColor: "#266ddc", marginBottom: 4 }}
                  placeholder="Enter NUBAN"
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setBankValid(false);
                    setThirdPartyBankTransferData((prevState) => ({
                      ...prevState,
                      payload: {
                        ...prevState.payload,
                        accountNo: text,
                      },
                    }));
                  }}
                />
                {thirdPartyBankTransferData.payload.customerName != "" && (
                  <AppText styles={{ alignSelf: "flex-start", fontSize: 12 }}>{thirdPartyBankTransferData.payload.customerName}</AppText>
                )}
              </View>

              <View style={styles.formGroup}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>Amount</Text>
                </AppText>
                <TextInput
                  style={{ ...styles.textInput, borderColor: "#266ddc", backgroundColor: "#F0F0F8" }}
                  placeholder="Enter Amount"
                  keyboardType="numeric"
                  value={thirdPartyBankTransferData.payload.amount}
                  onChangeText={(text) => {
                    setThirdPartyBankTransferData((prevState) => ({
                      ...prevState,
                      payload: {
                        ...prevState.payload,
                        amount: text,
                      },
                    }));
                  }}
                />
                <AppText styles={{ alignSelf: "flex-start", fontSize: 12 }}>
                  <Text style={{ fontWeight: "700" }}>Transaction Charge: </Text>
                  {`${currency} ${accountBalance > 0 ? "50" : "0.00"}`}
                </AppText>
              </View>

              {bankValid && (
                <View style={{ ...styles.formGroup, marginTop: 15 }}>
                  <AppText>
                    <Text style={{ fontWeight: "700" }}>Authorization Pin</Text>
                  </AppText>
                  <TextInput
                    style={{ ...styles.textInput, borderColor: "#266ddc", backgroundColor: "#F0F0F8" }}
                    placeholder="Enter Transaction Pin"
                    keyboardType="numeric"
                    secureTextEntry={true}
                    value={thirdPartyBankTransferData.payload.transactionPin}
                    onChangeText={(text) => {
                      setThirdPartyBankTransferData((prevState) => ({
                        ...prevState,
                        payload: {
                          ...prevState.payload,
                          transactionPin: text,
                        },
                      }));
                    }}
                  />
                </View>
              )}

              <View
                style={{
                  ...styles.formGroup,
                  marginTop: 15,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  display: `${!displaySpinner ? "flex" : "none"}`,
                }}
              >
                <PrimaryButton disabled={bankValid} onPress={() => validateBankInputData()}>
                  <AppText bold="true" styles={{ color: "#fff", fontSize: 16 }}>
                    Validate
                  </AppText>
                </PrimaryButton>
                <PrimaryButton disabled={!bankValid} onPress={() => initiateThirdPartyBankTransfer()}>
                  <AppText bold="true" styles={{ color: "#fff", fontSize: 16 }}>
                    Transfer
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

WithdrawOthers.propType = {
  resolveBank: PropTypes.func,
  userThirdPartyBankWithdraw: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
    backgroundColor: "#F0F0F8",
    height: 1000,
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
