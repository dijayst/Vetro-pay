import React from "react";
import { useSelector } from "react-redux";
import { View, StyleSheet, TouchableNativeFeedback } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AppText from "../../resources/AppText";
import { SendMoneySvgComponent, WithdrawToBankComponent, ScanQRComponent } from "../../resources/Svg";

function Separator() {
  return <View style={styles.separator} />;
}

export default function Transfer({ navigation }) {
  const userAuthentication = useSelector((state) => state.authentication.user);

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        {/** Send Money */}
        <TouchableNativeFeedback
          onPress={() => {
            if (userAuthentication.linked_business) {
              navigation.navigate("TransferBusiness");
            } else {
              navigation.navigate("SendMoney");
            }
          }}
        >
          <View style={styles.listItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                <SendMoneySvgComponent />
                <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                  Send money
                </AppText>
              </View>

              <View>
                <AntDesign name="right" color="grey" size={20} />
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
        {/** End Send Money */}
        <Separator />
        {/** Withdraw to bank */}
        <TouchableNativeFeedback onPress={() => navigation.navigate("Withdraw")}>
          <View style={styles.listItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                <WithdrawToBankComponent />
                <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                  Withdraw to Bank
                </AppText>
              </View>

              <View>
                <AntDesign name="right" color="grey" size={20} />
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
        {/** End Withdraw to bank */}
        <Separator />
        {/** Scan QR */}
        <TouchableNativeFeedback onPress={() => navigation.navigate("ScanPay")}>
          <View style={styles.listItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                <ScanQRComponent />
                <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                  Scan to Pay (QR)
                </AppText>
              </View>

              <View>
                <AntDesign name="right" color="grey" size={20} />
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
        {/** End Scan QR */}
      </View>
    </View>
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
    backgroundColor: "#FFFFFF",
    marginTop: 30,
    elevation: 2,
  },

  listItem: {
    height: 50,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
});
