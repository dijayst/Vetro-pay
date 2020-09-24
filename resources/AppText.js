import React from "react";
import { Text } from "react-native";

export default function AppText(props) {
  return <Text style={{ ...props.styles, fontFamily: `${props.bold ? "QuicksandBold" : "Quicksand"}` }}>{props.children}</Text>;
}
