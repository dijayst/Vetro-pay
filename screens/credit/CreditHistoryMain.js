import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Dimensions, View, Text, StyleSheet, ScrollView } from "react-native";
import AppText from "../../resource/AppText";

import { Spinner } from "native-base";
import CreditHistory from "../../resource/CreditHistory";
import { getCreditHistory } from "../../containers/credit/action";

export default function CreditHistoryMain() {
  const dispatch = useDispatch();
  const [creditHistoryLoaded, setCreditHistoryLoaded] = useState(false);

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const userCreditHistory = useSelector((state) => state.credit.history);
  const prevUserCreditHistory = usePrevious(userCreditHistory);
  useEffect(() => {
    if (prevUserCreditHistory) {
      if (userCreditHistory["status"] == "success") {
        setCreditHistoryLoaded(true);
      }
    } else {
      dispatch(getCreditHistory());
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.upperBackGround}></View>
      <View style={styles.balanceUpBackGround}>
        <AppText bold="true" styles={{ fontSize: 18, textTransform: "uppercase", color: "#FFFFFF" }}>
          All Credit History
        </AppText>
        {creditHistoryLoaded ? (
          <View style={styles.listContainer}>
            <ScrollView style={{ flexGrow: 1 }}>
              {userCreditHistory["creditHistory"].map((record, index) => {
                return (
                  <View key={index} style={{ flex: 1 }}>
                    <CreditHistory creditDetails={record} />
                  </View>
                );
              })}
              <AppText></AppText>
            </ScrollView>
          </View>
        ) : (
          <View style={{ ...styles.listContainer, flex: 1, justifyContent: "center" }}>
            <AppText styles={{ textAlign: "center" }}>Loading credit history...</AppText>
            <Spinner color="blue" />
          </View>
        )}
      </View>
    </View>
  );
}

CreditHistoryMain.propType = {
  getCreditHistory: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
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
  listContainer: {
    marginTop: 16,
    height: Dimensions.get("window").height - 110,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderTopRightRadius: 4,
  },
});
