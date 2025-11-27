import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Paperclip, Mic, FileText, Phone, CheckCircle, AlertTriangle, Star, User, MoreHorizontal, MessageSquare, Clock, HelpCircle, Search } from 'lucide-react';
import { useTickets, TicketStatus } from '../context/TicketContext';
import { cn } from '../lib/utils';

const TicketDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { tickets, refreshTickets } = useTickets();
    const ticket = tickets.find(t => t.id === id);

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        if (!ticket) return;

        try {
            const response = await fetch(`http://localhost:8000/tickets/${ticket.id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                await refreshTickets();
            } else {
                console.error('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const [reply, setReply] = useState('');

    if (!ticket) {
        return <div className="p-6">Ticket non trouvé</div>;
    }

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Retour
                    </button>
                    <div className="h-6 w-px bg-gray-300 mx-2"></div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            Ticket {ticket.id}
                            <span className="text-sm font-normal text-gray-500">Créé le {new Date(ticket.date).toLocaleString()}</span>
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        En ligne
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-medium text-gray-900">Marie Dubois</div>
                            <div className="text-xs text-gray-500">Agent Support</div>
                        </div>
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm border-2 border-white">
                            MD
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Info & Chat (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Ticket Info Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-semibold text-gray-900">Informations du ticket</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Client</p>
                                <p className="font-medium text-gray-900">{ticket.client}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Motif</p>
                                <p className="font-medium text-gray-900">{ticket.motif}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Canal</p>
                                <div className="flex items-center gap-2">
                                    <MessageSquare size={16} className="text-gray-400" />
                                    <p className="font-medium text-gray-900">{ticket.channel}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Agent assigné</p>
                                <p className="font-medium text-gray-900">{ticket.agent}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Statut du ticket</p>
                                <div className="relative inline-block">
                                    <select
                                        value={ticket.status}
                                        onChange={handleStatusChange}
                                        disabled={ticket.status === 'Fermé'}
                                        className={cn(
                                            "appearance-none pl-3 pr-8 py-1 rounded-full text-xs font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all",
                                            ticket.status === 'Résolu' ? "bg-green-50 text-green-700 border-green-200 focus:ring-green-500" :
                                                ticket.status === 'Nouveau' ? "bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-500" :
                                                    ticket.status === 'Critique' ? "bg-red-50 text-red-700 border-red-200 focus:ring-red-500" :
                                                        ticket.status === 'Fermé' ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed opacity-75" :
                                                            "bg-gray-50 text-gray-700 border-gray-200 focus:ring-gray-500"
                                        )}
                                    >
                                        <option value="Nouveau">Nouveau</option>
                                        <option value="En cours">En cours</option>
                                        <option value="En attente">En attente</option>
                                        <option value="Résolu">Résolu</option>
                                        <option value="Critique">Critique</option>
                                        <option value="Fermé">Fermé</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                                        {ticket.status === 'Résolu' ? <CheckCircle size={12} className={ticket.status === 'Fermé' ? "text-gray-400" : "text-green-700"} /> :
                                            ticket.status === 'Critique' ? <AlertTriangle size={12} className={ticket.status === 'Fermé' ? "text-gray-400" : "text-red-700"} /> :
                                                <div className={cn("h-0 w-0 border-x-4 border-x-transparent border-t-4", ticket.status === 'Fermé' ? "border-t-gray-400" : "border-t-gray-600")}></div>}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Contact</p>
                                <p className="font-medium text-gray-900">sophie.martin@email.com</p>
                                <p className="text-sm text-gray-500">06 12 34 56 78</p>
                            </div>
                        </div>
                    </div>

                    {/* AI Summary Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                Synthèse IA
                            </h3>
                            <span className="text-xs text-gray-400">Généré automatiquement</span>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-500 uppercase">Motif détecté</p>
                                <p className="font-medium text-gray-900">{ticket.motif}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-500 uppercase">Sentiment</p>
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "w-2 h-2 rounded-full",
                                        ticket.sentiment === 'Positif' ? "bg-green-500" :
                                            ticket.sentiment === 'Négatif' ? "bg-red-500" : "bg-orange-400"
                                    )}></span>
                                    <p className="font-medium text-gray-900">{ticket.sentiment || 'Non analysé'}</p>
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-1">
                                <p className="text-xs font-medium text-gray-500 uppercase">Recommandation</p>
                                <p className="font-medium text-gray-900 bg-blue-50 p-3 rounded-md border border-blue-100 text-blue-800">
                                    {ticket.recommandation || "Aucune recommandation disponible."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Chat History */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-semibold text-gray-900">Historique des échanges</h3>
                        </div>

                        <div className="p-6 space-y-6 bg-gray-50/30 min-h-[300px] max-h-[600px] overflow-y-auto">
                            {ticket.messages && ticket.messages.length > 0 ? (
                                ticket.messages.map((message, index) => {
                                    const isUser = message.role === 'user';
                                    const isClient = message.role === 'user' || message.author?.toLowerCase().includes('client');

                                    return (
                                        <div key={index} className={`flex gap-4 ${isClient ? '' : 'flex-row-reverse'}`}>
                                            <div className="flex-shrink-0">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-sm ${isClient
                                                        ? 'bg-gray-200 text-gray-600'
                                                        : 'bg-red-600 text-white'
                                                    }`}>
                                                    {isClient
                                                        ? ticket.client.substring(0, 2).toUpperCase()
                                                        : 'IA'
                                                    }
                                                </div>
                                            </div>
                                            <div className={`flex flex-col ${isClient ? '' : 'items-end'} max-w-[85%]`}>
                                                <div className="flex items-baseline gap-2 mb-1">
                                                    {!isClient && (
                                                        <span className="text-xs text-gray-400">
                                                            {message.timestamp ? new Date(message.timestamp).toLocaleString() : ''}
                                                        </span>
                                                    )}
                                                    <span className="font-semibold text-gray-900 text-sm">
                                                        {message.author || (isClient ? ticket.client : 'Assistant IA')}
                                                    </span>
                                                    {isClient && (
                                                        <span className="text-xs text-gray-400">
                                                            {message.timestamp ? new Date(message.timestamp).toLocaleString() : ''}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${isClient
                                                        ? 'bg-white border border-gray-100 text-gray-700 rounded-tl-none'
                                                        : 'bg-gray-900 text-white rounded-tr-none'
                                                    }`}>
                                                    {message.content}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    Aucun message dans la conversation
                                </div>
                            )}
                        </div>

                        {/* Reply Area */}
                        <div className="p-6 border-t border-gray-200 bg-white">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Répondre au client</label>
                                <div className="relative">
                                    <select className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm">
                                        <option>Choisir un script rapide...</option>
                                        <option>Demande de précisions</option>
                                        <option>Confirmation de résolution</option>
                                        <option>Escalade technique</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-4 text-sm min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Tapez votre réponse ici..."
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                />
                                <div className="absolute bottom-3 left-3 flex gap-2">
                                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors" title="Joindre un fichier">
                                        <Paperclip size={18} />
                                    </button>
                                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors" title="Message vocal">
                                        <Mic size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                                <button className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all shadow-sm">
                                    <Send size={16} />
                                    Envoyer la réponse
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar (1/3 width) */}
                <div className="space-y-6">

                    {/* Actions Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-semibold text-gray-900">Actions</h3>
                        </div>
                        <div className="p-4 space-y-3">
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all bg-white shadow-sm">
                                <Send size={16} className="text-gray-500" /> Répondre
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all bg-white shadow-sm">
                                <FileText size={16} className="text-gray-500" /> Envoyer documentation
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all bg-white shadow-sm">
                                <Phone size={16} className="text-gray-500" /> Basculer en appel
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all bg-white shadow-sm">
                                <CheckCircle size={16} className="text-gray-500" /> Clôturer ticket
                            </button>
                            <div className="pt-2">
                                <button className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all shadow-sm">
                                    <AlertTriangle size={16} /> Escalader au superviseur
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Documents Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-semibold text-gray-900">Documents</h3>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                                <div className="p-2 bg-red-50 rounded text-red-600 group-hover:bg-red-100 transition-colors">
                                    <FileText size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-gray-900 truncate">Procédure_connexion.pdf</p>
                                    <p className="text-xs text-gray-500">PDF • 1.2 MB</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                                <div className="p-2 bg-red-50 rounded text-red-600 group-hover:bg-red-100 transition-colors">
                                    <FileText size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-gray-900 truncate">FAQ_technique.pdf</p>
                                    <p className="text-xs text-gray-500">PDF • 850 KB</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                                <div className="p-2 bg-blue-50 rounded text-blue-600 group-hover:bg-blue-100 transition-colors">
                                    <FileText size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-gray-900 truncate">Guide_dépannage.docx</p>
                                    <p className="text-xs text-gray-500">Word • 450 KB</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Help Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-semibold text-gray-900">Aide rapide</h3>
                        </div>
                        <div className="p-4 space-y-1">
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-left">
                                <HelpCircle size={16} /> FAQ Agent
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-left">
                                <Clock size={16} /> Historique similaire
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-left">
                                <Phone size={16} /> Guide procédures
                            </button>
                        </div>
                    </div>

                    {/* Satisfaction Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-semibold text-gray-900">Satisfaction client</h3>
                        </div>
                        <div className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-1 text-yellow-400">
                                <Star fill="currentColor" size={20} />
                                <Star fill="currentColor" size={20} />
                                <Star fill="currentColor" size={20} />
                                <Star fill="currentColor" size={20} />
                                <Star fill="currentColor" size={20} />
                            </div>
                            <span className="text-lg font-bold text-gray-900">5/5</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TicketDetail;
