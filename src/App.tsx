import React, { useState } from 'react';
import { 
  Leaf, 
  Sprout, 
  MapPin, 
  Mountain, 
  Ruler, 
  Loader2, 
  TreeDeciduous, 
  Carrot, 
  Lock, 
  Image as ImageIcon 
} from 'lucide-react';

// --- 1. BANCO DE DADOS E TIPOS ---
const PLANTS_DB = [
  { id: '1', name: 'Guanandi', stratum: 'EMERGENTE', suitableRegions: ['SUL', 'SUDESTE', 'NORDESTE'] },
  { id: '2', name: 'Mogno Africano', stratum: 'EMERGENTE', suitableRegions: ['CENTRO-OESTE', 'NORTE', 'SUDESTE', 'NORDESTE'] },
  { id: '3', name: 'Eucalipto', stratum: 'EMERGENTE', suitableRegions: ['SUL', 'SUDESTE', 'CENTRO-OESTE', 'NORDESTE'] },
  { id: '4', name: 'Bananeira Prata', stratum: 'ALTO', suitableRegions: ['SUL', 'SUDESTE', 'NORDESTE', 'NORTE'] },
  { id: '5', name: 'Abacateiro', stratum: 'ALTO', suitableRegions: ['SUDESTE', 'SUL', 'CENTRO-OESTE'] },
  { id: '6', name: 'Café Arábica', stratum: 'MEDIO', suitableRegions: ['SUDESTE', 'SUL', 'NORDESTE'] },
  { id: '7', name: 'Mandioca', stratum: 'MEDIO', suitableRegions: ['NORTE', 'NORDESTE', 'SUDESTE'] },
  { id: '8', name: 'Abacaxi', stratum: 'BAIXO', suitableRegions: ['NORTE', 'NORDESTE', 'SUDESTE'] },
  { id: '9', name: 'Batata Doce', stratum: 'BAIXO', suitableRegions: ['SUL', 'SUDESTE', 'NORDESTE'] }
];

// --- 2. COMPONENTE HERO ---
const Hero: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="relative bg-stone-900 text-white py-24 px-4">
    <div className="absolute inset-0 z-0 opacity-40">
       <img src="https://images.unsplash.com/photo-1598555848386-302380596377?auto=format&fit=crop&w=1200&q=80" alt="Agrofloresta" className="w-full h-full object-cover" />
    </div>
    <div className="relative z-10 max-w-4xl mx-auto text-center">
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 uppercase">
        Sua Agrofloresta <span className="text-green-400">em Segundos</span>
      </h1>
      <p className="text-xl text-stone-300 mb-10 font-medium">Inteligência de dados para agricultura sintrópica.</p>
      <button onClick={onStart} className="px-10 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full text-lg shadow-lg transform hover:scale-105 transition-all">
        Começar Planejamento
      </button>
    </div>
  </div>
);

