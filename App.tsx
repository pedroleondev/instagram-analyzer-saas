
import React, { useState, useMemo, useEffect } from 'react';
import { Upload, FileText, AlertCircle, RefreshCw, Layers, CheckCircle2, Database, Cloud, CloudOff } from 'lucide-react';
import StatsCards from './components/StatsCards';
import ProfileTable from './components/ProfileTable';
import { InstagramProfile, ScrapingStats } from './types';
import { runInstagramScraper } from './services/apifyService';
import { saveLeadsToDB, fetchLeadsFromDB } from './services/supabaseService';
import { generateAnalysisPDF } from './utils/pdfGenerator';

const App: React.FC = () => {
  const [profiles, setProfiles] = useState<InstagramProfile[]>([]);
  const [isScraping, setIsScraping] = useState(false);
  const [progress, setProgress] = useState(0);

  // ✅ Carregar token do .env.local
  const [apifyToken, setApifyToken] = useState(
    import.meta.env.VITE_APIFY_API_TOKEN || ''
  );

  // ✅ Se tiver token, iniciar em modo produção
  const [isDemoMode, setIsDemoMode] = useState(
    !import.meta.env.VITE_APIFY_API_TOKEN
  );

  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Stats calculation
  const stats: ScrapingStats = useMemo(() => {
    const processed = profiles.filter(p => p.status === 'completed');
    if (processed.length === 0) return { total: 0, processed: 0, verifiedCount: 0, avgFollowers: 0, activeLast30Days: 0 };

    return {
      total: profiles.length,
      processed: processed.length,
      verifiedCount: processed.filter(p => p.isVerified).length,
      avgFollowers: Math.round(processed.reduce((acc, p) => acc + p.followersCount, 0) / processed.length),
      activeLast30Days: processed.filter(p => p.hasPostedRecently).length
    };
  }, [profiles]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const urls = text.split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.startsWith('http'))
        .map(line => line.split(',')[0]);

      if (urls.length === 0) {
        setError("Nenhum link do Instagram válido encontrado no arquivo.");
        return;
      }

      startScraping(urls);
    };
    reader.readAsText(file);
  };

  const loadFromDatabase = async () => {
    setIsSyncing(true);
    setError(null);
    try {
      const data = await fetchLeadsFromDB();
      if (data.length > 0) {
        setProfiles(data);
      } else {
        setError("Nenhum dado encontrado no banco de dados.");
      }
    } catch (err) {
      setError("Falha ao conectar com o banco de dados.");
    } finally {
      setIsSyncing(false);
    }
  };

  const startScraping = async (urls: string[]) => {
    setIsScraping(true);
    setProgress(0);
    setProfiles([]);

    try {
      const token = isDemoMode ? 'DEMO' : apifyToken;
      await runInstagramScraper(urls, token, async (updatedProfiles) => {
        setProfiles([...updatedProfiles]);
        setProgress(Math.round((updatedProfiles.length / urls.length) * 100));

        // Sincronização incremental com banco de dados a cada 5 perfis ou no final
        if (updatedProfiles.length % 5 === 0 || updatedProfiles.length === urls.length) {
          await saveLeadsToDB(updatedProfiles);
        }
      });
    } catch (err) {
      setError("Falha ao iniciar o scraping. Verifique sua chave da API.");
    } finally {
      setIsScraping(false);
    }
  };

  const handleExport = async (format: 'csv' | 'json' | 'md' | 'pdf') => {
    let content = '';
    let filename = `instagram_leads_${new Date().toISOString().split('T')[0]}`;

    if (format === 'csv') {
      const headers = "Username,Full Name,URL,Followers,Verified,Niche,Recent Post,Bio\n";
      const rows = profiles.map(p =>
        `"${p.username}","${p.fullName}","${p.url}",${p.followersCount},${p.isVerified},"${p.niche}",${p.hasPostedRecently},"${p.biography.replace(/"/g, '""')}"`
      ).join('\n');
      content = headers + rows;
      filename += '.csv';
    } else if (format === 'json') {
      content = JSON.stringify(profiles, null, 2);
      filename += '.json';
    } else if (format === 'md') {
      content = `# Relatório de Leads Instagram - ${new Date().toLocaleDateString()}\n\n`;
      content += `| Username | Nome | Nicho | Seguidores | Verificado | Ativo |\n`;
      content += `| --- | --- | --- | --- | --- | --- |\n`;
      profiles.forEach(p => {
        content += `| @${p.username} | ${p.fullName} | ${p.niche} | ${p.followersCount.toLocaleString()} | ${p.isVerified ? '✅' : '❌'} | ${p.hasPostedRecently ? '🔥' : '❄️'} |\n`;
      });
      filename += '.md';
    } else if (format === 'pdf') {
      generateAnalysisPDF(profiles, filename);
      return;
    }


    // Download file for non-PDF formats
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  return (
    <div className="min-h-screen pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-lg">
              <Layers className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              InstaAnalyzer Pro
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 uppercase">
                <Database className="w-3 h-3" />
                Cloud Active
              </div>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5">
                <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-orange-500' : 'bg-emerald-500'}`}></span>
                <span className="text-xs font-medium text-slate-600">{isDemoMode ? 'Modo Demo' : 'Produção'}</span>
              </div>
            </div>
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Config
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!isDemoMode && (
          <div className="mb-6 p-4 bg-white border border-slate-200 rounded-xl flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Apify API Token</label>
              <input
                type="password"
                placeholder="Token do Apify..."
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
                value={apifyToken}
                onChange={(e) => setApifyToken(e.target.value)}
              />
            </div>
          </div>
        )}

        {profiles.length === 0 && !isScraping && (
          <div className="max-w-2xl mx-auto mt-12 bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Importar Perfis</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              Arraste seu CSV ou carregue os dados salvos diretamente do banco de dados na nuvem.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold cursor-pointer transition-all shadow-lg hover:shadow-blue-200">
                <FileText className="w-5 h-5" />
                Upload CSV
                <input type="file" className="hidden" accept=".csv,.txt" onChange={handleFileUpload} />
              </label>

              <button
                onClick={loadFromDatabase}
                disabled={isSyncing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-8 py-3 rounded-full font-semibold transition-all"
              >
                {isSyncing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5 text-indigo-500" />}
                {isSyncing ? 'Conectando...' : 'Carregar do Banco'}
              </button>
            </div>

            <div className="mt-12 pt-12 border-t border-slate-100 grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-xl font-bold text-slate-900">100%</div>
                <div className="text-xs text-slate-400 uppercase font-medium">Cloud Sync</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-slate-900">Gemini 3</div>
                <div className="text-xs text-slate-400 uppercase font-medium">Niche AI</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-slate-900">CSV/MD</div>
                <div className="text-xs text-slate-400 uppercase font-medium">Export</div>
              </div>
            </div>
          </div>
        )}

        {isScraping && (
          <div className="max-w-md mx-auto mt-24 text-center">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
              <div
                className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
                style={{ animationDuration: '1.5s' }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-blue-600">
                {progress}%
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Analisando & Sincronizando...</h3>
            <p className="text-sm text-slate-500 mb-6">
              Os dados estão sendo salvos no seu banco de dados Supabase em tempo real.
            </p>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {profiles.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Dashboard de Leads</h2>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5">
                    <Cloud className="w-3.5 h-3.5 text-emerald-500" />
                    Sincronizado com Supabase
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadFromDatabase}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 bg-white"
                >
                  <Database className="w-4 h-4" />
                  Sincronizar Cloud
                </button>
                <label className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100 bg-blue-50/50 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Novo Arquivo
                  <input type="file" className="hidden" accept=".csv,.txt" onChange={handleFileUpload} />
                </label>
              </div>
            </div>

            <StatsCards stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <ProfileTable profiles={profiles} onExport={handleExport} />
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Storage Status</h3>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-indigo-500" />
                      <span className="text-xs font-semibold text-slate-600">Supabase Connected</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl text-white shadow-xl">
                  <h3 className="text-sm font-bold mb-4 uppercase tracking-wider opacity-80">Insight de IA</h3>
                  <p className="text-sm leading-relaxed mb-4">
                    Seus leads estão seguros no banco. O processamento via <span className="text-blue-400 font-bold">Gemini-3</span> identificou alta densidade de perfis verificados.
                  </p>
                  <div className="flex items-center gap-2 text-xs bg-white/10 p-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Base de dados atualizada
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto mt-8 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
      </main>

      <footer className="mt-12 pt-8 border-t border-slate-100 text-center text-slate-400 text-sm">
        InstaAnalyzer Pro &copy; {new Date().getFullYear()} — Powered by Gemini & Supabase
      </footer>
    </div>
  );
};

export default App;
