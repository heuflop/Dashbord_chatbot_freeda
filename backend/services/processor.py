import pandas as pd
import json
import os
import shutil
from datetime import datetime
from models.ticket import Ticket

INPUT_DIR = "inputs"
ARCHIVE_DIR = "archive"
DATA_DIR = "data"
DB_FILE = os.path.join(DATA_DIR, "tickets.json")

def process_csv_file(file_path: str):
    try:
        # Load CSV
        df = pd.read_csv(file_path)
        
        # Basic cleaning and mapping (adjust based on actual CSV structure)
        # Assuming CSV has columns that map to our Ticket model
        # If not, we need to rename/transform them here.
        # For now, I'll assume a direct mapping or create default values.
        
        # Example mapping logic (customize as needed)
        if 'TICKET' not in df.columns:
             df['TICKET'] = [f"T-{i}" for i in range(len(df))] # Generate IDs if missing
        
        # Ensure all required columns exist
        required_cols = ["TICKET", "Client", "Motif", "Statut", "Gravité", "Canal", "Date", "Agent", "Historique des échanges", "Recommandation", "Sentiment"]
        for col in required_cols:
            if col not in df.columns:
                df[col] = "" # Fill missing with empty string
                
        # Rename to match Pydantic model fields (lowercase)
        column_map = {
            "TICKET": "id",
            "Client": "client",
            "Motif": "motif",
            "Statut": "status",
            "Gravité": "priority",
            "Canal": "channel",
            "Date": "date",
            "Agent": "agent",
            "Historique des échanges": "historique",
            "Recommandation": "recommandation",
            "Sentiment": "sentiment"
        }
        df = df.rename(columns=column_map)
        
        # Convert to list of dicts
        new_records = df[list(column_map.values())].to_dict(orient='records')
        
        # Load existing DB
        existing_data = []
        if os.path.exists(DB_FILE):
            with open(DB_FILE, 'r', encoding='utf-8') as f:
                try:
                    existing_data = json.load(f)
                except json.JSONDecodeError:
                    existing_data = []
        
        # Append new records (avoid duplicates based on ID if needed)
        existing_ids = {r['id'] for r in existing_data}
        for record in new_records:
            if record['id'] not in existing_ids:
                existing_data.append(record)
        
        # Save back to JSON
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump(existing_data, f, indent=2, ensure_ascii=False)
            
        # Archive the file
        filename = os.path.basename(file_path)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        archive_path = os.path.join(ARCHIVE_DIR, f"{timestamp}_{filename}")
        shutil.move(file_path, archive_path)
        
        return len(new_records)

    except Exception as e:
        print(f"Error processing file {file_path}: {e}")
        raise e

def check_and_process_inputs():
    processed_count = 0
    if not os.path.exists(INPUT_DIR):
        os.makedirs(INPUT_DIR)
        
    for filename in os.listdir(INPUT_DIR):
        if filename.endswith(".csv"):
            file_path = os.path.join(INPUT_DIR, filename)
            processed_count += process_csv_file(file_path)
            
    return processed_count
