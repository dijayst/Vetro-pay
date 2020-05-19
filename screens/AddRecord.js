import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Dimensions, View, Text, StyleSheet, TextInput, Picker } from "react-native";
import AppText from "../resource/AppText";
import { AppButton, PrimaryButton } from "../resource/AppButton";
import { AntDesign } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function AddRecord() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

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
                  <AppText>
                    <AntDesign name="calendar" color="#266ddc" size={16} />
                    <Text style={{ color: "#266ddc", fontWeight: "700", textTransform: "uppercase" }}> Select Transaction Date</Text>
                  </AppText>
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
                  <Picker style={{ height: 40 }}>
                    <Picker.Item label="--- Select Type ---" value="" />
                    <Picker.Item label="Credit Transaction" value="credit" />
                    <Picker.Item label="Debit Transaction" value="debit" />
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
                  <Picker style={{ height: 40 }}>
                    <Picker.Item label="--- Select Method ---" value="" />
                    <Picker.Item label="Cash" value="cash" />
                    <Picker.Item label="Card/Online" value="card" />
                    <Picker.Item label="USSD/Bank Transfer" value="bank" />
                  </Picker>
                </View>
              </View>

              <View style={styles.formGroup}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>Amount</Text>
                </AppText>
                <TextInput style={styles.textInput} />
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
                  <Picker style={{ height: 40 }}>
                    <Picker.Item label="--- Select Category ---" value="" />
                    <Picker.Item label="Gift/Shopping" value="gift" />
                    <Picker.Item label="School Fees" value="schoolFees" />
                    <Picker.Item label="Airtime/Internet/Cable Bill" value="aic" />
                    <Picker.Item label="Electricity/Water/Gas/Fuel" value="aic" />
                    <Picker.Item label="Transport/Food" value="aic" />
                    <Picker.Item label="Business/Official" value="aic" />
                    <Picker.Item label="Donations/Tithes/Offerings" value="aic" />
                    <Picker.Item label="Personal/Others" value="aic" />
                  </Picker>
                </View>
              </View>

              <View style={styles.formGroup}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>Description (optional)</Text>
                </AppText>
                <TextInput style={styles.textInput} />
              </View>

              <View style={{ ...styles.formGroup, alignItems: "center" }}>
                <PrimaryButton>
                  <AppText bold="true" styles={{ color: "#fff", fontSize: 16 }}>
                    Save
                  </AppText>
                </PrimaryButton>
              </View>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

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
    borderColor: "#266ddc",
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
