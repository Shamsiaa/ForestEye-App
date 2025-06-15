import React from "react";
import styles from "./HomeStyle";
import { useLayoutEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function HomeScreen({ navigation, route }) {
  // Get all params passed from login
  const { forestId, stationId, stationName } = route.params || {};

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: stationName ? `${stationName}` : "Home",
    });
  }, [navigation, stationName]);

  return (
    <View style={styles.container}>
      <Text style={styles.menu}>Menu</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("MapMonitoring", route.params)}
      >
        <Text style={styles.buttonText}>Map Monitoring System</Text>
      </TouchableOpacity>

     

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Region", route.params)}
      >
        <Text style={styles.buttonText}>Select Region</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("CallHelp", route.params)}
      >
        <Text style={styles.buttonText}>Call for Extra Help</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace("Login")}
      >
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
