import React from "react";
import { Text, View, StyleSheet, TouchableNativeFeedback } from "react-native";
import AppText from "../../resource/AppText";
import { ScanQRComponent } from "../../resource/Svg";

function Separator() {
  return <View style={styles.separator} />;
}

export default function ChangePasswordPin({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        {/** Change Password */}
        <TouchableNativeFeedback onPress={() => navigation.navigate("ChangePassword")}>
          <View style={styles.listItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                <ScanQRComponent />
                <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                  Change Password
                </AppText>
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
        {/** End Change Password */}

        <Separator />
        {/** Change Transaction Pin */}
        <TouchableNativeFeedback onPress={() => navigation.navigate("ChangePin")}>
          <View style={styles.listItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                <ScanQRComponent />
                <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                  Change Transaction Pin
                </AppText>
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
        {/** End Change Transaction Pin */}
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
