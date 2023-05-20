import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { View, TextInput, StyleSheet, Text, ScrollView, Image, TouchableNativeFeedback, Alert } from "react-native";
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
    <View style={{ paddingHorizontal: 10, flex: 1 }}>
      <View style={styles.formGroup}>
        <TextInput style={{ ...styles.textInput }} placeholder="Search Business" />
      </View>

      <AppText bold="true" styles={{ fontSize: 16 }}>
        <AppText styles={{ fontSize: 12, color: `${businessNumbers == "Loading..." ? "gray" : "black"}` }}>({"..." || businessNumbers} Businesses)</AppText>
      </AppText>

      {!skeletonVisible && (
        <TouchableNativeFeedback onPress={() => Alert.alert("Marketplace", "Marketplace currently unavailable")}>
          <ScrollView>
            {/* <View style={{ marginTop: 30, marginHorizontal: 5 }}>
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
          </View> */}
            <View style={{ paddingBottom: 40 }}>
              <View style={{ marginVertical: 10 }}>
                <AppText bold styles={{ color: "#266ddc", fontSize: 16 }}>
                  Restaurants
                </AppText>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ paddingHorizontal: 10 }}>
                    <Image
                      source={{ uri: "https://png.pngtree.com/png-vector/20220727/ourmid/pngtree-cooking-logo-png-image_6089722.png" }}
                      style={{ height: 100, width: 100, maxHeight: 100, resizeMode: "contain", marginBottom: 5 }}
                    />
                    <AppText styles={{ fontWeight: "bold", fontSize: 15, color: "#36454F" }}>Dally's Kitchen</AppText>
                  </View>

                  <View>
                    <Image
                      source={{ uri: "https://static.vecteezy.com/system/resources/thumbnails/004/999/867/small_2x/chef-hat-with-cross-spatula-and-mustache-free-vector.jpg" }}
                      style={{ height: 100, width: 100, maxHeight: 100, resizeMode: "contain", borderRadius: 10, marginBottom: 5 }}
                    />
                    <AppText styles={{ fontWeight: "bold", fontSize: 15, color: "#36454F" }}>Xquisite Ikeja</AppText>
                  </View>
                </View>
              </View>

              <AppText bold styles={{ marginVertical: 20, color: "#266ddc", fontSize: 16 }}>
                Transport
              </AppText>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ paddingHorizontal: 10 }}>
                  <View>
                    <Image
                      source={{ uri: "https://pngimg.com/uploads/uber/uber_PNG17.png" }}
                      style={{ height: 100, width: 100, maxHeight: 100, resizeMode: "contain", borderRadius: 10, marginBottom: 5 }}
                    />
                    <AppText styles={{ fontWeight: "bold", fontSize: 15, color: "#36454F" }}>Uber NG</AppText>
                  </View>
                </View>
              </View>
              <View>
                <AppText bold styles={{ marginTop: 10, color: "#266ddc", fontSize: 16 }}>
                  Groceries & Supermarkets
                </AppText>
                <AppText>No business available</AppText>
              </View>

              <View>
                <AppText bold styles={{ marginTop: 10, color: "#266ddc", fontSize: 16 }}>
                  Health & General Insurance
                </AppText>
                <AppText>No business available</AppText>
              </View>

              <View>
                <AppText bold styles={{ marginVertical: 20, color: "#266ddc", fontSize: 16 }}>
                  Cloud Technologies
                </AppText>
                <View>
                  <Image
                    source={{ uri: "https://media.trustradius.com/product-logos/Wa/72/N8G8EK7BWPXB.PNG" }}
                    style={{ height: 100, width: 100, maxHeight: 100, resizeMode: "contain", borderRadius: 10, marginBottom: 5 }}
                  />
                  <AppText styles={{ fontWeight: "bold", fontSize: 15, color: "#36454F" }}>Heroku</AppText>
                </View>
              </View>

              <View>
                <AppText bold styles={{ marginTop: 10, color: "#266ddc", fontSize: 16 }}>
                  Gaming
                </AppText>
                <AppText>No business available</AppText>
              </View>

              <View>
                <AppText bold styles={{ marginTop: 10, color: "#266ddc", fontSize: 16 }}>
                  Religious Institutions
                </AppText>
                <AppText>No business available</AppText>
              </View>
            </View>
          </ScrollView>
        </TouchableNativeFeedback>
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
