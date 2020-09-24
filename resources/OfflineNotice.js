import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get("window");

export default function OfflineNotice({ variant }) {
  if (!variant) {
    return (
      <View style={styles.offlineContainer}>
        <Text style={styles.offlineText}>No internet connection</Text>
      </View>
    );
  } else {
    return null;
  }
}
const styles = StyleSheet.create({
  offlineContainer: {
    zIndex: 1000,
    backgroundColor: "#b52424",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width,
    position: "absolute",
    top: 80, //Webview Header height + 10px padding
  },
  offlineText: {
    color: "#fff",
  },
});
