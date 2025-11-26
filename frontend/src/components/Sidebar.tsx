import React from 'react';
import { LayoutDashboard, PlusCircle, Search, PhoneIncoming, Bell, Settings, HelpCircle, User } from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import { cn } from '../lib/utils';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const { kpis } = useTickets();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-10">
            <div className="p-6">
                <h1 className="text-xl font-bold text-gray-900">Support Client</h1>
                <p className="text-xs text-gray-500">Marie Dubois - Agent</p>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <div className="px-4 mb-6">
                    <Link
                        to="/"
                        className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                            isActive('/') ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
                        )}
                    >
                        <LayoutDashboard size={18} />
                        Tableaux de bord
                    </Link>
                </div>

                <div className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Actions rapides
                </div>
                <div className="px-4 mb-6 space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <PlusCircle size={18} />
                        Nouveau ticket
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <Search size={18} />
                        Recherche rapide
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <PhoneIncoming size={18} />
                        Callbot entrant
                    </button>
                </div>

                <div className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Vue d'ensemble
                </div>
                <div className="px-4 mb-6 space-y-1">
                    <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700">
                        <span>Nouveaux</span>
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">{kpis.new}</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700">
                        <span>En cours</span>
                        <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-0.5 rounded-full">{kpis.inProgress}</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700">
                        <span>Critiques</span>
                        <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-0.5 rounded-full">{kpis.critical}</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700">
                        <span>En attente</span>
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded-full">{kpis.pending}</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700">
                        <span>Fermé</span>
                        <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2 py-0.5 rounded-full">{kpis.closed}</span>
                    </div>
                </div>

                <div className="px-4 mb-6">
                    <button className="w-full flex items-center justify-between px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                            <Bell size={18} />
                            Notifications
                        </div>
                        <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">3</span>
                    </button>
                    <div className="mt-2 pl-11 space-y-2">
                        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">Nouveau ticket critique assigné</div>
                        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">Rappel: Ticket T-2024-003 en attente</div>
                        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">Objectif journalier atteint à 85%</div>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-gray-200 space-y-1">
                <div className="flex items-center gap-2 px-4 py-2 text-sm text-green-600 font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    En ligne
                    <span className="ml-auto text-gray-400 text-xs">0h23m</span>
                </div>
                <button className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                    <Settings size={18} />
                    Paramètres
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                    <HelpCircle size={18} />
                    Aide
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
