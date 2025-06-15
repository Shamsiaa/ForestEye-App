import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#d3e8c6",
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#8cc751",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 25,
    textAlign: "center",
  },
  alertCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  alertHeader: {
    marginBottom: 12,
  },
  forestName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  stationsContainer: {
    marginVertical: 10,
  },
  callButton: {
    backgroundColor: "#e74c3c",
    borderRadius: 8,
    paddingVertical: 17,
    marginBottom: 8,
    minHeight: 50,
    alignSelf: "center", // Center horizontally
    width: 300, // Set desired width
  },
  dismissButton: {
    backgroundColor: "#a4c772",
    borderRadius: 8,
    paddingVertical: 10,
    minHeight: 40,
    marginTop: 8,
    alignSelf: "center",
    width: 150,
  },

  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  noAlertsText: {
    color: "black",
    textAlign: "center",
    fontSize: 20,
    marginTop: 20,
  },
  noStationsText: {
    color: "#7f8c8d",
    textAlign: "center",
    fontSize: 14,
    marginVertical: 10,
    fontStyle: "italic",
  },
});
