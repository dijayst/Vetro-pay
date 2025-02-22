import React, { useState, useEffect, useRef, createRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import AppText from "../../resources/AppText";
import { AppButton, PrimaryButton, DangerButton } from "../../resources/AppButton";
import { Dimensions, StyleSheet, Text, View, FlatList, ScrollView, Pressable } from "react-native";
import { Modal, TouchableOpacity } from "react-native";
import { MaterialIcons, Ionicons, AntDesign } from "@expo/vector-icons";
import TransactionHistory from "../../resources/TransactionHistory";
import { getSysPeriod, getUserTransaction } from "../../containers/transactions/action";
import { Spinner } from "native-base";
import { Picker } from "@react-native-picker/picker";
//import { convertUTCDateToLocalDate } from "../resource/MetaFunctions";
import moment from "moment";
import * as WebBrowser from "expo-web-browser";

function Separator() {
  return <View style={styles.separator} />;
}

export default function UserTransactions({ navigation }) {
  const userAuthentication = useSelector((state) => state.authentication.user);
  const currency = `${userAuthentication.country == "NIGERIA" ? "NGN" : "KES"}`;
  const currencySymbol = `${userAuthentication.country == "NIGERIA" ? "₦" : "K"}`;
  const [systemPeriod, setSystemPeriod] = useState([]);
  const [userSelectSystemPeriod, setUserSelectSystemPeriod] = useState("");
  const [accountBalance, setAccountBalance] = useState("0.00");
  const [accountBalanceIntroStatement, setAccountBalanceIntroStatement] = useState("Account Balance"); //Account Balance or Closing Balance
  const [accountCR, setAccountCR] = useState("0.00");
  const [accountDR, setAccountDR] = useState("0.00");
  const [transactionsLoaded, setTransactionsLoaded] = useState(false);
  const [transactionData, setTransactionData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ transaction_insight: [] });
  const [summaryActive, setSummaryActive] = useState(false);
  const [nonTransactionHeight, SetNonTransactionHeight] = useState(0);

  const dispatch = useDispatch();

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  let pickerRef = useRef();

  const userSystemPeriod = useSelector((state) => state.transactions.userperiod);
  const userTransactions = useSelector((state) => state.transactions.usertransactions);
  const prevUserTransactions = usePrevious(userTransactions);

  useEffect(() => {
    /**NAVIGATIOON */
    navigation.addListener("focus", () => {
      dispatch(getUserTransaction(""));
    });
  }, [navigation]);

  useEffect(() => {
    /** SYSTEM PERIOD */
    if (userSystemPeriod.length == 0) {
      dispatch(getSysPeriod());
    } else {
      if (userSystemPeriod.status == "success") {
        setSystemPeriod(userSystemPeriod.data);
      }
    }

    /** GET USER TRANSACTION */
    if (prevUserTransactions) {
      if (prevUserTransactions.length !== userTransactions.length) {
        if (userTransactions[userTransactions.length - 1]["status"] == "success") {
          //Update Account Balance
          setAccountBalance(userTransactions[userTransactions.length - 1]["data"].wallet_info.current_balance);
          setAccountBalanceIntroStatement("Account Balance");

          //If User-period is Closed or Not-running
          if (userTransactions[userTransactions.length - 1]["data"]["sysperiod"].period_running == false) {
            setAccountBalanceIntroStatement("Closing Balance");

            //Update Account Balance to Specific Month Closing Balance
            setAccountBalance(userTransactions[userTransactions.length - 1]["data"]["sysperiod"].wallet_closing_balance);
          }

          //Update Credit Transactions
          setAccountCR(userTransactions[userTransactions.length - 1]["data"].wallet_info.deposits_n_receives);

          // Update Debit Transactions
          setAccountDR(userTransactions[userTransactions.length - 1]["data"].wallet_info.transfers_n_withdrawals);

          // Update Transaction Records
          setTransactionData(userTransactions[userTransactions.length - 1]["data"].transactions);
          setTransactionsLoaded(true);
        }
      }
    } else {
      dispatch(getUserTransaction(""));
    }

    /** END GET USER TRANSACTION */
  });

  const userSystemPeriodUpdate = (value) => {
    setTransactionsLoaded(false);
    setAccountBalance("0.00");
    setAccountCR("0.00");
    setAccountDR("0.00");
    dispatch(getUserTransaction(value));
  };

  const layoutEvent = (event) => {
    SetNonTransactionHeight(event.nativeEvent.layout.height);
    //console.log("evented");
  };

  const _extensiveTransactionDetailsViewHandler = async (url) => {
    await WebBrowser.openBrowserAsync(url);
  };
  return (
    <View style={styles.container}>
      {/** Transaction Modal  */}
      <Modal visible={modalOpen} animationType="slide">
        <View style={styles.modalContent}>
          <ScrollView>
            <MaterialIcons name="close" size={24} onPress={() => setModalOpen(false)} style={styles.modalClose} />
            <View style={styles.transactionDetails}>
              <View style={styles.uniqueTransactionDetails}>
                <AppText styles={styles.transactionDetailsText}>Transaction Date:</AppText>
                <AppText bold="true" styles={{ textTransform: "uppercase" }}>
                  {modalData.transaction_date}
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
                    backgroundColor: `${modalData.transaction_type == "CREATED" ? "#696969" : `${modalData.transaction_type == "CREDIT" ? "#219653" : "red"}`}`,
                  }}
                >
                  {modalData.transaction_type}
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
                  {modalData.payment_method}
                </AppText>
              </View>
              <View style={styles.uniqueTransactionDetails}>
                <AppText styles={styles.transactionDetailsText}>Amount:</AppText>
                <AppText bold="true">
                  {currency} {modalData.amount}
                </AppText>
              </View>
              <View style={styles.uniqueTransactionDetails}>
                <AppText styles={styles.transactionDetailsText}>Category:</AppText>
                <AppText bold="true">{modalData.transaction_category}</AppText>
              </View>
              <View style={styles.uniqueTransactionDetails}>
                <AppText style={styles.transactionDetailsText}>Note:</AppText>
                <AppText bold="true">{modalData.note}</AppText>
              </View>

              <View style={styles.uniqueTransactionDetails}>
                <AppText styles={styles.transactionDetailsText}>Date of Entry:</AppText>
                <AppText bold="true">
                  {new Date(modalData.datetime_of_entry).toDateString()} {new Date(modalData.datetime_of_entry).toLocaleTimeString()}
                </AppText>
              </View>
            </View>
            <View style={styles.modalActionButtons}>
              <PrimaryButton disabled={!modalData.editable} onPress={() => console.log("Home")}>
                <MaterialIcons color="#fff" name="edit" size={20} />
                <AppText bold="true" styles={{ color: "#fff", marginLeft: 2, fontSize: 16 }}>
                  Edit
                </AppText>
              </PrimaryButton>
              <DangerButton disabled={!modalData.editable} onPress={() => console.log("Home")}>
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
            {modalData.transaction_insight.map((info, index) => {
              return (
                <View key={index} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                  <AntDesign name="doubleright" size={14} />
                  <AppText styles={{ fontSize: 14, marginLeft: 5 }}>
                    <Text style={{ fontWeight: "bold" }}>{info}</Text>
                  </AppText>
                </View>
              );
            })}

            {/** Add Verify Button */}
            {modalData.paid_merchant && modalData.transaction_insight[0]?.includes("Smart Web") && (
              <AppButton
                onPress={() => {
                  _extensiveTransactionDetailsViewHandler(
                    `https://vetropay.com/marketplace/transaction/${modalData.transaction_insight[3].split(": ")[1].replace(/\s/g, "")}/${modalData.transaction_insight
                      .reverse()[0]
                      .split(": ")[1]
                      .replace(/\s/g, "")}`
                  );
                }}
                styles={{ backgroundColor: "#266ddc", padding: 12, justifyContent: "center", alignItems: "center", marginTop: 10, marginBottom: 10 }}
              >
                <AppText bold="true" styles={{ textTransform: "uppercase", fontSize: 15, color: "#ffffff" }}>
                  Verify/Print Receipt
                </AppText>
              </AppButton>
            )}
          </ScrollView>
        </View>
      </Modal>

      <View style={styles.upperBackGround}></View>

      <View style={styles.balanceUpBackGround}>
        <View>
          <Picker
            ref={pickerRef}
            mode="dialog"
            style={{ height: 30, opacity: 0, width: 130, backgroundColor: "#FFFFFF", marginTop: 8, borderRadius: 2, elevation: 5 }}
            onValueChange={(itemValue, itemIndex) => {
              setUserSelectSystemPeriod(itemValue);
              userSystemPeriodUpdate(itemValue);
            }}
            selectedValue={userSelectSystemPeriod}
          >
            {systemPeriod.length > 0
              ? systemPeriod.map((data, index) => {
                  return <Picker.Item key={index} label={`${data.readable_date}`.toUpperCase()} value={data.raw_date} />;
                })
              : () => {
                  return <Picker.Item label="Loading..." value="" />;
                }}
          </Picker>
          <Pressable
            onPress={() => {
              //pickerRef.current.wrappedInstance.focus();
              pickerRef.current.focus();
            }}
            style={{
              position: "absolute",
              backgroundColor: "rgba(228,228,237, 1)",
              right: 0,
              top: 16,
              height: 30,
              width: 130,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AppText brandgrey small medium>
              {moment(userSelectSystemPeriod || new Date()).format("MMM, YYYY")}
            </AppText>
            <MaterialIcons name="arrow-drop-down" size={20} color="black" />
          </Pressable>
        </View>

        <View onLayout={layoutEvent} style={styles.vpCard}>
          <AppText bold="true" styles={{ paddingLeft: 10, paddingTop: 10, fontSize: 17, color: "#266ddc", textTransform: "uppercase" }}>
            {accountBalanceIntroStatement}
          </AppText>
          {/**Account Balance */}
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
            <AppText bold="true" styles={{ textAlign: "center", fontSize: 25, marginRight: 10 }}>
              {currency} {accountBalance}
            </AppText>
            <TouchableOpacity onPress={() => navigation.navigate("DepositFund")}>
              <MaterialIcons name="add-circle" color="#219653" size={35} />
            </TouchableOpacity>
          </View>
          {/** End Account Balance */}
          <View style={{ paddingLeft: 10 }}>
            <TouchableOpacity
              onPress={() => {
                setSummaryActive(!summaryActive);
              }}
              style={{ paddingVertical: 5 }}
            >
              <AntDesign color="#266DDC" name="circledown" size={25}></AntDesign>
            </TouchableOpacity>
            {/**Credit and Debit Summary */}
            <View style={{ display: `${summaryActive ? "flex" : "none"}` }}>
              <AppText styles={{ marginTop: 5, color: "rgba(50, 54, 63, 0.8)" }}> Summary</AppText>
              <View style={{ width: "95%" }}>
                <Separator />
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <AppText bold="true" styles={{ fontSize: 17, color: "green", marginBottom: 8, textTransform: "uppercase" }}>
                  CR - {currencySymbol} {accountCR}
                </AppText>
                <AppText bold="true" styles={{ fontSize: 17, color: "red", marginBottom: 8, textTransform: "uppercase" }}>
                  DR - {currencySymbol} {accountDR}
                </AppText>
              </View>
            </View>
            {/** End Credit and Debit Summary */}
          </View>
        </View>

        {/**Transaction History */}
        <Separator />
        <AppText bold="true" styles={styles.headerText}>
          Transaction History
        </AppText>

        <View
          style={{
            marginTop: 16,
            height: 40,
            borderWidth: 0.5,
            borderColor: "rgba(50, 54, 63, 0.4)",
            borderRadius: 2,
            justifyContent: "center",
            alignItems: "center",
            display: `${transactionsLoaded ? `${transactionData.length == 0 ? "flex" : "none"}` : "none"}`,
          }}
        >
          <AppText styles={{ color: "rgba(50, 54, 63, 0.4)" }}>{transactionsLoaded ? `${transactionData.length == 0 ? "No available transaction this month." : ""}` : ""}</AppText>
        </View>

        <View style={{ height: Dimensions.get("window").height - nonTransactionHeight - 30 - 40 - 180 }}>
          {/** 30 == "Picker Height" && 40 == "Record Off-app button" && 180 == "miscellaneous margin + padding, text etc."  */}

          {transactionsLoaded ? (
            <FlatList
              data={transactionData}
              keyExtractor={(item, index) => String(item.id)}
              renderItem={({ item }) => (
                <TransactionHistory
                  onPress={() => {
                    setModalData(item);
                    setModalOpen(true);
                  }}
                  date={item.transaction_date}
                  amount={item.amount}
                  type={item.transaction_type}
                />
              )}
            />
          ) : (
            <View style={{ marginTop: 40 }}>
              <AppText styles={{ textAlign: "center" }}>Loading transactions...</AppText>
              <Spinner color="blue.700" size="lg" />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

UserTransactions.propTypes = {
  getSysPeriod: PropTypes.func,
  getUserTransaction: PropTypes.func,
};

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

  modalFundContent: {
    flex: 1,
    marginTop: 80,
    borderRadius: 5,
    marginBottom: 100,
    marginLeft: 20,
    marginRight: 20,
    paddingHorizontal: 10,
    backgroundColor: "#F0F0F8",
  },
});
