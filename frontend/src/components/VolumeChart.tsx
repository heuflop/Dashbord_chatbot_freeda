import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTickets } from '../context/TicketContext';

const VolumeChart = () => {
    const { filteredTickets, filters } = useTickets();

    const data = useMemo(() => {
        const groupedData: Record<string, number> = {};

        filteredTickets.forEach(ticket => {
            const date = new Date(ticket.date);
            let key = '';

            if (filters.day !== 'Tous') {
                // Show hours if day is selected
                key = `${date.getHours()}h`;
            } else if (filters.month !== 'Tous') {
                // Show days if month is selected
                key = date.getDate().toString();
            } else {
                // Show months if year is selected (or default)
                key = date.toLocaleString('fr-FR', { month: 'short' });
            }

            groupedData[key] = (groupedData[key] || 0) + 1;
        });

        // Sort keys logically
        let sortedKeys = Object.keys(groupedData);

        if (filters.day !== 'Tous') {
            // Sort hours numerically
            sortedKeys.sort((a, b) => parseInt(a) - parseInt(b));
        } else if (filters.month !== 'Tous') {
            // Sort days numerically
            sortedKeys.sort((a, b) => parseInt(a) - parseInt(b));
        } else {
            // Sort months (custom sort needed or rely on date object)
            const monthsOrder = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
            sortedKeys.sort((a, b) => monthsOrder.indexOf(a) - monthsOrder.indexOf(b));
        }

        return sortedKeys.map(name => ({ name, value: groupedData[name] }));
    }, [filteredTickets, filters]);

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-80">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Volume de ticket</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis
                        label={{ value: 'Nombre de ticket', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip cursor={{ fill: '#f3f4f6' }} />
                    <Bar dataKey="value" fill="#dc2626" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default VolumeChart;
