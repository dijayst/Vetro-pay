import { View, Platform, StyleSheet, TextInput, Alert } from "react-native";
import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Picker as RNPicker } from "@react-native-picker/picker";
import { Select } from "native-base";
import AppText from "../../resources/AppText";
import { nigeriaBanks, numberWithCommas } from "../../resources/utils";
import { PrimaryButton } from "../../resources/AppButton";
import Slider from "@react-native-community/slider";
import { Spinner, useToast, Box, Text as NativeBaseText } from "native-base";
import { toastColorObject } from "../../resources/rStyledComponent";
import { getUserLoanHistory, requestNewLoan, updateEmploymentDetails } from "../../containers/loans/action";

export default function Loans({ navigation }) {
  const dispatch = useDispatch();
  const toast = useToast();
  const Picker = Platform.OS == "android" ? RNPicker : Select;
  const userLoanHistory = useSelector((state) => state.loans.loans);
  const userLoanRequestResponse = useSelector((state) => state.loans.request);
  const userEmployerUpdateResponse = useSelector((state) => state.loans.employment);
  const [loanRequisiteData, setLoanRequisiteData] = useState({
    payload: {
      employer: "",
      bankName: "",
      accountNo: "",
    },
  });
  const [loanRequestStage, setLoanRequestStage] = useState(0);
  const [loanAmount, setLoanAmount] = useState(1000);
  const [loanDuration, setLoanDuration] = useState("");
  const [availableLoanRange, setAvailableLoanRange] = useState({
    min: 0,
    max: 0,
  });
  const [displaySpinner, setDisplaySpinner] = useState(false);

  useEffect(() => {
    const loanHistory = userLoanHistory[userLoanHistory.length - 1];
    if (
      !loanHistory?.data.employer ||
      !loanHistory.data.employment_verification ||
      loanHistory.data.monthly_salary === 0 ||
      !loanHistory.data.salary_account_no ||
      !loanHistory.data.salary_bank_code
    ) {
      //Pass -- Remain on Stage 1
    } else {
      if (loanDuration.data.monthly_salary > 1000) {
        setAvailableLoanRange({ min: 1000, max: parseInt(loanDuration.data.monthly_salary * 0.9) });
      }
      setLoanRequestStage(loanRequestStage + 1);
    }
  }, []);

  useEffect(() => {
    if (userLoanRequestResponse.length > 0 && loanDuration != "") {
      if (userLoanRequestResponse[userLoanRequestResponse.length - 1]?.status == "success") {
        setDisplaySpinner(false);
        newLoanSuccessAlert();
      } else {
        setDisplaySpinner(false);
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>{userLoanRequestResponse[userLoanRequestResponse.length - 1]["message"]}</NativeBaseText>
            </Box>
          ),
        });
      }
    }
  }, [userLoanRequestResponse]);

  useEffect(() => {
    if (userEmployerUpdateResponse.length > 0 && loanRequisiteData.payload.accountNo != "") {
      if (userEmployerUpdateResponse[userEmployerUpdateResponse.length - 1]?.status == "success") {
        dispatch(getUserLoanHistory());
        //
        setTimeout(() => {
          setDisplaySpinner(false);
          navigation.goBack();
        }, 3000);
        //
      } else {
        setDisplaySpinner(false);
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>{userEmployerUpdateResponse[userEmployerUpdateResponse.length - 1]["message"]}</NativeBaseText>
            </Box>
          ),
        });
      }
    }
  }, [userEmployerUpdateResponse]);

  const verifyEmploymentFunc = () => {
    if (loanRequisiteData.payload.employer == "" || loanRequisiteData.payload.bankName == "" || loanRequisiteData.payload.accountNo == "") {
      if (loanRequisiteData.payload.employer == "") {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>{`Please select Employer`}</NativeBaseText>
            </Box>
          ),
        });
      } else if (loanRequisiteData.payload.bankName == "") {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>{`Select salary bank`}</NativeBaseText>
            </Box>
          ),
        });
      } else {
        toast.show({
          render: () => (
            <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
              <NativeBaseText style={{ color: "#FFFFFF" }}>{`Enter salary account number`}</NativeBaseText>
            </Box>
          ),
        });
      }
    } else {
      setDisplaySpinner(true);
      dispatch(updateEmploymentDetails(loanRequisiteData.payload.employer, loanRequisiteData.payload.bankName, loanRequisiteData.payload.accountNo));
    }
  };

  const requestLoanFunc = () => {
    if (loanAmount < 1000) {
      toast.show({
        render: () => (
          <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
            <NativeBaseText style={{ color: "#FFFFFF" }}>{`Invalid loan amount`}</NativeBaseText>
          </Box>
        ),
      });
    } else if (loanDuration == "") {
      toast.show({
        render: () => (
          <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
            <NativeBaseText style={{ color: "#FFFFFF" }}>{`Loan duration must be set`}</NativeBaseText>
          </Box>
        ),
      });
    } else if (loanDuration != "1") {
      toast.show({
        render: () => (
          <Box bg={toastColorObject["danger"]} px="2" py="2" rounded="sm" mb={5}>
            <NativeBaseText style={{ color: "#FFFFFF" }}>{`Direct debit mandate required for ${loanDuration} months duration.`}</NativeBaseText>
          </Box>
        ),
      });
    } else {
      Alert.alert(
        "🆕 Loan Request",
        `𝐏𝐫𝐢𝐧𝐜𝐢𝐩𝐚𝐥: ₦${numberWithCommas(loanAmount)}
𝐏𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐅𝐞𝐞: ₦${Math.min(Number(loanAmount * 0.005).toFixed(2), 750)}\n
𝐈𝐧𝐭𝐞𝐫𝐞𝐬𝐭: 6.5 percent /Mo.
𝐃𝐮𝐫𝐚𝐭𝐢𝐨𝐧: ${loanDuration} Month(s)\n
𝐓𝐨𝐭𝐚𝐥 𝐏𝐚𝐲𝐚𝐛𝐥𝐞: ₦${numberWithCommas(Number(loanAmount * 0.065 * loanDuration + loanAmount).toFixed(2))}
𝐌𝐨𝐧𝐭𝐡𝐥𝐲 𝐜𝐡𝐚𝐫𝐠𝐞: ₦${numberWithCommas(+(Number(loanAmount * 0.065 * loanDuration + loanAmount) / parseInt(loanDuration)).toFixed(2))}`,

        [
          {
            text: "Cancel",
            onPress: () => {
              return null;
            },
          },
          {
            text: "Confirm",
            onPress: () => {
              setDisplaySpinner(true);
              dispatch(requestNewLoan(loanAmount, loanDuration));
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const newLoanSuccessAlert = () => {
    Alert.alert(
      "Congratulations",
      `Your new loan request been sent. Awaiting disbursement.`,
      [
        {
          text: "Proceed",
          onPress: () => {
            dispatch(getUserLoanHistory());
            navigation.goBack();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderLoanRequestStage = () => {
    switch (loanRequestStage) {
      case 0:
        return (
          <Fragment>
            <View style={{ paddingHorizontal: 10 }}>
              <AppText bold styles={{ marginTop: 15, fontSize: 16 }}>
                Choose Employer
              </AppText>
              <View
                style={{
                  marginTop: 10,
                  borderWidth: 0.5,
                  borderColor: "#266ddc",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <Picker
                  style={{ height: 45 }}
                  onValueChange={(itemValue, itemIndex) => {
                    setLoanRequisiteData((prevState) => ({
                      ...prevState,
                      payload: {
                        ...prevState.payload,
                        employer: itemValue,
                      },
                    }));
                  }}
                  accessibilityLabel="Choose Country"
                  borderColor={"transparent"}
                  selectedValue={loanRequisiteData.payload.employer}
                >
                  <Picker.Item label="--- Select Employer ---" value="" />
                  <Picker.Item label="Ancla Technologies" value="1" />
                  <Picker.Item label="Charisol Inc" value="2" />
                  <Picker.Item label="Ekist State Government" value="3" />
                  <Picker.Item label="Prelate Travel Ltd" value="4" />
                  <Picker.Item label="RCCG Trinity Temple Parish" value="5" />
                </Picker>
              </View>

              {/** Select Bank */}
              <AppText bold styles={{ marginTop: 15, fontSize: 16 }}>
                Salary Bank
              </AppText>

              <View
                style={{
                  marginTop: 10,
                  borderWidth: 0.5,
                  borderColor: "#266ddc",
                  borderRadius: 10,
                }}
              >
                <Picker
                  style={{ height: 45 }}
                  onValueChange={(itemValue, itemIndex) => {
                    setLoanRequisiteData((prevState) => ({
                      ...prevState,
                      payload: {
                        ...prevState.payload,
                        bankName: itemValue,
                      },
                    }));
                  }}
                  selectedValue={loanRequisiteData.payload.bankName}
                >
                  <Picker.Item label="--- Select Bank ---" value="" />

                  {nigeriaBanks.map((data, index) => {
                    return <Picker.Item key={index} label={data.bankName} value={data.bankCode} />;
                  })}
                </Picker>
              </View>

              {/** Salary Account Number */}
              <AppText bold styles={{ marginTop: 20, fontSize: 16 }}>
                Salary Account
              </AppText>
              <TextInput
                style={{ ...styles.textInput, marginTop: 10 }}
                placeholder="Enter Account Number"
                placeholderTextColor="gray"
                maxLength={11}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setLoanRequisiteData((prevState) => ({
                    ...prevState,
                    payload: {
                      ...prevState.payload,
                      accountNo: text,
                    },
                  }))
                }
              />
            </View>

            {displaySpinner ? (
              <View style={{ width: "100%", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                <Spinner color="blue.600" size="lg" />
              </View>
            ) : (
              <View style={{ width: "100%", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                <PrimaryButton onPress={() => verifyEmploymentFunc()} styles={{ height: 45, width: "50%" }}>
                  <AppText bold styles={{ color: "#FFFFFF" }}>
                    Verify Employment
                  </AppText>
                </PrimaryButton>
              </View>
            )}
          </Fragment>
        );
      case 1:
        return (
          <Fragment>
            <View style={{ paddingHorizontal: 10 }}>
              <AppText bold styles={{ marginTop: 15, color: "#040404", textAlign: "center", fontSize: 25 }}>
                ₦{numberWithCommas(loanAmount)}
              </AppText>

              <Slider
                style={{ width: "80%", height: 50, alignSelf: "center" }}
                minimumValue={availableLoanRange.min}
                maximumValue={availableLoanRange.max}
                minimumTrackTintColor="#266ddc"
                maximumTrackTintColor="#fc9c3d"
                thumbTintColor="#fc9c3d"
                step={500}
                value={loanAmount}
                onValueChange={(data) => setLoanAmount(parseInt(data))}
              />
              <AppText bold styles={{ color: "gray", textAlign: "center", fontSize: 12 }}>
                **Slide to change amount.
              </AppText>

              {/** Duration */}
              <AppText bold styles={{ marginTop: 15, fontSize: 16 }}>
                Loan Duration
              </AppText>
              <View
                style={{
                  marginTop: 10,
                  borderWidth: 0.5,
                  borderColor: "#266ddc",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <Picker
                  style={{ height: 45 }}
                  onValueChange={(itemValue, itemIndex) => {
                    setLoanDuration(itemValue);
                  }}
                  borderColor={"transparent"}
                  selectedValue={loanDuration}
                >
                  <Picker.Item label="--- Select Tenure ---" value="" />
                  <Picker.Item label="1 Month" value="1" />
                  <Picker.Item label="2 Months" value="2" />
                  <Picker.Item label="3 Months" value="3" />
                </Picker>
              </View>

              {/** Processing Fee */}
              <AppText bold styles={{ marginTop: 20, fontSize: 16 }}>
                Processing Fee
              </AppText>
              <TextInput
                editable={false}
                style={{ ...styles.textInput, marginTop: 10, color: "gray" }}
                placeholderTextColor="gray"
                value={`₦${Math.min(Number(loanAmount * 0.005).toFixed(2), 750)}`}
              />

              {/** Interest Rate */}
              <AppText bold styles={{ marginTop: 10, fontSize: 16 }}>
                Interest
              </AppText>
              <TextInput
                editable={false}
                style={{ ...styles.textInput, marginTop: 10, color: "gray" }}
                placeholderTextColor="gray"
                value={`${loanDuration == "2" || loanDuration == "3" ? "6.5% per month" : "6.5%"}`}
              />

              {/** Foot Note */}
              <AppText styles={{ color: "green", marginTop: 10, lineHeight: 20 }}>
                <AppText bold>N.B</AppText> If your pay day comes earlier than 29 days from now; VetroPay helps calculate your interest at 0.2% per day. Loans closer to paydays
                enjoy lower interest rate.
              </AppText>
            </View>

            {displaySpinner ? (
              <View style={{ width: "100%", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                <Spinner color="blue.600" size="lg" />
              </View>
            ) : (
              <View style={{ width: "100%", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                <PrimaryButton onPress={() => requestLoanFunc()} styles={{ height: 45, width: "50%" }}>
                  <AppText bold styles={{ color: "#FFFFFF" }}>
                    Request Loan Amount
                  </AppText>
                </PrimaryButton>
              </View>
            )}
          </Fragment>
        );
    }
  };

  return <View style={styles.container}>{renderLoanRequestStage()}</View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f2f2",
    flex: 1,
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
