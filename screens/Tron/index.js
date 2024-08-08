import {
  StyleSheet,
  Image,
  View,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import AppText from "../../resources/AppText";
import {
  MaterialCommunityIcons,
  AntDesign,
  Feather,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { convertEpochToLocalDate } from "../../resources/utils/MetaFunctions";
import { Spinner } from "native-base";
import { toastColorObject } from "../../resources/rStyledComponent";
import { useToast, Box, Text as NativeBaseText } from "native-base";
import {
  calculateBandwithOrEnergy,
  customTrxWithCommas,
  numberWithCommas,
} from "../../resources/utils";

export default function index({
  navigation,
  selectedCurrency,
  bottomSheetRef,
}) {
  const toast = useToast();
  const trxTransactions = useSelector((state) => state.blockchain.trx);

  const alertUserToAwaitLoading = () => {
    toast.show({
      render: () => (
        <Box bg={toastColorObject["warning"]} px="2" py="2" rounded="sm" mb={5}>
          <NativeBaseText style={{ color: "#FFFFFF" }}>
            Connecting...
          </NativeBaseText>
        </Box>
      ),
    });
  };

  const geTrxTransactionNote = (data) => {
    const transaction = data["raw_data"]["contract"][0];
    const transactionType = transaction?.type;
    if (transactionType == "TransferContract") {
      if (
        transaction?.parameter?.value.owner_address ==
        trxTransactions?.address?.hex
      ) {
        return {
          type: "debit",
          amount: transaction?.parameter?.value?.amount / 1000000,
          message: `To ${transaction?.parameter?.value.to_address}`,
        };
      } else {
        return {
          type: "credit",
          amount: transaction?.parameter?.value?.amount / 1000000,
          message: `From ${transaction?.parameter?.value.owner_address}`,
        };
      }
    } else if (transactionType == "TriggerSmartContract") {
      // THIS MEANS CHARGES PAID FOR A TRC20 TRANSACTIONS
      if (!transaction?.parameter?.value?.amount) {
        //MEANS THIS TRANSACTION DOESN'T HAVE IT'S OWN AMOUNT INDEPENDENTLY
        return {
          type: "debit",
          amount: data["ret"][0]["fee"] / 1000000,
          message: `To ${transaction?.parameter?.value.owner_address}`,
        };
      }
    } else if (transactionType == "FreezeBalanceContract") {
      return {
        type: "debit",
        amount:
          data["raw_data"]["contract"][0]["parameter"]["value"][
            "frozen_balance"
          ] / 1000000,
        message: `To ${transaction?.parameter?.value.owner_address}`,
      };
    }
  };

  return (
    <Fragment>
      <View
        style={{
          backgroundColor: "#266ddc",
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
          paddingBottom: 30,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 15,
          }}
        >
          <View>
            <AppText
              bold="true"
              styles={{
                fontSize: 14,
                color: "#f2f2f2",
                marginTop: StatusBar.currentHeight + 10,
              }}
            >
              Balance
            </AppText>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
              }}
            >
              <MaterialIcons
                name="account-balance-wallet"
                size={24}
                color="#f2f2f2"
                style={{ alignSelf: "flex-start" }}
              />
              <View>
                <AppText
                  bold="true"
                  styles={{ fontSize: 18, color: "#f2f2f2", marginLeft: 5 }}
                >
                  TRX{" "}
                  {customTrxWithCommas(
                    Number(trxTransactions?.balance?.balance || 0.0).toFixed(6)
                  )}
                </AppText>
                <AppText
                  bold="true"
                  styles={{ fontSize: 13, color: "#f2f2f2", marginLeft: 5 }}
                >
                  ≈ $
                  {numberWithCommas(
                    Number(
                      trxTransactions?.balance?.balance *
                        trxTransactions?.tron_value || 0
                    ).toFixed(2)
                  )}
                </AppText>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#FFFFFF",
              marginTop: StatusBar.currentHeight + 10,
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              maxHeight: 50,
            }}
            onPress={() => bottomSheetRef.current?.expand()}
          >
            <Image
              source={{ uri: selectedCurrency.icon }}
              style={{ width: 30, height: 30, resizeMode: "contain" }}
            />
            <AppText styles={{ marginHorizontal: 5 }}>
              {selectedCurrency.code}
            </AppText>
            <AntDesign
              name="down"
              size={15}
              color="black"
              style={{ alignSelf: "flex-end", marginBottom: 5 }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View style={styles.mainBoard}>
            <TouchableOpacity
              onPress={() => {
                if (trxTransactions.processing) {
                  alertUserToAwaitLoading();
                } else {
                  navigation.navigate("DepositTrx");
                }
              }}
            >
              <View style={{ ...styles.activityButton, width: 60 }}>
                <AntDesign name="pluscircleo" size={20} color="#f2f2f2" />
                <AppText styles={styles.mainBoardIconText}>Deposit</AppText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (trxTransactions.processing) {
                  alertUserToAwaitLoading();
                } else {
                  navigation.navigate("SendTrx");
                }
              }}
            >
              <View style={{ ...styles.activityButton, width: 60 }}>
                <Feather name="send" size={20} color="#f2f2f2" />
                <AppText styles={styles.mainBoardIconText}>Send</AppText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (trxTransactions.processing) {
                  alertUserToAwaitLoading();
                } else {
                  navigation.navigate("ReceiveTrx");
                }
              }}
            >
              <View style={{ ...styles.activityButton, width: 60 }}>
                <AntDesign name="download" size={20} color="#f2f2f2" />
                <AppText styles={styles.mainBoardIconText}>Receive</AppText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (trxTransactions.processing) {
                  alertUserToAwaitLoading();
                } else {
                  navigation.navigate("StakeTrx");
                }
              }}
            >
              <View style={{ ...styles.activityButton, width: 60 }}>
                <FontAwesome5 name="coins" size={24} color="#f2f2f2" />
                <AppText styles={styles.mainBoardIconText}>Freeze</AppText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/** SHOW AVAILABLE, PENDING & FRONZEN */}
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View style={styles.menuBoard}>
          <View style={{ width: "45%" }}>
            <AppText bold styles={{ fontSize: 12, color: "#0D2241" }}>
              Energy: N/A
            </AppText>
            {/** Energy Guauge */}
            <View style={{ ...styles.metricGuage }}></View>
          </View>

          <View style={{ width: "45%" }}>
            <AppText bold styles={{ fontSize: 12, color: "#0D2241" }}>
              Bandwidth:{" "}
              {
                calculateBandwithOrEnergy(
                  trxTransactions?.balance?.bandwidth,
                  "bandwidth"
                ).available
              }
              {" / "}
              {
                calculateBandwithOrEnergy(
                  trxTransactions?.balance?.bandwidth,
                  "bandwidth"
                ).total
              }
            </AppText>
            {/** Bandwidth Guauge */}
            <View>
              <View style={{ ...styles.metricGuage }}></View>
              <View
                style={{
                  ...styles.metricGuage,
                  position: "absolute",
                  backgroundColor: "#0D2241",
                  width: `${
                    (100 *
                      calculateBandwithOrEnergy(
                        trxTransactions?.balance?.bandwidth,
                        "bandwidth"
                      ).available) /
                    calculateBandwithOrEnergy(
                      trxTransactions?.balance?.bandwidth,
                      "bandwidth"
                    ).total
                  }%`,
                }}
              ></View>
            </View>
          </View>
        </View>
      </View>
      <View style={{ marginTop: 15, paddingHorizontal: 10, flex: 1 }}>
        <AppText bold styles={{ fontSize: 18, marginBottom: 5 }}>
          Transactions
        </AppText>

        {trxTransactions.processing ? (
          <View style={styles.waitingWindow}>
            <AppText>Fetching Transactions</AppText>
            <Spinner size="sm" color="grey" />
          </View>
        ) : trxTransactions?.transactions?.data.length < 1 ? (
          <View style={styles.waitingWindow}>
            <Image
              source={{
                uri: "https://res.cloudinary.com/ancla8techs4/image/upload/v1662574256/vetropay/google-docs-2038784-1721674_mnfrfa.png",
              }}
              style={{
                opacity: 0.5,
                height: 100,
                width: 100,
                resizeMode: "contain",
              }}
            />
            <AppText
              styles={{ textAlign: "center", fontWeight: "400", marginTop: 10 }}
            >
              Transactions will show here.
            </AppText>
          </View>
        ) : (
          <ScrollView style={{ marginBottom: 10 }}>
            {trxTransactions?.transactions.data
              .filter(
                (data) =>
                  data["raw_data"]["contract"][0]?.type == "TransferContract" ||
                  data["raw_data"]["contract"][0]?.type ==
                    "TriggerSmartContract" ||
                  data["raw_data"]["contract"][0]?.type ==
                    "FreezeBalanceContract"
              )
              .map((data, index) => {
                if (
                  data["raw_data"]["contract"][0]?.type ==
                  "FreezeBalanceContract"
                ) {
                  return (
                    <View
                      key={index}
                      style={{
                        marginVertical: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ width: "100%" }}>
                        <AppText styles={{ fontSize: 12 }}>
                          {convertEpochToLocalDate(data.block_timestamp)}
                        </AppText>
                        <View
                          style={{
                            marginTop: 2,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <MaterialCommunityIcons
                              name={"arrow-collapse-up"}
                              size={14}
                              color="black"
                            />
                            <AppText styles={{ fontSize: 14 }}>Freeze</AppText>
                          </View>
                          <View>
                            <AppText styles={{ color: "red" }}>
                              {" "}
                              {"-"}{" "}
                              {Number(
                                geTrxTransactionNote(data)["amount"]
                              ).toFixed(6)}{" "}
                              TRX
                            </AppText>
                          </View>
                        </View>
                        <AppText styles={{ fontSize: 12, color: "grey" }}>
                          {geTrxTransactionNote(data)["message"]}
                        </AppText>
                      </View>
                    </View>
                  );
                } else {
                  return (
                    <View
                      key={index}
                      style={{
                        marginVertical: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ width: "100%" }}>
                        <AppText styles={{ fontSize: 12 }}>
                          {convertEpochToLocalDate(data.block_timestamp)}
                        </AppText>
                        <View
                          style={{
                            marginTop: 2,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <MaterialCommunityIcons
                              name={
                                geTrxTransactionNote(data)["type"] == "credit"
                                  ? "arrow-collapse-down"
                                  : "arrow-collapse-up"
                              }
                              size={14}
                              color="black"
                            />
                            <AppText styles={{ fontSize: 14 }}>
                              Transfer
                            </AppText>
                          </View>
                          <View>
                            <AppText
                              styles={{
                                color: `${
                                  geTrxTransactionNote(data)["type"] == "credit"
                                    ? "#0bc8a5"
                                    : "red"
                                }`,
                              }}
                            >
                              {" "}
                              {geTrxTransactionNote(data)["type"] == "credit"
                                ? "+"
                                : "-"}{" "}
                              {Number(
                                geTrxTransactionNote(data)["amount"]
                              ).toFixed(6)}{" "}
                              TRX
                            </AppText>
                          </View>
                        </View>
                        <AppText styles={{ fontSize: 12, color: "grey" }}>
                          {geTrxTransactionNote(data)["message"]}
                        </AppText>
                      </View>
                    </View>
                  );
                }
              })}
          </ScrollView>
        )}
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  mainBoard: {
    flexWrap: "wrap",
    flexDirection: "row",
    marginTop: 25,
    justifyContent: "space-evenly",
    marginBottom: 2,
    width: "90%",
  },
  mainBoardIconText: {
    fontSize: 11,
    color: "#f2f2f2",
    textAlign: "center",
  },
  activityButton: {
    height: 50,
    width: 50,
    borderWidth: 0.5,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.3)",
    marginRight: 5,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },

  activityButtonII: {
    height: 55,
    width: 55,
    borderWidth: 0.5,
    backgroundColor: "#f2f2f2",
    borderColor: "#f2f2f2",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },

  menuBoard: {
    backgroundColor: "#ffffff",
    height: 60,
    width: "90%",
    marginTop: -30,
    borderRadius: 5,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    alignItems: "center",
  },
  activityButtonIIText: {
    fontSize: 10,
    color: "rgba(0,0,0,0.5)",
    fontWeight: "600",
    textAlign: "center",
  },
  activityButtonIIContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
    width: 85,
  },
  waitingWindow: {
    marginTop: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  metricGuage: {
    marginTop: 2,
    height: 5,
    width: "100%",
    backgroundColor: "rgba(167, 170, 173, 0.8)",
    borderRadius: 2,
  },
});
