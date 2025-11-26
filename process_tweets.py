import pandas as pd
import numpy as np
import json
import random
from textblob import TextBlob
from datetime import datetime

# --- Configuration ---
INPUT_FILE = "free tweet export.csv"
OUTPUT_FILE = "tickets.json"
SAMPLE_FRACTION = 0.10
RANDOM_STATE = 42

# --- Helper Functions ---

def get_sentiment_and_recommendation(text):
    """
    Analyzes sentiment using TextBlob and returns a recommendation.
    """
    if not isinstance(text, str):
        return "Neutre", "Aucune action requise"
    
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    
    if polarity < -0.3:
        sentiment = "Négatif"
        recommendation = "Escalader au support niveau 2 (Priorité Haute)"
        gravite = "Critique"
    elif polarity < 0:
        sentiment = "Plutôt Négatif"
        recommendation = "Répondre avec empathie et proposer une solution rapide"
        gravite = "Moyen"
    elif polarity > 0.3:
        sentiment = "Positif"
        recommendation = "Remercier le client pour son retour positif"
        gravite = "Faible"
    else:
        sentiment = "Neutre"
        recommendation = "Répondre aux questions factuelles"
        gravite = "Faible"
        
    return sentiment, recommendation, gravite

def extract_motif(text):
    """
    Extracts a motif based on keywords.
    """
    if not isinstance(text, str):
        return "Autre"
    
    text_lower = text.lower()
    if "panne" in text_lower or "coupure" in text_lower:
        return "Problème technique"
    elif "facture" in text_lower or "remboursement" in text_lower:
        return "Facturation"
    elif "connexion" in text_lower or "wifi" in text_lower or "débit" in text_lower:
        return "Problème de connexion"
    elif "box" in text_lower or "freebox" in text_lower:
        return "Matériel"
    elif "mobile" in text_lower or "forfait" in text_lower:
        return "Mobile"
    else:
        return "Autre"

def generate_ticket_id(index):
    """Generates a ticket ID."""
    return f"T-2024-{1000 + index}"

# --- Main Execution ---

def main():
    print("Chargement des données...")
    try:
        # Try reading with different encodings as in the notebook
        try:
            df = pd.read_csv(INPUT_FILE, encoding="utf-8")
        except:
            try:
                df = pd.read_csv(INPUT_FILE, encoding="utf-8-sig")
            except:
                df = pd.read_csv(INPUT_FILE, encoding="latin-1")
    except FileNotFoundError:
        print(f"Erreur: Le fichier '{INPUT_FILE}' est introuvable.")
        return

    print(f"Données chargées: {len(df)} lignes.")

    # 1. Filtrage des données
    print("Filtrage des tweets clients...")
    # Ensure screen_name is string and lower case
    df["screen_name_lower"] = df["screen_name"].astype(str).str.lower()
    df_client = df[~df["screen_name_lower"].str.contains("free", na=False)]
    print(f"Tweets clients filtrés: {len(df_client)} lignes.")

    # 2. Échantillonnage (10%)
    print(f"Sélection de {SAMPLE_FRACTION*100}% des données...")
    df_client_sample = df_client.sample(frac=SAMPLE_FRACTION, random_state=RANDOM_STATE).copy()
    print(f"Échantillon final: {len(df_client_sample)} lignes.")

    # 3. Enrichissement des données
    print("Enrichissement des données...")
    
    tickets_data = []
    
    for index, row in df_client_sample.iterrows():
        text = row.get("full_text", "")
        # Use full_text as history if text_clean is not available or empty
        history = row.get("text_clean", text) 
        
        sentiment, recommendation, gravite = get_sentiment_and_recommendation(text)
        motif = extract_motif(text)
        ticket_id = generate_ticket_id(index)
        
        # Format date (assuming created_at exists, otherwise use now)
        date_str = row.get("created_at", datetime.now().isoformat())
        
        ticket = {
            "id": ticket_id,
            "client": row.get("screen_name", "Anonyme"),
            "motif": motif,
            "statut": "Fermé", # Default for tweeter
            "gravite": gravite,
            "canal": "Tweeter",
            "date": date_str,
            "agent": "Agent X", # Default agent
            "sentiment": sentiment,
            "recommandation": recommendation,
            "historique_echanges": history,
            "full_text": text # Keeping original text just in case
        }
        tickets_data.append(ticket)

    # 4. Export JSON
    print(f"Export vers '{OUTPUT_FILE}'...")
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(tickets_data, f, ensure_ascii=False, indent=4)
    
    print("Terminé avec succès.")

if __name__ == "__main__":
    main()
