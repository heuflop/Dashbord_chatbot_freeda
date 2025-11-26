import React, { createContext, useContext, useState, useMemo } from 'react';

export type TicketStatus = 'Nouveau' | 'En cours' | 'Critique' | 'En attente' | 'Résolu' | 'Fermé';
export type TicketPriority = 'Faible' | 'Moyen' | 'Élevé' | 'Critique';

export interface Ticket {
    id: string;
    client: string;
    motif: string;
    status: TicketStatus;
    priority: TicketPriority;
    channel: string;
    date: string; // ISO string
    agent?: string;
    historique?: string;
    recommandation?: string;
    sentiment?: string;
}

interface FilterState {
    year: string;
    month: string;
    day: string;
    search: string;
    status: string;
    priority: string;
    channel: string;
}

interface TicketContextType {
    tickets: Ticket[];
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    filteredTickets: Ticket[];
    kpis: {
        total: number;
        new: number;
        inProgress: number;
        critical: number;
        pending: number;
        closed: number;
    };
    refreshTickets: () => Promise<void>;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const useTickets = () => {
    const context = useContext(TicketContext);
    if (!context) {
        throw new Error('useTickets must be used within a TicketProvider');
    }
    return context;
};

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [filters, setFilters] = useState<FilterState>({
        year: '2024',
        month: 'Tous',
        day: 'Tous',
        search: '',
        status: 'Tous statuts',
        priority: 'Toutes gravités',
        channel: 'Tous canaux'
    });

    const fetchTickets = async () => {
        try {
            const response = await fetch('http://localhost:8000/tickets');
            if (response.ok) {
                const data = await response.json();
                setTickets(data);
            } else {
                console.error('Failed to fetch tickets');
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    React.useEffect(() => {
        fetchTickets();
        // Optional: Polling every 5 seconds
        const interval = setInterval(fetchTickets, 5000);
        return () => clearInterval(interval);
    }, []);

    const refreshTickets = fetchTickets;

    const filteredTickets = useMemo(() => {
        return tickets.filter(ticket => {
            const date = new Date(ticket.date);
            const yearMatch = filters.year === 'Tous' || date.getFullYear().toString() === filters.year;
            const monthMatch = filters.month === 'Tous' || (date.getMonth() + 1).toString() === filters.month;
            const dayMatch = filters.day === 'Tous' || date.getDate().toString() === filters.day;

            const searchMatch = filters.search === '' ||
                ticket.id.toLowerCase().includes(filters.search.toLowerCase()) ||
                ticket.client.toLowerCase().includes(filters.search.toLowerCase()) ||
                ticket.motif.toLowerCase().includes(filters.search.toLowerCase());

            const statusMatch = filters.status === 'Tous statuts' || ticket.status === filters.status;
            const priorityMatch = filters.priority === 'Toutes gravités' || ticket.priority === filters.priority;

            let channelMatch = true;
            if (filters.channel !== 'Tous canaux') {
                if (filters.channel === 'IA' || filters.channel === 'Agent X') {
                    // Check agent field for IA and Agent X
                    channelMatch = ticket.agent === filters.channel;
                } else {
                    // Check channel field for others
                    channelMatch = ticket.channel === filters.channel;
                }
            }

            return yearMatch && monthMatch && dayMatch && searchMatch && statusMatch && priorityMatch && channelMatch;
        });
    }, [tickets, filters]);

    const kpis = useMemo(() => {
        return {
            total: filteredTickets.length,
            new: filteredTickets.filter(t => t.status === 'Nouveau').length,
            inProgress: filteredTickets.filter(t => t.status === 'En cours').length,
            critical: filteredTickets.filter(t => t.status === 'Critique').length,
            pending: filteredTickets.filter(t => t.status === 'En attente').length,
            closed: filteredTickets.filter(t => t.status === 'Fermé').length,
        };
    }, [filteredTickets]);

    return (
        <TicketContext.Provider value={{ tickets, filters, setFilters, filteredTickets, kpis, refreshTickets }}>
            {children}
        </TicketContext.Provider>
    );
};
