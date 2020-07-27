import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

import { Dimensions, StyleSheet, Text, View, Picker, FlatList } from "react-native";
import { Modal, TouchableOpacity } from "react-native";

import TransactionHistory from "../resource/TransactionHistory";
import AppText from "../resource/AppText";
import { AppButton, PrimaryButton, DangerButton } from "../resource/AppButton";

import { MaterialIcons, Ionicons, AntDesign } from "@expo/vector-icons";

import { getSysPeriod, getUserTransaction } from "../containers/transactions/action";
import { updateNotificationToken } from "../containers/regvalidate/action";

import { Spinner } from "native-base";
//import { convertUTCDateToLocalDate } from "../resource/MetaFunctions";

function Separator() {
  return <View style={styles.separator} />;
}

export default function Home({ navigation }) {
  const userAuthentication = useSelector((state) => state.authentication.user);
  const currency = `${userAuthentication.country == "NIGERIA" ? "NGN" : "KES"}`;
  const currencySymbol = `${userAuthentication.country == "NIGERIA" ? "₦" : "K"}`;
  const [userDepositBank, setUserDepositBank] = useState({ bankName: "", accountNumber: "", accountName: "" });
  const [systemPeriod, setSystemPeriod] = useState([]);
  const [userSelectSystemPeriod, setUserSelectSystemPeriod] = useState("");
  const [accountBalance, setAccountBalance] = useState("0.00");
  const [accountBalanceIntroStatement, setAccountBalanceIntroStatement] = useState("Account Balance"); //Account Balance or Closing Balance
  const [accountCR, setAccountCR] = useState("0.00");
  const [accountDR, setAccountDR] = useState("0.00");
  const [transactionsLoaded, setTransactionsLoaded] = useState(false);
  const [transactionData, setTransactionData] = useState([]);
  const [modalFundOpen, setModalFundOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ transaction_insight: "Loading..." });
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

  const userSystemPeriod = useSelector((state) => state.transactions.userperiod);
  const userTransactions = useSelector((state) => state.transactions.usertransactions);
  const prevUserTransactions = usePrevious(userTransactions);

  const [expoPushToken, setExpoPushToken] = useState("");
  const prevExpoPushToken = usePrevious(expoPushToken);
  const [sendToken, setSendToken] = useState(false);

  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      let token;
      if (Constants.isDevice) {
        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          alert("Failed to get push token for push notification!");
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        setExpoPushToken(token);
      } else {
        alert("Must use physical device for Push Notifications");
      }
    })();

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      //console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (prevExpoPushToken !== expoPushToken) {
      if (expoPushToken !== "" && !sendToken) {
        dispatch(updateNotificationToken(expoPushToken));
        setSendToken(true);
      }
    }
  }, [expoPushToken]);

  useEffect(() => {
    /**NAVIGATIOON */
    navigation.addListener("didFocus", () => {
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

          // Update Nigerian Customers Deposit Bank
          setUserDepositBank({
            bankName: userTransactions[userTransactions.length - 1]["data"]["deposit_bank"].bank_name,
            accountNumber: userTransactions[userTransactions.length - 1]["data"]["deposit_bank"].account_number,
            accountName: userTransactions[userTransactions.length - 1]["data"]["deposit_bank"].account_name,
          });

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

  return (
    <View style={styles.container}>
      {/** Add Funds Bank Modal */}
      <Modal transparent visible={modalFundOpen} animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
          <View style={{ ...styles.modalFundContent, borderColor: "#266ddc", borderWidth: 2 }}>
            {/** Modal Header */}
            <View style={{ marginTop: 16, flexDirection: "row", justifyContent: "flex-end" }}>
              <MaterialIcons
                color="grey"
                name="close"
                size={24}
                onPress={() => {
                  setModalFundOpen(false);
                }}
                style={{ paddingRight: 10 }}
              />
            </View>
            {/** End Modal Header */}

            <View style={{ marginTop: 16 }}>
              <AppText bold="true" styles={{ textAlign: "center", fontSize: 18 }}>
                How to fund your Vetropay Account
              </AppText>

              <AppText styles={{ marginTop: 10 }}>
                <Text style={{ fontWeight: "700" }}>1. Mobile/Internet Banking</Text>
              </AppText>
              <AppText styles={{ paddingHorizontal: 10, marginTop: 5 }}>(a). Log in to your Bank's mobile application/internet banking service.</AppText>
              <AppText styles={{ paddingHorizontal: 10, marginTop: 5 }}>(b). Make a fund transfer to the Bank Account details below:</AppText>
              <AppText bold="true" styles={{ textAlign: "center" }}>
                Bank Name: <Text style={{ color: "#266ddc" }}>{userDepositBank.bankName}</Text>
              </AppText>
              <AppText bold="true" styles={{ textAlign: "center" }}>
                Account Number: <Text style={{ color: "#266ddc" }}>{userDepositBank.accountNumber}</Text>
              </AppText>
              <AppText bold="true" styles={{ textAlign: "center" }}>
                Account Name: <Text style={{ color: "#266ddc" }}>{userDepositBank.accountName}</Text>
              </AppText>

              <AppText bold="true" styles={{ textAlign: "center" }}>
                Your Ref: <Text style={{ color: "#266ddc" }}>0{userAuthentication.phone_number.substring(4)}</Text>
              </AppText>

              <AppText styles={{ paddingHorizontal: 10, marginTop: 5 }}>
                (c). Ensure you add "{`0${userAuthentication.phone_number.substring(4)}`}" as your reference/narration.
              </AppText>

              <AppText styles={{ paddingHorizontal: 10, marginTop: 5 }}>(d). Your VetroPay account will be credited within 0 - 5 minutes. Cheers!</AppText>
            </View>
          </View>
        </View>
      </Modal>

      {/** End Add Funds Bank Modal */}

      {/** Transaction Modal  */}
      <Modal visible={modalOpen} animationType="slide">
        <View style={styles.modalContent}>
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
          {modalData.transaction_insight.split("Nnn").map((info, index) => {
            return (
              <View key={index} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                <AntDesign name="doubleright" size={14} />
                <AppText styles={{ fontSize: 14, marginLeft: 5 }}>
                  <Text style={{ fontWeight: "bold" }}>{info}</Text>
                </AppText>
              </View>
            );
          })}
        </View>
      </Modal>

      {/** End Transaction */}
      <View style={styles.upperBackGround}></View>

      <View style={styles.balanceUpBackGround}>
        <View style={{ flexDirection: "row" }}>
          <Picker
            mode="dropdown"
            style={{ height: 30, width: 130, backgroundColor: "#FFFFFF", marginTop: 8, borderRadius: 2, elevation: 5 }}
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
          <MaterialIcons name="arrow-drop-down" size={25} style={{ paddingVertical: 10 }} />
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
            <TouchableOpacity onPress={() => setModalFundOpen(true)}>
              <MaterialIcons name="add-circle" color="#219653" size={35} />
            </TouchableOpacity>
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
                <TouchableOpacity
                  onPress={() => {
                    setModalOpen(true);
                    setModalData(item);
                  }}
                >
                  <TransactionHistory date={item.transaction_date} amount={item.amount} type={item.transaction_type} />
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={{ marginTop: 40 }}>
              <AppText styles={{ textAlign: "center" }}>Loading transactions...</AppText>
              <Spinner color="blue" />
            </View>
          )}
        </View>
        {/** End Transaction History */}
      </View>
    </View>
  );
}

Home.propTypes = {
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
