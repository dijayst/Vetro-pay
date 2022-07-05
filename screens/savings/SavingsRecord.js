import { View, Text, StyleSheet } from "react-native";
import React from "react";
import AppText from "../../resources/AppText";
import { FontAwesome5 } from "@expo/vector-icons";

export default function SavingsRecord() {
  return (
    <View>
      <View style={{ justifyContent: "center", alignItems: "center", marginTop: 15 }}>
        <View style={{ flexDirection: "row", width: "100%", justifyContent: "center" }}>
          <AppText bold styles={{ fontSize: 18, marginLeft: 10 }}>
            My House Rent
          </AppText>
          <View style={{ alignSelf: "flex-end", flexDirection: "row" }}>
            <AppText bold styles={{ fontSize: 13 }}></AppText>
            <FontAwesome5 name="running" size={20} color="#fb9129" style={{ marginLeft: 10 }} />
          </View>
        </View>

        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
          <View style={{ width: "49%", height: 120, backgroundColor: "#FFFFFF", borderRadius: 15, padding: 10 }}>
            <AppText bold styles={{ color: "grey" }}>
              Target Amount
            </AppText>
            <AppText bold styles={{ marginTop: 10, fontSize: 20 }}>
              ₦850,000
            </AppText>
            <AppText styles={{ marginTop: 20, color: "grey" }}>Duration: 10 Months</AppText>
          </View>
          <View style={{ width: "49%", height: 120, backgroundColor: "#032940", borderRadius: 15, padding: 10 }}>
            <AppText bold styles={{ color: "grey" }}>
              Amount Saved
            </AppText>
            <AppText bold styles={{ marginTop: 10, color: "#FFFFFF", fontSize: 20 }}>
              ₦85,000
            </AppText>
            <AppText bold styles={{ marginTop: 20, color: "#90ee90" }}>
              Earnings: +₦8,500
            </AppText>
          </View>
        </View>
      </View>

      {/** SAVINGS TRANSACTION HISTORY */}
      <AppText bold styles={{ marginTop: 30, fontSize: 18 }}>
        Transaction History
      </AppText>

      <View style={styles.savingsHistory}>
        <View>
          <AppText>Date: 13 Jun 2022 09:22</AppText>
          <AppText>PIR: 10%</AppText>
        </View>

        <View>
          <View style={{}}>
            <AppText bold styles={{ color: "grey" }}>
              Interest
            </AppText>
            <AppText bold styles={{ fontSize: 15, color: "green" }}>
              + ₦8,500
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.savingsHistory}>
        <View>
          <AppText>Date: 13 Jun 2022 09:21</AppText>
        </View>

        <View>
          <View style={{}}>
            <AppText bold styles={{ color: "grey" }}>
              Deposit
            </AppText>
            <AppText styles={{ fontSize: 15 }}>₦85,000</AppText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  savingsHistory: {
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    height: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 4,
  },
});
