import React, { useState, useEffect } from 'react';
import { 
  Leaf, Sprout, Loader2, TreeDeciduous, Carrot, LogOut, LogIn, RefreshCw, BookOpen, Layout, History, Trash2, Calendar, Wheat, Pill, Search, Flower2
} from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './services/supabase';

const PLANTS_LIBRARY = [
  // EMERGENTES (Copa que passa todo mundo)
  { name: 'Eucalipto', stratum: 'EMERGENTE', family: 'Myrtaceae', origin: 'Austrália', function: 'Biomassa Rápida' },
  { name: 'Mogno Africano', stratum: 'EMERGENTE', family: 'Meliaceae', origin: 'África', function: 'Madeira Nobre' },
  { name: 'Pinho Cuiabano', stratum: 'EMERGENTE', family: 'Fabaceae', origin: 'Brasil', function: 'Sombra e Crescimento' },
  { name: 'Ipê Amarelo', stratum: 'EMERGENTE', family: 'Bignoniaceae', origin: 'Brasil', function: 'Nativa/Melífera' },
  { name: 'Guanandi', stratum: 'EMERGENTE', family: 'Calophyllaceae', origin: 'Brasil', function: 'Madeira de Lei' },
  { name: 'Paricá', stratum: 'EMERGENTE', family: 'Fabaceae', origin: 'Amazônia', function: 'Crescimento Acelerado' },

  // ALTO (Copa principal)
  { name: 'Bananeira Prata', stratum: 'ALTO', family: 'Musaceae', origin: 'Ásia', function: 'Ciclagem de Água' },
  { name: 'Abacateiro', stratum: 'ALTO', family: 'Lauraceae', origin: 'México', function: 'Gordura/Fruta' },
  { name: 'Mangueira', stratum: 'ALTO', family: 'Anacardiaceae', origin: 'Ásia', function: 'Fruta/Sombra' },
  { name: 'Jatobá', stratum: 'ALTO', family: 'Fabaceae', origin: 'Brasil', function: 'Nativa/Alimento' },
  { name: 'Ingá-Cipó', stratum: 'ALTO', family: 'Fabaceae', origin: 'Brasil', function: 'Fixação Nitrogênio' },
  { name: 'Louro-Pardo', stratum: 'ALTO', family: 'Boraginaceae', origin: 'Brasil', function: 'Madeira/Nativa' },
  { name: 'Seringueira', stratum: 'ALTO', family: 'Euphorbiaceae', origin: 'Amazônia', function: 'Látex/Madeira' },

  // MÉDIO (Meia sombra)
  { name: 'Café', stratum: 'MEDIO', family: 'Rubiaceae', origin: 'África', function: 'Comercial' },
  { name: 'Cacau', stratum: 'MEDIO', family: 'Malvaceae', origin: 'Brasil', function: 'Comercial' },
  { name: 'Limão Taiti', stratum: 'MEDIO', family: 'Rutaceae', origin: 'Ásia', function: 'Cítrico' },
  { name: 'Mandioca', stratum: 'MEDIO', family: 'Euphorbiaceae', origin: 'Brasil', function: 'Energia' },
  { name: 'Acerola', stratum: 'MEDIO', family: 'Malpighiaceae', origin: 'Antilhas', function: 'Vitamina C' },
  { name: 'Uvaia', stratum: 'MEDIO', family: 'Myrtaceae', origin: 'Brasil', function: 'Nativa Exótica' },

  // BAIXO (Perto do solo)
  { name: 'Abacaxi', stratum: 'BAIXO', family: 'Bromeliaceae', origin: 'Brasil', function: 'Ciclo Curto' },
  { name: 'Feijão Guandu', stratum: 'BAIXO', family: 'Fabaceae', origin: 'África', function: 'Adubação Verde' },
  { name: 'Inhame', stratum: 'BAIXO', family: 'Dioscoreaceae', origin: 'África', function: 'Raiz Base' },
  { name: 'Taioba', stratum: 'BAIXO', family: 'Araceae', origin: 'Brasil', function: 'PANC' },

  // VERDURAS (Ciclo rápido - Placenta I)
  { name: 'Alface', stratum: 'VERDURA', family: 'Asteraceae', origin: 'Europa', function: '45 dias' },
  { name: 'Rúcula', stratum: 'VERDURA', family: 'Brassicaceae', origin: 'Mediterrâneo', function: '30 dias' },
  { name: 'Couve', stratum: 'VERDURA', family: 'Brassicaceae', origin: 'Europa', function: 'Folhosa Perene' },
  { name: 'Espinafre', stratum: 'VERDURA', family: 'Amaranthaceae', origin: 'Ásia', function: 'Ferro/Saúde' },

  // LEGUMES (Frutos e Raízes - Placenta II)
  { name: 'Tomate', stratum: 'LEGUME', family: 'Solanaceae', origin: 'Américas', function: 'Exigente' },
  { name: 'Pimentão', stratum: 'LEGUME', family: 'Solanaceae', origin: 'Américas', function: 'Culinária' },
  { name: 'Berinjela', stratum: 'LEGUME', family: 'Solanaceae', origin: 'Índia', function: 'Ciclo Médio' },
  { name: 'Abóbora Cabotiá', stratum: 'LEGUME', family: 'Cucurbitaceae', origin: 'Américas', function: 'Cobertura' },
  { name: 'Cenoura', stratum: 'LEGUME', family: 'Apiaceae', origin: 'Ásia', function: 'Raiz/Vitamina A' },
  { name: 'Beterraba', stratum: 'LEGUME', family: 'Amaranthaceae', origin: 'Europa', function: 'Raiz/Energia' },

  // MEDICINAIS (Sua tabela integrada)
  { name: 'Guaco', stratum: 'MEDICINAL', family: 'Asteraceae', origin: 'Brasil', function: 'Respiratório' },
  { name: 'Boldo', stratum: 'MEDICINAL', family: 'Lamiaceae', origin: 'África', function: 'Fígado' },
  { name: 'Capim-Limão', stratum: 'MEDICINAL', family: 'Poaceae', origin: 'Ásia', function: 'Calmante' },
  { name: 'Arnica', stratum: 'MEDICINAL', family: 'Asteraceae', origin: 'Brasil', function: 'Inflamação' },
];

