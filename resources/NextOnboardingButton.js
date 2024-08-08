import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import AppText from "./AppText";

const NextButton = ({ percentage, scrollTo, currentIndex, totalItems }) => {
  return (
    <>
      <View style={styles.cont}>
        <TouchableOpacity
          style={{
            backgroundColor: "#266ddc",
            width: "90%",
            height: 54,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            flexDirection: "row",
          }}
          activeOpacity={0.6}
          onPress={scrollTo}
        >
          <AppText
            bold
            styles={{
              fontSize: 16,
              lineHeight: 20,
              color: "#f2f2f2",
            }}
          >
            {currentIndex + 1 != totalItems ? "Next" : "Get Started"}
          </AppText>
          <Fontisto
            name="arrow-right-l"
            style={{ marginLeft: 10 }}
            size={24}
            color={"#f2f2f2"}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  cont: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
});
export default NextButton;
