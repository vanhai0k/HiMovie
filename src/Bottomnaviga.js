import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import Home from "../src/Home";
import Storage from "../src/Storage";
import InfoMe from "../src/InfoMe";
import TymMovie from "../src/TymMovie";

const Tab = createBottomTabNavigator();

const Bottomnaviga = () => {

  return (
    <Tab.Navigator
    initialRouteName="Home"
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        let rn = route.name;
  
        if (rn === "Home") {
          iconName = focused ? "home" : "home-outline";
        } else if (rn === "Storage") {
          iconName = focused ? "cloud" : "cloud-outline";
        } else if (rn === "TymMovie") {
          iconName = focused ? "heart" : "heart-outline";
        } else if (rn === "Me") {
          iconName = focused ? "settings" : "settings-outline";
        }
  
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "tomato",
      tabBarInactiveTintColor: "grey",
      tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
      tabBarStyle: { padding: 10, height: 70 },
    })}
  >
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name="Storage" component={Storage} />
    <Tab.Screen name="TymMovie" component={TymMovie} />
    <Tab.Screen name="Me" component={InfoMe} />
  </Tab.Navigator>
  
  )
}

export default Bottomnaviga