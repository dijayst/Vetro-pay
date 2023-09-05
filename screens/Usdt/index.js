import { StyleSheet, Image, View, StatusBar, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import AppText from "../../resources/AppText";
import { MaterialCommunityIcons, AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import { Spinner } from "native-base";
import { toastColorObject } from "../../resources/rStyledComponent";
import { useToast, Box, Text as NativeBaseText } from "native-base";
import { convertEpochToLocalDate } from "../../resources/MetaFunctions";

export default function index({ navigation, selectedCurrency, bottomSheetRef }) {
  const toast = useToast();
  const usdtTransactions = useSelector((state) => state.blockchain.usdt);

  const alertUserToAwaitLoading = () => {
    toast.show({
      render: () => (
        <Box bg={toastColorObject["warning"]} px="2" py="2" rounded="sm" mb={5}>
          <NativeBaseText style={{ color: "#FFFFFF" }}>Connecting...</NativeBaseText>
        </Box>
      ),
    });
  };

  const getUsdtTransactionNote = (from, to) => {
    if (from == usdtTransactions?.address?.base58) {
      return {
        type: "debit",
        message: `To ${to}`,
      };
    } else {
      return {
        type: "credit",
        message: `From ${from}`,
      };
    }
  };

  return (
    <Fragment>
      <View style={{ backgroundColor: "#266ddc", borderBottomLeftRadius: 15, borderBottomRightRadius: 15, paddingBottom: 30 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 15 }}>
          <View>
            <AppText bold="true" styles={{ fontSize: 14, color: "#f2f2f2", marginTop: StatusBar.currentHeight + 10 }}>
              Balance
            </AppText>
            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
              <MaterialIcons name="account-balance-wallet" size={24} color="#f2f2f2" />
              <AppText bold="true" styles={{ fontSize: 18, color: "#f2f2f2", marginLeft: 5 }}>
                ₮{usdtTransactions.processing ? "0.00" : Number(usdtTransactions?.balance?.balance).toFixed(2)}
              </AppText>
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
            }}
            onPress={() => bottomSheetRef.current?.expand()}
          >
            <Image source={{ uri: selectedCurrency.icon }} style={{ width: 30, height: 30, resizeMode: "contain" }} />
            <AppText styles={{ marginHorizontal: 5 }}>{selectedCurrency.code}</AppText>
            <AntDesign name="down" size={15} color="black" style={{ alignSelf: "flex-end", marginBottom: 5 }} />
          </TouchableOpacity>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View style={styles.mainBoard}>
            <TouchableOpacity
              onPress={() => {
                if (usdtTransactions.processing) {
                  alertUserToAwaitLoading();
                } else {
                  navigation.navigate("DepositUsdt");
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
                if (usdtTransactions.processing) {
                  alertUserToAwaitLoading();
                } else {
                  navigation.navigate("SendUsdt");
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
                if (usdtTransactions.processing) {
                  alertUserToAwaitLoading();
                } else {
                  navigation.navigate("ReceiveUsdt");
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
                if (usdtTransactions.processing) {
                  alertUserToAwaitLoading();
                } else {
                  navigation.navigate("WithdrawUsdt");
                }
              }}
            >
              <View style={{ ...styles.activityButton, width: 60 }}>
                <MaterialCommunityIcons name="bank-outline" size={24} color="#f2f2f2" />
                <AppText styles={styles.mainBoardIconText}>Withdraw</AppText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/**USDT GRAPH */}
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View style={styles.menuBoard}>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", width: "100%", paddingHorizontal: 20, height: "100%" }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#266ddc",
                padding: 9,
                borderRadius: 20,
              }}
              onPress={() => {
                if (usdtTransactions.processing) {
                  alertUserToAwaitLoading();
                } else {
                  navigation.navigate("DepositUsdt");
                }
              }}
            >
              <AppText bold styles={{ color: "#f2f2f2", paddingHorizontal: usdtTransactions.processing ? 20 : 0 }}>
                Buy{usdtTransactions.processing ? "" : ` - ₦${usdtTransactions.ngn_usd_current}/$`}
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                borderColor: "#266ddc",
                borderWidth: 1,
                padding: 9,
                borderRadius: 20,
              }}
              onPress={() => {
                if (usdtTransactions.processing) {
                  alertUserToAwaitLoading();
                } else {
                  navigation.navigate("WithdrawUsdt");
                }
              }}
            >
              <AppText bold styles={{ color: "#36454F", paddingHorizontal: usdtTransactions.processing ? 20 : 0 }}>
                Sell{usdtTransactions.processing ? "" : ` - ₦${usdtTransactions.usd_ngn_current}/$`}
              </AppText>
            </TouchableOpacity>
          </View>
          {/* <LineChart
            data={{
              labels: ["2020", "2021", "1-Month", "Last Week", "Today"],
              datasets: [{ data: usdtTransactions.processing ? [0, 0, 0, 0, 0] : usdtTransactions.ngn_usd_history }],
            }}
            width={Dimensions.get("window").width * 0.9}
            height={200}
            yAxisLabel="₦"
            yAxisSuffix=""
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: "#ededed",
              backgroundGradientFrom: "#ededed",
              backgroundGradientTo: "#ededed",
              decimalPlaces: 0,
              color: (opacity = 1) => `#266ddc`,
              labelColor: (opacity = 1) => `#808080`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "2",
                strokeWidth: "2",
                stroke: "lightgreen",
              },
            }}
            bezier
          /> */}
        </View>
      </View>
      <View style={{ marginTop: 15, paddingHorizontal: 10, flex: 1 }}>
        <AppText bold styles={{ fontSize: 18, marginBottom: 5 }}>
          Transactions
        </AppText>

        {usdtTransactions.processing ? (
          <View style={styles.waitingWindow}>
            <AppText>Fetching Transactions</AppText>
            <Spinner size="sm" color="grey" />
          </View>
        ) : usdtTransactions?.transactions?.data.length < 1 ? (
          <View style={styles.waitingWindow}>
            <Image
              source={{ uri: "https://res.cloudinary.com/ancla8techs4/image/upload/v1662574256/vetropay/google-docs-2038784-1721674_mnfrfa.png" }}
              style={{ opacity: 0.5, height: 100, width: 100, resizeMode: "contain" }}
            />
            <AppText styles={{ textAlign: "center", fontWeight: "400", marginTop: 10 }}>Transactions will show here.</AppText>
          </View>
        ) : (
          <ScrollView style={{ marginBottom: 5 }}>
            {usdtTransactions?.transactions.data.map((data, index) => {
              return (
                <View key={index} style={{ marginVertical: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View>
                    <AppText styles={{ fontSize: 12 }}>{convertEpochToLocalDate(data.block_timestamp)}</AppText>
                    <View style={{ marginTop: 2, flexDirection: "row", alignItems: "center" }}>
                      <MaterialCommunityIcons
                        name={getUsdtTransactionNote(data.from, data.to)["type"] == "credit" ? "arrow-collapse-down" : "arrow-collapse-up"}
                        size={14}
                        color="black"
                      />
                      <AppText styles={{ fontSize: 14 }}>{data.type}</AppText>
                    </View>
                    <AppText styles={{ fontSize: 12, color: "grey" }}>{getUsdtTransactionNote(data.from, data.to)["message"]}</AppText>
                  </View>
                  <AppText styles={{ color: `${getUsdtTransactionNote(data.from, data.to)["type"] == "credit" ? "#0bc8a5" : "red"}` }}>
                    {" "}
                    {getUsdtTransactionNote(data.from, data.to)["type"] == "credit" ? "+" : "-"} {Number(+data.value / 1000000).toFixed(2)} USDT
                  </AppText>
                </View>
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
    elevation: 4,
    flexWrap: "wrap",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    overflow: "hidden",
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
});
