import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";

import { View, Text, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import AppText from "../../resource/AppText";
import { AppButton } from "../../resource/AppButton";
import { Toast } from "native-base";
import { CameraRoll } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";

export default function QRcode() {
  const [qrRef, setQrRef] = useState({});

  const userAuthentication = useSelector((state) => state.authentication.user);
  const saveQtToDisk = () => {
    //
  };

  return (
    <View style={styles.container}>
      <QRCode value={`${userAuthentication.phone_number}`} size={200} bgColor="#FFFFFF" fgColor="#000000" getRef={(qrRef) => setQrRef(qrRef)} />
      <View style={{ marginTop: 20, justifyContent: "center", alignItems: "center" }}>
        <AppButton styles={{ width: 150, backgroundColor: "#266ddc", height: 40, borderRadius: 4, justifyContent: "center", alignItems: "center" }} onPress={() => saveQtToDisk()}>
          <AppText bold="true" styles={{ color: "#fff", fontSize: 16 }}>
            Save to galley
          </AppText>
        </AppButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
  },
});
