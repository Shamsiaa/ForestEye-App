﻿import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate("firebase/serviceAccountKey.json")
firebase_admin.initialize_app(cred)
print(" Firebase connected successfully!")
