import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { Dimensions, View, Text, StyleSheet, Picker, TextInput } from "react-native";
import AppText from "../../resources/AppText";
import { PrimaryButton } from "../../resources/AppButton";
import { Spinner, useToast, Box, Text as NativeBaseText } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { postEmail, emailVerify } from "../../containers/regvalidate/action";
import { loadUser } from "../../containers/authentication/action";
import { toastColorObject } from "../../resources/rStyledComponent";

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

  const toast = useToast();
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
      toast.show({
        render: () => (
          <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
            <NativeBaseText style={{ color: "#FFFFFF" }}>Input a valid email address</NativeBaseText>
          </Box>
        ),
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
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>Email address error</NativeBaseText>
            </Box>
          ),
        });
      }
      if (
        verifactionPayload.payload.verificationCode == "" ||
        Number(verifactionPayload.payload.verificationCode) == NaN ||
        Number(verifactionPayload.payload.verificationCode) < 112340
      ) {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>Verification code incorrect</NativeBaseText>
            </Box>
          ),
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
          toast.show({
            render: () => (
              <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
                <NativeBaseText style={{ color: "#FFFFFF" }}>{`${postEmailResponse[postEmailResponse.length - 1]["message"]}`}</NativeBaseText>
              </Box>
            ),
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
          toast.show({
            render: () => (
              <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
                <NativeBaseText style={{ color: "#FFFFFF" }}>{`${postEmailVerifyResponse[postEmailVerifyResponse.length - 1]["message"]}`}</NativeBaseText>
              </Box>
            ),
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
                <Spinner color="blue.700" size="lg" />
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
