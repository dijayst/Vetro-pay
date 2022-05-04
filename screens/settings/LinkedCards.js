import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import AppText from "../../resources/AppText";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { getCards } from "../../containers/cards/action";

export default function Help() {
  const dispatch = useDispatch();
  const userCards = useSelector((state) => state.cards.cards);

  useEffect(() => {
    dispatch(getCards());
  }, []);

  return (
    <View style={styles.container}>
      {userCards.length > 0 ? (
        <View style={{ padding: 20 }}>
          {userCards.map((data, index) => {
            return (
              <TouchableOpacity key={index} style={styles.cardContainer}>
                <View>
                  <AppText bold styles={{ fontSize: 16 }}>
                    {data["details"]["type"]} - *** **** {data["details"]["last_4digits"]}
                  </AppText>
                  <AppText>
                    {data["details"]["issuer"]}/ {data["details"]["country"]}
                  </AppText>
                </View>
                <AntDesign name="checkcircle" size={24} color="#388641" />
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={{ padding: 20 }}>
          <View style={styles.cardContainer}>
            <View>
              <AppText bold styles={{ fontSize: 16 }}>
                NO CARD ADDED
              </AppText>
              <AppText>NIGEIRA NG</AppText>
            </View>
            <MaterialIcons name="cancel" size={24} color="#cf2e06" />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F8",
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    height: 80,
    borderRadius: 10,
    elevation: 4,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
});
