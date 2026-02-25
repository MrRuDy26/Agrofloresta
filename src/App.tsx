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

// --- 1. TIPOS ---
export interface Plant {
  id: string;
  name: string;
  stratum: 'EMERGENTE' | 'ALTO' | 'MEDIO' | 'BAIXO';
  function: 'Madeira' | 'Fruta' | 'Horta' | 'Biomassa' | 'Adubação Verde';
  suitableRegions: string[];
  lifecycle: 'PLACENTA_1' | 'PLACENTA_2' | 'SECUNDARIA' | 'CLIMAX' | 'PERENE';
}

export interface Consortium {
  emergente: Plant;
  alto: Plant;
  medio: Plant;
  baixo: Plant;
  horta: Plant[];
}

export interface ProjectData {
  projectName: string;
  areaSize: number;
  biome: string;
  region: string;
  focus: string[];
  selectedSpeciesIds: string[];
}

// --- 2. DADOS ---
const PLANTS_DB: Plant[] = [
  { id: '1', name: 'Guanandi', stratum: 'EMERGENTE', function: 'Madeira', suitableRegions: ['SUL', 'SUDESTE', 'NORDESTE'], lifecycle: 'CLIMAX' },
  { id: '2', name: 'Mogno Africano', stratum: 'EMERGENTE', function: 'Madeira', suitableRegions: ['CENTRO-OESTE', 'NORTE', 'SUDESTE', 'NORDESTE'], lifecycle: 'CLIMAX' },
  { id: '3', name: 'Eucalipto', stratum: 'EMERGENTE', function: 'Biomassa', suitableRegions: ['SUL', 'SUDESTE', 'CENTRO-OESTE', 'NORDESTE'], lifecycle: 'SECUNDARIA' },
  { id: '4', name: 'Castanheira', stratum: 'EMERGENTE', function: 'Fruta', suitableRegions: ['NORTE', 'CENTRO-OESTE'], lifecycle: 'CLIMAX' },
  { id: '5', name: 'Bananeira Prata', stratum: 'ALTO', function: 'Fruta', suitableRegions: ['SUL', 'SUDESTE', 'NORDESTE', 'CENTRO-OESTE', 'NORTE'], lifecycle: 'PLACENTA_2' },
  { id: '6', name: 'Juçara', stratum: 'ALTO', function: 'Fruta', suitableRegions: ['SUL', 'SUDESTE'], lifecycle: 'CLIMAX' },
  { id: '7', name: 'Abacateiro', stratum: 'ALTO', function: 'Fruta', suitableRegions: ['SUDESTE', 'SUL', 'CENTRO-OESTE'], lifecycle: 'CLIMAX' },
  { id: '8', name: 'Café Arábica', stratum: 'MEDIO', function: 'Fruta', suitableRegions: ['SUDESTE', 'SUL', 'NORDESTE'], lifecycle: 'PERENE' },
  { id: '9', name: 'Cacau', stratum: 'MEDIO', function: 'Fruta', suitableRegions: ['NORTE', 'NORDESTE'], lifecycle: 'PERENE' },
  { id: '10', name: 'Limão Taiti', stratum: 'MEDIO', function: 'Fruta', suitableRegions: ['SUDESTE', 'NORDESTE', 'CENTRO-OESTE'], lifecycle: 'PERENE' },
  { id: '11', name: 'Mandioca', stratum: 'MEDIO', function: 'Horta', suitableRegions: ['NORTE', 'NORDESTE', 'CENTRO-OESTE', 'SUDESTE', 'SUL'], lifecycle: 'PLACENTA_2' },
  { id: '12', name: 'Abacaxi', stratum: 'BAIXO', function: 'Fruta', suitableRegions: ['NORTE', 'NORDESTE', 'SUDESTE'], lifecycle: 'PLACENTA_2' },
  { id: '13', name: 'Batata Doce', stratum: 'BAIXO', function: 'Horta', suitableRegions: ['SUL', 'SUDESTE', 'NORDESTE', 'CENTRO-OESTE'], lifecycle: 'PLACENTA_1' },
  { id: '14', name: 'Gengibre', stratum: 'BAIXO', function: 'Horta', suitableRegions: ['SUDESTE', 'SUL'], lifecycle: 'PLACENTA_2' },
  { id: '15', name: 'Abóbora', stratum: 'BAIXO', function: 'Horta', suitableRegions: ['SUL', 'SUDESTE', 'CENTRO-OESTE', 'NORDESTE', 'NORTE'], lifecycle: 'PLACENTA_1' }
];

// --- 3. COMPONENTE CAPA ---
const Hero: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="relative bg-stone-900 text-white py-24 px-4 overflow-hidden">
    <div className="absolute inset-0 z-0 opacity-40">
       <img src="https://images.unsplash.com/photo-1598555848386-302380596377?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Agrofloresta" className="w-full h-full object-cover" />
    </div>
    <div className="relative z-10 max-w-4xl mx-auto text-center">
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
        Sua Agrofloresta <span className="text-green-400">Planejada em Segundos</span>
      </h1>
      <button onClick={onStart} className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full text-lg shadow-lg transition-all">
        Começar Planejamento Gratuito
      </button>
    </div>
  </div>
);

