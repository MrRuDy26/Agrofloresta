import React, { useState } from 'react';
import { 
  Leaf, Sprout, TreeDeciduous, Carrot, LogOut, Search, ChevronRight, CheckCircle2, Apple, Scissors, Calendar
} from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './services/supabase';

// BANCO DE DADOS DE ESPÉCIES
const ALL_PLANTS = {
  FLORESTAL: [
    'Angico-Vermelho', 'Angico-Branco', 'Angico-Preto', 'Cedro-Rosa', 'Cedro-Vermelho', 'Jequitibá-Rosa', 'Jequitibá-Branco', 'Ipê-Roxo', 'Ipê-Amarelo', 'Açoita-Cavalo', 'Pau-Brasil', 'Guanandi', 'Jacarandá-da-Bahia', 'Jacarandá-Caviúna', 'Baru', 'Buriti', 'Pinho-do-Paraná', 'Mogno Africano', 'Louro-Pardo', 'Canafístula', 'Pau-Ferro', 'Copaíba', 'Andiroba', 'Sumaúma', 'Grápia', 'Garapuvu', 'Amesclão', 'Amendoim-Bravo', 'Monjoleiro', 'Pau-d’Alho', 'Cabreúva', 'Canjarana', 'Vinhático', 'Eucalipto'
  ],
  FRUTIFERAS: [
    'Abacateiro', 'Bananeira Prata', 'Bananeira Nanica', 'Jatobá', 'Ingá-Cipó', 'Ingá-Feijão', 'Cajá', 'Açaí', 'Cupuaçu', 'Jenipapo', 'Bacuri', 'Mangueira', 'Pequi', 'Macaúba', 'Babaçu', 'Bacaba', 'Biribá', 'Cagaita', 'Caju-do-cerrado', 'Umbu', 'Umbu-cajá', 'Tarumã', 'Laranjeira', 'Mimosa (Tangerina)', 'Limoeiro', 'Goiabeira', 'Mamoeiro', 'Café', 'Cacau', 'Jabuticaba', 'Uvaia', 'Pitangueira', 'Cambuci', 'Acerola', 'Abiu', 'Bacupari', 'Araçá-boi', 'Camu-camu', 'Gabiroba', 'Guaraná', 'Jacaritiá', 'Mangaba', 'Murici', 'Sapota', 'Amora-preta', 'Figo', 'Romã', 'Caqui', 'Pêssego'
  ],
  HORTA: [
    'Alface', 'Rúcula', 'Couve', 'Espinafre', 'Agrião', 'Salsa', 'Coentro', 'Manjericão', 'Serralha', 'Cebolinha', 'Tomate', 'Cenoura', 'Abóbora', 'Berinjela', 'Pimentão', 'Beterraba', 'Vagem', 'Chuchu', 'Quiabo', 'Pepino', 'Milho', 'Feijão', 'Batata-Doce', 'Batata-Inglesa', 'Alho', 'Alho-Poró', 'Melão', 'Melancia', 'Morango', 'Abacaxi', 'Inhame', 'Mandioca', 'Fisalis', 'Cúrcuma', 'Gengibre', 'Pimenta Dedo de Moça', 'Pimenta Biquinho', 'Orégano', 'Alecrim', 'Tomilho', 'Sálvia', 'Guaco', 'Capim-Limão', 'Boldo', 'Tanchagem', 'Ora-pro-nóbis'
  ]
};

