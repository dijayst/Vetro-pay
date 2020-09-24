import React from "react";
import { View, StyleSheet, TouchableNativeFeedback, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AppText from "../../resources/AppText";
import { AccountProfileSvgComponent, BusinessSvgComponent } from "../../resources/Svg";

function Separator() {
  return <View style={styles.separator} />;
}

export default function TransferBusiness({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        {/** Send to Individuals */}
        <TouchableNativeFeedback
          onPress={() => {
            navigation.navigate("SendMoney");
          }}
        >
          <View style={styles.listItem}>
            <View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                  <AccountProfileSvgComponent />
                  <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                    Send to Individual
                  </AppText>
                </View>

                <View>
                  <AntDesign name="right" color="grey" size={20} />
                </View>
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
        {/** End Send to Individuals */}

        <Separator />

        {/** Fund Business */}
        <TouchableNativeFeedback onPress={() => navigation.navigate("SendMoneyBusiness")}>
          <View style={styles.listItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                <BusinessSvgComponent />
                <AppText bold="true" styles={{ paddingLeft: 10, fontSize: 15 }}>
                  Send to Business Account
                </AppText>
              </View>

              <View>
                <AntDesign name="right" color="grey" size={20} />
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
        {/** End Fund Business */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F8",
  },
  separator: {
    marginVertical: 2,
    marginLeft: "10%",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  listContainer: {
    backgroundColor: "#FFFFFF",
    marginTop: 30,
    elevation: 5,
  },

  listItem: {
    height: 50,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
});
