import React from "react";
import { Dimensions, View, Text, StyleSheet, Picker, TextInput } from "react-native";
import AppText from "../../resource/AppText";
import { PrimaryButton } from "../../resource/AppButton";

export default function LinkBank() {
  return (
    <View style={styles.container}>
      <View style={styles.upperBackGround}></View>

      <View style={styles.balanceUpBackGround}>
        <AppText bold="true" styles={{ fontSize: 18, textTransform: "uppercase", color: "#FFFFFF" }}>
          Withdrawal > Link your Bank
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
                <Picker style={{ height: 40 }}>
                  <Picker.Item label="--- Select Bank ---" value="" />
                  <Picker.Item label="Access Bank" value="NIGERIA" />
                  <Picker.Item label="Access Bank (Diamond)" value="KENYA" />
                </Picker>
              </View>
            </View>
            <View style={styles.formGroup}>
              <AppText>
                <Text style={{ fontWeight: "700" }}>Bank Account Number</Text>
              </AppText>
              <TextInput style={{ ...styles.textInput, borderColor: "#266ddc" }} placeholder="Enter NUBAN" />
            </View>

            <View style={styles.formGroup}>
              <AppText>
                <Text style={{ fontWeight: "700" }}>Customer Account Name</Text>
              </AppText>
              <TextInput style={{ ...styles.textInput, borderColor: "#266ddc", backgroundColor: "#F0F0F8" }} editable={false} />
            </View>

            <View style={{ ...styles.formGroup, alignItems: "center", flexDirection: "row", justifyContent: "space-evenly" }}>
              <PrimaryButton>
                <AppText bold="true" styles={{ color: "#fff", fontSize: 16 }}>
                  Validate
                </AppText>
              </PrimaryButton>
              <PrimaryButton disabled={true}>
                <AppText bold="true" styles={{ color: "#fff", fontSize: 16 }}>
                  Save
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
