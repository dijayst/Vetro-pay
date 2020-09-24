import React from "react";
import { StyleSheet, View, Text, TouchableNativeFeedback } from "react-native";

export function AppButton(props) {
  let opacityValue = 1;
  if (props.disabled) {
    opacityValue = 0.6;
  }
  return (
    <TouchableNativeFeedback disabled={props.disabled} onPress={props.onPress}>
      <View style={{ ...props.styles, opacity: opacityValue }}>
        <Text style={{ ...props.textStyling }}>{props.children}</Text>
      </View>
    </TouchableNativeFeedback>
  );
}

export function PrimaryButton(props) {
  return (
    <TouchableNativeFeedback disabled={props.disabled} onPress={props.onPress}>
      <View style={{ ...styles.button, backgroundColor: `${props.disabled ? "rgba(38, 109, 220, 0.4)" : "#266ddc"}` }}>{props.children}</View>
    </TouchableNativeFeedback>
  );
}

export function DangerButton(props) {
  return (
    <TouchableNativeFeedback disabled={props.disabled} onPress={props.onPress}>
      <View style={{ ...styles.button, backgroundColor: `${props.disabled ? "rgba(255, 0, 0, 0.4)" : "red"}` }}>{props.children}</View>
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
