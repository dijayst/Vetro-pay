import React from "react";
import { Text, View, StyleSheet, TouchableNativeFeedback } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AppText from "../../resource/AppText";
import { SendMoneySvgComponent, ScanQRComponent } from "../../resource/Svg";

function Separator() {
  return <View style={styles.separator} />;
}

export default function Help() {
  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        {/** FAQ */}
        <TouchableNativeFeedback>
          <View style={styles.listItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                <ScanQRComponent />
                <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                  Frequently Asked Questions
                </AppText>
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
        {/** End FAQ */}

        <Separator />
        {/** Privacy Policy */}
        <TouchableNativeFeedback>
          <View style={styles.listItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                <ScanQRComponent />
                <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                  Privacy Policy
                </AppText>
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
        {/** End Privacy Policy */}
      </View>
      <View style={{ marginTop: 20 }}>
        <AppText bold="true" styles={{ textAlign: "center", textTransform: "uppercase", marginTop: 5 }}>
          Contact Us
        </AppText>
        <AppText styles={{ textAlign: "center", textTransform: "uppercase", marginTop: 5 }}>
          Email: <Text style={{ fontWeight: "700", textTransform: "lowercase" }}>support@vetropay.com </Text>
        </AppText>

        <AppText styles={{ textAlign: "center", textTransform: "uppercase", marginTop: 5 }}>
          Email: <Text style={{ fontWeight: "700", textTransform: "lowercase" }}>customercare@vetropay.com</Text>
        </AppText>
        <AppText styles={{ textAlign: "center", textTransform: "uppercase", marginTop: 5 }}>
          Customer care line: <Text style={{ fontWeight: "700" }}> +2348162357100</Text>
        </AppText>
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
