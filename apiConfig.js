// src/apiConfig.js
// dorm's ip
const LOCAL_IP = "10.5.0.252";// IPv4 Address
// school's ip
//onst LOCAL_IP = "10.0.67.176"; 
const PORT = "8000"; // ← FastAPI default port

const API_BASE_URL = `http://${LOCAL_IP}:${PORT}`;
export default API_BASE_URL;

/*Wherever you need to call your backend API, just:
import API_BASE_URL from '../apiConfig'; // adjust the path if needed

fetch(`${API_BASE_URL}/start_simulation`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ region: "mediterranean" }),
});
*/