import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Clipboard, Share } from "react-native";
import { useSelector } from "react-redux";
import QRCode from "react-native-qrcode-svg";
import AppText from "../../resources/AppText";
import { Feather, MaterialIcons } from "@expo/vector-icons";
const VetroPayLogo = require("../../assets/icon.png");
import { toastColorObject } from "../../resources/rStyledComponent";
import { useToast, Box, Text as NativeBaseText } from "native-base";

export default function Receive() {
  const toast = useToast();
  const usdtTransactions = useSelector((state) => state.blockchain.usdt);
  const [qrRef, setQrRef] = useState({});

  const copyToClipBoard = () => {
    Clipboard.setString(`${usdtTransactions?.address?.base58}`);
    toast.show({
      render: () => (
        <Box bg={toastColorObject["success"]} px="2" py="2" rounded="sm" mb={5}>
          <NativeBaseText style={{ color: "#FFFFFF" }}>Copied to clipboard</NativeBaseText>
        </Box>
      ),
    });
  };

  const shareWalletAddress = async () => {
    try {
      const result = await Share.share({
        message: `My Public Address to receive USDT (TRC20):\n${usdtTransactions?.address?.base58}`,
      });
    } catch (error) {
      Alert.alert("Error", "Error sending details");
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, margin: 10 }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={styles.qrcodeContainer}>
            {/** COMPANY LOGO */}
            <Image source={VetroPayLogo} style={{ width: 70, height: 70, marginBottom: 5 }} />
            {/** COMPANY LOGO */}

            <QRCode value={`${usdtTransactions?.address?.base58}`} size={200} bgColor="#FFFFFF" fgColor="#000000" getRef={(qrRef) => setQrRef(qrRef)} />

            <AppText styles={{ marginTop: 15, fontSize: 12 }}>{usdtTransactions?.address?.base58}</AppText>
          </View>
        </View>
      </View>
      <View style={{ height: 120, marginBottom: 10, paddingHorizontal: 10, justifyContent: "center", alignItems: "center" }}>
        <AppText>
          Send only <AppText bold>Tether (TRC20)</AppText> to this address.
        </AppText>

        <View style={{ marginTop: 10, flexDirection: "row", width: 150, alignSelf: "center", justifyContent: "space-between" }}>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity onPress={() => copyToClipBoard()} style={styles.actionIconContainer}>
              <Feather name="copy" size={24} color="#f2f2f2" />
            </TouchableOpacity>
            <AppText bold>Copy</AppText>
          </View>

          <View style={{ alignItems: "center" }}>
            <TouchableOpacity onPress={() => shareWalletAddress()} style={{ ...styles.actionIconContainer, backgroundColor: "rgba(38, 109, 220, 0.5)" }}>
              <MaterialIcons name="share" size={24} color="black" />
            </TouchableOpacity>
            <AppText bold>Share</AppText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  qrcodeContainer: {
    padding: 10,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  actionIconContainer: {
    backgroundColor: "rgb(38, 109, 220)",
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
