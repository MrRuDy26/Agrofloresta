import React, { useState, useEffect } from 'react';
import { 
  Leaf, Sprout, Loader2, TreeDeciduous, Carrot, LogOut, LogIn, History, Trash2, Wheat, Pill, Search, ChevronRight, BookOpen, Info, Layers, MoveUp
} from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './services/supabase';

// BANCO DE DADOS MASSIVO MANTIDO (TODAS AS SUAS LISTAS ESTÃO AQUI)
const PLANTS_DATA = {
  EMERGENTE: ['Angico-Vermelho', 'Cedro-Rosa', 'Jequitibá-Rosa', 'Ipê-Roxo', 'Açoita-Cavalo', 'Pau-Brasil', 'Guanandi', 'Jacarandá-da-Bahia', 'Baru', 'Buriti', 'Pinho-do-Paraná', 'Mogno Africano', 'Louro-Pardo', 'Sumaúma', 'Pau-Ferro', 'Copaíba', 'Andiroba', 'Grápia', 'Garapuvu'],
  ALTO: ['Bananeira Prata', 'Bananeira Nanica', 'Abacateiro', 'Jatobá', 'Ingá-Cipó', 'Ingá-Feijão', 'Cajá', 'Açaí', 'Cupuaçu', 'Jenipapo', 'Bacuri', 'Mangueira', 'Pequi', 'Macaúba', 'Babaçu', 'Umbu', 'Tarumã', 'Seringueira'],
  MEDIO: ['Café', 'Cacau', 'Jabuticaba', 'Uvaia', 'Pitangueira', 'Cambuci', 'Mandioca', 'Acerola', 'Abiu', 'Bacupari', 'Araçá-Boi', 'Camu-Camu', 'Gabiroba', 'Guaraná', 'Gueroba', 'Jacaratiá', 'Mangaba', 'Murici', 'Sapota', 'Amora-Preta'],
  BAIXO: ['Abacaxi', 'Araçá', 'Feijão-Guandu', 'Taioba', 'Inhame', 'Batata-Doce', 'Fisalis', 'Cúrcuma', 'Gengibre', 'Arumbeva', 'Mandacaru', 'Beldroega', 'Peixinho da Horta', 'Jurubeba', 'Croá'],
  VERDURA: ['Alface', 'Rúcula', 'Couve', 'Espinafre', 'Agrião', 'Salsa', 'Acelga', 'Coentro', 'Manjericão', 'Mostarda', 'Serralha', 'Chicória'],
  LEGUME: ['Tomate', 'Cenoura', 'Abóbora', 'Berinjela', 'Pimentão', 'Beterraba', 'Vagem', 'Chuchu', 'Quiabo', 'Pepino'],
  MEDICINAL: ['Guaco', 'Capim-Limão', 'Boldo', 'Alecrim', 'Tanchagem', 'Ora-pro-nóbis', 'Citronela', 'Erva-Cidreira', 'Losna', 'Abre-Caminho', 'Anador', 'Arnica', 'Bálsamo', 'Babosa', 'Espinheira-Santa']
};

