from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.processor import check_and_process_inputs
from pydantic import BaseModel
import boto3
from boto3.dynamodb.conditions import Key
import os
import decimal

app = FastAPI()

# CORS Configuration
origins = [
    "http://localhost:5173", # Vite default
    "http://localhost:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AWS Configuration
AWS_REGION = "eu-west-3"
TABLE_NAME = "freeda-tickets-production"

# Initialize DynamoDB
try:
    dynamodb = boto3.resource('dynamodb', region_name=AWS_REGION)
    table = dynamodb.Table(TABLE_NAME)
except Exception as e:
    print(f"Warning: Could not connect to AWS: {e}")
    table = None

# Helper to convert Decimal to float/int (DynamoDB returns Decimals)
def decimal_default(obj):
    if isinstance(obj, decimal.Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    return obj

def convert_decimals(obj):
    if isinstance(obj, list):
        return [convert_decimals(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_decimals(v) for k, v in obj.items()}
    elif isinstance(obj, decimal.Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    return obj

@app.on_event("startup")
async def startup_event():
    # Ensure directories exist (still needed for local processing if any)
    os.makedirs("data", exist_ok=True)
    os.makedirs("inputs", exist_ok=True)
    os.makedirs("archive", exist_ok=True)

# Path to local tickets file (for development)
# Assuming directory structure:
# /Atlas_Dashboard_Freeda/backend/main.py
# /Freeda/backend/data/tickets.json
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOCAL_TICKETS_PATH = os.path.join(BASE_DIR, "..", "..", "Freeda", "backend", "data", "tickets.json")

# Path to local tickets file (for development/fallback)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOCAL_TICKETS_PATH = os.path.join(BASE_DIR, "..", "..", "Freeda", "backend", "data", "tickets.json")

@app.get("/tickets")
async def get_tickets():
    tickets = []
    items = []
    used_source = "dynamodb"
    
    # Priority 1: Try DynamoDB (Production)
    if table:
        try:
            # Scan the DynamoDB table
            response = table.scan()
            items = response.get('Items', [])
            
            # Handle pagination
            while 'LastEvaluatedKey' in response:
                response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
                items.extend(response.get('Items', []))
                
            print(f"Loaded {len(items)} tickets from DynamoDB")
        except Exception as e:
            print(f"Error fetching from DynamoDB: {e}")
            used_source = "local_fallback"
            items = [] # Ensure we try fallback
    else:
        used_source = "local_fallback"

    # Priority 2: Fallback to local JSON if DynamoDB failed or yielded no results (optional)
    # Note: If DynamoDB is empty, we might not want to show local data, but for safety/dev mix:
    if (not items or used_source == "local_fallback") and os.path.exists(LOCAL_TICKETS_PATH):
        try:
            import json
            with open(LOCAL_TICKETS_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                local_items = []
                if isinstance(data, dict):
                    local_items = list(data.values())
                elif isinstance(data, list):
                    local_items = data
                
                # If we switched to fallback, use local items
                if used_source == "local_fallback":
                    items = local_items
                    print(f"Loaded {len(items)} tickets from local JSON (Fallback)")
                # If DynamoDB was empty, maybe we want to merge or show local? 
                # For now, let's stick to: if DynamoDB works, show DynamoDB (even if empty).
                # Only use local if DynamoDB FAILED.
        except Exception as e:
            print(f"Error reading local JSON: {e}")

    # Convert and Map Data
    for item in items:
        item = convert_decimals(item)
        
        analytics = item.get("analytics", {})
        messages = item.get("messages", [])
        
        # Format messages as structured list
        formatted_messages = []
        if isinstance(messages, list):
            for msg in messages:
                # Handle different message structures (DynamoDB vs JSON)
                role = msg.get("role", "user")
                content = msg.get("content", "")
                timestamp = msg.get("timestamp", "")
                
                # Determine author name
                author = msg.get("author")
                if not author:
                    author = "Client" if role == "user" else "Assistant Free"
                    
                formatted_messages.append({
                    "role": role,
                    "content": content,
                    "timestamp": timestamp,
                    "author": author
                })
        
        # Normalize status for frontend (capitalize)
        status_raw = item.get("status", "nouveau")
        status_map = {
            "nouveau": "Nouveau",
            "en cours": "En cours",
            "fermé": "Fermé",
            "critique": "Critique",
            "en attente": "En attente",
            "résolu": "Résolu"
        }
        status = status_map.get(status_raw, status_raw.capitalize())
        
        # Normalize priority for frontend
        priority_raw = analytics.get("urgency", "moyenne")
        priority_map = {
            "basse": "Faible",
            "moyenne": "Moyen",
            "haute": "Élevé",
            "critique": "Critique"
        }
        priority = priority_map.get(priority_raw, priority_raw.capitalize())
        
        # Normalize channel (chatbot = chat)
        channel_raw = item.get("channel", "chat")
        channel = "chat" if channel_raw == "chatbot" else channel_raw
        
        # Normalize category and motif for better readability
        category_raw = analytics.get("category", "autre").lower()
        category_map = {
            "technique": "Problème Technique",
            "facturation": "Question Facturation",
            "commercial": "Renseignement Offre",
            "resiliation": "Demande Résiliation",
            "autre": "Autre Demande"
        }
        category_readable = category_map.get(category_raw, "Autre Demande")
        
        # Use readable category as motif if summary is too generic or missing
        summary = analytics.get("summary", "")
        if not summary or len(summary) < 5 or summary == "Support":
             motif = category_readable
        else:
             motif = summary

        ticket = {
            "id": item.get("ticket_id", "unknown"),
            "client": item.get("customer_name", "Anonyme"),
            "motif": motif,
            "category": category_readable,
            "status": status,
            "priority": priority,
            "channel": channel,
            "date": item.get("created_at", ""),
            "agent": "IA",
            "messages": formatted_messages,  # Structured messages
            "historique": "\n".join([f"{m.get('role', 'unknown')}: {m.get('content', '')}" for m in messages]) if messages else "",  # Keep for backward compatibility
            "recommandation": analytics.get("next_action", ""),
            "sentiment": analytics.get("sentiment", "neutre")
        }
        tickets.append(ticket)
    
    return tickets

@app.post("/refresh")
async def refresh_data(background_tasks: BackgroundTasks):
    """Manually trigger data processing"""
    # In production mode, this might trigger a new fetch or local processing
    background_tasks.add_task(check_and_process_inputs)
    return {"message": "Data processing triggered"}

@app.get("/")
async def root():
    return {"message": "Freeda Dashboard Backend is running (Connected to AWS Production)"}

class TicketStatusUpdate(BaseModel):
    status: str

@app.put("/tickets/{ticket_id}/status")
async def update_ticket_status(ticket_id: str, status_update: TicketStatusUpdate):
    if table:
        try:
            table.update_item(
                Key={'ticket_id': ticket_id},
                UpdateExpression="set #s = :s",
                ExpressionAttributeNames={'#s': 'status'},
                ExpressionAttributeValues={':s': status_update.status}
            )
            return {"message": "Status updated successfully", "status": status_update.status}
        except Exception as e:
            print(f"Error updating DynamoDB: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    return {"message": "Database connection not available"}, 503
