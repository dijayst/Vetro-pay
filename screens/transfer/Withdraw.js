import React from "react";
import { Dimensions, View, Text, StyleSheet, Picker, TextInput } from "react-native";
import AppText from "../../resource/AppText";
import { PrimaryButton } from "../../resource/AppButton";

export default function Withdraw({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.upperBackGround}></View>

      <View style={styles.balanceUpBackGround}>
        <AppText bold="true" styles={{ fontSize: 18, textTransform: "uppercase", color: "#FFFFFF" }}>
          Withdraw to Bank
        </AppText>

        <View style={styles.recordForm}>
          <View style={{ marginTop: 8, paddingLeft: 4, paddingRight: 4 }}>
            <AppText bold="true">
              <Text style={{ color: "red" }}>
                You do not have a National bank account linked to your vetropay digital wallet.{" "}
                <Text style={{ color: "#266ddc", textTransform: "uppercase" }} onPress={() => navigation.navigate("LinkBank")}>
                  Click here
                </Text>{" "}
                to update your bank details.
              </Text>
            </AppText>
            <View style={styles.formGroup}>
              <AppText>
                <Text style={{ fontWeight: "700" }}>Amount (NGN)</Text>
              </AppText>
              <TextInput style={{ ...styles.textInput, borderColor: "#266ddc" }} placeholder="Enter Amount" />
            </View>

            <View style={styles.formGroup}>
              <AppText>
                <Text style={{ fontWeight: "700" }}>Transaction Charge</Text>
              </AppText>
              <TextInput style={{ ...styles.textInput, borderColor: "#266ddc", backgroundColor: "#F0F0F8" }} defaultValue="NGN 0.00" editable={false} />
            </View>

            <View style={{ ...styles.formGroup, alignItems: "center" }}>
              <PrimaryButton disabled={true}>
                <AppText bold="true" styles={{ color: "#fff", fontSize: 16 }}>
                  Withdraw
                </AppText>
              </PrimaryButton>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
    backgroundColor: "#F0F0F8",
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
