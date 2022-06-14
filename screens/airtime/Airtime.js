import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, StyleSheet, ScrollView, TextInput, Text, Image, TouchableOpacity, Modal, FlatList, Button } from "react-native";
import AppText from "../../resources/AppText";
import * as Contacts from "expo-contacts";
const MTNlogo = require("../../assets/logos/MTN.png");
const GloLogo = require("../../assets/logos/Glo.png");
const AirtelLogo = require("../../assets/logos/Airtel.png");
const etisalatLogo = require("../../assets/logos/9mobile.png");
const spectranetLogo = require("../../assets/logos/spectranet2.png");
import { AppButton, PrimaryButton } from "../../resources/AppButton";
import { MaterialIcons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Spinner } from "native-base";
import { buyUtility } from "../../containers/utility/action";
import { SuccessfulSvgComponent } from "../../resources/Svg";
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import DataPlans from "./DataPlans";

const INTERNET = "internet";
const AIRTIME = "airtime";
const SERVICE_PROVIDERS_LOGO_OBJECT = {
  MTN: MTNlogo,
  GLO: GloLogo,
  AIRTEL: AirtelLogo,
  "9MOBILE": etisalatLogo,
  SPECTRANET: spectranetLogo,
};

function Separator() {
  return <View style={styles.separator} />;
}

