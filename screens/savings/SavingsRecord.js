import { View, Text, StyleSheet } from "react-native";
import React from "react";
import AppText from "../../resources/AppText";
import { AntDesign } from "@expo/vector-icons";
import { numberWithCommas } from "../../resources/utils";
const TRANACTION_TYPE = {
  DEPOSIT: "Deposit",
  EARNINGS: "Interest",
  WITHDRAWAL: "Withdrawal",
};

export default function SavingsRecord({ data, savingsStatus }) {
  return (
    <View>
      <View style={{ justifyContent: "center", alignItems: "center", marginTop: 15 }}>
        <View style={{ flexDirection: "row", width: "100%", justifyContent: "center" }}>
          <AppText bold styles={{ fontSize: 18, marginLeft: 10 }}>
            {data?.title}
          </AppText>
          <View style={{ alignSelf: "flex-end", flexDirection: "row" }}>
            <AppText bold styles={{ fontSize: 13 }}></AppText>
            {savingsStatus[data.status].icon}
          </View>
        </View>

        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
          <View style={{ width: "49%", height: 120, backgroundColor: "#FFFFFF", borderRadius: 15, padding: 10 }}>
            <AppText bold styles={{ color: "grey" }}>
              Target Amount
            </AppText>
            <AppText bold styles={{ marginTop: 10, fontSize: 20 }}>
              ₦{data?.savings_type == "MONTHLY" ? numberWithCommas(Number(data?.scheduled_deposit_amount) * data.tenure) : numberWithCommas(data?.scheduled_deposit_amount)}
            </AppText>
            <AppText styles={{ marginTop: 20, color: "grey" }}>Duration: {data?.tenure} Months</AppText>
          </View>
          <View style={{ width: "49%", height: 120, backgroundColor: "#032940", borderRadius: 15, padding: 10 }}>
            <AppText bold styles={{ color: "grey" }}>
              Amount Saved
            </AppText>
            <AppText bold styles={{ marginTop: 10, color: "#FFFFFF", fontSize: 20 }}>
              ₦{data?.total_amount_saved}
            </AppText>
            <AppText bold styles={{ marginTop: 20, color: "#90ee90" }}>
              Earnings: +₦{data?.total_earnings}
            </AppText>
          </View>
        </View>
      </View>

      {/** SAVINGS TRANSACTION HISTORY */}
      <AppText bold styles={{ marginTop: 30, fontSize: 18 }}>
        Transaction History
      </AppText>

      {data?.savings_transactions.length > 0 &&
        data.savings_transactions.map((transaction, index) => {
          return (
            <View key={index} style={styles.savingsHistory}>
              <View>
                {/* <AppText>Date: 13 Jun 2022 09:22</AppText> */}
                <AppText>
                  {new Date(transaction.timestamp).toDateString()} {new Date(transaction.timestamp).toLocaleTimeString()}
                </AppText>
                {TRANACTION_TYPE[transaction.transaction_type] == "Interest" && <AppText>PIR: {transaction.progressive_interest_rate}%</AppText>}
              </View>

              <View>
                <View style={{}}>
                  <AppText bold styles={{ color: "grey" }}>
                    {TRANACTION_TYPE[transaction.transaction_type]}
                  </AppText>
                  {TRANACTION_TYPE[transaction.transaction_type] == "Interest" ? (
                    <AppText bold styles={{ fontSize: 15, color: "green" }}>
                      + ₦{transaction.amount}
                    </AppText>
                  ) : (
                    <AppText styles={{ fontSize: 15 }}>₦{transaction.amount}</AppText>
                  )}
                </View>
              </View>
            </View>
          );
        })}

      {data?.savings_transactions.length < 1 && (
        <View style={{ marginTop: 50, alignItems: "center" }}>
          <AntDesign name="filetext1" size={24} color="grey" style={{ marginBottom: 5 }} />
          <AppText>Inital savings deposit has not been made</AppText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  savingsHistory: {
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    height: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 4,
  },
});

{
  /**
      // <View style={styles.savingsHistory}>
      //   <View>
      //     <AppText>Date: 13 Jun 2022 09:21</AppText>
      //   </View>

      //   <View>
      //     <View style={{}}>
      //       <AppText bold styles={{ color: "grey" }}>
      //         Deposit
      //       </AppText>
      //       <AppText styles={{ fontSize: 15 }}>₦85,000</AppText>
      //     </View>
      //   </View>
      // </View>
*/
}
