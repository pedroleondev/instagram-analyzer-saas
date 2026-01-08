
import React, { useState } from 'react';
import { ExternalLink, Search, BadgeCheck, Filter, Download, Quote, Clock, Activity } from 'lucide-react';
import { InstagramProfile } from '../types';

interface ProfileTableProps {
  profiles: InstagramProfile[];
  onExport: (format: 'csv' | 'json' | 'md' | 'pdf') => void;
}

const ProfileTable: React.FC<ProfileTableProps> = ({ profiles, onExport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerified, setFilterVerified] = useState<boolean | null>(null);

  const calculateDaysSince = (dateString?: string) => {
    if (!dateString) return null;
    const lastDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getActivityBadge = (days: number | null) => {
    if (days === null) return { label: 'N/A', color: 'bg-slate-100 text-slate-400' };
    if (days <= 15) return { label: '15D', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    if (days <= 30) return { label: '30D', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    if (days <= 45) return { label: '45D', color: 'bg-amber-100 text-amber-700 border-amber-200' };
    if (days <= 60) return { label: '60D', color: 'bg-orange-100 text-orange-700 border-orange-200' };
    return { label: '+90D', color: 'bg-rose-100 text-rose-700 border-rose-200' };
  };

  const filteredProfiles = profiles.filter(p => {
    const matchesSearch = p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.niche.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVerified = filterVerified === null || p.isVerified === filterVerified;
    return matchesSearch && matchesVerified;
  });

  return (
    <div id="leads-card-container" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar leads..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
            <Filter className="w-4 h-4 text-slate-400 mr-2" />
            <select
              className="bg-transparent text-sm text-slate-600 focus:outline-none py-1"
              onChange={(e) => setFilterVerified(e.target.value === 'all' ? null : e.target.value === 'true')}
            >
              <option value="all">Todos</option>
              <option value="true">Verificados</option>
              <option value="false">Não Verificados</option>
            </select>
          </div>

          <div className="relative group">
            <select
              className="appearance-none bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 pl-10 pr-8 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  onExport(val as 'csv' | 'json' | 'md' | 'pdf');
                  e.target.value = '';
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>Exportar</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="md">Markdown</option>
              <option value="pdf">PDF</option>
            </select>
            <Download className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
          </div>
        </div>
      </div>

      <div id="leads-table-container" className="overflow-x-auto">
        <table id="leads-table" className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Perfil</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Nicho</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Seguidores</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Atividade</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase min-w-[250px]">Biografia do Instagram</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProfiles.map((profile) => {
              const days = calculateDaysSince(profile.lastPostDate);
              const badge = getActivityBadge(days);

              return (
                <tr key={profile.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900 flex items-center gap-1">
                        {profile.fullName}
                        {profile.isVerified && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                      </span>
                      <span className="text-sm text-slate-500">@{profile.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {profile.niche}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {profile.followersCount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded border text-[10px] font-bold w-12 ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {days !== null ? `${days} dias atrás` : 'Sem posts'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 group-hover:bg-white transition-colors max-w-md">
                      <Quote className="w-3 h-3 text-slate-300 mt-0.5 flex-shrink-0" />
                      <span
                        className="whitespace-pre-line line-clamp-4"
                        title={profile.biography}
                        style={{ wordBreak: 'break-word' }}
                      >
                        {profile.biography || "Sem biografia disponível"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-blue-600 transition-colors inline-block"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfileTable;
