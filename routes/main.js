import * as React from "react";
import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../routes/home";
import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import Notifications from "../routes/notification";
import Settings from "../routes/settings";

const Tab = createBottomTabNavigator();

export default function App() {
  const businessNotificationsData = useSelector((state) => state.busnotifications.notifications);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            paddingVertical: 5,
          },
          tabBarLabelStyle: {
            marginBottom: 5,
            fontFamily: "Quicksand",
          },
        }}
      >
        <Tab.Screen
          name="Home"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => {
              return <Feather name="home" size={24} color={focused ? "#266ddc" : "gray"} />;
            },
          }}
          component={Home}
        />
        <Tab.Screen
          name="Notifications"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => {
              return <Entypo name="megaphone" size={24} color={focused ? "#266ddc" : "gray"} />;
            },
            tabBarBadgeStyle: {
              maxWidth: 7,
              height: 7,
              borderRadius: 5,
            },
            tabBarBadge: businessNotificationsData?.[businessNotificationsData.length - 1]?.data?.[0]?.read == false ? "" : null,
          }}
          component={Notifications}
        />
        <Tab.Screen
          name="Settings"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => {
              if (focused) {
                return <AntDesign name="setting" size={24} color="#266ddc" />;
              } else {
                return <AntDesign name="setting" size={24} color="gray" />;
              }
            },
          }}
          component={Settings}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
