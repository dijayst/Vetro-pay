import React, { useState } from "react";
import { useSelector } from "react-redux";
import { View, StyleSheet, TouchableOpacity, Share, Modal } from "react-native";
import { PrimaryButton } from "../resources/AppButton";
import QRCode from "react-native-qrcode-svg";
import AppText from "../resources/AppText";
import { Entypo, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

export default function ReceiveFund() {
  const [modalOpen, setModalOpen] = useState(false);
  const [qrRef, setQrRef] = useState({});
  const userAuthentication = useSelector((state) => state.authentication.user);

  const shareUID = async () => {
    try {
      const result = await Share.share({
        message: `My VetroPay UID: ${userAuthentication.user_uid}`,
      });
    } catch (error) {
      Alert.alert("Error", "Error sending details");
    }
  };

  const shareAccountDetails = async () => {
    try {
      const result = await Share.share({
        message: `Providus Bank \n\nAcct No: ${userAuthentication.nuban} \nName: ${userAuthentication.fullname}`,
      });
    } catch (error) {
      Alert.alert("Error", "Error sending details");
    }
  };

  return (
    <View style={styles.container}>
      <Modal transparent visible={modalOpen} animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)", height: 1000 }}>
          <View style={{ ...styles.modalContent, borderColor: "#266ddc", borderWidth: 2 }}>
            {/** Modal Header */}
            <View style={{ marginTop: 16, flexDirection: "row", justifyContent: "space-between" }}>
              <AppText bold="true" styles={{ fontSize: 18 }}>
                QR Code
              </AppText>
              <MaterialIcons
                color="grey"
                name="close"
                size={24}
                onPress={() => {
                  setModalOpen(false);
                }}
                style={{ paddingRight: 10 }}
              />
            </View>
            {/** End Modal Header */}

            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <QRCode value={`${userAuthentication.phone_number}`} size={200} bgColor="#FFFFFF" fgColor="#000000" getRef={(qrRef) => setQrRef(qrRef)} />
            </View>
          </View>
        </View>
      </Modal>
      <View style={{ marginTop: 16, paddingHorizontal: 10 }}>
        <View style={{ flexDirection: "row" }}>
          <Entypo name="arrow-bold-right" size={24} color="green" />
          <AppText bold="true" styles={{ fontSize: 16 }}>
            From a VetroPay User:
          </AppText>
        </View>

        <AppText styles={{ fontSize: 16 }}>Simply Share your Phone Number, VetroPay Unique-ID or QR Code</AppText>

        <View style={{ marginTop: 8, marginBottom: 8, alignItems: "center", flexDirection: "row", justifyContent: "space-evenly" }}>
          <PrimaryButton onPress={() => shareUID()}>
            <AppText bold="true" styles={{ color: "#fff", fontSize: 16 }}>
              Share UID
            </AppText>
          </PrimaryButton>

          <PrimaryButton onPress={() => setModalOpen(true)}>
            <AppText bold="true" styles={{ color: "#fff", fontSize: 16 }}>
              Open QR
            </AppText>
          </PrimaryButton>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: "row" }}>
            <Entypo name="arrow-bold-right" size={24} color="green" />
            <AppText bold="true" styles={{ fontSize: 16 }}>
              From a Non-VetroPay User:
            </AppText>
          </View>
          <AppText styles={{ fontSize: 16 }}>Share your Vetropay-Providus Bank Account Number</AppText>

          {/**Bank Details */}
          <View style={{ marginTop: 10, height: 100, backgroundColor: "#ffffff", alignItems: "center", justifyContent: "center", elevation: 4, borderRadius: 15 }}>
            <AppText bold="true" styles={{ fontSize: 18, textAlign: "center" }}>
              Bank: Providus Bank
            </AppText>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
              <AppText bold="true" styles={{ fontSize: 18, textAlign: "center" }}>
                Number: {userAuthentication.nuban}
              </AppText>
              <TouchableOpacity onPress={() => shareAccountDetails()}>
                <View>
                  <MaterialCommunityIcons name="content-copy" style={{ marginLeft: 5 }} size={30} color="#266ddc" />
                </View>
              </TouchableOpacity>
            </View>
            <AppText bold="true" styles={{ fontSize: 18, textAlign: "center", color: "#266ddc", textTransform: "capitalize" }}>
              {userAuthentication.fullname}
            </AppText>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <AppText>Don't keep family {"&"} friends away from VetroPay. Invite one today!</AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    marginTop: 80,
    borderRadius: 5,
    maxHeight: 500,
    marginLeft: 20,
    marginRight: 20,
    paddingHorizontal: 10,
    backgroundColor: "#F0F0F8",
  },
});
