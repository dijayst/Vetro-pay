import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function FinanceVisualizer() {
  return (
    <View style={styles.container}>
      <Text>Here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center"
  }
});
