import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, TextInput, StyleSheet, TouchableOpacity, Image, Pressable } from "react-native";
import AppText from "../../resources/AppText";
import { toastColorObject } from "../../resources/rStyledComponent";
import { useToast, Box, Text as NativeBaseText, Spinner } from "native-base";
import { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { postVerificationId } from "../../containers/authentication/action";
import { usePrevious } from "../../resources/utils";
import { getBank } from "../../containers/banks/action";

const KYC_VERIFIED_COLOR = {
  UNVERIFIED: {
    backgroundColor: "#F2C94C",
    color: "#32363F",
  },

  PROCESSING: {
    backgroundColor: "#F2C94C",
    color: "#32363F",
  },

  VERIFIED: {
    backgroundColor: "#198754",
    color: "#f2f2f2",
  },
};

function Separator() {
  return <View style={styles.separator} />;
}

export default function Kyc({ navigation }) {
  const toast = useToast();
  const dispatch = useDispatch();
  const [verificationId, setVerificationId] = useState("");
  const [displaySpinner, setDisplaySpinner] = useState(false);

  const userAuthentication = useSelector((state) => state.authentication.user);
  const userBank = useSelector((state) => state.banks.banks);
  const documentVerificationResponse = useSelector((state) => state.authentication.documentVerification);
  const prevDocumentVerificationResponse = usePrevious(documentVerificationResponse);

  useEffect(() => {
    dispatch(getBank());
  }, []);

  useEffect(() => {
    if (displaySpinner && documentVerificationResponse.length != prevDocumentVerificationResponse?.length) {
      console.log({ documentVerificationResponse });
      if (documentVerificationResponse[documentVerificationResponse.length - 1]?.status == "success") {
        navigation.goBack();
      } else {
        setDisplaySpinner(false);
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>{documentVerificationResponse[documentVerificationResponse.length - 1]?.message}</NativeBaseText>
            </Box>
          ),
        });
      }
    }
  }, [documentVerificationResponse]);
  const postVerificationID = () => {
    if (verificationId.replace(/\s/g, "") == "" || verificationId.length !== 11) {
      let message;
      if (verificationId.replace(/\s/g, "") == "") {
        message = "Ensure you entered a valid BVN";
      } else {
        message = "BVN incomplete or format incorrect";
      }
      toast.show({
        render: () => (
          <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
            <NativeBaseText style={{ color: "#FFFFFF" }}>{message}</NativeBaseText>
          </Box>
        ),
      });
    } else {
      //
      setDisplaySpinner(true);
      dispatch(postVerificationId(verificationId));
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 16, paddingHorizontal: 10 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 10 }}>
          <AppText bold="true">KYC status</AppText>
          <AppText
            bold="true"
            styles={{
              width: 100,
              paddingBottom: 2,
              textAlign: "center",
              color: KYC_VERIFIED_COLOR[userAuthentication.kyc_verified]["color"],
              textTransform: "uppercase",
              borderRadius: 10,
              backgroundColor: KYC_VERIFIED_COLOR[userAuthentication.kyc_verified]["backgroundColor"],
              textTransform: "uppercase",
            }}
          >
            {userAuthentication.kyc_verified}
          </AppText>
        </View>
        <Separator />

        {/** Note */}
        {/* <View style={{ marginTop: 10 }}>
          <AppText styles={{ fontSize: 16 }}>
            To update/verify your KYC - Know Your Customer status; Please send an Email ("with the verified email address on your vetropay account") to{" "}
            <Text style={{ fontWeight: "700" }}>customercare@vetropay.com</Text>{" "}
          </AppText>

          <AppText styles={{ fontSize: 16, marginTop: 10 }}>
            Email Subject: <Text style={{ fontWeight: "700" }}>VetroPay KYC: {userAuthentication.fullname}</Text>
          </AppText>
          <AppText styles={{ fontSize: 16, marginTop: 10 }}>Email body should contain the following:</AppText>
          <AppText bold="true" styles={{ marginLeft: 10 }}>
            {">>>"} Country of Domicile
          </AppText>
          <AppText bold="true" styles={{ marginLeft: 10 }}>
            {">>>"} Full Name
          </AppText>
          <AppText bold="true" styles={{ marginLeft: 10 }}>
            {">>>"} If you are Nigerian; Bank Verification Number
          </AppText>
          <AppText bold="true" styles={{ marginLeft: 10 }}>
            {">>>"} An attachment of a current and valid ID card e.g National ID card, International Passport, Voter's Card, Driving License, Student ID card.
          </AppText>
        </View> */}

        {userAuthentication.kyc_verified == "UNVERIFIED" && (
          <View style={{ marginTop: 10 }}>
            <View style={{ marginTop: 15 }}>
              <AppText>Your Verification ID</AppText>
              <TextInput
                style={{ ...styles.textInput, marginTop: 10 }}
                placeholder="Enter BVN"
                placeholderTextColor="gray"
                keyboardType="numeric"
                value={verificationId}
                onChangeText={(value) => setVerificationId(value)}
              />
            </View>

            <View style={{ backgroundColor: "lightblue", padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "center" }}>
              <AntDesign name="infocirlce" size={20} color="#198754" style={{ marginTop: 5 }} />
              <AppText bold styles={{ color: "#040404", lineHeight: 22, marginLeft: 10 }}>
                BVN {"&"} Documents verification takes about 12 - 24 hrs to complete. This process allows you to adequately enjoy our services better. Our verification includes:
                existing loan check, bad debt history, name verification etc.
              </AppText>
            </View>

            <View style={{ marginTop: 10, backgroundColor: "lightblue", padding: 10, borderRadius: 10, flexDirection: "row" }}>
              <AppText bold styles={{ color: "#040404", lineHeight: 22, marginLeft: 10 }}>
                Verification Fee: ₦50
              </AppText>
            </View>

            {!displaySpinner ? (
              <TouchableOpacity
                onPress={() => {
                  postVerificationID();
                }}
                style={{ width: "100%", backgroundColor: "#266ddc", marginTop: 20, justifyContent: "center", height: 45, borderRadius: 5, alignItems: "center" }}
              >
                <AppText styles={{ color: "#ffffff", fontSize: 16 }} bold>
                  Verify Account
                </AppText>
              </TouchableOpacity>
            ) : (
              <View style={{ justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                <Spinner size="lg" color="#266ddc" />
              </View>
            )}
          </View>
        )}

        {userAuthentication.kyc_verified == "PROCESSING" && (
          <View style={{ marginTop: 10 }}>
            <View style={{ marginTop: 15 }}>
              <AppText styles={{ textAlign: "center" }}>Your KYC input is being processed.</AppText>
              {!userBank?.data?.bank_name && (
                <Pressable onPress={() => navigation.navigate("LinkBank")}>
                  <AppText bold styles={{ textAlign: "center", marginTop: 5 }}>
                    Click{" "}
                    <AppText bold styles={{ fontSize: 18 }}>
                      HERE
                    </AppText>{" "}
                    to Add a Bank Account.
                  </AppText>
                </Pressable>
              )}
              <Image
                source={{ uri: "https://res.cloudinary.com/ancla8techs4/image/upload/v1662846199/vetropay/waiting_verification_hsme2y.png" }}
                style={{ width: 200, height: 200, alignSelf: "center", marginTop: 20 }}
              />
            </View>
          </View>
        )}

        {userAuthentication.kyc_verified == "VERIFIED" && (
          <View style={{ marginTop: 10 }}>
            <View style={{ marginTop: 15 }}>
              <AppText styles={{ textAlign: "center" }}>Your Verification ID is approved</AppText>
              <Image
                source={{ uri: "https://res.cloudinary.com/ancla8techs4/image/upload/v1662847407/vetropay/Ok-amico_aahcul.png" }}
                style={{ width: 200, height: 200, alignSelf: "center", marginTop: 20 }}
              />
            </View>
          </View>
        )}

        {/** End Note */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    marginVertical: 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  textInput: {
    height: 45,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 0.5,
    borderColor: "#266ddc",
    borderRadius: 10,
    borderBottomColor: "#266DDC",
  },
});
