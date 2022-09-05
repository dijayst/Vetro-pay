import React, { useState } from "react";
import { useSelector } from "react-redux";
import { View, StyleSheet, TouchableOpacity, Image, Text, Modal } from "react-native";
import { PrimaryButton } from "../resources/AppButton";
import AppText from "../resources/AppText";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Circle } from "react-native-svg";
import { Entypo } from "@expo/vector-icons";
import WalletImage from "../assets/wallet.png";
import { SafeAreaView } from "../resources/rStyledComponent";

export default function ReceiveFund() {
  const userAuthentication = useSelector((state) => state.authentication.user);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <SafeAreaView/>
        <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
          <AppText bold>CREDIT SCORE</AppText>

          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 15 }}>
            <View style={{ ...styles.creditBox, backgroundColor: "#f85b5b" }}>
              <AppText bold styles={styles.creditBoxText}>
                350-600
              </AppText>
            </View>
            <View style={{ ...styles.creditBox, backgroundColor: "#f8bb3b" }}>
              <AppText bold styles={styles.creditBoxText}>
                600 - 689
              </AppText>
            </View>
            <View style={{ ...styles.creditBox, backgroundColor: "#40ad87" }}>
              <AppText bold styles={styles.creditBoxText}>
                690 - 719
              </AppText>
            </View>
            <View style={{ ...styles.creditBox, backgroundColor: "#328256" }}>
              <AppText bold styles={styles.creditBoxText}>
                720 - 850
              </AppText>
            </View>
          </View>

          <View style={{ marginVertical: 20 }}>
            <AppText>VetroPay Credit scores estimate your likelihood of repaying new debt. Scores of 690 or above are considered good credit.</AppText>

            <AppText styles={{ marginTop: 7 }}>A higher score gives you access to more credit products — and at lower interest rates.</AppText>

            <AppText styles={{ marginTop: 7 }}>Borrowers with scores above 689 have many options, including the ability to qualify for 0% interest rate on our loans.</AppText>

            <AppText styles={{ marginTop: 7 }}>
              VetroPay also partners with other businesses {"&"} lending companies to bring you their best loan offers at competitive interest rates.
            </AppText>

            <AppText styles={{ marginTop: 20 }} bold>
              HOW TO BUILD CREDIT SCORE?
            </AppText>
            <AppText styles={{ marginTop: 7 }}>
              It's simple! Keep using the Vetropay platform for ALL your transactions. Our A.I system aggregrates data performance weekly, monthly to determine your score
              periodically.
            </AppText>

            <AppText bold styles={{ marginTop: 7, fontSize: 16 }}>
              Enjoy up to ₦50k interest free credit per month.
            </AppText>
          </View>
          <PrimaryButton onPress={() => setModalVisible(false)} styles={{ width: "80%", alignSelf: "center" }}>
            <AppText bold styles={{ color: "#FFFFFF" }}>
              Build up your credit score
            </AppText>
          </PrimaryButton>
        </View>
      </Modal>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 30 }}>
        <Image source={WalletImage} style={{ width: 60, height: 60, resizeMode: "contain" }} />
        <View style={{ marginLeft: 7 }}>
          <AppText bold styles={{ fontSize: 15 }}>
            Available Credit: ₦0.00
          </AppText>
          <AppText>0% Interest rate/mo.</AppText>
        </View>
      </View>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={{ justifyContent: "center", alignItems: "center", marginTop: 10 }}>
        <AnimatedCircularProgress
          size={200}
          width={19}
          fill={35}
          tintColor="#00e0ff"
          onAnimationComplete={() => console.log("onAnimationComplete")}
          backgroundColor="#577fab"
          renderCap={({ center }) => <Circle cx={center.x} cy={center.y} r="5" fill="#266ddc" />}
        >
          {(fill) => (
            <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <AppText styles={{ fontSize: 18 }}>300 Points</AppText>
              <Entypo name="info-with-circle" size={24} color="#266ddc" style={{ marginTop: 5 }} />
            </View>
          )}
        </AnimatedCircularProgress>
      </TouchableOpacity>

      <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
        <AppText bold styles={{ fontSize: 20 }}>
          History
        </AppText>

        <View style={{ marginTop: 30, justifyContent: "center", alignItems: "center" }}>
          <Image
            source={{ uri: "https://cdn.iconscout.com/icon/free/png-256/google-docs-2038784-1721674.png" }}
            style={{ opacity: 0.5, height: 100, width: 100, resizeMode: "contain" }}
          />
          <AppText styles={{ textAlign: "center", fontWeight: "400", marginTop: 10 }}>You don't have any credit transaction yet. Keep enjoying VetroPay.</AppText>
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
  creditBox: {
    width: 80,
    height: 40,
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
  },
  creditBoxText: {
    color: "#2e2d2d",
  },
});

{
  /**
https://www.nerdwallet.com/article/finance/credit-score-ranges-and-how-to-improve
https://www.reddit.com/r/explainlikeimfive/comments/3i3e54/eli5_why_do_credit_scores_start_at_300/
*/
}
