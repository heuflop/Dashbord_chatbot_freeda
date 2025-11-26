import React from 'react';
import { Eye, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Ticket, TicketStatus, TicketPriority } from '../context/TicketContext';
import { cn } from '../lib/utils';

interface TicketTableProps {
    tickets: Ticket[];
}

const statusColors: Record<TicketStatus, string> = {
    'Nouveau': 'text-blue-600 bg-blue-50',
    'En cours': 'text-orange-600 bg-orange-50',
    'Critique': 'text-red-600 bg-red-50',
    'En attente': 'text-yellow-600 bg-yellow-50',
    'Résolu': 'text-green-600 bg-green-50',
    'Fermé': 'text-gray-600 bg-gray-50',
};

const priorityColors: Record<TicketPriority, string> = {
    'Faible': 'bg-green-100 text-green-800',
    'Moyen': 'bg-yellow-100 text-yellow-800',
    'Élevé': 'bg-orange-100 text-orange-800',
    'Critique': 'bg-red-100 text-red-800',
};

const TicketTable: React.FC<TicketTableProps> = ({ tickets }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Liste des tickets ({tickets.length})</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Ticket</th>
                            <th className="px-6 py-3">Client</th>
                            <th className="px-6 py-3">Motif</th>
                            <th className="px-6 py-3">Statut</th>
                            <th className="px-6 py-3">Gravité</th>
                            <th className="px-6 py-3">Canal</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Agent</th>
                            <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket) => (
                            <tr key={ticket.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{ticket.id}</td>
                                <td className="px-6 py-4">{ticket.client}</td>
                                <td className="px-6 py-4">{ticket.motif}</td>
                                <td className="px-6 py-4">
                                    <span className={cn("flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium w-fit", statusColors[ticket.status])}>
                                        {ticket.status === 'Nouveau' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                                        {ticket.status === 'En cours' && <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>}
                                        {ticket.status === 'Critique' && <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>}
                                        {ticket.status === 'En attente' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-600"></span>}
                                        {ticket.status === 'Résolu' && <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>}
                                        {ticket.status === 'Fermé' && <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>}
                                        {ticket.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn("px-2 py-1 rounded text-xs font-medium", priorityColors[ticket.priority])}>
                                        {ticket.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex items-center gap-2">
                                    {/* Icons could be dynamic based on channel */}
                                    {ticket.channel}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(ticket.date).toLocaleString('fr-FR')}
                                </td>
                                <td className="px-6 py-4">{ticket.agent}</td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => navigate(`/ticket/${ticket.id}`)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TicketTable;
