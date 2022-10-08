import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, StyleSheet, TouchableOpacity, Image, Modal, ScrollView, Pressable, TextInput, Alert } from "react-native";
import { PrimaryButton } from "../../resources/AppButton";
import AppText from "../../resources/AppText";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Circle } from "react-native-svg";
import { Entypo } from "@expo/vector-icons";
import WalletImage from "../../assets/wallet.png";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "../../resources/rStyledComponent";
import { getUserLoanHistory, makeLoanRepayment } from "../../containers/loans/action";
import { Spinner, useToast, Box, Text as NativeBaseText } from "native-base";
import { numberWithCommas } from "../../resources/utils";
import { toastColorObject } from "../../resources/rStyledComponent";
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from "@gorhom/bottom-sheet";

const TRANSACTION_STATUS_COLOR = {
  PROCESSING: {
    background: "#faa632",
    text: "#040404",
  },
  DECLINED: {
    background: "#da4f4a",
    text: "#f2f2f2",
  },
  DEFAULT: {
    background: "#da4f4a",
    text: "#f2f2f2",
  },
  RUNNING: {
    background: "#5ab75c",
    text: "#f2f2f2",
  },
  COMPLETED: {
    background: "#016ecd",
    text: "#f2f2f2",
  },
};

export default function CreditLoansHome({ navigation }) {
  const dispatch = useDispatch();
  const toast = useToast();
  const userLoanHistory = useSelector((state) => state.loans.loans);
  const userLoanRepaymentResponse = useSelector((state) => state.loans.repayment);
  const [modalVisible, setModalVisible] = useState(false);
  const [loanHistory, setLoanHistory] = useState(null);
  const [loanInView, setLoanInView] = useState(null);
  const [dynamicRepaymentAmount, setDynamicRepaymentAmount] = useState("");
  const [displaySpinner, setDisplaySpinner] = useState(false);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["1%", "90%"], []);

  useEffect(() => {
    dispatch(getUserLoanHistory());
  }, []);

  useEffect(() => {
    const data = userLoanHistory[userLoanHistory.length - 1];
    if (data?.status == "success") {
      setLoanHistory(data);
    } else {
      //Error Fetching loans
    }
  }, [userLoanHistory]);

  useEffect(() => {
    if (userLoanRepaymentResponse.length > 0 && dynamicRepaymentAmount != "") {
      if (userLoanRepaymentResponse[userLoanRepaymentResponse.length - 1]?.status == "success") {
        setDisplaySpinner(false);
        dispatch(getUserLoanHistory());
        repaymentSuccessAlert();
      } else {
        setDisplaySpinner(false);
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>{userLoanRepaymentResponse[userLoanRepaymentResponse.length - 1]["message"]}</NativeBaseText>
            </Box>
          ),
        });
      }
    }
  }, [userLoanRepaymentResponse]);

  const repaymentSuccessAlert = () => {
    Alert.alert(
      "Successful",
      `Loan payment successful.`,
      [
        {
          text: "Proceed",
          onPress: () => {
            bottomSheetRef.current.close();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderBackdrop = useCallback((props) => <BottomSheetBackdrop {...props} />, []);
  const handleSheetChanges = useCallback((index) => {
    //console.log("handleSheetChanges", index);
  }, []);

  const handleSheetCloseRequest = (data) => {
    bottomSheetRef.current.close();
  };

  const promptLoanRepaymentFunc = (amount, loanId) => {
    setDynamicRepaymentAmount(amount);
    setDisplaySpinner(true);
    dispatch(makeLoanRepayment(amount, loanId));
  };

  return (
    <View style={styles.container}>
      <BottomSheetModalProvider>
        <Modal animationType="slide" transparent={false} visible={modalVisible}>
          <SafeAreaView />
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
            size={180}
            width={15}
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

        <View style={{ flexDirection: "row", paddingHorizontal: 20, width: "100%", justifyContent: "center", marginTop: 15 }}>
          <PrimaryButton disabled styles={{ width: 140, height: 50, marginRight: 10 }}>
            <AppText bold styles={{ color: "#FFFFFF" }}>
              Withdraw Credit
            </AppText>
          </PrimaryButton>
          <PrimaryButton styles={{ width: 140, height: 50 }} onPress={() => navigation.navigate("Loans")}>
            <AppText bold styles={{ color: "#FFFFFF" }}>
              Request Loan
            </AppText>
          </PrimaryButton>
        </View>

        <View style={{ marginTop: 15 }}>
          <AppText bold styles={{ fontSize: 20, paddingHorizontal: 20 }}>
            History
          </AppText>

          <ScrollView>
            {loanHistory == null && (
              <View style={{ marginTop: 50, justifyContent: "center", alignItems: "center" }}>
                <Spinner color="blue.600" size="lg" />
              </View>
            )}
            {loanHistory != null && (
              <View>
                {loanHistory.data.loan_history.length == 0 && (
                  <View style={{ marginTop: 30, justifyContent: "center", alignItems: "center" }}>
                    <Image
                      source={{ uri: "https://res.cloudinary.com/ancla8techs4/image/upload/v1662574256/vetropay/google-docs-2038784-1721674_mnfrfa.png" }}
                      style={{ opacity: 0.5, height: 100, width: 100, resizeMode: "contain" }}
                    />
                    <AppText styles={{ textAlign: "center", fontWeight: "400", marginTop: 10 }}>You don't have any credit transaction yet. Keep enjoying VetroPay.</AppText>
                  </View>
                )}

                {loanHistory.data.loan_history.length > 0 &&
                  loanHistory.data.loan_history.map((data, index) => {
                    return (
                      <Pressable
                        key={index}
                        style={{
                          backgroundColor: "#ffffff",
                          height: 60,
                          marginHorizontal: 10,
                          paddingHorizontal: 10,
                          borderRadius: 5,
                          marginVertical: 10,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          elevation: 3,
                          borderRadius: 10,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 3 },
                          shadowOpacity: 0.5,
                          shadowRadius: 4,
                        }}
                        onPress={() => {
                          setLoanInView(data);
                          bottomSheetRef.current?.expand();
                        }}
                      >
                        <View style={{}}>
                          <AppText bold> {new Date(data.created).toDateString()}</AppText>
                        </View>
                        <View>
                          <AppText styles={{ alignSelf: "flex-end" }} bold>
                            ₦{numberWithCommas(data.principal)}
                          </AppText>
                          <AppText
                            styles={{
                              ...styles.loanTransactionStatus,
                              backgroundColor: TRANSACTION_STATUS_COLOR[data.loan_status].background,
                              color: TRANSACTION_STATUS_COLOR[data.loan_status].text,
                            }}
                            bold
                          >
                            {data.loan_status}
                          </AppText>
                        </View>
                      </Pressable>
                    );
                  })}
              </View>
            )}
          </ScrollView>
        </View>
        <BottomSheet ref={bottomSheetRef} index={0} enablePanDownToClose={true} snapPoints={snapPoints} backdropComponent={renderBackdrop} onChange={handleSheetChanges}>
          <KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={10} enableOnAndroid={true} extraHeight={Platform.select({ android: 150 })} style={{ flexGrow: 1 }}>
            <View style={{ paddingHorizontal: 20 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <AppText bold>Loan Request Date:</AppText>
                <AppText>{new Date(loanInView?.created).toDateString()}</AppText>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <AppText bold>Status:</AppText>
                <AppText
                  bold
                  styles={{
                    ...styles.loanTransactionStatus,
                    backgroundColor: TRANSACTION_STATUS_COLOR[loanInView?.loan_status]?.background,
                    color: TRANSACTION_STATUS_COLOR[loanInView?.loan_status]?.text,
                  }}
                >
                  {loanInView?.loan_status}
                </AppText>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <AppText bold>Principal:</AppText>
                <AppText>₦{numberWithCommas(loanInView?.principal)}</AppText>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <AppText bold>Amount Payable:</AppText>
                <AppText>₦{numberWithCommas(loanInView?.total_amount_payable)}</AppText>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <AppText bold>Amount Paid:</AppText>
                <AppText>₦{numberWithCommas(loanInView?.total_amount_paid)}</AppText>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <AppText bold>Duration:</AppText>
                <AppText>{loanInView?.tenure} Month(s)</AppText>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <AppText bold>Rate:</AppText>
                <AppText>{loanInView?.interest_rate}%/Mo.</AppText>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <AppText bold>Due Date:</AppText>
                <AppText>{loanInView?.due_date}</AppText>
              </View>

              {/** THIS SYSTEM IS CURRENTLY LIMITED BY DESIGN TO HANDLE ONE MONTH LOAN AT THE MOMENT. KINDLY ENSURE PROPER LOOP
             * OR VISUAL GUIDE IS IN PLACE TO SHOW USER PROGRESS FOR MULTIPLE MONTHS
             * 
             * <AppText bold styles={{ marginTop: 20, fontSize: 17, textAlign: "center" }}>
                  Payment Breakdown
                </AppText>
             */}

              {(loanInView?.loan_status == "RUNNING" || loanInView?.loan_status == "DEFAULT") &&
                (displaySpinner ? (
                  <View style={{ width: "100%", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                    <Spinner color="blue.600" size="lg" />
                  </View>
                ) : (
                  <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <PrimaryButton
                      onPress={() => promptLoanRepaymentFunc(loanInView?.total_amount_payable - loanInView?.total_amount_paid, loanInView?.id)}
                      styles={{ width: "80%", alignSelf: "center", marginTop: 25 }}
                    >
                      <AppText bold styles={{ color: "#f2f2f2" }}>
                        Pay ₦{numberWithCommas(loanInView?.total_amount_payable - loanInView?.total_amount_paid)} Now
                      </AppText>
                    </PrimaryButton>

                    <AppText bold styles={{ marginTop: 10 }}>
                      Or
                    </AppText>

                    <TextInput
                      style={{ ...styles.textInput, marginTop: 10, width: "80%" }}
                      placeholder="Enter Amount"
                      placeholderTextColor="gray"
                      maxLength={11}
                      keyboardType="numeric"
                      onChangeText={(text) => setDynamicRepaymentAmount(text)}
                    />

                    <PrimaryButton onPress={() => promptLoanRepaymentFunc(dynamicRepaymentAmount, loanInView?.id)} styles={{ width: "80%", alignSelf: "center", marginTop: 10 }}>
                      <AppText bold styles={{ color: "#f2f2f2" }}>
                        Pay ₦{numberWithCommas(dynamicRepaymentAmount)}
                      </AppText>
                    </PrimaryButton>
                  </View>
                ))}
            </View>
          </KeyboardAwareScrollView>
        </BottomSheet>
      </BottomSheetModalProvider>
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
  loanTransactionStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
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

{
  /**
https://www.nerdwallet.com/article/finance/credit-score-ranges-and-how-to-improve
https://www.reddit.com/r/explainlikeimfive/comments/3i3e54/eli5_why_do_credit_scores_start_at_300/
*/
}
