import React, { useState, useEffect } from 'react';
import { 
  Leaf, Sprout, Loader2, TreeDeciduous, Carrot, LogOut, LogIn, History, Trash2, Wheat, Pill, Search, ChevronRight, BookOpen, Map as MapIcon, Info, Layout
} from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './services/supabase';

// TODAS AS SUAS PLANTAS ESTÃO AQUI (AMPLIADO)
const PLANTS_DATA = {
  EMERGENTE: ['Angico-Vermelho', 'Angico-Branco', 'Angico-Preto', 'Cedro-Rosa', 'Cedro-Vermelho', 'Jequitibá-Rosa', 'Jequitibá-Branco', 'Ipê-Roxo', 'Ipê-Amarelo', 'Açoita-Cavalo', 'Pau-Brasil', 'Guanandi', 'Jacarandá-da-Bahia', 'Baru', 'Buriti', 'Pinho-do-Paraná', 'Mogno Africano', 'Louro-Pardo', 'Canafístula', 'Pau-Ferro', 'Copaíba', 'Andiroba', 'Sumaúma', 'Grápia', 'Garapuvu', 'Amesclão', 'Amendoim-Bravo', 'Monjoleiro', 'Pau-d’Alho', 'Cabreúva', 'Canjarana', 'Vinhático'],
  ALTO: ['Bananeira Prata', 'Bananeira Nanica', 'Abacateiro', 'Jatobá', 'Jatobá-do-Cerrado', 'Ingá-Cipó', 'Ingá-Feijão', 'Ingá-Banana', 'Cajá', 'Açaí', 'Açaí-Solteiro', 'Cupuaçu', 'Jenipapo', 'Bacuri', 'Mangueira', 'Pequi', 'Macaúba', 'Babaçu', 'Bacaba', 'Biribá', 'Cagaita', 'Caju-do-Cerrado', 'Patauá', 'Tucumã', 'Umbu', 'Umbu-Cajá', 'Tarumã', 'Seringueira', 'Cerejeira-da-Amazônia'],
  MEDIO: ['Café', 'Cacau', 'Jabuticaba', 'Uvaia', 'Pitangueira', 'Cambuci', 'Cambuí', 'Mandioca', 'Acerola', 'Abiu', 'Bacupari', 'Araçá-Boi', 'Araçá-Pêra', 'Camu-Camu', 'Gabiroba', 'Guabiroba', 'Guaraná', 'Gueroba', 'Jacaratiá', 'Mangaba', 'Mapati', 'Murici', 'Sapota', 'Sorva', 'Umari', 'Uvi', 'Amora-Preta', 'Sete-Capotes', 'Cereja-do-Rio-Grande'],
  BAIXO: ['Abacaxi', 'Araçá', 'Araçá-Cagão', 'Feijão-Guandu', 'Taioba', 'Inhame', 'Batata-Doce', 'Fisalis', 'Cúrcuma', 'Gengibre', 'Arumbeva', 'Mandacaru', 'Beldroega', 'Peixinho da horta', 'Jurubeba', 'Mini-pepininho', 'Croá', 'Cubiu', 'Pêra-do-Cerrado'],
  VERDURA: ['Alface', 'Rúcula', 'Couve', 'Espinafre', 'Agrião', 'Salsa', 'Acelga', 'Coentro', 'Manjericão', 'Mostarda', 'Serralha', 'Chicória'],
  LEGUME: ['Tomate', 'Cenoura', 'Abóbora', 'Berinjela', 'Pimentão', 'Beterraba', 'Vagem', 'Chuchu', 'Quiabo', 'Pepino', 'Feijão-de-Porco', 'Milho Verde'],
  MEDICINAL: ['Guaco', 'Capim-Limão', 'Boldo Brasileiro', 'Alecrim', 'Tanchagem', 'Ora-pro-nóbis', 'Citronela', 'Erva-Cidreira', 'Losna', 'Abre-Caminho', 'Anador', 'Arnica', 'Bálsamo', 'Babosa', 'Espinheira-Santa', 'Aranto', 'Alfavaca', 'Alfazema', 'Anil', 'Avelós', 'Boldo-da-Terra', 'Calêndula', 'Camomila', 'Canforeiro', 'Capuchinha', 'Carqueja', 'Erva-de-Santa-Maria', 'Funcho', 'Hortelã-Pimenta', 'Levante', 'Macelinha', 'Malvarisco', 'Melissa', 'Mil-Folhas', 'Poejo', 'Quebra-Pedra', 'Sálvia', 'Stevia']
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
    <div className="min-h-screen bg-[#fdfcf7] font-sans text-stone-900 pb-20">
      <nav className="bg-white/90 backdrop-blur-md border-b border-stone-200 p-4 flex justify-between items-center sticky top-0 z-50 px-6">
        <div className="flex items-center font-black text-2xl text-green-900 tracking-tighter cursor-pointer" onClick={() => {setStep('hero'); setActiveTab('app');}}>
          <div className="bg-green-600 p-1.5 rounded-xl mr-2 shadow-lg shadow-green-200"><Leaf className="text-white w-6 h-6" /></div>
          SINTROPLAN
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setActiveTab('app')} className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'app' ? 'text-green-600' : 'text-stone-400'}`}>Gerador</button>
          <button onClick={() => setActiveTab('library')} className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'library' ? 'text-green-600' : 'text-stone- stone-400'}`}>Biblioteca</button>
          {user ? (
            <button onClick={() => signOut()} className="text-stone-300 hover:text-red-500 transition-all"><LogOut className="w-5 h-5" /></button>
          ) : (
            <button onClick={handleGoogleLogin} className="bg-green-700 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Entrar</button>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4">
        {step === 'hero' && (
          <div className="py-10 md:py-20 animate-in fade-in duration-700">
            <div className="relative rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white min-h-[600px] flex items-center">
              <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="Agrofloresta"/>
                <div className="absolute inset-0 bg-gradient-to-r from-green-950/95 via-green-900/60 to-transparent" />
              </div>
              <div className="relative z-10 p-8 md:p-24 max-w-3xl">
                <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.85] mb-8 tracking-tighter uppercase">Sua Terra <br/><span className="text-green-400">Viva.</span></h1>
                <p className="text-xl text-green-100/80 font-medium mb-12 max-w-md">Planeje sistemas agroflorestais profissionais com design visual e sucessão natural.</p>
                <button onClick={() => setStep('form')} className="bg-green-500 text-green-950 px-12 py-8 rounded-[2.5rem] font-black text-2xl hover:bg-green-400 shadow-2xl transition-all active:scale-95">COMEÇAR AGORA</button>
              </div>
            </div>
          </div>
        )}

        {step === 'form' && (
          <div className="py-20 max-w-2xl mx-auto animate-in zoom-in-95">
             <div className="bg-white rounded-[5rem] shadow-2xl p-16 md:p-24 border-4 border-green-50 text-center">
                <h2 className="text-4xl font-black mb-12 text-stone-800 uppercase tracking-tighter">Área de Plantio</h2>
                <div className="relative mb-12">
                  <input type="number" className="w-full p-10 bg-stone-50 border-4 border-stone-100 rounded-[3rem] text-center text-7xl font-black outline-none focus:border-green-500 transition-all" value={area} onChange={e => setArea(e.target.value)} placeholder="0" />
                  <span className="absolute right-10 top-1/2 -translate-y-1/2 font-black text-stone-200 text-3xl">m²</span>
                </div>
                <button onClick={gerarPlano} className="w-full py-8 bg-green-700 text-white font-black rounded-[3rem] text-2xl shadow-xl hover:bg-green-800 transition-all">GERAR MEU CANTEIRO DIGITAL</button>
             </div>
          </div>
        )}

        {step === 'results' && result && (
          <div className="py-12 animate-in slide-in-from-bottom-10 duration-700">
            {/* TÍTULO DO PROJETO */}
            <div className="text-center mb-16">
              <h3 className="text-5xl font-black uppercase text-stone-800 tracking-tighter">Canteiro Digital</h3>
              <p className="text-stone-400 font-bold text-sm uppercase tracking-[0.3em] mt-3">Design de Sucessão para {area}m²</p>
            </div>

            {/* AQUI ESTÁ O CANTEIRO VISUAL QUE VOCÊ PEDIU */}
            <div className="bg-[#0f1f14] p-10 md:p-20 rounded-[5rem] mb-16 shadow-2xl border-[12px] border-white relative overflow-hidden">
               {/* Grade do Solo */}
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:40px_40px]" />
               
               <div className="relative z-10">
                  <div className="flex flex-col gap-10">
                     {/* LINHA CENTRAL: OS GIGANTES */}
                     <div className="flex justify-center items-center gap-20 p-12 bg-green-900/20 rounded-[4rem] border-2 border-dashed border-green-700/50">
                        <div className="text-center">
                           <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white shadow-[0_0_40px_rgba(16,185,129,0.4)] mx-auto mb-4 scale-110">
                              <TreeDeciduous className="text-white w-14 h-14" />
                           </div>
                           <p className="text-emerald-400 font-black text-[10px] uppercase tracking-widest mb-1">Emergente</p>
                           <p className="text-white font-black text-xl">{result.emergente}</p>
                        </div>
                        <div className="text-center">
                           <div className="w-28 h-28 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-xl mx-auto mb-4">
                              <TreeDeciduous className="text-white w-12 h-12" />
                           </div>
                           <p className="text-green-400 font-black text-[10px] uppercase tracking-widest mb-1">Alto</p>
                           <p className="text-white font-black text-xl">{result.alto}</p>
                        </div>
                     </div>

                     {/* LINHAS LATERAIS: MÉDIO E BAIXO */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="bg-white/5 p-10 rounded-[3rem] border-2 border-white/10 text-center">
                           <div className="w-20 h-20 bg-lime-500 rounded-full flex items-center justify-center border-4 border-white mx-auto mb-4 shadow-lg">
                              <Sprout className="text-white w-10 h-10" />
                           </div>
                           <p className="text-lime-400 font-black text-[9px] uppercase mb-1">Médio</p>
                           <p className="text-white font-black text-lg">{result.medio}</p>
                        </div>
                        <div className="bg-white/5 p-10 rounded-[3rem] border-2 border-white/10 text-center">
                           <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center border-4 border-white mx-auto mb-4 shadow-lg">
                              <Sprout className="text-white w-10 h-10" />
                           </div>
                           <p className="text-yellow-400 font-black text-[9px] uppercase mb-1">Baixo</p>
                           <p className="text-white font-black text-lg">{result.baixo}</p>
                        </div>
                     </div>

                     {/* COBERTURA DE SOLO: HORTALIÇAS */}
                     <div className="bg-amber-900/10 p-8 rounded-[3rem] border-2 border-dashed border-amber-900/30 flex flex-wrap justify-center gap-16">
                        <div className="text-center">
                           <p className="text-orange-400 font-black text-[8px] uppercase mb-2">Verdura</p>
                           <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                              <Wheat className="text-orange-400 w-4 h-4" />
                              <span className="text-white font-black text-sm uppercase">{result.verdura}</span>
                           </div>
                        </div>
                        <div className="text-center">
                           <p className="text-red-400 font-black text-[8px] uppercase mb-2">Legume</p>
                           <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                              <Carrot className="text-red-400 w-4 h-4" />
                              <span className="text-white font-black text-sm uppercase">{result.legume}</span>
                           </div>
                        </div>
                        <div className="text-center">
                           <p className="text-purple-400 font-black text-[8px] uppercase mb-2">Medicinal</p>
                           <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                              <Pill className="text-purple-400 w-4 h-4" />
                              <span className="text-white font-black text-sm uppercase">{result.medicinal}</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex justify-center gap-6">
              <button onClick={() => setStep('form')} className="bg-stone-900 text-white px-12 py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-105 transition-all">Refazer Design</button>
              <button className="bg-white border-4 border-stone-100 text-stone-600 px-12 py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-stone-50 transition-all">Guia de Manejo</button>
            </div>
          </div>
        )}

        {activeTab === 'library' && (
          <div className="py-12 animate-in fade-in">
             <div className="text-center mb-16">
                <h2 className="text-5xl font-black uppercase tracking-tighter">Biblioteca Botânica</h2>
                <div className="max-w-xl mx-auto mt-10 relative">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 w-6 h-6" />
                   <input className="w-full pl-16 pr-6 py-6 rounded-[3rem] border-8 border-white shadow-2xl outline-none focus:border-green-500 font-bold" placeholder="Pesquisar entre as centenas de espécies..." onChange={e => setSearchTerm(e.target.value)} />
                </div>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Object.entries(PLANTS_DATA).flatMap(([stratum, list]) => 
                  list.map((name, i) => (
                    <div key={name + i} className="bg-white p-6 rounded-[2.5rem] border-2 border-stone-50 shadow-sm hover:border-green-200 hover:-translate-y-1 transition-all group">
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
