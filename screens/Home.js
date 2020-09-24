import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import AppText from "../resources/AppText";
import { StyleSheet, Text, View, StatusBar, Button, TouchableOpacity, Alert, TouchableNativeFeedback } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { logout } from "../containers/authentication/action";
import { getUserTransaction } from "../containers/transactions/action";
import { updateNotificationToken } from "../containers/regvalidate/action";

export default function Home({ navigation }) {
  const userAuthentication = useSelector((state) => state.authentication.user);
  const currencySymbol = `${userAuthentication.country == "NIGERIA" ? "₦" : "K"}`;
  const [accountBalance, setAccountBalance] = useState("0.00");

  const dispatch = useDispatch();

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const userTransactions = useSelector((state) => state.transactions.usertransactions);
  const prevUserTransactions = usePrevious(userTransactions);

  const [expoPushToken, setExpoPushToken] = useState("");
  const prevExpoPushToken = usePrevious(expoPushToken);
  const [sendToken, setSendToken] = useState(false);

  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    /**NAVIGATIOON */
    navigation.addListener("didFocus", () => {
      dispatch(getUserTransaction(""));
    });
  }, [navigation]);

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
    /** GET USER ACCOUNT BALANCE */
    if (prevUserTransactions) {
      if (prevUserTransactions.length !== userTransactions.length) {
        if (userTransactions[userTransactions.length - 1]["status"] == "success") {
          //Update Account Balance
          setAccountBalance(userTransactions[userTransactions.length - 1]["data"].wallet_info.current_balance);
        }
      }
    } else {
      dispatch(getUserTransaction(""));
    }

    /** END GET USER ACCOUNT BALANCE */
  });

  const alertLogout = () => {
    Alert.alert(
      "Log out",
      "Do you want to logout?",
      [
        {
          text: "Cancel",
          onPress: () => {
            return null;
          },
        },
        {
          text: "Confirm",
          onPress: () => {
            dispatch(logout());
          },
        },
      ],
      { cancelable: false }
    );
  };

  const alertDeals = () => {
    Alert.alert("Deals & Offers", "Opps! There are no deals and offers at the moment. Enjoy, we will update you soon.", [
      {
        text: "Ok",
        onPress: () => {
          return null;
        },
      },
    ]);
  };
  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: "#266ddc", borderBottomLeftRadius: 15, borderBottomRightRadius: 15, paddingBottom: 30 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <AppText bold="true" styles={{ fontSize: 14, color: "#f2f2f2", marginTop: StatusBar.currentHeight + 10, marginHorizontal: 15 }}>
              Balance
            </AppText>
            <View style={{ flexDirection: "row", justifyContent: "flex-start", marginHorizontal: 15, alignItems: "center", width: "100%" }}>
              <MaterialIcons name="account-balance-wallet" size={24} color="#f2f2f2" />
              <AppText bold="true" styles={{ fontSize: 18, color: "#f2f2f2", marginLeft: 5 }}>
                {currencySymbol}
                {accountBalance}
              </AppText>
            </View>
          </View>
          <TouchableNativeFeedback onPress={() => alertLogout()}>
            <AntDesign name="logout" size={24} style={{ marginTop: StatusBar.currentHeight + 10, marginHorizontal: 15 }} color="#f2f2f2" />
          </TouchableNativeFeedback>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View style={styles.mainBoard}>
            <TouchableOpacity onPress={() => navigation.navigate("ScanPay")}>
              <View style={styles.activityButton}>
                <MaterialCommunityIcons name="qrcode-scan" size={20} color="#f2f2f2" />
                <AppText styles={styles.mainBoardIconText}>Scan</AppText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("DepositFund")}>
              <View style={styles.activityButton}>
                <AntDesign name="pluscircleo" size={20} color="#f2f2f2" />
                <AppText styles={styles.mainBoardIconText}>Deposit</AppText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Transfer")}>
              <View style={styles.activityButton}>
                <Feather name="send" size={20} color="#f2f2f2" />
                <AppText styles={styles.mainBoardIconText}>Send</AppText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("ReceiveFund")}>
              <View style={styles.activityButton}>
                <AntDesign name="download" size={20} color="#f2f2f2" />
                <AppText styles={styles.mainBoardIconText}>Receive</AppText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View style={styles.menuBoard}>
          <TouchableOpacity onPress={() => navigation.navigate("Airtime")}>
            <View style={styles.activityButtonIIContainer}>
              <View style={{ ...styles.activityButtonII, backgroundColor: "rgba(114, 191, 247, 0.3)" }}>
                <AntDesign name="wifi" size={24} color="black" />
              </View>
              <AppText styles={styles.activityButtonIIText}>Airtime & Data</AppText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Tv")}>
            <View style={styles.activityButtonIIContainer}>
              <View style={{ ...styles.activityButtonII, backgroundColor: "rgba(147, 254, 170, 0.3)" }}>
                <Feather name="tv" size={24} color="rgb(72, 140, 86)" />
              </View>
              <AppText styles={styles.activityButtonIIText}>Cable</AppText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Electricity")}>
            <View style={styles.activityButtonIIContainer}>
              <View style={{ ...styles.activityButtonII, backgroundColor: "rgba(240,230,140, 0.3)" }}>
                <Octicons name="zap" size={24} color="rgb(189,183,107)" />
              </View>
              <AppText styles={styles.activityButtonIIText}>Electricity</AppText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Marketplace")}>
            <View style={styles.activityButtonIIContainer}>
              <View style={{ ...styles.activityButtonII, backgroundColor: "rgba(189, 165, 116, 0.3)" }}>
                <SimpleLineIcons name="globe" size={24} color="rgb(132, 110, 66)" />
              </View>
              <AppText styles={styles.activityButtonIIText}>MarketPlace</AppText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => alertDeals()}>
            <View style={styles.activityButtonIIContainer}>
              <View style={{ ...styles.activityButtonII, backgroundColor: "rgba(252, 130, 130, 0.3)" }}>
                <Foundation name="ticket" size={24} color="rgb(196, 87, 87)" />
              </View>
              <AppText styles={styles.activityButtonIIText}>Offers</AppText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
            <View style={styles.activityButtonIIContainer}>
              <View style={{ ...styles.activityButtonII, backgroundColor: "rgba(189, 165, 116, 0.3)" }}>
                <AntDesign name="user" size={24} color="rgb(189,183,107)" />
              </View>
              <AppText styles={styles.activityButtonIIText}>My Account</AppText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Subscriptions")}>
            <View style={styles.activityButtonIIContainer}>
              <View style={{ ...styles.activityButtonII, backgroundColor: "rgba(114, 191, 247, 0.3)" }}>
                <AntDesign name="addfolder" size={24} color="black" />
              </View>
              <AppText styles={styles.activityButtonIIText}>Subscriptions</AppText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("FinanceVisualizer")}>
            <View style={styles.activityButtonIIContainer}>
              <View style={{ ...styles.activityButtonII, backgroundColor: "rgba(147, 254, 170, 0.3)" }}>
                <Entypo name="suitcase" size={24} color="rgb(72, 140, 86)" />
              </View>
              <AppText styles={styles.activityButtonIIText}>Manager</AppText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("UserTransactions")}>
            <View style={styles.activityButtonIIContainer}>
              <View style={{ ...styles.activityButtonII, backgroundColor: "rgba(252, 130, 130, 0.3)" }}>
                <MaterialIcons name="history" size={24} color="black" />
              </View>
              <AppText styles={styles.activityButtonIIText}>Transactions</AppText>
            </View>
          </TouchableOpacity>

          <View style={styles.activityButtonIIContainer}>
            <View style={{ ...styles.activityButtonII, backgroundColor: "rgba(114, 191, 247, 0.3)" }}>
              <Feather name="more-horizontal" size={24} color="black" />
            </View>
            <AppText styles={styles.activityButtonIIText}>More</AppText>
          </View>
        </View>
      </View>

      <AppText styles={{ marginTop: 10, marginHorizontal: 10, fontSize: 16 }}>Did you spend outside vetropay today? Keep track of your expenses</AppText>

      <View style={{ display: "flex", marginTop: 5, alignItems: "center", justifyContent: "center" }}>
        <View style={{ width: "80%" }}>
          <Button onPress={() => navigation.navigate("AddRecord")} title="Record Off-App Transaction"></Button>
        </View>
      </View>

      <AppText bold="true" styles={{ marginTop: 15, fontSize: 16, marginHorizontal: 10 }}>
        Deals {"&"} Offers
      </AppText>
      <StatusBar style="light" translucent={true} backgroundColor="#00000066" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  mainBoard: {
    flexWrap: "wrap",
    flexDirection: "row",
    marginTop: 25,
    justifyContent: "space-evenly",
    marginBottom: 2,
    width: "90%",
  },
  mainBoardIconText: {
    fontSize: 11,
    color: "#f2f2f2",
    textAlign: "center",
  },
  activityButton: {
    height: 50,
    width: 50,
    borderWidth: 0.5,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.3)",
    marginRight: 5,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },

  activityButtonII: {
    height: 50,
    width: 50,
    borderWidth: 0.5,
    backgroundColor: "#f2f2f2",
    borderColor: "#f2f2f2",
    marginRight: 5,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },

  menuBoard: {
    backgroundColor: "#ffffff",
    height: 180,
    width: "90%",
    marginTop: -30,
    borderRadius: 5,
    elevation: 3,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  activityButtonIIText: {
    fontSize: 10,
    color: "rgba(0,0,0,0.5)",
    fontWeight: "600",
    textAlign: "center",
  },
  activityButtonIIContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
