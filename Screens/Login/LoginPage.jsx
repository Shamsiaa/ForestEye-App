import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import styles from "./LoginStyle";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

import { collectionGroup, getDocs } from "firebase/firestore";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const querySnapshot = await getDocs(collectionGroup(db, "admins"));
      let found = false;

      for (const doc of querySnapshot.docs) {
        const admin = doc.data();
        if (admin.username === email && admin.password === password) {
          found = true;

          // Extract path components
          const pathParts = doc.ref.path.split("/");
          console.log("Full document path:", doc.ref.path);
          console.log("Path parts:", pathParts);

          const forestId = pathParts[1];
          const stationId = pathParts[3];
          console.log("Verified forestId:", forestId);
          console.log("Verified stationId:", stationId);

          // Get the firestation document
          const stationRef = doc.ref.parent.parent;
          console.log("Attempting to access station at path:", stationRef.path);

          try {
            const stationDoc = await getDoc(stationRef);

            if (!stationDoc.exists()) {
              console.warn("Associated firestation document not found");
              throw new Error("Firestation document not found");
            }

            const stationData = stationDoc.data();
            console.log("Station data:", stationData);

            navigation.replace("Home", {
              adminId: doc.id,
              originalId: admin.originalId,
              forestId: forestId,
              stationId: stationId,
              stationName: stationData.station_name,
              phoneNumber: stationData.phone,
            });
          } catch (stationError) {
            console.warn("Using fallback station data due to:", stationError);
            navigation.replace("Home", {
              adminId: doc.id,
              originalId: admin.originalId,
              forestId: forestId,
              stationId: stationId,
              stationName: `Station ${stationId}`,
              phoneNumber: "Not available",
            });
          }

          break;
        }
      }

      if (!found) {
        console.log("Login failed - no matching admin found");
        Alert.alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login Failed", error.message);
    }
  };
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/ProjectIcon.png")}
        style={styles.icon}
      />

      <Text style={styles.title}>Forest Fire Detection Application</Text>
      <Text style={styles.subtitle}>Ensuring safety through innovation</Text>
      <Text style={styles.info}>Please login to access your dashboard</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>
    </View>
  );
}
