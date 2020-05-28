import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "./AppText";

export default function TransactionHistory({ date, amount, type }) {
  return (
    <View style={styles.transactionCard}>
      <View style={{ paddingLeft: 8, paddingTop: 8 }}>
        <AppText>
          Date: <Text style={{ fontWeight: "700" }}>{date}</Text>
        </AppText>
        <Ionicons style={{ marginTop: 4 }} color="#266ddc" name="md-arrow-dropdown-circle" size={20}></Ionicons>
      </View>
      <View style={{ paddingRight: 8, paddingTop: 8 }}>
        <AppText>
          Amount:{" "}
          <Text
            style={{
              fontWeight: "700",
              color: `${type == "CREATED" ? "grey" : `${type == "CREDIT" ? "green" : "red"}`}`,
            }}
          >
            {amount}
          </Text>
        </AppText>
        <AppText styles={{ marginTop: 4 }}>
          Type:{" "}
          <Text
            style={{
              fontWeight: "700",
              color: `${type == "CREATED" ? "grey" : `${type == "CREDIT" ? "green" : "red"}`}`,
            }}
          >
            {type}
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
    marginBottom: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 4,
    elevation: 4,
  },
});
