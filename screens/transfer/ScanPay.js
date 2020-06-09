import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Text, View, StyleSheet, Button, Modal, Picker, TextInput, Switch } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import AppText from "../../resource/AppText";
import { MaterialIcons } from "@expo/vector-icons";
import { SuccessfulSvgComponent } from "../../resource/Svg";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { PrimaryButton } from "../../resource/AppButton";
import { Spinner } from "native-base";

import { postSendMoneyPreVerify, postSendMoney } from "../../containers/transactions/action";

export default function App() {
  const userAuthentication = useSelector((state) => state.authentication.user);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sendMoneyStage, setSendMoneyStage] = useState(1);
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
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [displaySpinner, setDisplaySpinner] = useState(false);
  const [sendMoneyValidatedData, setSendMoneyValidatedData] = useState({});
  const [sendMoneySuccessData, setSendMoneySuccessData] = useState({});
  const [displayModalFormError, setDisplayModalFormError] = useState("");
  const [displayTransactionPinError, setDisplayTransactionPinError] = useState(false);
  const [displayTransactionPinError2, setDisplayTransactionPinError2] = useState(false);

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
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    if (prevSendMoneyPreVerify) {
      if (prevSendMoneyPreVerify.length !== sendMoneyPreVerify.length) {
        if (sendMoneyPreVerify[sendMoneyPreVerify.length - 1]["status"] == "failed") {
          setDisplaySpinner(false);
          setDisplayModalFormError(sendMoneyPreVerify[sendMoneyPreVerify.length - 1].message);
        } else if (sendMoneyPreVerify[sendMoneyPreVerify.length - 1]["status"] == "success") {
          setDisplaySpinner(false);
          setSendMoneyValidatedData(sendMoneyPreVerify[sendMoneyPreVerify.length - 1]["data"]);
          setSendMoneyStage(2);
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
          setSendMoneyStage(3);
        }
      }
    }
  });

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    if (data[0] !== "+") {
      alert("Data obtained not reconcilable with VetroPay");
    } else {
      setSendMoneyData((prevState) => ({
        ...prevState,
        payload: {
          ...prevState.payload,
          phoneNumberUID: data,
        },
      }));
      setModalOpen(true);
    }
  };

  if (hasPermission === null) {
    return <AppText>Requesting for camera permission</AppText>;
  }
  if (hasPermission === false) {
    return <AppText>No access to camera</AppText>;
  }
  const onValueChange = (fieldName, value) => {
    if (fieldName == "amount") {
      setSendMoneyData((prevState) => ({
        ...prevState,
        payload: {
          ...prevState.payload,
          amount: value,
        },
      }));
      setDisplayModalFormError("");
    } else if (fieldName == "note") {
      setSendMoneyData((prevState) => ({
        ...prevState,
        payload: {
          ...prevState.payload,
          note: value,
        },
      }));
      setDisplayModalFormError("");
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
      setDisplayModalFormError("");
    }
  };

  const submitTransferData = () => {
    if (Number(sendMoneyData.payload.amount) == NaN || Number(sendMoneyData.payload.amount) <= 0) {
      if (Number(sendMoneyData.payload.amount) == NaN || Number(sendMoneyData.payload.amount) <= 0) {
        setDisplayModalFormError("Invalid amount");
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
                Transaction Information
              </AppText>
              <MaterialIcons color="grey" name="close" size={24} onPress={() => setModalOpen(false)} style={{ paddingRight: 10 }} />
            </View>
            {/** End Modal Header */}

            {displayModalFormError !== "" ? (
              <AppText bold="true" styles={{ color: "red", textAlign: "center" }}>
                {displayModalFormError}
              </AppText>
            ) : (
              <AppText></AppText>
            )}

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
        );

      case 2:
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
                  {sendMoneyValidatedData.name}
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

            <View style={{ ...styles.formGroup, alignItems: "center", display: `${!displaySpinner ? "flex" : "none"}` }}>
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
      case 3:
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
                {/**<MaterialIcons name="home" size={18} color="#266ddc" />
                <AppText bold="true" styles={{ fontSize: 18, color: "#266ddc" }}>
                  Go home 
                </AppText>
                */}
              </View>
            </View>
          </View>
        );
    }
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {/** Transaction Information Modal */}
      <Modal transparent visible={modalOpen} animationType="slide">
        <KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={10} enableOnAndroid={true} extraHeight={Platform.select({ android: 150 })} style={{ flexGrow: 1 }}>
          <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)" }}>{renderModal()}</View>
        </KeyboardAwareScrollView>
      </Modal>

      {/** End Transaction Information Modal */}
      <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={StyleSheet.absoluteFillObject} />

      {scanned && <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
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
