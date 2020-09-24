import React from "react";
import { useSelector } from "react-redux";
import { View, Text, StyleSheet } from "react-native";
import AppText from "../../resources/AppText";
import { Linking } from "expo";

function Separator() {
  return <View style={styles.separator} />;
}

export default function Kyc() {
  const userAuthentication = useSelector((state) => state.authentication.user);

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 16, paddingHorizontal: 10 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 10 }}>
          <AppText bold="true">KYC status</AppText>
          <AppText
            bold="true"
            styles={{
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
            {userAuthentication.kyc_verified}
          </AppText>
        </View>
        <Separator />

        {/** Note */}
        <View style={{ marginTop: 10 }}>
          <AppText styles={{ fontSize: 16 }}>
            To update/verify your KYC - Know Your Customer status; Please send an Email ("with the verified email address on your vetropay account") to{" "}
            <Text style={{ fontWeight: "700" }}>customercare@vetropay.com</Text>{" "}
          </AppText>

          <AppText styles={{ fontSize: 16, marginTop: 10 }}>
            Email Subject: <Text style={{ fontWeight: "700" }}>VetroPay KYC: {userAuthentication.fullname}</Text>
          </AppText>
          <AppText styles={{ fontSize: 16, marginTop: 10 }}>Email body should contain the following:</AppText>
          <AppText bold="true" styles={{ marginLeft: 10 }}>
            {">>>"} Country of Domicile
          </AppText>
          <AppText bold="true" styles={{ marginLeft: 10 }}>
            {">>>"} Full Name
          </AppText>
          <AppText bold="true" styles={{ marginLeft: 10 }}>
            {">>>"} If you are Nigerian; Bank Verification Number
          </AppText>
          <AppText bold="true" styles={{ marginLeft: 10 }}>
            {">>>"} An attachment of a current and valid ID card e.g National ID card, International Passport, Voter's Card, Driving License, Student ID card.
          </AppText>
        </View>

        {/** End Note */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    marginVertical: 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
