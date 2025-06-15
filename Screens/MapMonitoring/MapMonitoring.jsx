import React, { useEffect, useState, useRef } from "react";
import { View, Text, Alert, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Audio } from "expo-av";
import axios from "axios";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import styles from "./MapMonitoringStyle";
import API_BASE_URL from "../../apiConfig";

const MAP_REGION = {
  latitude: 37.0,
  longitude: 30.0,
  latitudeDelta: 4,
  longitudeDelta: 4,
};

export default function MapMonitoringScreen({ navigation }) {
  const [fireMarkers, setFireMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPlayingAudio, setCurrentPlayingAudio] = useState(null);
  const audioQueue = useRef([]);
  const isPlaying = useRef(false);
  const processedMarkers = useRef(new Set());
  const soundRef = useRef(null);

  // Initialize audio settings
  const initializeAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error("Audio initialization error:", error);
    }
  };

  // Fetch audio URL from Firestore
  const fetchAudioUrl = async (locationId) => {
    try {
      if (!locationId) return null;

      const docRef = doc(db, "forestLocations", String(locationId));
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const baseUrl = docSnap.data().audioUrl;
        return `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}t=${Date.now()}`;
      }
      return null;
    } catch (error) {
      console.error("Error fetching audio URL:", error);
      return null;
    }
  };

  // Process audio queue
  const processAudioQueue = async () => {
    if (isPlaying.current || audioQueue.current.length === 0) return;
    isPlaying.current = true;
    const { audioUrl, locationId } = audioQueue.current.shift();
    try {
      setCurrentPlayingAudio(locationId);
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish || status.error) {
          try {
            await sound.unloadAsync();
            soundRef.current = null;
            setCurrentPlayingAudio(null);
            isPlaying.current = false;
            processAudioQueue(); // Process next in queue
          } catch (e) {
            console.error("Error unloading sound:", e);
          }
        }
      });
    } catch (error) {
      console.error("Error playing audio:", error);
      isPlaying.current = false;
      processAudioQueue(); // Try next audio even if this one failed
    }
  };

  // Process new markers and add to audio queue
  const processNewMarkers = async (markers) => {
    await initializeAudio();

    for (const marker of markers) {
      if (
        !marker.location_id ||
        processedMarkers.current.has(marker.location_id)
      ) {
        continue;
      }

      processedMarkers.current.add(marker.location_id);
      const audioUrl = await fetchAudioUrl(marker.location_id);

      if (audioUrl) {
        audioQueue.current.push({
          audioUrl,
          locationId: marker.location_id,
          timestamp: Date.now(),
        });
        processAudioQueue();
      }
    }
  };

  // Fetch fire events from backend
  const fetchFireEvents = async (signal) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fire-events`, {
        signal,
      });
      return response.data;
    } catch (error) {
      if (error.name !== "CanceledError") {
        console.error("Error fetching fire events:", error);
      }
      return [];
    }
  };

  // Control simulation
  const controlSimulation = async (action, signal) => {
    try {
      await axios.post(`${API_BASE_URL}/${action}-simulation`, null, {
        signal,
      });
    } catch (error) {
      console.error(`Error ${action}ing simulation:`, error);
      if (action === "start") {
        Alert.alert("Simulation Error", "Failed to start simulation");
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const init = async () => {
      await controlSimulation("start", controller.signal);
      setLoading(false);

      const poll = async () => {
        if (!isMounted) return;

        const data = await fetchFireEvents(controller.signal);
        if (!isMounted) return;

        const validMarkers = data
          .filter((m) => m.coords?.latitude && m.coords?.longitude)
          .slice(0, 4);

        if (JSON.stringify(validMarkers) !== JSON.stringify(fireMarkers)) {
          setFireMarkers(validMarkers);
          processNewMarkers(validMarkers);
        }
      };

      const interval = setInterval(poll, 1000);
      return () => clearInterval(interval);
    };

    const intervalCleanup = init();

    const unsubscribe = navigation.addListener("beforeRemove", () => {
      isMounted = false;
      controller.abort();
      // Clean up sound
      if (soundRef.current) {
        soundRef.current
          .unloadAsync()
          .catch((e) => console.error("Error unloading sound:", e));
      }
      controlSimulation("stop");
    });

    return () => {
      isMounted = false;
      controller.abort();
      unsubscribe();
      intervalCleanup.then((cleanup) => cleanup?.());
      audioQueue.current = [];
      processedMarkers.current.clear();
    };
  }, [navigation]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
        <Text>Starting simulation...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Turkey Forest Monitoring</Text>

      <MapView
        style={styles.map}
        initialRegion={MAP_REGION}
        provider="google"
        showsUserLocation
        showsMyLocationButton
      >
        {fireMarkers.map((marker, index) => (
          <Marker
            key={`${marker.location_id}-${index}`}
            coordinate={marker.coords}
            title={`🔥 ${marker.forest_name}`}
            description={`${marker.class} (${(marker.confidence * 100).toFixed(
              0
            )}% confidence)`}
            pinColor={
              currentPlayingAudio === marker.location_id ? "#f39c12" : "#e74c3c"
            }
          />
        ))}
      </MapView>

      {fireMarkers.length > 0 && (
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>
            {fireMarkers.length} fire alert{fireMarkers.length !== 1 ? "s" : ""}{" "}
            detected!
           
          </Text>
        </View>
      )}
    </View>
  );
}