// --- 3. COMPONENTE FORMULÁRIO ---
const InputForm = ({ data, onChange, onSubmit, isLoading }: any) => {
  const focusOptions = [
    { id: 'Madeira', label: 'Madeira', icon: '🪵' },
    { id: 'Fruta', label: 'Fruta', icon: '🍎' },
    { id: 'Horta', label: 'Horta', icon: '🥬' },
    { id: 'Biomassa', label: 'Biomassa', icon: '🌿' },
  ];

  return (
    <section className="py-12 px-4 bg-stone-50">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-stone-100">
        <h2 className="text-2xl font-bold text-stone-800 mb-8 text-center uppercase tracking-tight">Configuração do Sistema</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Área (m²)</label>
            <div className="relative">
                <Ruler className="absolute left-3 top-3.5 h-4 w-4 text-stone-400" />
                <input type="number" className="w-full pl-10 p-3 border-2 border-stone-100 rounded-xl outline-none focus:border-green-500" value={data.areaSize || ''} onChange={e => onChange({...data, areaSize: Number(e.target.value)})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Região</label>
            <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-stone-400" />
                <select className="w-full pl-10 p-3 border-2 border-stone-100 rounded-xl outline-none focus:border-green-500 appearance-none" value={data.region} onChange={e => onChange({...data, region: e.target.value})}>
                    <option value="SUDESTE">SUDESTE</option>
                    <option value="SUL">SUL</option>
                    <option value="NORTE">NORTE</option>
                    <option value="NORDESTE">NORDESTE</option>
                    <option value="CENTRO-OESTE">CENTRO-OESTE</option>
                </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Bioma</label>
            <div className="relative">
                <Mountain className="absolute left-3 top-3.5 h-4 w-4 text-stone-400" />
                <select className="w-full pl-10 p-3 border-2 border-stone-100 rounded-xl outline-none focus:border-green-500 appearance-none" value={data.biome} onChange={e => onChange({...data, biome: e.target.value})}>
                    <option value="Mata Atlântica">Mata Atlântica</option>
                    <option value="Cerrado">Cerrado</option>
                    <option value="Amazônia">Amazônia</option>
                </select>
            </div>
          </div>
        </div>

        <label className="block text-sm font-bold text-stone-700 mb-4 uppercase">Objetivo da Produção</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {focusOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => {
                const focus = data.focus.includes(opt.id) ? data.focus.filter((f: any) => f !== opt.id) : [...data.focus, opt.id];
                onChange({...data, focus});
              }}
              className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${data.focus.includes(opt.id) ? 'border-green-500 bg-green-50 text-green-700' : 'border-stone-100 text-stone-500'}`}
            >
              <span className="text-3xl">{opt.icon}</span>
              <span className="font-bold text-xs uppercase tracking-widest">{opt.label}</span>
            </button>
          ))}
        </div>

        <button onClick={onSubmit} disabled={isLoading || data.focus.length === 0} className="w-full py-5 bg-green-700 text-white font-bold rounded-xl shadow-lg hover:bg-green-800 transition-all flex justify-center items-center text-lg">
          {isLoading ? <><Loader2 className="animate-spin mr-2" /> Calculando...</> : 'GERAR MEU PLANO'}
        </button>
      </div>
    </section>
  );
};

// --- 4. COMPONENTE RESULTADOS ---
const Results = ({ consortium, projectData, prompt }: any) => {
  return (
    <section className="py-12 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-stone-800">Resultado Personalizado</h2>
      </div>

      <div className="bg-slate-900 rounded-3xl p-6 mb-8 border border-slate-800 shadow-xl text-center overflow-hidden">
        <div className="inline-block bg-green-500/10 p-4 rounded-full mb-4">
            <ImageIcon className="w-10 h-10 text-green-500 animate-pulse" />
        </div>
        <h3 className="text-white text-lg font-bold">Visualização do Ecossistema</h3>
        <p className="text-stone-400 text-sm mt-3 px-4 italic">
            "{prompt}"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {[
          { label: 'Emergente', name: consortium.emergente.name, icon: <TreeDeciduous/> },
          { label: 'Alto', name: consortium.alto.name, icon: <TreeDeciduous/> },
          { label: 'Médio', name: consortium.medio.name, icon: <Leaf/> },
          { label: 'Baixo', name: consortium.baixo.name, icon: <Carrot/> }
        ].map((item, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-stone-100 flex items-center shadow-sm">
            <div className="mr-4 text-green-600 bg-green-50 p-3 rounded-xl">{item.icon}</div>
            <div>
              <p className="text-[10px] uppercase font-bold text-stone-400 tracking-tighter">{item.label}</p>
              <p className="font-bold text-lg text-stone-800">{item.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-stone-900 rounded-3xl p-10 text-center text-white border-t-4 border-green-600">
        <Lock className="mx-auto mb-4 text-green-500 w-10 h-10" />
        <h3 className="text-xl font-bold mb-6">Guia Completo de Implementação</h3>
        <button onClick={() => window.open('https://pay.hotmart.com/V98127357T?off=m0f73v7g', '_blank')} className="px-10 py-4 bg-green-600 rounded-xl font-bold hover:bg-green-500 transition-all uppercase tracking-widest shadow-lg shadow-green-900/40">
          Obter Guia Completo
        </button>
      </div>
    </section>
  );
};

// --- APP ---
function App() {
  const [step, setStep] = useState<'hero' | 'form' | 'results'>('hero');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({ projectName: '', areaSize: 0, biome: 'Mata Atlântica', region: 'SUDESTE', focus: [] });
  const [consortium, setConsortium] = useState<any>(null);
  const [prompt, setPrompt] = useState('');

  const runAlgorithm = () => {
    setIsLoading(true);
    setTimeout(() => {
      const reg = PLANTS_DB.filter(p => p.suitableRegions.includes(data.region));
      const getP = (s: string) => reg.find(p => p.stratum === s) || PLANTS_DB.find(p => p.stratum === s)!;
      
      const em = getP('EMERGENTE');
      const al = getP('ALTO');
      const me = getP('MEDIO');
      const ba = getP('BAIXO');

      setConsortium({ emergente: em, alto: al, medio: me, baixo: ba });
      setPrompt(`Uma ilustração realista em 8K de um sistema agroflorestal no bioma ${data.biome}. Espécies Principais: ${em.name}, ${al.name}, ${me.name} e ${ba.name}.`);
      
      setIsLoading(false);
      setStep('results');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="bg-white border-b p-4 flex justify-center sticky top-0 z-50">
        <div className="flex items-center font-bold text-xl text-green-800 tracking-tighter uppercase">
          <Leaf className="mr-2 text-green-600" /> SINTROPLAN
        </div>
      </nav>
      {step === 'hero' && <Hero onStart={() => setStep('form')} />}
      {step === 'form' && <InputForm data={data} onChange={setData} onSubmit={runAlgorithm} isLoading={isLoading} />}
      {step === 'results' && consortium && <Results consortium={consortium} projectData={data} prompt={prompt} onUnlock={() => window.open('https://pay.hotmart.com/V98127357T?off=m0f73v7g', '_blank')} />}
    </div>
  );
}

export default App;
