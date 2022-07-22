import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, FlatList, Image, Modal, Pressable } from "react-native";
import AppText from "../../resources/AppText";
import moment from "moment";
import { getBusinessNotifications, setRecentNotificationsAsRead } from "../../containers/busnotifications/actions";
import { MaterialIcons, AntDesign, FontAwesome } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

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
  const isFocused = useIsFocused();
  const [businessNotifications, SetBusinessNotifications] = useState([]);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [businessModalContent, setBusinessModalContent] = useState({});

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
    if (isFocused) {
      dispatch(getBusinessNotifications());
      setTimeout(() => {
        dispatch(setRecentNotificationsAsRead());
      }, 2000);
    }
  }, [isFocused]);

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
        <Modal animationType="slide" transparent={true} visible={showBusinessModal}>
          <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
            <View
              style={{
                width: "80%",
                marginTop: "50%",
                alignSelf: "center",
                height: 300,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
                backgroundColor: "#FFFFFF",
              }}
            >
              <View style={style.messageAvatar}>
                <Image source={{ uri: businessModalContent.sender_logomark }} style={{ height: 40, width: 40, borderRadius: 20 }} />
              </View>

              <View style={style.senderTitle}>
                <AppText bold styles={{ fontSize: 16, marginRight: 5 }}>
                  {truncateString(businessModalContent?.sender_name || "Unknown", 25)}
                </AppText>
                {businessModalContent.sender_verified && <MaterialIcons name="check-circle" size={16} color="green" />}
              </View>
              {/**Business Category */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons name="business-center" size={20} color="grey" />
                <AppText styles={{ marginLeft: 5 }}>{businessModalContent.sender_category}</AppText>
              </View>

              {/** About */}
              {/* <View style={{ flexDirection: "row", marginTop: 7, alignItems: "center" }}>
                <AntDesign name="infocirlce" size={18} color="grey" />
                <AppText styles={{ marginLeft: 5 }}>{businessModalContent.about}</AppText>
              </View> */}

              {/** Location */}
              <View style={{ flexDirection: "row", marginTop: 7, alignItems: "center" }}>
                <FontAwesome name="map-pin" size={20} color="grey" />
                <AppText styles={{ marginLeft: 5 }}>{businessModalContent.sender_location}</AppText>
              </View>

              <Pressable
                onPress={() => setShowBusinessModal(false)}
                style={{ backgroundColor: "#266ddc", padding: 10, width: 150, alignSelf: "center", marginTop: 10, borderRadius: 5, justifyContent: "center", alignItems: "center" }}
              >
                <AppText styles={{ color: "#FFFFFF" }} bold>
                  Close
                </AppText>
              </Pressable>
            </View>
          </View>
        </Modal>
        <FlatList
          data={businessNotifications}
          keyExtractor={(item, index) => String(index)}
          renderItem={({ item, index }) => (
            <View style={style.container}>
              <TouchableOpacity
                onPress={() => {
                  setBusinessModalContent(item);
                  setShowBusinessModal(true);
                }}
                style={style.messageAvatar}
              >
                {item.sender_logomark ? (
                  <Image source={{ uri: item.sender_logomark }} style={{ height: 40, width: 40, borderRadius: 20 }} />
                ) : (
                  <MaterialIcons name="business-center" size={24} color="black" />
                )}
              </TouchableOpacity>
              <View style={style.contentContainer}>
                <View style={style.topContentContainer}>
                  <View style={style.senderTitle}>
                    <Text style={{ fontWeight: "700", fontSize: 16, marginRight: 5, color: item.read ? "#5a5a5a" : "#000000" }}>{truncateString(item.sender_name, 25)}</Text>
                    {item.sender_verified && <MaterialIcons name="check-circle" size={16} color="green" />}
                  </View>

                  <Text style={{ fontSize: 12, color: "gray" }}>{moment(item.created).fromNow()}</Text>
                </View>
                <View style={[style.topContentContainer, { alignItems: "flex-end" }]}>
                  <View style={style.lastMessageContainer}>
                    <AppText styles={{ color: item.read ? "#5a5a5a" : "#000000", lineHeight: 18 }}>{item.message}</AppText>
                  </View>
                  {item.sender_verified && !item.read && (
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
                          1
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
                {index + 1 < businessNotifications.length && <Separator />}
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
  senderTitle: {
    flexDirection: "row",
    alignItems: "center",
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
