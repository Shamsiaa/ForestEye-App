import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d3e8c6",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60, // move content higher
  },
  menu: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 60, // reduced to bring buttons up
  },
  button: {
    backgroundColor: "#a4c772",
    borderColor: "#333",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 25, // ⬅️ Increased spacing
    width: "80%",
    alignItems: "center",
    borderWidth: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "#000", // white text for contrast
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    width: 80,
    height: 100,
    marginRight: 0,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
  },
});

export default styles;
