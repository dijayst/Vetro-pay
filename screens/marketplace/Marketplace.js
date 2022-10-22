import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { View, TextInput, StyleSheet, Text, ScrollView, Image, TouchableNativeFeedback } from "react-native";
import AppText from "../../resources/AppText";
import { Placeholder, PlaceholderMedia, PlaceholderLine, Fade } from "rn-placeholder";
import { getMarketplaceBusiness } from "../../containers/business/action";

export default function Marketplace({ navigation }) {
  const [skeletonVisible, setSkeletonVisible] = useState(true);
  const [registeredBusinesses, setRegisteredBusinesses] = useState([]);
  const [businessNumbers, setBusinessNumbers] = useState("Loading...");

  const dispatch = useDispatch();
  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const marketplaceData = useSelector((state) => state.business.marketbus);
  const prevMarketplaceData = usePrevious(marketplaceData);

  useEffect(() => {
    if (prevMarketplaceData) {
      if (marketplaceData["status"] == "success") {
        setBusinessNumbers(marketplaceData["total"]);
        setRegisteredBusinesses(marketplaceData["data"]);
        setSkeletonVisible(false);
      }
    } else {
      dispatch(getMarketplaceBusiness());
    }
  });

  return (
    <View style={{ paddingHorizontal: 10 }}>
      <View style={styles.formGroup}>
        <TextInput style={{ ...styles.textInput }} placeholder="Search Business" />
      </View>

      <AppText bold="true" styles={{ fontSize: 16 }}>
        Result <AppText styles={{ fontSize: 12, color: `${businessNumbers == "Loading..." ? "gray" : "black"}` }}>({businessNumbers} Businesses)</AppText>
      </AppText>

      {!skeletonVisible && (
        <ScrollView>
          <View style={{ marginTop: 30, marginHorizontal: 5 }}>
            {registeredBusinesses.map((bus, index) => {
              return (
                <TouchableNativeFeedback
                  key={index}
                  onPress={() =>
                    navigation.navigate("PayBusiness", {
                      busId: bus.id,
                      busBillers: bus.billers,
                      busBillersBoolean: bus.billers_boolean,
                      busLogo: bus.logo,
                      busName: bus.name,
                      busSignature: bus.signature,
                      busVerified: bus.verified,
                    })
                  }
                >
                  <View style={styles.businessList}>
                    <Image source={{ uri: bus.logo }} style={{ width: 40, resizeMode: "contain" }} />
                    <AppText styles={{ fontSize: 16, marginLeft: 10 }}>{bus.name}</AppText>
                  </View>
                </TouchableNativeFeedback>
              );
            })}
          </View>
        </ScrollView>
      )}

      {skeletonVisible && (
        <ScrollView>
          <View style={{ marginTop: 30, marginHorizontal: 20 }}>
            <Placeholder Animation={Fade}>
              <PlaceholderLine height={50} />
              <PlaceholderLine />
            </Placeholder>
            <Placeholder Animation={Fade} Left={PlaceholderMedia} Right={PlaceholderMedia}>
              <PlaceholderLine />
              <PlaceholderLine />
            </Placeholder>

            <Placeholder Animation={Fade} style={{ marginTop: 16 }} Left={PlaceholderMedia} Right={PlaceholderMedia}>
              <PlaceholderLine />
              <PlaceholderLine />
            </Placeholder>

            <Placeholder Animation={Fade} style={{ marginTop: 16 }} Left={PlaceholderMedia} Right={PlaceholderMedia}>
              <PlaceholderLine />
              <PlaceholderLine />
            </Placeholder>

            <Placeholder Animation={Fade} style={{ marginTop: 16 }} Left={PlaceholderMedia} Right={PlaceholderMedia}>
              <PlaceholderLine />
              <PlaceholderLine />
            </Placeholder>

            <Placeholder Animation={Fade} style={{ marginTop: 16 }} Left={PlaceholderMedia} Right={PlaceholderMedia}>
              <PlaceholderLine />
              <PlaceholderLine />
            </Placeholder>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

Marketplace.propTypes = {
  getMarketplaceBusiness: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
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
  businessList: {
    elevation: 3,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    flexDirection: "row",
    marginBottom: 5,
  },
});
