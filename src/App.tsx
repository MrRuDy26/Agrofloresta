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
  Image as ImageIcon,
  Trees,
  Apple,
  Salad,
  Wind
} from 'lucide-react';

// --- 1. DEFINIÇÕES E TIPOS ---
export interface Plant {
  id: string;
  name: string;
  stratum: 'EMERGENTE' | 'ALTO' | 'MEDIO' | 'BAIXO';
  function: string;
  suitableRegions: string[];
}

export interface Consortium {
  emergente: Plant;
  alto: Plant;
  medio: Plant;
  baixo: Plant;
}

export interface ProjectData {
  projectName: string;
  areaSize: number;
  biome: string;
  region: string;
  focus: string[];
}

// --- 2. BANCO DE DADOS ---
const PLANTS_DB: Plant[] = [
  { id: '1', name: 'Guanandi', stratum: 'EMERGENTE', function: 'Madeira', suitableRegions: ['SUL', 'SUDESTE', 'NORDESTE'], lifecycle: 'CLIMAX' },
  { id: '2', name: 'Mogno Africano', stratum: 'EMERGENTE', function: 'Madeira', suitableRegions: ['CENTRO-OESTE', 'NORTE', 'SUDESTE', 'NORDESTE'], lifecycle: 'CLIMAX' },
  { id: '3', name: 'Eucalipto', stratum: 'EMERGENTE', function: 'Biomassa', suitableRegions: ['SUL', 'SUDESTE', 'CENTRO-OESTE', 'NORDESTE'], lifecycle: 'SECUNDARIA' },
  { id: '4', name: 'Bananeira Prata', stratum: 'ALTO', function: 'Fruta', suitableRegions: ['SUL', 'SUDESTE', 'NORDESTE', 'NORTE'], lifecycle: 'PLACENTA_2' },
  { id: '5', name: 'Abacateiro', stratum: 'ALTO', function: 'Fruta', suitableRegions: ['SUDESTE', 'SUL', 'CENTRO-OESTE'], lifecycle: 'CLIMAX' },
  { id: '6', name: 'Café Arábica', stratum: 'MEDIO', function: 'Fruta', suitableRegions: ['SUDESTE', 'SUL', 'NORDESTE'], lifecycle: 'PERENE' },
  { id: '7', name: 'Mandioca', stratum: 'MEDIO', function: 'Horta', suitableRegions: ['NORTE', 'NORDESTE', 'SUDESTE'], lifecycle: 'PLACENTA_2' },
  { id: '8', name: 'Abacaxi', stratum: 'BAIXO', function: 'Fruta', suitableRegions: ['NORTE', 'NORDESTE', 'SUDESTE'], lifecycle: 'PLACENTA_2' },
  { id: '9', name: 'Batata Doce', stratum: 'BAIXO', function: 'Horta', suitableRegions: ['SUL', 'SUDESTE', 'NORDESTE'], lifecycle: 'PLACENTA_1' }
] as any[];

// --- 3. COMPONENTE HERO ---
const Hero: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="relative bg-stone-900 text-white py-24 px-4">
    <div className="absolute inset-0 z-0 opacity-40">
       <img src="https://images.unsplash.com/photo-1598555848386-302380596377?auto=format&fit=crop&w=1200&q=80" alt="Agrofloresta" className="w-full h-full object-cover" />
    </div>
    <div className="relative z-10 max-w-4xl mx-auto text-center">
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
        Sua Agrofloresta <span className="text-green-400">Planejada em Segundos</span>
      </h1>
      <p className="text-xl text-stone-300 mb-10">
        Inteligência de dados para agricultura sintrópica.
      </p>
      <button onClick={onStart} className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full text-lg shadow-lg">
        Começar Planejamento
      </button>
    </div>
  </div>
);

