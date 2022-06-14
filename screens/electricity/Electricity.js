import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, Picker, Button, TextInput } from "react-native";
import AppText from "../../resources/AppText";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Spinner } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { PrimaryButton } from "../../resources/AppButton";
import { validateElectricityData, buyUtility } from "../../containers/utility/action";
import { SuccessfulSvgComponent } from "../../resources/Svg";

const Ekologo = require("../../assets/logos/eko.jpg");
const IBEDClogo = require("../../assets/logos/ibedc.png");
const IKEDClogo = require("../../assets/logos/ikeja.jpeg");
const KANOlogo = require("../../assets/logos/kano.jpeg");
const ABUJAlogo = require("../../assets/logos/aedc.png");
const JOSlogo = require("../../assets/logos/jos.jpg");
const KADUNAlogo = require("../../assets/logos/kadunaelectric.png");
const ENUGUlogo = require("../../assets/logos/eedc.png");
const PORTHlogo = require("../../assets/logos/porth.png");

const discosPlatformName = {
  EKEDC: "EKO Electric",
  IBEDC: "IBADAN Electric",
  IKEDC: "IKEJA Electric",
  KANO: "KANO Electric",
  ABUJA: "ABUJA Electric",
  JOS: "JOS Electric",
  KADUNA: "KADUNA Electric",
  ENUGU: "ENUGU Electric",
  PORTH: "PORTHARCOURT Electric",
};

