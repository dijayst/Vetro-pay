import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { Dimensions, View, Text, StyleSheet, Picker, TextInput } from "react-native";
import AppText from "../../resource/AppText";
import { PrimaryButton } from "../../resource/AppButton";
import { Toast, Spinner } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { resolveBank, updateBank } from "../../containers/banks/action";

export default function LinkBank({ navigation }) {
  const userAuthentication = useSelector((state) => state.authentication.user);

  const [bankValid, setBankValid] = useState(false);
  const [displaySpinner, setDisplaySpinner] = useState(false);

  const nigeriaBanks = [
    { bankCode: "044", bankName: "Access Bank" },
    { bankCode: "063", bankName: "Access Bank Diamond" },
    { bankCode: "035A", bankName: "ALAT by WEMA" },
    { bankCode: "401", bankName: "ASO Savings and Loans" },
    { bankCode: "50823", bankName: "CEMCS Microfinance Bank" },
    { bankCode: "023", bankName: "Citibank Nigeria" },
    { bankCode: "050", bankName: "Ecobank Nigeria" },
    { bankCode: "562", bankName: "Ekondo MicroFinance Bank" },
    { bankCode: "070", bankName: "Fidelity Bank" },
    { bankCode: "011", bankName: "First Bank of Nigeria" },
    { bankCode: "214", bankName: "First City Monument Bank" },
    { bankCode: "00103", bankName: "Globus Bank" },
    { bankCode: "058", bankName: "Guaranty Trust Bank" },
    { bankCode: "50383", bankName: "Hasal Microfinance Bank" },
    { bankCode: "030", bankName: "Heritage Bank" },
    { bankCode: "301", bankName: "Jaiz Bank" },
    { bankCode: "082", bankName: "Keystone Bank" },
    { bankCode: "50211", bankName: "Kuda Bank" },
    { bankCode: "526", bankName: "Parallex Bank" },
    { bankCode: "076", bankName: "Polaris Bank" },
    { bankCode: "101", bankName: "Providus Bank" },
    { bankCode: "125", bankName: "Rubies MFB" },
    { bankCode: "51310", bankName: "Sparkle Microfinance Bank" },
    { bankCode: "221", bankName: "Stanbic IBTC Bank" },
    { bankCode: "232", bankName: "Sterling Bank" },
    { bankCode: "100", bankName: "Suntrust Bank" },
    { bankCode: "302", bankName: "TAJ Bank" },
    { bankCode: "51211", bankName: "TCF MFB" },
    { bankCode: "102", bankName: "Titan Bank" },
    { bankCode: "032", bankName: "Union Bank of Nigeria" },
    { bankCode: "033", bankName: "United Bank For Africa" },
    { bankCode: "215", bankName: "Unity Bank" },
    { bankCode: "566", bankName: "VFD" },
    { bankCode: "035", bankName: "Wema Bank" },
    { bankCode: "057", bankName: "Zenith Bank" },
  ];

  const kenyaBanks = [{ bankCode: "000", bankName: "#Error" }];

  const [linkBankData, setLinkBankData] = useState({
    payload: {
      bankName: "",
      accountNo: "",
      customerName: "",
    },
  });

  const dispatch = useDispatch();

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
        Toast.show({
          text: "Select Bank name",
          duration: 3000,
          type: "danger",
        });
      } else if (linkBankData.payload.accountNo == "") {
        Toast.show({
          text: "Input Bank account number",
          duration: 3000,
          type: "danger",
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
          Toast.show({
            text: "Unable to resolve bank account details",
            duration: 5000,
            type: "danger",
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
          Toast.show({
            text: "Registered user details and Bank Account name does not match",
            duration: 5000,
            type: "danger",
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
                    style={{ height: 40 }}
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
                <Spinner color="blue" />
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
    height: 40,
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
