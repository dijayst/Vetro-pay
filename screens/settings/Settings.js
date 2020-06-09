import React, { useRef } from "react";
import { Text, View, StyleSheet, TouchableNativeFeedback } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AppText from "../../resource/AppText";
import { SendMoneySvgComponent, ScanQRComponent } from "../../resource/Svg";
import RBSheet from "react-native-raw-bottom-sheet";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

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
                <SendMoneySvgComponent />
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
        {/**Help */}
        <TouchableNativeFeedback onPress={() => navigation.navigate("Help")}>
          <View style={styles.listItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                <SendMoneySvgComponent />
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
        <TouchableNativeFeedback onPress={() => refRBSheet.current.open()}>
          <View style={styles.listItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                <ScanQRComponent />
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

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
          },
          draggableIcon: {
            backgroundColor: "#266ddc",
          },
        }}
      >
        <View>
          <AppText styles={{ textAlign: "center", fontSize: 16 }}>Love Vetropay? Share with a friend</AppText>

          <View style={{ justifyContent: "space-evenly", marginTop: 10, flexDirection: "row" }}>
            {/**whatsapp facebook twitter linkedin, reddit */}
            <View style={{ backgroundColor: "#4FCE5D", width: 50, height: 50, justifyContent: "center", alignItems: "center", borderRadius: 10, elevation: 4 }}>
              <FontAwesome name="whatsapp" color="#ffffff" size={40} />
            </View>
            <View style={{ backgroundColor: "#3b5998", width: 50, height: 50, justifyContent: "center", alignItems: "center", borderRadius: 10, elevation: 4 }}>
              <FontAwesome name="facebook" color="#ffffff" size={40} />
            </View>

            <View style={{ backgroundColor: "#00aced", width: 50, height: 50, justifyContent: "center", alignItems: "center", borderRadius: 10, elevation: 4 }}>
              <FontAwesome name="twitter" color="#ffffff" size={40} />
            </View>

            <View style={{ backgroundColor: "#007bb6", width: 50, height: 50, justifyContent: "center", alignItems: "center", borderRadius: 10, elevation: 4 }}>
              <FontAwesome name="linkedin" color="#ffffff" size={40} />
            </View>

            <View style={{ backgroundColor: "#517fa4", width: 50, height: 50, justifyContent: "center", alignItems: "center", borderRadius: 10, elevation: 4 }}>
              <MaterialIcons name="content-copy" color="#ffffff" size={30} />
            </View>
          </View>
        </View>
      </RBSheet>
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
