import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "./Home/HomePage.jsx";
import LoginPage from "./Login/LoginPage.jsx";
import MapMonitoringScreen from "./MapMonitoring/MapMonitoring.jsx"
import RegionScreen from "./SelectRegion/SelectRegion.jsx";
import CallHelpScreen from "./CallForExtraHelp/CallForExtraHelp.jsx";

const Stack = createNativeStackNavigator();

export default function StackScreen() {
    return (
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MapMonitoring" component={MapMonitoringScreen} />
        <Stack.Screen name="Region" component={RegionScreen} />
        <Stack.Screen name="CallHelp" component={CallHelpScreen} />
      </Stack.Navigator>
    );
  }