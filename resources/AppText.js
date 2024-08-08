import React from "react";
import { Text } from "react-native";

export default function AppText(props) {
  const determineFontFamily = (fontProperty) => {
    if (fontProperty.light) {
      return "Rubik_300Light";
    } else if (fontProperty.regular) {
      return "Rubik_400Regular";
    } else if (fontProperty.medium) {
      return "Rubik_500Medium";
    } else if (fontProperty.bold) {
      return "Rubik_600SemiBold";
    } else if (fontProperty.bolder) {
      return "Rubik_700Bold";
    } else if (fontProperty.extraBold) {
      return "Rubik_800ExtraBold";
    } else if (fontProperty.superBold) {
      return "Rubik_900Black,";
    } else {
      return "Rubik_400Regular";
    }
  };
  return (
    <Text
      style={{
        ...props.styles,
        fontFamily: determineFontFamily(props),
      }}
    >
      {props.children}
    </Text>
  );
}
