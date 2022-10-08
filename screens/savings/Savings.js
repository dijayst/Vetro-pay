import { View, Text, StyleSheet, Pressable, Modal, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AppText from "../../resources/AppText";
import { FontAwesome5, FontAwesome, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import SavingsRecord from "./SavingsRecord";
import { getSavingsData, promptEarlyWithdrawal } from "../../containers/savings/action";
import { Spinner, useToast, Box, Text as NativeBaseText } from "native-base";
import { toastColorObject } from "../../resources/rStyledComponent";
import ThinkingImage from "../../assets/Critical-thinking-cuate2.png";
import { numberWithCommas, usePrevious } from "../../resources/utils";
import { getUserTransaction } from "../../containers/transactions/action";

const SAVINGS_STATUS = {
  RUNNING: {
    name: "Running",
    icon: <FontAwesome5 name="running" size={20} color="#fb9129" style={{ marginLeft: 10 }} />,
  },
  COMPLETED: {
    name: "Completed",
    icon: <MaterialIcons name="check-circle" size={20} color="#198754" style={{ marginLeft: 10 }} />,
  },
  EWITHDRAWAL: {
    name: "Early Withdrawal",
    icon: <MaterialIcons name="cancel" size={20} color="#dc3545" style={{ marginLeft: 10 }} />,
  },
};

export default function Savings({ navigation }) {
  const dispatch = useDispatch();
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [cancelSavingsModal, setCancelSavingsModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [savingsBalance, setSavingsBalance] = useState("0.00");
  const [earnings, setEarnings] = useState("0.00");
  const [savingsLoading, setSavingsLoading] = useState(false);
  const [savingsHistory, setSavingsHistory] = useState([]);
  const [displaySpinner, setDisplaySpinner] = useState(false);

  const userSavingsData = useSelector((state) => state.savings.savings);
  const userWithdrawSavingsResponse = useSelector((state) => state.savings.withdraw);
  const prevUserWithdrawSavingsResponse = usePrevious(userWithdrawSavingsResponse);

  useEffect(() => {
    setSavingsLoading(true);
    dispatch(getSavingsData());
  }, []);

  useEffect(() => {
    if (userSavingsData.length > 0) {
      let lastReport = userSavingsData[userSavingsData.length - 1];
      setSavingsBalance(lastReport?.data?.breif?.total_available_savings);
      setEarnings(lastReport?.data?.breif?.earnings_this_month);
      setSavingsHistory(lastReport?.data?.savings);
      setSavingsLoading(false);
    }
  }, [userSavingsData]);

  useEffect(() => {
    if (displaySpinner && userWithdrawSavingsResponse.length && userWithdrawSavingsResponse.length !== prevUserWithdrawSavingsResponse?.length) {
      if (userWithdrawSavingsResponse[userWithdrawSavingsResponse.length - 1]["status"] == "success") {
        dispatch(getSavingsData());
        dispatch(getUserTransaction(""));
        setCancelSavingsModal(false);
        setDisplaySpinner(false);
        toast.show({
          render: () => (
            <Box bg={toastColorObject["success"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>{`Early savings withdrawal completed`}</NativeBaseText>
            </Box>
          ),
        });
      }
    }
  }, [userWithdrawSavingsResponse]);

  const proceedToWithdrawalFunc = () => {
    setDisplaySpinner(true);
    dispatch(promptEarlyWithdrawal(modalData.id));
  };
  return (
    <View style={styles.container}>
      {/** Transaction Modal  */}
      <Modal visible={modalOpen} animationType="slide">
        <View style={styles.modalContent}>
          <ScrollView>
            <MaterialIcons name="close" size={24} onPress={() => setModalOpen(false)} style={styles.modalClose} />
            <SavingsRecord data={modalData} savingsStatus={SAVINGS_STATUS} />
          </ScrollView>
        </View>
      </Modal>

      {/** CANCEL SAVINGS MODAL */}
      <Modal visible={cancelSavingsModal} animationType="slide">
        <View style={styles.modalContent}>
          <View style={{ marginTop: 30 }}>
            <MaterialCommunityIcons name="alert-circle" size={50} color="#FF725E" style={{ alignSelf: "center" }} />
            <AppText bold styles={{ fontSize: 18, marginTop: 50 }}>
              😟 Are you really sure?
            </AppText>
            <View style={{ marginTop: 10 }}>
              <AppText styles={{ fontStyle: "italic" }}>Discipline is the architect of success.</AppText>
              <AppText styles={{ marginTop: 10, marginBottom: 5 }}>
                Your <AppText bold>{modalData.title}</AppText> savings has a tenure of <AppText bold>{modalData.tenure} Month(s)</AppText>
              </AppText>
              <AppText>Early withdrawal will attract a forfeiture of interest + 1.5% penalty fee.</AppText>
            </View>
          </View>

          {!displaySpinner ? (
            <View>
              <Pressable
                style={{
                  width: "100%",
                  backgroundColor: "transparent",
                  borderColor: "#266ddc",
                  borderWidth: 1,
                  padding: 10,
                  marginTop: 15,
                  marginBottom: 10,
                  alignItems: "center",
                  borderRadius: 5,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
                onPress={() => setCancelSavingsModal(false)}
              >
                <AppText bold>Continue Your Savings</AppText>
              </Pressable>
              <Pressable
                style={{
                  width: "100%",
                  backgroundColor: "#FF725E",
                  borderColor: "#FF725E",
                  borderWidth: 1,
                  padding: 10,
                  marginTop: 15,
                  marginBottom: 10,
                  alignItems: "center",
                  borderRadius: 5,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
                onPress={() => proceedToWithdrawalFunc()}
              >
                <AppText bold styles={{ color: "#FFFFFF" }}>
                  Proceed to Withdrawal
                </AppText>
              </Pressable>
            </View>
          ) : (
            <View style={{ marginTop: 30, alignSelf: "center" }}>
              <Spinner color="blue.700" size="lg" />
            </View>
          )}
        </View>
      </Modal>
      <View style={{ paddingHorizontal: 10 }}>
        <View style={styles.savingsBalanceContainer}>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 30, color: "white", fontWeight: "bold" }}>₦{savingsBalance}</Text>
          </View>

          {/**Savings Amount */}
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <AppText bold styles={{ fontSize: 16, color: "white" }}>
              <Text style={{ color: "#90ee90" }}>+ ₦{earnings}</Text> Earnings this month.
            </AppText>
          </View>
        </View>

        <View style={{ display: "flex", flexDirection: "row", marginTop: 10, alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ width: "49%" }}>
            <TouchableOpacity
              style={{ width: "100%", backgroundColor: "#266ddc", padding: 10, alignItems: "center", borderRadius: 5 }}
              onPress={() => navigation.navigate("NewSavingsPlan")}
            >
              <FontAwesome5 name="piggy-bank" size={24} color="#FFFFFF" />
              <AppText styles={{ color: "#FFFFFF" }} bold>
                New savings plan
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={{ width: "49%" }}>
            <Pressable style={{ opacity: 0.5, width: "100%", backgroundColor: "#266ddc", padding: 10, alignItems: "center", borderRadius: 5 }}>
              <FontAwesome name="group" size={24} color="#FFFFFF" />
              <AppText styles={{ color: "#FFFFFF" }} bold>
                Group savings
              </AppText>
            </Pressable>
          </View>
        </View>

        {/** Savings History */}

        <AppText bold styles={{ marginTop: 35, fontSize: 18 }}>
          Savings History
        </AppText>

        {savingsLoading ? (
          <View style={{ marginTop: 40 }}>
            <AppText styles={{ textAlign: "center", marginBottom: 5 }}>Loading transactions...</AppText>
            <Spinner color="blue.700" size="lg" />
          </View>
        ) : (
          <ScrollView>
            {savingsHistory.length > 0 ? (
              savingsHistory.map((data, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.savingsHistory}
                    onPress={() => {
                      setModalData(data);
                      setModalOpen(true);
                    }}
                    onLongPress={() => {
                      setModalData(data);
                      setCancelSavingsModal(true);
                    }}
                  >
                    <View>
                      <AppText bold styles={{ color: "#266ddc" }}>
                        {data.title}
                      </AppText>
                      <AppText styles={{ fontSize: 15 }}>
                        ₦{data.total_amount_saved}/₦
                        {data.savings_type == "MONTHLY" ? numberWithCommas(Number(data.scheduled_deposit_amount) * data.tenure) : numberWithCommas(data.scheduled_deposit_amount)}
                      </AppText>
                    </View>

                    <View>
                      <View style={{ flexDirection: "row" }}>
                        <AppText>{SAVINGS_STATUS[data.status].name}</AppText>
                        {SAVINGS_STATUS[data.status].icon}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={{ marginTop: 40 }}>
                <View style={{ alignSelf: "center", marginTop: 20 }}>
                  <Image source={ThinkingImage} style={{ width: 170, height: 170 }} />
                  <View>
                    <AppText styles={{ fontSize: 16 }}>No Savings Record Yet</AppText>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
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
  savingsBalanceContainer: {
    backgroundColor: "#032940",
    //backgroundColor: "#414141",
    height: 120,
    width: "100%",
    marginTop: 15,
    borderRadius: 15,
    padding: 10,
    justifyContent: "center",
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

  modalContent: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#F0F0F8",
  },
});
