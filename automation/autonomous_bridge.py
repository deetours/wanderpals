import os
import requests
import time
from typing import List, Dict

# try to import supabase, if not installed, we'll tell the user later
try:
    from supabase import create_client, Client
except ImportError:
    print("⚠️ Supabase library not found. Run: pip install supabase requests")
    exit(1)

# --- ⚙️ CONFIGURATION (Live Keys) ---
SUPABASE_URL = "https://ralkdbmoaypdjwtkvbhz.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhbGtkYm1vYXlwZGp3dGt2Ymh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTYwMjkwNiwiZXhwIjoyMDg3MTc4OTA2fQ.WoF4ZRpHI_6keEhDckKAp6TkWzdLhkw8uklSahtyYgM" 

# WhatsApp Agent API (Your deployed server)
WHATSAPP_API_URL = "http://129.159.224.220/api/v1"
WHATSAPP_API_KEY = "lpQhf-IEmNG8OLlsgv9VhEv-MEh1NQra"

# Initialize Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_new_leads() -> List[Dict]:
    """Fetches leads with status 'new' from Wanderpals Supabase."""
    try:
        response = supabase.table('leads').select("*").eq('status', 'new').execute()
        return response.data
    except Exception as e:
        print(f"❌ Supabase Error: {e}")
        return []

def send_whatsapp_message(phone: str, message: str):
    """Sends a message via the WhatsApp Agent API."""
    headers = {
        "X-API-Key": WHATSAPP_API_KEY,
        "Content-Type": "application/json"
    }
    
    # Ensuring phone number is in correct format (adding + if missing)
    if not phone.startswith('+'):
        phone = f"+{phone}"

    payload = {
        "to": phone, 
        "message": message
    }

    try:
        # Correct endpoint for direct sending in your gateway via API Key
        endpoint = f"{WHATSAPP_API_URL}/whatsapp/send-external"
        res = requests.post(endpoint, json=payload, headers=headers)
        
        if res.status_code in [200, 201]:
            return True, "Success"
        else:
            return False, f"API Error: {res.text}"
    except Exception as e:
        return False, str(e)

def update_lead_status(lead_id: str, new_status: str):
    """Updates lead status in Supabase so we don't message them twice."""
    try:
        supabase.table('leads').update({"status": new_status}).eq('id', lead_id).execute()
        return True
    except Exception as e:
        print(f"❌ Status Update Error: {e}")
        return False

def start_autonomous_loop():
    print("--- Wanderpals Autonomous Bridge is ACTIVE ---", flush=True)
    print(f"Monitoring leads at: {SUPABASE_URL}", flush=True)
    print("---", flush=True)

    while True:
        leads = get_new_leads()
        
        if leads:
            print(f"Found {len(leads)} new leads. Processing...", flush=True)
            for lead in leads:
                name = lead.get('name', 'Traveller')
                phone = lead.get('phone_number')
                interest = lead.get('trip_interest', 'exploring the world')

                if not phone:
                    print(f"Skipping lead {name}: No phone number.", flush=True)
                    update_lead_status(lead['id'], 'error_no_phone')
                    continue

                # --- BRAIN LOGIC ---
                message = (
                    f"Hi {name}! This is Sunny from Wanderpals.\n\n"
                    f"Saw you're interested in {interest}.\n"
                    f"I'm your dedicated travel concierge. Would you like to see a custom itinerary based on your budget?"
                )

                print(f"Sending to {name} ({phone})...", flush=True)
                success, error = send_whatsapp_message(phone, message)

                if success:
                    print(f"Sent! Moving lead to 'contacted'.", flush=True)
                    update_lead_status(lead['id'], 'contacted')
                else:
                    print(f"Failed to reach {name}: {error}", flush=True)
                    # Optionally mark as failed
                    # update_lead_status(lead['id'], 'failed')

        time.sleep(30) # Check every 30 seconds

if __name__ == "__main__":
    start_autonomous_loop()
