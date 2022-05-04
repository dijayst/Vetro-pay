import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Modal } from "react-native";
import AppText from "../../resources/AppText";

const DSTVlogo = require("../../assets/logos/dstv.png");
const GOTVLogo = require("../../assets/logos/gotv.jpg");
const StartimesLogo = require("../../assets/logos/startimes.png");
import { MaterialIcons } from "@expo/vector-icons";

import TvDstv from "./TvDstv";
import TvGotv from "./TvGotv";
import TvStartimes from "./TvStartimes";

export default function Tv() {
  const [modalOpen, setModalOpen] = useState(false);
  const [tvProvider, setTvProvider] = useState("");

  const renderModalContent = () => {
    if (tvProvider == "DSTV") {
      return <TvDstv />;
    } else if (tvProvider == "GOTV") {
      return <TvGotv />;
    } else if (tvProvider == "STARTIMES") {
      return <TvStartimes />;
    }
  };

  const openModalFunction = (provider) => {
    setTvProvider(provider);
    setModalOpen(true);
  };

  return (
    <View style={styles.container}>
      <Modal transparent visible={modalOpen} animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)", height: 1000 }}>
          <MaterialIcons name="close" size={24} onPress={() => setModalOpen(false)} style={styles.modalClose} />

          {renderModalContent()}
        </View>
      </Modal>
      <View style={styles.innerContainer}>
        <AppText bold="true" styles={{ marginTop: 10, fontSize: 16, marginBottom: 5 }}>
          Select cable provider
        </AppText>
        <View>
          <TouchableOpacity onPress={() => openModalFunction("DSTV")} style={styles.tvCard}>
            <Image style={styles.logos} source={DSTVlogo} />
            <AppText bold="true" styles={{ fontSize: 16 }}>
              DSTV
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => openModalFunction("GOTV")} style={styles.tvCard}>
            <Image style={styles.logos} source={GOTVLogo} />
            <AppText bold="true" styles={{ fontSize: 16 }}>
              GOTV
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => openModalFunction("STARTIMES")} style={styles.tvCard}>
            <Image style={styles.logos} source={StartimesLogo} />
            <AppText bold="true" styles={{ fontSize: 16 }}>
              Startimes
            </AppText>
          </TouchableOpacity>
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
  innerContainer: {
    marginHorizontal: 10,
  },
  logos: {
    width: 55,
    height: 40,
  },
  tvCard: {
    backgroundColor: "#ffffff",
    elevation: 3,
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
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
  modalClose: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    padding: 10,
    borderRadius: 4,
    alignSelf: "center",
    elevation: 4,
    backgroundColor: "#FFFFFF",
  },
});
