import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Dimensions, View, Text, StyleSheet, TextInput, Picker } from "react-native";
import AppText from "../resource/AppText";
import { AppButton, PrimaryButton } from "../resource/AppButton";
import { AntDesign } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Toast, Spinner } from "native-base";

import { postTransaction } from "../containers/transactions/action";
import { convertUTCDateToLocalDate } from "../resource/MetaFunctions";

export default function AddRecord({ navigation }) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [displaySpinner, setDisplaySpinner] = useState(false);
  const [transactionData, setTransactionData] = useState({
    payload: {
      transactionDate: "",
      transactionClass: "",
      paymentMethod: "",
      amount: "",
      paymentCategory: "",
      note: "",
    },
  });

  const dispatch = useDispatch();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker();
    const localDate = convertUTCDateToLocalDate(date);

    setTransactionData((prevState) => ({
      ...prevState,
      payload: {
        ...prevState.payload,
        transactionDate: localDate.toISOString().substring(0, 10),
      },
    }));
  };

  const getDateValue = () => {
    if (transactionData.payload.transactionDate == "") {
      return (
        <Text>
          <AntDesign name="calendar" color="#266ddc" size={16} />
          <Text style={{ color: "#266ddc", fontWeight: "700", textTransform: "uppercase" }}> Select Transaction Date</Text>
        </Text>
      );
    } else {
      return <Text>{new Date(transactionData.payload.transactionDate).toDateString()}</Text>;
    }
  };

  const onValueChange = (fieldName, value) => {
    if (fieldName == "amount") {
      setTransactionData((prevState) => ({
        ...prevState,
        payload: {
          ...prevState.payload,
          amount: value,
        },
      }));
    } else if (fieldName == "note") {
      setTransactionData((prevState) => ({
        ...prevState,
        payload: {
          ...prevState.payload,
          note: value,
        },
      }));
    }
  };

  const submitData = () => {
    if (
      transactionData.payload.transactionDate == "" ||
      transactionData.payload.transactionClass == "" ||
      transactionData.payload.paymentMethod == "" ||
      transactionData.payload.amount == "" ||
      Number(transactionData.payload.amount) == NaN ||
      Number(transactionData.payload.amount) < 0 ||
      transactionData.payload.paymentCategory == ""
    ) {
      if (transactionData.payload.transactionDate == "") {
        Toast.show({
          text: "Select transaction date",
          duration: 3000,
          type: "danger",
        });
      }
      if (transactionData.payload.transactionClass == "") {
        Toast.show({
          text: "Select transaction type",
          duration: 3000,
          type: "danger",
        });
      }
      if (transactionData.payload.paymentMethod == "") {
        Toast.show({
          text: "Select payment method",
          duration: 3000,
          type: "danger",
        });
      }
      if (transactionData.payload.amount == "" || Number(transactionData.payload.amount) == NaN || Number(transactionData.payload.amount) < 0) {
        Toast.show({
          text: "Amount Invalid",
          duration: 3000,
          type: "danger",
        });
      }
      if (transactionData.payload.paymentCategory == "") {
        Toast.show({
          text: "Select payment category",
          duration: 3000,
          type: "danger",
        });
      }
    } else {
      setDisplaySpinner(true);
      dispatch(
        postTransaction(
          transactionData.payload.transactionDate,
          transactionData.payload.transactionClass,
          transactionData.payload.paymentMethod,
          transactionData.payload.amount,
          transactionData.payload.paymentCategory,
          transactionData.payload.note
        )
      );
    }
  };

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const userPostTransaction = useSelector((state) => state.transactions.posttransaction);
  const prevUserPostTransaction = usePrevious(userPostTransaction);

  useEffect(() => {
    if (prevUserPostTransaction) {
      if (prevUserPostTransaction.length !== userPostTransaction.length) {
        if (userPostTransaction[userPostTransaction.length - 1]["status"] == "success") {
          setDisplaySpinner(false);
          navigation.goBack();
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
            Record Off-App Transaction
          </AppText>
          <View style={styles.recordForm}>
            <View style={{ marginTop: 8, paddingLeft: 4, paddingRight: 4 }}>
              <View style={{ ...styles.formGroup, marginTop: 0 }}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>Transaction Date</Text>
                </AppText>
                <AppButton
                  styles={{
                    width: "100%",
                    marginTop: 10,
                    backgroundColor: "#FFFFFF",
                    borderWidth: 1,
                    borderColor: "#266ddc",
                    height: 40,
                    borderRadius: 4,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={showDatePicker}
                >
                  <AppText>{getDateValue()}</AppText>
                </AppButton>
                <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleConfirm} onCancel={hideDatePicker} />
              </View>

              <View style={styles.formGroup}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>Transaction Type</Text>
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
                      setTransactionData((prevState) => ({
                        ...prevState,
                        payload: {
                          ...prevState.payload,
                          transactionClass: itemValue,
                        },
                      }));
                    }}
                    selectedValue={transactionData.payload.transactionClass}
                  >
                    <Picker.Item label="--- Select Type ---" value="" />
                    <Picker.Item label="Credit Transaction" value="CREDIT" />
                    <Picker.Item label="Debit Transaction" value="DEBIT" />
                  </Picker>
                </View>
              </View>

              <View style={styles.formGroup}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>Payment Method</Text>
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
                      setTransactionData((prevState) => ({
                        ...prevState,
                        payload: {
                          ...prevState.payload,
                          paymentMethod: itemValue,
                        },
                      }));
                    }}
                    selectedValue={transactionData.payload.paymentMethod}
                  >
                    <Picker.Item label="--- Select Method ---" value="" />
                    <Picker.Item label="Cash" value="CASH" />
                    <Picker.Item label="Card/Online" value="CARD" />
                    <Picker.Item label="USSD/Bank Transfer" value="USSD" />
                  </Picker>
                </View>
              </View>

              <View style={styles.formGroup}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>Amount</Text>
                </AppText>
                <TextInput style={{ ...styles.textInput, borderColor: "#266ddc" }} keyboardType="numeric" onChangeText={(text) => onValueChange("amount", text)} />
              </View>

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
                      setTransactionData((prevState) => ({
                        ...prevState,
                        payload: {
                          ...prevState.payload,
                          paymentCategory: itemValue,
                        },
                      }));
                    }}
                    selectedValue={transactionData.payload.paymentCategory}
                  >
                    <Picker.Item label="--- Select Category ---" value="" />
                    <Picker.Item label="Income/Wage/Salary" value="INCOME/WAGE/SALARY" />
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
                  <Text style={{ fontWeight: "700" }}>Description (optional)</Text>
                </AppText>
                <TextInput style={{ ...styles.textInput, borderColor: "#266ddc" }} onChangeText={(text) => onValueChange("note", text)} />
              </View>

              <View style={{ ...styles.formGroup, display: `${!displaySpinner ? "flex" : "none"}`, alignItems: "center" }}>
                <PrimaryButton onPress={() => submitData()}>
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

AddRecord.propTypes = {
  postTransaction: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 1000,
    marginTop: 8,
    backgroundColor: "#F0F0F8",
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
