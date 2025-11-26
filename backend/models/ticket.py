from pydantic import BaseModel
from typing import Optional

class Ticket(BaseModel):
    id: str
    client: str
    motif: str
    status: str
    priority: str
    channel: str
    date: str
    agent: str
    historique: Optional[str] = ""
    recommandation: Optional[str] = ""
    sentiment: Optional[str] = None
