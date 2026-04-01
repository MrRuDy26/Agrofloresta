import React, { useState, useEffect } from 'react';
import { 
  Leaf, Sprout, Loader2, TreeDeciduous, Carrot, LogOut, LogIn, RefreshCw, BookOpen, Layout, History, Trash2, Calendar, Wheat, Pill, Search
} from 'lucide-react';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './services/supabase';

// BANCO DE DADOS INTEGRADO COM A SUA TABELA
const PLANTS_LIBRARY = [
  { name: 'Abre-caminho', stratum: 'MEDICINAL', family: 'Acanthaceae', origin: 'Brasil', function: 'Uso Ritual/Medicinal' },
  { name: 'Açafrão (Cúrcuma)', stratum: 'BAIXO', family: 'Zingiberaceae', origin: 'Ásia', function: 'Anti-inflamatório/PANC' },
  { name: 'Alecrim', stratum: 'MEDICINAL', family: 'Lamiaceae', origin: 'Mediterrâneo', function: 'Estimulante/Tempero' },
  { name: 'Alfavaca', stratum: 'HORTALIÇA', family: 'Lamiaceae', origin: 'Mediterrâneo', function: 'Tempero/Antisséptico' },
  { name: 'Anador (Chambá)', stratum: 'MEDICINAL', family: 'Acanthaceae', origin: 'América Tropical', function: 'Broncodilatador' },
  { name: 'Aranto', stratum: 'MEDICINAL', family: 'Crassulaceae', origin: 'Madagascar', function: 'Uso Tópico/Estudos' },
  { name: 'Arnica Brasileira', stratum: 'MEDICINAL', family: 'Asteraceae', origin: 'América do Sul', function: 'Cicatrizante/Contusões' },
  { name: 'Arruda', stratum: 'MEDICINAL', family: 'Rutaceae', origin: 'Europa', function: 'Repelente/Ritual' },
  { name: 'Babosa (Aloe vera)', stratum: 'BAIXO', family: 'Asphodelaceae', origin: 'África', function: 'Dermatológica/Cicatrizante' },
  { name: 'Bálsamo', stratum: 'MEDICINAL', family: 'Crassulaceae', origin: 'México', function: 'Digestivo/Inflamações' },
  { name: 'Boldo Brasileiro', stratum: 'MEDICINAL', family: 'Lamiaceae', origin: 'Paleotropical', function: 'Fígado/Digestão' },
  { name: 'Calêndula', stratum: 'HORTALIÇA', family: 'Asteraceae', origin: 'Europa', function: 'Pele/Anti-inflamatório' },
  { name: 'Camomila', stratum: 'HORTALIÇA', family: 'Asteraceae', origin: 'Europa', function: 'Calmante/Sedativo' },
  { name: 'Capim-Limão', stratum: 'MEDICINAL', family: 'Poaceae', origin: 'Sudoeste Asiático', function: 'Calmante/Chá' },
  { name: 'Carqueja', stratum: 'MEDICINAL', family: 'Asteraceae', origin: 'América do Sul', function: 'Tônico Estomacal' },
  { name: 'Citronela', stratum: 'MEDICINAL', family: 'Poaceae', origin: 'Ásia Tropical', function: 'Repelente Natural' },
  { name: 'Erva-Cidreira', stratum: 'MEDICINAL', family: 'Lamiaceae', origin: 'Mediterrâneo', function: 'Calmante/Antiespasmódico' },
  { name: 'Funcho (Erva-doce)', stratum: 'HORTALIÇA', family: 'Apiaceae', origin: 'Mediterrâneo', function: 'Digestivo/Gases' },
  { name: 'Gengibre', stratum: 'BAIXO', family: 'Zingiberaceae', origin: 'Ásia', function: 'Termogênico/Náuseas' },
  { name: 'Guaco', stratum: 'MEDICINAL', family: 'Asteraceae', origin: 'América do Sul', function: 'Expectorante' },
  { name: 'Hortelã-Pimenta', stratum: 'HORTALIÇA', family: 'Lamiaceae', origin: 'Mediterrâneo', function: 'Digestivo/Refrescante' },
  { name: 'Losna', stratum: 'MEDICINAL', family: 'Asteraceae', origin: 'Europa', function: 'Vermífugo/Tônico' },
  { name: 'Manjericão', stratum: 'HORTALIÇA', family: 'Lamiaceae', origin: 'Mediterrâneo', function: 'Culinário/Repelente' },
  { name: 'Mil-folhas (Novalgina)', stratum: 'MEDICINAL', family: 'Asteraceae', origin: 'Europa/Ásia', function: 'Analgésico/Febre' },
  { name: 'Orégano', stratum: 'HORTALIÇA', family: 'Lamiaceae', origin: 'Europa', function: 'Antioxidante/Tempero' },
  { name: 'Poejo', stratum: 'MEDICINAL', family: 'Lamiaceae', origin: 'Europa/Ásia', function: 'Resfriados/Digestivo' },
  { name: 'Quebra-pedra', stratum: 'MEDICINAL', family: 'Phyllanthaceae', origin: 'Tropical', function: 'Cálculos Renais' },
  { name: 'Sálvia', stratum: 'MEDICINAL', family: 'Lamiaceae', origin: 'Mediterrâneo', function: 'Memória/Garganta' },
  { name: 'Tanchagem', stratum: 'MEDICINAL', family: 'Plantaginaceae', origin: 'Europa', function: 'Antibiótico Natural' },
  // ESTRATOS ARBÓREOS (SINTROPIA BASE)
  { name: 'Eucalipto', stratum: 'EMERGENTE', family: 'Myrtaceae', origin: 'Austrália', function: 'Biomassa' },
  { name: 'Mogno Africano', stratum: 'EMERGENTE', family: 'Meliaceae', origin: 'África', function: 'Madeira' },
  { name: 'Bananeira', stratum: 'ALTO', family: 'Musaceae', origin: 'Sudeste Asiático', function: 'Água' },
  { name: 'Ingá', stratum: 'ALTO', family: 'Fabaceae', origin: 'América do Sul', function: 'Nitrogênio' },
  { name: 'Café', stratum: 'MEDIO', family: 'Rubiaceae', origin: 'África', function: 'Sombra' },
];

