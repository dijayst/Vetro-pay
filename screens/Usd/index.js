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
import { LineChart } from "react-native-chart-kit";
import { Spinner } from "native-base";
import { toastColorObject } from "../../resources/rStyledComponent";
import { useToast, Box, Text as NativeBaseText } from "native-base";
import {
  convertEpochToLocalDate,
  numberWithCommas,
} from "../../resources/utils/MetaFunctions";

export default function index({
  navigation,
  selectedCurrency,
  bottomSheetRef,
}) {
  const toast = useToast();
  const usdTransactions = useSelector((state) => state.blockchain.usd);

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
              />
              <AppText
                bold="true"
                styles={{ fontSize: 18, color: "#f2f2f2", marginLeft: 5 }}
              >
                $
                {usdTransactions.processing
                  ? "0.00"
                  : Number(usdTransactions?.balance).toFixed(2)}
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
                if (usdTransactions.processing) {
                  alertUserToAwaitLoading();
                } else {
                  navigation.navigate("DepositUsd");
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
                if (usdTransactions.processing) {
                  alertUserToAwaitLoading();
                } else {
                  Alert.alert(
                    "USD Transfers",
                    "We are currently working on our direct Bank transfer service to Canada, UK & USA. Please check back later.\n\nFeature Delivery Date: 5th of June, 2023. "
                  );
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
                if (usdTransactions.processing) {
                  alertUserToAwaitLoading();
                } else {
                  navigation.navigate("WithdrawUsd");
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

            <TouchableOpacity
              onPress={() => {
                if (usdTransactions.processing) {
                  alertUserToAwaitLoading();
                } else {
                  navigation.navigate("SwapUsd");
                }
              }}
            >
              <View style={{ ...styles.activityButton, width: 60 }}>
                <FontAwesome5 name="exchange-alt" size={20} color="#f2f2f2" />
                <AppText styles={styles.mainBoardIconText}>₮Swap</AppText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/**USD GRAPH */}
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View style={styles.menuBoard}>
          <View
            style={{
              width: "100%",
              alignItems: "center",
              backgroundColor: "#ededed",
              borderRadius: 5,
              flexDirection: "row",
              justifyContent: "flex-end",
              paddingHorizontal: 15,
              paddingBottom: 3,
            }}
          >
            <AppText bold styles={{ color: "#2E2E2E", fontSize: 15 }}>
              {usdTransactions.processing
                ? "0.00"
                : `₦${usdTransactions.ngn_usd_current}/$`}
            </AppText>
            {!usdTransactions.processing && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 7,
                }}
              >
                {usdTransactions?.usd_last_closing >
                usdTransactions?.ngn_usd_current ? (
                  <AntDesign name="caretup" size={8} color="#0bc8a5" />
                ) : (
                  <AntDesign name="caretdown" size={8} color="red" />
                )}
              </View>
            )}
          </View>
          <LineChart
            data={{
              labels: ["2020", "2021", "1-Month", "Last Week", "Today"],
              datasets: [
                {
                  data: usdTransactions.processing
                    ? [0, 0, 0, 0, 0]
                    : usdTransactions.ngn_usd_history,
                },
              ],
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
          />
        </View>
      </View>
      <View style={{ marginTop: 15, paddingHorizontal: 10, flex: 1 }}>
        <AppText bold styles={{ fontSize: 18, marginBottom: 5 }}>
          Transactions
        </AppText>

        {usdTransactions.processing ? (
          <View style={styles.waitingWindow}>
            <AppText>Fetching Transactions</AppText>
            <Spinner size="sm" color="grey" />
          </View>
        ) : usdTransactions?.transactions?.length < 1 ? (
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
          <ScrollView style={{ marginBottom: 5 }}>
            {usdTransactions?.transactions.map((data, index) => {
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
                  <View>
                    <AppText styles={{ fontSize: 12 }}>
                      {convertEpochToLocalDate(data.timestamp)}
                    </AppText>
                    <View
                      style={{
                        marginTop: 2,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name={
                          data["transaction_type"] == "DEPOSIT"
                            ? "arrow-collapse-down"
                            : "arrow-collapse-up"
                        }
                        size={14}
                        color="black"
                      />
                      <AppText styles={{ fontSize: 14 }}>
                        {data["transaction_type"]}
                      </AppText>
                    </View>
                    <AppText styles={{ fontSize: 12, color: "grey" }}>{`${
                      data["transaction_type"] == "DEPOSIT"
                        ? "From NGN Wallet"
                        : "From USD Wallet"
                    }`}</AppText>
                  </View>
                  <View>
                    <AppText
                      styles={{
                        color: `${
                          data["transaction_type"] == "DEPOSIT"
                            ? "#0bc8a5"
                            : "red"
                        }`,
                      }}
                    >
                      {" "}
                      {data["transaction_type"] == "DEPOSIT" ? "+" : ""}{" "}
                      {numberWithCommas(Number(data.amount).toFixed(2))} USD
                    </AppText>
                    <AppText
                      styles={{
                        alignSelf: "flex-end",
                        fontSize: 12,
                        color: `${
                          data["meta_info"][data["meta_info"].length - 1] ==
                          "Processing"
                            ? "#000000"
                            : "grey"
                        }`,
                      }}
                    >
                      {`${
                        data["meta_info"][data["meta_info"].length - 1] ==
                        "Processing"
                          ? "Processing"
                          : "Completed"
                      }`}
                    </AppText>
                  </View>
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
    height: 220,
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
