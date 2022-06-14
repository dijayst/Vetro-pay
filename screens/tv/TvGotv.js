import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { View, StyleSheet, Picker, Button, TextInput } from "react-native";
import AppText from "../../resources/AppText";
import { PrimaryButton } from "../../resources/AppButton";
import { getTvBouquets, getCustomer } from "../../containers/utility/action";
import { Spinner } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { buyUtility } from "../../containers/utility/action";
import { SuccessfulSvgComponent } from "../../resources/Svg";

export default function TvDstv() {
  const provider = "Multichoice";
  const product = "GOTV";
  const [productCode, setProductCode] = useState("");
  const [gotvLoadedSubscriptionTypes, setGotvLoadedSubscriptionTypes] = useState({
    data: [
      {
        availablePricingOptions: [
          {
            monthsPaidFor: 0,
            price: 0,
            invoicePeriod: 0,
          },
        ],
        code: "LOADING",
      },
    ],
  });

  const [tempProductIndex, setTempProductIndex] = useState(0);
  const [productMonthsPaidFor, setProductMonthsPaidFor] = useState("");
  const [productMonthsPaidForAmount, setProductMonthsPaidForAmount] = useState(0);
  const [smartCardNumber, setSmartCardNumber] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [subscriptionPurchaseStage, setSubscriptionPurchaseStage] = useState(1);
  const [buyLoadingWindowHidden, setBuyLoadingWindowHidden] = useState(false);
  const [transactionPin, setTransactionPin] = useState("");
  const [displaySpinner, setDisplaySpinner] = useState(false);
  const [displayTransactionPinError, setDisplayTransactionPinError] = useState(false);
  const [transactionGenericError, setTransactionGenericError] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTvBouquets("gotv"));
  }, []);

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const getTvBouquetsData = useSelector((state) => state.utility.tvbouquets);
  const prevGetTvBouquetsData = usePrevious(getTvBouquetsData);

  const customerFinderResponse = useSelector((state) => state.utility.tvcustomer);
  const prevCustomerFinderResponse = usePrevious(customerFinderResponse);

  const utilityPurchaseData = useSelector((state) => state.utility.buyutility);
  const prevUtilityPurchaseData = usePrevious(utilityPurchaseData);

  useEffect(() => {
    if (prevGetTvBouquetsData) {
      if (prevGetTvBouquetsData.length !== getTvBouquetsData.length) {
        if (getTvBouquetsData[getTvBouquetsData.length - 1]["status"] == "success") {
          setGotvLoadedSubscriptionTypes(getTvBouquetsData[getTvBouquetsData.length - 1]);
          setBuyLoadingWindowHidden(true);
        }
      }
    }

    if (prevCustomerFinderResponse) {
      if (prevCustomerFinderResponse.length !== customerFinderResponse.length) {
        console.log(customerFinderResponse[customerFinderResponse.length - 1]);
        if (customerFinderResponse[customerFinderResponse.length - 1]["status"] == "success") {
          setCustomerName(customerFinderResponse[customerFinderResponse.length - 1]["data"]["user"]["name"]);
          setSubscriptionPurchaseStage(3);
          setBuyLoadingWindowHidden(true);
        }
      }
    }

    if (prevUtilityPurchaseData) {
      if (prevUtilityPurchaseData.length !== utilityPurchaseData.length) {
        if (utilityPurchaseData[utilityPurchaseData.length - 1]["status"] == "success") {
          setBuyLoadingWindowHidden(true);
          setSubscriptionPurchaseStage(5);
        } else {
          setDisplaySpinner(false);
          setTransactionGenericError(utilityPurchaseData[utilityPurchaseData.length - 1]["message"]);
        }
      }
    }
  });

  const onChangeBouqet = (selectedValue) => {
    const valueObtained = selectedValue;
    Object.keys(gotvLoadedSubscriptionTypes.data).map((value, index) => {
      const plans = gotvLoadedSubscriptionTypes.data[value];
      Object.values(plans).map((plansValue, PlansIndex) => {
        if (plansValue == valueObtained) {
          setTempProductIndex(index);
        }
      });
    });
    setProductCode(selectedValue);
  };

  const onChangeBouquetDuration = (selectedValue) => {
    const valueObtained = selectedValue;
    setProductMonthsPaidFor(valueObtained);
    Object.keys(gotvLoadedSubscriptionTypes.data[tempProductIndex]).map((value, index) => {
      const availableOptions = gotvLoadedSubscriptionTypes.data[tempProductIndex][value];
      Object.values(availableOptions).map((availableOptionsContent, availableOptionsIndex) => {
        if (availableOptionsContent["monthsPaidFor"] == valueObtained) {
          setProductMonthsPaidForAmount(availableOptionsContent["price"]);
        }
      });
    });
  };

  const promptStage2 = () => {
    //Calculate Totla Amount
    const main_sub = Number(productMonthsPaidForAmount);
    let total = main_sub;
    setTotalAmount(total);
    setSubscriptionPurchaseStage(2);
  };

  const verifySmartCard = () => {
    if (smartCardNumber !== "" && smartCardNumber.length >= 10) {
      setBuyLoadingWindowHidden(false);
      dispatch(getCustomer("gotv", smartCardNumber));
    }
  };

  const makePayment = () => {
    if (transactionPin != "") {
      const transactionDetails = {
        transactionType: "tv",
        anchorID: smartCardNumber,
        details: {
          amount: totalAmount,
          provider: provider,
          product: product,
          smartCard: smartCardNumber,
          customerName: customerName,
          subscription: gotvLoadedSubscriptionTypes.data[tempProductIndex]["name"],
          subscriptionCode: productCode,
          subscriptionMonth: productMonthsPaidFor,
          addonCode: "",
          addonMonth: "",
          acquiringMerchant: "Ancla Technologies Ltd",
        },
      };
      dispatch(buyUtility(transactionPin, JSON.stringify(transactionDetails), totalAmount));
      setDisplaySpinner(true);
    } else {
      setDisplayTransactionPinError(true);
    }
  };

  const subscriptionPurchasePage = () => {
    if (subscriptionPurchaseStage === 1) {
      return (
        <View style={{ flex: 1 }}>
          {!buyLoadingWindowHidden && (
            <View style={{ justifyContent: "center", alignItems: "center", top: "50%" }}>
              <Spinner color="#266ddc" />
            </View>
          )}
          {buyLoadingWindowHidden && (
            <View style={styles.container}>
              <View style={styles.innerContainer}>
                <AppText bold="true" styles={{ marginTop: 10, fontSize: 18 }}>
                  Select Subscription type
                </AppText>

                <View style={styles.picker}>
                  <Picker
                    style={{ height: 40 }}
                    onValueChange={(itemValue, itemIndex) => {
                      onChangeBouqet(itemValue);
                    }}
                    selectedValue={productCode}
                  >
                    <Picker.Item label={"Select"} value="" />
                    {gotvLoadedSubscriptionTypes.data.map((value, index) => {
                      return <Picker.Item key={index} label={`${value.name}`.toUpperCase()} value={value.code} />;
                    })}
                  </Picker>
                </View>

                {/** DURATION */}
                <AppText bold="true" styles={{ marginTop: 10, fontSize: 18 }}>
                  Select Duration
                </AppText>

                <View style={styles.picker}>
                  <Picker
                    style={{ height: 40 }}
                    onValueChange={(itemValue, itemIndex) => {
                      onChangeBouquetDuration(itemValue);
                    }}
                    selectedValue={productMonthsPaidFor}
                  >
                    <Picker.Item label={"Select"} value="" />
                    {gotvLoadedSubscriptionTypes.data[tempProductIndex]["availablePricingOptions"].map((value, index) => {
                      return <Picker.Item key={index} label={`${value.monthsPaidFor} Month: ₦${value.price}`.toUpperCase()} value={value.monthsPaidFor} />;
                    })}
                  </Picker>
                </View>

                {/** END DURATION */}

                <View style={{ marginTop: 20 }}>
                  <Button onPress={() => promptStage2()} title="Proceed" />
                </View>
              </View>
            </View>
          )}
        </View>
      );
    } else if (subscriptionPurchaseStage === 2) {
      return (
        <View style={{ flex: 1 }}>
          {!buyLoadingWindowHidden && (
            <View style={{ justifyContent: "center", alignItems: "center", top: "50%" }}>
              <Spinner color="#266ddc" />
            </View>
          )}

          {buyLoadingWindowHidden && (
            <View style={styles.container}>
              <View style={styles.innerContainer}>
                <AppText style={{ marginTop: 10, color: "red", textTransform: "capitalize", fontSize: 16 }}>{serverMessage}</AppText>
                <AppText bold="true" styles={{ marginTop: 10, fontSize: 18 }}>
                  Enter Smart card number
                </AppText>
                <View style={styles.formGroup}>
                  <TextInput
                    style={{ ...styles.textInput, borderColor: "#266ddc" }}
                    placeholder=" Enter number"
                    value={smartCardNumber}
                    keyboardType="numeric"
                    onChangeText={(text) => setSmartCardNumber(text.replace(/\s/g, ""))}
                  />
                </View>

                <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-evenly" }}>
                  <Button color="red" title="Cancel" onPress={() => setSubscriptionPurchaseStage(1)} />
                  <Button title="Validate" onPress={() => verifySmartCard()} />
                  <Button disabled title={`Pay ₦${totalAmount}`} />
                </View>
              </View>
            </View>
          )}
        </View>
      );
    } else if (subscriptionPurchaseStage == 3) {
      return (
        <View style={{ flex: 1 }}>
          <View style={styles.container}>
            <View style={styles.innerContainer}>
              <AppText bold="true" styles={{ marginTop: 10, fontSize: 18 }}>
                Enter Smart card number
              </AppText>
              <View style={styles.formGroup}>
                <TextInput editable={false} selectTextOnFocus={false} style={{ ...styles.textInput, borderColor: "#266ddc" }} value={smartCardNumber} keyboardType="numeric" />
              </View>

              <AppText bold="true" styles={{ marginTop: 10, fontSize: 18 }}>
                Customer Name
              </AppText>
              <View style={styles.formGroup}>
                <TextInput editable={false} selectTextOnFocus={false} style={{ ...styles.textInput, borderColor: "#266ddc" }} value={customerName} keyboardType="numeric" />
              </View>

              <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-evenly" }}>
                <Button color="red" title="Cancel" onPress={() => setSubscriptionPurchaseStage(1)} />
                <Button title={`Pay ₦${totalAmount}`} onPress={() => setSubscriptionPurchaseStage(4)} />
              </View>
            </View>
          </View>
        </View>
      );
    } else if (subscriptionPurchaseStage == 4) {
      return (
        <View style={{ flex: 1 }}>
          <View style={styles.container}>
            <View style={styles.innerContainer}>
              <AppText bold="true" styles={{ marginTop: 10, fontSize: 18 }}>
                Transaction Details
              </AppText>

              <View style={styles.transactionDetailsRow}>
                <AppText bold="true">Provider</AppText>
                <AppText>{provider}</AppText>
              </View>
              <View style={styles.transactionDetailsRow}>
                <AppText bold="true">Product</AppText>
                <AppText>{product}</AppText>
              </View>

              <View style={styles.transactionDetailsRow}>
                <AppText bold="true">Smart Card</AppText>
                <AppText>{smartCardNumber}</AppText>
              </View>

              <View style={styles.transactionDetailsRow}>
                <AppText bold="true">Customer Name</AppText>
                <AppText>{customerName}</AppText>
              </View>

              <View style={styles.transactionDetailsRow}>
                <AppText bold="true">Subscription</AppText>
                <AppText>{gotvLoadedSubscriptionTypes.data[tempProductIndex]["name"]}</AppText>
              </View>

              <View style={styles.transactionDetailsRow}>
                <AppText bold="true">Addon Code/Month</AppText>
                <AppText>/</AppText>
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
          </View>
        </View>
      );
    } else if (subscriptionPurchaseStage == 5) {
      return (
        <View style={{ flex: 1 }}>
          <View style={styles.container}>
            <View style={styles.innerContainer}>
              <View style={{ marginTop: 50, justifyContent: "center", alignItems: "center" }}>
                <SuccessfulSvgComponent />
              </View>

              <AppText bold="true" styles={{ fontSize: 18, marginTop: 16, textAlign: "center" }}>
                Transaction Successful
              </AppText>
              <AppText styles={{ fontSize: 15, marginTop: 16, textAlign: "center" }}>
                Your GOTV subscription of NGN {totalAmount} to {smartCardNumber} was Successful
              </AppText>

              <View style={{ marginTop: 24, alignItems: "center" }}>
                <PrimaryButton
                  onPress={() => {
                    null;
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
          </View>
        </View>
      );
    }
  };
  return <View style={{ flex: 1 }}>{subscriptionPurchasePage()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "#f2f2f2",
  },
  innerContainer: {
    paddingHorizontal: 10,
  },
  picker: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#266ddc",
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
  transactionDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
