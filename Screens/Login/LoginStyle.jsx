import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10, // content near top
    alignItems: "center",
    backgroundColor: "#fff",
  },
  icon: {
    width: 400,
    height: 260,
    marginBottom: 10,
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#444",
    marginTop: 2,
    textAlign: "center",
  },
  info: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    marginBottom: 16, // added space between input fields
    borderRadius: 5,
  },
  loginButton: {
    width: "70%",
    backgroundColor: "#a4c772",
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#000", // changed to black
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;
