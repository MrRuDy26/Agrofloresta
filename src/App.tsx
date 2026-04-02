import React, { useState, useEffect } from 'react';
import { 
  Leaf, Sprout, Loader2, TreeDeciduous, Carrot, LogOut, LogIn, History, Trash2, Wheat, Pill, Search, ChevronRight, BookOpen, Info, Calendar, Scissors, Apple, CheckCircle2
} from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './services/supabase';

// BANCO DE DADOS ORGANIZADO PARA SELEÇÃO
const PLANTS_DATABASE = {
  FLORESTAL: ['Mogno Africano', 'Eucalipto', 'Jatobá', 'Angico-Vermelho', 'Cedro-Rosa', 'Ipê-Roxo', 'Pau-Brasil', 'Guanandi', 'Jacarandá-da-Bahia', 'Baru', 'Pau-Ferro', 'Copaíba'],
  FRUTIFERAS: ['Abacateiro', 'Laranjeira', 'Mimosa (Tangerina)', 'Limoeiro', 'Goiabeira', 'Mamoeiro', 'Café', 'Cacau', 'Jabuticaba', 'Uvaia', 'Pitangueira', 'Açaí', 'Cupuaçu', 'Manga', 'Figo', 'Caqui'],
  CURTO_PRAZO: ['Milho', 'Feijão', 'Batata-Doce', 'Mandioca', 'Abóbora', 'Tomate', 'Morango', 'Melancia', 'Cenoura', 'Alho', 'Alho-Poró', 'Pimentão', 'Quiabo'],
  TEMPEROS: ['Orégano', 'Manjericão', 'Salsa', 'Cebolinha', 'Alecrim', 'Tomilho', 'Pimenta-do-Reino', 'Dedo-de-Moça', 'Hortelã', 'Sálvia']
};

