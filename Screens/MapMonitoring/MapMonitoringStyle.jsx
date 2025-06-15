import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
    color: "#2c3e50",
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Better alternative to flex: 1 for full-screen maps
  },
  alertBox: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#ff6b6b",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  alertText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
