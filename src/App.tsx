import React, { useState, useEffect } from 'react';
import { 
  Leaf, Sprout, Loader2, TreeDeciduous, Carrot, LogOut, LogIn, History, Trash2, Wheat, Pill, Search, ChevronRight, BookOpen, Map as MapIcon
} from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './services/supabase';

// BANCO DE DADOS COMPLETO - TODAS AS LISTAS INTEGRADAS
const PLANTS_DATA = {
  EMERGENTE: ['Angico-Vermelho', 'Angico-Branco', 'Cedro-Rosa', 'Jequitibá-Rosa', 'Ipê-Roxo', 'Açoita-Cavalo', 'Pau-Brasil', 'Guanandi', 'Jacarandá-da-Bahia', 'Baru', 'Buriti', 'Pinho-do-Paraná', 'Mogno Africano', 'Louro-Pardo', 'Canafístula', 'Pau-Ferro', 'Copaíba', 'Andiroba', 'Sumaúma', 'Grápia', 'Garapuvu', 'Amesclão', 'Amendoim-Bravo', 'Monjoleiro', 'Pau-d’Alho', 'Cabreúva', 'Canjarana', 'Vinhático'],
  ALTO: ['Bananeira Prata', 'Abacateiro', 'Jatobá', 'Jatobá-do-Cerrado', 'Ingá-Cipó', 'Ingá-Feijão', 'Cajá', 'Açaí', 'Açaí-Solteiro', 'Cupuaçu', 'Jenipapo', 'Bacuri', 'Mangueira', 'Pequi', 'Macaúba', 'Babaçu', 'Bacaba', 'Biribá', 'Cagaita', 'Caju-do-Cerrado', 'Patauá', 'Tucumã', 'Umbu', 'Umbu-Cajá', 'Tarumã', 'Seringueira', 'Cerejeira-da-Amazônia'],
  MEDIO: ['Café', 'Cacau', 'Jabuticaba', 'Uvaia', 'Pitangueira', 'Cambuci', 'Cambuí', 'Mandioca', 'Acerola', 'Abiu', 'Bacupari', 'Araçá-Boi', 'Araçá-Pêra', 'Camu-Camu', 'Gabiroba', 'Guabiroba', 'Guaraná', 'Gueroba', 'Jacaratiá', 'Mangaba', 'Mapati', 'Murici', 'Sapota', 'Sorva', 'Umari', 'Uvi', 'Amora-Preta', 'Sete-Capotes', 'Cereja-do-Rio-Grande'],
  BAIXO: ['Abacaxi', 'Araçá', 'Araçá-Cagão', 'Feijão-Guandu', 'Taioba', 'Inhame', 'Batata-Doce', 'Fisalis', 'Cúrcuma', 'Gengibre', 'Arumbeva', 'Mandacaru', 'Beldroega', 'Peixinho da Horta', 'Jurubeba', 'Mini-pepininho', 'Croá', 'Cubiu', 'Pêra-do-Cerrado'],
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

    if (user) {
      await supabase.from('projetos').insert([{ user_id: user.id, area, ...novo }]);
    }

    setTimeout(() => {
      setResult(novo);
      setLoading(false);
      setStep('results');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#fdfcf7] font-sans text-stone-900 pb-20">
      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-stone-200 p-4 flex justify-between items-center sticky top-0 z-50 px-6">
        <div className="flex items-center font-black text-2xl text-green-900 tracking-tighter cursor-pointer" onClick={() => {setStep('hero'); setActiveTab('app');}}>
          <div className="bg-green-600 p-1.5 rounded-lg mr-2 shadow-lg">
             <Leaf className="text-white w-6 h-6" />
          </div>
          SINTROPLAN
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <button onClick={() => signOut()} className="bg-stone-100 p-2 rounded-full text-stone-400 hover:text-red-500 transition-all"><LogOut className="w-5 h-5" /></button>
          ) : (
            <button onClick={handleGoogleLogin} className="bg-green-700 text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase hover:bg-green-800 transition-all">Entrar</button>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4">
        {step === 'hero' && (
          <div className="py-12 md:py-20">
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white h-[600px] flex items-center">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2000" 
                  alt="Agrofloresta" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 via-green-900/40 to-transparent" />
              </div>
              <div className="relative z-10 p-8 md:p-20 max-w-2xl">
                <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.85] mb-8 tracking-tighter">Crie sua <br/><span className="text-green-400">floresta.</span></h1>
                <p className="text-xl text-green-100/80 font-medium mb-10 max-w-md">Combine centenas de espécies nativas e frutíferas com a inteligência da sucessão natural.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => setStep('form')} className="bg-green-500 text-green-950 px-12 py-6 rounded-full font-black text-xl hover:bg-green-400 shadow-xl transition-all">COMEÇAR AGORA</button>
                  <button onClick={() => setActiveTab('library')} className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-6 rounded-full font-black text-xs uppercase hover:bg-white/20 transition-all">BIBLIOTECA</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'form' && (
          <div className="py-12 max-w-xl mx-auto">
             <div className="bg-white rounded-[4rem] shadow-2xl p-12 border-2 border-green-50 text-center">
                <h2 className="text-3xl font-black mb-10 uppercase text-stone-800">Área de Plantio (m²)</h2>
                <input type="number" className="w-full p-8 bg-stone-50 border-4 border-stone-100 rounded-[2.5rem] text-center text-5xl font-black outline-none focus:border-green-500 transition-all mb-10" placeholder="0" value={area} onChange={e => setArea(e.target.value)} />
                <button onClick={gerarPlano} disabled={loading || !area} className="w-full py-8 bg-green-700 text-white font-black rounded-full text-xl shadow-xl hover:bg-green-800 transition-all">
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : 'GERAR MEU PLANO'}
                </button>
             </div>
          </div>
        )}

        {step === 'results' && result && (
           <div className="py-12 animate-in slide-in-from-bottom-8 duration-500">
             <h3 className="text-4xl font-black uppercase text-center mb-12 tracking-tighter">Seu Consórcio</h3>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { l: 'Emergente', v: result.emergente, c: 'bg-emerald-50' },
                  { l: 'Alto', v: result.alto, c: 'bg-green-50' },
                  { l: 'Médio', v: result.medio, c: 'bg-lime-50' },
                  { l: 'Baixo', v: result.baixo, c: 'bg-yellow-50' },
                  { l: 'Verdura', v: result.verdura, c: 'bg-orange-50' },
                  { l: 'Legume', v: result.legume, c: 'bg-red-50' },
                  { l: 'Medicinal', v: result.medicinal, c: 'bg-purple-50' }
                ].map((s, idx) => (
                  <div key={idx} className={`${s.c} p-8 rounded-[3rem] border-2 border-white shadow-sm flex flex-col items-center text-center`}>
                    <p className="text-[10px] font-black text-stone-400 uppercase mb-2">{s.l}</p>
                    <p className="font-black text-xl leading-tight text-stone-800">{s.v}</p>
                  </div>
                ))}
             </div>
             <button onClick={() => setStep('form')} className="mt-12 block mx-auto bg-stone-900 text-white px-10 py-5 rounded-full font-black uppercase text-xs">Refazer</button>
           </div>
        )}

        {activeTab === 'library' && (
          <div className="py-12">
            <h2 className="text-4xl font-black uppercase text-center mb-12">Biblioteca Completa</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(PLANTS_DATA).flatMap(([stratum, list]) => 
                list.map((name, i) => (
                  <div key={name + i} className="bg-white p-6 rounded-[2.5rem] border shadow-sm">
                    <span className="text-[7px] font-black bg-stone-100 px-2 py-1 rounded-full uppercase">{stratum}</span>
                    <h4 className="font-black text-sm mt-3 text-stone-800">{name}</h4>
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
