import React, { useState } from "react";
import { View, Text, StyleSheet, Button, Alert, Picker } from "react-native";

export default function SelectRegionScreen({ navigation }) {
  const [selectedRegion, setSelectedRegion] = useState("");

  const handleRegionSelect = () => {
    if (!selectedRegion) {
      Alert.alert("Please select a region!");
    } else {
      Alert.alert("Region Selected", `You selected: ${selectedRegion}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Region</Text>

      <Text style={styles.description}>
        Choose the region for monitoring or forest fire detection.
      </Text>

      

      {/* Button to proceed */}
      <Button
        title="Select Region"
        onPress={handleRegionSelect}
        color="#8cc751"
      />

      
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8cc751",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  picker: {
    width: "80%",
    height: 50,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
});
