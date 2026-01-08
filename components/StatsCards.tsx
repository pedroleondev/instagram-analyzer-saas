
import React from 'react';
import { Users, BadgeCheck, Calendar, BarChart3 } from 'lucide-react';
import { ScrapingStats } from '../types';

interface StatsCardsProps {
  stats: ScrapingStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: "Total Perfis",
      value: stats.total,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Verificados",
      value: stats.verifiedCount,
      icon: BadgeCheck,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      title: "Média Seguidores",
      value: stats.avgFollowers.toLocaleString(),
      icon: BarChart3,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      title: "Ativos (30d)",
      value: stats.activeLast30Days,
      icon: Calendar,
      color: "text-orange-600",
      bg: "bg-orange-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{card.title}</span>
            <div className={`${card.bg} p-2 rounded-lg`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{card.value}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
