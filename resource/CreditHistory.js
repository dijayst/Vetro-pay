import React from "react";
import { useSelector } from "react-redux";
import { View, Text, StyleSheet } from "react-native";
import AppText from "./AppText";

export default function CreditHistory({ creditDetails }) {
  const userAuthentication = useSelector((state) => state.authentication.user);

  return (
    <View style={styles.transactionCard}>
      <View style={{ paddingLeft: 8, paddingTop: 8 }}>
        <AppText>
          Credit ID: <Text style={{ fontWeight: "700" }}>{creditDetails.creditID}</Text>
        </AppText>
        <AppText styles={{ marginTop: 4 }}>
          Start date:{" "}
          <Text
            style={{
              fontWeight: "700",
            }}
          >
            {creditDetails.startDate}
          </Text>
        </AppText>
        <AppText styles={{ marginTop: 4 }}>
          Due date:{" "}
          <Text
            style={{
              fontWeight: "700",
            }}
          >
            {creditDetails.dueDate}
          </Text>
        </AppText>
      </View>
      <View style={{ paddingRight: 8, paddingTop: 8 }}>
        <AppText>
          <Text
            style={{
              fontWeight: "700",
              color: "green",
            }}
          >
            {creditDetails.approval}
          </Text>
        </AppText>
        <AppText styles={{ marginTop: 4 }}>
          Amount:{" "}
          <Text
            style={{
              fontWeight: "700",
            }}
          >
            {userAuthentication.country == "NIGERIA" ? "NGN" : "KES"} {creditDetails.amount}
          </Text>
        </AppText>
        <AppText styles={{ marginTop: 4 }}>
          Status:{" "}
          <Text
            style={{
              fontWeight: "700",
              color: "#ffaf40",
            }}
          >
            {creditDetails.creditStatus}
          </Text>
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  transactionCard: {
    backgroundColor: "#FFFFFF",
    marginTop: 8,
    paddingBottom: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 4,
    elevation: 7,
  },
});