export default function Electricity() {
  const [modalOpen, setModalOpen] = useState(false);
  const [provider, setProvider] = useState("");
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [electricityPurchaseStage, setElectricityPurchaseStage] = useState(1);
  const [amountError, setAmountError] = useState(false);
  const [displaySpinner, setDisplaySpinner] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerOutstandingBalance, setCustomerOutstandingBalance] = useState("");
  const [transactionPin, setTransactionPin] = useState("");
  const [displayTransactionPinError, setDisplayTransactionPinError] = useState(false);
  const [transactionGenericError, setTransactionGenericError] = useState("");

  const userAuthentication = useSelector((state) => state.authentication.user);
  const userCurrency = userAuthentication.country == "NIGERIA" ? "NGN" : "KES";

  const dispatch = useDispatch();

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const electricityVerifyData = useSelector((state) => state.utility.electricityvalidate);
  const prevElectricityVerifyData = usePrevious(electricityVerifyData);

  const utilityPurchaseData = useSelector((state) => state.utility.buyutility);
  const prevUtilityPurchaseData = usePrevious(utilityPurchaseData);

  useEffect(() => {
    if (prevElectricityVerifyData) {
      if (prevElectricityVerifyData.length !== electricityVerifyData.length) {
        if (electricityVerifyData[electricityVerifyData.length - 1]["status"] == "success") {
          setCustomerName(electricityVerifyData[electricityVerifyData.length - 1]["data"]["name"]);
          setCustomerAddress(electricityVerifyData[electricityVerifyData.length - 1]["data"]["address"]);
          setCustomerOutstandingBalance(electricityVerifyData[electricityVerifyData.length - 1]["data"]["outstandingBalance"]);
          setDisplaySpinner(false);
          setElectricityPurchaseStage(3);
        } else {
          setServerMessage("Error resolving Customer account number");
          setDisplaySpinner(false);
        }
      }
    }

    if (prevUtilityPurchaseData) {
      if (prevUtilityPurchaseData.length !== utilityPurchaseData.length) {
        if (utilityPurchaseData[utilityPurchaseData.length - 1]["status"] == "success") {
          setDisplaySpinner(false);
          setElectricityPurchaseStage(4);
        } else {
          setDisplaySpinner(false);
          setTransactionGenericError(utilityPurchaseData[utilityPurchaseData.length - 1]["message"]);
        }
      }
    }
  });

  const openTransactionModal = (powerProvider) => {
    setProvider(powerProvider);
    setModalOpen(true);
  };

  const closeTransactionModal = () => {
    setModalOpen(false);
    setProvider("");
    setProduct("");
    setAmount("");
    setAccountNumber("");
    setServerMessage("");
    setElectricityPurchaseStage(1);
    setAmountError(false);
    setDisplaySpinner(false);
    setCustomerName("");
    setCustomerAddress("");
    setCustomerOutstandingBalance("");
    setDisplayTransactionPinError(false);
    setTransactionGenericError("");
  };

  const validateElectricityDetails = () => {
    if (accountNumber == "" || amount == "" || parseInt(amount) < 900) {
      if (amount == "" || parseInt(amount) < 900) {
        setAmountError(true);
      }
    } else {
      dispatch(validateElectricityData(provider, product, accountNumber, amount));
      setDisplaySpinner(true);
      setAmountError(false);
    }
  };

  const makePayment = () => {
    if (transactionPin != "") {
      const transactionDetails = {
        transactionType: "electricity",
        anchorID: accountNumber,
        details: {
          amount: amount,
          provider: provider,
          product: product,
          accountNumber: accountNumber,
          customerName: customerName,
          customerAddress: customerAddress,
          customerOutstandingBalance: customerOutstandingBalance,
          acquiringMerchant: "Ancla Technologies Ltd",
        },
      };
      dispatch(buyUtility(transactionPin, JSON.stringify(transactionDetails), amount));
      setDisplaySpinner(true);
    } else {
      setDisplayTransactionPinError(true);
    }
  };

  const renderModal = () => {
    switch (electricityPurchaseStage) {
      case 1:
        return (
          <View style={{ ...styles.modalContent, borderColor: "#266ddc", borderWidth: 2 }}>
            {/** Modal Header */}
            <View style={{ marginTop: 16, flexDirection: "row", justifyContent: "space-between" }}>
              <AppText bold="true" styles={{ fontSize: 18 }}>
                {discosPlatformName[provider]}
              </AppText>
              <MaterialIcons
                color="grey"
                name="close"
                size={24}
                onPress={() => {
                  closeTransactionModal();
                }}
                style={{ paddingRight: 10 }}
              />
            </View>
            {/** End Modal Header */}

            <View style={{ marginTop: 20 }}>
              <AppText bold="true">Select Service</AppText>
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
                    setProduct(itemValue);
                  }}
                  selectedValue={product}
                >
                  <Picker.Item label={"---select---"} value="" />
                  <Picker.Item label={"PREPAID"} value="PREPAID" />
                  <Picker.Item label={"POSTPAID"} value="POSTPAID" />
                </Picker>
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <Button
                onPress={() => {
                  if (product !== "") {
                    setElectricityPurchaseStage(2);
                  }
                }}
                title="Proceed"
              />
            </View>
          </View>
        );
      case 2:
        return (
          <View style={{ ...styles.modalContent, borderColor: "#266ddc", borderWidth: 2 }}>
            {/** Modal Header */}
            <View style={{ marginTop: 16, flexDirection: "row", justifyContent: "space-between" }}>
              <AppText bold="true" styles={{ fontSize: 18 }}>
                {discosPlatformName[provider]}
              </AppText>
              <MaterialIcons
                color="grey"
                name="close"
                size={24}
                onPress={() => {
                  closeTransactionModal();
                }}
                style={{ paddingRight: 10 }}
              />
            </View>
            {/** End Modal Header */}

            <View style={{ marginTop: 20 }}>
              <AppText bold="true" styles={{ color: "red", fontSize: 10, display: `${amountError ? "flex" : "none"}` }}>
                {serverMessage}
              </AppText>
              <AppText bold="true">{product == "PREPAID" ? "Meter Number" : "Account Number"}</AppText>
              <TextInput
                value={accountNumber}
                style={{ ...styles.textInput, marginTop: 10, borderColor: "#266ddc" }}
                placeholder="Enter number"
                keyboardType="numeric"
                onChangeText={(text) => setAccountNumber(text)}
              />

              <AppText bold="true">Amount</AppText>
              <AppText bold="true" styles={{ color: "red", fontSize: 10, display: `${amountError ? "flex" : "none"}` }}>
                Amount cannot be less than NGN 900
              </AppText>
              <TextInput
                value={amount}
                style={{ ...styles.textInput, marginTop: 10, borderColor: "#266ddc" }}
                placeholder="Enter amount"
                keyboardType="numeric"
                onChangeText={(text) => setAmount(text)}
              />

              <View style={{ marginTop: 10, display: `${!displaySpinner ? "flex" : "none"}` }}>
                <Button title="Buy" onPress={() => validateElectricityDetails()} />
              </View>

              <View style={{ marginTop: 10, justifyContent: "center", display: `${displaySpinner ? "flex" : "none"}` }}>
                <Spinner color="blue" />
              </View>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={{ ...styles.modalContent, borderColor: "#266ddc", borderWidth: 2 }}>
            {/** Modal Header */}
            <View style={{ marginTop: 16, flexDirection: "row", justifyContent: "space-between" }}>
              <AppText bold="true" styles={{ fontSize: 18 }}>
                {discosPlatformName[provider]}
              </AppText>
              <MaterialIcons
                color="grey"
                name="close"
                size={24}
                onPress={() => {
                  closeTransactionModal();
                }}
                style={{ paddingRight: 10 }}
              />
            </View>
            {/** End Modal Header */}

            <AppText bold="true" styles={{ marginTop: 10, fontSize: 18 }}>
              Transaction Details
            </AppText>

            <View style={styles.transactionDetailsRow}>
              <AppText bold="true">Amount</AppText>
              <AppText>{amount}</AppText>
            </View>

            <View style={styles.transactionDetailsRow}>
              <AppText bold="true">Provider</AppText>
              <AppText>{provider}</AppText>
            </View>

            <View style={styles.transactionDetailsRow}>
              <AppText bold="true">Service Type</AppText>
              <AppText>{product}</AppText>
            </View>

            <View style={styles.transactionDetailsRow}>
              <AppText bold="true">Account Number</AppText>
              <AppText>{accountNumber}</AppText>
            </View>

            <View style={styles.transactionDetailsRow}>
              <AppText bold="true">Customer Name</AppText>
              <AppText>{"" || customerName || "N/A"}</AppText>
            </View>

            <View style={styles.transactionDetailsRow}>
              <AppText bold="true">Customer Address</AppText>
              <AppText>{"" || customerAddress || "N/A"}</AppText>
            </View>

            <View style={styles.transactionDetailsRow}>
              <AppText bold="true">outstandingBalance</AppText>
              <AppText>{"" || customerOutstandingBalance || "N/A"}</AppText>
            </View>

            {/** Transaction Pin */}
            <View style={{ marginTop: 24 }}>
              <AppText bold="true" styles={{ fontSize: 18 }}>
                Transaction Pin
              </AppText>
              <AppText styles={{ fontSize: 14, color: "red", textAlign: "center", display: `${displayTransactionPinError ? "flex" : "none"}` }}>Input transaction pin!</AppText>
              <AppText styles={{ fontSize: 14, color: "red", textAlign: "center" }}>{transactionGenericError}</AppText>
              <TextInput
                value={transactionPin}
                style={{ ...styles.textInput, marginTop: 10, borderColor: "#266ddc" }}
                placeholder="Enter Transaction Pin"
                textContentType="password"
                secureTextEntry
                onChangeText={(text) => setTransactionPin(text)}
              />
            </View>

            <View style={{ marginTop: 10, display: `${!displaySpinner ? "flex" : "none"}` }}>
              <Button title="Complete Transaction" onPress={() => makePayment()}></Button>
            </View>

            <View style={{ justifyContent: "center", display: `${displaySpinner ? "flex" : "none"}` }}>
              <Spinner color="blue" />
            </View>
          </View>
        );

      case 4:
        return (
          <View style={{ ...styles.modalContent, borderColor: "#266ddc", borderWidth: 2 }}>
            {/** Modal Header */}
            <View style={{ marginTop: 16, flexDirection: "row", justifyContent: "flex-end" }}>
              <MaterialIcons
                color="grey"
                name="close"
                size={24}
                onPress={() => {
                  closeTransactionModal();
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
              Your Electricity purchase of {userCurrency} {amount} to {accountNumber} was Successful
            </AppText>

            <View style={{ marginTop: 24, alignItems: "center" }}>
              <PrimaryButton
                onPress={() => {
                  closeTransactionModal();
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
    <View style={styles.container}>
      <Modal transparent visible={modalOpen} animationType="slide">
        <KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={10} enableOnAndroid={true} extraHeight={Platform.select({ android: 150 })} style={{ flexGrow: 1 }}>
          <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)", height: 1000 }}>{renderModal()}</View>
        </KeyboardAwareScrollView>
      </Modal>
      <View style={styles.innerContainer}>
        <AppText bold="true" styles={{ marginTop: 10, fontSize: 16, marginBottom: 5 }}>
          Select Disco
        </AppText>

        <ScrollView>
          <View style={{ flex: 1, marginBottom: 40 }}>
            <TouchableOpacity onPress={() => openTransactionModal("EKEDC")} style={styles.electCard}>
              <Image style={styles.logos} source={Ekologo} />
              <AppText bold="true" styles={{ fontSize: 16 }}>
                EKEDC
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => openTransactionModal("IBEDC")} style={styles.electCard}>
              <Image style={styles.logos} source={IBEDClogo} />
              <AppText bold="true" styles={{ fontSize: 16 }}>
                IBEDC
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => openTransactionModal("IKEDC")} style={styles.electCard}>
              <Image style={styles.logos} source={IKEDClogo} />
              <AppText bold="true" styles={{ fontSize: 16 }}>
                IKEDC
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => openTransactionModal("KANO")} style={styles.electCard}>
              <Image style={styles.logos} source={KANOlogo} />
              <AppText bold="true" styles={{ fontSize: 16 }}>
                KANO
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => openTransactionModal("ABUJA")} style={styles.electCard}>
              <Image style={styles.logos} source={ABUJAlogo} />
              <AppText bold="true" styles={{ fontSize: 16 }}>
                ABUJA
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => openTransactionModal("JOS")} style={styles.electCard}>
              <Image style={styles.logos} source={JOSlogo} />
              <AppText bold="true" styles={{ fontSize: 16 }}>
                JOS
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => openTransactionModal("KADUNA")} style={styles.electCard}>
              <Image style={styles.logos} source={KADUNAlogo} />
              <AppText bold="true" styles={{ fontSize: 16 }}>
                KADUNA
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => openTransactionModal("ENUGU")} style={styles.electCard}>
              <Image style={styles.logos} source={ENUGUlogo} />
              <AppText bold="true" styles={{ fontSize: 16 }}>
                ENUGU
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => openTransactionModal("PORTH")} style={styles.electCard}>
              <Image style={styles.logos} source={PORTHlogo} />
              <AppText bold="true" styles={{ fontSize: 16 }}>
                PORT HARCOURT
              </AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  innerContainer: {
    marginHorizontal: 10,
  },
  logos: {
    width: 55,
    height: 40,
  },
  electCard: {
    backgroundColor: "#ffffff",
    elevation: 3,
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },

  modalContent: {
    flex: 1,
    marginTop: 80,
    borderRadius: 5,
    maxHeight: 500,
    marginLeft: 20,
    marginRight: 20,
    paddingHorizontal: 10,
    backgroundColor: "#F0F0F8",
  },

  modalClose: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    padding: 10,
    borderRadius: 4,
    alignSelf: "center",
    elevation: 4,
    backgroundColor: "#FFFFFF",
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

  transactionDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
