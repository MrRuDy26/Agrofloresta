import React, { useState, useEffect } from 'react';
import { 
  Leaf, Sprout, Loader2, TreeDeciduous, Carrot, LogOut, LogIn, History, Trash2, Wheat, Pill, Search, ChevronRight, BookOpen, Map as MapIcon, Info
} from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './services/supabase';

// BANCO DE DADOS INTEGRADO
const PLANTS_LIBRARY = [
  ...['Angico-Vermelho', 'Cedro-Rosa', 'Jequitibá-Rosa', 'Ipê-Roxo', 'Açoita-Cavalo', 'Pau-Brasil', 'Guanandi', 'Jacarandá-da-Bahia', 'Baru', 'Buriti', 'Pinho-do-Paraná', 'Mogno Africano', 'Louro-Pardo', 'Canafístula', 'Sumaúma'].map(n => ({name: n, stratum: 'EMERGENTE', family: 'Nativa/Madeira'})),
  ...['Bananeira Prata', 'Abacateiro', 'Jatobá', 'Ingá-Cipó', 'Cajá', 'Açaí', 'Cupuaçu', 'Jenipapo', 'Bacuri', 'Mangueira', 'Pequi', 'Macaúba', 'Babaçu', 'Bacaba', 'Biribá', 'Umbu', 'Tarumã'].map(n => ({name: n, stratum: 'ALTO', family: 'Frutífera'})),
  ...['Café', 'Cacau', 'Jabuticaba', 'Uvaia', 'Pitangueira', 'Cambuci', 'Mandioca', 'Acerola', 'Abiu', 'Bacupari', 'Araçá-boi', 'Camu-camu', 'Gabiroba', 'Guaraná', 'Gueroba', 'Jacaritiá', 'Mangaba', 'Murici', 'Sapota', 'Amora-preta', 'Cereja-do-rio-grande'].map(n => ({name: n, stratum: 'MEDIO', family: 'Nativa/Frutífera'})),
  ...['Abacaxi', 'Araçá', 'Feijão-guandu', 'Taioba', 'Inhame', 'Batata-doce', 'Fisalis', 'Cúrcuma', 'Gengibre', 'Arumbeva', 'Mandacaru', 'Beldroega', 'Peixinho da horta', 'Jurubeba', 'Croá', 'Pêra-do-cerrado'].map(n => ({name: n, stratum: 'BAIXO', family: 'Diversas'})),
  ...['Alface', 'Rúcula', 'Couve', 'Espinafre', 'Agrião', 'Salsa', 'Coentro', 'Manjericão', 'Serralha'].map(n => ({name: n, stratum: 'VERDURA', family: 'Hortaliça'})),
  ...['Tomate', 'Cenoura', 'Abóbora', 'Berinjela', 'Pimentão', 'Beterraba', 'Vagem', 'Chuchu', 'Quiabo', 'Pepino'].map(n => ({name: n, stratum: 'LEGUME', family: 'Hortaliça'})),
  ...['Guaco', 'Capim-limão', 'Boldo', 'Alecrim', 'Tanchagem', 'Ora-pro-nóbis', 'Citronela', 'Erva-cidreira', 'Losna', 'Abre-caminho', 'Anador', 'Arnica', 'Bálsamo', 'Babosa', 'Espinheira-santa', 'Aranto', 'Alfavaca', 'Calêndula', 'Camomila', 'Quebra-pedra', 'Sálvia'].map(n => ({name: n, stratum: 'MEDICINAL', family: 'Farmácia Viva'}))
];

