import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDataBundleSubscription } from "../../containers/utility/action";
import { usePrevious, numberWithCommas } from "../../resources/utils";
import AppText from "../../resources/AppText";
import { Spinner } from "native-base";
import { Fragment } from "react";
const { height } = Dimensions.get("window");

const NETWORK_CATCH_PHRASE = {
  MTN: "Y'ello Super Plans",
  GLO: "Grandmaster of Data",
  AIRTEL: "The Smart Phone Network",
  "9MOBILE": "Here for you, Here for Naija",
  SPECTRANET: "Data Plans",
};

export default function DataPlans({
  serviceProvider,
  serviceProviderLogo,
  internetProviderDataPlans,
  setInternetProviderDataPlans,
  handleSheetCloseRequest,
  setSelectedDataBundle,
  setAmount,
}) {
  const dispatch = useDispatch();
  const [subscriptionList, setSubscriptionList] = useState([]);

  const getDataPlansResponse = useSelector((state) => state.utility.databundles);
  const preveGetDataPlansResponse = usePrevious(getDataPlansResponse);

  useEffect(() => {
    setAmount("");
    setSelectedDataBundle(null);
    setSubscriptionList([]);
    if (internetProviderDataPlans[serviceProvider]) {
      setSubscriptionList(internetProviderDataPlans[serviceProvider]);
    } else {
      dispatch(getDataBundleSubscription(serviceProvider.toLowerCase()));
    }
  }, [serviceProvider]);

  useEffect(() => {
    if (preveGetDataPlansResponse && getDataPlansResponse.length !== preveGetDataPlansResponse?.length) {
      setSubscriptionList(getDataPlansResponse[getDataPlansResponse.length - 1]["data"]);
      setInternetProviderDataPlans((prevState) => ({
        ...prevState,
        [serviceProvider]: getDataPlansResponse[getDataPlansResponse.length - 1]["data"],
      }));
    }
  }, [getDataPlansResponse]);

  const renderPromoOffer = () => {
    switch (serviceProvider) {
      case "AIRTEL":
        return (
          <TouchableOpacity style={styles.dataPlansListItems}>
            <View>
              <AppText bold>30GB for 30days</AppText>
              <AppText bold styles={{ color: "red", fontSize: 12 }}>
                Special Offer 🎁
              </AppText>
            </View>
            <AppText bold styles={{ fontSize: 18 }}>
              ₦7,999
            </AppText>
          </TouchableOpacity>
        );
      case "GLO":
        return (
          <TouchableOpacity style={styles.dataPlansListItems}>
            <View>
              <AppText bold>30GB for 30days</AppText>
              <AppText bold styles={{ color: "red", fontSize: 12 }}>
                Special Offer 🎁
              </AppText>
            </View>
            <AppText bold styles={{ fontSize: 18 }}>
              ₦7,999
            </AppText>
          </TouchableOpacity>
        );
      default:
        return <Fragment></Fragment>;
    }
  };
  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 10, marginBottom: 20 }}>
        <Image source={serviceProviderLogo} style={styles.sericeProviderLogoStyle} />
        <AppText styles={{ marginLeft: 10 }}>{NETWORK_CATCH_PHRASE[serviceProvider]}</AppText>
      </View>

      {subscriptionList.length < 1 && (
        <View style={{ height: 250, alignItems: "center", justifyContent: "center" }}>
          <AppText bold>Searching Best deals for you...</AppText>
          <Spinner size="large" color="#266ddc" />
        </View>
      )}

      {subscriptionList.length > 0 && (
        <ScrollView style={{ marginBottom: height * 0.1 + 130 }}>
          {/* {renderPromoOffer()} */}
          {subscriptionList.map((bundle, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.dataPlansListItems}
                onPress={() => {
                  setSelectedDataBundle(bundle);
                  setAmount(`${bundle.price}`);
                  handleSheetCloseRequest();
                }}
              >
                <AppText>{bundle.name}</AppText>
                <AppText>₦{numberWithCommas(bundle.price)}</AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sericeProviderLogoStyle: {
    width: 70,
    height: 70,
    borderRadius: 15,
  },
  dataPlansListItems: {
    height: 55,
    borderWidth: 1,
    borderColor: "rgba(128,128,128,0.3)",
    borderRadius: 5,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
});
