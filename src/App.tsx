import React, { useState, useEffect } from 'react';
import { 
  Leaf, Sprout, Loader2, TreeDeciduous, Carrot, LogOut, LogIn, RefreshCw, BookOpen, Layout, History, Trash2, Calendar, Wheat, Pill
} from 'lucide-react';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './services/supabase';

const PLANTS_LIBRARY = [
  // EMERGENTES
  { name: 'Eucalipto', stratum: 'EMERGENTE', function: 'Biomassa e Madeira' },
  { name: 'Mogno Africano', stratum: 'EMERGENTE', function: 'Madeira Nobre' },
  { name: 'Ipê Amarelo', stratum: 'EMERGENTE', function: 'Nativa e Melífera' },
  { name: 'Cedro Rosa', stratum: 'EMERGENTE', function: 'Nativa Nobre' },
  { name: 'Angico', stratum: 'EMERGENTE', function: 'Fixação de Nitrogênio' },
  
  // ALTO
  { name: 'Bananeira Prata', stratum: 'ALTO', function: 'Ciclagem de Água' },
  { name: 'Abacateiro', stratum: 'ALTO', function: 'Fruta e Gordura' },
  { name: 'Mangueira', stratum: 'ALTO', function: 'Fruta e Sombra' },
  { name: 'Jatobá', stratum: 'ALTO', function: 'Nativa e Alimento' },
  { name: 'Ingá', stratum: 'ALTO', function: 'Nitrogênio e Poda' },

  // MÉDIO
  { name: 'Café', stratum: 'MEDIO', function: 'Comercial e Sombra' },
  { name: 'Cacau', stratum: 'MEDIO', function: 'Comercial e Sombra' },
  { name: 'Limão Taiti', stratum: 'MEDIO', function: 'Fruta Cítrica' },
  { name: 'Mandioca', stratum: 'MEDIO', function: 'Energia e Acúmulo' },
  { name: 'Acerola', stratum: 'MEDIO', function: 'Vitamina C' },

  // BAIXO
  { name: 'Abacaxi', stratum: 'BAIXO', function: 'Fruta Ciclo Curto' },
  { name: 'Feijão de Porco', stratum: 'BAIXO', function: 'Adubação Verde' },
  { name: 'Batata Doce', stratum: 'BAIXO', function: 'Cobertura de Solo' },
  { name: 'Inhame', stratum: 'BAIXO', function: 'Alimento Base' },

  // HORTALIÇAS
  { name: 'Alface', stratum: 'HORTALIÇA', function: 'Ciclo 45 dias' },
  { name: 'Rabanete', stratum: 'HORTALIÇA', function: 'Ciclo 25 dias' },
  { name: 'Couve', stratum: 'HORTALIÇA', function: 'Folhosa Perene' },
  { name: 'Tomate', stratum: 'HORTALIÇA', function: 'Fruto Exigente' },
  { name: 'Abóbora', stratum: 'HORTALIÇA', function: 'Cobre Solo Rápido' },

  // MEDICINAIS (NOVA!)
  { name: 'Guaco', stratum: 'MEDICINAL', function: 'Expectorante/Xarope' },
  { name: 'Espinheira Santa', stratum: 'MEDICINAL', function: 'Estomacal/Digestivo' },
  { name: 'Babosa (Aloe)', stratum: 'MEDICINAL', function: 'Pele e Cabelo' },
  { name: 'Boldo', stratum: 'MEDICINAL', function: 'Fígado/Digestão' },
  { name: 'Capim Limão', stratum: 'MEDICINAL', function: 'Calmante/Chá' },
  { name: 'Arnica', stratum: 'MEDICINAL', function: 'Anti-inflamatório' },
  { name: 'Poejo', stratum: 'MEDICINAL', function: 'Resfriados' },
  { name: 'Mentruz', stratum: 'MEDICINAL', function: 'Fortificante' },
];