function AppContent() {
  const { user, signOut } = useAuth();
  const [step, setStep] = useState<'hero' | 'area' | 'selection' | 'results'>('hero');
  const [subStep, setSubStep] = useState<number>(0); 
  const [area, setArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPlants, setSelectedPlants] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const stepsInfo = [
    { key: 'FLORESTAL', title: 'Árvores e Madeiras', icon: <TreeDeciduous className="w-6 h-6" /> },
    { key: 'FRUTIFERAS', title: 'Pomar e Frutas', icon: <Apple className="w-6 h-6" /> },
    { key: 'HORTA', title: 'Hortaliças e Temperos', icon: <Carrot className="w-6 h-6" /> }
  ];

  const currentCategory = stepsInfo[subStep]?.key as keyof typeof ALL_PLANTS;

  const togglePlant = (plant: string) => {
    setSelectedPlants(prev => 
      prev.includes(plant) ? prev.filter(p => p !== plant) : [...prev, plant]
    );
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ 
      provider: 'google', 
      options: { redirectTo: window.location.origin } 
    });
  };

  // FUNÇÃO DE FINALIZAÇÃO ATUALIZADA COM SUPABASE
  const finalizarProjeto = async () => {
    if (!area || selectedPlants.length === 0) {
      alert("Por favor, defina a área e selecione ao menos uma planta.");
      return;
    }

    setLoading(true);
    
    try {
      if (user) {
        const { error } = await supabase
          .from('planejamentos')
          .insert([
            { 
              user_id: user.id, 
              area: area, 
              plantas_selecionadas: selectedPlants 
            }
          ]);

        if (error) throw error;
      }
      
      setStep('results');
    } catch (error) {
      console.error("Erro ao salvar:", error);
      // Mesmo com erro no banco, mostramos o resultado para o usuário não travar
      setStep('results');
    } finally {
      setLoading(false);
    }
  };

  const proximoPasso = () => {
    if (subStep < 2) {
      setSubStep(subStep + 1);
      setSearchTerm('');
      window.scrollTo(0, 0);
    } else {
      finalizarProjeto();
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF7] font-sans text-[#1A1C19] pb-20">
      <nav className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-50 px-6 shadow-sm">
        <div className="flex items-center font-black text-2xl text-green-900 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="bg-green-700 p-1.5 rounded-lg mr-2"><Leaf className="text-white w-6 h-6" /></div>
          SINTROPLAN
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <button onClick={() => signOut()} className="text-stone-400 hover:text-red-500"><LogOut className="w-5 h-5" /></button>
          ) : (
            <button onClick={handleGoogleLogin} className="bg-green-800 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase">Entrar</button>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4">
        {step === 'hero' && (
          <div className="py-12 md:py-24 text-center">
            <div className="bg-[#0D2B1D] rounded-[4rem] p-12 md:p-24 shadow-2xl relative overflow-hidden">
               <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase relative">Planeje sua <br/><span className="text-green-500">Muvuca.</span></h1>
               <p className="text-xl text-green-100 mb-12 max-w-2xl mx-auto relative italic">Você escolhe o destino, nós entregamos o caminho técnico.</p>
               <button onClick={() => setStep('area')} className="bg-green-600 text-white px-16 py-8 rounded-full font-black text-2xl hover:bg-green-500 shadow-xl transition-all uppercase relative">Iniciar Planejador</button>
            </div>
          </div>
        )}

        {step === 'area' && (
          <div className="py-20 max-w-2xl mx-auto text-center">
             <div className="bg-white rounded-[4rem] shadow-2xl p-16 border-4 border-stone-50">
                <h2 className="text-3xl font-black mb-10 text-green-900 uppercase tracking-tighter">Tamanho da Área (m²)</h2>
                <input type="number" className="w-full p-8 bg-stone-50 border-b-8 border-green-600 rounded-3xl text-center text-6xl font-black outline-none mb-10" value={area} onChange={e => setArea(e.target.value)} placeholder="0" />
                <button onClick={() => setStep('selection')} className="w-full py-8 bg-green-700 text-white font-black rounded-3xl text-xl hover:bg-green-800 transition-all uppercase">Escolher Plantas</button>
             </div>
          </div>
        )}

        {step === 'selection' && (
          <div className="py-12">
             <div className="text-center mb-10">
                <div className="flex justify-center gap-2 mb-6">
                   {[0, 1, 2].map(i => (
                     <div key={i} className={`h-2 w-12 rounded-full ${subStep === i ? 'bg-green-600' : 'bg-stone-200'}`} />
                   ))}
                </div>
                <h3 className="text-4xl font-black uppercase text-green-900 flex items-center justify-center gap-3">
                   {stepsInfo[subStep]?.icon} {stepsInfo[subStep]?.title}
                </h3>
             </div>

             <div className="max-w-xl mx-auto mb-10 relative px-4">
                <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-stone-300 w-5 h-5" />
                <input 
                  className="w-full pl-16 pr-6 py-5 rounded-full border-4 border-white shadow-xl outline-none focus:border-green-500 font-bold" 
                  placeholder="Pesquisar na lista..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[500px] overflow-y-auto p-6 bg-stone-100 rounded-[3rem] border-8 border-white shadow-inner">
                {currentCategory && ALL_PLANTS[currentCategory]
                  .filter(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((plant) => (
                  <button 
                    key={plant} 
                    onClick={() => togglePlant(plant)}
                    className={`p-5 rounded-3xl border-4 transition-all text-left flex justify-between items-start ${selectedPlants.includes(plant) ? 'border-green-600 bg-green-50' : 'border-transparent bg-white shadow-sm hover:border-green-100'}`}
                  >
                    <span className="font-black text-[11px] uppercase leading-tight text-stone-700">{plant}</span>
                    {selectedPlants.includes(plant) && <CheckCircle2 className="text-green-600 w-4 h-4 flex-shrink-0 ml-2" />}
                  </button>
                ))}
             </div>

             <div className="flex justify-between items-center max-w-5xl mx-auto bg-[#0D2B1D] p-6 rounded-[2.5rem] shadow-2xl mt-12 sticky bottom-6 border-4 border-green-900/50 z-40">
                <div className="px-6 text-white">
                   <p className="text-green-400 font-black text-[10px] uppercase mb-1">Selecionados</p>
                   <p className="font-black text-2xl">{selectedPlants.length}</p>
                </div>
                <button 
                  onClick={proximoPasso} 
                  disabled={loading}
                  className="bg-green-500 text-[#0D2B1D] px-12 py-5 rounded-full font-black uppercase text-sm hover:bg-green-400 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Processando...' : (subStep === 2 ? 'Finalizar Projeto' : 'Próxima Etapa')} <ChevronRight className="w-5 h-5" />
                </button>
             </div>
          </div>
        )}

        {step === 'results' && (
          <div className="py-12">
             <div className="text-center mb-16">
                <h3 className="text-5xl font-black uppercase text-green-950 tracking-tighter italic">Seu Design Personalizado</h3>
                <p className="text-stone-400 font-bold uppercase text-sm mt-3 tracking-widest italic">Integração para {area}m² com Plantio Adensado</p>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="bg-white p-10 rounded-[4rem] shadow-xl border">
                   <h4 className="font-black text-green-900 uppercase mb-6 border-b pb-4">Sua Composição</h4>
                   <div className="flex flex-wrap gap-2">
                      {selectedPlants.map(p => (
                        <span key={p} className="bg-stone-50 border px-3 py-1.5 rounded-full text-[10px] font-black text-stone-500 uppercase">{p}</span>
                      ))}
                   </div>
                </div>
                
                <div className="lg:col-span-2 bg-[#0D2B1D] p-12 rounded-[4rem] text-white shadow-2xl">
                   <h4 className="font-black text-2xl uppercase mb-8 text-green-400 italic flex items-center gap-3">
                      <Calendar className="w-6 h-6" /> Plano de Manejo Sugerido
                   </h4>
                   <div className="space-y-8">
                      <div className="flex gap-4">
                         <div className="bg-green-700/50 p-3 rounded-2xl h-fit"><Scissors className="w-5 h-5 text-green-400" /></div>
                         <div>
                            <p className="font-black text-xs uppercase text-green-400 mb-1">Mês 0 a 8</p>
                            <p className="text-green-100 text-sm leading-relaxed font-medium">Plantio total das sementes e mudas. Colheita das hortaliças de ciclo curto para manutenção e fluxo de caixa.</p>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <div className="bg-green-700/50 p-3 rounded-2xl h-fit"><Sprout className="w-5 h-5 text-green-400" /></div>
                         <div>
                            <p className="font-black text-xs uppercase text-green-400 mb-1">Poda de Sincronização</p>
                            <p className="text-green-100 text-sm leading-relaxed font-medium">Poda drástica das espécies de biomassa após 18 meses para cobrir o solo e liberar luz às frutíferas.</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <button onClick={() => window.location.reload()} className="block mx-auto bg-stone-900 text-white px-14 py-7 rounded-full font-black uppercase text-xs tracking-widest hover:opacity-90 shadow-xl transition-all">Novo Planejamento</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() { return (<AuthProvider><AppContent /></AuthProvider>); }
