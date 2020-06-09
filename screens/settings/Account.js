import React from "react";
import { useSelector } from "react-redux";
import { Text, View, StyleSheet, TouchableNativeFeedback } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AppText from "../../resource/AppText";
import { SendMoneySvgComponent, ScanQRComponent } from "../../resource/Svg";

function Separator() {
  return <View style={styles.separator} />;
}

export default function Account({ navigation }) {
  const userAuthentication = useSelector((state) => state.authentication.user);

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        {/** Full name */}
        <TouchableNativeFeedback>
          <View style={styles.listItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                <SendMoneySvgComponent />
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
                <SendMoneySvgComponent />
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
                <SendMoneySvgComponent />
                <View style={{ flexDirection: "column" }}>
                  <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                    KYC status
                  </AppText>
                  <AppText
                    styles={{
                      fontSize: 12,
                      marginLeft: 10,
                      textTransform: "capitalize",
                      color: `${userAuthentication.kyc_verified == "UNVERIFIED" ? "red" : `${userAuthentication.kyc_verified == "VERIFIED" ? "green" : "yellow"}`}`,
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
                <SendMoneySvgComponent />
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

        {/** Password */}
        <TouchableNativeFeedback onPress={() => navigation.navigate("ChangePasswordPin")}>
          <View style={styles.listItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                <SendMoneySvgComponent />
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