// --- 4. COMPONENTE FORMULÁRIO ---
const InputForm: React.FC<{ data: ProjectData; onChange: (data: ProjectData) => void; onSubmit: () => void; isLoading: boolean }> = ({ data, onChange, onSubmit, isLoading }) => {
  const handleChange = (field: keyof ProjectData, value: any) => onChange({ ...data, [field]: value });
  
  const toggleFocus = (id: string) => {
    const focus = data.focus.includes(id) ? data.focus.filter(f => f !== id) : [...data.focus, id];
    handleChange('focus', focus);
  };

  return (
    <section id="planner-form" className="py-16 px-4 bg-stone-50">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-stone-100">
        <h2 className="text-2xl font-bold mb-6">Configuração do Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-bold mb-2">Área (m²)</label>
            <input type="number" className="w-full p-3 border rounded-xl" placeholder="Ex: 1000" value={data.areaSize || ''} onChange={e => handleChange('areaSize', Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Região</label>
            <select className="w-full p-3 border rounded-xl" value={data.region} onChange={e => handleChange('region', e.target.value)}>
              <option value="SUL">SUL</option><option value="SUDESTE">SUDESTE</option><option value="CENTRO-OESTE">CENTRO-OESTE</option><option value="NORDESTE">NORDESTE</option><option value="NORTE">NORTE</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Bioma</label>
            <select className="w-full p-3 border rounded-xl" value={data.biome} onChange={e => handleChange('biome', e.target.value)}>
              <option value="Mata Atlântica">Mata Atlântica</option><option value="Cerrado">Cerrado</option><option value="Amazônia">Amazônia</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {['Madeira', 'Fruta', 'Horta', 'Biomassa'].map(f => (
            <button key={f} onClick={() => toggleFocus(f)} className={`p-4 border rounded-xl font-bold transition-all ${data.focus.includes(f) ? 'border-green-600 bg-green-50' : 'border-stone-200'}`}>{f}</button>
          ))}
        </div>
        <button onClick={onSubmit} disabled={isLoading || data.focus.length === 0} className="w-full py-4 bg-green-700 text-white font-bold rounded-xl flex justify-center items-center">
          {isLoading ? <><Loader2 className="animate-spin mr-2" /> Calculando...</> : 'Gerar Consórcio'}
        </button>
      </div>
    </section>
  );
};

// --- 5. COMPONENTE RESULTADOS ---
const Results: React.FC<{ consortium: Consortium; projectData: any; image_prompt: string; onUnlock: () => void }> = ({ consortium, projectData, image_prompt, onUnlock }) => {
  const strata = [
    { key: 'emergente', label: 'Emergente' }, { key: 'alto', label: 'Estrato Alto' },
    { key: 'medio', label: 'Estrato Médio' }, { key: 'baixo', label: 'Estrato Baixo' }
  ];

  return (
    <section className="py-16 px-4 max-w-4xl mx-auto">
      <div className="bg-slate-900 rounded-3xl p-8 mb-12 border border-slate-800">
        <div className="flex items-center text-white mb-6">
          <ImageIcon className="mr-3 text-green-400" />
          <h3 className="text-xl font-bold">VISUALIZAÇÃO DO PROJETO</h3>
        </div>
        <div className="bg-slate-950 p-6 rounded-2xl border border-green-500/30 font-mono text-green-400 text-sm">
          {image_prompt}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {strata.map(s => (
          <div key={s.key} className="bg-white p-6 rounded-2xl shadow-sm border flex items-center">
            <div className="mr-4 p-3 bg-green-100 rounded-xl"><TreeDeciduous className="text-green-800" /></div>
            <div><p className="text-xs text-stone-400 uppercase font-bold">{s.label}</p><p className="text-xl font-bold">{(consortium as any)[s.key].name}</p></div>
          </div>
        ))}
      </div>
      <div className="bg-stone-900 rounded-3xl p-12 text-center text-white">
        <Lock className="mx-auto mb-6 text-green-500 h-12 w-12" />
        <h3 className="text-2xl font-bold mb-6">Guia Técnico de Implementação</h3>
        <button onClick={onUnlock} className="w-full md:w-auto px-12 py-4 bg-green-600 rounded-2xl font-bold text-lg">DESBLOQUEAR AGORA</button>
      </div>
    </section>
  );
};

// --- 6. APP PRINCIPAL ---
export default function App() {
  const [step, setStep] = useState<'hero' | 'form' | 'results'>('hero');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ProjectData>({ projectName: '', areaSize: 0, biome: 'Mata Atlântica', region: 'SUDESTE', focus: [], selectedSpeciesIds: [] });
  const [consortium, setConsortium] = useState<Consortium | null>(null);
  const [prompt, setPrompt] = useState('');

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      const reg = PLANTS_DB.filter(p => p.suitableRegions.includes(data.region));
      const getP = (s: string) => reg.find(p => p.stratum === s) || PLANTS_DB.find(p => p.stratum === s)!;
      
      const e = getP('EMERGENTE'); const a = getP('ALTO'); const m = getP('MEDIO'); const b = getP('BAIXO');
      
      setConsortium({ emergente: e, alto: a, medio: m, baixo: b, horta: [] });
      setPrompt(`An illustration of a ${data.biome} agroforestry system. Layers: ${e.name}, ${a.name}, ${m.name} and ${b.name} over organic soil.`);
      setLoading(false);
      setStep('results');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="bg-white border-b p-4 flex items-center">
        <Leaf className="text-green-700 mr-2" /><span className="text-xl font-bold">SintroPlan</span>
      </nav>
      {step === 'hero' && <Hero onStart={() => setStep('form')} />}
      {step === 'form' && <InputForm data={data} onChange={setData} onSubmit={generate} isLoading={loading} />}
      {step === 'results' && consortium && <Results consortium={consortium} projectData={data} image_prompt={prompt} onUnlock={() => window.open('https://pay.hotmart.com/LINK', '_blank')} />}
    </div>
  );
}
