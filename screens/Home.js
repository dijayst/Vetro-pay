import React, { useState, useEffect, useRef, useMemo, useCallback, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import AppText from "../resources/AppText";
import { StyleSheet, Image, Text, View, StatusBar, FlatList, Button, TouchableOpacity, Alert, Dimensions, Pressable, Platform } from "react-native";
import { MaterialCommunityIcons, AntDesign, Feather, Octicons, SimpleLineIcons, FontAwesome, Foundation, Fontisto, MaterialIcons, Entypo } from "@expo/vector-icons";
import { getUserTransaction } from "../containers/transactions/action";
import { updateNotificationToken } from "../containers/regvalidate/action";
import NairaLog from "../assets/naira.png";
import { Asset, useAssets } from "expo-asset";
import { numberWithCommas } from "../resources/utils";
import BottomSheet, { BottomSheetModalProvider, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { getTrxTransactions, getUsdTransactions, getUsdtTransactions } from "../containers/blockchain/action";
import UsdtHome from "./Usdt";
import TronHome from "./Tron";
import UsdHome from "./Usd";
import { SafeAreaView } from "../resources/rStyledComponent";

const SUPPORTED_CURRENCIES = [
  {
    fullname: "Nigerian Naira",
    code: "NGN",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Flag_of_Nigeria.svg/1280px-Flag_of_Nigeria.svg.png",
  },
  {
    fullname: "United States Dollar",
    code: "USD",
    icon: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/255px-Flag_of_the_United_States.svg.png",
  },
  {
    fullname: "Tether",
    code: "USDT",
    icon: "https://res.cloudinary.com/ancla8techs4/image/upload/v1662498409/vetropay/png-transparent-tether-hd-logo-removebg-preview_k0sstw.png",
  },
  {
    fullname: "Tron",
    code: "TRX",
    icon: "https://res.cloudinary.com/ancla8techs4/image/upload/v1662498547/vetropay/62837c68ab0e763d5f77e9a6_z7wfzs.png",
  },
  {
    fullname: "Bitcoin",
    code: "BTC",
    icon: "https://res.cloudinary.com/ancla8techs4/image/upload/v1671729820/vetropay/bitcoin-btc-logo_swmjng.png",
  },
];
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
  const prevUserTransactions = usePrevious(userTransactions); // <--- Review the importortance if no useEffect promting a major service is required
  const [selectedCurrency, setSelectedCurrency] = useState(SUPPORTED_CURRENCIES[0]);
  const [expoPushToken, setExpoPushToken] = useState("");
  const prevExpoPushToken = usePrevious(expoPushToken);
  const [sendToken, setSendToken] = useState(false);
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["1%", "55%"], []);

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

  const renderBackdrop = useCallback((props) => <BottomSheetBackdrop {...props} />, []);
  const handleSheetChanges = useCallback((index) => {}, []);

  const handleSheetCloseRequest = (data) => {
    if (!userAuthentication.email || userAuthentication.kyc_verified != "VERIFIED") {
      bottomSheetRef.current.close();
      Alert.alert(
        "🚨 KYC Verification required",
        `Ensure your email & KYC verification is complete.`,
        [
          {
            text: "Go to Settings",
            onPress: () => {
              navigation.navigate("Settings");
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      if (data.code == "USDT") {
        dispatch(getUsdtTransactions());
      } else if (data.code == "TRX") {
        dispatch(getTrxTransactions());
      } else if (data.code == "USD") {
        dispatch(getUsdTransactions());
      }
      setSelectedCurrency(data);
      bottomSheetRef.current.close();
    }
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
    <BottomSheetModalProvider style={styles.container}>
      {Platform.OS !== "android" && <SafeAreaView />}
      {selectedCurrency.code == "NGN" && (
        <Fragment>
          <View style={{ backgroundColor: "#266ddc", borderBottomLeftRadius: 15, borderBottomRightRadius: 15, paddingBottom: 30 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 15 }}>
              <View>
                <AppText bold="true" styles={{ fontSize: 14, color: "#f2f2f2", marginTop: StatusBar.currentHeight + 10 }}>
                  Balance
                </AppText>
                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
                  <MaterialIcons name="account-balance-wallet" size={24} color="#f2f2f2" />
                  <AppText bold="true" styles={{ fontSize: 18, color: "#f2f2f2", marginLeft: 5 }}>
                    {currencySymbol}
                    {numberWithCommas(accountBalance)}
                  </AppText>
                </View>
              </View>
              {/* <TouchableNativeFeedback onPress={() => alertLogout()}>
            <AntDesign name="logout" size={24} style={{ marginTop: StatusBar.currentHeight + 10, marginHorizontal: 15 }} color="#f2f2f2" />
          </TouchableNativeFeedback> */}
              <TouchableOpacity
                style={{
                  backgroundColor: "#FFFFFF",
                  marginTop: StatusBar.currentHeight + 10,
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  borderRadius: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => bottomSheetRef.current?.expand()}
              >
                <Image source={{ uri: selectedCurrency.icon }} style={{ width: 30, height: 30, resizeMode: "contain" }} />
                <AppText styles={{ marginHorizontal: 5 }}>{selectedCurrency.code}</AppText>
                <AntDesign name="down" size={15} color="black" style={{ alignSelf: "flex-end", marginBottom: 5 }} />
              </TouchableOpacity>
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
              <Pressable
                style={{ width: "100%", backgroundColor: "#266ddc", padding: 10, alignItems: "center", borderRadius: 5 }}
                onPress={() => {
                  navigation.navigate("Savings");
                  //Alert.alert("Coming soon", "Our savings features will be available from the 1st of August, 2022.");
                }}
              >
                <AppText styles={{ color: "#FFFFFF" }} bold>
                  Grow your savings
                </AppText>
              </Pressable>
            </View>
          </View>
        </Fragment>
      )}

      {selectedCurrency.code == "USD" && <UsdHome navigation={navigation} selectedCurrency={selectedCurrency} bottomSheetRef={bottomSheetRef} />}
      {selectedCurrency.code == "USDT" && <UsdtHome navigation={navigation} selectedCurrency={selectedCurrency} bottomSheetRef={bottomSheetRef} />}
      {selectedCurrency.code == "TRX" && <TronHome navigation={navigation} selectedCurrency={selectedCurrency} bottomSheetRef={bottomSheetRef} />}
      <BottomSheet ref={bottomSheetRef} index={0} enablePanDownToClose={true} snapPoints={snapPoints} backdropComponent={renderBackdrop} onChange={handleSheetChanges}>
        <View style={{ paddingHorizontal: 20 }}>
          {SUPPORTED_CURRENCIES.map((data, index) => {
            return (
              <Fragment>
                <View key={index} style={{ marginBottom: 10, marginTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image source={{ uri: data.icon }} style={{ width: 40, height: 40, resizeMode: "contain", marginRight: 10 }} />
                    <AppText styles={{ fontSize: 18 }}>
                      {data.fullname} - &nbsp; {data.code}
                    </AppText>
                  </View>

                  {data.code !== "BTC" && (
                    <TouchableOpacity onPress={() => handleSheetCloseRequest(data)} style={styles.currencyRadioContainer}>
                      <View style={{ ...styles.currencyRadioContainerInner, backgroundColor: `${selectedCurrency.code == data.code ? "#0bc8a5" : "#FFFFFF"}` }}></View>
                    </TouchableOpacity>
                  )}
                </View>
                <View>
                  {data.code === "BTC" && (
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                      <Image
                        source={{ uri: "https://res.cloudinary.com/ancla8techs4/image/upload/v1671737498/vetropay/bitcoin-lightning_rla5q9.png" }}
                        style={{ width: 20, height: 20, resizeMode: "contain", marginRight: 10 }}
                      />
                      <AppText small bold styles={{ fontSize: 9 }}>
                        Support for BTC {"&"} Bitcoin lightning coming soon.
                      </AppText>
                    </View>
                  )}
                </View>
              </Fragment>
            );
          })}
        </View>
      </BottomSheet>
      <StatusBar style="light" translucent={true} backgroundColor="#00000066" />
    </BottomSheetModalProvider>
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

  currencyRadioContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "grey",
    justifyContent: "center",
    alignItems: "center",
  },

  currencyRadioContainerInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
