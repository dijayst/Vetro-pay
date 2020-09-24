import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../routes/home";
import { AntDesign } from "@expo/vector-icons";
import Notifications from "../routes/notification";
import Settings from "../routes/settings";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: "#266ddc",
          inactiveTintColor: "gray",
        }}
      >
        <Tab.Screen
          name="Home"
          options={{
            tabBarIcon: ({ focused }) => {
              if (focused) {
                return <AntDesign name="home" size={24} color="#266ddc" />;
              } else {
                return <AntDesign name="home" size={24} color="gray" />;
              }
            },
          }}
          component={Home}
        />
        <Tab.Screen
          name="Notifications"
          options={{
            tabBarIcon: ({ focused }) => {
              if (focused) {
                return <AntDesign name="mail" size={24} color="#266ddc" />;
              } else {
                return <AntDesign name="mail" size={24} color="gray" />;
              }
            },
            tabBarBadge: "",
          }}
          component={Notifications}
        />
        <Tab.Screen
          name="Settings"
          options={{
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
