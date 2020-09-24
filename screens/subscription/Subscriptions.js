import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AppText from "../../resources/AppText";

export default function Subscriptions() {
  return (
    <View style={styles.container}>
      <View style={{ marginTop: 16, paddingHorizontal: 10 }}>
        {/** Note */}
        <View style={{ marginTop: 10, height: 100, backgroundColor: "#ffffff", alignItems: "center", justifyContent: "center", elevation: 4, borderRadius: 15 }}>
          <AppText bold="true" styles={{ fontSize: 16, textAlign: "center" }}>
            You do not have any Subscriptions.
          </AppText>
          <AppText styles={{ fontSize: 16, textAlign: "center" }}>Your subscriptions and pending payments to merchant will be displayed here.</AppText>
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
