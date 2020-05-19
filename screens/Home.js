import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View, Picker, FlatList } from "react-native";
import { Modal, TouchableOpacity } from "react-native";

import TransactionHistory from "../resource/TransactionHistory";
import AppText from "../resource/AppText";
import { AppButton, PrimaryButton, DangerButton } from "../resource/AppButton";

import { MaterialIcons, Ionicons, AntDesign } from "@expo/vector-icons";

function Separator() {
  return <View style={styles.separator} />;
}

export default function Home({ navigation }) {
  const transactionData = [
    { date: "12 Feb 2020", amount: "5,700", type: "Credit", key: "1" },
    { date: "12 Feb 2020", amount: "5,700", type: "Credit", key: "2" },
    { date: "11 Feb 2020", amount: "1,000", type: "Credit", key: "3" },
    { date: "10 Feb 2020", amount: "15,000", type: "Debit", key: "4" },
    { date: "10 Feb 2020", amount: "5,000", type: "Credit", key: "5" },
    { date: "10 Feb 2020", amount: "4,000", type: "Debit", key: "6" },
    { date: "10 Feb 2020", amount: "5,000", type: "Credit", key: "7" },
    { date: "9 Feb 2020", amount: "400", type: "Debit", key: "8" },
    { date: "9 Feb 2020", amount: "5,000", type: "Credit", key: "9" },
  ];

  const [modalOpen, setModalOpen] = useState(false);
  const [summaryActive, setSummaryActive] = useState(false);
  const [nonTransactionHeight, SetNonTransactionHeight] = useState(0);

  const layoutEvent = (event) => {
    SetNonTransactionHeight(event.nativeEvent.layout.height);
    //console.log("evented");
  };
  return (
    <View style={styles.container}>
      {/** Transaction Modal  */}
      <Modal visible={modalOpen} animationType="slide">
        <View style={styles.modalContent}>
          <MaterialIcons name="close" size={24} onPress={() => setModalOpen(false)} style={styles.modalClose} />
          <View style={styles.transactionDetails}>
            <View style={styles.uniqueTransactionDetails}>
              <AppText styles={styles.transactionDetailsText}>Transaction Date:</AppText>
              <AppText bold="true" styles={{ textTransform: "uppercase" }}>
                Feb 12, 2020
              </AppText>
            </View>
            <View style={styles.uniqueTransactionDetails}>
              <AppText styles={styles.transactionDetailsText}>Transaction Class:</AppText>
              <AppText
                bold="true"
                styles={{
                  paddingBottom: 2,
                  width: 87,
                  paddingBottom: 2,
                  textAlign: "center",
                  color: "#f2f2f2",
                  textTransform: "uppercase",
                  borderRadius: 10,
                  backgroundColor: "#219653",
                }}
              >
                Credit
              </AppText>
            </View>
            <View style={styles.uniqueTransactionDetails}>
              <AppText style={styles.transactionDetailsText}>Payment Method:</AppText>
              <AppText
                bold="true"
                styles={{
                  width: 87,
                  paddingBottom: 2,
                  textAlign: "center",
                  color: "#32363F",
                  textTransform: "uppercase",
                  borderRadius: 10,
                  backgroundColor: "#F2C94C",
                }}
              >
                Cash
              </AppText>
            </View>
            <View style={styles.uniqueTransactionDetails}>
              <AppText styles={styles.transactionDetailsText}>Amount:</AppText>
              <AppText bold="true">NGN 5,000.00</AppText>
            </View>
            <View style={styles.uniqueTransactionDetails}>
              <AppText styles={styles.transactionDetailsText}>Type:</AppText>
              <AppText bold="true">Sales</AppText>
            </View>
            <View style={styles.uniqueTransactionDetails}>
              <AppText style={styles.transactionDetailsText}>Note:</AppText>
              <AppText bold="true">Sold shoe to Kola</AppText>
            </View>

            <View style={styles.uniqueTransactionDetails}>
              <AppText styles={styles.transactionDetailsText}>Date of Entry:</AppText>
              <AppText bold="true">Feb 13, 2020</AppText>
            </View>
          </View>
          <View style={styles.modalActionButtons}>
            <PrimaryButton onPress={() => console.log("Home")}>
              <MaterialIcons color="#fff" name="edit" size={20} />
              <AppText bold="true" styles={{ color: "#fff", marginLeft: 2, fontSize: 16 }}>
                Edit
              </AppText>
            </PrimaryButton>
            <DangerButton onPress={() => console.log("Home")}>
              <Ionicons color="#fff" name="ios-trash" size={20} />
              <AppText bold="true" styles={{ color: "#fff", marginLeft: 5, fontSize: 16 }}>
                Delete
              </AppText>
            </DangerButton>
          </View>
          <Separator />
          {/*INSIGHTS */}
          <View style={styles.uniqueTransactionDetails}>
            <AppText bold="true">Insight</AppText>
          </View>
          {/**Enumerated Insights */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
            <AntDesign name="doubleright" size={14} />
            <AppText styles={{ fontSize: 14, marginLeft: 5 }}>
              <Text style={{ fontWeight: "bold" }}>This transaction contributed 50% of February 2020 income.</Text>
            </AppText>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
            <AntDesign name="doubleright" size={14} />
            <AppText styles={{ fontSize: 14, marginLeft: 5 }}>
              <Text style={{ fontWeight: "bold" }}>Transaction of type "Sales" contributed 90% of February 2020 income.</Text>
            </AppText>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
            <AntDesign name="doubleright" size={14} />
            <AppText styles={{ fontSize: 14, marginLeft: 5 }}>
              <Text style={{ fontWeight: "bold" }}>This transaction contributed 50% of February 2020 income.</Text>
            </AppText>
          </View>
        </View>
      </Modal>

      {/** End Transaction */}
      <View style={styles.upperBackGround}></View>

      <View style={styles.balanceUpBackGround}>
        <View style={{ flexDirection: "row" }}>
          <Picker mode="dropdown" style={{ height: 30, width: 130, backgroundColor: "#FFFFFF", marginTop: 8, borderRadius: 2, elevation: 5 }}>
            <Picker.Item label="FEB 2020" value="FEB2020" />
            <Picker.Item label="MAR 2020" value="MAR2020" />
          </Picker>
          <MaterialIcons name="arrow-drop-down" size={25} style={{ paddingVertical: 10 }} />
        </View>

        <View onLayout={layoutEvent} style={styles.vpCard}>
          <AppText bold="true" styles={{ paddingLeft: 10, paddingTop: 10, fontSize: 17, color: "#266ddc", textTransform: "uppercase" }}>
            Account Balance
          </AppText>
          {/**Account Balance */}
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
            <AppText bold="true" styles={{ textAlign: "center", fontSize: 25, marginRight: 10 }}>
              NGN 56,235.00
            </AppText>
            <MaterialIcons name="add-circle" color="#219653" size={35} />
          </View>
          {/** End Account Balance */}
          <View style={{ paddingLeft: 10 }}>
            <TouchableOpacity
              onPress={() => {
                setSummaryActive(!summaryActive);
              }}
            >
              <Ionicons color="#266DDC" name="md-arrow-dropdown-circle" size={30}></Ionicons>
            </TouchableOpacity>
            {/**Credit and Debit Summary */}
            <View style={{ display: `${summaryActive ? "flex" : "none"}` }}>
              <AppText styles={{ marginTop: 5, color: "rgba(50, 54, 63, 0.8)" }}> Summary</AppText>
              <View style={{ width: "95%" }}>
                <Separator />
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <AppText bold="true" styles={{ fontSize: 17, color: "green", marginBottom: 8, textTransform: "uppercase" }}>
                  CR - NGN 30,500.00
                </AppText>
                <AppText bold="true" styles={{ fontSize: 17, color: "red", marginBottom: 8, textTransform: "uppercase" }}>
                  DR - NGN 45,300.00
                </AppText>
              </View>
            </View>
            {/** End Credit and Debit Summary */}
          </View>
        </View>
        <AppButton
          styles={{ width: "100%", backgroundColor: "#266ddc", height: 40, borderRadius: 4, justifyContent: "center", alignItems: "center" }}
          onPress={() => navigation.navigate("AddRecord")}
        >
          <AppText bold="true" styles={{ color: "#ffffff", textTransform: "uppercase" }}>
            Record off-App Transaction
          </AppText>
        </AppButton>
        {/**Transaction History */}
        <Separator />
        <AppText bold="true" styles={styles.headerText}>
          Transaction History
        </AppText>

        <View style={{ height: Dimensions.get("window").height - nonTransactionHeight - 30 - 40 - 180 }}>
          {/** 30 == "Picker Height" && 40 == "Record Off-app button" && 180 == "miscellaneous margin + padding, text etc."  */}
          <FlatList
            data={transactionData}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setModalOpen(true)}>
                <TransactionHistory date={item.date} amount={item.amount} type={item.type} />
              </TouchableOpacity>
            )}
          />
        </View>
        {/** End Transaction History */}
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
  vpCard: {
    marginTop: 24,
    marginBottom: 10,
    borderRadius: 7,
    elevation: 4,
    backgroundColor: "#FFFFFF",
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth + 0.4,
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
  transactionDetails: {
    marginTop: 16,
    borderRadius: 4,
    paddingHorizontal: 10,
    elevation: 4,
    backgroundColor: "#FFFFFF",
  },
  uniqueTransactionDetails: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalActionButtons: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