function AppContent() {
  const [activeTab, setActiveTab] = useState<'app' | 'library' | 'history'>('app');
  const [step, setStep] = useState('hero');
  const [area, setArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, signOut } = useAuth();

  useEffect(() => { if (activeTab === 'history' && user) fetchHistory(); }, [activeTab, user]);

  const fetchHistory = async () => {
    setLoading(true);
    const { data } = await supabase.from('projetos').select('*').order('created_at', { ascending: false });
    setHistory(data || []);
    setLoading(false);
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
    setTimeout(() => { setResult(novo); setLoading(false); setStep('results'); }, 1000);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-20">
      <nav className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-50 px-6 shadow-sm">
        <div className="flex items-center font-bold text-xl text-green-800 tracking-tighter cursor-pointer" onClick={() => setActiveTab('app')}>
          <Leaf className="mr-2 text-green-600" /> SINTROPLAN
        </div>
        <div className="flex gap-4">
          <button onClick={() => setActiveTab('app')} className="text-[10px] font-black uppercase">Gerador</button>
          <button onClick={() => setActiveTab('library')} className="text-[10px] font-black uppercase">Biblioteca</button>
          {user && <button onClick={() => setActiveTab('history')} className="text-[10px] font-black uppercase">Planos</button>}
          {user && <button onClick={() => signOut()} className="text-stone-300 hover:text-red-500"><LogOut className="w-5 h-5" /></button>}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {activeTab === 'library' && (
          <div className="py-8">
            <input 
              className="w-full p-4 mb-8 rounded-2xl border-2 border-stone-100 outline-none focus:border-green-500 font-bold" 
              placeholder="Buscar planta..." 
              onChange={e => setSearchTerm(e.target.value)}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PLANTS_LIBRARY.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((p, i) => (
                <div key={i} className="bg-white p-4 rounded-3xl border shadow-sm">
                  <span className="text-[7px] font-black bg-stone-100 px-2 py-1 rounded-full uppercase">{p.stratum}</span>
                  <h4 className="font-black text-sm mt-2">{p.name}</h4>
                  <p className="text-[8px] text-stone-400 font-bold uppercase">{p.family}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'app' && step === 'results' && result && (
          <div className="py-12 animate-in zoom-in-95 duration-500">
            <h3 className="text-3xl font-black uppercase text-center mb-10 tracking-tighter">Consórcio Biodiverso</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { l: 'Emergente', v: result.emergente, c: 'bg-emerald-50' },
                { l: 'Alto', v: result.alto, c: 'bg-green-50' },
                { l: 'Médio', v: result.medio, c: 'bg-lime-50' },
                { l: 'Baixo', v: result.baixo, c: 'bg-yellow-50' },
                { l: 'Verdura', v: result.verdura, c: 'bg-orange-50' },
                { l: 'Legume', v: result.legume, c: 'bg-red-50' },
                { l: 'Medicinal', v: result.medicinal, c: 'bg-purple-50' }
              ].map((s, idx) => (
                <div key={idx} className={`${s.c} p-6 rounded-[2.5rem] border-2 border-white shadow-sm`}>
                  <p className="text-[9px] font-black text-stone-400 uppercase mb-1">{s.l}</p>
                  <p className="font-black text-lg leading-tight">{s.v}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setStep('hero')} className="mt-10 block mx-auto bg-stone-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs">Novo Plano</button>
          </div>
        )}

        {activeTab === 'app' && step !== 'results' && (
          <div className="py-20 text-center">
            {step === 'hero' ? (
              <>
                <h1 className="text-6xl font-black uppercase tracking-tighter mb-4">Sua Agrofloresta</h1>
                <button onClick={() => setStep('form')} className="bg-green-600 text-white px-10 py-5 rounded-full font-black text-xl shadow-lg">COMEÇAR</button>
              </>
            ) : (
              <div className="max-w-md mx-auto bg-white p-10 rounded-[3rem] shadow-xl">
                <h2 className="text-2xl font-black mb-6 uppercase">Área (m²)</h2>
                <input type="number" className="w-full p-5 bg-stone-50 border-2 rounded-3xl text-center text-3xl font-black mb-6 outline-none focus:border-green-500" value={area} onChange={e => setArea(e.target.value)} />
                <button onClick={gerarPlano} className="w-full py-5 bg-green-700 text-white font-black rounded-3xl uppercase tracking-widest">Gerar Design</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() { return (<AuthProvider><AppContent /></AuthProvider>); }
