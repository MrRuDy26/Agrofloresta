import React, { useState, useEffect } from 'react';
import { 
  Leaf, Sprout, Loader2, TreeDeciduous, Carrot, LogOut, LogIn, RefreshCw, BookOpen, History, Trash2, Wheat, Pill, Search
} from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './services/supabase';

// BANCO DE DATOS MASSIVO - INTEGRAÇÃO DE TODAS AS SUAS LISTAS
const PLANTS_LIBRARY = [
  // EMERGENTES (MADEIRAS, PIONEIRAS E PALMEIRAS GIGANTES)
  ...['Angico-Vermelho', 'Angico-Branco', 'Angico-Preto', 'Cedro-Rosa', 'Cedro-Vermelho', 'Jequitibá-Rosa', 'Jequitibá-Branco', 'Ipê-Roxo', 'Ipê-Amarelo', 'Açoita-Cavalo', 'Pau-Brasil', 'Guanandi', 'Jacarandá-da-Bahia', 'Jacarandá-Caviúna', 'Baru', 'Buriti', 'Pinho-do-Paraná', 'Mogno Africano', 'Louro-Pardo', 'Canafístula', 'Pau-Ferro', 'Copaíba', 'Andiroba', 'Sumaúma', 'Grápia', 'Garapuvu', 'Amendoim-Bravo', 'Monjoleiro', 'Pau-d’Alho', 'Cabreúva', 'Canjarana', 'Vinhático'].map(n => ({name: n, stratum: 'EMERGENTE', family: 'Nativa/Diversas', function: 'Domínio Superior'})),

  // ALTO (COPA PRINCIPAL E FRUTAS GRANDES)
  ...['Bananeira Prata', 'Bananeira Nanica', 'Abacateiro', 'Jatobá', 'Jatobá-do-Cerrado', 'Ingá-Cipó', 'Ingá-Feijão', 'Ingá-Banana', 'Cajá', 'Açaí', 'Açaí-Solteiro', 'Cupuaçu', 'Jenipapo', 'Bacuri', 'Mangueira', 'Pequi', 'Macaúba', 'Babaçu', 'Bacaba', 'Biribá', 'Cagaita', 'Caju-do-Cerrado', 'Patauá', 'Tucumã', 'Umbu', 'Umbu-Cajá', 'Tarumã', 'Seringueira', 'Cerejeira-da-Amazônia'].map(n => ({name: n, stratum: 'ALTO', family: 'Nativa/Diversas', function: 'Copa Principal'})),

  // MÉDIO (FRUTÍFERAS E SOMBRA)
  ...['Café', 'Cacau', 'Jabuticaba', 'Uvaia', 'Pitangueira', 'Cambuci', 'Cambuí', 'Mandioca', 'Acerola', 'Abiu', 'Bacupari', 'Araçá-Boi', 'Araçá-Pêra', 'Camu-Camu', 'Gabiroba', 'Guabiroba', 'Guaraná', 'Gueroba', 'Jacaratiá', 'Mangaba', 'Mapati', 'Murici', 'Sapota', 'Sorva', 'Umari', 'Uvi', 'Amora-Preta', 'Sete-Capotes', 'Cereja-do-Rio-Grande'].map(n => ({name: n, stratum: 'MEDIO', family: 'Nativa/Diversas', function: 'Estrato Médio'})),

  // BAIXO (COBERTURA E ARBUSTOS)
  ...['Abacaxi', 'Araçá', 'Araçá-Cagão', 'Feijão-Guandu', 'Taioba', 'Inhame', 'Batata-Doce', 'Fisalis', 'Cúrcuma', 'Gengibre', 'Arumbeva', 'Mandacaru', 'Beldroega', 'Peixinho da Horta', 'Jurubeba', 'Mini-pepininho', 'Croá', 'Cubiu', 'Pêra-do-Cerrado'].map(n => ({name: n, stratum: 'BAIXO', family: 'Diversas', function: 'Estrato Baixo'})),

  // VERDURAS (CICLO CURTO)
  ...['Alface', 'Rúcula', 'Couve', 'Espinafre', 'Agrião', 'Salsa', 'Acelga', 'Coentro', 'Manjericão', 'Mostarda', 'Serralha', 'Chicória'].map(n => ({name: n, stratum: 'VERDURA', family: 'Hortaliças', function: 'Placenta I'})),

  // LEGUMES (CICLO MÉDIO)
  ...['Tomate', 'Cenoura', 'Abóbora', 'Berinjela', 'Pimentão', 'Beterraba', 'Vagem', 'Chuchu', 'Quiabo', 'Pepino', 'Feijão-de-Porco', 'Milho Verde'].map(n => ({name: n, stratum: 'LEGUME', family: 'Hortaliças', function: 'Placenta II'})),

  // MEDICINAIS (SUA TABELA TÉCNICA COMPLETA)
  ...['Guaco', 'Capim-Limão', 'Boldo Brasileiro', 'Alecrim', 'Tanchagem', 'Ora-pro-nóbis', 'Citronela', 'Erva-Cidreira', 'Losna', 'Abre-Caminho', 'Anador', 'Arnica', 'Bálsamo', 'Babosa', 'Espinheira-Santa', 'Aranto', 'Alfavaca', 'Alfazema', 'Anil', 'Avelós', 'Boldo-da-Terra', 'Calêndula', 'Camomila', 'Canforeiro', 'Capuchinha', 'Carqueja', 'Erva-de-Santa-Maria', 'Funcho', 'Hortelã-Pimenta', 'Levante', 'Macelinha', 'Malvarisco', 'Melissa', 'Mil-Folhas', 'Poejo', 'Quebra-Pedra', 'Sálvia', 'Stevia'].map(n => ({name: n, stratum: 'MEDICINAL', family: 'Farmácia Viva', function: 'Uso Terapêutico'}))
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

  const gerarPlano = async () => {
    setLoading(true);
    setResult(null);
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

  const filteredLibrary = PLANTS_LIBRARY.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.stratum.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-20">
      <nav className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-50 px-6 shadow-sm">
        <div className="flex items-center font-bold text-xl text-green-800 tracking-tighter cursor-pointer" onClick={() => setActiveTab('app')}>
          <Leaf className="mr-2 text-green-600" /> SINTROPLAN
        </div>
        <div className="flex gap-4 md:gap-8">
          <button onClick={() => setActiveTab('app')} className={`text-[10px] font-black uppercase ${activeTab === 'app' ? 'text-green-600' : 'text-stone-400'}`}>Gerador</button>
          <button onClick={() => setActiveTab('library')} className={`text-[10px] font-black uppercase ${activeTab === 'library' ? 'text-green-600' : 'text-stone-400'}`}>Biblioteca</button>
          {user && <button onClick={() => setActiveTab('history')} className={`text-[10px] font-black uppercase ${activeTab === 'history' ? 'text-green-600' : 'text-stone-400'}`}>Histórico</button>}
          {user && <button onClick={() => signOut()} className="ml-4 text-stone-300 hover:text-red-500 transition-colors"><LogOut className="w-5 h-5" /></button>}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4">
        {activeTab === 'library' && (
          <div className="py-8 animate-in fade-in duration-500">
            <div className="relative mb-10 max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 w-5 h-5" />
              <input className="w-full pl-12 pr-4 py-4 rounded-3xl border-2 border-stone-100 outline-none focus:border-green-500 font-bold shadow-sm" placeholder="Pesquisar entre centenas de espécies..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredLibrary.map((p, i) => (
                <div key={i} className="bg-white p-5 rounded-[2rem] border shadow-sm hover:border-green-200 transition-all">
                  <span className={`text-[7px] font-black px-2 py-1 rounded-full uppercase ${p.stratum === 'VERDURA' || p.stratum === 'LEGUME' ? 'bg-orange-50 text-orange-600' : 'bg-stone-100'}`}>{p.stratum}</span>
                  <h4 className="font-black text-sm mt-3 text-stone-800 leading-tight">{p.name}</h4>
                  <p className="text-[8px] text-stone-400 font-bold uppercase mt-1">{p.family}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'app' && step === 'results' && result && (
          <div className="py-12 animate-in zoom-in-95 duration-500">
            <h3 className="text-4xl font-black uppercase text-center mb-12 tracking-tighter">Consórcio de Abundância</h3>
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
                <div key={idx} className={`${s.c} p-8 rounded-[3rem] border-2 border-white shadow-sm flex flex-col items-center text-center`}>
                  <p className="text-[10px] font-black text-stone-400 uppercase mb-2 tracking-widest">{s.l}</p>
                  <p className="font-black text-xl leading-tight text-stone-900">{s.v}</p>
                </div>
              ))}
            </div>
            <button onClick={() => {setStep('hero'); setResult(null);}} className="mt-12 block mx-auto bg-stone-900 text-white px-12 py-6 rounded-3xl font-black uppercase text-xs tracking-widest">Novo Design</button>
          </div>
        )}

        {activeTab === 'app' && step !== 'results' && (
          <div className="py-20 text-center">
            {step === 'hero' ? (
              <div className="bg-stone-900 text-white py-32 rounded-[5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-green-500/10 opacity-30" />
                <h1 className="text-7xl font-black uppercase tracking-tighter mb-6 relative">SINTROPLAN</h1>
                <p className="text-stone-400 mb-12 uppercase text-xs font-bold tracking-[0.5em] relative">Biodiversidade Brasileira & Sintropia</p>
                <button onClick={() => setStep('form')} className="bg-green-600 text-white px-16 py-8 rounded-full font-black text-2xl shadow-xl relative hover:bg-green-500 transition-all">COMEÇAR PROJETO</button>
              </div>
            ) : (
              <div className="max-w-md mx-auto bg-white p-12 rounded-[4rem] shadow-2xl border-2 border-stone-50">
                <h2 className="text-2xl font-black mb-10 uppercase text-stone-800">Área (m²)</h2>
                <input type="number" className="w-full p-8 bg-stone-50 border-2 rounded-[2rem] text-center text-5xl font-black outline-none focus:border-green-500 mb-10" value={area} onChange={e => setArea(e.target.value)} />
                <button onClick={gerarPlano} className="w-full py-8 bg-green-700 text-white font-black rounded-[2rem] uppercase tracking-[0.2em]">Gerar Plano</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="py-8">
            <h2 className="text-3xl font-black uppercase text-center mb-10 tracking-tighter">Planos Salvos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {history.map((proj) => (
                <div key={proj.id} className="bg-white p-10 rounded-[4rem] border shadow-sm relative">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-[10px] font-black text-stone-300 uppercase mb-1">{new Date(proj.created_at).toLocaleDateString()}</p>
                      <h4 className="text-3xl font-black text-stone-800">{proj.area} m²</h4>
                    </div>
                    <button onClick={async () => {
                      await supabase.from('projetos').delete().eq('id', proj.id);
                      fetchHistory();
                    }} className="text-stone-200 hover:text-red-500 transition-colors"><Trash2 className="w-6 h-6" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {['emergente', 'alto', 'medio', 'baixo', 'verdura', 'legume', 'medicinal'].map(k => (
                      <div key={k} className="bg-stone-50 p-3 rounded-xl text-[9px] font-black uppercase truncate text-stone-400">{proj[k] || '---'}</div>
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
