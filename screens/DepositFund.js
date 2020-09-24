import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { View, Text, StyleSheet, TouchableOpacity, Alert, Clipboard } from "react-native";
import AppText from "../resources/AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { loadUser } from "../containers/authentication/action";
import { Toast } from "native-base";

export default function DepositFund({ navigation }) {
  const userAuthentication = useSelector((state) => state.authentication.user);
  const dispatch = useDispatch();

  useEffect(() => {
    /**NAVIGATIOON */
    navigation.addListener("focus", () => {
      dispatch(loadUser());
    });
  }, [navigation]);

  useEffect(() => {
    if (userAuthentication.email == "") {
      Alert.alert("Complete Profile Information", "Add your Email address to obtain a personal National Bank Account linked to VetroPay", [
        {
          text: "Ok",
          onPress: () => {
            navigation.navigate("Settings");
          },
        },
      ]);
    }
  }, []);

  const copyToClipBoard = () => {
    Clipboard.setString(`${userAuthentication.nuban}`);
    Toast.show({
      text: "Copied to clipboard",
      duration: 3000,
      type: "success",
    });
  };

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 16, paddingHorizontal: 10 }}>
        <AppText bold="true" styles={{ fontSize: 16 }}>
          Deposit Account Information:
        </AppText>

        <View style={{ marginTop: 10, height: 100, backgroundColor: "#ffffff", alignItems: "center", justifyContent: "center", elevation: 4, borderRadius: 15 }}>
          <AppText bold="true" styles={{ fontSize: 18, textAlign: "center" }}>
            Bank: Providus Bank
          </AppText>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <AppText bold="true" styles={{ fontSize: 18, textAlign: "center" }}>
              Number: {userAuthentication.nuban}
            </AppText>
            <TouchableOpacity onPress={() => copyToClipBoard()}>
              <View>
                <MaterialCommunityIcons name="content-copy" style={{ marginLeft: 5 }} size={30} color="#266ddc" />
              </View>
            </TouchableOpacity>
          </View>
          <AppText bold="true" styles={{ fontSize: 18, textAlign: "center", color: "#266ddc", textTransform: "capitalize" }}>
            {userAuthentication.fullname}
          </AppText>
        </View>

        <View style={{ marginTop: 16 }}>
          <AppText bold="true" styles={{ textAlign: "center", fontSize: 18 }}>
            How to fund your Vetropay Account
          </AppText>

          <AppText styles={{ marginTop: 10 }}>
            <Text style={{ fontWeight: "700" }}>1. Mobile, Internet Banking or USSD</Text>
          </AppText>
          <AppText styles={{ paddingHorizontal: 10, marginTop: 5 }}>(a). Make a fund transfer to your Providus Bank Account details above.</AppText>

          <AppText styles={{ paddingHorizontal: 10, marginTop: 5 }}>(b). Your VetroPay balance will be credited automatically. Cheers!</AppText>
        </View>

        {/** End Note */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
