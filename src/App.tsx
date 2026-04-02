import React, { useState, useEffect } from 'react';
import { 
  Leaf, Sprout, Loader2, TreeDeciduous, Carrot, LogOut, LogIn, History, Trash2, Wheat, Pill, Search, ChevronRight, BookOpen, Map as MapIcon, Info, Layers
} from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './services/supabase';

const PLANTS_DATA = {
  EMERGENTE: ['Angico-Vermelho', 'Cedro-Rosa', 'Jequitibá-Rosa', 'Ipê-Roxo', 'Açoita-Cavalo', 'Pau-Brasil', 'Guanandi', 'Jacarandá-da-Bahia', 'Baru', 'Buriti', 'Pinho-do-Paraná', 'Mogno Africano', 'Louro-Pardo', 'Sumaúma', 'Pau-Ferro', 'Copaíba', 'Andiroba', 'Grápia', 'Garapuvu'],
  ALTO: ['Bananeira Prata', 'Bananeira Nanica', 'Abacateiro', 'Jatobá', 'Ingá-Cipó', 'Ingá-Feijão', 'Cajá', 'Açaí', 'Cupuaçu', 'Jenipapo', 'Bacuri', 'Mangueira', 'Pequi', 'Macaúba', 'Babaçu', 'Umbu', 'Tarumã', 'Seringueira'],
  MEDIO: ['Café', 'Cacau', 'Jabuticaba', 'Uvaia', 'Pitangueira', 'Cambuci', 'Mandioca', 'Acerola', 'Abiu', 'Bacupari', 'Araçá-Boi', 'Camu-Camu', 'Gabiroba', 'Guaraná', 'Gueroba', 'Jacaratiá', 'Mangaba', 'Murici', 'Sapota', 'Amora-Preta'],
  BAIXO: ['Abacaxi', 'Araçá', 'Feijão-Guandu', 'Taioba', 'Inhame', 'Batata-Doce', 'Fisalis', 'Cúrcuma', 'Gengibre', 'Arumbeva', 'Mandacaru', 'Beldroega', 'Peixinho da Horta', 'Jurubeba', 'Croá'],
  VERDURA: ['Alface', 'Rúcula', 'Couve', 'Espinafre', 'Agrião', 'Salsa', 'Coentro', 'Manjericão', 'Serralha'],
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
    setTimeout(() => { setResult(novo); setLoading(false); setStep('results'); }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#fafaf7] font-sans text-stone-900 pb-20">
      {/* NAVBAR */}
      <nav className="bg-white/90 backdrop-blur-md border-b p-4 flex justify-between items-center sticky top-0 z-50 px-6">
        <div className="flex items-center font-black text-2xl text-green-900 tracking-tighter cursor-pointer" onClick={() => {setStep('hero'); setActiveTab('app');}}>
          <div className="bg-green-600 p-1.5 rounded-xl mr-2"><Leaf className="text-white w-6 h-6" /></div>
          SINTROPLAN
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setActiveTab('app')} className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'app' ? 'text-green-600' : 'text-stone-400'}`}>Gerador</button>
          <button onClick={() => setActiveTab('library')} className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'library' ? 'text-green-600' : 'text-stone-400'}`}>Biblioteca</button>
          {user ? (
            <button onClick={() => signOut()} className="text-stone-300 hover:text-red-500 transition-all"><LogOut className="w-5 h-5" /></button>
          ) : (
            <button onClick={handleGoogleLogin} className="bg-green-700 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase">Entrar</button>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4">
        {step === 'hero' && (
          <div className="py-12 md:py-20 animate-in fade-in duration-700">
            <div className="relative rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white h-[600px] flex items-center">
              <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="Agrofloresta"/>
                <div className="absolute inset-0 bg-gradient-to-r from-[#061a0d]/95 via-[#061a0d]/60 to-transparent" />
              </div>
              <div className="relative z-10 p-8 md:p-24 max-w-2xl">
                <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.85] mb-8 tracking-tighter uppercase">Abundância <br/><span className="text-green-400">Sintrópica.</span></h1>
                <p className="text-xl text-green-100/80 font-medium mb-12 max-w-md">Transforme sua terra em um ecossistema produtivo de alta performance.</p>
                <button onClick={() => setStep('form')} className="bg-green-500 text-[#061a0d] px-12 py-8 rounded-[2.5rem] font-black text-2xl hover:bg-green-400 shadow-[0_20px_50px_rgba(34,197,94,0.4)] transition-all active:scale-95">COMEÇAR DESIGN</button>
              </div>
            </div>
          </div>
        )}

        {step === 'form' && (
          <div className="py-20 max-w-2xl mx-auto">
             <div className="bg-white rounded-[4rem] shadow-2xl p-16 border-4 border-green-50 text-center">
                <h2 className="text-4xl font-black mb-12 text-stone-800 uppercase tracking-tighter italic">Área de Plantio</h2>
                <div className="relative mb-12">
                  <input type="number" className="w-full p-10 bg-stone-50 border-4 border-stone-100 rounded-[3rem] text-center text-7xl font-black outline-none focus:border-green-500 transition-all" value={area} onChange={e => setArea(e.target.value)} placeholder="0" />
                  <span className="absolute right-10 top-1/2 -translate-y-1/2 font-black text-stone-200 text-3xl">m²</span>
                </div>
                <button onClick={gerarPlano} className="w-full py-8 bg-green-700 text-white font-black rounded-[3rem] text-2xl shadow-xl hover:bg-green-800">GERAR CANTEIRO DIGITAL</button>
             </div>
          </div>
        )}

        {step === 'results' && result && (
          <div className="py-12 animate-in slide-in-from-bottom-10 duration-700">
            <div className="text-center mb-16">
              <h3 className="text-5xl font-black uppercase text-stone-800 tracking-tighter italic">Seu Design Técnico</h3>
              <p className="text-stone-400 font-bold text-sm uppercase tracking-[0.3em] mt-3">Sincronização de estratos para {area}m²</p>
            </div>

            {/* O NOVO CANTEIRO DIGITAL BASEADO NO ESQUEMA TÉCNICO */}
            <div className="bg-[#0b140e] p-8 md:p-16 rounded-[5rem] mb-16 shadow-2xl border-[12px] border-white relative overflow-hidden">
               {/* Simulação de Linhas de Solo */}
               <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(45deg,transparent,transparent_40px,#22c55e_40px,#22c55e_41px)]" />
               
               <div className="relative z-10">
                  <div className="flex flex-col gap-12">
                     
                     {/* 1. ESTRATO SUPERIOR (CENTRO DO CANTEIRO) */}
                     <div className="flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 bg-green-500/10 px-4 py-1 rounded-full mb-6">
                           <Layers className="text-green-400 w-3 h-3" />
                           <span className="text-[9px] font-black text-green-400 uppercase tracking-widest">Dossel / Emergente</span>
                        </div>
                        <div className="flex justify-center gap-12 md:gap-24">
                           <div className="text-center group">
                              <div className="w-32 h-32 bg-emerald-600 rounded-full flex items-center justify-center border-4 border-white shadow-[0_0_50px_rgba(5,150,105,0.4)] mb-4 transition-transform group-hover:scale-110">
                                 <TreeDeciduous className="text-white w-14 h-14" />
                              </div>
                              <p className="text-white font-black text-lg">{result.emergente}</p>
                           </div>
                           <div className="text-center group">
                              <div className="w-28 h-28 bg-green-600 rounded-full flex items-center justify-center border-4 border-white shadow-xl mb-4 transition-transform group-hover:scale-110">
                                 <TreeDeciduous className="text-white w-12 h-12" />
                              </div>
                              <p className="text-white font-black text-lg">{result.alto}</p>
                           </div>
                        </div>
                     </div>

                     {/* 2. ESTRATO INTERMEDIÁRIO (LINHAS LATERAIS) */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto w-full">
                        <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 text-center relative">
                           <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-lime-500 text-[#0b140e] px-3 py-1 rounded-full text-[8px] font-black uppercase">Médio</div>
                           <div className="w-20 h-20 bg-lime-500 rounded-full flex items-center justify-center border-4 border-white mx-auto mb-4 shadow-lg">
                              <Sprout className="text-[#0b140e] w-10 h-10" />
                           </div>
                           <p className="text-white font-black text-base">{result.medio}</p>
                        </div>
                        <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 text-center relative">
                           <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-[#0b140e] px-3 py-1 rounded-full text-[8px] font-black uppercase">Baixo</div>
                           <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center border-4 border-white mx-auto mb-4 shadow-lg">
                              <Sprout className="text-[#0b140e] w-10 h-10" />
                           </div>
                           <p className="text-white font-black text-base">{result.baixo}</p>
                        </div>
                     </div>

                     {/* 3. PLACENTA / COBERTURA DE SOLO (BASE) */}
                     <div className="bg-[#1a2e21] p-10 rounded-[4rem] border-2 border-white/5">
                        <div className="text-center mb-6">
                           <span className="text-[8px] font-black text-stone-500 uppercase tracking-[0.4em]">Placenta I & II (Cobertura)</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                           <div className="flex items-center gap-4 group cursor-help">
                              <div className="bg-orange-500 p-2 rounded-lg shadow-lg group-hover:rotate-12 transition-transform"><Wheat className="text-white w-5 h-5" /></div>
                              <div>
                                 <p className="text-orange-500 font-black text-[8px] uppercase">Verdura</p>
                                 <p className="text-white font-bold text-sm">{result.verdura}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-4 group cursor-help">
                              <div className="bg-red-500 p-2 rounded-lg shadow-lg group-hover:rotate-12 transition-transform"><Carrot className="text-white w-5 h-5" /></div>
                              <div>
                                 <p className="text-red-500 font-black text-[8px] uppercase">Legume</p>
                                 <p className="text-white font-bold text-sm">{result.legume}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-4 group cursor-help">
                              <div className="bg-purple-500 p-2 rounded-lg shadow-lg group-hover:rotate-12 transition-transform"><Pill className="text-white w-5 h-5" /></div>
                              <div>
                                 <p className="text-purple-500 font-black text-[8px] uppercase">Medicinal</p>
                                 <p className="text-white font-bold text-sm">{result.medicinal}</p>
                              </div>
                           </div>
                        </div>
                     </div>

                  </div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button onClick={() => setStep('form')} className="bg-stone-900 text-white px-12 py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl flex items-center gap-3 justify-center">
                 <MapIcon className="w-4 h-4" /> REFAZER DESIGN
              </button>
              <button className="bg-white border-4 border-stone-100 text-stone-600 px-12 py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center gap-3 justify-center">
                 <Info className="w-4 h-4" /> MANUAL DE MANEJO
              </button>
            </div>
          </div>
        )}

        {/* BIBLIOTECA (VISUAL PREMIUM) */}
        {activeTab === 'library' && (
          <div className="py-12 animate-in fade-in">
             <div className="text-center mb-16">
                <h2 className="text-5xl font-black uppercase tracking-tighter italic">Enciclopédia Botânica</h2>
                <div className="max-w-2xl mx-auto mt-10 relative px-4">
                   <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-stone-300 w-6 h-6" />
                   <input className="w-full pl-16 pr-8 py-6 rounded-[3rem] border-8 border-white shadow-2xl outline-none focus:border-green-500 font-bold text-lg" placeholder="Qual planta você quer pesquisar?" onChange={e => setSearchTerm(e.target.value)} />
                </div>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Object.entries(PLANTS_DATA).flatMap(([stratum, list]) => 
                  list.map((name, i) => (
                    <div key={name + i} className="bg-white p-6 rounded-[2.5rem] border-2 border-stone-50 shadow-sm hover:border-green-200 transition-all group">
                      <span className="text-[7px] font-black bg-stone-100 px-3 py-1 rounded-full uppercase group-hover:bg-green-50 transition-colors">{stratum}</span>
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
