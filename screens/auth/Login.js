import { Text, View, StyleSheet, Image, TextInput } from "react-native";
import React, { Component } from "react";
import VETROPAY_LOGO from "../../assets/logomark_full_horizontal.png";
import AppText from "../../resources/AppText";

export default class Login extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.innerScreenContainer}>
          <View
            style={{
              marginTop: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={VETROPAY_LOGO}
              style={{ height: 50, width: 150, resizeMode: "contain" }}
            />
          </View>
          <AppText bold styles={{ marginTop: 10, fontSize: 20 }}>
            Welcome back, Olamigoke
          </AppText>
          <AppText bold styles={{ marginTop: 4, fontSize: 12, color: "grey" }}>
            Please sign in to continue.
          </AppText>

          {/** TEXT INPUT CONTAINER */}
          <View>
            {/* <TextInput
              style={{ ...styles.textInput, marginTop: 20 }}
              placeholder="Enter Password"
              placeholderTextColor="gray"
              textContentType="telephoneNumber"
              keyboardType="numeric"
              autoComplete="off"
            /> */}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerScreenContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  textInput: {
    height: 50,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 0.5,
    borderColor: "#266ddc",
    borderRadius: 8,
    borderBottomColor: "#266DDC",
  },
});
