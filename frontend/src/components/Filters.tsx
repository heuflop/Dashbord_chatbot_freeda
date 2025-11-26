import React from 'react';
import { useTickets } from '../context/TicketContext';
import { Search } from 'lucide-react';

const Filters = () => {
    const { filters, setFilters } = useTickets();

    const years = ['2023', '2024', '2025'];
    const months = ['Tous', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    const days = ['Tous', ...Array.from({ length: 31 }, (_, i) => (i + 1).toString())];

    const handleChange = (key: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100 items-center">
            <span className="text-sm font-medium text-gray-700">Filtres :</span>

            {/* Search Filter */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Rechercher..."
                    value={filters.search}
                    onChange={(e) => handleChange('search', e.target.value)}
                    className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
            </div>

            {/* Status Filter */}
            <select
                value={filters.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="Tous statuts">Tous statuts</option>
                <option value="Nouveau">Nouveau</option>
                <option value="En cours">En cours</option>
                <option value="En attente">En attente</option>
                <option value="Résolu">Résolu</option>
                <option value="Fermé">Fermé</option>
                <option value="Critique">Critique</option>
            </select>

            {/* Priority Filter */}
            <select
                value={filters.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="Toutes gravités">Toutes gravités</option>
                <option value="Faible">Faible</option>
                <option value="Moyen">Moyen</option>
                <option value="Élevé">Élevé</option>
                <option value="Critique">Critique</option>
            </select>

            {/* Channel Filter */}
            <select
                value={filters.channel}
                onChange={(e) => handleChange('channel', e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="Tous canaux">Tous canaux</option>
                <option value="Chatbot">Chatbot</option>
                <option value="Callbot">Callbot</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="SMS">SMS</option>
                <option value="Email">Email</option>
                <option value="Tweeter">Tweeter</option>
                <option value="IA">IA</option>
                <option value="Agent X">Agent X</option>
            </select>

            {/* Date Filters (kept for chart compatibility) */}
            <div className="h-6 w-px bg-gray-300 mx-2 hidden md:block"></div>

            <select
                value={filters.year}
                onChange={(e) => handleChange('year', e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="Tous">Toutes les années</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            <select
                value={filters.month}
                onChange={(e) => handleChange('month', e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="Tous">Mois</option>
                {months.filter(m => m !== 'Tous').map(m => <option key={m} value={m}>{new Date(2024, parseInt(m) - 1, 1).toLocaleString('fr-FR', { month: 'long' })}</option>)}
            </select>

            <select
                value={filters.day}
                onChange={(e) => handleChange('day', e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="Tous">Jour</option>
                {days.filter(d => d !== 'Tous').map(d => <option key={d} value={d}>{d}</option>)}
            </select>
        </div>
    );
};

export default Filters;