export default function Airtime() {
  class UserContactListItem extends React.PureComponent {
    render() {
      return (
        <View style={{ marginTop: 5 }}>
          {this.props.contact.phoneNumbers &&
            this.props.contact.phoneNumbers.map((numbers, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setPhoneNumber(numbers.number.replace(/\s/g, ""));
                    setModalPhoneBookOpen(false);
                  }}
                  key={index}
                >
                  <View>
                    <Text>
                      {this.props.contact.firstName} {this.props.contact.lastName}
                    </Text>
                    <Text>{numbers.number}</Text>
                    <Separator />
                  </View>
                </TouchableOpacity>
              );
            })}
        </View>
      );
    }
  }

  const dispatch = useDispatch();
  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };
  const _renderItem = (item) => <UserContactListItem contact={item} />;
  const [networkProvider, setNetworkProvider] = useState("");
  const [utilityCategory, setUtilityCategory] = useState(AIRTIME);
  const [modalPhoneBookOpen, setModalPhoneBookOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [makePaymentStage, setMakePaymentStage] = useState(1);
  const [phoneContacts, setPhoneContacts] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState(false);
  const [transactionPin, setTransactionPin] = useState("");
  const [displaySpinner, setDisplaySpinner] = useState(false);
  const [displayTransactionPinError, setDisplayTransactionPinError] = useState(false);
  const [transactionGenericError, setTransactionGenericError] = useState("");
  const [internetProviderDataPlans, setInternetProviderDataPlans] = useState({});
  const [selectedDataBundle, setSelectedDataBundle] = useState(null);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["1%", "90%"], []);

  const airtimePurchaseData = useSelector((state) => state.utility.buyutility);
  const prevAirtimePurchaseData = usePrevious(airtimePurchaseData);
  const userAuthentication = useSelector((state) => state.authentication.user);
  const userCurrency = userAuthentication.country == "NIGERIA" ? "NGN" : "KES";

  //Search Contacts Listener
  const [filteredContacts, setFilteredContacts] = useState({
    noData: true,
    data: [],
  });

  useEffect(() => {
    if (prevAirtimePurchaseData) {
      if (prevAirtimePurchaseData.length !== airtimePurchaseData.length) {
        if (airtimePurchaseData[airtimePurchaseData.length - 1]["status"] == "success") {
          setMakePaymentStage(2);
        } else {
          setDisplaySpinner(false);
          setTransactionGenericError(airtimePurchaseData[airtimePurchaseData.length - 1]["message"]);
        }
      }
    }
  });

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          setPhoneContacts(data);
          setFilteredContacts({
            noData: false,
            data: data,
          });
          // const contact = data[0];
          // console.log(contact);
        }
      }
    })();
  }, []);

  const renderBackdrop = useCallback((props) => <BottomSheetBackdrop {...props} />, []);
  const handleSheetChanges = useCallback((index) => {
    //console.log("handleSheetChanges", index);
  }, []);

  const handleSheetCloseRequest = (data) => {
    bottomSheetRef.current.close();
  };

  const searchContact = (searchText) => {
    let text = searchText.toLowerCase();
    let fullContactList = phoneContacts;
    let filteredContactsSearched = fullContactList.filter((item) => {
      if (item.name.toLowerCase().match(text)) return item;
    });

    if (!text || text === "") {
      setFilteredContacts({
        noData: false,
        data: fullContactList,
      });
    } else if (!filteredContactsSearched.length) {
      setFilteredContacts({
        noData: true,
        data: [],
      });
    } else if (Array.isArray(filteredContactsSearched)) {
      setFilteredContacts({
        noData: false,
        data: filteredContactsSearched,
      });
    }
  };
  // End Search Contacts Listener

  const closeTransactionModal = () => {
    setPaymentModalOpen(false);
    setMakePaymentStage(1);
    setPhoneNumber("");
    setAmount("");
    setNetworkProvider("");
    setDisplaySpinner(false);
    setTransactionPin("");
    setTransactionGenericError("");
    setDisplayTransactionPinError(false);
    setAmountError(false);
  };

  const proceedToPayments = () => {
    if (networkProvider !== "" && phoneNumber !== "" && amount !== "") {
      if (utilityCategory == AIRTIME && Number(amount) < 100) {
        setAmountError(true);
      } else {
        setPaymentModalOpen(true);
      }
    }
  };

  const makePayment = () => {
    if (transactionPin != "") {
      if (utilityCategory == AIRTIME) {
        const transactionDetails = {
          transactionType: "airtime",
          anchorID: phoneNumber,
          details: {
            amount: amount,
            provider: networkProvider,
            phonenumber: phoneNumber,
            acquiringMerchant: "Ancla Technologies Ltd",
          },
        };
        dispatch(buyUtility(transactionPin, JSON.stringify(transactionDetails), amount));
        setDisplaySpinner(true);
      } else {
        const transactionDetails = {
          transactionType: INTERNET,
          anchorID: phoneNumber,
          details: {
            amount: amount,
            provider: networkProvider,
            phonenumber: phoneNumber,
            acquiringMerchant: "Ancla Technologies Ltd",
            ...selectedDataBundle,
          },
        };
        dispatch(buyUtility(transactionPin, JSON.stringify(transactionDetails), amount));
        setDisplaySpinner(true);
      }
    } else {
      setDisplayTransactionPinError(true);
    }
  };

  const renderPaymentModal = () => {
    switch (makePaymentStage) {
      case 1:
        return (
          <View style={{ ...styles.modalContent, borderColor: "#266ddc", borderWidth: 2 }}>
            {/** Modal Header */}
            <View style={{ marginTop: 16, flexDirection: "row", justifyContent: "space-between" }}>
              <AppText bold="true" styles={{ fontSize: 18 }}>
                Transaction Details
              </AppText>
              <MaterialIcons
                color="grey"
                name="close"
                size={24}
                onPress={() => {
                  closeTransactionModal();
                }}
                style={{ paddingRight: 10 }}
              />
            </View>
            {/** End Modal Header */}

            <View style={{ marginTop: 24, paddingRight: 20 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <AppText styles={{ fontSize: 15 }}>
                  <Text style={{ fontWeight: "700" }}>Phone Number</Text>
                </AppText>
                <AppText bold="true" styles={{ fontSize: 15 }}>
                  {phoneNumber}
                </AppText>
              </View>
            </View>

            <View style={{ marginTop: 10, paddingRight: 20 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <AppText styles={{ fontSize: 15 }}>
                  <Text style={{ fontWeight: "700" }}>Provider</Text>
                </AppText>
                <AppText bold="true" styles={{ fontSize: 15 }}>
                  {networkProvider}
                </AppText>
              </View>
            </View>

            {/** Amount  */}
            <View style={{ marginTop: 10, paddingRight: 20 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <AppText styles={{ fontSize: 15 }}>
                  <Text style={{ fontWeight: "700" }}>Amount</Text>
                </AppText>
                <AppText bold="true" styles={{ fontSize: 15 }}>
                  {userCurrency} {amount}
                </AppText>
              </View>
            </View>

            {/** Transaction Pin */}
            <View style={{ marginTop: 24 }}>
              <AppText bold="true" styles={{ fontSize: 18 }}>
                Transaction Pin
              </AppText>
              <AppText styles={{ fontSize: 14, color: "red", textAlign: "center", display: `${displayTransactionPinError ? "flex" : "none"}` }}>Input transaction pin!</AppText>
              <AppText styles={{ fontSize: 14, color: "red", textAlign: "center" }}>{transactionGenericError}</AppText>
              <TextInput
                value={transactionPin}
                style={{ ...styles.textInput, marginTop: 10, borderColor: "#266ddc" }}
                placeholder="Enter Transaction Pin"
                textContentType="password"
                secureTextEntry
                onChangeText={(text) => setTransactionPin(text)}
              />
            </View>

            <AppButton
              onPress={() => makePayment()}
              styles={{ marginTop: 10, display: `${!displaySpinner ? "flex" : "none"}`, backgroundColor: "#266ddc", padding: 12, justifyContent: "center", alignItems: "center" }}
            >
              <AppText bold="true" styles={{ textTransform: "uppercase", fontSize: 15, color: "#ffffff" }}>
                Complete
              </AppText>
            </AppButton>

            <View style={{ justifyContent: "center", display: `${displaySpinner ? "flex" : "none"}` }}>
              <Spinner color="blue" />
            </View>
          </View>
        );

      case 2:
        return (
          <View style={{ ...styles.modalContent, borderColor: "#266ddc", borderWidth: 2 }}>
            {/** Modal Header */}
            <View style={{ marginTop: 16, flexDirection: "row", justifyContent: "flex-end" }}>
              <MaterialIcons
                color="grey"
                name="close"
                size={24}
                onPress={() => {
                  closeTransactionModal();
                }}
                style={{ paddingRight: 10 }}
              />
            </View>
            {/** End Modal Header */}

            <View style={{ marginTop: 50, justifyContent: "center", alignItems: "center" }}>
              <SuccessfulSvgComponent />
            </View>

            <AppText bold="true" styles={{ fontSize: 18, marginTop: 16, textAlign: "center" }}>
              Transaction Successful
            </AppText>
            <AppText styles={{ fontSize: 15, marginTop: 16, textAlign: "center" }}>
              Your {utilityCategory} purchase of {userCurrency} {amount} to {phoneNumber} was Successful
            </AppText>

            <View style={{ marginTop: 24, alignItems: "center" }}>
              <PrimaryButton
                onPress={() => {
                  closeTransactionModal();
                }}
              >
                <AppText bold="true" styles={{ color: "#fff", fontSize: 16 }}>
                  Close
                </AppText>
              </PrimaryButton>

              <View style={{ marginTop: 16, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <MaterialIcons name="home" size={18} color="#266ddc" />
                <AppText bold="true" styles={{ fontSize: 18, color: "#266ddc" }}>
                  {" "}
                  Go home
                </AppText>
              </View>
            </View>
          </View>
        );
    }
  };

  const renderPurchaseService = () => {
    if (utilityCategory == AIRTIME) {
      return (
        <View style={styles.innerContainer}>
          <KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={10} enableOnAndroid={true} extraHeight={Platform.select({ android: 150 })} style={{ flexGrow: 1 }}>
            <AppText bold="true" styles={{ marginTop: 10, fontSize: 16, marginBottom: 10 }}>
              Select network provider
            </AppText>
            <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
              <TouchableOpacity
                onPress={() => setNetworkProvider("MTN")}
                style={{ ...styles.airtimeCard, borderWidth: 2, borderColor: `${networkProvider == "MTN" ? "#266ddc" : "#ffffff"}` }}
              >
                <Image style={styles.logos} source={MTNlogo} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setNetworkProvider("GLO")}
                style={{ ...styles.airtimeCard, borderWidth: 2, borderColor: `${networkProvider == "GLO" ? "#266ddc" : "#ffffff"}` }}
              >
                <Image style={styles.logos} source={GloLogo} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setNetworkProvider("AIRTEL")}
                style={{ ...styles.airtimeCard, borderWidth: 2, borderColor: `${networkProvider == "AIRTEL" ? "#266ddc" : "#ffffff"}` }}
              >
                <Image style={styles.logos} source={AirtelLogo} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setNetworkProvider("9MOBILE")}
                style={{ ...styles.airtimeCard, borderWidth: 2, borderColor: `${networkProvider == "9MOBILE" ? "#266ddc" : "#ffffff"}` }}
              >
                <Image style={styles.logos} source={etisalatLogo} />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  setModalPhoneBookOpen(true);
                }}
                style={styles.choiceBox}
              >
                <AppText styles={styles.choiceBoxText}>
                  <Text style={{ fontWeight: "700" }}>Open PhoneBook</Text>
                </AppText>
              </TouchableOpacity>

              <View style={styles.choiceBox}>
                <AppText styles={styles.choiceBoxText}>
                  <Text style={{ fontWeight: "700" }}>Find Beneficiary</Text>
                </AppText>
              </View>
            </View>

            <View style={styles.formGroup}>
              <TextInput
                style={{ ...styles.textInput, borderColor: "#266ddc" }}
                placeholder="Enter Phone Number"
                value={phoneNumber}
                keyboardType="numeric"
                onChangeText={(text) => setPhoneNumber(text.replace(/\s/g, ""))}
              />
            </View>

            <AppText>
              <Text style={{ fontWeight: "700" }}>Select Amount</Text>
            </AppText>
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10, justifyContent: "space-evenly" }}>
              <TouchableOpacity onPress={() => setAmount("100")} style={styles.choiceBox}>
                <AppText styles={styles.choiceBoxText}>
                  <Text style={{ fontWeight: "700" }}>₦100</Text>
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setAmount("500")} style={styles.choiceBox}>
                <AppText styles={styles.choiceBoxText}>
                  <Text style={{ fontWeight: "700" }}>₦500</Text>
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setAmount("1000")} style={styles.choiceBox}>
                <AppText styles={styles.choiceBoxText}>
                  <Text style={{ fontWeight: "700" }}>₦1000</Text>
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setAmount("2000")} style={styles.choiceBox}>
                <AppText styles={styles.choiceBoxText}>
                  <Text style={{ fontWeight: "700" }}>₦2000</Text>
                </AppText>
              </TouchableOpacity>
            </View>
            <View style={styles.formGroup}>
              <AppText styles={{ fontSize: 14, color: "red", display: `${amountError ? "flex" : "none"}` }}>Amount cannot be less than ₦100 </AppText>
              <TextInput
                style={{ ...styles.textInput, borderColor: "#266ddc" }}
                placeholder="Enter Amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={(text) => {
                  setAmount(text.replace(/\s/g, ""));
                }}
              />
            </View>

            <AppButton onPress={() => proceedToPayments()} styles={{ backgroundColor: "#266ddc", padding: 12, justifyContent: "center", alignItems: "center" }}>
              <AppText bold="true" styles={{ textTransform: "uppercase", fontSize: 15, color: "#ffffff" }}>
                Proceed
              </AppText>
            </AppButton>
          </KeyboardAwareScrollView>
        </View>
      );
    } else {
      return (
        <View style={styles.innerContainer}>
          <KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={10} enableOnAndroid={true} extraHeight={Platform.select({ android: 150 })} style={{ flexGrow: 1 }}>
            <AppText bold="true" styles={{ marginTop: 10, fontSize: 16, marginBottom: 10 }}>
              Select network provider
            </AppText>
            <View style={{ flexDirection: "row", justifyContent: "space-evenly", flexWrap: "wrap" }}>
              <TouchableOpacity
                onPress={() => {
                  setNetworkProvider("MTN");
                  bottomSheetRef.current?.expand();
                }}
                style={{ ...styles.airtimeCard, borderWidth: 2, borderColor: `${networkProvider == "MTN" ? "#266ddc" : "#ffffff"}` }}
              >
                <Image style={styles.logos} source={MTNlogo} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setNetworkProvider("GLO");
                  bottomSheetRef.current?.expand();
                }}
                style={{ ...styles.airtimeCard, borderWidth: 2, borderColor: `${networkProvider == "GLO" ? "#266ddc" : "#ffffff"}` }}
              >
                <Image style={styles.logos} source={GloLogo} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setNetworkProvider("AIRTEL");
                  bottomSheetRef.current?.expand();
                }}
                style={{ ...styles.airtimeCard, borderWidth: 2, borderColor: `${networkProvider == "AIRTEL" ? "#266ddc" : "#ffffff"}` }}
              >
                <Image style={styles.logos} source={AirtelLogo} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setNetworkProvider("9MOBILE");
                  bottomSheetRef.current?.expand();
                }}
                style={{ ...styles.airtimeCard, borderWidth: 2, borderColor: `${networkProvider == "9MOBILE" ? "#266ddc" : "#ffffff"}` }}
              >
                <Image style={styles.logos} source={etisalatLogo} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setNetworkProvider("SPECTRANET");
                  bottomSheetRef.current?.expand();
                }}
                style={{ ...styles.airtimeCard, borderWidth: 2, borderColor: `${networkProvider == "SPECTRANET" ? "#266ddc" : "#ffffff"}` }}
              >
                <Image style={styles.logos} source={spectranetLogo} />
              </TouchableOpacity>
            </View>

            {selectedDataBundle && (
              <View style={{ backgroundColor: "rgba(252,156,61,0.8)", marginVertical: 8, padding: 5, borderRadius: 5, justifyContent: "space-between" }}>
                <AppText bold>Data Plan: &nbsp; {selectedDataBundle?.name}</AppText>
              </View>
            )}

            <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  setModalPhoneBookOpen(true);
                }}
                style={styles.choiceBox}
              >
                <AppText styles={styles.choiceBoxText}>
                  <Text style={{ fontWeight: "700" }}>Open PhoneBook</Text>
                </AppText>
              </TouchableOpacity>

              <View style={styles.choiceBox}>
                <AppText styles={styles.choiceBoxText}>
                  <Text style={{ fontWeight: "700" }}>Find Beneficiary</Text>
                </AppText>
              </View>
            </View>

            <View style={styles.formGroup}>
              <TextInput
                style={{ ...styles.textInput, borderColor: "#266ddc" }}
                placeholder="Enter Phone Number"
                value={phoneNumber}
                keyboardType="numeric"
                onChangeText={(text) => setPhoneNumber(text.replace(/\s/g, ""))}
              />
            </View>

            <AppText bold styles={{ marginTop: 10 }}>
              Plan Amount
            </AppText>

            <View style={styles.formGroup}>
              <AppText styles={{ fontSize: 14, color: "red", display: `${amountError ? "flex" : "none"}` }}>Amount cannot be less than ₦100 </AppText>
              <TextInput
                editable={false}
                style={{ ...styles.textInput, borderColor: "#266ddc" }}
                placeholder="Select your Network Provider above"
                keyboardType="numeric"
                value={amount}
                onChangeText={(text) => {
                  setAmount(text.replace(/\s/g, ""));
                }}
              />
            </View>

            <AppButton onPress={() => proceedToPayments()} styles={{ backgroundColor: "#266ddc", padding: 12, justifyContent: "center", alignItems: "center" }}>
              <AppText bold="true" styles={{ textTransform: "uppercase", fontSize: 15, color: "#ffffff" }}>
                Proceed
              </AppText>
            </AppButton>
          </KeyboardAwareScrollView>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <BottomSheetModalProvider>
        <Modal transparent visible={modalPhoneBookOpen} animationType="slide">
          <View style={styles.phoneBookModalContent}>
            <MaterialIcons name="close" size={24} onPress={() => setModalPhoneBookOpen(false)} style={styles.modalClose} />

            <View style={{ paddingHorizontal: 10 }}>
              <AppText bold="true" styles={{ fontSize: 16 }}>
                Select Phone Number
              </AppText>

              <View style={styles.formGroup}>
                <TextInput style={{ ...styles.textInput }} onChangeText={(text) => searchContact(text)} placeholder="Search Phone Book" />
              </View>

              {filteredContacts.noData ? (
                <Text>No data</Text>
              ) : (
                <FlatList data={filteredContacts.data} renderItem={({ item }) => _renderItem(item)} keyExtractor={(item, index) => index.toString()} />
              )}
            </View>
          </View>
        </Modal>
        <Modal transparent visible={paymentModalOpen} animationType="slide">
          <KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={10} enableOnAndroid={true} extraHeight={Platform.select({ android: 150 })} style={{ flexGrow: 1 }}>
            <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)", height: 1000 }}>{renderPaymentModal()}</View>
          </KeyboardAwareScrollView>
        </Modal>

        <ScrollView>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <TouchableOpacity
              onPress={() => {
                setUtilityCategory(AIRTIME);
              }}
              style={{ width: "50%", justifyContent: "center", alignItems: "center" }}
            >
              <AppText>Airtime</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setUtilityCategory(INTERNET);
              }}
              style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
            >
              <AppText>Data</AppText>
            </TouchableOpacity>
          </View>
          <View style={{ position: "relative", marginTop: 10, flexDirection: "column" }}>
            <View style={{ ...styles.headerSeparator, marginLeft: 0 }} />
            <View
              style={{
                ...styles.headerSeparator,
                marginLeft: 0,
                position: "absolute",
                width: "50%",
                borderBottomWidth: 3,
                borderBottomColor: "#266ddc",
                alignSelf: utilityCategory == AIRTIME ? "flex-start" : "flex-end",
              }}
            />
          </View>
          {renderPurchaseService()}
        </ScrollView>
        <BottomSheet ref={bottomSheetRef} index={0} enablePanDownToClose={true} snapPoints={snapPoints} backdropComponent={renderBackdrop} onChange={handleSheetChanges}>
          <View style={{ paddingHorizontal: 20 }}>
            {networkProvider != "" && (
              <DataPlans
                serviceProvider={networkProvider}
                serviceProviderLogo={SERVICE_PROVIDERS_LOGO_OBJECT[networkProvider]}
                internetProviderDataPlans={internetProviderDataPlans}
                setInternetProviderDataPlans={setInternetProviderDataPlans}
                setSelectedDataBundle={setSelectedDataBundle}
                handleSheetCloseRequest={handleSheetCloseRequest}
                setAmount={setAmount}
              />
            )}
          </View>
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
  innerContainer: {
    marginHorizontal: 10,
  },
  logos: {
    width: 40,
    height: 40,
  },
  airtimeCard: {
    backgroundColor: "#ffffff",
    elevation: 3,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  choiceBox: {
    backgroundColor: "#ffffff",
    elevation: 3,
    padding: 10,
    borderRadius: 5,
  },
  choiceBoxText: {
    color: "#266ddc",
  },

  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth + 0.4,
  },
  headerSeparator: {
    marginVertical: 2,
    marginLeft: "10%",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  textInput: {
    height: 45,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderTopRightRadius: 4,

    borderColor: "#ddd",
  },

  formGroup: {
    marginBottom: 8,
    marginTop: 8,
  },

  phoneBookModalContent: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },

  modalContent: {
    flex: 1,
    marginTop: 80,
    borderRadius: 5,
    maxHeight: 500,
    marginLeft: 20,
    marginRight: 20,
    paddingHorizontal: 10,
    backgroundColor: "#F0F0F8",
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
});
