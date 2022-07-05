import { View, Text, StyleSheet, Pressable, Modal, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import AppText from "../../resources/AppText";
import { FontAwesome5, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import SavingsRecord from "./SavingsRecord";

export default function Savings({ navigation }) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <View style={styles.container}>
      {/** Transaction Modal  */}
      <Modal visible={modalOpen} animationType="slide">
        <View style={styles.modalContent}>
          <ScrollView>
            <MaterialIcons name="close" size={24} onPress={() => setModalOpen(false)} style={styles.modalClose} />
            <SavingsRecord />
          </ScrollView>
        </View>
      </Modal>
      <View style={{ paddingHorizontal: 10 }}>
        <View style={styles.savingsBalanceContainer}>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 30, color: "white", fontWeight: "bold" }}>₦17,560.00</Text>
          </View>

          {/**Savings Amount */}
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <AppText bold styles={{ fontSize: 16, color: "white" }}>
              <Text style={{ color: "#90ee90" }}>+ ₦800.00</Text> Earnings this month.
            </AppText>
          </View>
        </View>

        <View style={{ display: "flex", flexDirection: "row", marginTop: 10, alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ width: "49%" }}>
            <TouchableOpacity
              style={{ width: "100%", backgroundColor: "#266ddc", padding: 10, alignItems: "center", borderRadius: 5 }}
              onPress={() => navigation.navigate("NewSavingsPlan")}
            >
              <FontAwesome5 name="piggy-bank" size={24} color="#FFFFFF" />
              <AppText styles={{ color: "#FFFFFF" }} bold>
                New savings plan
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={{ width: "49%" }}>
            <Pressable style={{ opacity: 0.5, width: "100%", backgroundColor: "#266ddc", padding: 10, alignItems: "center", borderRadius: 5 }}>
              <FontAwesome name="group" size={24} color="#FFFFFF" />
              <AppText styles={{ color: "#FFFFFF" }} bold>
                Group savings
              </AppText>
            </Pressable>
          </View>
        </View>

        {/** Savings History */}

        <AppText bold styles={{ marginTop: 35, fontSize: 18 }}>
          Savings History
        </AppText>

        <TouchableOpacity style={styles.savingsHistory} onPress={() => setModalOpen(true)}>
          <View>
            <AppText bold styles={{ color: "#266ddc" }}>
              My House Rent
            </AppText>
            <AppText styles={{ fontSize: 15 }}>₦45,000/₦260,000</AppText>
          </View>

          <View>
            <View style={{ flexDirection: "row" }}>
              <AppText>Running</AppText>
              <FontAwesome5 name="running" size={20} color="#fb9129" style={{ marginLeft: 10 }} />
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.savingsHistory}>
          <View>
            <AppText bold styles={{ color: "#266ddc" }}>
              Backup Cash
            </AppText>
            <AppText styles={{ fontSize: 15 }}>₦850,000/₦850,000</AppText>
          </View>

          <View>
            <View style={{ flexDirection: "row" }}>
              <AppText>Completed</AppText>
              <MaterialIcons name="check-circle" size={20} color="#198754" style={{ marginLeft: 10 }} />
            </View>
          </View>
        </View>

        <View style={styles.savingsHistory}>
          <View>
            <AppText bold styles={{ color: "#266ddc" }}>
              First Savings
            </AppText>
            <AppText styles={{ fontSize: 15 }}>₦15,000/₦500,000</AppText>
          </View>

          <View>
            <View style={{ flexDirection: "row" }}>
              <AppText>Early Withdrawal</AppText>
              <MaterialIcons name="cancel" size={20} color="#dc3545" style={{ marginLeft: 10 }} />
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
    backgroundColor: "#f2f2f2",
  },
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
  savingsBalanceContainer: {
    backgroundColor: "#032940",
    //backgroundColor: "#414141",
    height: 120,
    width: "100%",
    marginTop: 15,
    borderRadius: 15,
    padding: 10,
    justifyContent: "center",
  },

  modalClose: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    padding: 10,
    borderRadius: 4,
    alignSelf: "center",
    elevation: 4,
    backgroundColor: "#FFFFFF",
  },

  modalContent: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#F0F0F8",
  },
});