// --- 4. COMPONENTE FORMULÁRIO ---
const InputForm: React.FC<{ data: ProjectData; onChange: (data: ProjectData) => void; onSubmit: () => void; isLoading: boolean }> = ({ data, onChange, onSubmit, isLoading }) => {
  const focusOptions = [
    { id: 'Madeira', label: 'Madeira', icon: '🪵' },
    { id: 'Fruta', label: 'Fruta', icon: '🍎' },
    { id: 'Horta', label: 'Horta', icon: '🥬' },
    { id: 'Biomassa', label: 'Biomassa', icon: '🌿' },
  ];

  return (
    <section className="py-12 px-4 bg-stone-50">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-stone-100">
        <h2 className="text-2xl font-bold text-stone-800 mb-6 text-center">Configurações</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Área (m²)</label>
            <input type="number" className="w-full p-3 border-2 border-stone-100 rounded-xl outline-none" value={data.areaSize || ''} onChange={e => onChange({...data, areaSize: Number(e.target.value)})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Região</label>
            <select className="w-full p-3 border-2 border-stone-100 rounded-xl outline-none" value={data.region} onChange={e => onChange({...data, region: e.target.value})}>
              <option value="SUDESTE">SUDESTE</option>
              <option value="SUL">SUL</option>
              <option value="NORTE">NORTE</option>
              <option value="NORDESTE">NORDESTE</option>
              <option value="CENTRO-OESTE">CENTRO-OESTE</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Bioma</label>
            <select className="w-full p-3 border-2 border-stone-100 rounded-xl outline-none" value={data.biome} onChange={e => onChange({...data, biome: e.target.value})}>
              <option value="Mata Atlântica">Mata Atlântica</option>
              <option value="Cerrado">Cerrado</option>
              <option value="Amazônia">Amazônia</option>
            </select>
          </div>
        </div>

        <label className="block text-sm font-bold text-stone-700 mb-4">Objetivo</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {focusOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => {
                const focus = data.focus.includes(opt.id) ? data.focus.filter(f => f !== opt.id) : [...data.focus, opt.id];
                onChange({...data, focus});
              }}
              className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${data.focus.includes(opt.id) ? 'border-green-500 bg-green-50' : 'border-stone-100'}`}
            >
              <span className="text-3xl">{opt.icon}</span>
              <span className="font-bold text-sm">{opt.label}</span>
            </button>
          ))}
        </div>

        <button onClick={onSubmit} disabled={isLoading || data.focus.length === 0} className="w-full py-4 bg-green-700 text-white font-bold rounded-xl shadow-lg flex justify-center items-center">
          {isLoading ? <><Loader2 className="animate-spin mr-2" /> Calculando...</> : 'GERAR MEU PLANO'}
        </button>
      </div>
    </section>
  );
};

// --- 5. COMPONENTE RESULTADOS ---
const Results: React.FC<{ consortium: Consortium; projectData: any; prompt: string }> = ({ consortium, projectData, prompt }) => {
  return (
    <section className="py-12 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-stone-800">Resultado</h2>
      </div>

      <div className="bg-slate-900 rounded-3xl p-6 mb-8 border border-slate-800 shadow-xl text-center">
        <div className="inline-block bg-green-500/10 p-4 rounded-full mb-4">
            <ImageIcon className="w-10 h-10 text-green-500 animate-pulse" />
        </div>
        <h3 className="text-white text-lg font-bold">Visualização 3D em Processamento</h3>
        <p className="text-stone-400 text-sm mt-2">
            Estamos gerando a imagem técnica para o seu projeto de <b>{projectData.areaSize}m²</b>.
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
              <p className="text-[10px] uppercase font-bold text-stone-400">{item.label}</p>
              <p className="font-bold text-lg text-stone-800">{item.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-stone-900 rounded-3xl p-10 text-center text-white">
        <Lock className="mx-auto mb-4 text-green-500 w-10 h-10" />
        <h3 className="text-xl font-bold mb-6">Guia Completo de Implementação</h3>
        <button onClick={() => window.open('https://pay.hotmart.com/V98127357T?off=m0f73v7g', '_blank')} className="px-10 py-4 bg-green-600 rounded-xl font-bold hover:bg-green-500 transition-all">
          DESBLOQUEAR AGORA
        </button>
      </div>
    </section>
  );
};

// --- 6. APP ---
export default function App() {
  const [step, setStep] = useState<'hero' | 'form' | 'results'>('hero');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ProjectData>({ projectName: '', areaSize: 0, biome: 'Mata Atlântica', region: 'SUDESTE', focus: [] });
  const [consortium, setConsortium] = useState<Consortium | null>(null);
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
      setPrompt(`Sistema: ${em.name} + ${al.name} + ${me.name} + ${ba.name}. Bioma: ${data.biome}.`);
      
      setIsLoading(false);
      setStep('results');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="bg-white border-b p-4 flex justify-center sticky top-0 z-50">
        <div className="flex items-center font-bold text-xl text-green-800">
          <Leaf className="mr-2 text-green-600" /> SINTROPLAN
        </div>
      </nav>
      {step === 'hero' && <Hero onStart={() => setStep('form')} />}
      {step === 'form' && <InputForm data={data} onChange={setData} onSubmit={handleGenerate} isLoading={isLoading} />}
      {step === 'results' && consortium && <Results consortium={consortium} projectData={data} prompt={prompt} onUnlock={() => window.open('https://pay.hotmart.com/V98127357T?off=m0f73v7g', '_blank')} />}
    </div>
  );
}