function AppContent() {
  const [activeTab, setActiveTab] = useState<'app' | 'library' | 'history'>('app');
  const [searchTerm, setSearchTerm] = useState('');
  const [step, setStep] = useState('hero');
  const [area, setArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const { user, signOut } = useAuth();

  useEffect(() => { if (activeTab === 'history' && user) fetchHistory(); }, [activeTab, user]);

  const fetchHistory = async () => {
    setLoading(true);
    const { data } = await supabase.from('projetos').select('*').order('created_at', { ascending: false });
    setHistory(data || []);
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ 
        provider: 'google', 
        options: { redirectTo: window.location.origin } 
    });
  };

  const gerarPlano = async () => {
    setLoading(true);
    const sortear = (s: string) => {
      const l = PLANTS_LIBRARY.filter(p => p.stratum === s);
      return l[Math.floor(Math.random() * l.length)].name;
    };
    const novo = {
      emergente: sortear('EMERGENTE'), alto: sortear('ALTO'), medio: sortear('MEDIO'),
      baixo: sortear('BAIXO'), verdura: sortear('VERDURA'), legume: sortear('LEGUME'),
      medicinal: sortear('MEDICINAL')
    };
    if (user) await supabase.from('projetos').insert([{ user_id: user.id, area, ...novo }]);
    setTimeout(() => { setResult(novo); setLoading(false); setStep('results'); }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f8f9f4] font-sans text-stone-900 pb-20">
      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-stone-200 p-4 flex justify-between items-center sticky top-0 z-50 px-6 shadow-sm">
        <div className="flex items-center font-black text-2xl text-green-900 tracking-tighter cursor-pointer" onClick={() => {setStep('hero'); setActiveTab('app');}}>
          <div className="bg-green-600 p-1.5 rounded-xl mr-2 shadow-lg shadow-green-200">
             <Leaf className="text-white w-6 h-6" />
          </div>
          SINTROPLAN
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          <button onClick={() => setActiveTab('app')} className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 ${activeTab === 'app' ? 'text-green-600' : 'text-stone-400'}`}>Gerador</button>
          <button onClick={() => setActiveTab('library')} className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 ${activeTab === 'library' ? 'text-green-600' : 'text-stone-400'}`}>Biblioteca</button>
          {user ? (
            <div className="flex items-center gap-3 border-l pl-4">
              <button onClick={() => setActiveTab('history')} className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'history' ? 'text-green-600' : 'text-stone-400'}`}>Planos</button>
              <button onClick={() => signOut()} className="text-stone-300 hover:text-red-500 transition-all"><LogOut className="w-5 h-5" /></button>
            </div>
          ) : (
            <button onClick={handleGoogleLogin} className="bg-green-700 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-green-800 shadow-md transition-all">Entrar</button>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4">
        {step === 'hero' && (
          <div className="py-10 md:py-20">
            {/* CARD HERO DE ALTO IMPACTO */}
            <div className="relative rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white min-h-[500px] flex items-center">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&q=80&w=2000" 
                  className="w-full h-full object-cover scale-105"
                  alt="Agrofloresta"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green-950/95 via-green-900/70 to-transparent" />
              </div>

              <div className="relative z-10 p-8 md:p-20 max-w-3xl">
                <div className="inline-flex items-center bg-green-500/20 backdrop-blur-md border border-green-400/30 px-5 py-2 rounded-full mb-8">
                  <Sprout className="w-4 h-4 text-green-300 mr-2" />
                  <span className="text-[10px] font-black text-green-50 uppercase tracking-[0.3em]">O Futuro da Agricultura</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.85] mb-8 tracking-tighter">
                  Sua terra, <br />
                  <span className="text-green-400">uma floresta.</span>
                </h1>
                <p className="text-xl text-green-100/80 font-medium mb-12 max-w-md leading-relaxed">
                  Planeje sistemas agroflorestais profissionais combinando sucessão natural, frutas e madeiras nobres.
                </p>
                <div className="flex flex-col sm:flex-row gap-5">
                  <button 
                    onClick={() => setStep('form')}
                    className="flex items-center justify-center bg-green-500 text-green-950 px-12 py-7 rounded-[2.5rem] font-black text-xl hover:bg-green-400 shadow-xl shadow-green-900/40 transition-all active:scale-95"
                  >
                    COMEÇAR AGORA <ChevronRight className="ml-2" />
                  </button>
                  <button onClick={() => setActiveTab('library')} className="flex items-center justify-center bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-7 rounded-[2.5rem] font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all">
                    <BookOpen className="mr-2 w-4 h-4" /> BIBLIOTECA
                  </button>
                </div>
              </div>
            </div>
            
            {/* PROVA SOCIAL / STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
               {[
                 { label: 'Biodiversidade', value: '500+ Espécies' },
                 { label: 'Camadas', value: '7 Estratos' },
                 { label: 'Lógica', value: 'Sintrópica' },
                 { label: 'Manual', value: 'Passo a Passo' }
               ].map((item, i) => (
                 <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100 text-center">
                    <p className="text-2xl font-black text-green-900 tracking-tighter">{item.value}</p>
                    <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-1">{item.label}</p>
                 </div>
               ))}
            </div>
          </div>
        )}

        {step === 'form' && (
          <div className="py-20 max-w-2xl mx-auto">
            <div className="bg-white rounded-[4rem] shadow-2xl p-12 md:p-20 border border-stone-100 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-green-500 to-emerald-700" />
               <h2 className="text-4xl font-black mb-12 text-stone-800 uppercase tracking-tighter">Área de Plantio</h2>
               <div className="relative mb-12">
                 <input 
                   type="number" 
                   className="w-full p-10 bg-stone-50 border-4 border-stone-100 rounded-[3rem] text-center text-6xl font-black outline-none focus:border-green-500 transition-all" 
                   placeholder="0" 
                   value={area} 
                   onChange={e => setArea(e.target.value)} 
                 />
                 <span className="absolute right-10 top-1/2 -translate-y-1/2 font-black text-stone-300 text-2xl uppercase">m²</span>
               </div>
               <button onClick={gerarPlano} disabled={loading || !area} className="w-full py-8 bg-green-700 text-white font-black rounded-[3rem] text-xl shadow-2xl hover:bg-green-800 transition-all flex items-center justify-center gap-4">
                 {loading ? <Loader2 className="animate-spin" /> : <>GERAR PROJETOS <ChevronRight/></>}
               </button>
            </div>
          </div>
        )}

        {step === 'results' && result && (
          <div className="py-12 animate-in slide-in-from-bottom-10 duration-700">
            <div className="text-center mb-16">
              <h3 className="text-5xl font-black uppercase tracking-tighter text-stone-800">Seu Canteiro</h3>
              <p className="text-stone-400 font-bold text-sm uppercase tracking-[0.3em] mt-3">Distribuição sugerida para {area}m²</p>
            </div>

            {/* REPRESENTAÇÃO VISUAL DO CANTEIRO (NOVO!) */}
            <div className="bg-emerald-950 p-6 md:p-12 rounded-[4rem] mb-12 shadow-2xl border-8 border-white overflow-hidden relative">
               <div className="absolute top-0 right-0 p-8 opacity-10"><Leaf className="w-64 h-64 text-white" /></div>
               <p className="text-[10px] font-black text-green-400 uppercase tracking-[0.4em] mb-10 text-center">Esquema de Plantio (Visão de Cima)</p>
               
               <div className="flex flex-col gap-6 relative z-10">
                  {/* Linha Central: Emergente e Alto */}
                  <div className="bg-green-900/40 p-10 rounded-[3rem] border-2 border-dashed border-green-700 flex justify-center gap-12 items-center">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white shadow-xl mx-auto mb-3">
                           <TreeDeciduous className="text-white w-10 h-10" />
                        </div>
                        <p className="text-[8px] font-black text-green-400 uppercase mb-1">Centro (Emergente)</p>
                        <p className="text-white font-black text-sm">{result.emergente}</p>
                      </div>
                      <div className="text-center">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-xl mx-auto mb-3">
                           <TreeDeciduous className="text-white w-8 h-8" />
                        </div>
                        <p className="text-[8px] font-black text-green-400 uppercase mb-1">Topo (Alto)</p>
                        <p className="text-white font-black text-sm">{result.alto}</p>
                      </div>
                  </div>

                  {/* Linhas Laterais: Médio e Baixo */}
                  <div className="grid grid-cols-2 gap-6">
                      <div className="bg-green-900/30 p-8 rounded-[2.5rem] border-2 border-dashed border-green-800 text-center">
                        <div className="w-16 h-16 bg-lime-500 rounded-full flex items-center justify-center border-2 border-white mx-auto mb-3 shadow-lg">
                           <Sprout className="text-white w-6 h-6" />
                        </div>
                        <p className="text-[8px] font-black text-green-500 uppercase mb-1">Lateral (Médio)</p>
                        <p className="text-white font-black text-xs leading-tight">{result.medio}</p>
                      </div>
                      <div className="bg-green-900/30 p-8 rounded-[2.5rem] border-2 border-dashed border-green-800 text-center">
                        <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white mx-auto mb-3 shadow-lg">
                           <Sprout className="text-white w-6 h-6" />
                        </div>
                        <p className="text-[8px] font-black text-yellow-500 uppercase mb-1">Borda (Baixo)</p>
                        <p className="text-white font-black text-xs leading-tight">{result.baixo}</p>
                      </div>
                  </div>

                  {/* Chão: Hortaliças */}
                  <div className="bg-amber-900/20 p-6 rounded-[2rem] border-2 border-dashed border-amber-800 flex justify-center gap-8">
                     <div className="flex items-center gap-3">
                        <Wheat className="text-orange-400 w-4 h-4" />
                        <span className="text-white font-bold text-[10px] uppercase">{result.verdura}</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <Carrot className="text-red-400 w-4 h-4" />
                        <span className="text-white font-bold text-[10px] uppercase">{result.legume}</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* CARDS DE DETALHES */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-12">
               {[
                 { l: 'Emergente', v: result.emergente, c: 'bg-emerald-100 text-emerald-800' },
                 { l: 'Alto', v: result.alto, c: 'bg-green-100 text-green-800' },
                 { l: 'Médio', v: result.medio, c: 'bg-lime-100 text-lime-800' },
                 { l: 'Baixo', v: result.baixo, c: 'bg-yellow-100 text-yellow-800' },
                 { l: 'Verdura', v: result.verdura, c: 'bg-orange-100 text-orange-800' },
                 { l: 'Legume', v: result.legume, c: 'bg-red-100 text-red-800' },
                 { l: 'Medicinal', v: result.medicinal, c: 'bg-purple-100 text-purple-800' }
               ].map((s, i) => (
                 <div key={i} className={`${s.c} p-5 rounded-3xl border-2 border-white shadow-sm flex flex-col items-center text-center`}>
                    <p className="text-[7px] font-black uppercase mb-1 opacity-60 tracking-widest">{s.l}</p>
                    <p className="font-black text-[10px] leading-tight uppercase">{s.v}</p>
                 </div>
               ))}
            </div>

            <div className="flex justify-center gap-4">
              <button onClick={() => setStep('form')} className="bg-stone-900 text-white px-10 py-5 rounded-3xl font-black uppercase text-xs tracking-widest flex items-center gap-2">
                 <RefreshCw className="w-4 h-4" /> Novo Projeto
              </button>
              <button className="bg-white border-2 border-stone-200 text-stone-600 px-10 py-5 rounded-3xl font-black uppercase text-xs tracking-widest flex items-center gap-2">
                 <Info className="w-4 h-4" /> Como Plantar
              </button>
            </div>
          </div>
        )}

        {/* BIBLIOTECA (VISUAL PREMIUM) */}
        {activeTab === 'library' && (
          <div className="py-12 animate-in fade-in">
             <div className="text-center mb-12">
                <h2 className="text-5xl font-black uppercase tracking-tighter">Enciclopédia</h2>
                <div className="max-w-xl mx-auto mt-8 relative">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 w-5 h-5" />
                   <input className="w-full pl-14 pr-6 py-5 rounded-[2rem] border-4 border-white shadow-xl outline-none focus:border-green-500 font-bold" placeholder="Pesquisar espécie..." onChange={e => setSearchTerm(e.target.value)} />
                </div>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {PLANTS_LIBRARY.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((p, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2.5rem] border-2 border-stone-50 shadow-sm hover:border-green-200 transition-all group">
                    <span className="text-[7px] font-black bg-stone-100 px-3 py-1 rounded-full uppercase group-hover:bg-green-50 transition-colors">{p.stratum}</span>
                    <h4 className="font-black text-sm mt-4 text-stone-800 leading-tight">{p.name}</h4>
                    <p className="text-[8px] text-stone-400 font-bold uppercase mt-1">{p.family}</p>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* HISTÓRICO (VISUAL PREMIUM) */}
        {activeTab === 'history' && (
          <div className="py-12 animate-in slide-in-from-bottom-5">
             <h2 className="text-4xl font-black uppercase text-center mb-12 tracking-tighter">Meus Projetos</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {history.length === 0 ? (
                  <div className="col-span-full py-20 text-center border-4 border-dashed rounded-[4rem] text-stone-300 font-black uppercase">Nenhum plano salvo ainda</div>
                ) : history.map((proj) => (
                  <div key={proj.id} className="bg-white p-10 rounded-[3.5rem] border-2 border-stone-50 shadow-sm relative group hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <p className="text-[10px] font-black text-stone-300 uppercase mb-1">{new Date(proj.created_at).toLocaleDateString()}</p>
                        <h4 className="text-3xl font-black text-stone-800 tracking-tighter">{proj.area} m²</h4>
                      </div>
                      <button onClick={async () => {
                        await supabase.from('projetos').delete().eq('id', proj.id);
                        fetchHistory();
                      }} className="p-3 text-stone-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"><Trash2 className="w-5 h-5" /></button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {['emergente', 'alto', 'medio', 'baixo', 'verdura', 'legume', 'medicinal'].map(k => (
                        <div key={k} className="bg-stone-50 p-3 rounded-2xl text-[8px] font-black uppercase truncate text-stone-400 border border-stone-100">{proj[k] || '---'}</div>
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

export default function App() { return (<AuthProvider><AppContent /></AuthProvider>); }
