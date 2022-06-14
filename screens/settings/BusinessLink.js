import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { Dimensions, View, Text, StyleSheet, Picker, TextInput } from "react-native";
import AppText from "../../resources/AppText";
import { PrimaryButton } from "../../resources/AppButton";
import { Toast, Spinner } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { verifyBusinessUID, linkMobileBusiness } from "../../containers/business/action";

export default function BusinessLink({ navigation }) {
  const [businessValid, setBusinessValid] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [businessUID, setBusinessUID] = useState("");
  const [displaySpinner, setDisplaySpinner] = useState(false);

  const dispatch = useDispatch();

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const verifyBusinessResponse = useSelector((state) => state.business.verify);
  const prevVerifyBusinessResponse = usePrevious(verifyBusinessResponse);

  const linkMobileBusinessResponse = useSelector((state) => state.business.linkup);
  const prevLinkMobileBusinessResponse = usePrevious(linkMobileBusinessResponse);

  const submitData = () => {
    if (businessUID == "" || businessUID.length < 4) {
      Toast.show({
        text: "Enter Valid Business UID",
        duration: 3000,
        type: "danger",
      });
    } else {
      setBusinessUID(businessUID.toUpperCase());
      dispatch(verifyBusinessUID(businessUID));
      setDisplaySpinner(true);
    }
  };

  const requestLinkUp = () => {
    dispatch(linkMobileBusiness(businessUID));
    setDisplaySpinner(true);
  };

  useEffect(() => {
    if (prevVerifyBusinessResponse) {
      if (prevVerifyBusinessResponse.length !== verifyBusinessResponse.length) {
        if (verifyBusinessResponse[verifyBusinessResponse.length - 1]["status"] == "success") {
          setBusinessValid(true);
          setBusinessName(verifyBusinessResponse[verifyBusinessResponse.length - 1]["businessName"]);
          setDisplaySpinner(false);
        } else {
          setDisplaySpinner(false);
          Toast.show({
            text: `${verifyBusinessResponse[verifyBusinessResponse.length - 1]["message"]}`,
            duration: 5000,
            type: "danger",
          });
        }
      }
    }

    if (prevLinkMobileBusinessResponse) {
      if (prevLinkMobileBusinessResponse.length !== linkMobileBusinessResponse.length) {
        if (linkMobileBusinessResponse[linkMobileBusinessResponse.length - 1]["status"] == "success") {
          navigation.navigate("Account");
        } else {
          setDisplaySpinner(false);
          Toast.show({
            text: `${linkMobileBusinessResponse[linkMobileBusinessResponse.length - 1]["message"]}`,
            duration: 5000,
            type: "danger",
          });
        }
      }
    }
  });

  return (
    <KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={10} enableOnAndroid={true} extraHeight={Platform.select({ android: 150 })} style={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.upperBackGround}></View>

        <View style={styles.balanceUpBackGround}>
          <AppText bold="true" styles={{ fontSize: 18, textTransform: "uppercase", color: "#FFFFFF" }}>
            Link Business Account
          </AppText>

          <View style={styles.recordForm}>
            <View style={{ marginTop: 8, paddingLeft: 4, paddingRight: 4 }}>
              <View style={styles.formGroup}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>Business UID</Text>
                </AppText>
                <TextInput
                  style={{ ...styles.textInput, borderColor: "#266ddc" }}
                  placeholder="Enter Business UID"
                  value={businessUID}
                  onChangeText={(text) => {
                    setBusinessUID(text);
                  }}
                />
              </View>

              <View style={styles.formGroup}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>Business Name</Text>
                </AppText>
                <TextInput style={{ ...styles.textInput, borderColor: "#266ddc", backgroundColor: "#F0F0F8" }} editable={false} value={businessName} />
              </View>

              <View style={{ ...styles.formGroup, alignItems: "center", flexDirection: "row", justifyContent: "space-evenly", display: `${!displaySpinner ? "flex" : "none"}` }}>
                <PrimaryButton disabled={businessValid} onPress={() => submitData()}>
                  <AppText bold="true" styles={{ color: "#fff", fontSize: 16 }}>
                    Validate
                  </AppText>
                </PrimaryButton>
                <PrimaryButton disabled={!businessValid} onPress={() => requestLinkUp()}>
                  <AppText bold="true" styles={{ color: "#fff", fontSize: 16 }}>
                    Request
                  </AppText>
                </PrimaryButton>
              </View>

              <View style={{ justifyContent: "center", display: `${displaySpinner ? "flex" : "none"}` }}>
                <Spinner color="blue" />
              </View>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

BusinessLink.propType = {
  verifyBusinessUID: PropTypes.func,
  linkMobileBusiness: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
    backgroundColor: "#F0F0F8",
    height: 1000,
  },

  headerText: {
    fontSize: 20,
    color: "#266ddc",
  },
  upperBackGround: {
    width: Dimensions.get("window").width,
    height: 131,
    backgroundColor: "rgba(38, 109, 220, 0.6)",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  balanceUpBackGround: {
    position: "absolute",
    width: "100%",
    paddingHorizontal: 10,
  },
  recordForm: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderTopRightRadius: 4,
  },
  textInput: {
    height: 45,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderTopRightRadius: 4,

    borderColor: "#ddd",
  },
  formGroup: {
    marginBottom: 8,
    marginTop: 8,
  },
});
