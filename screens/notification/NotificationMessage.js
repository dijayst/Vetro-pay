import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import moment from "moment";

export default function NotificationMessage({ route }) {
  const { busName, conversation } = route.params;

  return (
    <View style={style.container}>
      <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "700" }}>{busName}</Text>
      <ScrollView
        ref={(ref) => (this.scrollView = ref)}
        onContentSizeChange={(contentWidth, contentHeight) => {
          this.scrollView.scrollResponderScrollToEnd({ animated: true });
        }}
      >
        {conversation.reverse().map((item, index) => {
          return (
            <View key={index} style={style.topContentContainer}>
              <View style={style.timeContainer}>
                <Text>{moment(item.datetime).fromNow()}</Text>
              </View>
              <View style={{ ...style.contentData, backgroundColor: "#4682b4" }}>
                <View style={style.dataContainer}>
                  <Text>{item.message}</Text>
                  <Text style={{ fontSize: 10 }}>{item.datetime.split(" ")[1].split(".")[0]}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    paddingTop: 10,
    flex: 1,
  },
  topContentContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    marginTop: 10,
  },
  contentData: {
    flexDirection: "row-reverse",
    flex: 2,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },

  timeContainer: {
    flex: 1,
    alignItems: "center",
  },
  dataContainer: {
    flex: 2,
    padding: 20,
  },
  userNameStyle: {
    fontSize: 14,
  },
});
