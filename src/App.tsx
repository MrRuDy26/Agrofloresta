import React, { useState, useEffect } from 'react';
import { 
  Leaf, Sprout, Loader2, TreeDeciduous, Carrot, LogOut, LogIn, RefreshCw, BookOpen, History, Trash2, Wheat, Pill, Search, Flower2, Cherry
} from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './services/supabase';

const PLANTS_LIBRARY = [
  // EMERGENTES E ALTOS (GRANDES ÁRVORES E PALMEIRAS)
  { name: 'Jatobá', stratum: 'EMERGENTE', family: 'Fabaceae', function: 'Madeira/Alimento' },
  { name: 'Baru', stratum: 'EMERGENTE', family: 'Fabaceae', function: 'Castanha Nobre' },
  { name: 'Babaçu', stratum: 'EMERGENTE', family: 'Arecaceae', function: 'Palmeira Multiuso' },
  { name: 'Buriti', stratum: 'EMERGENTE', family: 'Arecaceae', function: 'Palmeira de Brejo' },
  { name: 'Pequi', stratum: 'ALTO', family: 'Caryocaraceae', function: 'Fruta do Cerrado' },
  { name: 'Cajá', stratum: 'ALTO', family: 'Anacardiaceae', function: 'Fruta/Polpa' },
  { name: 'Jenipapo', stratum: 'ALTO', family: 'Rubiaceae', function: 'Fruta/Tinta' },
  { name: 'Macaúba', stratum: 'ALTO', family: 'Arecaceae', function: 'Óleo/Energia' },
  { name: 'Açaí', stratum: 'ALTO', family: 'Arecaceae', function: 'Superalimento' },
  { name: 'Cupuaçu', stratum: 'ALTO', family: 'Malvaceae', function: 'Fruta/Manteiga' },

  // MÉDIO (FRUTÍFERAS DE MÉDIO PORTE)
  { name: 'Jabuticaba', stratum: 'MEDIO', family: 'Myrtaceae', function: 'Fruta Nativa' },
  { name: 'Camboí', stratum: 'MEDIO', family: 'Myrtaceae', function: 'Fruta Rara' },
  { name: 'Uvaia', stratum: 'MEDIO', family: 'Myrtaceae', function: 'Vitamina C' },
  { name: 'Cambuci', stratum: 'MEDIO', family: 'Myrtaceae', function: 'Fruta Aromática' },
  { name: 'Gabiroba', stratum: 'MEDIO', family: 'Myrtaceae', function: 'Doce/Nativa' },
  { name: 'Camu-camu', stratum: 'MEDIO', family: 'Myrtaceae', function: 'Super Vitamina C' },
  { name: 'Cagaita', stratum: 'MEDIO', family: 'Myrtaceae', function: 'Fruta do Cerrado' },
  { name: 'Goiaba', stratum: 'MEDIO', family: 'Myrtaceae', function: 'Fruta Popular' },

  // BAIXO (ARBUSTOS E FRUTAS DE CHÃO)
  { name: 'Abacaxi', stratum: 'BAIXO', family: 'Bromeliaceae', function: 'Ciclo Curto' },
  { name: 'Pitanga', stratum: 'BAIXO', family: 'Myrtaceae', function: 'Fruta Rápida' },
  { name: 'Araçá', stratum: 'BAIXO', family: 'Myrtaceae', function: 'Fruta Silvestre' },
  { name: 'Grumixama', stratum: 'BAIXO', family: 'Myrtaceae', function: 'Cereja Brasileira' },
  { name: 'Cereja-do-rio-grande', stratum: 'BAIXO', family: 'Myrtaceae', function: 'Fruta Nobre' },
  { name: 'Fisalis', stratum: 'BAIXO', family: 'Solanaceae', function: 'Fruta Fina' },

  // VERDURAS (FOLHAS)
  { name: 'Alface', stratum: 'VERDURA', family: 'Asteraceae', function: '45 dias' },
  { name: 'Rúcula', stratum: 'VERDURA', family: 'Brassicaceae', function: '30 dias' },
  { name: 'Couve', stratum: 'VERDURA', family: 'Brassicaceae', function: 'Folhosa' },
  { name: 'Taioba', stratum: 'VERDURA', family: 'Araceae', function: 'PANC' },

  // LEGUMES E FRUTOS RASTEIROS
  { name: 'Abóbora', stratum: 'LEGUME', family: 'Cucurbitaceae', function: 'Cobertura' },
  { name: 'Melancia', stratum: 'LEGUME', family: 'Cucurbitaceae', function: 'Hidratação' },
  { name: 'Tomate', stratum: 'LEGUME', family: 'Solanaceae', function: 'Ciclo Médio' },
  { name: 'Maxixe', stratum: 'LEGUME', family: 'Cucurbitaceae', function: 'Resiliente' },
  { name: 'Jurubeba', stratum: 'LEGUME', family: 'Solanaceae', function: 'Medicinal/PANC' },

  // MEDICINAIS
  { name: 'Aroeira-pimenteira', stratum: 'MEDICINAL', family: 'Anacardiaceae', function: 'Antisséptico' },
  { name: 'Guaraná', stratum: 'MEDICINAL', family: 'Sapindaceae', function: 'Energético' },
  { name: 'Babosa', stratum: 'MEDICINAL', family: 'Asphodelaceae', function: 'Cicatrizante' },
  { name: 'Capim-limão', stratum: 'MEDICINAL', family: 'Poaceae', function: 'Calmante' },
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
      return l.length > 0 ? l[Math.floor(Math.random() * l.length)].name : '---';
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
          <button onClick={() => setActiveTab('app')} className={`text-[10px] font-black uppercase ${activeTab === 'app' ? 'text-green-600' : ''}`}>Gerador</button>
          <button onClick={() => setActiveTab('library')} className={`text-[10px] font-black uppercase ${activeTab === 'library' ? 'text-green-600' : ''}`}>Biblioteca</button>
          {user && <button onClick={() => setActiveTab('history')} className={`text-[10px] font-black uppercase ${activeTab === 'history' ? 'text-green-600' : ''}`}>Meus Planos</button>}
          {user && <button onClick={() => signOut()} className="text-stone-300 hover:text-red-500 transition-colors"><LogOut className="w-5 h-5" /></button>}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {activeTab === 'library' && (
          <div className="py-8 animate-in fade-in duration-500">
            <h2 className="text-3xl font-black uppercase text-center mb-8 tracking-tighter">Enciclopédia de Frutas e Plantas</h2>
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 w-4 h-4" />
              <input className="w-full pl-12 pr-4 py-4 rounded-3xl border-2 border-stone-100 outline-none focus:border-green-500 font-bold" placeholder="Buscar por nome ou família..." onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PLANTS_LIBRARY.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((p, i) => (
                <div key={i} className="bg-white p-5 rounded-[2rem] border shadow-sm hover:border-green-200 transition-all">
                  <span className="text-[7px] font-black bg-stone-100 px-2 py-1 rounded-full uppercase">{p.stratum}</span>
                  <h4 className="font-black text-sm mt-2 text-stone-800">{p.name}</h4>
                  <p className="text-[8px] text-stone-400 font-bold uppercase">{p.family}</p>
                  <p className="text-[9px] text-green-600 font-black mt-2 uppercase">{p.function}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'app' && step === 'results' && result && (
          <div className="py-12 animate-in zoom-in-95 duration-500">
            <div className="text-center mb-10">
               <h3 className="text-4xl font-black uppercase tracking-tighter">Seu Design Sintrópico</h3>
               <p className="text-stone-400 font-bold text-xs uppercase tracking-widest mt-2">Área de {area}m²</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {[
                { l: 'Emergente', v: result.emergente, c: 'bg-emerald-50', i: <TreeDeciduous /> },
                { l: 'Alto', v: result.alto, c: 'bg-green-50', i: <TreeDeciduous /> },
                { l: 'Médio', v: result.medio, c: 'bg-lime-50', i: <Sprout /> },
                { l: 'Baixo', v: result.baixo, c: 'bg-yellow-50', i: <Sprout /> },
                { l: 'Verdura', v: result.verdura, c: 'bg-orange-50', i: <Wheat /> },
                { l: 'Legume', v: result.legume, c: 'bg-red-50', i: <Carrot /> },
                { l: 'Medicinal', v: result.medicinal, c: 'bg-purple-50', i: <Pill /> }
              ].map((s, idx) => (
                <div key={idx} className={`${s.c} p-8 rounded-[2.5rem] border-2 border-white shadow-sm flex flex-col items-center text-center`}>
                  <div className="text-green-600 mb-4">{s.i}</div>
                  <p className="text-[9px] font-black text-stone-400 uppercase mb-1">{s.l}</p>
                  <p className="font-black text-lg leading-tight text-stone-900">{s.v}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setStep('hero')} className="mt-12 block mx-auto bg-stone-900 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs">Novo Projeto</button>
          </div>
        )}

        {activeTab === 'app' && step !== 'results' && (
          <div className="py-20 text-center">
            {step === 'hero' ? (
              <div className="bg-stone-900 text-white py-32 rounded-[4rem] shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-green-500/10 opacity-20" />
                <h1 className="text-6xl font-black uppercase tracking-tighter mb-6 relative">SintroPlan</h1>
                <p className="text-stone-400 mb-10 uppercase text-xs font-bold tracking-[0.4em] relative">Biodiversidade Brasileira & Frutas Nativas</p>
                <button onClick={() => setStep('form')} className="bg-green-600 text-white px-12 py-6 rounded-full font-black text-xl shadow-lg relative hover:scale-105 transition-transform">COMEÇAR</button>
              </div>
            ) : (
              <div className="max-w-md mx-auto bg-white p-12 rounded-[3.5rem] shadow-2xl border">
                <h2 className="text-2xl font-black mb-8 uppercase text-stone-800 tracking-tight text-center">Área de Plantio</h2>
                <div className="relative mb-10">
                  <input type="number" className="w-full p-8 bg-stone-50 border-2 rounded-3xl text-center text-4xl font-black outline-none focus:border-green-500 transition-all shadow-inner" value={area} onChange={e => setArea(e.target.value)} />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-stone-200">m²</span>
                </div>
                <button onClick={gerarPlano} className="w-full py-6 bg-green-700 text-white font-black rounded-3xl uppercase tracking-widest shadow-xl hover:bg-green-800 transition-colors">GERAR CONSÓRCIO</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="py-8">
            <h2 className="text-3xl font-black uppercase text-center mb-10 tracking-tighter">Histórico de Designs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {history.map((proj) => (
                <div key={proj.id} className="bg-white p-8 rounded-[3rem] border shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-black text-stone-300 uppercase">{new Date(proj.created_at).toLocaleDateString()} - {proj.area}m²</span>
                    <button onClick={async () => {
                      await supabase.from('projetos').delete().eq('id', proj.id);
                      fetchHistory();
                    }} className="text-stone-200 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['emergente', 'alto', 'medio', 'baixo', 'verdura', 'legume', 'medicinal'].map(k => (
                      <div key={k} className="bg-stone-50 p-2 rounded-xl text-[8px] font-black uppercase truncate border border-stone-100 text-stone-500">{proj[k]}</div>
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
