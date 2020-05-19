import React from "react";
import { StyleSheet, View, Text, TouchableNativeFeedback } from "react-native";

export function AppButton(props) {
  return (
    <TouchableNativeFeedback onPress={props.onPress}>
      <View style={{ ...props.styles }}>
        <Text style={{ ...props.textStyling }}>{props.children}</Text>
      </View>
    </TouchableNativeFeedback>
  );
}

export function PrimaryButton(props) {
  return (
    <TouchableNativeFeedback onPress={props.onPress}>
      <View style={styles.button}>{props.children}</View>
    </TouchableNativeFeedback>
  );
}

export function DangerButton(props) {
  return (
    <TouchableNativeFeedback onPress={props.onPress}>
      <View style={{ ...styles.button, backgroundColor: "red" }}>{props.children}</View>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
    width: 110,
    paddingVertical: 10,
    backgroundColor: "#266ddc",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
