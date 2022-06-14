import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { Dimensions, View, Text, StyleSheet, Picker, TextInput } from "react-native";
import AppText from "../../resources/AppText";
import { PrimaryButton } from "../../resources/AppButton";
import { Spinner, useToast, Box, Text as NativeBaseText } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { changeTransactionPin } from "../../containers/authchange/action";
import { toastColorObject } from "../../resources/rStyledComponent";

export default function ChangePin({ navigation }) {
  const [displaySpinner, setDisplaySpinner] = useState(false);
  const [updateDetailsPayload, setUpdateDetailsPayload] = useState({
    payload: {
      currentPin: "",
      newPin: "",
      confirmNewPin: "",
      currentPassword: "",
    },
  });

  const toast = useToast();
  const dispatch = useDispatch();

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const updateDetailsResponse = useSelector((state) => state.authchange.changepin);
  const prevUpdateDetailsResponse = usePrevious(updateDetailsResponse);

  const submitPayload = () => {
    if (
      updateDetailsPayload.payload.currentPin.length < 6 ||
      updateDetailsPayload.payload.newPin.length < 6 ||
      updateDetailsPayload.payload.newPin.length > 6 ||
      Number(updateDetailsPayload.payload.currentPin) == NaN ||
      updateDetailsPayload.payload.newPin !== updateDetailsPayload.payload.confirmNewPin ||
      updateDetailsPayload.payload.currentPassword.length < 8
    ) {
      if (updateDetailsPayload.payload.currentPin.length < 6) {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>Transaction pin incorrect, your account maybe suspended after 3 more invalid tries</NativeBaseText>
            </Box>
          ),
        });
      } else if (updateDetailsPayload.payload.newPin.length < 6 || updateDetailsPayload.payload.newPin.length > 6 || Number(updateDetailsPayload.payload.currentPin) == NaN) {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>Transaction Pin must be 6 digit (numbers only)</NativeBaseText>
            </Box>
          ),
        });
      } else if (updateDetailsPayload.payload.newPin !== updateDetailsPayload.payload.confirmNewPin) {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>"New Pin" and "Confirm pin" must be the same</NativeBaseText>
            </Box>
          ),
        });
      } else if (updateDetailsPayload.payload.currentPassword.length < 8) {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>Password incorrect</NativeBaseText>
            </Box>
          ),
        });
      }
    } else {
      setDisplaySpinner(true);
      dispatch(
        changeTransactionPin(
          updateDetailsPayload.payload.currentPin,
          updateDetailsPayload.payload.newPin,
          updateDetailsPayload.payload.confirmNewPin,
          updateDetailsPayload.payload.currentPassword
        )
      );
    }
  };

  useEffect(() => {
    if (prevUpdateDetailsResponse) {
      if (prevUpdateDetailsResponse.length !== updateDetailsResponse.length) {
        if (updateDetailsResponse[updateDetailsResponse.length - 1]["status"] == "success") {
          setDisplaySpinner(false);
          setUpdateDetailsPayload((prevState) => ({
            ...prevState,
            payload: {
              currentPin: "",
              newPin: "",
              confirmNewPin: "",
              currentPassword: "",
            },
          }));
          toast.show({
            render: () => (
              <Box bg={toastColorObject["success"]} px="2" py="2" rounded="sm" mb={5}>
                <NativeBaseText style={{ color: "#FFFFFF" }}>{`${updateDetailsResponse[updateDetailsResponse.length - 1]["message"]}`}</NativeBaseText>
              </Box>
            ),
          });
        } else {
          setDisplaySpinner(false);
          toast.show({
            render: () => (
              <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
                <NativeBaseText style={{ color: "#FFFFFF" }}>{`${updateDetailsResponse[updateDetailsResponse.length - 1]["message"]}`}</NativeBaseText>
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
          {/**<AppText bold="true" styles={{ fontSize: 18, textTransform: "uppercase", color: "#FFFFFF" }}>
            Change Pin
  </AppText> */}

          <View style={styles.recordForm}>
            <View style={{ marginTop: 8, paddingLeft: 4, paddingRight: 4 }}>
              <View style={styles.formGroup}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>Current Pin</Text>
                </AppText>
                <TextInput
                  style={{ ...styles.textInput, borderColor: "#266ddc" }}
                  placeholder="Enter current transaction pin"
                  textContentType="password"
                  secureTextEntry
                  onChangeText={(text) => {
                    setUpdateDetailsPayload((prevState) => ({
                      ...prevState,
                      payload: {
                        ...prevState.payload,
                        currentPin: text,
                      },
                    }));
                  }}
                  value={updateDetailsPayload.payload.currentPin}
                />
              </View>

              <View style={styles.formGroup}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>New Pin</Text>
                </AppText>
                <TextInput
                  style={{ ...styles.textInput, borderColor: "#266ddc" }}
                  placeholder="Enter new transaction pin"
                  textContentType="password"
                  secureTextEntry
                  onChangeText={(text) => {
                    setUpdateDetailsPayload((prevState) => ({
                      ...prevState,
                      payload: {
                        ...prevState.payload,
                        newPin: text,
                      },
                    }));
                  }}
                  value={updateDetailsPayload.payload.newPin}
                />
              </View>

              <View style={styles.formGroup}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>Confirm New Pin</Text>
                </AppText>
                <TextInput
                  style={{ ...styles.textInput, borderColor: "#266ddc" }}
                  placeholder="Confirm new transaction pin"
                  textContentType="password"
                  secureTextEntry
                  onChangeText={(text) => {
                    setUpdateDetailsPayload((prevState) => ({
                      ...prevState,
                      payload: {
                        ...prevState.payload,
                        confirmNewPin: text,
                      },
                    }));
                  }}
                  value={updateDetailsPayload.payload.confirmNewPin}
                />
              </View>

              <View style={styles.formGroup}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>Vetropay Password</Text>
                </AppText>
                <TextInput
                  style={{ ...styles.textInput, borderColor: "#266ddc" }}
                  placeholder="Enter Vetropay password"
                  textContentType="password"
                  secureTextEntry
                  onChangeText={(text) => {
                    setUpdateDetailsPayload((prevState) => ({
                      ...prevState,
                      payload: {
                        ...prevState.payload,
                        currentPassword: text,
                      },
                    }));
                  }}
                  value={updateDetailsPayload.payload.currentPassword}
                />
              </View>

              <View
                style={{
                  ...styles.formGroup,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  display: `${!displaySpinner ? "flex" : "none"}`,
                }}
              >
                <PrimaryButton onPress={() => submitPayload()}>
                  <AppText bold="true" styles={{ color: "#fff", fontSize: 16 }}>
                    Update
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

ChangePin.propType = {
  changeTransactionPin: PropTypes.func,
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