function AppContent() {
  const [activeTab, setActiveTab] = useState<'app' | 'library' | 'history'>('app');
  const [step, setStep] = useState<'hero' | 'area' | 'select_trees' | 'select_fruits' | 'select_crops' | 'results'>('hero');
  const [area, setArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPlants, setSelectedPlants] = useState<string[]>([]);
  const { user, signOut } = useAuth();

  const togglePlant = (plant: string) => {
    setSelectedPlants(prev => 
      prev.includes(plant) ? prev.filter(p => p !== plant) : [...prev, plant]
    );
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
  };

  const finalizarProjeto = () => {
    setLoading(true);
    // Aqui no futuro podemos enviar para o Supabase
    setTimeout(() => {
      setLoading(false);
      setStep('results');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF7] font-sans text-[#1A1C19] pb-20">
      <nav className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-50 px-6 shadow-sm">
        <div className="flex items-center font-black text-2xl text-green-900 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="bg-green-700 p-1.5 rounded-lg mr-2 shadow-lg"><Leaf className="text-white w-6 h-6" /></div>
          SINTROPLAN
        </div>
        <div className="flex items-center gap-4">
          {!user && <button onClick={handleGoogleLogin} className="bg-green-800 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase">Login</button>}
          {user && <button onClick={() => signOut()} className="text-stone-300 hover:text-red-500"><LogOut className="w-5 h-5" /></button>}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4">
        {step === 'hero' && (
          <div className="py-12 md:py-24 text-center">
            <div className="bg-[#0D2B1D] rounded-[4rem] p-12 md:p-24 shadow-2xl relative overflow-hidden">
               <div className="relative z-10">
                  <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter">PLANEJE SUA <br/><span className="text-green-500">PRODUÇÃO.</span></h1>
                  <p className="text-xl text-green-100 mb-12 max-w-2xl mx-auto">Não sorteamos plantas. Você escolhe o que quer colher, nós organizamos a inteligência do plantio adensado.</p>
                  <button onClick={() => setStep('area')} className="bg-green-600 text-white px-16 py-8 rounded-full font-black text-2xl hover:bg-green-500 shadow-xl transition-all uppercase">Iniciar Planejador</button>
               </div>
            </div>
          </div>
        )}

        {step === 'area' && (
          <div className="py-20 max-w-2xl mx-auto text-center">
             <div className="bg-white rounded-[4rem] shadow-2xl p-16 border">
                <h2 className="text-3xl font-black mb-10 text-green-900 uppercase">Qual o tamanho da área?</h2>
                <input type="number" className="w-full p-10 bg-stone-50 border-b-8 border-green-600 rounded-3xl text-center text-6xl font-black outline-none mb-10" value={area} onChange={e => setArea(e.target.value)} placeholder="m²" />
                <button onClick={() => setStep('select_trees')} className="w-full py-8 bg-green-700 text-white font-black rounded-3xl text-xl hover:bg-green-800 transition-all">PRÓXIMO PASSO</button>
             </div>
          </div>
        )}

        {(step === 'select_trees' || step === 'select_fruits' || step === 'select_crops') && (
          <div className="py-12 animate-in fade-in">
             <div className="text-center mb-12">
                <h3 className="text-4xl font-black uppercase text-green-900">
                   {step === 'select_trees' ? 'Escolha suas Árvores (Dossel)' : 
                    step === 'select_fruits' ? 'Escolha suas Frutas' : 'Hortaliças e Temperos'}
                </h3>
                <p className="text-stone-400 font-bold uppercase text-[10px] tracking-widest mt-2">Selecione as espécies que deseja no seu canteiro</p>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {(step === 'select_trees' ? PLANTS_DATABASE.FLORESTAL : 
                  step === 'select_fruits' ? PLANTS_DATABASE.FRUTIFERAS : 
                  [...PLANTS_DATABASE.CURTO_PRAZO, ...PLANTS_DATABASE.TEMPEROS]).map((plant) => (
                  <button 
                    key={plant} 
                    onClick={() => togglePlant(plant)}
                    className={`p-6 rounded-[2rem] border-4 transition-all text-left flex justify-between items-center ${selectedPlants.includes(plant) ? 'border-green-600 bg-green-50 shadow-inner' : 'border-white bg-white shadow-sm'}`}
                  >
                    <span className="font-black text-sm uppercase leading-tight">{plant}</span>
                    {selectedPlants.includes(plant) && <CheckCircle2 className="text-green-600 w-5 h-5 flex-shrink-0" />}
                  </button>
                ))}
             </div>

             <div className="flex justify-between items-center max-w-4xl mx-auto bg-white p-6 rounded-full shadow-xl border sticky bottom-10">
                <p className="font-black text-stone-400 text-xs px-6 uppercase">{selectedPlants.length} plantas selecionadas</p>
                <button 
                  onClick={() => {
                    if (step === 'select_trees') setStep('select_fruits');
                    else if (step === 'select_fruits') setStep('select_crops');
                    else finalizarProjeto();
                  }} 
                  className="bg-green-700 text-white px-10 py-4 rounded-full font-black uppercase text-xs hover:bg-green-800 transition-all"
                >
                  Continuar <ChevronRight className="inline w-4 h-4 ml-1" />
                </button>
             </div>
          </div>
        )}

        {step === 'results' && (
          <div className="py-12 animate-in slide-in-from-bottom-10">
             <div className="text-center mb-16">
                <h3 className="text-5xl font-black uppercase text-green-950">Seu Design Personalizado</h3>
                <p className="text-stone-400 font-bold uppercase text-sm mt-3 tracking-widest italic">Integração técnica para {area}m²</p>
             </div>

             <div className="bg-white rounded-[4rem] shadow-2xl p-12 mb-12 border border-stone-100">
                <h4 className="text-2xl font-black mb-8 text-green-900 border-l-8 border-green-600 pl-6 uppercase tracking-tighter">Manual de Plantio Adensado</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div>
                      <h5 className="font-black text-stone-400 text-[10px] uppercase mb-4 tracking-[0.3em]">Composição do Sistema</h5>
                      <div className="flex flex-wrap gap-2">
                         {selectedPlants.map(p => (
                           <span key={p} className="bg-stone-50 border px-4 py-2 rounded-full text-xs font-bold text-stone-600">
                             {p}
                           </span>
                         ))}
                      </div>
                   </div>
                   <div className="bg-green-950 p-8 rounded-[3rem] text-white">
                      <div className="flex items-center gap-4 mb-6">
                         <Calendar className="text-green-400" />
                         <h5 className="font-black uppercase text-lg italic">Próximos Manejos</h5>
                      </div>
                      <ul className="space-y-4 text-sm font-medium text-green-100/80 leading-relaxed">
                         <li>• <strong>Mês 0:</strong> Plantio da muvuca adensada no mesmo berço/sulco.</li>
                         <li>• <strong>Mês 3:</strong> Manejo de ervas para cobertura radical do solo.</li>
                         <li>• <strong>Ano 1.5:</strong> Poda de sincronização para liberar luz às frutíferas.</li>
                      </ul>
                   </div>
                </div>
             </div>

             <button onClick={() => window.location.reload()} className="block mx-auto bg-stone-900 text-white px-12 py-6 rounded-full font-black uppercase text-xs tracking-widest hover:opacity-90">Criar Novo Projeto</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() { return (<AuthProvider><AppContent /></AuthProvider>); }
