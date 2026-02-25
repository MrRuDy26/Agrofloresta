import React, { useState, useEffect } from 'react';
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

// --- TIPOS ---
interface Plant {
  id: string;
  name: string;
  stratum: 'EMERGENTE' | 'ALTO' | 'MEDIO' | 'BAIXO';
  function: string;
  suitableRegions: string[];
}

interface Consortium {
  emergente: Plant;
  alto: Plant;
  medio: Plant;
  baixo: Plant;
}

interface ProjectData {
  projectName: string;
  areaSize: number;
  biome: string;
  region: string;
  focus: string[];
}

// --- BANCO DE DADOS INTEGRADO ---
const PLANTS_DB: Plant[] = [
  { id: '1', name: 'Guanandi', stratum: 'EMERGENTE', function: 'Madeira', suitableRegions: ['SUDESTE', 'SUL', 'NORDESTE'] },
  { id: '2', name: 'Eucalipto', stratum: 'EMERGENTE', function: 'Biomassa', suitableRegions: ['SUDESTE', 'SUL', 'CENTRO-OESTE'] },
  { id: '3', name: 'Bananeira Prata', stratum: 'ALTO', function: 'Fruta', suitableRegions: ['SUDESTE', 'NORDESTE', 'NORTE'] },
  { id: '4', name: 'Abacateiro', stratum: 'ALTO', function: 'Fruta', suitableRegions: ['SUDESTE', 'SUL'] },
  { id: '5', name: 'Café Arábica', stratum: 'MEDIO', function: 'Fruta', suitableRegions: ['SUDESTE', 'SUL'] },
  { id: '6', name: 'Mandioca', stratum: 'MEDIO', function: 'Horta', suitableRegions: ['SUDESTE', 'NORDESTE', 'NORTE'] },
  { id: '7', name: 'Abacaxi', stratum: 'BAIXO', function: 'Fruta', suitableRegions: ['SUDESTE', 'NORDESTE'] },
  { id: '8', name: 'Cúrcuma', stratum: 'BAIXO', function: 'Horta', suitableRegions: ['SUDESTE', 'NORTE'] }
];

