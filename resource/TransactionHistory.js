import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TransactionHistory({ date, amount, type, creditDebit }) {
  return (
    <View style={styles.transactionCard}>
      <View style={{ padding: 10 }}>
        <Text>
          Date: <Text style={{ fontWeight: "700" }}>{date}</Text>
        </Text>
        <Ionicons color={creditDebit == "credit" ? "green" : "red"} name={creditDebit == "credit" ? "md-arrow-dropdown-circle" : "md-arrow-dropup-circle"} size={20}></Ionicons>
      </View>
      <View style={{ padding: 10 }}>
        <Text>
          Amount: <Text style={{ fontWeight: "700" }}>{amount}</Text>
        </Text>
        <Text>Type: {type}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  transactionCard: {
    marginTop: 10,
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 55,
    borderRadius: 7,
    elevation: 4
  }
});
