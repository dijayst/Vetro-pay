import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, Text, StyleSheet, Image, Button, TouchableOpacity, Alert, Modal, TextInput, Switch } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AppText from "../../resources/AppText";
import { PrimaryButton } from "../../resources/AppButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { MaterialIcons } from "@expo/vector-icons";
import { shortenNames } from "../../resources/MetaFunctions";
import { postPaymentMarketplaceBusiness } from "../../containers/business/action";
import { Spinner } from "native-base";
import { SuccessfulSvgComponent } from "../../resources/Svg";

export default function PayBusiness({ route, navigation }) {
  /** Get Route Params */
  const { busId, busBillers, busBillersBoolean, busLogo, busName, busSignature, busVerified } = route.params;

  const [modalOpen, setModalOpen] = useState(false);
  const [makePaymentStage, setMakePaymentStage] = useState(1);
  const [anonymousPay, setAnonymousPay] = useState(false);
  const [sendMoneySuccessData, setSendMoneySuccessData] = useState({});
  const [displayTransactionPinError, setDisplayTransactionPinError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [transactionGenericError, setTransactionGenericError] = useState("");
  const [displaySpinner, setDisplaySpinner] = useState(false);
  const [selectedBiller, setSelectedBiller] = useState({});
  const [customerTransactionDetails, setCustomerTransactionDetails] = useState({
    payload: {
      amount: "",
      reference: "",
      billerId: "",
      billerJsonInfo: {},
      anonymousPay: false,
      transactionPin: "",
    },
  });

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

  const marketplacePaymentData = useSelector((state) => state.business.marketpay);
  const prevMarketplacePaymentData = usePrevious(marketplacePaymentData);

  useEffect(() => {
    if (prevMarketplacePaymentData) {
      if (prevMarketplacePaymentData.length !== marketplacePaymentData.length) {
        if (marketplacePaymentData[marketplacePaymentData.length - 1]["status"] == "success") {
          setSendMoneySuccessData(marketplacePaymentData[marketplacePaymentData.length - 1]["data"]);
          setMakePaymentStage(4);
        } else {
          setDisplaySpinner(false);
          setTransactionGenericError(marketplacePaymentData[marketplacePaymentData.length - 1]["message"]);
        }
      }
    }
  });

  const onValueChange = (fieldName, value) => {
    if (fieldName == "amount") {
      //Update Biller Information
      setCustomerTransactionDetails((prevState) => ({
        ...prevState,
        payload: {
          ...prevState.payload,
          amount: value,
        },
      }));
    } else if (fieldName == "reference") {
      //Update Biller Information
      setCustomerTransactionDetails((prevState) => ({
        ...prevState,
        payload: {
          ...prevState.payload,
          reference: value,
        },
      }));
    } else if (fieldName == "transactionPin") {
      //Update Biller Information
      setCustomerTransactionDetails((prevState) => ({
        ...prevState,
        payload: {
          ...prevState.payload,
          transactionPin: value,
        },
      }));
    }
  };

  const closeTransactionModal = () => {
    setModalOpen(false);
    setMakePaymentStage(1);

    setCustomerTransactionDetails({
      payload: {
        amount: "",
        reference: "",
        billerId: "",
        billerJsonInfo: {},
        anonymousPay: false,
        transactionPin: "",
      },
    });

    setAmountError(false);
    setDisplaySpinner(false);
    setTransactionGenericError("");
  };

  const alertBusinessVerificationStatus = () => {
    if (!busVerified) {
      Alert.alert("", "VetroPay hasn't verified this business account.", [
        {
          text: "Learn More",
          onPress: () => {
            return null;
          },
        },
        {
          text: "Ok",
          onPress: () => {
            return null;
          },
        },
      ]);
    }
  };

  const proceedtoPaymentModalStageThreePartA = () => {
    if (customerTransactionDetails.payload.amount !== "" && parseInt(customerTransactionDetails.payload.amount) >= 100) {
      setMakePaymentStage(3);
    } else {
      setAmountError(true);
    }
  };

  const completeTransaction = () => {
    if (customerTransactionDetails.payload.transactionPin == "" || customerTransactionDetails.payload.transactionPin.replace(/\s\s+/g, " ") == " ") {
      setDisplayTransactionPinError(true);
    } else {
      setDisplaySpinner(true);
      dispatch(
        postPaymentMarketplaceBusiness(
          busId,
          busName,
          customerTransactionDetails.payload.billerId,
          customerTransactionDetails.payload.amount,
          customerTransactionDetails.payload.reference,
          JSON.stringify(customerTransactionDetails.payload.billerJsonInfo),
          customerTransactionDetails.payload.transactionPin
        )
      );
    }
  };

  const renderModal = () => {
    switch (makePaymentStage) {
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
                  closeTransactionModal();
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
                  {shortenNames(busName, 21)}
                </AppText>
              </View>
            </View>

            {/** Amount  */}
            <AppText styles={{ fontSize: 15, marginTop: 10 }}>
              <Text style={{ fontWeight: "700" }}>Amount </Text>
            </AppText>
            <Text style={{ fontWeight: "500", color: "red", fontSize: 10, display: `${amountError ? "flex" : "none"}` }}>Amount cannot be less than NGN 100 </Text>

            <View style={styles.formGroup}>
              <TextInput
                value={customerTransactionDetails.payload.amount}
                style={{ ...styles.textInput }}
                placeholder="Enter Amount"
                keyboardType="numeric"
                onChangeText={(text) => onValueChange("amount", text)}
              />
            </View>

            {/** End Amount  */}

            {/** Payment Category */}
            <View
              style={{
                display: `${busBillersBoolean ? "flex" : "none"}`,
              }}
            >
              <AppText styles={{ fontSize: 15, marginTop: 10 }}>
                <Text style={{ fontWeight: "700" }}>Select Category</Text>
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
                    setSelectedBiller(itemValue);

                    // Update Transaction Details
                    setCustomerTransactionDetails((prevState) => ({
                      ...prevState,
                      payload: {
                        ...prevState.payload,
                        billerId: itemValue,
                      },
                    }));
                  }}
                  selectedValue={selectedBiller}
                >
                  <Picker.Item label={"--- None ---"} value="" />
                  {busBillersBoolean
                    ? busBillers.map((biller, index) => {
                        return <Picker.Item key={index} label={`${biller.name}`.toUpperCase()} value={biller.billerId} />;
                      })
                    : () => {
                        return <Picker.Item label="Null" value="" />;
                      }}
                </Picker>
              </View>
            </View>
            {/**End Payment Category */}

            {/** Payer Reference */}
            <AppText styles={{ fontSize: 15, marginTop: 10 }}>
              <Text style={{ fontWeight: "700" }}>Reference (optional)</Text>
            </AppText>

            <View style={styles.formGroup}>
              <TextInput
                value={customerTransactionDetails.payload.reference}
                style={{ ...styles.textInput }}
                placeholder="Enter Reference"
                onChangeText={(text) => onValueChange("reference", text)}
              />
            </View>
            {/** Payer Reference */}

            {/** Pay as Anonymous */}
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <AppText bold="true" styles={{ fontSize: 15 }}>
                Pay as Anonymous
              </AppText>
              <Switch
                trackColor={{ true: "#ADD8E6" }}
                thumbColor={anonymousPay ? "#266ddc" : "#faf3f4"}
                onValueChange={(value) => {
                  setAnonymousPay(value);

                  // Update Transaction Details
                  setCustomerTransactionDetails((prevState) => ({
                    ...prevState,
                    payload: {
                      ...prevState.payload,
                      anonymousPay: value,
                    },
                  }));
                }}
                value={anonymousPay}
              />
            </View>
            <Text style={{ color: "green", display: `${anonymousPay ? "flex" : "none"}`, fontSize: 12 }}>*You are paying as anonymous</Text>

            {/** End Pay as Anonymous */}

            <View style={{ display: "flex", marginTop: 10, alignItems: "center", justifyContent: "center" }}>
              <View style={{ width: "100%" }}>
                <Button
                  onPress={() => {
                    if (busBillersBoolean && selectedBiller.type == "GUI") {
                      setMakePaymentStage(2);
                    } else {
                      proceedtoPaymentModalStageThreePartA();
                    }
                  }}
                  title="Continue"
                ></Button>
              </View>
            </View>
          </View>
        );
      case 2:
        return <View></View>;
      case 3:
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
                  closeTransactionModal();
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
                  {shortenNames(busName, 21)}
                </AppText>
              </View>
            </View>

            {/** Amount  */}
            <View style={{ marginTop: 10, paddingRight: 20 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <AppText styles={{ fontSize: 15, marginTop: 10 }}>
                  <Text style={{ fontWeight: "700" }}>Amount </Text>
                </AppText>
                <AppText bold="true" styles={{ fontSize: 15 }}>
                  {`${userCurrency} ${customerTransactionDetails.payload.amount}`}
                </AppText>
              </View>
            </View>

            {/** Transaction Pin */}
            <View style={{ marginTop: 24 }}>
              <AppText bold="true" styles={{ fontSize: 18 }}>
                Transaction Pin
              </AppText>
              <AppText styles={{ fontSize: 14, color: "red", textAlign: "center", display: `${displayTransactionPinError ? "flex" : "none"}` }}>Input transaction pin!</AppText>
              <AppText styles={{ fontSize: 14, color: "red", textAlign: "center" }}>{transactionGenericError}</AppText>
              <TextInput
                value={customerTransactionDetails.payload.transactionPin}
                style={{ ...styles.textInput, borderColor: "#266ddc" }}
                placeholder="Enter Transaction Pin"
                textContentType="password"
                secureTextEntry
                onChangeText={(text) => onValueChange("transactionPin", text)}
              />
            </View>

            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", marginTop: 10, display: `${!displaySpinner ? "flex" : "none"}` }}>
              <Button color="red" title="<< Go Back" onPress={() => setMakePaymentStage(1)}></Button>
              <Button title="Complete Transaction" onPress={() => completeTransaction()}></Button>
            </View>

            <View style={{ justifyContent: "center", display: `${displaySpinner ? "flex" : "none"}` }}>
              <Spinner color="blue.700" size="lg" />
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
              Your fund transfer of {userCurrency} {sendMoneySuccessData.amount} to {sendMoneySuccessData.recipient} was Successful
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
      <View style={styles.containerWindow}>
        <View style={styles.organizationDetails}>
          <Image source={{ uri: busLogo }} style={{ width: 80, height: 80, resizeMode: "contain" }} />
          <AppText styles={{ fontSize: 18, marginLeft: 10 }}>{busName}</AppText>
        </View>

        <TouchableOpacity onPress={() => alertBusinessVerificationStatus()}>
          <AppText
            bold="true"
            styles={{
              marginTop: 15,
              width: 100,
              paddingBottom: 2,
              textAlign: "center",
              color: "#32363F",
              textTransform: "uppercase",
              borderRadius: 10,
              backgroundColor: "#F2C94C",
              textTransform: "uppercase",
            }}
          >
            Unverified
          </AppText>
        </TouchableOpacity>
        <AppText bold="true" styles={{ fontSize: 16, marginTop: 10 }}>
          About ORG :
        </AppText>
        <AppText styles={{ fontSize: 14 }}>{busSignature}</AppText>
        <AppText bold="true" styles={{ fontSize: 16, marginTop: 5 }}>
          Address:
        </AppText>
        <AppText styles={{ fontSize: 14 }}>N?A</AppText>

        <AppText bold="true" styles={{ fontSize: 16, marginTop: 5 }}>
          Website:
        </AppText>
        <AppText styles={{ fontSize: 14 }}>N?A</AppText>

        <View style={{ display: "flex", marginTop: 10, alignItems: "center", justifyContent: "center" }}>
          <View style={{ width: "100%" }}>
            <Button onPress={() => setModalOpen(true)} title="Proceed"></Button>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  containerWindow: {
    paddingHorizontal: 10,
  },
  organizationDetails: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    borderColor: "#266ddc",
  },
});
