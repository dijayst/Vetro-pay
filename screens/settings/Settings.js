import React, { useRef } from "react";
import { Text, View, StyleSheet, TouchableNativeFeedback, Share, Alert } from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import AppText from "../../resources/AppText";
import { AccountProfileSvgComponent, HelpSvgComponent, InviteFriendSvgComponent } from "../../resources/Svg";

const onShare = async () => {
  try {
    const result = await Share.share({
      message:
        "Hi there, \n\nHave you tried *VetroPay*; a bill payment plattform and a personal financial accountant all in one. I think you'd love it. \n\nDownload here: https://ancl.at/vetropay",
    });
  } catch (error) {
    Alert.alert("Error", "Error sending invite");
  }
};

function Separator() {
  return <View style={styles.separator} />;
}

export default function Settings({ navigation }) {
  const refRBSheet = useRef();
  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        {/** Account Information */}
        <TouchableNativeFeedback onPress={() => navigation.navigate("Account")}>
          <View style={styles.listItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                <AccountProfileSvgComponent />
                <View style={{ flexDirection: "column" }}>
                  <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                    Account
                  </AppText>
                  <AppText styles={{ fontSize: 12, marginLeft: 10 }}>Profile information, QR code, KYC</AppText>
                </View>
              </View>

              <View>
                <AntDesign name="right" color="grey" size={20} />
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
        {/** End Account Information */}

        <Separator />
        {/**Linked Cards */}
        <TouchableNativeFeedback onPress={() => navigation.navigate("Help")}>
          <View style={styles.listItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                <View style={{ backgroundColor: "#266ddc", height: 26, width: 26, borderRadius: 13, justifyContent: "center", alignItems: "center" }}>
                  <FontAwesome name="credit-card-alt" size={13} color="#FFFFFF" />
                </View>
                <View style={{ flexDirection: "column" }}>
                  <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                    Cards
                  </AppText>
                  <AppText styles={{ fontSize: 12, marginLeft: 10 }}>Linked debit cards</AppText>
                </View>
              </View>

              <View>
                <AntDesign name="right" color="grey" size={20} />
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
        {/**End Linked Cards */}

        <Separator />
        {/**Help */}
        <TouchableNativeFeedback onPress={() => navigation.navigate("Help")}>
          <View style={styles.listItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                <HelpSvgComponent />
                <View style={{ flexDirection: "column" }}>
                  <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                    Help
                  </AppText>
                  <AppText styles={{ fontSize: 12, marginLeft: 10 }}>FAQ, Contact us, Privacy policy</AppText>
                </View>
              </View>

              <View>
                <AntDesign name="right" color="grey" size={20} />
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
        {/** End Help */}

        <Separator />

        {/** Invite a friend */}
        <TouchableNativeFeedback onPress={() => onShare()}>
          <View style={styles.listItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                <InviteFriendSvgComponent />
                <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                  Invite a friend
                </AppText>
              </View>

              {/** 
              <View>
                <AntDesign name="right" color="grey" size={20} /> 
              </View>*/}
            </View>
          </View>
        </TouchableNativeFeedback>
        {/** End Invite a friend */}
      </View>
      <View style={{ marginTop: 80 }}>
        <AppText styles={{ textAlign: "center" }}>Láti ọwọ</AppText>
        <AppText bold="true" styles={{ textAlign: "center", textTransform: "uppercase", marginTop: 5 }}>
          Ancla Technologies
        </AppText>
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
