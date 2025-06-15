from fastapi import APIRouter, HTTPException, Body, Query
from pydantic import BaseModel
from firebase.config import db
from datetime import datetime
from twilio.rest import Client
import os
from typing import Optional
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

class AlertUpdate(BaseModel):
    status: str

async def get_fire_stations(location_id, station_id: Optional[str] = None):
    """Helper function to get fire stations for a location, optionally filtered by station_id"""
    try:
        logger.info(f"Fetching fire stations for location {location_id}, station_id: {station_id}")
        stations_ref = db.collection("forestLocations").document(location_id).collection("firestations")
        
        if station_id:
            # Get specific station if ID provided
            station_doc = stations_ref.document(station_id).get()
            if not station_doc.exists:
                logger.warning(f"Station {station_id} not found in location {location_id}")
                return []
            
            station_data = station_doc.to_dict()
            logger.info(f"Found station {station_id}: {station_data}")
            return [{
                "id": station_id,
                "name": station_data.get("station_name", f"Station {station_id}"),
                "phone": station_data.get("phone", "")
            }]
        else:
            # Get all stations if no ID provided
            docs = stations_ref.stream()
            stations = []
            for doc in docs:
                station_data = doc.to_dict()
                stations.append({
                    "id": doc.id,
                    "name": station_data.get("station_name", f"Station {doc.id}"),
                    "phone": station_data.get("phone", "")
                })
            logger.info(f"Found {len(stations)} stations for location {location_id}")
            return stations
            
    except Exception as e:
        logger.error(f"Error fetching fire stations for location {location_id}: {str(e)}", exc_info=True)
        return []

@router.get("/")
async def get_alerts(
    forest_id: Optional[str] = Query(None, description="Filter alerts by forest ID"),
    station_id: Optional[str] = Query(None, description="Filter fire stations by station ID")
):
    """Get alerts with associated fire stations, optionally filtered by forest and station"""
    try:
        logger.info(f"Fetching alerts - forest_id: {forest_id}, station_id: {station_id}")
        
        # First get all active alerts (without ordering)
        alerts_ref = db.collection("alerts").where("detection_status", "==", "active")
        
        # Apply forest filter if provided
        if forest_id:
            alerts_ref = alerts_ref.where("forest_location_id", "==", forest_id)
        
        alerts = []
        for doc in alerts_ref.stream():
            alert_data = doc.to_dict()
            alert_data["alert_id"] = doc.id
            
            # Get fire stations for this location
            if "forest_location_id" in alert_data:
                try:
                    alert_data["fire_stations"] = await get_fire_stations(
                        alert_data["forest_location_id"],
                        station_id
                    )
                except Exception as e:
                    logger.error(f"Error getting stations for alert {doc.id}: {str(e)}", exc_info=True)
                    alert_data["fire_stations"] = []
            
            # Only include alerts with matching stations if station_id was provided
            if not station_id or alert_data.get("fire_stations"):
                alerts.append(alert_data)
        
        # Sort in memory after fetching
        alerts.sort(key=lambda x: x.get("timestamp"), reverse=True)
        
        logger.info(f"Returning {len(alerts)} alerts")
        return alerts
        
    except Exception as e:
        logger.error(f"Critical error in get_alerts: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )
@router.patch("/{alert_id}")
async def update_alert_status(
    alert_id: str,
    update_data: AlertUpdate = Body(...)
):
    """Update alert status (active, help_requested, dismissed)"""
    try:
        logger.info(f"Updating alert {alert_id} with status {update_data.status}")
        valid_statuses = ["active", "help_requested", "dismissed"]
        if update_data.status not in valid_statuses:
            logger.warning(f"Invalid status provided: {update_data.status}")
            raise HTTPException(
                status_code=400,
                detail=f"Status must be one of {valid_statuses}"
            )
        
        alert_ref = db.collection("alerts").document(alert_id)
        alert_doc = alert_ref.get()
        if not alert_doc.exists:
            logger.warning(f"Alert {alert_id} not found")
            raise HTTPException(status_code=404, detail="Alert not found")
        
        # Update alert status
        update_fields = {
            "detection_status": update_data.status,
            "updated_at": datetime.utcnow()
        }
        logger.debug(f"Updating alert {alert_id} with fields: {update_fields}")
        alert_ref.update(update_fields)
        
        logger.info(f"Successfully updated alert {alert_id}")
        return {
            "status": "success",
            "alert_id": alert_id,
            "new_status": update_data.status
        }
        
    except Exception as e:
        logger.error(f"Error updating alert {alert_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error updating alert: {str(e)}"
        )

@router.delete("/{alert_id}")
async def delete_alert(alert_id: str):
    """Delete an alert from the database"""
    try:
        logger.info(f"Deleting alert {alert_id}")
        alert_ref = db.collection("alerts").document(alert_id)
        alert_doc = alert_ref.get()
        
        if not alert_doc.exists:
            logger.warning(f"Alert {alert_id} not found for deletion")
            raise HTTPException(status_code=404, detail="Alert not found")

        alert_ref.delete()
        logger.info(f"Successfully deleted alert {alert_id}")
        return {
            "status": "success",
            "alert_id": alert_id,
            "message": "Alert deleted successfully"
        }
        
    except Exception as e:
        logger.error(f"Error deleting alert {alert_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting alert: {str(e)}"
        )

# SMS Configuration
try:
    account_sid = os.getenv('TWILIO_ACCOUNT_SID')
    auth_token = os.getenv('TWILIO_AUTH_TOKEN')
    twilio_phone = os.getenv('TWILIO_PHONE_NUMBER')
    your_phone = os.getenv('PHONE_NUMBER')
    
    if not all([account_sid, auth_token, twilio_phone, your_phone]):
        logger.warning("Missing one or more Twilio configuration environment variables")
    
    client = Client(account_sid, auth_token)
    logger.info("Twilio client initialized successfully")
except Exception as e:
    logger.error(f"Error initializing Twilio client: {str(e)}", exc_info=True)
    client = None

class SMSRequest(BaseModel):
    alert_id: str
    station_name: str
    forest_name: str

@router.post("/send-alert-sms")
async def send_alert_sms(request: SMSRequest):
    try:
        if not client:
            raise Exception("Twilio client not initialized")
        
        logger.info(f"Sending SMS for alert {request.alert_id}")
        message = client.messages.create(
            body=f"🚨 FIRE ALERT! Assistance requested at {request.station_name} in {request.forest_name} (Alert ID: {request.alert_id})",
            from_=twilio_phone,
            to=your_phone
        )
        
        logger.info(f"SMS sent successfully for alert {request.alert_id}, SID: {message.sid}")
        return {
            "status": "success",
            "message_sid": message.sid,
            "alert_id": request.alert_id
        }
    except Exception as e:
        logger.error(f"Error sending SMS for alert {request.alert_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))