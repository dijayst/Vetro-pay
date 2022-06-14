import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { Dimensions, View, Text, StyleSheet, Picker, TextInput } from "react-native";
import AppText from "../../resources/AppText";
import { PrimaryButton } from "../../resources/AppButton";
import { Toast, Spinner } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { postEmail, emailVerify } from "../../containers/regvalidate/action";
import { loadUser } from "../../containers/authentication/action";

export default function Email({ navigation }) {
  const userAuthentication = useSelector((state) => state.authentication.user);
  const [displaySpinner, setDisplaySpinner] = useState(false);
  const [verifactionPayload, setVerifactionPayload] = useState({
    payload: {
      email: "",
      verificationCode: "",
    },
  });
  const [mailSent, setMailSent] = useState(false);

  const dispatch = useDispatch();

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const postEmailResponse = useSelector((state) => state.regvalidate.postemail);
  const prevPostEmailResponse = usePrevious(postEmailResponse);

  const postEmailVerifyResponse = useSelector((state) => state.regvalidate.emailverify);
  const prevPostEmailVerifyResponse = usePrevious(postEmailVerifyResponse);

  var re = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  const postUserEmail = () => {
    if (verifactionPayload.payload.email !== "" && String(verifactionPayload.payload.email).match(re) !== null) {
      setDisplaySpinner(true);
      dispatch(postEmail(verifactionPayload.payload.email));
    } else {
      Toast.show({
        text: "Input a valid email address",
        duration: 3000,
        type: "danger",
      });
    }
  };

  const postUserAuthCode = () => {
    if (
      verifactionPayload.payload.email == "" ||
      String(verifactionPayload.payload.email).match(re) == null ||
      verifactionPayload.payload.verificationCode == "" ||
      Number(verifactionPayload.payload.verificationCode) == NaN ||
      Number(verifactionPayload.payload.verificationCode) < 112340
    ) {
      if (verifactionPayload.payload.email == "" || String(verifactionPayload.payload.email).match(re) == null) {
        Toast.show({
          text: "Email address error",
          duration: 3000,
          type: "danger",
        });
      }
      if (
        verifactionPayload.payload.verificationCode == "" ||
        Number(verifactionPayload.payload.verificationCode) == NaN ||
        Number(verifactionPayload.payload.verificationCode) < 112340
      ) {
        Toast.show({
          text: "Verification code incorrect",
          duration: 3000,
          type: "danger",
        });
      }
    } else {
      setDisplaySpinner(true);
      dispatch(emailVerify(verifactionPayload.payload.email, verifactionPayload.payload.verificationCode));
    }
  };

  useEffect(() => {
    if (prevPostEmailResponse) {
      if (prevPostEmailResponse.length !== postEmailResponse.length) {
        if (postEmailResponse[postEmailResponse.length - 1]["status"] == "success") {
          setMailSent(true);
          setDisplaySpinner(false);
        } else {
          setDisplaySpinner(false);
          Toast.show({
            text: `${postEmailResponse[postEmailResponse.length - 1]["message"]}`,
            duration: 5000,
            type: "danger",
          });
        }
      }
    }

    if (prevPostEmailVerifyResponse) {
      if (prevPostEmailVerifyResponse.length !== postEmailVerifyResponse.length) {
        if (postEmailVerifyResponse[postEmailVerifyResponse.length - 1]["status"] == "success") {
          dispatch(loadUser());
          setDisplaySpinner(false);
          navigation.goBack();
        } else {
          setDisplaySpinner(false);
          Toast.show({
            text: `${postEmailVerifyResponse[postEmailVerifyResponse.length - 1]["message"]}`,
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
            Account {">"} Email address
          </AppText>

          <View style={styles.recordForm}>
            <View style={{ marginTop: 8, paddingLeft: 4, paddingRight: 4 }}>
              <View style={styles.formGroup}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>Email</Text>
                </AppText>
                <TextInput
                  style={{ ...styles.textInput, borderColor: "#266ddc" }}
                  placeholder="Enter email address"
                  textContentType="emailAddress"
                  onChangeText={(text) => {
                    setVerifactionPayload((prevState) => ({
                      ...prevState,
                      payload: {
                        ...prevState.payload,
                        email: text,
                      },
                    }));
                  }}
                  value={verifactionPayload.payload.email}
                />
              </View>

              <View style={{ ...styles.formGroup, display: `${mailSent ? "flex" : "none"}` }}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>Verification code</Text>
                </AppText>
                <TextInput
                  style={{ ...styles.textInput, borderColor: "#266ddc" }}
                  placeholder=" Enter verification code sent to email"
                  onChangeText={(text) => {
                    setVerifactionPayload((prevState) => ({
                      ...prevState,
                      payload: {
                        ...prevState.payload,
                        verificationCode: text,
                      },
                    }));
                  }}
                  value={verifactionPayload.payload.verificationCode}
                />
              </View>

              <View
                style={{
                  ...styles.formGroup,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  display: `${!displaySpinner ? `${mailSent ? "none" : "flex"}` : "none"}`,
                }}
              >
                <PrimaryButton onPress={() => postUserEmail()} disabled={userAuthentication.email !== "" ? true : false}>
                  <AppText bold="true" styles={{ color: "#fff", fontSize: 16 }}>
                    Verify
                  </AppText>
                </PrimaryButton>
              </View>

              <View
                style={{
                  ...styles.formGroup,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  display: `${!displaySpinner ? `${mailSent ? "flex" : "none"}` : "none"}`,
                }}
              >
                <PrimaryButton onPress={() => postUserAuthCode()}>
                  <AppText bold="true" styles={{ color: "#fff", fontSize: 16 }}>
                    Save
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

Email.propTypes = {
  postEmail: PropTypes.func,
  emailVerify: PropTypes.func,
  loadUser: PropTypes.func,
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