function AppContent() {
  const [activeTab, setActiveTab] = useState<'app' | 'library' | 'history'>('app');
  const [searchTerm, setSearchTerm] = useState('');
  const [step, setStep] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [area, setArea] = useState('');
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  
  const { user, signOut, loading: authLoading } = useAuth();

  useEffect(() => { if (activeTab === 'history' && user) fetchHistory(); }, [activeTab, user]);

  const fetchHistory = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('projetos').select('*').order('created_at', { ascending: false });
    if (!error) setHistory(data || []);
    setLoading(false);
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from('projetos').delete().eq('id', id);
    if (!error) setHistory(history.filter(p => p.id !== id));
  };

  const handleGoogleLogin = async () => {
    const redirectUrl = window.location.origin;
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectUrl } });
  };

  const gerarPlano = async () => {
    setLoading(true);
    setResult(null);
    const sortear = (stratum: string) => {
      const lista = PLANTS_LIBRARY.filter(p => p.stratum === stratum);
      return lista[Math.floor(Math.random() * lista.length)].name;
    };
    const novoPlano = {
      emergente: sortear('EMERGENTE'), alto: sortear('ALTO'), medio: sortear('MEDIO'),
      baixo: sortear('BAIXO'), hortalica: sortear('HORTALIÇA'), medicinal: sortear('MEDICINAL')
    };
    if (user) await supabase.from('projetos').insert([{ user_id: user.id, area, ...novoPlano }]);
    setTimeout(() => { setResult(novoPlano); setLoading(false); setStep('results'); }, 1000);
  };

  const filteredLibrary = PLANTS_LIBRARY.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.family.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-stone-50"><Loader2 className="animate-spin text-green-600 w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-20">
      <nav className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-50 px-6 shadow-sm">
        <div className="flex items-center font-bold text-xl text-green-800 tracking-tighter cursor-pointer" onClick={() => {setStep('hero'); setActiveTab('app');}}>
          <Leaf className="mr-2 text-green-600" /> SINTROPLAN
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => setActiveTab('app')} className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'app' ? 'text-green-600' : 'text-stone-400'}`}>Gerador</button>
            <button onClick={() => setActiveTab('library')} className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'library' ? 'text-green-600' : 'text-stone-400'}`}>Biblioteca</button>
            {user && <button onClick={() => setActiveTab('history')} className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'history' ? 'text-green-600' : 'text-stone-400'}`}>Meus Planos</button>}
          </div>
          {user ? (
            <button onClick={() => signOut()} className="text-stone-400 hover:text-red-600 transition-colors"><LogOut className="w-5 h-5" /></button>
          ) : (
            <button onClick={handleGoogleLogin} className="text-[10px] font-black bg-green-600 text-white px-4 py-2 rounded-xl">ENTRAR</button>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {activeTab === 'library' && (
          <div className="py-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Catálogo Botânico</h2>
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Buscar por nome ou família..." 
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-stone-100 rounded-2xl outline-none focus:border-green-500 font-bold text-sm shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLibrary.map((p, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[2rem] border-2 border-stone-50 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[8px] font-black px-3 py-1 bg-green-50 text-green-700 rounded-full uppercase">{p.stratum}</span>
                    <span className="text-[8px] font-black text-stone-300 uppercase tracking-widest">{p.family}</span>
                  </div>
                  <h4 className="text-xl font-black text-stone-800 mb-1">{p.name}</h4>
                  <p className="text-[10px] text-stone-400 font-bold uppercase mb-4 tracking-tighter">Origem: {p.origin}</p>
                  <div className="pt-4 border-t border-stone-50">
                    <p className="text-xs font-bold text-green-600 uppercase tracking-widest">{p.function}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'app' && (
          <main>
            {step === 'hero' && (
              <div className="py-32 text-center bg-stone-900 text-white rounded-[4rem] shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')] opacity-10" />
                <h1 className="text-6xl font-black mb-6 uppercase tracking-tighter relative">SintroPlan</h1>
                <p className="text-green-400 mb-10 uppercase text-xs font-bold tracking-[0.3em] relative">O cérebro da sua agrofloresta</p>
                <button onClick={() => setStep('form')} className="px-12 py-6 bg-green-600 rounded-full font-black text-xl hover:bg-green-500 transition-all shadow-xl relative">GERAR DESIGN</button>
              </div>
            )}

            {step === 'form' && (
              <div className="py-12 max-w-xl mx-auto">
                <div className="bg-white rounded-[3rem] shadow-2xl p-12 border border-stone-100 text-center">
                  <h2 className="text-2xl font-black mb-8 uppercase">Qual a área de plantio?</h2>
                  <div className="relative mb-10">
                    <input type="number" className="w-full p-8 bg-stone-50 border-2 border-stone-50 rounded-[2rem] text-center text-4xl font-black outline-none focus:border-green-500 transition-all" placeholder="0" value={area} onChange={(e) => setArea(e.target.value)} />
                    <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-stone-300">m²</span>
                  </div>
                  <button onClick={gerarPlano} disabled={loading || !area} className="w-full py-6 bg-green-700 text-white font-black rounded-[2rem] shadow-xl hover:bg-green-800 transition-all uppercase tracking-widest">
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Criar Sucessão'}
                  </button>
                </div>
              </div>
            )}

            {step === 'results' && result && (
              <div className="py-12">
                <div className="text-center mb-12">
                  <h3 className="text-4xl font-black uppercase tracking-tighter text-stone-800">Design de Consórcio</h3>
                  <p className="text-stone-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">Equilíbrio de estratos para {area}m²</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { l: 'Emergente', v: result.emergente, i: <TreeDeciduous />, c: 'bg-emerald-50' },
                    { l: 'Alto', v: result.alto, i: <TreeDeciduous />, c: 'bg-green-50' },
                    { l: 'Médio', v: result.medio, i: <Sprout />, c: 'bg-lime-50' },
                    { l: 'Baixo', v: result.baixo, i: <Carrot />, c: 'bg-amber-50' },
                    { l: 'Hortaliça', v: result.hortalica, i: <Wheat />, c: 'bg-orange-50' },
                    { l: 'Medicinal', v: result.medicinal, i: <Pill />, c: 'bg-purple-50' }
                  ].map((s, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[3rem] border-2 border-stone-50 shadow-sm flex items-center gap-6 group hover:border-green-200 transition-all">
                      <div className={`${s.c} p-4 rounded-[1.5rem] text-green-600 transition-transform group-hover:scale-110`}>{s.i}</div>
                      <div>
                        <p className="text-[10px] uppercase font-black text-stone-300 tracking-widest mb-1">{s.l}</p>
                        <p className="font-black text-xl text-stone-800 leading-tight">{s.v}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setStep('form')} className="mt-12 block mx-auto px-10 py-5 bg-stone-900 text-white font-black rounded-[2rem] hover:bg-stone-800 transition-all uppercase text-xs tracking-widest">Reiniciar</button>
              </div>
            )}
          </main>
        )}

        {activeTab === 'history' && (
          <div className="py-8">
            <h2 className="text-3xl font-black uppercase text-center mb-10 tracking-tighter">Meus Projetos Salvos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {history.map((proj) => (
                <div key={proj.id} className="bg-white p-8 rounded-[3rem] border-2 border-stone-100 shadow-sm relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[10px] font-black text-stone-300 uppercase block mb-1">{new Date(proj.created_at).toLocaleDateString()}</span>
                      <h4 className="text-2xl font-black text-stone-800 uppercase tracking-tighter">{proj.area} m²</h4>
                    </div>
                    <button onClick={() => deleteProject(proj.id)} className="p-3 text-stone-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"><Trash2 className="w-5 h-5" /></button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['emergente', 'alto', 'medio', 'baixo', 'hortalica', 'medicinal'].map((key) => (
                      <div key={key} className="bg-stone-50 p-2 rounded-xl text-[8px] font-black uppercase truncate text-stone-500 border border-stone-100">{proj[key]}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
