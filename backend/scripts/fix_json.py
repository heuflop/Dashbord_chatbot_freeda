import json
import os

DATA_DIR = "data"
DB_FILE = os.path.join(DATA_DIR, "tickets.json")

def migrate_db():
    if not os.path.exists(DB_FILE):
        print("No DB file found.")
        return

    with open(DB_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    new_data = []
    for record in data:
        new_record = record.copy()
        
        # Rename keys
        if 'statut' in new_record:
            new_record['status'] = new_record.pop('statut')
        if 'gravite' in new_record:
            new_record['priority'] = new_record.pop('gravite')
        if 'canal' in new_record:
            new_record['channel'] = new_record.pop('canal')
        if 'historique_echanges' in new_record:
            new_record['historique'] = new_record.pop('historique_echanges')
            
        # Ensure all fields exist
        if 'recommandation' not in new_record:
            new_record['recommandation'] = ""
            
        new_data.append(new_record)

    with open(DB_FILE, 'w', encoding='utf-8') as f:
        json.dump(new_data, f, indent=4, ensure_ascii=False)
    
    print(f"Migrated {len(new_data)} records.")

if __name__ == "__main__":
    migrate_db()
