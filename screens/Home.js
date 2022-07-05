import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import AppText from "../resources/AppText";
import { StyleSheet, Image, Text, View, StatusBar, FlatList, Button, TouchableOpacity, Alert, TouchableNativeFeedback, Pressable } from "react-native";
import { MaterialCommunityIcons, AntDesign, Feather, Octicons, SimpleLineIcons, FontAwesome, Foundation, Fontisto, MaterialIcons, Entypo } from "@expo/vector-icons";
import { logout } from "../containers/authentication/action";
import { getUserTransaction } from "../containers/transactions/action";
import { updateNotificationToken } from "../containers/regvalidate/action";
import NairaLog from "../assets/naira.png";
import { Asset, useAssets } from "expo-asset";
// import SavingsHomeImage from "../assets/savingsHome2.png";
// import SavingsImage2 from "../assets/Savings-bro.png";
// import SavingsImage3 from "../assets/Savings-cuate.png";
// import SavingsImage4 from "../assets/Savings-amico.png";
// import SavingsImage5 from "../assets/Savings-pana.png";
// import SavingsImage6 from "../assets/Savings-rafiki.png";

export default function Home({ navigation }) {
  const userAuthentication = useSelector((state) => state.authentication.user);
  const currencySymbol = `${userAuthentication.country == "NIGERIA" ? "₦" : "K"}`;
  const [accountBalance, setAccountBalance] = useState("0.00");
  const [savingsImagePosition, setSavingsImagePosition] = useState(Math.floor(Math.random() * 6));
  const [SAVINGS_IMAGE_ARRAY, setSavingsImage] = useAssets([
    require("../assets/savingsHome2.png"),
    require("../assets/Savings-bro.png"),
    require("../assets/Savings-cuate.png"),
    require("../assets/Savings-amico.png"),
    require("../assets/Savings-pana.png"),
    require("../assets/Savings-rafiki.png"),
  ]);

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

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

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

  const menusItem = [
    {
      name: "Airtime & Data",
      action: () => navigation.navigate("Airtime"),
      content: () => {
        return (
          <View style={styles.activityButtonIIContainer}>
            <View style={{ ...styles.activityButtonII, backgroundColor: "rgba(114, 191, 247, 0.3)" }}>
              <AntDesign name="wifi" size={24} color="black" />
            </View>
            <AppText bold styles={styles.activityButtonIIText}>
              Airtime {"&"} Data
            </AppText>
          </View>
        );
      },
    },

    {
      name: "Cable",
      action: () => navigation.navigate("Tv"),
      content: () => {
        return (
          <View style={styles.activityButtonIIContainer}>
            <View style={{ ...styles.activityButtonII, backgroundColor: "rgba(147, 254, 170, 0.3)" }}>
              <Feather name="tv" size={24} color="rgb(72, 140, 86)" />
            </View>
            <AppText bold styles={styles.activityButtonIIText}>
              Cable
            </AppText>
          </View>
        );
      },
    },

    {
      name: "Electricity",
      action: () => navigation.navigate("Electricity"),
      content: () => {
        return (
          <View style={styles.activityButtonIIContainer}>
            <View style={{ ...styles.activityButtonII, backgroundColor: "rgba(240,230,140, 0.3)" }}>
              <Octicons name="zap" size={24} color="rgb(189,183,107)" />
            </View>
            <AppText bold styles={styles.activityButtonIIText}>
              Electricity
            </AppText>
          </View>
        );
      },
    },
    {
      name: "Offers",
      action: () => navigation.navigate("Marketplace"),
      content: () => {
        return (
          <View style={styles.activityButtonIIContainer}>
            <View style={{ ...styles.activityButtonII, backgroundColor: "rgba(252, 130, 130, 0.3)" }}>
              {/* <Foundation name="ticket" size={24} color="rgb(196, 87, 87)" /> */}
              <FontAwesome name="bank" size={24} color="rgb(196, 87, 87)" />
            </View>
            <AppText bold styles={styles.activityButtonIIText}>
              Merchants
            </AppText>
          </View>
        );
      },
    },

    {
      name: "Get Loans",
      action: () => navigation.navigate("CreditHome"),
      content: () => {
        return (
          <View style={styles.activityButtonIIContainer}>
            <View style={{ ...styles.activityButtonII, backgroundColor: "rgba(114, 191, 247, 0.3)" }}>
              <Image source={NairaLog} style={{ width: 24, height: 24, resizeMode: "contain" }} />
            </View>
            <AppText bold styles={styles.activityButtonIIText}>
              Credit {"&"} Loans
            </AppText>
          </View>
        );
      },
    },

    {
      name: "Manager",
      action: () => navigation.navigate("FinanceVisualizer"),
      content: () => {
        return (
          <View style={styles.activityButtonIIContainer}>
            <View style={{ ...styles.activityButtonII, backgroundColor: "rgba(147, 254, 170, 0.3)" }}>
              <Entypo name="suitcase" size={24} color="rgb(72, 140, 86)" />
            </View>
            <AppText bold styles={styles.activityButtonIIText}>
              Manager
            </AppText>
          </View>
        );
      },
    },

    {
      name: "Subscriptions",
      action: () => navigation.navigate("Subscriptions"),
      content: () => {
        return (
          <View style={styles.activityButtonIIContainer}>
            <View style={{ ...styles.activityButtonII, backgroundColor: "rgba(114, 191, 247, 0.3)" }}>
              <AntDesign name="addfolder" size={24} color="black" />
            </View>
            <AppText bold styles={styles.activityButtonIIText}>
              Subscriptions
            </AppText>
          </View>
        );
      },
    },

    {
      name: "Transactions",
      action: () => navigation.navigate("UserTransactions"),
      content: () => {
        return (
          <View style={styles.activityButtonIIContainer}>
            <View style={{ ...styles.activityButtonII, backgroundColor: "rgba(252, 130, 130, 0.3)" }}>
              <MaterialIcons name="history" size={24} color="black" />
            </View>
            <AppText bold styles={styles.activityButtonIIText}>
              Transactions
            </AppText>
          </View>
        );
      },
    },
  ];
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
          <FlatList
            horizontal={false}
            numColumns={4}
            data={menusItem}
            renderItem={({ item }) => <TouchableOpacity onPress={() => item.action()}>{item.content()}</TouchableOpacity>}
            keyExtractor={(item, index) => index}
            contentContainerStyle={{ alignItems: "center", justifyContent: "space-around", width: "100%" }}
          />
        </View>
      </View>

      {/* <AppText styles={{ marginTop: 20, marginHorizontal: 10, fontSize: 16, textAlign: "center" }}> • • •</AppText> */}
      <View style={{ flexDirection: "row", marginTop: 30, marginHorizontal: 10 }}>
        <MaterialIcons name="graphic-eq" size={24} color="red" />
        <AppText bold="true" styles={{ fontSize: 16 }}>
          Earn Interest on your savings every month
        </AppText>
      </View>

      {SAVINGS_IMAGE_ARRAY && <Image source={SAVINGS_IMAGE_ARRAY[savingsImagePosition]} style={{ width: 170, marginTop: 10, height: 170, alignSelf: "center" }} />}

      <View style={{ display: "flex", marginTop: 10, alignItems: "center", justifyContent: "center" }}>
        <View style={{ width: "80%" }}>
          <Pressable style={{ width: "100%", backgroundColor: "#266ddc", padding: 10, alignItems: "center", borderRadius: 5 }} onPress={() => navigation.navigate("Savings")}>
            <AppText styles={{ color: "#FFFFFF" }} bold>
              Grow your savings
            </AppText>
          </Pressable>
        </View>
      </View>

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
    height: 55,
    width: 55,
    borderWidth: 0.5,
    backgroundColor: "#f2f2f2",
    borderColor: "#f2f2f2",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },

  menuBoard: {
    backgroundColor: "#ffffff",
    height: 190,
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
    paddingHorizontal: 3,
    width: 85,
  },
});
