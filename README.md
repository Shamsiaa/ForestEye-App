# ForestEye-App 🌲🔥

**ForestEye-App** is an AI-based forest fire detection and prevention system designed for real-time monitoring of forest regions. It combines advanced image processing, IoT sensor data, and smart alerting to provide early warnings of fire risks.

## 🚀 Features

- **AI-Based Fire/Smoke Detection**  
  YOLOv8 and Faster R-CNN models process drone-captured images and identify fire or smoke in real-time.

- **Sensor Integration**  
  Data from temperature, humidity, CO, soil moisture, and flame sensors is collected and analyzed.

- **FastAPI Backend**  
  - Fire detection inference
  - Simulation module (runs inference on random Firebase images)
  - Alert management (create, update, delete alerts; send SMS/email notifications via Twilio)
  - Firebase (Firestore + Storage) integration

- **Mobile App (React Native + Expo)**  
  - Map Monitoring (shows detected fires on a map)
  - Region Selection
  - Live Monitoring (simulated drone video stream)
  - Call for Extra Help (triggers emergency calls/SMS)

- **Modular & Scalable**  
  Designed to adapt to different regions and sensor setups.


