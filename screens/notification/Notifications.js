import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, FlatList } from "react-native";
import AppText from "../../resources/AppText";
import moment from "moment";
import { getBusinessNotifications } from "../../containers/busnotifications/actions";
import { MaterialIcons } from "@expo/vector-icons";

function Separator() {
  return <View style={style.separator} />;
}

function truncateString(str, num) {
  if (str.length > num) {
    return str.substring(0, num) + "...";
  } else {
    return str;
  }
}

export default function Notification({ navigation }) {
  const [businessNotifications, SetBusinessNotifications] = useState([]);

  const dispatch = useDispatch();
  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const getBusinessNotificationsData = useSelector((state) => state.busnotifications.notifications);
  const prevGetBusinessNotificationsData = usePrevious(getBusinessNotificationsData);

  useEffect(() => {
    if (!prevGetBusinessNotificationsData) {
      dispatch(getBusinessNotifications());
    }
  });

  useEffect(() => {
    if (prevGetBusinessNotificationsData) {
      if (prevGetBusinessNotificationsData.length !== getBusinessNotificationsData.length) {
        if (getBusinessNotificationsData[getBusinessNotificationsData.length - 1]["status"] == "success") {
          SetBusinessNotifications(getBusinessNotificationsData[getBusinessNotificationsData.length - 1]["data"]);
        }
      }
    }
  });
  if (businessNotifications.length < 1) {
    return (
      <View style={{ ...style.overallContainer, justifyContent: "center", alignItems: "center" }}>
        <AppText styles={{ fontSize: 16, textAlign: "center" }}>
          <Text style={{ fontWeight: "700" }}>You do not have any new Notification for now.</Text>
        </AppText>
        <AppText styles={{ textAlign: "center", marginTop: 10 }}>Notifications and Messages from Merchants you frequently pay will appear here.</AppText>
      </View>
    );
  } else {
    return (
      <View style={style.overallContainer}>
        <FlatList
          data={businessNotifications}
          keyExtractor={(item, index) => String(index)}
          renderItem={({ item }) => (
            <View style={style.container}>
              <View style={style.messageAvatar}>
                <MaterialIcons name="business-center" size={24} color="black" />
              </View>
              <View style={style.contentContainer}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("NotificationMessage", {
                      busName: item.business_name,
                      conversation: item.conversation,
                    })
                  }
                >
                  <View style={style.topContentContainer}>
                    <Text style={{ fontWeight: "700", fontSize: 16 }}>{truncateString(item.business_name, 25)}</Text>
                    <Text style={{ fontSize: 12, color: "gray" }}>{moment(item.last_message_time).fromNow()}</Text>
                  </View>
                  <View style={[style.topContentContainer, { alignItems: "flex-end" }]}>
                    <View style={style.lastMessageContainer}>
                      <Text style={{ color: "gray" }}>{truncateString(item.conversation.reverse()[0]["message"], 30)}</Text>
                    </View>
                    {1 && (
                      <View style={style.notificationDotContainer}>
                        <View
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 9,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#266ddc",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 10,
                              color: "#ffffff",
                            }}
                          >
                            {item.unread.length}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                  <Separator />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <StatusBar style="light" translucent={true} backgroundColor="#00000066" />
      </View>
    );
  }
}

const style = StyleSheet.create({
  overallContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  container: {
    flexDirection: "row",
    padding: 10,
  },
  contentContainer: {
    flex: 17,
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  lastMessageContainer: {
    flex: 9,
    paddingTop: 5,
  },
  notificationDotContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  topContentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userImageContainer: {
    flex: 3,
  },
  userNameStyle: {
    fontWeight: "bold",
    width: 100,
  },
  messageAvatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "rgba(38, 109, 220, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    marginTop: 10,
    marginVertical: 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
