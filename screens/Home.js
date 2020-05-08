import React, { useState } from "react";
import { StyleSheet, Text, View, Picker, Button, ScrollView } from "react-native";
import { Modal, TouchableOpacity } from "react-native";
import TransactionHistory from "../resource/TransactionHistory";
import { MaterialIcons } from "@expo/vector-icons";
import { PrimaryButton, DangerButton } from "../resource/Button";

function Separator() {
  return <View style={styles.separator} />;
}

export default function Home({ navigation }) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <View style={styles.container}>
      {/** Transaction Modal  */}
      <Modal visible={modalOpen} animationType="slide">
        <View style={styles.modalContent}>
          <MaterialIcons name="close" size={24} onPress={() => setModalOpen(false)} style={styles.modalClose} />
          <View style={styles.transactionDetails}>
            <View style={styles.uniqueTransactionDetails}>
              <Text style={styles.transactionDetailsText}>Transaction date:</Text>
              <Text style={{ fontWeight: "700" }}>Feb 12, 2020</Text>
            </View>
            <View style={styles.uniqueTransactionDetails}>
              <Text style={styles.transactionDetailsText}>Transaction class:</Text>
              <Text style={{ fontWeight: "700", paddingLeft: 15, paddingRight: 15, color: "#f2f2f2", textTransform: "uppercase", borderRadius: 15, backgroundColor: "green" }}>
                Credit
              </Text>
            </View>
            <View style={styles.uniqueTransactionDetails}>
              <Text style={styles.transactionDetailsText}>Payment method:</Text>
              <Text style={{ fontWeight: "700", paddingLeft: 20, paddingRight: 20, color: "black", textTransform: "uppercase", borderRadius: 15, backgroundColor: "yellow" }}>
                Cash
              </Text>
            </View>
            <View style={styles.uniqueTransactionDetails}>
              <Text style={styles.transactionDetailsText}>Amount:</Text>
              <Text style={{ fontWeight: "700" }}>5,000.00</Text>
            </View>
            <View style={styles.uniqueTransactionDetails}>
              <Text style={styles.transactionDetailsText}>Type:</Text>
              <Text style={{ fontWeight: "700" }}>Sales</Text>
            </View>
            <View style={styles.uniqueTransactionDetails}>
              <Text style={styles.transactionDetailsText}>Note:</Text>
              <Text style={{ fontWeight: "700" }}>Sold shoe to Kola</Text>
            </View>

            <View style={styles.uniqueTransactionDetails}>
              <Text style={styles.transactionDetailsText}>Date of Entry:</Text>
              <Text style={{ fontWeight: "700" }}>Feb 13, 2020</Text>
            </View>
          </View>
          <View style={styles.modalActionButtons}>
            <PrimaryButton text="Link" onPress={() => console.log("Home")} />
            <DangerButton text="Delete" onPress={() => console.log("Home")} />
          </View>
          <Separator />
          {/*INSIGHTS */}
          <View style={styles.uniqueTransactionDetails}>
            <Text style={{ fontWeight: "700" }}>Insight</Text>
          </View>
          <Text>>> This transaction contributed 50% of February 2020 income.</Text>
          <Text>>> Transaction of type "Sales" contributed 90% of February 2020 income.</Text>
          {/*LINKED TRANSACTIONS */}
          <View style={styles.uniqueTransactionDetails}>
            <Text style={{ fontWeight: "700" }}>Linked transactions</Text>
          </View>
        </View>
      </Modal>

      {/** End Transaction */}

      <Text style={styles.headerText}>Journal Breakdown</Text>
      <Picker style={{ height: 50, width: 150 }}>
        <Picker.Item label="FEB 2020" value="FEB2020" />
        <Picker.Item label="MAR 2020" value="MAR2020" />
      </Picker>
      <View style={styles.vpCard}>
        <Text style={{ paddingLeft: 10, paddingTop: 10, fontSize: 17, color: "red", fontWeight: "700", textTransform: "uppercase" }}>Expenses</Text>
        <Text style={{ textAlign: "center", fontSize: 25 }}>₦ 56,235.00</Text>
      </View>
      <View style={styles.vpCard}>
        <Text style={{ paddingLeft: 10, paddingTop: 10, fontSize: 17, color: "green", fontWeight: "700", textTransform: "uppercase" }}>Income</Text>
        <Text style={{ textAlign: "center", fontSize: 25 }}>₦ 60,000.00</Text>
      </View>
      <Button title="Add Record" color="#266ddc" onPress={() => navigation.navigate("AddRecord")} />
      <Separator />
      <Text style={styles.headerText}>Transaction History</Text>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <TouchableOpacity onPress={() => setModalOpen(true)}>
          <TransactionHistory date="Feb 12, 2020" amount="5000" type="Income" creditDebit="credit" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 10
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#266ddc"
  },
  vpCard: {
    marginTop: 10,
    marginBottom: 10,
    height: 100,
    borderRadius: 7,
    elevation: 4
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  modalClose: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
    elevation: 4
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 10
  },
  transactionDetails: {
    marginTop: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    elevation: 4
  },
  uniqueTransactionDetails: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  modalActionButtons: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around"
  }
});
