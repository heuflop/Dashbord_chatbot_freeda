import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface KPICardProps {
    title: string;
    value: number | string;
    icon?: LucideIcon;
    iconColor?: string;
    borderColor?: string; // For the left border or accent
    textColor?: string;
    className?: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon: Icon, iconColor, borderColor, textColor, className }) => {
    return (
        <div className={cn("bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between h-24 relative overflow-hidden", className)}>
            {borderColor && (
                <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: borderColor }}></div>
            )}
            <div className="flex justify-between items-start">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide ml-2">{title}</span>
                {Icon && <Icon size={20} className={cn("text-gray-400", iconColor)} />}
            </div>
            <div className={cn("text-3xl font-bold ml-2", textColor || "text-gray-900")}>
                {value}
            </div>
        </div>
    );
};

export default KPICard;