function AppContent() {
  const [activeTab, setActiveTab] = useState<'app' | 'library' | 'history'>('app');
  const [step, setStep] = useState('hero');
  const [area, setArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { user, signOut } = useAuth();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
  };

  const gerarPlano = async () => {
    if (!area) return;
    setLoading(true);
    const sortear = (lista: string[]) => lista[Math.floor(Math.random() * lista.length)];
    const novo = {
      emergente: sortear(PLANTS_DATA.EMERGENTE),
      alto: sortear(PLANTS_DATA.ALTO),
      medio: sortear(PLANTS_DATA.MEDIO),
      baixo: sortear(PLANTS_DATA.BAIXO),
      verdura: sortear(PLANTS_DATA.VERDURA),
      legume: sortear(PLANTS_DATA.LEGUME),
      medicinal: sortear(PLANTS_DATA.MEDICINAL)
    };
    if (user) await supabase.from('projetos').insert([{ user_id: user.id, area, ...novo }]);
    setTimeout(() => { setResult(novo); setLoading(false); setStep('results'); }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F0] font-sans text-[#1A1C19] pb-20">
      {/* NAVBAR */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-stone-200 p-4 flex justify-between items-center sticky top-0 z-50 px-6">
        <div className="flex items-center font-black text-2xl text-[#0D2B1D] tracking-tighter cursor-pointer" onClick={() => {setStep('hero'); setActiveTab('app');}}>
          <div className="bg-[#1A5D1A] p-1.5 rounded-lg mr-2"><Leaf className="text-white w-6 h-6" /></div>
          SINTROPLAN
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setActiveTab('app')} className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'app' ? 'text-[#1A5D1A]' : 'text-stone-400'}`}>Design</button>
          <button onClick={() => setActiveTab('library')} className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'library' ? 'text-[#1A5D1A]' : 'text-stone-400'}`}>Biblioteca</button>
          {user ? (
            <button onClick={() => signOut()} className="text-stone-300 hover:text-red-500 transition-all"><LogOut className="w-5 h-5" /></button>
          ) : (
            <button onClick={handleGoogleLogin} className="bg-[#0D2B1D] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90">Login</button>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {step === 'hero' && (
          <div className="py-12 animate-in fade-in duration-1000">
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl min-h-[650px] flex items-center">
              <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1592419044706-39796d40f98c?q=80&w=2000" className="w-full h-full object-cover shadow-inner" alt="Fundo Agrofloresta"/>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D2B1D] via-[#0D2B1D]/40 to-transparent" />
              </div>
              <div className="relative z-10 p-8 md:p-20 max-w-3xl">
                <p className="text-green-400 font-black text-[12px] uppercase tracking-[0.4em] mb-4">Sistemas Agroflorestais Profissionais</p>
                <h1 className="text-6xl md:text-8xl font-black text-white leading-tight mb-8 tracking-tighter uppercase">
                  O Design da <br/><span className="text-green-500">Sucessão.</span>
                </h1>
                <p className="text-xl text-stone-200 font-medium mb-12 max-w-md leading-relaxed border-l-4 border-green-600 pl-6 italic">
                  "O plantio é um evento único, o manejo é o processo contínuo de abundância."
                </p>
                <button onClick={() => setStep('form')} className="bg-[#1A5D1A] text-white px-14 py-8 rounded-full font-black text-2xl hover:bg-[#2C7A2C] shadow-2xl transition-all active:scale-95 uppercase tracking-tighter">
                  Começar Planejamento
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'form' && (
          <div className="py-20 max-w-2xl mx-auto">
             <div className="bg-white rounded-[4rem] shadow-2xl p-16 border border-stone-100 text-center">
                <h2 className="text-3xl font-black mb-10 text-[#0D2B1D] uppercase">Dimensão da Área</h2>
                <div className="relative mb-12">
                  <input type="number" className="w-full p-10 bg-stone-50 border-b-8 border-green-600 rounded-3xl text-center text-6xl font-black outline-none focus:bg-white transition-all" value={area} onChange={e => setArea(e.target.value)} placeholder="0" />
                  <span className="absolute right-10 top-1/2 -translate-y-1/2 font-black text-stone-200 text-3xl">m²</span>
                </div>
                <button onClick={gerarPlano} className="w-full py-8 bg-[#1A5D1A] text-white font-black rounded-3xl text-2xl hover:bg-[#2C7A2C] transition-all shadow-xl">
                  GERAR DESIGN TÉCNICO
                </button>
             </div>
          </div>
        )}

        {step === 'results' && result && (
          <div className="py-12 animate-in slide-in-from-bottom-10 duration-700">
            <div className="text-center mb-16">
              <h3 className="text-5xl font-black uppercase text-[#0D2B1D] tracking-tighter">Consórcio Estratificado</h3>
              <p className="text-stone-400 font-bold text-sm uppercase tracking-[0.3em] mt-3 italic">Visualização Técnica do Adensamento</p>
            </div>

            {/* VISUALIZAÇÃO DE PERFIL - O CANTEIRO PROFISSIONAL */}
            <div className="bg-[#121411] p-12 md:p-24 rounded-[4rem] mb-16 shadow-[0_40px_100px_rgba(0,0,0,0.4)] border-x-[16px] border-[#2C332A] relative min-h-[700px] flex flex-col justify-end">
               
               {/* Réguas de Altura */}
               <div className="absolute left-6 top-10 bottom-10 flex flex-col justify-between text-[10px] font-black text-stone-600 border-r border-stone-800 pr-4">
                  <span>30m - EMERGENTE</span>
                  <span>15m - ALTO</span>
                  <span>5m - MÉDIO</span>
                  <span>2m - BAIXO</span>
                  <span>0m - SOLO</span>
               </div>

               {/* O CANTEIRO (ADENSAMENTO) */}
               <div className="relative w-full h-[500px] flex items-end justify-around gap-2 border-b-8 border-[#3D2B1F]">
                  
                  {/* Emergente (Fundo) */}
                  <div className="absolute bottom-0 w-32 md:w-56 h-[100%] bg-gradient-to-t from-emerald-900/60 to-emerald-500/80 rounded-t-full flex flex-col items-center justify-start pt-10 border-x border-white/10">
                     <Layers className="text-white/20 mb-2" />
                     <p className="text-white font-black text-[10px] md:text-sm uppercase text-center px-4 leading-none">{result.emergente}</p>
                  </div>

                  {/* Alto (Domo) */}
                  <div className="absolute bottom-0 left-1/4 w-32 md:w-48 h-[70%] bg-gradient-to-t from-green-900/80 to-green-500 rounded-t-full flex flex-col items-center justify-start pt-8 border-x border-white/20 shadow-2xl">
                     <p className="text-white font-black text-[10px] md:text-sm uppercase text-center px-4 leading-none">{result.alto}</p>
                  </div>

                  {/* Médio (Preenchimento) */}
                  <div className="absolute bottom-0 right-1/4 w-24 md:w-40 h-[45%] bg-gradient-to-t from-lime-900 to-lime-500 rounded-t-[3rem] flex flex-col items-center justify-start pt-6 border-x border-white/20">
                     <p className="text-white font-black text-[9px] md:text-xs uppercase text-center px-2">{result.medio}</p>
                  </div>

                  {/* Baixo / Placenta II */}
                  <div className="z-10 w-20 md:w-32 h-[25%] bg-yellow-600 rounded-t-2xl flex items-center justify-center border-t-2 border-white/30 p-2 text-center">
                     <p className="text-black font-black text-[8px] md:text-[10px] uppercase leading-tight">{result.baixo}</p>
                  </div>

                  {/* Hortaliças (Chão / Placenta I) */}
                  <div className="absolute bottom-0 w-full h-12 flex justify-center items-center gap-6 bg-[#3D2B1F]/40 backdrop-blur-sm">
                     <div className="flex items-center gap-2">
                        <Wheat className="w-4 h-4 text-orange-400" />
                        <span className="text-white font-black text-[9px] uppercase">{result.verdura}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Carrot className="w-4 h-4 text-red-400" />
                        <span className="text-white font-black text-[9px] uppercase">{result.legume}</span>
                     </div>
                  </div>
               </div>

               {/* Legenda de Sucessão */}
               <div className="mt-12 grid grid-cols-3 gap-8 border-t border-stone-800 pt-8">
                  <div className="text-center">
                     <p className="text-stone-500 font-black text-[9px] uppercase mb-1">0-6 Meses</p>
                     <p className="text-green-400 font-bold text-xs uppercase">Colheita Placenta I</p>
                  </div>
                  <div className="text-center border-x border-stone-800">
                     <p className="text-stone-500 font-black text-[9px] uppercase mb-1">2-10 Anos</p>
                     <p className="text-green-400 font-bold text-xs uppercase">Manejo de Frutíferas</p>
                  </div>
                  <div className="text-center">
                     <p className="text-stone-500 font-black text-[9px] uppercase mb-1">20+ Anos</p>
                     <p className="text-green-400 font-bold text-xs uppercase">Maturação Clímax</p>
                  </div>
               </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-stone-100 max-w-4xl mx-auto mb-12">
               <div className="flex items-start gap-6">
                  <div className="bg-orange-100 p-4 rounded-2xl"><Info className="text-orange-600" /></div>
                  <div>
                     <h4 className="font-black text-xl text-[#0D2B1D] uppercase mb-2 text-left">Dinâmica do Consórcio</h4>
                     <p className="text-stone-600 text-sm leading-relaxed text-left">
                        Neste design adensado, o <strong>{result.emergente}</strong> e o <strong>Eucalipto</strong> puxam o crescimento para cima. No início, 
                        o <strong>{result.verdura}</strong> protege o solo enquanto o <strong>{result.alto}</strong> (como a Bananeira) 
                        acumula água. Após 6 meses, a poda das bananeiras fornecerá a matéria orgânica necessária para o 
                        desenvolvimento do <strong>{result.medio}</strong> e <strong>{result.baixo}</strong>.
                     </p>
                  </div>
               </div>
            </div>

            <button onClick={() => setStep('form')} className="block mx-auto bg-[#0D2B1D] text-white px-12 py-6 rounded-full font-black uppercase text-sm tracking-widest shadow-2xl hover:opacity-90">Novo Design</button>
          </div>
        )}

        {activeTab === 'library' && (
          <div className="py-12 animate-in fade-in">
             <div className="text-center mb-16">
                <h2 className="text-5xl font-black uppercase tracking-tighter text-[#0D2B1D]">Biblioteca Botânica</h2>
                <div className="max-w-2xl mx-auto mt-10 relative">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 w-6 h-6" />
                   <input className="w-full pl-16 pr-8 py-6 rounded-[3rem] border-4 border-white shadow-xl outline-none focus:border-green-600 font-bold text-lg" placeholder="Pesquisar entre as centenas de espécies..." onChange={e => setSearchTerm(e.target.value)} />
                </div>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Object.entries(PLANTS_DATA).flatMap(([stratum, list]) => 
                  list.map((name, i) => (
                    <div key={name + i} className="bg-white p-6 rounded-[2.5rem] border shadow-sm hover:border-green-600 transition-all text-left">
                      <span className="text-[7px] font-black bg-stone-100 px-3 py-1 rounded-full uppercase">{stratum}</span>
                      <h4 className="font-black text-sm mt-4 text-stone-800 leading-tight">{name}</h4>
                    </div>
                  ))
                )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() { return (<AuthProvider><AppContent /></AuthProvider>); }
