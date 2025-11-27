import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useTickets } from '../context/TicketContext';

const COLORS = ['#dc2626', '#0f172a', '#64748b', '#8b5cf6', '#e2e8f0']; // Red, Black/Dark, Grey, Purple, Light Grey

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, fill }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + (outerRadius + 30) * Math.cos(-midAngle * RADIAN);
    const y = cy + (outerRadius + 30) * Math.sin(-midAngle * RADIAN);

    // Calculate line coordinates
    const sin = Math.sin(-midAngle * RADIAN);
    const cos = Math.cos(-midAngle * RADIAN);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill={fill} dominantBaseline="central" fontSize="12" fontWeight="500">
                {`${name} ${(percent * 100).toFixed(0)}%`}
            </text>
        </g>
    );
};

const DistributionChart = () => {
    const { filteredTickets } = useTickets();

    const data = useMemo(() => {
        const groupedData: Record<string, number> = {};

        filteredTickets.forEach(ticket => {
            // Use category for general grouping, fallback to 'Autre' if missing
            const key = ticket.category || "Autre";
            groupedData[key] = (groupedData[key] || 0) + 1;
        });

        return Object.entries(groupedData)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [filteredTickets]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-80">
            <h3 className="text-base font-bold text-gray-900 mb-2">Répartition par catégorie</h3>
            <p className="text-xs text-gray-500 mb-6">Distribution des types de demandes</p>
            <div className="w-full h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="white" strokeWidth={2} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DistributionChart;
