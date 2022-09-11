import React, { Fragment } from "react";
import { Platform, StyleSheet, View } from "react-native";
import styled from "styled-components/native";

export const toastColorObject = {
  danger: "danger.500",
  warning: "warning.400",
  success: "emerald.500",
  default: "dark.200",
};

export const SafeAreaView = styled.SafeAreaView`
  padding-top: ${Platform.OS === "android" ? "25px" : "0px"};
  width: 100%;
`;

export const HR = ({ style }) => {
  return (
    <View
      style={{
        borderBottomColor: "black",
        borderBottomWidth: StyleSheet.hairlineWidth,
        ...style,
      }}
    />
  );
};
