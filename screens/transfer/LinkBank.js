import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { Dimensions, View, Text, StyleSheet, TextInput, Platform } from "react-native";
import { Picker as RNPicker } from "@react-native-picker/picker";
import { Select } from "native-base";
import AppText from "../../resources/AppText";
import { PrimaryButton } from "../../resources/AppButton";
import { Spinner, useToast, Box, Text as NativeBaseText } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { resolveBank, updateBank } from "../../containers/banks/action";
import { toastColorObject } from "../../resources/rStyledComponent";
import { nigeriaBanks } from "../../resources/utils";

export default function LinkBank({ navigation }) {
  const Picker = Platform.OS == "android" ? RNPicker : Select;
  const userAuthentication = useSelector((state) => state.authentication.user);

  const [bankValid, setBankValid] = useState(false);
  const [displaySpinner, setDisplaySpinner] = useState(false);

  const kenyaBanks = [{ bankCode: "000", bankName: "#Error" }];

  const [linkBankData, setLinkBankData] = useState({
    payload: {
      bankName: "",
      accountNo: "",
      customerName: "",
    },
  });

  const dispatch = useDispatch();
  const toast = useToast();

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const resolveBankResponse = useSelector((state) => state.banks.resolvebank);
  const prevResolveBankResponse = usePrevious(resolveBankResponse);

  const updateBankResponse = useSelector((state) => state.banks.updatebank);
  const prevUpdateBankResponse = usePrevious(updateBankResponse);

  const submitData = () => {
    if (linkBankData.payload.bankName == "" || linkBankData.payload.accountNo == "") {
      if (linkBankData.payload.bankName == "") {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>Select Bank name</NativeBaseText>
            </Box>
          ),
        });
      } else if (linkBankData.payload.accountNo == "") {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>Input Bank account number</NativeBaseText>
            </Box>
          ),
        });
      }
    } else {
      dispatch(resolveBank(linkBankData.payload.bankName, linkBankData.payload.accountNo));
      setDisplaySpinner(true);
    }
  };

  const saveBankDetails = () => {
    dispatch(updateBank(linkBankData.payload.bankName, linkBankData.payload.accountNo, linkBankData.payload.customerName));
    setDisplaySpinner(true);
  };

  useEffect(() => {
    if (prevResolveBankResponse) {
      if (prevResolveBankResponse.length !== resolveBankResponse.length) {
        if (resolveBankResponse[resolveBankResponse.length - 1]["status"] == true) {
          setBankValid(true);
          setLinkBankData((prevState) => ({
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

    if (prevUpdateBankResponse) {
      if (prevUpdateBankResponse.length !== updateBankResponse.length) {
        if (updateBankResponse[updateBankResponse.length - 1]["status"] == "success") {
          setDisplaySpinner(false);
          navigation.navigate("Withdraw");
        } else {
          setDisplaySpinner(false);
          toast.show({
            render: () => (
              <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
                <NativeBaseText style={{ color: "#FFFFFF" }}>Registered user details and Bank Account name does not match</NativeBaseText>
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
        <View style={styles.upperBackGround}></View>

        <View style={styles.balanceUpBackGround}>
          <AppText bold="true" styles={{ fontSize: 18, textTransform: "uppercase", color: "#FFFFFF" }}>
            Withdrawal {">"} Link your Bank
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
                      setLinkBankData((prevState) => ({
                        ...prevState,
                        payload: {
                          ...prevState.payload,
                          bankName: itemValue,
                        },
                      }));
                    }}
                    selectedValue={linkBankData.payload.bankName}
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
                  style={{ ...styles.textInput, borderColor: "#266ddc" }}
                  placeholder="Enter NUBAN"
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setLinkBankData((prevState) => ({
                      ...prevState,
                      payload: {
                        ...prevState.payload,
                        accountNo: text,
                      },
                    }));
                  }}
                />
              </View>

              <View style={styles.formGroup}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>Customer Account Name</Text>
                </AppText>
                <TextInput style={{ ...styles.textInput, borderColor: "#266ddc", backgroundColor: "#F0F0F8" }} editable={false} value={linkBankData.payload.customerName} />
              </View>

              <View style={{ ...styles.formGroup, alignItems: "center", flexDirection: "row", justifyContent: "space-evenly", display: `${!displaySpinner ? "flex" : "none"}` }}>
                <PrimaryButton disabled={bankValid} onPress={() => submitData()}>
                  <AppText bold="true" styles={{ color: "#fff", fontSize: 16 }}>
                    Validate
                  </AppText>
                </PrimaryButton>
                <PrimaryButton disabled={!bankValid} onPress={() => saveBankDetails()}>
                  <AppText bold="true" styles={{ color: "#fff", fontSize: 16 }}>
                    Save
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

LinkBank.propType = {
  resolveBank: PropTypes.func,
  updateBank: PropTypes.func,
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
});
