import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import SavingsImage2 from "../../assets/Savings-bro.png";
import CuriousImage from "../../assets/Curious-rafiki.png";
import ThinkingImage from "../../assets/Thinking-face-bro.png";
import AppText from "../../resources/AppText";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import moment from "moment";
import { numberWithCommas } from "../../resources/utils";
import { AntDesign, Octicons } from "@expo/vector-icons";

const VETROPAY_SAVINGS_INTEREST_RATE = [0, 1.3, 1.3, 1.5, 2, 3, 3.5, 5, 7, 8.5, 10, 10, 10];

export default function NewSavingsPlan() {
  const [savingsFormStage, setSavingsFormStage] = useState(0);
  const [savingsType, setSavingsType] = useState("");
  const [savingsTitle, setSavingsTitle] = useState("");
  const [savingsAmount, setSavingsAmount] = useState("");
  const [refinedSavingsAmount, setRefinedSavingsAmount] = useState("");
  const [savingsDuration, setSavingsDuration] = useState(3);

  const showInterestRate = () => {
    setSavingsAmount(Number(savingsAmount.replace(/,/g, "")));
    if (savingsType == "MONTHLY") {
      setRefinedSavingsAmount(Number(savingsAmount.replace(/,/g, "")) * savingsDuration);
    } else {
      setRefinedSavingsAmount(savingsAmount);
    }
    setSavingsFormStage(2);
  };

  const setUserSavingsTypeFunction = (type) => {
    setSavingsType(type);
    setSavingsFormStage(1);
  };

  const calulateInterestAmount = (deposit, duration) => {
    let calc = Number(deposit) * (VETROPAY_SAVINGS_INTEREST_RATE[Number(duration - 1)] / 100);
    calc = calc.toFixed(2);
    return numberWithCommas(calc);
  };

  const savingsFormRender = () => {
    switch (savingsFormStage) {
      case 0:
        return (
          <View style={{ paddingHorizontal: 10 }}>
            <Image source={ThinkingImage} style={{ width: 150, height: 150, alignSelf: "center", marginTop: 20 }} />
            <AppText bold styles={{ fontSize: 20 }}>
              Hii Olamigoke,
            </AppText>
            <AppText>Select Savings type</AppText>

            {/**  */}
            <TouchableOpacity
              style={{ width: "100%", height: 45, backgroundColor: "#266ddc", padding: 10, marginVertical: 30, alignItems: "center", borderRadius: 5 }}
              onPress={() => setUserSavingsTypeFunction("MONTHLY")}
            >
              <AppText styles={{ color: "#FFFFFF" }} bold>
                Monthly/Target savings
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ width: "100%", height: 45, backgroundColor: "#266ddc", padding: 10, alignItems: "center", borderRadius: 5 }}
              onPress={() => setUserSavingsTypeFunction("FIXED")}
            >
              <AppText styles={{ color: "#FFFFFF" }} bold>
                Fixed/One Off Deposit
              </AppText>
            </TouchableOpacity>

            <View style={{ marginTop: 100 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Octicons name="zap" size={20} color="red" style={{ marginRight: 5 }} />
                <AppText bold styles={styles.didYouKnowText}>
                  Earn up to 10% interest on your deposit Today.
                </AppText>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Octicons name="zap" size={20} color="red" style={{ marginRight: 5 }} />
                <AppText bold styles={styles.didYouKnowText}>
                  Savings ROI are paid upfront.
                </AppText>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Octicons name="zap" size={20} color="red" style={{ marginRight: 5 }} />
                <AppText bold styles={styles.didYouKnowText}>
                  Deposits are automatically paid to your account after tenure.
                </AppText>
              </View>
            </View>
          </View>
        );
      case 1:
        return (
          <View style={{ paddingHorizontal: 10 }}>
            <Image source={SavingsImage2} style={{ width: 150, height: 150, alignSelf: "center", marginTop: 20 }} />
            <AppText bold styles={{ fontSize: 20 }}>
              Hii Olamigoke,
            </AppText>
            <AppText>Tell us more about your Savings plan</AppText>

            {/**  */}
            <View style={{ marginTop: 30 }}></View>
            <View style={styles.formGroup}>
              <AppText bold styles={styles.formLabel}>
                Brief Description/Title
              </AppText>
              <TextInput
                style={{ ...styles.textInput, borderColor: "#266ddc" }}
                placeholder="e.g House Rent, Eunice, Baby essentials etc."
                onChangeText={(text) => setSavingsTitle(text)}
              />
            </View>

            <View style={styles.formGroup}>
              <AppText bold styles={styles.formLabel}>
                {savingsType == "MONTHLY" ? "Mothly Savings" : "Fixed Deposit"}
              </AppText>
              <TextInput
                style={{ ...styles.textInput, borderColor: "#266ddc" }}
                value={savingsAmount}
                keyboardType="number-pad"
                placeholder={savingsType == "MONTHLY" ? "How much do you intend to save per month?" : "Amount"}
                onChangeText={(text) => {
                  text = Number(`${text}`.replace(/,/g, ""));
                  if (text < 1) {
                    setSavingsAmount("");
                  } else {
                    setSavingsAmount(text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                  }
                }}
              />
            </View>

            <View style={styles.formGroup}>
              <AppText bold styles={styles.formLabel}>
                Duration (<AppText styles={{ fontSize: 13 }}>Drag to change duration</AppText>)
              </AppText>
              <Slider
                style={{ width: "100%", height: 45 }}
                minimumValue={1}
                value={savingsDuration}
                step={1}
                maximumValue={12}
                minimumTrackTintColor="#266ddc"
                maximumTrackTintColor="#000000"
                thumbTintColor="#fb9129"
                onValueChange={(value) => setSavingsDuration(value)}
              />

              <AppText bold styles={{ alignSelf: "center" }}>
                {savingsDuration} {savingsDuration > 1 ? "Months" : "Month"}
              </AppText>
            </View>

            <TouchableOpacity
              style={{ width: "100%", height: 45, backgroundColor: "#266ddc", padding: 10, marginTop: 30, alignItems: "center", borderRadius: 5 }}
              onPress={() => showInterestRate(1)}
            >
              <AppText styles={{ color: "#FFFFFF" }} bold>
                Get Started
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: "100%",
                backgroundColor: "transparent",
                borderColor: "red",
                borderWidth: 1,
                padding: 10,
                marginTop: 15,
                marginBottom: 30,
                alignItems: "center",
                borderRadius: 5,
                flexDirection: "row",
                justifyContent: "center",
              }}
              onPress={() => setSavingsFormStage(savingsFormStage - 1)}
            >
              <AntDesign name="arrowleft" size={24} color="black" style={{ marginRight: 10 }} />
              <AppText bold>Go Back</AppText>
            </TouchableOpacity>
          </View>
        );

      case 2:
        return (
          <View style={{ paddingHorizontal: 10 }}>
            <Image source={CuriousImage} style={{ width: 150, height: 150, alignSelf: "center", marginTop: 20 }} />
            <View style={styles.savingsBreakdown}>
              <AppText>Savings Title:</AppText>
              <AppText>My House Rent</AppText>
            </View>
            <View style={styles.savingsBreakdown}>
              <AppText>Savings Type:</AppText>
              <AppText>{savingsType}</AppText>
            </View>
            <View style={styles.savingsBreakdown}>
              <AppText>Target Amount:</AppText>
              <AppText>{numberWithCommas(refinedSavingsAmount)}</AppText>
            </View>
            <View style={styles.savingsBreakdown}>
              <AppText>Duration:</AppText>
              <AppText>{savingsDuration} Month</AppText>
            </View>
            <View style={styles.savingsBreakdown}>
              <AppText>Earnings/Breakdown:</AppText>
              <AppText></AppText>
            </View>

            {/** Breakdown */}
            <View style={{ marginTop: 20 }}>
              <View style={{ flexDirection: "row" }}>
                <AppText bold styles={styles.breakdownCell}>
                  Date
                </AppText>
                <AppText bold styles={styles.breakdownCell}>
                  Deposit
                </AppText>
                <AppText bold styles={styles.breakdownCell}>
                  Interest
                </AppText>
              </View>

              {savingsType == "MONTHLY" &&
                Array.apply(null, { length: savingsDuration }).map((data, index) => {
                  return (
                    <View style={{ flexDirection: "row" }}>
                      <AppText bold styles={styles.breakdownCell}>
                        {moment(new Date()).add(index, "months").format("MMM, YYYY")}
                      </AppText>
                      <AppText bold styles={styles.breakdownCell}>
                        ₦{numberWithCommas(Number(refinedSavingsAmount / savingsDuration).toFixed(2))}
                      </AppText>
                      <AppText bold styles={styles.breakdownCell}>
                        ₦{calulateInterestAmount(Number(refinedSavingsAmount / savingsDuration).toFixed(2), VETROPAY_SAVINGS_INTEREST_RATE[savingsDuration - index])} (
                        {VETROPAY_SAVINGS_INTEREST_RATE[savingsDuration - index]}%)
                      </AppText>
                    </View>
                  );
                })}

              {savingsType == "FIXED" && (
                <View style={{ flexDirection: "row" }}>
                  <AppText bold styles={styles.breakdownCell}>
                    {moment(new Date()).format("MMM, YYYY")}
                  </AppText>
                  <AppText bold styles={styles.breakdownCell}>
                    ₦{numberWithCommas(refinedSavingsAmount)}
                  </AppText>
                  <AppText bold styles={styles.breakdownCell}>
                    ₦{calulateInterestAmount(refinedSavingsAmount, savingsDuration)} ({VETROPAY_SAVINGS_INTEREST_RATE[savingsDuration]}%)
                  </AppText>
                </View>
              )}
            </View>

            <TouchableOpacity style={{ width: "100%", height: 45, backgroundColor: "#266ddc", padding: 10, marginTop: 30, alignItems: "center", borderRadius: 5 }}>
              <AppText styles={{ color: "#FFFFFF" }} bold>
                Save Now
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: "100%",
                backgroundColor: "transparent",
                borderColor: "red",
                borderWidth: 1,
                padding: 10,
                marginTop: 15,
                marginBottom: 30,
                alignItems: "center",
                borderRadius: 5,
                flexDirection: "row",
                justifyContent: "center",
              }}
              onPress={() => setSavingsFormStage(savingsFormStage - 1)}
            >
              <AntDesign name="arrowleft" size={24} color="black" style={{ marginRight: 10 }} />
              <AppText bold>Go Back</AppText>
            </TouchableOpacity>
          </View>
        );
    }
  };
  return (
    <KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={10} enableOnAndroid={true} extraHeight={Platform.select({ android: 150 })} style={{ flexGrow: 1 }}>
      <View style={styles.container}>{savingsFormRender()}</View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
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
  formLabel: {
    fontSize: 16,
  },
  savingsBreakdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  breakdownCell: {
    width: "33.3%",
    height: 50,
    padding: 5,
    borderWidth: 1,
    borderColor: "grey",
    color: "black",
  },

  didYouKnowText: {
    fontSize: 15,
    marginBottom: 4,
    color: "grey",
    width: "95%",
  },
});
