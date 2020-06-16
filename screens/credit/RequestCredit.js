import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Dimensions, View, Text, StyleSheet, TouchableWithoutFeedback, Modal, ScrollView } from "react-native";
import CheckBox from "@react-native-community/checkbox";
import AppText from "../../resource/AppText";
import { PrimaryButton, AppButton } from "../../resource/AppButton";
import { MaterialIcons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { numberWithCommas } from "../../resource/MetaFunctions";
import { SuccessfulSvgComponent } from "../../resource/Svg";

import { requestCredit } from "../../containers/credit/action";
import { Spinner } from "native-base";

export default function RequestCredit({ navigation }) {
  const userAuthentication = useSelector((state) => state.authentication.user);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContentStage, setModalContentStage] = useState(1);

  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [creditModalStage, setCreditModalStage] = useState(1);
  const [optionsSelected, setOptionSelected] = useState({ creditSelected: false, agreedTerms: false });
  const [proceedBoolean, setProceedBoolean] = useState(false);
  const [selectedValue, setSelectedValue] = useState("NGN1");

  const [displaySpinner, setDisplaySpinner] = useState(false);
  const [displayRequestError, setDisplayRequestError] = useState(false);

  const creditObject = {
    //TAP = Total Amount Payable
    NGN1: { amount: 5000, TAP: 5100 },
    NGN2: { amount: 10000, TAP: 10200 },
    NGN3: { amount: 25000, TAP: 25500 },
    NGN4: { amount: 50000, TAP: 51000 },
  };

  const checkToProceed = () => {
    if (!optionsSelected.agreedTerms) {
      setProceedBoolean(true);
    } else {
      setProceedBoolean(false);
    }
  };

  const checkCheck = (option) => {
    if (option == "creditSelected") {
      setOptionSelected((prevState) => ({
        creditSelected: true,
      }));
      setProceedBoolean(false);
    }

    if (option == "agreedTerms") {
      setOptionSelected((prevState) => ({
        ...prevState,
        agreedTerms: !prevState.agreedTerms,
      }));
      checkToProceed();
    }
  };

  const selectValue = (id) => {
    if (selectedValue !== id) {
      checkCheck("creditSelected");
      setSelectedValue(id);
    }
  };

  const dispatch = useDispatch();

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const userRequestCredit = useSelector((state) => state.credit.requestcredit);
  const prevUserRequestCredit = usePrevious(userRequestCredit);

  useEffect(() => {
    if (prevUserRequestCredit) {
      if (prevUserRequestCredit.length !== userRequestCredit.length) {
        if (userRequestCredit[userRequestCredit.length - 1]["status"] == "success") {
          setDisplaySpinner(false);
          setCreditModalStage(2);
        } else {
          setDisplayRequestError(true);
          setDisplaySpinner(false);
        }
      }
    }
  });

  const requestCreditFunc = (amount) => {
    setDisplayRequestError(false);
    setDisplaySpinner(true);
    dispatch(requestCredit(amount));
  };

  return (
    <View style={styles.container}>
      {/** T & C Modal */}
      <Modal visible={modalOpen} animationType="slide">
        <View style={styles.modalContent}>
          {modalContentStage == 1 ? (
            <View>
              <View
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  zIndex: 1,
                }}
              >
                <PrimaryButton onPress={() => setModalContentStage(2)}>
                  <AppText bold="true" styles={{ color: "#fff", marginLeft: 2, fontSize: 16 }}>
                    Go to T&C
                  </AppText>
                </PrimaryButton>
              </View>
              <MaterialIcons name="close" size={24} onPress={() => setModalOpen(false)} style={styles.modalClose} />

              <View style={{ marginTop: 16 }}>
                <ScrollView style={{ height: Dimensions.get("window").height - 90 }}>
                  <AppText bold="true" styles={{ textAlign: "center", fontSize: 18 }}>
                    "VetroPay Mobile" Privacy Policy
                  </AppText>
                  <AppText styles={{ fontSize: 16, marginTop: 5 }}>Thank you for choosing VetroPay!</AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    The website: https://vetropay.com (its sub-domains, affliated websites, and any services made available therefrom, including mobile applications or hardware
                    products)(the "Platform") is operated by <Text style={{ fontWeight: "700" }}>Ancla Technologies LTD</Text>. We respect your privacy rights and recognize the
                    importance of protecting data collected from you and about you. This privacy policy describes how we collect, use, share and protect that data.
                  </AppText>
                  <AppText bold="true">Your continued use of this service constitutes your acceptance of this Privacy Policy.</AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    1. Collection of Data
                  </AppText>
                  <AppText styles={{ paddingHorizontal: 20 }}>"We collect personal data when you voluntarily provide it to us."</AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    We collect personal data from you at different juncture on the Platform. Personal data means information that can reasonably be used to identify you personally
                    (such as name, phone number, address, email address, Bank verification Number, ID card). We collect this personal data when you voluntarily provide it to us
                    (such as when you submit a KYC verification request). You can choose not to provide the requested data, but you might not be able to take advantage of certain
                    Platform features.
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    2. Use of Collected Data
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    We collect and use the types of data described above to assist in the administration and operation of the Platform and to provide you an efficient, meaningful,
                    and customized experience. We may use the data to:
                  </AppText>
                  <AppText styles={{ paddingHorizontal: 20 }}>
                    (a) Fulfill our obligations with respect to the reason you volunteered the data (e.g., to respond to an inquiry, evaluate your credit application, record
                    transaction details or history etc.);
                  </AppText>
                  <AppText styles={{ paddingHorizontal: 20, marginTop: 5 }}>(b) Allow you to enjoy full features of the Platform;</AppText>
                  <AppText styles={{ paddingHorizontal: 20, marginTop: 5 }}>(c) Improve the Platform or our products, events and services;</AppText>
                  <AppText styles={{ paddingHorizontal: 20, marginTop: 5 }}>(c) Optimize your experience;</AppText>
                  <AppText styles={{ paddingHorizontal: 20, marginTop: 5 }}>(d) For any other purpose with your consent or as permitted by law.</AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    Additionally, we may use the data for marketing purposes to: Provide you with additional information regarding products, events and services from Ancla
                    Technologies, and its subsidiaries and affiliated companies via email or through advertising on various social media platforms or websites (both desktop and
                    mobile) that you may visit.{" "}
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    3. Data Security
                  </AppText>
                  <AppText styles={{ paddingHorizontal: 20 }}>"Your password and security questions are fully encrpyted."</AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    This Platform has security measures in place to protect the loss or alteration of the information under our control. All the data regarding customers, users,
                    their device information and data are stored on a server. This server is located in a locked and guarded space and only authorized personnel have access to the
                    database containing the stored information. Data such as password and security answers can only be made available by you as it is completely obfuscated and
                    fully encrpyted.
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    4. How We Share Data
                  </AppText>
                  <AppText styles={{ paddingHorizontal: 20, marginTop: 5 }}>
                    1. <Text style={{ fontWeight: "700" }}>Affiliates and Subsidiaries.</Text> We may share your data collected on this Platform with our subsidiaries or affiliated
                    companies.
                  </AppText>

                  <AppText styles={{ paddingHorizontal: 20, marginTop: 5 }}>
                    2. <Text style={{ fontWeight: "700" }}>Service Providers. </Text>
                    We may provide collected data to our service providers. They may use your data to perform services for us and may have access to, store and process your
                    personal data to provide services on our behalf.
                  </AppText>

                  <AppText styles={{ paddingHorizontal: 20, marginTop: 5 }}>
                    3. <Text style={{ fontWeight: "700" }}>Law Enforcement and Safety.</Text> We may also share or disclose your data to comply with a court order or other legal
                    obligation, to enforce the Platform terms of use, and to protect the rights, property or safety of our users. We may disclose data to government or law
                    enforcement officials or private parties as we determine, in our sole and absolute discretion, is necessary or appropriate to respond to claims or to comply
                    with legal processes, to comply with laws, regulations or ordinances or to prevent or stop illegal, unethical or actionable activity.
                  </AppText>

                  <AppText styles={{ paddingHorizontal: 20, marginTop: 5 }}>
                    4. <Text style={{ fontWeight: "700" }}>Business Transfer</Text> In the event that Ancla Technologies undergoes a merger, acquisition by another company or sale
                    of its assets, your data will, in most instances, be part of the assets transferred.
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    4. Protection and Retention of Data
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    All Ancla Technologies products are built with strong security features that continuously protect your information. The insights we gain from maintaining our
                    services help us detect and automatically block security threats from ever reaching you. And if we do detect something risky that we think you should know
                    about, we’ll notify you and help guide you through steps to stay better protected.
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    We retain data only as long as necessary in light of the reasons it was collected as set forth in this Privacy Policy, or until you inform us you wish to have
                    your data deleted, whichever comes first. Please note that we may retain your data for longer periods of time as necessary to comply with our legal obligations
                    or respond to governmental authorities.
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    5. Children and Parents
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    We do not target or knowingly or intentionally collect personally identifiable information from children under the age of 18. By using this Platform, you have
                    represented and warranted that you are either at least 18 years of age or using the Platform with the supervision of a parent or guardian. If you become aware
                    that your child has provided us with personal information without your consent, please email us at support@vetropay.com.
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    6. Miscellaneous
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    From time to time, we may update this Privacy Policy to reflect, among other things, changes in the law or our data collection and use practices and such
                    modifications shall be effective upon posting by VetroPay. Your continued use of the Platform after an updated Privacy Policy signifies your acceptance of the
                    updated Privacy Policy. It is important that you review this Privacy Policy regularly to ensure you are updated as to any changes. If we make a material change
                    to this Privacy Policy, as determined in our sole discretion, we will notify you via email.
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    7. Contact Us
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    If you have any general questions about this Privacy Policy or other aspects of the Platform or would like to correct, update or erase data provided to us,
                    please email us at support@vetropay.com or write to us at:
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>VetroPay, Ancla Technologies LTD</AppText>
                  <AppText>Attention: VetroPay Mobile Privacy Policy</AppText>
                  <AppText>3 Alara Street, Sabo-Yaba</AppText>
                  <AppText>Lagos Mainland, Lagos, Nigeria.</AppText>
                  <View style={{ marginTop: 70 }}></View>
                </ScrollView>
              </View>
            </View>
          ) : (
            <View>
              <View
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  zIndex: 1,
                }}
              >
                <PrimaryButton onPress={() => setModalContentStage(1)}>
                  <AppText bold="true" styles={{ color: "#fff", marginLeft: 2, fontSize: 16 }}>
                    Go to PP
                  </AppText>
                </PrimaryButton>
              </View>
              <MaterialIcons name="close" size={24} onPress={() => setModalOpen(false)} style={styles.modalClose} />
              <View style={{ marginTop: 16 }}>
                <ScrollView style={{ height: Dimensions.get("window").height - 90 }}>
                  <AppText bold="true" styles={{ textAlign: "center", fontSize: 18 }}>
                    "VetroPay Mobile" Terms of Service
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    Foreword
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    <Text style={{ fontWeight: "700", textTransform: "uppercase" }}>Our Vision:</Text> To become your official payment partner.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    <Text style={{ fontWeight: "700", textTransform: "uppercase" }}>Our Mission:</Text> To enable you pay and get paid in an efficient, safe and most convinient
                    means whilst reducing the transaction charges required to the optimum.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    We intend to achieve this by creating a network of individuals like you, merchants and businesses around the world all operating within this{" "}
                    <Text style={{ fontWeight: "700" }}>Vetro-Payment-Network</Text>. This allows you to send money to family and friends, pay for goods and services locally or
                    internationally without having to worry about hefty duties or transaction charges.
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    We also help you keep track of your payment history like never before, giving you in-depth insights to your transaction records.{" "}
                    <Text style={{ fontWeight: "700" }}>Imagine being able to say for certain how much you had spent every year since 2004?</Text> That's one of the many advantages
                    of using VetroPay; Record Keeping! We help you keep and curate your transaction history; requestable at any instance in time.
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    We know you need access to Credit; Our system relies on an independent (yet collaborative) credit scoring algorithm derived from your profile, transaction
                    activity within our network and your existing national credit history.
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    I consider it vital to share my enthusiasm and optimism with you, because I believe it will not be sustainable unless you are part of this long-term goal and
                    vision.
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>We remain committed to your service. Thank you for choosing VetroPay.</AppText>
                  <AppText bold="true" styles={{ textAlign: "right", marginTop: 10 }}>
                    Olamigoke Philp A.
                  </AppText>
                  <AppText styles={{ textAlign: "right" }}>CEO, Ancla Technologies LTD</AppText>

                  <AppText bold="true" styles={{ textAlign: "center", fontSize: 18, marginTop: 25 }}>
                    Terms of Service
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    These Terms of Service ("Terms") govern your access to and use of VetroPay. Please read these Terms carefully and contact us if you have any questions. By
                    accessing our services on the Platform (including deposits, withdrawals, local and international fund transfers, credit facility, purchase and other transaction
                    history), you agree to be bound by these Terms and by our Privacy Policy<Text style={{ fontSize: 9 }}>[1]</Text>.
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    1. Opening an Account & KYC
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    (a). You are responsible for maintaining adequate security and control of any and all IDs, passwords, personal identification numbers, or any other codes that
                    you use to access your VetroPay account and the VetroPay services.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    (b). In order to open and maintain a VetroPay account, you must list your correct country/region of residence and provide us with correct and updated account
                    information, including but not limited to personal information, financial information related to you.
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    (c). You agree that the information supplied in your registration and KYC<Text style={{ fontSize: 9 }}>[Know Your Customer]</Text> verification process is in
                    all respects complete, accurate and truthful.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    (d). You agree to immediately notify VetroPay of any change/loss of mobile phone number or email address, and failing such notification, any notice or
                    transactional advice to you is effectively sent to last known address.
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    2. Holding a VetroPay Balance
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    (a). Any VetroPay balance you hold represents an unsecured claim against VetroPay (Ancla Technologies LTD). VetroPay combines your balance with the balances of
                    other users and invests those funds in liquid investments.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    (b). VetroPay will neither use these funds for its operating expenses or any other corporate purposes nor will it voluntarily make these funds available to its
                    creditors in the event of bankruptcy.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    (c). You will not receive interest or other earnings on the amounts in your balance. You agree VetroPay shall own the interest or other earnings on these
                    investments. You agree to assign any rights to any interest derived from your funds to VetroPay.
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    3. Adding funds to your balance
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    (a). You can add funds to your VetroPay account by making a National bank transfer to the VetrPay Bank account details made available on the Platform's ("Add
                    fund option") with the appropriate reference details.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>(b). A Vetropay Smart Transfer from another registered User</AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    The amount transferred will be held as a balance in your VetroPay account. Debit and Credit cards cannot be used to add funds to your VetroPay balance.
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    4. Withdrawing funds from your balance
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    (a). If you have a VetroPay balance, log into your VetroPay account to request transfer to bank account linked to your VetroPay account.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    (b). Depending on the country or region in a particular country which your account is registered, you may be able to withdraw your funds through a third party
                    service provider.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    (c). We may set limits on your withdrawals, and you can view any withdrawal limit by logging into your VetroPay account. Completing the following steps can help
                    us verify your VetroPay account, which may allow us to remove any withdrawal cap:
                  </AppText>
                  <AppText styles={{ paddingHorizontal: 20 }}>(i). Updating up your national bank account information.</AppText>
                  <AppText styles={{ paddingHorizontal: 20 }}>(ii). Completing your KYC verification process.</AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    5. Local Transfer
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    Fund transfer within two registered VetroPay user is termed a "Smart Transfer". All local (Intra - National) funds transfer on VetroPay essentially remains
                    free. i.e at Zero (0.00) transaction charge. A typical Smart Transfer takes only just about half of a second.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    The VetroPay payment network also allows for electronic fund transfer to non-registered individuals. This local (intra-National) transfer method attracts a
                    transaction fee (a derivative of the standard national bank transfer charges) payable by the receiver upon claiming any funds sent.
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    6. International Transfer (How we convert currency)
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    If your Smart Transfer invloves currency conversion, it will be completed at a set transaction fee comprising of the exchange rate we set for the relevant
                    currency exchange. (The transaction exchange rate is adjusted regularly), this transaction fee will also includes a{" "}
                    <Text style={{ fontWeight: "700" }}>currency conversion fee</Text> applied and retained by us on a base exchange rate to form the rate applicable to your
                    conversion. The base exchange rate is based on rates within the wholesale currency markets on the conversion day or the prior Business Day; or, if required by
                    law or regulation, set at the relevant government reference rate(s).
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    7. VetroPay MarketPlace
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    VetoPay market place is a bill payment center for Airtime, Utility bills etc. serving as a generic payment portal for all our partnered merchants, businesses
                    and Institutions.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>MarketPlace facilitates payments between you and your favourite brands & service providers.</AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    8. Vetro Credit
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    (a) Vetro Credit relies on an independent (yet collaborative) credit scoring algorithm derived from your profile, transaction activity within our network and
                    your existing national credit history.
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>(b). Vetro Credit option is made available to users on a month-to-month performance assesment:</AppText>
                  <AppText styles={{ paddingHorizontal: 20 }}>(i). User has been registered for at least 90 days;</AppText>
                  <AppText styles={{ paddingHorizontal: 20 }}>(ii). User has a positive credit record with the National Credit Bureau;</AppText>
                  <AppText styles={{ paddingHorizontal: 20 }}>(iii). User has no outstanding debt with VetroPay;</AppText>
                  <AppText styles={{ paddingHorizontal: 20 }}>
                    (iv). User has performed a minimum of NGN 10,000 or KES 3,000 worth of transaction value in the preceeding month
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    (c). Vetro Credit upon disbursement can only be used for purchase of services or products on VertoPay MarketPlace or on our Partnered Merchants digital
                    platforms offering Vetropay as a payment option.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    (d). All Credit disbursed is expected to be paid back within 30 days from disbursement date. Delayed repayment can essentially lead to{" "}
                    <Text style={{ fontWeight: "700" }}>Penal Charges,</Text> discontinuance of service which may involve filling an offical report to the appropriate national
                    credit authorities.
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>(e). Vetro Credit is non transferable.</AppText>
                  <AppText styles={{ marginTop: 5 }}>
                    (f). Interest rate on Credits provided may vary from country to country. Interest rates are specified at the point of request and reiterated before completing
                    request.
                  </AppText>

                  <AppText bold="true" styles={{ marginTop: 5, color: "red" }}>
                    (g). Penal Charges on delayed repayment:
                  </AppText>
                  <AppText styles={{ paddingHorizontal: 20 }}>(i). 10 days past Due Date attracts a Default Penalty of 1% on compounded Total Amount Payable.</AppText>
                  <AppText styles={{ paddingHorizontal: 20 }}>(ii). 30 days past Due Date attracts a Default Penalty of 1% on compounded Total Amount Payable.</AppText>
                  <AppText styles={{ paddingHorizontal: 20 }}>
                    (iii). 60 days past Due Date attracts a Default Penalty of 1.5% on compounded Total Amount Payable (and every 30 days thereafter).
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    9. Account Statements
                  </AppText>

                  <AppText styles={{ marginTop: 5 }}>
                    You have the right to receive an account statement showing your VetroPay account activity. You may view your VetroPay account statement by logging into your
                    VetroPay account.
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, marginTop: 20 }}>
                    10. Acceptance of "Terms of Service"
                  </AppText>

                  <AppText styles={{ marginTop: 10 }}>
                    By accessing our Products and Services, you agree to be bound by these Terms and by our Privacy Policy. If you have any questions, please email us at
                    support@vetropay.com or write to us at:
                  </AppText>
                  <AppText styles={{ marginTop: 5 }}>VetroPay, Ancla Technologies LTD</AppText>
                  <AppText>Attention: VetroPay Mobile Term of Service</AppText>
                  <AppText>3 Alara Street, Sabo-Yaba</AppText>
                  <AppText>Lagos Mainland, Lagos, Nigeria.</AppText>
                  <View style={{ marginTop: 70 }}></View>
                </ScrollView>
              </View>
            </View>
          )}
        </View>
      </Modal>
      {/** End T&C Modal */}

      {/** Credit Information Modal */}
      <Modal transparent visible={creditModalOpen} animationType="slide">
        <KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={10} enableOnAndroid={true} extraHeight={Platform.select({ android: 70 })} style={{ flexGrow: 1 }}>
          <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
            {creditModalStage == 1 ? (
              <View style={{ ...styles.creditModalContent, borderColor: "#266ddc", borderWidth: 2, position: "relative" }}>
                {/** Modal Header */}
                <View style={{ marginTop: 16, flexDirection: "row", justifyContent: "space-between" }}>
                  <AppText bold="true" styles={{ fontSize: 18 }}>
                    Credit Request Information
                  </AppText>
                  <MaterialIcons
                    color="grey"
                    name="close"
                    size={24}
                    onPress={() => {
                      setCreditModalOpen(false);
                      setDisplayRequestError(false);
                    }}
                    style={{ paddingRight: 10 }}
                  />
                </View>
                {/** End Modal Header */}

                <View style={{ marginTop: 24, paddingRight: 20 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <AppText styles={{ fontSize: 15 }}>
                      <Text style={{ fontWeight: "700" }}>Credit Amount: </Text>
                    </AppText>
                    <AppText bold="true" styles={{ fontSize: 15, color: "green" }}>
                      {`${userAuthentication.country == "NIGERIA" ? "NGN" : "KES"} ${numberWithCommas(creditObject[selectedValue].amount)}`}
                    </AppText>
                  </View>
                </View>

                <View style={{ marginTop: 12, paddingRight: 20 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <AppText styles={{ fontSize: 15 }}>
                      <Text style={{ fontWeight: "700" }}>Interest Rate: </Text>
                    </AppText>
                    <AppText bold="true" styles={{ fontSize: 15 }}>
                      2.0%
                    </AppText>
                  </View>
                </View>

                <View style={{ marginTop: 12, paddingRight: 20 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <AppText styles={{ fontSize: 15 }}>
                      <Text style={{ fontWeight: "700" }}>Tenure: </Text>
                    </AppText>
                    <AppText bold="true" styles={{ fontSize: 15 }}>
                      30 days
                    </AppText>
                  </View>
                </View>

                <View style={{ marginTop: 12, paddingRight: 20 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <AppText styles={{ fontSize: 15 }}>
                      <Text style={{ fontWeight: "700" }}>Request Date: </Text>
                    </AppText>
                    <AppText bold="true" styles={{ fontSize: 15 }}>
                      {new Date().toDateString()}
                    </AppText>
                  </View>
                </View>

                <View style={{ marginTop: 12, paddingRight: 20 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <AppText styles={{ fontSize: 15 }}>
                      <Text style={{ fontWeight: "700" }}>Due Date: </Text>
                    </AppText>
                    <AppText bold="true" styles={{ fontSize: 15 }}>
                      {new Date(new Date().setDate(new Date().getDate() + 30)).toDateString()}
                    </AppText>
                  </View>
                </View>

                <View style={{ marginTop: 12, paddingRight: 20 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <AppText styles={{ fontSize: 15 }}>
                      <Text style={{ fontWeight: "700" }}>Total Amount Payable : </Text>
                    </AppText>
                    <AppText bold="true" styles={{ fontSize: 15, color: "red" }}>
                      {`${userAuthentication.country == "NIGERIA" ? "NGN" : "KES"} ${numberWithCommas(creditObject[selectedValue].TAP)}`}
                    </AppText>
                  </View>
                </View>

                <View style={{ marginTop: 12, paddingRight: 20 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <AppText styles={{ fontSize: 15 }}>
                      <Text style={{ fontWeight: "700" }}>Expected payment date : </Text>
                    </AppText>
                    <AppText bold="true" styles={{ fontSize: 15 }}>
                      {new Date(new Date().setDate(new Date().getDate() + 30)).toDateString()}
                    </AppText>
                  </View>
                </View>

                <AppText bold="true" styles={{ marginTop: 5, color: "red", textAlign: "center", display: `${displayRequestError ? "flex" : "none"}` }}>
                  User does not meet credit requirement
                </AppText>
                <View style={{ marginTop: 50, alignItems: "center", paddingBottom: 100, display: `${!displaySpinner ? "flex" : "none"}` }}>
                  <PrimaryButton onPress={() => requestCreditFunc(creditObject[selectedValue].amount)}>
                    <AppText bold="true" styles={{ color: "#fff", fontSize: 16 }}>
                      Request
                    </AppText>
                  </PrimaryButton>
                </View>

                <View style={{ marginTop: 50, justifyContent: "center", paddingBottom: 100, display: `${displaySpinner ? "flex" : "none"}` }}>
                  <Spinner color="blue" />
                </View>
              </View>
            ) : (
              <View style={{ ...styles.creditModalContent, borderColor: "#266ddc", borderWidth: 2, position: "relative" }}>
                {/** Modal Header */}
                <View style={{ marginTop: 16, flexDirection: "row", justifyContent: "flex-end" }}>
                  <MaterialIcons
                    color="grey"
                    name="close"
                    size={24}
                    onPress={() => {
                      setCreditModalOpen(false);
                      setCreditModalStage(1);
                    }}
                    style={{ paddingRight: 10 }}
                  />
                </View>
                {/** End Modal Header */}

                <View style={{ marginTop: 50, justifyContent: "center", alignItems: "center" }}>
                  <SuccessfulSvgComponent />
                </View>

                <AppText bold="true" styles={{ fontSize: 18, marginTop: 16, textAlign: "center" }}>
                  Credit request Successful
                </AppText>
                <AppText styles={{ fontSize: 15, marginTop: 16, textAlign: "center" }}>
                  Your Credit application has been succesfully submitted. Once approved your credit balance will be automatically funded.
                </AppText>

                <View style={{ marginTop: 24, alignItems: "center", paddingBottom: 100 }}>
                  <PrimaryButton
                    onPress={() => {
                      navigation.navigate("Credit");
                      setCreditModalOpen(false);
                      setCreditModalStage(1);
                    }}
                  >
                    <AppText bold="true" styles={{ color: "#fff", fontSize: 16 }}>
                      Close
                    </AppText>
                  </PrimaryButton>
                </View>
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>
      </Modal>

      {/** End Credit Information Modal */}

      <View style={styles.upperBackGround}></View>
      <View style={styles.balanceUpBackGround}>
        <AppText bold="true" styles={{ fontSize: 18, textTransform: "uppercase", color: "#FFFFFF" }}>
          Select amount
        </AppText>
        <View style={styles.requestContainer}>
          <TouchableWithoutFeedback onPress={() => selectValue("NGN1")}>
            <View style={selectedValue != "NGN1" ? styles.creditCircle : styles.creditCircleActive}>
              <AppText bold="true" styles={selectedValue != "NGN1" ? styles.creditMainValue : styles.creditMainValueActive}>
                ₦5,000
              </AppText>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => selectValue("NGN2")}>
            <View style={selectedValue != "NGN2" ? styles.creditCircle : styles.creditCircleActive}>
              <AppText bold="true" styles={selectedValue != "NGN2" ? styles.creditMainValue : styles.creditMainValueActive}>
                ₦10,000
              </AppText>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => selectValue("NGN3")}>
            <View style={selectedValue != "NGN3" ? styles.creditCircle : styles.creditCircleActive}>
              <AppText bold="true" styles={selectedValue != "NGN3" ? styles.creditMainValue : styles.creditMainValueActive}>
                ₦25,000
              </AppText>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => selectValue("NGN4")}>
            <View style={selectedValue != "NGN4" ? styles.creditCircle : styles.creditCircleActive}>
              <AppText bold="true" styles={selectedValue != "NGN4" ? styles.creditMainValue : styles.creditMainValueActive}>
                ₦50,000
              </AppText>
            </View>
          </TouchableWithoutFeedback>

          {/** T &C */}
          <View style={styles.checkboxContainer}>
            <CheckBox tintColors={{ true: "#266ddc" }} value={optionsSelected.agreedTerms} onValueChange={() => checkCheck("agreedTerms")} style={styles.checkbox} />
            <AppText styles={{ alignSelf: "center" }}>
              I agree to these{" "}
              <Text style={{ fontWeight: "bold", color: "#266ddc" }} onPress={() => setModalOpen(true)}>
                Terms and Conditions
              </Text>
            </AppText>
          </View>

          {/**End Request Button */}
          <View style={{ marginTop: 10, justifyContent: "center", alignItems: "center" }}>
            <AppButton
              disabled={!proceedBoolean}
              styles={{ width: 300, backgroundColor: "#266ddc", height: 40, borderRadius: 4, justifyContent: "center", alignItems: "center", elevation: 7 }}
              onPress={() => setCreditModalOpen(true)}
            >
              <AppText bold="true" styles={{ color: "#ffffff", textTransform: "uppercase" }}>
                Continue >>
              </AppText>
            </AppButton>
          </View>
          {/** End Request Button */}
        </View>
      </View>
    </View>
  );
}

RequestCredit.propType = {
  requestCredit: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
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
  upperBackGround: {
    width: Dimensions.get("window").width,
    height: 131,
    backgroundColor: "rgba(38, 109, 220, 0.6)",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  balanceUpBackGround: {
    position: "absolute",
    width: "100%",
    paddingHorizontal: 10,
  },
  requestContainer: {
    marginTop: 16,
    height: Dimensions.get("window").height - 110,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingTop: 10,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderTopRightRadius: 4,

    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  creditMainValue: {
    fontSize: 20,
    color: "#266ddc",
  },
  creditMainValueActive: {
    fontSize: 20,
    color: "#ffffff",
  },
  creditCircle: {
    height: 120,
    width: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#266ddc",
    borderWidth: 1,
    marginBottom: 20,
    elevation: 7,
  },
  creditCircleActive: {
    height: 120,
    width: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#266ddc",
    borderColor: "#266ddc",
    borderWidth: 1,
    marginBottom: 20,
    elevation: 7,
  },
  checkboxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
  },

  creditModalContent: {
    flex: 1,
    marginTop: 80,
    borderRadius: 5,
    marginBottom: 1000,
    marginLeft: 20,
    marginRight: 20,
    paddingHorizontal: 10,
    backgroundColor: "#F0F0F8",
  },
  textInput: {
    height: 40,
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
});
