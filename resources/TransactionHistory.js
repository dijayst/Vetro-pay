import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AppText from "./AppText";

export default function TransactionHistory({ onPress, date, amount, type }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.transactionCard}>
      <View style={{ paddingLeft: 8 }}>
        <AppText>
          Date: <Text style={{ fontWeight: "700" }}>{date}</Text>
        </AppText>
        <MaterialIcons style={{ marginTop: 4 }} color="#266ddc" name="expand-more" size={20}></MaterialIcons>
      </View>
      <View style={{ paddingRight: 8 }}>
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
    </TouchableOpacity>
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
    alignItems: "center",
    borderRadius: 4,
    elevation: 4,
    height: 65,
  },
});
