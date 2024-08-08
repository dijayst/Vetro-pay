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
import { Spinner } from "native-base";
import { toastColorObject } from "../../resources/rStyledComponent";
import { useToast, Box, Text as NativeBaseText } from "native-base";
import {
  calculateBandwithOrEnergy,
  customTrxWithCommas,
  numberWithCommas,
  ONE_BTC_TO_SATS,
} from "../../resources/utils";
import { convertEpochToLocalDate } from "../../resources/utils/MetaFunctions";
import * as WebBrowser from "expo-web-browser";

export default function index({
  navigation,
  selectedCurrency,
  bottomSheetRef,
}) {
  const toast = useToast();
  const btcTransactions = useSelector((state) => state.blockchain.btc);

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

  const _btcTransactionDetailsViewHandler = async (hash) => {
    await WebBrowser.openBrowserAsync(
      `https://blockchair.com/bitcoin/transaction/${hash}`
    );
  };

  const getBtcTransactionNote = (data) => {
    let userWalletAddress = btcTransactions?.address?.address;
    let report = {};

    data.inputs.map((input) => {
      if (input.addresses[0] == userWalletAddress) {
        report = {
          type: "debit",
          value: input.output_value,
        };
      }
      return;
    });

    if (!report?.type) {
      data.outputs.map((output) => {
        if (output.addresses[0] == userWalletAddress) {
          report = {
            type: "credit",
            value: output.value,
          };
        }
        return;
      });
    }
    return report;
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
                  ₿{" "}
                  {customTrxWithCommas(
                    Number(
                      +btcTransactions?.balance?.balance / ONE_BTC_TO_SATS ||
                        0.0
                    ).toFixed(8)
                  )}
                </AppText>
                <AppText
                  bold="true"
                  styles={{ fontSize: 13, color: "#f2f2f2", marginLeft: 5 }}
                >
                  ≈ $
                  {numberWithCommas(
                    Number(
                      (+btcTransactions?.balance?.balance / ONE_BTC_TO_SATS) *
                        btcTransactions?.btc_value || 0
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
                if (btcTransactions.processing) {
                  alertUserToAwaitLoading();
                } else {
                  navigation.navigate("DepositBtc");
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
                if (btcTransactions.processing) {
                  alertUserToAwaitLoading();
                } else {
                  navigation.navigate("SendBtc");
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
                if (btcTransactions.processing) {
                  alertUserToAwaitLoading();
                } else {
                  navigation.navigate("ReceiveBtc");
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
                if (btcTransactions.processing) {
                  alertUserToAwaitLoading();
                } else {
                  navigation.navigate("WithdrawBtc");
                }
              }}
            >
              <View style={{ ...styles.activityButton, width: 60 }}>
                <MaterialCommunityIcons
                  name="bank-outline"
                  size={24}
                  color="#f2f2f2"
                />
                <AppText styles={styles.mainBoardIconText}>Withdraw</AppText>
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
              Unconfirmed Bal:
            </AppText>
            {/** Energy Guauge */}
            <AppText bold styles={{ fontSize: 12, color: "grey" }}>
              ₿{" "}
              {customTrxWithCommas(
                Number(
                  +btcTransactions?.balance?.unconfirmed_balance /
                    ONE_BTC_TO_SATS || 0.0
                ).toFixed(8)
              )}
            </AppText>
          </View>

          <View style={{ width: "45%" }}>
            <AppText bold styles={{ fontSize: 12, color: "#0D2241" }}>
              Unconfirmed Tx:
            </AppText>
            <AppText bold styles={{ fontSize: 12, color: "grey" }}>
              {`${btcTransactions?.balance?.unconfirmed_n_tx || 0}`} Txns
            </AppText>
          </View>
        </View>
      </View>
      <View style={{ marginTop: 15, paddingHorizontal: 10, flex: 1 }}>
        <AppText bold styles={{ fontSize: 18, marginBottom: 5 }}>
          Transactions
        </AppText>

        {btcTransactions.processing ? (
          <View style={styles.waitingWindow}>
            <AppText>Fetching Transactions</AppText>
            <Spinner size="sm" color="grey" />
          </View>
        ) : btcTransactions?.transactions?.data.length < 1 ? (
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
            {btcTransactions?.transactions.data.map((data, index) => {
              return (
                <TouchableOpacity
                  onPress={() => _btcTransactionDetailsViewHandler(data.hash)}
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
                      {convertEpochToLocalDate(data.confirmed || data.received)}
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
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <MaterialCommunityIcons
                          name={
                            getBtcTransactionNote(data).type == "debit"
                              ? "arrow-collapse-up"
                              : "arrow-collapse-down"
                          }
                          size={14}
                          color={
                            getBtcTransactionNote(data).type == "debit"
                              ? "red"
                              : "#0bc8a5"
                          }
                        />
                        <AppText styles={{ fontSize: 14 }}>
                          {" "}
                          {getBtcTransactionNote(data).type == "debit"
                            ? "Sent"
                            : "Receive"}
                        </AppText>
                      </View>
                      <View>
                        <AppText
                          styles={{
                            color: `${
                              getBtcTransactionNote(data).type == "debit"
                                ? "red"
                                : "#0bc8a5"
                            }`,
                          }}
                        >
                          {" "}
                          {getBtcTransactionNote(data).type == "debit"
                            ? "-"
                            : "+"}{" "}
                          {Number(
                            +getBtcTransactionNote(data).value / ONE_BTC_TO_SATS
                          ).toFixed(8)}{" "}
                          BTC
                        </AppText>
                      </View>
                    </View>
                    <AppText styles={{ fontSize: 12, color: "grey" }}>
                      {data["hash"].substring(0, 5)}...
                      {data["hash"].substring(40)}
                    </AppText>
                  </View>
                </TouchableOpacity>
              );
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
