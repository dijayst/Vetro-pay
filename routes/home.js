import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import Subscriptions from "../screens/subscription/Subscriptions";
import Airtime from "../screens/airtime/Airtime";
import Tv from "../screens/tv/Tv";
import Electricity from "../screens/electricity/Electricity";
import Marketplace from "../screens/marketplace/Marketplace";
import PayBusiness from "../screens/marketplace/PayBusiness";
import FinanceVisualizer from "../screens/visualizer/FinanceVisualizer";
import UserTransactions from "../screens/transactions/UserTransactions";
import ScanPay from "../screens/transfer/ScanPay";
import Transfer from "../screens/transfer/Transfer";
import SendMoney from "../screens/transfer/SendMoney";
import TransferBusiness from "../screens/transfer/TransferBusiness";
import SendMoneyBusiness from "../screens/transfer/SendMoneyBusiness";
import Withdraw from "../screens/transfer/Withdraw";
import LinkBank from "../screens/transfer/LinkBank";
import AddRecord from "../screens/AddRecord";
import Savings from "../screens/savings/Savings";
import NewSavingsPlan from "../screens/savings/NewSavingsPlan";
import ReceiveFund from "../screens/ReceiveFund";
import DepositFund from "../screens/DepositFund";
import Credit from "../screens/creditloans/Credit";
import Loans from "../screens/creditloans/Loans";
import ReceiveUsdt from "../screens/Usdt/Receive";
import SendUsdt from "../screens/Usdt/Send";
import WithdrawUsdt from "../screens/Usdt/Withdraw";
import ReceiveTrx from "../screens/Tron/Receive";
import SendTrx from "../screens/Tron/Send";
import WithdrawUsd from "../screens/Usd/Withdraw";
import DepositUsd from "../screens/Usd/Deposit";
import SwapUsd from "../screens/Usd/Swap";

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="HomeHome"
        options={{
          headerShown: false,
        }}
        component={Home}
      />
      <Stack.Screen
        name="Subscriptions"
        options={{
          title: "Subscriptions",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={Subscriptions}
      />

      <Stack.Screen
        name="Airtime"
        options={{
          title: "Airtime & Data Top-up",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={Airtime}
      />

      <Stack.Screen
        name="Tv"
        options={{
          title: "Cable & Tv",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={Tv}
      />

      <Stack.Screen
        name="Electricity"
        options={{
          title: "Electricity",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={Electricity}
        SendMoney
      />

      <Stack.Screen
        name="Marketplace"
        options={{
          title: "Marketplace",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={Marketplace}
      />

      <Stack.Screen
        name="PayBusiness"
        options={{
          title: "Make Payment",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={PayBusiness}
      />

      <Stack.Screen
        name="FinanceVisualizer"
        options={{
          title: "Finance Manager",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={FinanceVisualizer}
      />

      <Stack.Screen
        name="UserTransactions"
        options={{
          title: "Transactions",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={UserTransactions}
      />

      <Stack.Screen
        name="ScanPay"
        options={{
          title: "Scan to Pay",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={ScanPay}
      />

      <Stack.Screen
        name="Transfer"
        options={{
          title: "Fund Transfer",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={Transfer}
      />

      <Stack.Screen
        name="SendMoney"
        options={{
          title: "Fund Transfer",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={SendMoney}
      />

      <Stack.Screen
        name="TransferBusiness"
        options={{
          title: "Business Transfer",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={TransferBusiness}
      />

      <Stack.Screen
        name="SendMoneyBusiness"
        options={{
          title: "Send to Business",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={SendMoneyBusiness}
      />

      <Stack.Screen
        name="Withdraw"
        options={{
          title: "Fund Transfer",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={Withdraw}
      />

      <Stack.Screen
        name="LinkBank"
        options={{
          title: "Fund Transfer",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={LinkBank}
      />

      <Stack.Screen
        name="AddRecord"
        options={{
          title: "Vetropay",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={AddRecord}
      />

      <Stack.Screen
        name="Savings"
        options={{
          title: "Savings",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={Savings}
      />

      <Stack.Screen
        name="NewSavingsPlan"
        options={{
          title: "New Savings Plan",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={NewSavingsPlan}
      />

      <Stack.Screen
        name="ReceiveFund"
        options={{
          title: "Receive Fund",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={ReceiveFund}
      />

      <Stack.Screen
        name="DepositFund"
        options={{
          title: "Deposit",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={DepositFund}
      />

      <Stack.Screen
        name="CreditHome"
        options={{
          title: "Credit & Loans",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={Credit}
      />

      <Stack.Screen
        name="Loans"
        options={{
          title: "Request Loan",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={Loans}
      />

      <Stack.Screen
        name="ReceiveUsdt"
        options={{
          title: "Receive USDT",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={ReceiveUsdt}
      />

      <Stack.Screen
        name="SendUsdt"
        options={{
          title: "Send USDT (TRC20)",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={SendUsdt}
      />

      <Stack.Screen
        name="WithdrawUsdt"
        options={{
          title: "Withdraw USDT",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={WithdrawUsdt}
      />

      <Stack.Screen
        name="ReceiveTrx"
        options={{
          title: "Receive TRX",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={ReceiveTrx}
      />

      <Stack.Screen
        name="SendTrx"
        options={{
          title: "Send TRX",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={SendTrx}
      />

      <Stack.Screen
        name="WithdrawUsd"
        options={{
          title: "Withdraw USD",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={WithdrawUsd}
      />

      <Stack.Screen
        name="DepositUsd"
        options={{
          title: "Deposit USD",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={DepositUsd}
      />

      <Stack.Screen
        name="SwapUsd"
        options={{
          title: "Convert to USDT",
          headerStyle: { backgroundColor: "#266ddc" },
          headerTitleStyle: { color: "#fff", fontWeight: "700" },
          headerTintColor: "#fff",
        }}
        component={SwapUsd}
      />
    </Stack.Navigator>
  );
}
