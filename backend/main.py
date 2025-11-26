from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from services.processor import check_and_process_inputs
import json
import os

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

DATA_DIR = "data"
DB_FILE = os.path.join(DATA_DIR, "tickets.json")

@app.on_event("startup")
async def startup_event():
    # Ensure directories exist
    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs("inputs", exist_ok=True)
    os.makedirs("archive", exist_ok=True)
    # Check for inputs on startup
    check_and_process_inputs()

@app.get("/tickets")
async def get_tickets():
    if os.path.exists(DB_FILE):
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

@app.post("/refresh")
async def refresh_data(background_tasks: BackgroundTasks):
    """Manually trigger data processing"""
    background_tasks.add_task(check_and_process_inputs)
    return {"message": "Data processing triggered"}

@app.get("/")
async def root():
    return {"message": "Freeda Backend is running"}

from pydantic import BaseModel

class TicketStatusUpdate(BaseModel):
    status: str

@app.put("/tickets/{ticket_id}/status")
async def update_ticket_status(ticket_id: str, status_update: TicketStatusUpdate):
    if os.path.exists(DB_FILE):
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            tickets = json.load(f)
        
        updated = False
        for ticket in tickets:
            if ticket['id'] == ticket_id:
                ticket['status'] = status_update.status
                updated = True
                break
        
        if updated:
            with open(DB_FILE, 'w', encoding='utf-8') as f:
                json.dump(tickets, f, indent=2, ensure_ascii=False)
            return {"message": "Status updated successfully", "status": status_update.status}
    
    return {"message": "Ticket not found"}, 404
