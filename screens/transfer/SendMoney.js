import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Dimensions, View, Text, StyleSheet, Picker, TextInput } from "react-native";
import { Modal, Switch } from "react-native";

import AppText from "../../resources/AppText";
import { PrimaryButton } from "../../resources/AppButton";
import { MaterialIcons } from "@expo/vector-icons";
import { SuccessfulSvgComponent } from "../../resources/Svg";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Toast, Spinner } from "native-base";

import { postSendMoneyPreVerify, postSendMoney } from "../../containers/transactions/action";
import { shortenNames } from "../../resources/MetaFunctions";

//import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default function SendMoney({ navigation }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [sendMoneyStage, setSendMoneyStage] = useState(1);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [sendMoneyValidatedData, setSendMoneyValidatedData] = useState({});

  const [outBoundTransfer, setOutBoundTransfer] = useState(false);
  const [sendMoneySuccessData, setSendMoneySuccessData] = useState({});
  const [displayTransactionPinError, setDisplayTransactionPinError] = useState(false);
  const [displayTransactionPinError2, setDisplayTransactionPinError2] = useState(false);
  const [displaySpinner, setDisplaySpinner] = useState(false);

  const userAuthentication = useSelector((state) => state.authentication.user);
  const [sendMoneyData, setSendMoneyData] = useState({
    payload: {
      country: userAuthentication["country"],
      currency: `${userAuthentication.country == "NIGERIA" ? "NGN" : "KES"}`,
      transactionCharge: "0.00",
      phoneNumberUID: "",
      amount: "",
      international: false,
      paymentCategory: "",
      note: "",
      transactionPin: "",
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

  const sendMoneyPreVerify = useSelector((state) => state.transactions.sendmoneypreverify);
  const prevSendMoneyPreVerify = usePrevious(sendMoneyPreVerify);

  const sendMoneyResponse = useSelector((state) => state.transactions.sendmoney);
  const prevSendMoneyResponse = usePrevious(sendMoneyResponse);

  useEffect(() => {
    if (prevSendMoneyPreVerify) {
      if (prevSendMoneyPreVerify.length !== sendMoneyPreVerify.length) {
        if (sendMoneyPreVerify[sendMoneyPreVerify.length - 1]["status"] == "failed") {
          setDisplaySpinner(false);
          Toast.show({
            text: `${sendMoneyPreVerify[sendMoneyPreVerify.length - 1].message}`,
            duration: 5000,
            type: "danger",
          });
        } else if (sendMoneyPreVerify[sendMoneyPreVerify.length - 1]["status"] == "success") {
          setDisplaySpinner(false);
          setSendMoneyValidatedData(sendMoneyPreVerify[sendMoneyPreVerify.length - 1]["data"]);
          setModalOpen(true);
        } else if (sendMoneyPreVerify[sendMoneyPreVerify.length - 1]["status"] == "warning") {
          setDisplaySpinner(false);
          setOutBoundTransfer(true);
          setSendMoneyValidatedData(sendMoneyPreVerify[sendMoneyPreVerify.length - 1]["data"]);
          setModalOpen(true);
        }
      }
    }

    if (prevSendMoneyResponse) {
      if (prevSendMoneyResponse.length !== sendMoneyResponse.length) {
        if (sendMoneyResponse[sendMoneyResponse.length - 1]["status"] == "failed") {
          setDisplayTransactionPinError2(true);
          setDisplaySpinner(false);
        } else if (sendMoneyResponse[sendMoneyResponse.length - 1]["status"] == "success") {
          setSendMoneySuccessData(sendMoneyResponse[sendMoneyResponse.length - 1]["data"]);
          setDisplaySpinner(false);
          setSendMoneyStage(2);
        }
      }
    }
  });

  const changeRecipientCountry = (itemValue, itemIndex) => {
    setSendMoneyData((prevState) => ({
      ...prevState,
      payload: {
        ...prevState.payload,
        country: itemValue,
      },
    }));
    if (userAuthentication.country == "NIGERIA") {
      if (itemValue == "KENYA") {
        setSendMoneyData((prevState) => ({
          ...prevState,
          payload: {
            ...prevState.payload,
            transactionCharge: "500.00",
            international: true,
          },
        }));
      } else {
        setSendMoneyData((prevState) => ({
          ...prevState,
          payload: {
            ...prevState.payload,
            transactionCharge: "0.00",
            international: false,
          },
        }));
      }
    } else if (userAuthentication.country == "KENYA") {
      if (itemValue == "KENYA") {
        setSendMoneyData((prevState) => ({
          ...prevState,
          payload: {
            ...prevState.payload,
            transactionCharge: "150.00",
            international: true,
          },
        }));
      } else {
        setSendMoneyData((prevState) => ({
          ...prevState,
          payload: {
            ...prevState.payload,
            transactionCharge: "0.00",
            international: false,
          },
        }));
      }
    }
  };

  const onValueChange = (fieldName, value) => {
    if (fieldName == "phoneNumberUID") {
      setSendMoneyData((prevState) => ({
        ...prevState,
        payload: {
          ...prevState.payload,
          phoneNumberUID: value,
        },
      }));
    } else if (fieldName == "amount") {
      setSendMoneyData((prevState) => ({
        ...prevState,
        payload: {
          ...prevState.payload,
          amount: value,
        },
      }));
    } else if (fieldName == "note") {
      setSendMoneyData((prevState) => ({
        ...prevState,
        payload: {
          ...prevState.payload,
          note: value,
        },
      }));
    } else if (fieldName == "transactionPin") {
      setDisplayTransactionPinError(false);
      setDisplayTransactionPinError2(false);

      setSendMoneyData((prevState) => ({
        ...prevState,
        payload: {
          ...prevState.payload,
          transactionPin: value,
        },
      }));
    }
  };

  const submitTransferData = () => {
    if (
      sendMoneyData.payload.phoneNumberUID == "" ||
      sendMoneyData.payload.phoneNumberUID.replace(/\s\s+/g, " ") == " " ||
      Number(sendMoneyData.payload.amount) == NaN ||
      Number(sendMoneyData.payload.amount) <= 0
    ) {
      if (sendMoneyData.payload.phoneNumberUID == "" || sendMoneyData.payload.phoneNumberUID.replace(/\s\s+/g, " ") == " ") {
        Toast.show({
          text: "Invalid recipient details",
          duration: 3000,
          type: "danger",
        });
      } else if (Number(sendMoneyData.payload.amount) == NaN || Number(sendMoneyData.payload.amount) <= 0) {
        Toast.show({
          text: "Invalid amount",
          duration: 3000,
          type: "danger",
        });
      }
    } else {
      setDisplaySpinner(true);
      dispatch(
        postSendMoneyPreVerify(
          sendMoneyData.payload.international,
          sendMoneyData.payload.country,
          sendMoneyData.payload.phoneNumberUID,
          sendMoneyData.payload.amount,
          sendMoneyData.payload.paymentCategory,
          sendMoneyData.payload.note,
          sendMoneyData.payload.transactionPin
        )
      );
    }
  };

  const submitTransferDataPin = () => {
    if (sendMoneyData.payload.transactionPin == "" || sendMoneyData.payload.transactionPin.replace(/\s\s+/g, " ") == " ") {
      setDisplayTransactionPinError(true);
    } else {
      setDisplaySpinner(true);
      dispatch(
        postSendMoney(
          sendMoneyData.payload.international,
          sendMoneyData.payload.country,
          sendMoneyData.payload.phoneNumberUID,
          sendMoneyData.payload.amount,
          sendMoneyData.payload.paymentCategory,
          sendMoneyData.payload.note,
          sendMoneyData.payload.transactionPin
        )
      );
      //setSendMoneyStage(2)
    }
  };

  const renderModal = () => {
    switch (sendMoneyStage) {
      case 1:
        return (
          <View style={{ ...styles.modalContent, borderColor: "#266ddc", borderWidth: 2 }}>
            {/** Modal Header */}
            <View style={{ marginTop: 16, flexDirection: "row", justifyContent: "space-between" }}>
              <AppText bold="true" styles={{ fontSize: 18 }}>
                Recipient Information
              </AppText>
              <MaterialIcons
                color="grey"
                name="close"
                size={24}
                onPress={() => {
                  setModalOpen(false);
                  setOutBoundTransfer(false);
                }}
                style={{ paddingRight: 10 }}
              />
            </View>
            {/** End Modal Header */}

            <View style={{ marginTop: 24, paddingRight: 20 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <AppText styles={{ fontSize: 15 }}>
                  <Text style={{ fontWeight: "700" }}>Recipient Name </Text>
                </AppText>
                <AppText bold="true" styles={{ fontSize: 15 }}>
                  {shortenNames(sendMoneyValidatedData.name, 21)}
                </AppText>
              </View>
            </View>

            <View style={{ marginTop: 12, paddingRight: 20 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <AppText styles={{ fontSize: 15 }}>
                  <Text style={{ fontWeight: "700" }}>Amount: </Text>
                </AppText>
                <AppText bold="true" styles={{ fontSize: 15 }}>
                  {`${sendMoneyData.payload.currency} ${sendMoneyValidatedData.amount}`}
                </AppText>
              </View>
            </View>

            <View style={{ marginTop: 12, paddingRight: 20 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <AppText styles={{ fontSize: 15 }}>
                  <Text style={{ fontWeight: "700" }}>Transaction Charge: </Text>
                </AppText>
                <AppText bold="true" styles={{ fontSize: 15 }}>
                  {`${sendMoneyData.payload.currency} ${sendMoneyValidatedData.transactionCharge}`}
                </AppText>
              </View>
            </View>

            <View style={{ marginTop: 12, display: `${outBoundTransfer ? "flex" : "none"}` }}>
              <AppText bold="true" styles={{ color: "#ffaf40", fontSize: 15 }}>
                Notice:
              </AppText>
              <AppText styles={{ textAlign: "left" }}>
                (a). Mobile Number <Text style={{ fontWeight: "700" }}>{sendMoneyValidatedData.name}</Text> is not registered yet on VetroPay.
              </AppText>
              <AppText>(b). You may proceed with this transaction.</AppText>
              <AppText>(c). credit Notice and directives on claiming fund will be sent to User via SMS. Fund will be reversed within 5days, if fund remains unclaimed.</AppText>
            </View>

            <View style={{ marginTop: 24 }}>
              <AppText bold="true" styles={{ fontSize: 18 }}>
                Transaction Pin
              </AppText>
              <AppText styles={{ fontSize: 14, color: "red", textAlign: "center", display: `${displayTransactionPinError ? "flex" : "none"}` }}>Input transaction pin!</AppText>
              <AppText styles={{ fontSize: 14, color: "red", textAlign: "center", display: `${displayTransactionPinError2 ? "flex" : "none"}` }}>
                Invalid transaction pin. Your account may be suspended after 3 more invalid entry
              </AppText>
              <TextInput
                style={{ ...styles.textInput, borderColor: "#266ddc" }}
                placeholder="Enter Transaction Pin"
                textContentType="password"
                secureTextEntry
                onChangeText={(text) => onValueChange("transactionPin", text)}
              />
            </View>

            <View style={{ marginTop: 16, alignItems: "flex-end", display: `${!displaySpinner ? "flex" : "none"}` }}>
              <PrimaryButton onPress={() => submitTransferDataPin()}>
                <AppText bold="true" styles={{ color: "#fff", fontSize: 16 }}>
                  Complete
                </AppText>
              </PrimaryButton>
            </View>

            <View style={{ justifyContent: "center", display: `${displaySpinner ? "flex" : "none"}` }}>
              <Spinner color="blue" />
            </View>
          </View>
        );
      case 2:
        return (
          <View style={{ ...styles.modalContent, borderColor: "#266ddc", borderWidth: 2 }}>
            {/** Modal Header */}
            <View style={{ marginTop: 16, flexDirection: "row", justifyContent: "flex-end" }}>
              <MaterialIcons
                color="grey"
                name="close"
                size={24}
                onPress={() => {
                  setSendMoneyData({
                    payload: {
                      country: userAuthentication["country"],
                      currency: `${userAuthentication.country == "NIGERIA" ? "NGN" : "KES"}`,
                      transactionCharge: "0.00",
                      phoneNumberUID: "",
                      amount: "",
                      international: false,
                      paymentCategory: "",
                      note: "",
                      transactionPin: "",
                    },
                  });
                  setShowOptionalFields(false);
                  setModalOpen(false);
                  setOutBoundTransfer(false);
                  setSendMoneyStage(1);
                }}
                style={{ paddingRight: 10 }}
              />
            </View>
            {/** End Modal Header */}

            <View style={{ marginTop: 50, justifyContent: "center", alignItems: "center" }}>
              <SuccessfulSvgComponent />
            </View>

            <AppText bold="true" styles={{ fontSize: 18, marginTop: 16, textAlign: "center" }}>
              Transaction Successful
            </AppText>
            <AppText styles={{ fontSize: 15, marginTop: 16, textAlign: "center" }}>
              Your fund transfer of {sendMoneyData.payload.currency} {sendMoneySuccessData.amount} to {sendMoneySuccessData.recipient} was Successful
            </AppText>

            <View style={{ marginTop: 24, alignItems: "center" }}>
              <PrimaryButton
                onPress={() => {
                  setSendMoneyData({
                    payload: {
                      country: userAuthentication["country"],
                      currency: `${userAuthentication.country == "NIGERIA" ? "NGN" : "KES"}`,
                      transactionCharge: "0.00",
                      phoneNumberUID: "",
                      amount: "",
                      international: false,
                      paymentCategory: "",
                      note: "",
                      transactionPin: "",
                    },
                  });
                  setShowOptionalFields(false);
                  setModalOpen(false);
                  setSendMoneyStage(1);
                }}
              >
                <AppText bold="true" styles={{ color: "#fff", fontSize: 16 }}>
                  Close
                </AppText>
              </PrimaryButton>

              <View style={{ marginTop: 16, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <MaterialIcons name="home" size={18} color="#266ddc" />
                <AppText bold="true" styles={{ fontSize: 18, color: "#266ddc" }}>
                  {" "}
                  Go home
                </AppText>
              </View>
            </View>
          </View>
        );
    }
  };

  return (
    <KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={10} enableOnAndroid={true} extraHeight={Platform.select({ android: 150 })} style={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {/** Recipient Information Modal */}
        <Modal transparent visible={modalOpen} animationType="slide">
          <KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={10} enableOnAndroid={true} extraHeight={Platform.select({ android: 150 })} style={{ flexGrow: 1 }}>
            <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)", height: 1000 }}>{renderModal()}</View>
          </KeyboardAwareScrollView>
        </Modal>

        {/** End Recipient Information Modal */}
        <View style={styles.upperBackGround}></View>

        <View style={styles.balanceUpBackGround}>
          <AppText bold="true" styles={{ fontSize: 18, textTransform: "uppercase", color: "#FFFFFF" }}>
            Send Money
          </AppText>

          <View style={styles.recordForm}>
            <View style={{ marginTop: 8, paddingLeft: 4, paddingRight: 4 }}>
              <View style={styles.formGroup}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>Recipient Country</Text>
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
                    onValueChange={(itemValue, itemIndex) => changeRecipientCountry(itemValue, itemIndex)}
                    selectedValue={sendMoneyData.payload.country}
                  >
                    <Picker.Item label="🇳🇬  Nigeria" value="NIGERIA" />
                    <Picker.Item label="🇰🇪  Kenya" value="KENYA" />
                  </Picker>
                </View>
              </View>

              <View style={styles.formGroup}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>Recipient Phone Number/Vetropay UID</Text>
                </AppText>
                <TextInput
                  style={{ ...styles.textInput, borderColor: "#266ddc" }}
                  placeholder="Enter Phone Number or Vetropay UID"
                  keyboardType="numeric"
                  onChangeText={(text) => onValueChange("phoneNumberUID", text)}
                  value={sendMoneyData.payload.phoneNumberUID}
                />
              </View>

              <View style={styles.formGroup}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>Amount ({sendMoneyData.payload.currency})</Text>
                </AppText>
                <TextInput
                  style={{ ...styles.textInput, borderColor: "#266ddc" }}
                  placeholder="Enter Amount"
                  keyboardType="numeric"
                  onChangeText={(text) => onValueChange("amount", text)}
                  value={sendMoneyData.payload.amount}
                />
              </View>

              <View style={styles.formGroup}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>Transaction Charge</Text>
                </AppText>
                <TextInput
                  style={{ ...styles.textInput, borderColor: "#266ddc", backgroundColor: "#F0F0F8" }}
                  defaultValue={`${sendMoneyData.payload.currency} ${sendMoneyData.payload.transactionCharge}`}
                  editable={false}
                />
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                <AppText bold="true" styles={{ fontSize: 15 }}>
                  Optional Fields
                </AppText>
                <Switch
                  trackColor={{ true: "#ADD8E6" }}
                  thumbColor={showOptionalFields ? "#266ddc" : "#faf3f4"}
                  onValueChange={(value) => setShowOptionalFields(value)}
                  value={showOptionalFields}
                />
              </View>

              {/** Optional Fields */}
              <View style={{ display: `${showOptionalFields ? "flex" : "none"}` }}>
                <View style={styles.formGroup}>
                  <AppText>
                    <Text style={{ fontWeight: "700" }}>Payment Category</Text>
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
                        setSendMoneyData((prevState) => ({
                          ...prevState,
                          payload: {
                            ...prevState.payload,
                            paymentCategory: itemValue,
                          },
                        }));
                      }}
                      selectedValue={sendMoneyData.payload.paymentCategory}
                    >
                      <Picker.Item label="--- Select Category ---" value="" />
                      <Picker.Item label="Gift/Shopping" value="GIFT/SHOPPING" />
                      <Picker.Item label="School/Education" value="SCHOOL/EDUCATION" />
                      <Picker.Item label="Airtime/Internet/Cable Bill" value="AIRTIME/INTERNET/CABLE" />
                      <Picker.Item label="Electricity/Water/Gas/Fuel" value="ELECTRICITY/WATER/GAS/FUEL" />
                      <Picker.Item label="Vehicle/Transport/Food" value="VEHICLE/TRANSPORT/FOOD" />
                      <Picker.Item label="Business/Official" value="BUSINESS/OFFICIAL" />
                      <Picker.Item label="Donations/Tithes/Offerings" value="DONATIONS/TITHES/OFFERINGS" />
                      <Picker.Item label="Personal/Others" value="PERSONAL/OTHERS" />
                    </Picker>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <AppText>
                    <Text style={{ fontWeight: "700" }}>Note/Description</Text>
                  </AppText>
                  <TextInput
                    style={{ ...styles.textInput, borderColor: "#266ddc" }}
                    placeholder=" Enter your reference or description"
                    onChangeText={(text) => onValueChange("note", text)}
                  />
                </View>
              </View>
              {/** End Optional Fields */}

              <View style={{ ...styles.formGroup, alignItems: "center", display: `${!displaySpinner ? "flex" : "none"}` }}>
                <PrimaryButton onPress={() => submitTransferData()}>
                  <AppText bold="true" styles={{ color: "#fff", fontSize: 16 }}>
                    Send
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

SendMoney.propType = {
  postSendMoneyPreVerify: PropTypes.func,
  postSendMoney: PropTypes.func,
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
