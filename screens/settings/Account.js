import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Text, View, StyleSheet, TouchableNativeFeedback, Alert } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import AppText from "../../resources/AppText";
import { AccountProfileSvgComponent, EmailSvgComponent, KycSvgComponent, QrCodeSvgComponent, UserPinSvgComponent, BusinessSvgComponent } from "../../resources/Svg";
import { loadUser, deleteUserAccountPrompt } from "../../containers/authentication/action";

function Separator() {
  return <View style={styles.separator} />;
}

export default function Account({ navigation }) {
  const userAuthentication = useSelector((state) => state.authentication.user);

  const dispatch = useDispatch();

  useEffect(() => {
    /**NAVIGATIOON */
    navigation.addListener("focus", () => {
      dispatch(loadUser());
    });
  }, [navigation]);

  const alertPreDelete = () => {
    Alert.alert(
      "We'd love to have you with us?",
      "This action may be irredeemable. To proceed, hold the 'Request Account Deletion' Button for about 5 - 10 seconds.",
      [
        {
          text: "Ok",
          onPress: () => {
            return null;
          },
        },
      ],
      { cancelable: false }
    );
  };

  const alertDeleteUserAccount = () => {
    Alert.alert(
      "We'd love to have you with us",
      "This action may be irredemable, to reverse this action within 30 days, kindly email us at: customercare@vetropay.com",
      [
        {
          text: "Cancel",
          onPress: () => {
            return null;
          },
        },
        {
          text: "Delete Account",
          onPress: () => {
            dispatch(deleteUserAccountPrompt());
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        {/** Full name */}
        <TouchableNativeFeedback>
          <View style={styles.listItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                <AccountProfileSvgComponent />
                <View style={{ flexDirection: "column" }}>
                  <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                    Full name
                  </AppText>
                  <AppText styles={{ fontSize: 12, marginLeft: 10, textTransform: "uppercase" }}>{userAuthentication.fullname}</AppText>
                </View>
              </View>

              <View>
                <AntDesign name="right" color="grey" size={20} />
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
        {/** End Full name */}
        <Separator />

        {/** UID */}
        <TouchableNativeFeedback>
          <View style={styles.listItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                <AccountProfileSvgComponent />
                <View style={{ flexDirection: "column" }}>
                  <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                    UID
                  </AppText>
                  <AppText styles={{ fontSize: 12, marginLeft: 10, textTransform: "uppercase" }}>{userAuthentication.user_uid}</AppText>
                </View>
              </View>

              <View>
                <AntDesign name="right" color="grey" size={20} />
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
        {/** End UID */}

        <Separator />

        {/** Email */}
        <TouchableNativeFeedback
          onPress={() => {
            if (userAuthentication.email == "") {
              navigation.navigate("Email");
            }
          }}
        >
          <View style={styles.listItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                <EmailSvgComponent />
                <View style={{ flexDirection: "column" }}>
                  <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                    Email
                  </AppText>
                  <AppText styles={{ fontSize: 12, marginLeft: 10, color: `${userAuthentication.email == "" ? "red" : "green"}` }}>{`${
                    userAuthentication.email == "" ? "Update your email address" : `${userAuthentication.email}`
                  }`}</AppText>
                </View>
              </View>

              <View>
                <AntDesign name="right" color="grey" size={20} />
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
        {/** End Email */}

        <Separator />

        {/** KYC */}
        <TouchableNativeFeedback onPress={() => navigation.navigate("Kyc")}>
          <View style={styles.listItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                <KycSvgComponent />
                <View style={{ flexDirection: "column" }}>
                  <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                    KYC status
                  </AppText>
                  <AppText
                    styles={{
                      fontSize: 12,
                      marginLeft: 10,
                      textTransform: "capitalize",
                      color: `${userAuthentication.kyc_verified == "UNVERIFIED" ? "red" : `${userAuthentication.kyc_verified == "VERIFIED" ? "green" : "#B76E79"}`}`,
                    }}
                  >
                    {userAuthentication.kyc_verified}
                  </AppText>
                </View>
              </View>

              <View>
                <AntDesign name="right" color="grey" size={20} />
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
        {/** End KYC */}

        <Separator />

        {/** QR code */}
        <TouchableNativeFeedback onPress={() => navigation.navigate("QRcode")}>
          <View style={styles.listItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                <QrCodeSvgComponent />
                <View style={{ flexDirection: "column" }}>
                  <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                    QR code
                  </AppText>
                  <AppText styles={{ fontSize: 12, marginLeft: 10 }}>View QR code</AppText>
                </View>
              </View>

              <View>
                <AntDesign name="right" color="grey" size={20} />
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
        {/** End QR code */}

        <Separator />

        {/** Link Business */}
        <TouchableNativeFeedback
          onPress={() => {
            if (userAuthentication.linked_business_status == "UNLINKED") {
              navigation.navigate("BusinessLink");
            }
          }}
        >
          <View style={styles.listItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                <BusinessSvgComponent />
                <View style={{ flexDirection: "column" }}>
                  <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                    VetroPay Business
                  </AppText>
                  <AppText styles={{ fontSize: 12, marginLeft: 10, color: `${userAuthentication.linked_business_status == "UNLINKED" ? "black" : "green"}` }}>
                    {`${
                      userAuthentication.linked_business_status == "UNLINKED"
                        ? "Link Business account"
                        : `${userAuthentication.linked_business_status == "AWAITING" ? "Request Awaiting Approval" : `${userAuthentication.linked_business_name}`.toUpperCase()}`
                    }`}
                  </AppText>
                </View>
              </View>

              <View>
                <AntDesign name="right" color="grey" size={20} />
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
        {/** End Link Business */}

        <Separator />

        {/** Password */}
        <TouchableNativeFeedback onPress={() => navigation.navigate("ChangePasswordPin")}>
          <View style={styles.listItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                <UserPinSvgComponent />
                <View style={{ flexDirection: "column" }}>
                  <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                    Change Password/Pin
                  </AppText>
                </View>
              </View>

              <View>
                <AntDesign name="right" color="grey" size={20} />
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
        {/** End QR code */}

        <Separator />

        {/** Delete User Account */}
        <TouchableNativeFeedback
          onPress={() => alertPreDelete()}
          onLongPress={() => {
            alertDeleteUserAccount();
          }}
        >
          <View style={styles.listItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                <View style={{ backgroundColor: "#DC3545", height: 26, width: 26, borderRadius: 13, justifyContent: "center", alignItems: "center" }}>
                  <MaterialIcons name="delete" size={15} color="#FFFFFF" />
                </View>
                <View style={{ flexDirection: "column" }}>
                  <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                    Request Account Deletion
                  </AppText>
                  {/* <AppText styles={{ fontSize: 12, marginLeft: 10 }}>See you soon</AppText> */}
                </View>
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
        {/** End Delete User Account */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F8",
  },
  separator: {
    marginVertical: 2,
    marginLeft: "10%",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  listContainer: {
    backgroundColor: "#FFFFFF",
    marginTop: 30,
    elevation: 2,
  },

  listItem: {
    height: 50,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
});
