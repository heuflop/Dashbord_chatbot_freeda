import React from 'react';
import { FileText, Clock, AlertTriangle, CheckCircle, XCircle, Activity } from 'lucide-react';
import KPICard from '../components/KPICard';
import VolumeChart from '../components/VolumeChart';
import DistributionChart from '../components/DistributionChart';
import TicketTable from '../components/TicketTable';
import Filters from '../components/Filters';
import { useTickets } from '../context/TicketContext';

const Dashboard = () => {
    const { kpis, filteredTickets } = useTickets();

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Tableau de bord - Service Clients</h2>
                    <p className="text-sm text-gray-500">Dernière mise à jour: {new Date().toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-right mr-2">
                        <div className="text-sm font-medium text-gray-900">Marie Dubois</div>
                        <div className="text-xs text-gray-500">Agent Support</div>
                    </div>
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                        MD
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Total tickets"
                    value={kpis.total}
                    icon={FileText}
                    className="border-l-4 border-l-gray-500"
                />
                <KPICard
                    title="Nouveaux"
                    value={kpis.new}
                    icon={Activity}
                    iconColor="text-blue-500"
                    className="border-l-4 border-l-blue-500"
                    textColor="text-blue-600"
                />
                <KPICard
                    title="En cours"
                    value={kpis.inProgress}
                    icon={Clock}
                    iconColor="text-orange-500"
                    className="border-l-4 border-l-orange-500"
                    textColor="text-orange-600"
                />
                <KPICard
                    title="Critiques"
                    value={kpis.critical}
                    icon={AlertTriangle}
                    iconColor="text-red-500"
                    className="border-l-4 border-l-red-500"
                    textColor="text-red-600"
                />
                <KPICard
                    title="En attente"
                    value={kpis.pending}
                    icon={Clock}
                    iconColor="text-yellow-500"
                    className="border-l-4 border-l-yellow-500"
                    textColor="text-yellow-600"
                />
                {/* KPI Fermé as requested */}
                <KPICard
                    title="Fermé"
                    value={kpis.closed}
                    icon={XCircle}
                    iconColor="text-red-600"
                    className="border-l-4 border-l-red-600"
                    textColor="text-red-600"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <VolumeChart />
                <DistributionChart />
            </div>

            {/* Filters & Search */}
            <Filters />

            {/* Ticket List */}
            <TicketTable tickets={filteredTickets} />
        </div>
    );
};

export default Dashboard;
