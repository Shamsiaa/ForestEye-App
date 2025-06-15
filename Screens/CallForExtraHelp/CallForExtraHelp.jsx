import React, { useState, useEffect } from "react";
import { View, Text, Alert, ActivityIndicator, ScrollView } from "react-native";
import { Button } from "react-native-elements";
import axios from "axios";
import styles from "./CallForExtraHelpStyles";
import API_BASE_URL from "../../apiConfig";

export default function CallForExtraHelpScreen({ navigation, route }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { forestId } = route.params; // Get forestId from navigation params

  const fetchAlerts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/alerts`, {
        params: {
          forest_id: forestId, // Only fetch alerts for this forest
        },
      });

      const activeAlerts = response.data
        .filter((alert) => alert.detection_status === "active")
        .map((alert) => ({
          ...alert,
          fire_stations: alert.fire_stations || [],
        }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 4);

      setAlerts(activeAlerts);
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, [forestId]); // Add forestId to dependency array

  const handleAction = async (alertId, actionType, stationName = null) => {
    try {
      await axios.patch(`${API_BASE_URL}/alerts/${alertId}`, {
        status: actionType === "help" ? "help_requested" : "dismissed",
        ...(stationName && { helped_by: stationName }),
      });

      await axios.delete(`${API_BASE_URL}/alerts/${alertId}`);

      Alert.alert(
        "Success",
        actionType === "help"
          ? `Help requested from ${stationName}!`
          : "Alert dismissed"
      );
      fetchAlerts();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.detail || "Action failed");
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Active Fire Alerts</Text>

      {alerts.length === 0 ? (
        <Text style={styles.noAlertsText}>No active alerts in your forest</Text>
      ) : (
        alerts.map((alert) => (
          <View key={alert.alert_id} style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <Text style={styles.forestName}>{alert.forest_name}</Text>
              <Text style={styles.alertTime}>
                {new Date(alert.timestamp).toLocaleString()}
              </Text>
            </View>

            {/* Fire Station Buttons - shows all stations in the forest */}
            {alert.fire_stations.length > 0 ? (
              <View style={styles.stationsContainer}>
                {alert.fire_stations.map((station) => (
                  <Button
                    key={`${alert.alert_id}-${station.id}`}
                    title={`Alert ${
                      station.name || station.station_name || "Station"
                    }`}
                    buttonStyle={styles.callButton}
                    titleStyle={styles.buttonText}
                    onPress={() =>
                      handleAction(
                        alert.alert_id,
                        "help",
                        station.name || station.station_name
                      )
                    }
                  />
                ))}
              </View>
            ) : (
              <Text style={styles.noStationsText}>
                No fire stations available
              </Text>
            )}

            {/* Dismiss Button */}
            <Button
              title="Dismiss Alert"
              buttonStyle={styles.dismissButton}
              titleStyle={styles.buttonText}
              onPress={() => handleAction(alert.alert_id, "dismiss")}
            />
          </View>
        ))
      )}
    </ScrollView>
  );
}