function AppContent() {
  const [activeTab, setActiveTab] = useState<'app' | 'library' | 'history'>('app');
  const [step, setStep] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [area, setArea] = useState('');
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  
  const { user, signOut, loading: authLoading } = useAuth();

  useEffect(() => {
    if (activeTab === 'history' && user) fetchHistory();
  }, [activeTab, user]);

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
      emergente: sortear('EMERGENTE'),
      alto: sortear('ALTO'),
      medio: sortear('MEDIO'),
      baixo: sortear('BAIXO'),
      hortalica: sortear('HORTALIÇA'),
      medicinal: sortear('MEDICINAL')
    };

    if (user) {
      await supabase.from('projetos').insert([{ user_id: user.id, area, ...novoPlano }]);
    }

    setTimeout(() => {
      setResult(novoPlano);
      setLoading(false);
      setStep('results');
    }, 1200);
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-stone-50"><Loader2 className="animate-spin text-green-600 w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-20">
      <nav className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-50 px-6 shadow-sm">
        <div className="flex items-center font-bold text-xl text-green-800 tracking-tighter cursor-pointer" onClick={() => {setStep('hero'); setActiveTab('app');}}>
          <Leaf className="mr-2 text-green-600" /> SINTROPLAN
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => setActiveTab('app')} className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'app' ? 'text-green-600' : 'text-stone-400'}`}>Gerador</button>
            <button onClick={() => setActiveTab('library')} className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'library' ? 'text-green-600' : 'text-stone-400'}`}>Biblioteca</button>
            {user && <button onClick={() => setActiveTab('history')} className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'history' ? 'text-green-600' : 'text-stone-400'}`}>Meus Planos</button>}
          </div>
          {user ? (
            <button onClick={() => signOut()} className="text-stone-400 hover:text-red-600"><LogOut className="w-5 h-5" /></button>
          ) : (
            <button onClick={handleGoogleLogin} className="text-[10px] font-black bg-green-600 text-white px-4 py-2 rounded-xl">ENTRAR</button>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {activeTab === 'library' && (
          <div className="py-8">
            <h2 className="text-3xl font-black uppercase text-center mb-10 tracking-tighter">Biblioteca Sintrópica</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PLANTS_LIBRARY.map((p, idx) => (
                <div key={idx} className="bg-white p-5 rounded-3xl border-2 border-stone-50">
                  <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase mb-2 inline-block ${
                    p.stratum === 'MEDICINAL' ? 'bg-purple-100 text-purple-600' : 
                    p.stratum === 'HORTALIÇA' ? 'bg-orange-100 text-orange-600' : 'bg-stone-100'
                  }`}>{p.stratum}</span>
                  <h4 className="font-black text-stone-800">{p.name}</h4>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest leading-tight">{p.function}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'app' && (
          <main>
            {step === 'hero' && (
              <div className="py-32 text-center bg-stone-900 text-white rounded-[3rem] overflow-hidden">
                <h1 className="text-5xl font-black mb-6 uppercase tracking-tighter">Sua Floresta Inteligente</h1>
                <p className="text-stone-400 mb-8 uppercase text-xs font-bold tracking-widest">Hortaliças, Frutas, Madeiras e Medicinais</p>
                <button onClick={() => setStep('form')} className="px-12 py-6 bg-green-600 rounded-full font-black text-xl shadow-xl">COMEÇAR</button>
              </div>
            )}

            {step === 'form' && (
              <div className="py-12 max-w-xl mx-auto">
                <div className="bg-white rounded-[3rem] shadow-2xl p-10 border border-stone-100 text-center">
                  <h2 className="text-2xl font-black mb-10 uppercase tracking-tight">Qual o tamanho da área?</h2>
                  <input type="number" className="w-full p-6 bg-stone-50 border-2 border-stone-50 rounded-3xl text-center text-2xl font-black mb-6 outline-none focus:border-green-500" placeholder="m²" value={area} onChange={(e) => setArea(e.target.value)} />
                  <button onClick={gerarPlano} disabled={loading || !area} className="w-full py-6 bg-green-700 text-white font-black rounded-3xl shadow-xl">
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : 'GERAR PLANO COMPLETO'}
                  </button>
                </div>
              </div>
            )}

            {step === 'results' && result && (
              <div className="py-12">
                <h3 className="text-4xl font-black uppercase mb-10 text-center tracking-tighter">Design Sugerido</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {[
                    { l: 'Emergente', v: result.emergente, i: <TreeDeciduous />, c: 'bg-emerald-50' },
                    { l: 'Alto', v: result.alto, i: <TreeDeciduous />, c: 'bg-green-50' },
                    { l: 'Médio', v: result.medio, i: <Sprout />, c: 'bg-lime-50' },
                    { l: 'Baixo', v: result.baixo, i: <Carrot />, c: 'bg-amber-50' },
                    { l: 'Hortaliça', v: result.hortalica, i: <Wheat />, c: 'bg-orange-50' },
                    { l: 'Medicinal', v: result.medicinal, i: <Pill />, c: 'bg-purple-50' }
                  ].map((s, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[2.5rem] border-2 border-stone-50 shadow-sm flex items-center gap-6">
                      <div className={`${s.c} p-4 rounded-2xl text-green-600`}>{s.i}</div>
                      <div>
                        <p className="text-[10px] uppercase font-black text-stone-300 tracking-widest">{s.l}</p>
                        <p className="font-black text-xl text-stone-800 tracking-tight leading-tight">{s.v}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setStep('form')} className="block mx-auto px-10 py-5 bg-stone-900 text-white font-black rounded-2xl hover:scale-105 transition-all">NOVO PLANO</button>
              </div>
            )}
          </main>
        )}

        {activeTab === 'history' && (
          <div className="py-8">
            <h2 className="text-3xl font-black uppercase text-center mb-10">Meus Planos Salvos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {history.map((proj) => (
                <div key={proj.id} className="bg-white p-8 rounded-[2.5rem] border-2 border-stone-100 shadow-sm relative group">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">{new Date(proj.created_at).toLocaleDateString()} - {proj.area}m²</span>
                    <button onClick={() => deleteProject(proj.id)} className="text-stone-200 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-stone-50 p-2 rounded-xl text-[9px] font-black uppercase truncate">E: {proj.emergente}</div>
                    <div className="bg-stone-50 p-2 rounded-xl text-[9px] font-black uppercase truncate">A: {proj.alto}</div>
                    <div className="bg-stone-50 p-2 rounded-xl text-[9px] font-black uppercase truncate">M: {proj.medio}</div>
                    <div className="bg-stone-50 p-2 rounded-xl text-[9px] font-black uppercase truncate">B: {proj.baixo}</div>
                    <div className="bg-orange-50 p-2 rounded-xl text-[9px] font-black uppercase truncate">H: {proj.hortalica}</div>
                    <div className="bg-purple-50 p-2 rounded-xl text-[9px] font-black uppercase truncate">M: {proj.medicinal}</div>
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
