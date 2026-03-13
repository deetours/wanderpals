import requests
from supabase import create_client, Client

# --- ⚙️ CONFIGURATION (Live Keys) ---
SUPABASE_URL = "https://ralkdbmoaypdjwtkvbhz.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhbGtkYm1vYXlwZGp3dGt2Ymh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTYwMjkwNiwiZXhwIjoyMDg3MTc4OTA2fQ.WoF4ZRpHI_6keEhDckKAp6TkWzdLhkw8uklSahtyYgM" 

WHATSAPP_API_URL = "http://129.159.224.220/api/v1"
WHATSAPP_API_KEY = "lpQhf-IEmNG8OLlsgv9VhEv-MEh1NQra"

# Initialize Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

print("--- Wanderpals AI System Tester ---\n")

# 1. Ask for Phone Number
phone = "+918095218947"

if not phone.startswith('+'):
    phone = '+' + phone

print("\n--------------------------------------------------")
print("TEST 1: DIRECT API PING (Testing the WhatsApp Agent)")
print("--------------------------------------------------")
print("Sending a direct message bypassing Supabase...")

headers = {
    "X-API-Key": WHATSAPP_API_KEY,
    "Content-Type": "application/json"
}

payload = {
    "to": phone, 
    "message": "Hello! This is a direct test ping from your WhatsApp API Server!"
}

try:
    endpoint = f"{WHATSAPP_API_URL}/whatsapp/send-external"
    res = requests.post(endpoint, json=payload, headers=headers)
    
    if res.status_code in [200, 201]:
        print("SUCCESS: The WhatsApp API is online and the message was sent!")
    else:
        print(f"FAILED: The API returned an error - {res.text}")
except Exception as e:
    print(f"CRITICAL ERROR: Could not connect to API - {str(e)}")


print("\n--------------------------------------------------")
print("TEST 2: TRIGGERING THE BRIDGE (Testing the full Autonomous Loop)")
print("--------------------------------------------------")
print("Injecting a fake lead into your Supabase database...")

lead_data = {
    "name": "Sunny (Test Lead)",
    "email": "test@wanderpals.com",
    "phone_number": phone,
    "trip_interest": "Debugging the Autonomous Matrix",
    "status": "new"
}

try:
    supabase.table('leads').insert(lead_data).execute()
    print("SUCCESS: Fake lead inserted into Supabase!")
    print("\nWithin the next 30 seconds, your background process (wanderpals-ai) should detect this lead and send a second WhatsApp message automatically.")
    print("To watch the AI detect it in real-time, open a new terminal and run: pm2 logs wanderpals-ai")
except Exception as e:
    print(f"FAILED: Could not insert lead into Supabase - {str(e)}")

print("\nTesting complete!")
