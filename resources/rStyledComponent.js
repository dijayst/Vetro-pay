import React, { Fragment } from "react";
import { Platform } from "react-native";
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