// --- COMPONENTE FORMULÁRIO ---
const InputForm: React.FC<{ data: ProjectData; onChange: (data: ProjectData) => void; onSubmit: () => void; isLoading: boolean }> = ({ data, onChange, onSubmit, isLoading }) => {
  const handleChange = (field: keyof ProjectData, value: any) => onChange({ ...data, [field]: value });
  
  const toggleFocus = (id: string) => {
    const focus = data.focus.includes(id) ? data.focus.filter(f => f !== id) : [...data.focus, id];
    handleChange('focus', focus);
  };

  const focusOptions = [
    { id: 'Madeira', label: 'Madeira', icon: <Trees className="w-6 h-6" />, color: 'text-amber-700', bg: 'bg-amber-50' },
    { id: 'Fruta', label: 'Fruta', icon: <Apple className="w-6 h-6" />, color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'Horta', label: 'Horta', icon: <Salad className="w-6 h-6" />, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'Biomassa', label: 'Biomassa', icon: <Wind className="w-6 h-6" />, color: 'text-lime-600', bg: 'bg-lime-50' },
  ];

  return (
    <section id="planner-form" className="py-12 px-4 bg-stone-50">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border border-stone-100">
        <h2 className="text-3xl font-bold text-stone-800 mb-2">Configuração do Sistema</h2>
        <p className="text-stone-500 mb-8">Defina os parâmetros para o consórcio ideal.</p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Nome do Projeto</label>
            <input 
              type="text" 
              className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-2xl focus:border-green-500 outline-none transition-all"
              placeholder="Ex: Sítio Vale do Sol"
              value={data.projectName}
              onChange={e => handleChange('projectName', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Área (m²)</label>
              <input 
                type="number" 
                className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-2xl focus:border-green-500 outline-none"
                placeholder="Ex: 1000"
                value={data.areaSize || ''}
                onChange={e => handleChange('areaSize', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Região</label>
              <select 
                className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-2xl focus:border-green-500 outline-none appearance-none"
                value={data.region}
                onChange={e => handleChange('region', e.target.value)}
              >
                <option value="SUDESTE">SUDESTE</option>
                <option value="SUL">SUL</option>
                <option value="NORDESTE">NORDESTE</option>
                <option value="NORTE">NORTE</option>
                <option value="CENTRO-OESTE">CENTRO-OESTE</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Bioma</label>
              <select 
                className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-2xl focus:border-green-500 outline-none appearance-none"
                value={data.biome}
                onChange={e => handleChange('biome', e.target.value)}
              >
                <option value="Mata Atlântica">Mata Atlântica</option>
                <option value="Cerrado">Cerrado</option>
                <option value="Amazônia">Amazônia</option>
                <option value="Caatinga">Caatinga</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-4">Foco Principal (Selecione um ou mais)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {focusOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => toggleFocus(opt.id)}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                    data.focus.includes(opt.id) 
                    ? `border-green-500 ${opt.bg} shadow-inner scale-95` 
                    : 'border-stone-100 hover:border-stone-200'
                  }`}
                >
                  <div className={`${opt.color} mb-2`}>{opt.icon}</div>
                  <span className="font-bold text-stone-700">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={onSubmit} 
            disabled={isLoading || data.focus.length === 0}
            className="w-full py-5 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xl rounded-2xl shadow-lg transition-all flex justify-center items-center disabled:opacity-50"
          >
            {isLoading ? <><Loader2 className="animate-spin mr-3" /> Calculando Consórcio...</> : 'Gerar Consórcio'}
          </button>
        </div>
      </div>
    </section>
  );
};

// --- COMPONENTE RESULTADOS ---
const Results: React.FC<{ consortium: Consortium; projectData: any; prompt: string; onUnlock: () => void }> = ({ consortium, projectData, prompt, onUnlock }) => {
  return (
    <section className="py-12 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-stone-800 mb-4">Seu Plano de Plantio</h2>
        <p className="text-stone-500">Baseado no bioma {projectData.biome} para {projectData.areaSize} m².</p>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-8 mb-12 shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><ImageIcon className="w-24 h-24 text-white" /></div>
        <div className="flex items-center text-green-400 mb-6 font-bold tracking-widest text-sm">
          <ImageIcon className="mr-2 w-5 h-5" /> VISUALIZAÇÃO DO PROJETO
        </div>
        <div className="bg-slate-950/50 p-6 rounded-2xl border border-green-500/20 font-mono text-green-400 leading-relaxed">
          {prompt}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {Object.entries(consortium).map(([key, plant]) => (
          <div key={key} className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex items-center group hover:shadow-md transition-all">
            <div className="mr-5 p-4 bg-green-50 rounded-2xl group-hover:bg-green-100 transition-colors">
              <TreeDeciduous className="text-green-700 w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] text-stone-400 uppercase font-black tracking-widest mb-1">{key}</p>
              <p className="text-2xl font-bold text-stone-800">{plant.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-stone-900 rounded-[3rem] p-12 text-center text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-transparent"></div>
        <Lock className="mx-auto mb-6 text-green-500 h-16 w-16" />
        <h3 className="text-3xl font-bold mb-4 relative z-10">Guia de Manejo e Podas</h3>
        <p className="text-stone-400 mb-10 max-w-md mx-auto relative z-10">Desbloqueie o cronograma completo de como cuidar do seu sistema mês a mês.</p>
        <button onClick={onUnlock} className="w-full md:w-auto px-16 py-5 bg-green-600 hover:bg-green-500 rounded-2xl font-black text-xl shadow-xl transition-all relative z-10 scale-100 hover:scale-105">
          DESBLOQUEAR ACESSO
        </button>
      </div>
    </section>
  );
};

// --- COMPONENTE PRINCIPAL ---
const App: React.FC = () => {
  const [step, setStep] = useState<'hero' | 'form' | 'results'>('hero');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ProjectData>({ projectName: '', areaSize: 0, biome: 'Mata Atlântica', region: 'SUDESTE', focus: [] });
  const [consortium, setConsortium] = useState<Consortium | null>(null);
  const [prompt, setPrompt] = useState('');

  const handleGenerate = () => {
    setIsLoading(true);
    setTimeout(() => {
      const reg = PLANTS_DB.filter(p => p.suitableRegions.includes(data.region));
      const getStr = (s: string) => reg.find(p => p.stratum === s) || PLANTS_DB.find(p => p.stratum === s)!;
      
      const e = getStr('EMERGENTE');
      const a = getStr('ALTO');
      const m = getStr('MEDIO');
      const b = getStr('BAIXO');

      setConsortium({ emergente: e, alto: a, medio: m, baixo: b });
      setPrompt(`A realistic, highly detailed 8k illustration of a syntropic agroforestry system in the ${data.biome} biome. 
      Layers include: ${e.name} (Emergent), ${a.name} (High canopy), ${m.name} (Medium story), and ${b.name} (Ground layer) on rich organic soil with mulch.`);
      
      setIsLoading(false);
      setStep('results');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans antialiased text-stone-900">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-100 p-4">
        <div className="max-w-6xl mx-auto flex items-center">
          <div className="bg-green-600 p-2 rounded-xl mr-3 shadow-green-200 shadow-lg">
            <Leaf className="text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-black tracking-tighter">SintroPlan</span>
        </div>
      </nav>

      {step === 'hero' && (
        <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 bg-stone-900">
            <img 
              src="https://images.unsplash.com/photo-1598555848386-302380596377?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
              alt="Forest" className="w-full h-full object-cover opacity-50" 
            />
          </div>
          <div className="relative z-10 text-center px-4 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Sua Agrofloresta <br/> <span className="text-green-400 underline decoration-green-400">Planejada em Segundos</span>
            </h1>
            <button 
              onClick={() => setStep('form')} 
              className="px-12 py-5 bg-green-500 hover:bg-green-400 text-white font-black text-2xl rounded-full shadow-2xl transition-all transform hover:scale-105"
            >
              Começar Planejamento Gratuito
            </button>
          </div>
        </div>
      )}

      {step === 'form' && <InputForm data={data} onChange={setData} onSubmit={handleGenerate} isLoading={isLoading} />}
      {step === 'results' && consortium && <Results consortium={consortium} projectData={data} prompt={prompt} onUnlock={() => window.open('https://hotmart.com', '_blank')} />}
      
      <footer className="py-12 border-t border-stone-200 text-center text-stone-400 text-sm">
        © 2026 SintroPlan - Inteligência Sintrópica
      </footer>
    </div>
  );
};

export default App;
