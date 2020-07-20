import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { Dimensions, View, Text, StyleSheet, Picker, TextInput } from "react-native";
import AppText from "../../resource/AppText";
import { PrimaryButton } from "../../resource/AppButton";
import { Toast, Spinner } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { changePassword } from "../../containers/authchange/action";

export default function ChangePassword({ navigation }) {
  const [displaySpinner, setDisplaySpinner] = useState(false);
  const [updateDetailsPayload, setUpdateDetailsPayload] = useState({
    payload: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const dispatch = useDispatch();

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const updateDetailsResponse = useSelector((state) => state.authchange.changepassword);
  const prevUpdateDetailsResponse = usePrevious(updateDetailsResponse);

  const submitPayload = () => {
    if (
      updateDetailsPayload.payload.currentPassword.length < 8 ||
      updateDetailsPayload.payload.newPassword.length < 8 ||
      updateDetailsPayload.payload.newPassword !== updateDetailsPayload.payload.confirmNewPassword
    ) {
      if (updateDetailsPayload.payload.currentPassword.length < 8 || updateDetailsPayload.payload.newPassword.length < 8) {
        Toast.show({
          text: "Password cannot be less than 8 characters",
          duration: 3000,
          type: "danger",
        });
      } else if (updateDetailsPayload.payload.newPassword !== updateDetailsPayload.payload.confirmNewPassword) {
        Toast.show({
          text: '"Confirm password" not the same as "Password" ',
          duration: 3000,
          type: "danger",
        });
      }
    } else {
      setDisplaySpinner(true);
      dispatch(changePassword(updateDetailsPayload.payload.currentPassword, updateDetailsPayload.payload.newPassword, updateDetailsPayload.payload.confirmNewPassword));
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
              currentPassword: "",
              newPassword: "",
              confirmNewPassword: "",
            },
          }));
          Toast.show({
            text: `${updateDetailsResponse[updateDetailsResponse.length - 1]["message"]}`,
            duration: 5000,
            type: "success",
          });
        } else {
          setDisplaySpinner(false);
          Toast.show({
            text: `${updateDetailsResponse[updateDetailsResponse.length - 1]["message"]}`,
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
          {/**<AppText bold="true" styles={{ fontSize: 18, textTransform: "uppercase", color: "#FFFFFF" }}>
            Change Password
          </AppText> */}

          <View style={styles.recordForm}>
            <View style={{ marginTop: 8, paddingLeft: 4, paddingRight: 4 }}>
              <View style={styles.formGroup}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>Current Password</Text>
                </AppText>
                <TextInput
                  style={{ ...styles.textInput, borderColor: "#266ddc" }}
                  placeholder="Enter current password"
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

              <View style={styles.formGroup}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>New Password</Text>
                </AppText>
                <TextInput
                  style={{ ...styles.textInput, borderColor: "#266ddc" }}
                  placeholder="Enter new password"
                  textContentType="password"
                  secureTextEntry
                  onChangeText={(text) => {
                    setUpdateDetailsPayload((prevState) => ({
                      ...prevState,
                      payload: {
                        ...prevState.payload,
                        newPassword: text,
                      },
                    }));
                  }}
                  value={updateDetailsPayload.payload.newPassword}
                />
              </View>

              <View style={styles.formGroup}>
                <AppText>
                  <Text style={{ fontWeight: "700" }}>Confirm New Password</Text>
                </AppText>
                <TextInput
                  style={{ ...styles.textInput, borderColor: "#266ddc" }}
                  placeholder="Confirm new password"
                  textContentType="password"
                  secureTextEntry
                  onChangeText={(text) => {
                    setUpdateDetailsPayload((prevState) => ({
                      ...prevState,
                      payload: {
                        ...prevState.payload,
                        confirmNewPassword: text,
                      },
                    }));
                  }}
                  value={updateDetailsPayload.payload.confirmNewPassword}
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
                <Spinner color="blue" />
              </View>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

ChangePassword.propType = {
  changePassword: PropTypes.func,
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
    height: 40,
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
