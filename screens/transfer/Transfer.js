import React, { useState } from "react";
import { useSelector } from "react-redux";
import { View, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AppText from "../../resources/AppText";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
const INTERNATIONAL = "international";
const LOCAL = "local";

export default function Transfer({ navigation }) {
  const userAuthentication = useSelector((state) => state.authentication.user);
  const [transferState, setTransferState] = useState(LOCAL);

  const renderTransferState = () => {
    if (transferState == LOCAL) {
      return (
        <View style={styles.listContainer}>
          {/** Send Money */}
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => {
              if (userAuthentication.linked_business) {
                navigation.navigate("TransferBusiness");
              } else {
                navigation.navigate("SendMoney");
              }
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                <View style={styles.listItemIconContainer}>
                  <FontAwesome5 name="exchange-alt" size={15} color="#266ddc" />
                </View>
                <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                  VetroPay Transfer
                </AppText>
              </View>

              <View>
                <AppText styles={{ color: "grey" }}>Free</AppText>
              </View>
            </View>
          </TouchableOpacity>
          {/** End Send Money */}
          {/** Withdraw to bank */}
          <TouchableOpacity onPress={() => navigation.navigate("Withdraw")} style={{ ...styles.listItem, marginBottom: 2 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                <View style={styles.listItemIconContainer}>
                  <FontAwesome name="bank" size={15} color="#266ddc" />
                </View>
                <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                  Bank Transfer to Self
                </AppText>
              </View>

              <View>
                <AntDesign name="right" color="grey" size={20} />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (!userAuthentication.email || userAuthentication.kyc_verified != "VERIFIED") {
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
                navigation.navigate("WithdrawOthers");
              }
            }}
            style={{ ...styles.listItem, marginBottom: 2 }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                <View style={styles.listItemIconContainer}>
                  <FontAwesome name="bank" size={15} color="#266ddc" />
                </View>
                <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                  Bank Transfer to Others
                </AppText>
              </View>

              <View>
                <AntDesign name="right" color="grey" size={20} />
              </View>
            </View>
          </TouchableOpacity>
          {/** End Withdraw to bank */}
        </View>
      );
    } else {
      return (
        <View style={styles.internationalContainer}>
          <Image
            source={{ uri: "https://res.cloudinary.com/ancla8techs4/image/upload/v1662781930/vetropay/blockchain-globe_pfuzuv.png" }}
            style={{ height: 200, width: 200, alignSelf: "center" }}
          />

          <View style={{ paddingHorizontal: 10 }}>
            <AppText styles={{ fontSize: 14.5 }}>
              <AppText bold>VetroPay Cross-Border payments</AppText> has been upgraded to run as a Blockchain-based Remittance Service.
            </AppText>
            <AppText styles={{ marginTop: 5, fontSize: 14.5 }}>
              Your VetroPay account now directly offers you multi-currency wallet; allowing you to accept and send funds around the world faster, cheaper and much more seamless.
            </AppText>
            <AppText styles={{ marginTop: 5, fontSize: 14.5 }}>Switch directly between available currencies on your dashboard. Go Vetro!!</AppText>
          </View>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ width: "100%", backgroundColor: "#266ddc", marginTop: 20, justifyContent: "center", height: 45, borderRadius: 5, alignItems: "center" }}
          >
            <AppText styles={{ color: "#ffffff", fontSize: 16 }} bold>
              Go to Dashboard 🎉
            </AppText>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <TouchableOpacity
          onPress={() => {
            setTransferState(LOCAL);
          }}
          style={{ width: "50%", justifyContent: "center", alignItems: "center" }}
        >
          <AppText>Local</AppText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setTransferState(INTERNATIONAL);
          }}
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <AppText>International</AppText>
        </TouchableOpacity>
      </View>
      <View style={{ position: "relative", marginTop: 10, flexDirection: "column" }}>
        <View style={{ ...styles.separator, marginLeft: 0 }} />
        <View
          style={{
            ...styles.separator,
            marginLeft: 0,
            position: "absolute",
            width: "50%",
            borderBottomWidth: 3,
            borderBottomColor: "#266ddc",
            alignSelf: transferState == LOCAL ? "flex-start" : "flex-end",
          }}
        />
      </View>
      {renderTransferState()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F8",
  },
  separator: {
    marginVertical: 2,
    marginLeft: "10%",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  listContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  listItem: {
    backgroundColor: "#FFFFFF",
    marginTop: 20,
    elevation: 2,
    height: 60,
    paddingHorizontal: 10,
    justifyContent: "center",
    width: "90%",
    borderRadius: 10,
  },

  listItemIconContainer: {
    height: 40,
    width: 40,
    borderRadius: 3,
    backgroundColor: "#D9E8FD",
    justifyContent: "center",
    alignItems: "center",
  },

  internationalContainer: {
    paddingVertical: 30,
    paddingHorizontal: 10,
  },

  internationalAmountContainer: {
    backgroundColor: "#FFFFFF",
    height: 70,
    width: "100%",
    alignSelf: "center",
    borderColor: "#EAE7C6",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  internationalText: {
    fontSize: 12,
    color: "#5D8BF4",
  },
});
