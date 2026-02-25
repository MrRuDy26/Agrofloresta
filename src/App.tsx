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

// --- 1. DEFINIÇÃO DOS TIPOS ---
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

// --- 2. BANCO DE DADOS (EMBUTIDO AQUI MESMO) ---
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

// --- 3. COMPONENTE HERO ---
const Hero: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="relative bg-stone-900 text-white py-24 px-4 overflow-hidden">
    <div className="absolute inset-0 z-0 opacity-40">
       <img src="https://images.unsplash.com/photo-1598555848386-302380596377?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Agrofloresta" className="w-full h-full object-cover" />
    </div>
    <div className="relative z-10 max-w-4xl mx-auto text-center">
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
        Planeje sua <span className="text-green-400">Agrofloresta</span> em Segundos
      </h1>
      <p className="text-xl text-stone-300 mb-10 max-w-2xl mx-auto">
        Inteligência Artificial aplicada à Agricultura Sintrópica.
      </p>
      <button onClick={onStart} className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full text-lg shadow-lg transform hover:scale-105 transition-all">
        Começar Projeto Gratuito
      </button>
    </div>
  </div>
);

// --- 4. COMPONENTE FORMULÁRIO (INPUT) ---
interface InputFormProps {
  data: ProjectData;
  onChange: (data: ProjectData) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ data, onChange, onSubmit, isLoading = false }) => {
  const handleChange = (field: keyof ProjectData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const toggleFocus = (focusItem: string) => {
    const currentFocus = data.focus || [];
    const newFocus = currentFocus.includes(focusItem)
      ? currentFocus.filter(f => f !== focusItem)
      : [...currentFocus, focusItem];
    handleChange('focus', newFocus);
  };

  const focusOptions = [
    { id: 'Madeira', label: 'Madeira', icon: '🪵' },
    { id: 'Fruta', label: 'Fruta', icon: '🍎' },
    { id: 'Horta', label: 'Horta', icon: '🥬' },
    { id: 'Biomassa', label: 'Biomassa', icon: '🌿' },
  ];

  return (
    <section id="planner-form" className="py-16 px-4 sm:px-8 bg-stone-50">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-green-800 text-sm font-semibold mb-4">
            Passo 1: Diagnóstico da Área
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-4">
            Configuração do Sistema
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Defina os parâmetros para o algoritmo selecionar as espécies ideais.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 space-y-8 border border-stone-100">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">
              Nome do Projeto
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Sprout className="h-5 w-5 text-stone-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border-2 border-stone-200 rounded-xl leading-5 bg-white placeholder-stone-400 focus:outline-none focus:border-green-500 focus:ring-green-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Ex: Sítio Vale do Sol"
                value={data.projectName}
                onChange={(e) => handleChange('projectName', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">
                Área (m²)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Ruler className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="number"
                  className="block w-full pl-10 pr-3 py-3 border-2 border-stone-200 rounded-xl leading-5 bg-white placeholder-stone-400 focus:outline-none focus:border-green-500 focus:ring-green-500 sm:text-sm transition duration-150 ease-in-out"
                  placeholder="Ex: 5000"
                  value={data.areaSize || ''}
                  onChange={(e) => handleChange('areaSize', Number(e.target.value))}
                />
              </div>
              <p className="mt-1 text-xs text-stone-500">Tamanho total em m².</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">
                Região
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-stone-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-10 py-3 border-2 border-stone-200 rounded-xl leading-5 bg-white focus:outline-none focus:border-green-500 focus:ring-green-500 sm:text-sm appearance-none transition duration-150 ease-in-out text-stone-700"
                  value={data.region}
                  onChange={(e) => handleChange('region', e.target.value)}
                >
                  <option value="SUL">SUL</option>
                  <option value="SUDESTE">SUDESTE</option>
                  <option value="CENTRO-OESTE">CENTRO-OESTE</option>
                  <option value="NORDESTE">NORDESTE</option>
                  <option value="NORTE">NORTE</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">
                Bioma
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mountain className="h-5 w-5 text-stone-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-10 py-3 border-2 border-stone-200 rounded-xl leading-5 bg-white focus:outline-none focus:border-green-500 focus:ring-green-500 sm:text-sm appearance-none transition duration-150 ease-in-out text-stone-700"
                  value={data.biome}
                  onChange={(e) => handleChange('biome', e.target.value)}
                >
                   <option value="Mata Atlântica">Mata Atlântica</option>
                   <option value="Cerrado">Cerrado</option>
                   <option value="Amazônia">Amazônia</option>
                   <option value="Caatinga">Caatinga</option>
                   <option value="Pampa">Pampa</option>
                   <option value="Pantanal">Pantanal</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-4">
              Foco Principal (Selecione)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {focusOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => toggleFocus(option.id)}
                  className={`py-4 px-2 rounded-xl border-2 text-center transition-all duration-200 ease-in-out flex flex-col items-center justify-center gap-2 ${
                    data.focus.includes(option.id)
                      ? 'border-green-600 bg-green-50 text-green-800 shadow-md transform scale-105'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="font-bold text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={onSubmit}
              disabled={isLoading || data.focus.length === 0}
              className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-br from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 focus:outline-none transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
                (isLoading || data.focus.length === 0) ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-6 w-6" />
                  Calculando Consórcio...
                </>
              ) : (
                'Gerar Meu Plano'
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- 5. COMPONENTE RESULTADOS ---
interface ResultsProps {
  consortium: Consortium;
  projectData: any;
  isPro: boolean;
  onUnlock: () => void;
  image_prompt?: string;
  sales_hook?: string;
}

const Results: React.FC<ResultsProps> = ({ 
  consortium, 
  projectData, 
  onUnlock,
  image_prompt,
  sales_hook
}) => {
  if (!consortium) return null;

  const strataConfig = {
    emergente: { icon: TreeDeciduous, color: 'text-green-800', bgColor: 'bg-green-100', label: 'Emergente (Dossel)' },
    alto: { icon: TreeDeciduous, color: 'text-teal-700', bgColor: 'bg-teal-100', label: 'Estrato Alto' },
    medio: { icon: Leaf, color: 'text-lime-700', bgColor: 'bg-lime-100', label: 'Estrato Médio' },
    baixo: { icon: Carrot, color: 'text-emerald-700', bgColor: 'bg-emerald-100', label: 'Estrato Baixo' },
  };

  return (
    <section id="results-section" className="py-16 px-4 sm:px-8 bg-stone-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
             <span className="inline-block py-1 px-3 rounded-full bg-green-600 text-white text-sm font-semibold mb-4 shadow-sm">
                Resultado da Análise
            </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-800">
            Seu Consórcio Ideal
          </h2>
          <p className="text-lg text-stone-600 mt-4 max-w-2xl mx-auto">
            Combinação sintrópica selecionada para: {projectData.biome}
          </p>
        </div>
        
        {/* BOX PRETO DO PROMPT */}
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl mb-12 border border-slate-800 relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-green-500/5 to-transparent opacity-50 pointer-events-none"></div>
            <div className="p-8 sm:p-10 relative z-10">
                <div className="flex items-center mb-6">
                    <div className="p-3 bg-green-900/30 rounded-xl mr-4 backdrop-blur-sm border border-green-500/20">
                         <ImageIcon className="h-8 w-8 text-green-400" />
                    </div>
                    <div>
                         <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                            VISUALIZAÇÃO DO PROJETO
                        </h3>
                        <p className="text-green-300/80 text-sm mt-1 font-medium">
                            Prompt gerado para IA de Imagem (Integração Futura)
                        </p>
                    </div>
                </div>
               <div className="bg-slate-950/80 p-6 rounded-2xl border border-green-500/30 backdrop-blur-md relative overflow-hidden">
                    <div className="font-mono text-xs sm:text-sm text-green-400 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                        {image_prompt || "Aguardando geração do prompt visual..."}
                    </div>
               </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {Object.entries(consortium).map(([key, value]) => {
            if (key === 'horta' && Array.isArray(value)) return null; 
            const plant = value as any;
            if (!plant || !strataConfig[key as keyof typeof strataConfig]) return null;
            
            const config = strataConfig[key as keyof typeof strataConfig];
            const Icon = config.icon;

            return (
              <div key={key} className="bg-white rounded-3xl shadow-xl p-5 border border-stone-100 flex items-center">
                 <div className={`p-3 rounded-2xl mr-4 ${config.bgColor} ${config.color}`}>
                      <Icon className="h-6 w-6" />
                 </div>
                 <div>
                    <h4 className="text-xs uppercase font-bold text-stone-400 tracking-wider">{config.label}</h4>
                    <p className="text-xl font-bold text-stone-800">{plant.name}</p>
                 </div>
              </div>
            );
          })}
        </div>

        <div className="bg-stone-900 rounded-3xl shadow-2xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex p-4 mb-6 bg-stone-800 rounded-full shadow-md border border-stone-700">
                  <Lock className="h-10 w-10 text-green-500" />
              </div>
            <h3 className="text-3xl font-extrabold text-white mb-6">
              Guia de Implementação Técnica
            </h3>
            <ul className="text-left inline-block mx-auto space-y-4 mb-10 text-stone-500">
                <li className="flex items-center text-lg"><Lock className="h-5 w-5 mr-3"/> <span className="blur-sm">Espaçamento Otimizado</span></li>
                <li className="flex items-center text-lg"><Lock className="h-5 w-5 mr-3"/> <span className="blur-sm">Cronograma de Poda</span></li>
                <li className="flex items-center text-lg"><Lock className="h-5 w-5 mr-3"/> <span className="blur-sm">Receita de Adubação</span></li>
            </ul>
            <button
              onClick={onUnlock}
              className="px-8 py-4 text-lg font-extrabold rounded-2xl text-white bg-green-600 hover:bg-green-500 shadow-lg transform hover:scale-105 transition-all w-full sm:w-auto"
            >
              DESBLOQUEAR GUIA COMPLETO
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- 6. LÓGICA PRINCIPAL (APP) ---
const App: React.FC = () => {
  const [step, setStep] = useState<'hero' | 'form' | 'results'>('hero');
  const [isLoading, setIsLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);

  // Estados dos dados
  const [projectData, setProjectData] = useState<ProjectData>({
    projectName: '',
    areaSize: 0,
    biome: 'Mata Atlântica',
    region: 'SUDESTE',
    focus: [],
    selectedSpeciesIds: []
  });

  const [consortium, setConsortium] = useState<Consortium | null>(null);
  
  const [aiExtras, setAiExtras] = useState<{
    image_prompt: string;
    sales_hook: string;
  }>({ image_prompt: '', sales_hook: '' });

  const handleStart = () => {
    setStep('form');
    setTimeout(() => {
      const formElement = document.getElementById('planner-form');
      if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleUnlock = () => {
    // COLOQUE SEU LINK DE AFILIADO AQUI
    window.open('https://pay.hotmart.com/SEU_LINK', '_blank');
  };

  const generateConsortium = () => {
    setIsLoading(true);

    setTimeout(() => {
      // Lógica Simples Local
      const regionalPlants = PLANTS_DB.filter(p => p.suitableRegions.includes(projectData.region));
      const userSelectedPlants = regionalPlants.filter(p => projectData.selectedSpeciesIds.includes(p.id));

      const pickBest = (stratum: string): Plant => {
        const userChoice = userSelectedPlants.find(p => p.stratum === stratum);
        if (userChoice) return userChoice;
        const candidates = regionalPlants.filter(p => p.stratum === stratum);
        // Fallback genérico se não encontrar planta
        if (candidates.length === 0) return { id: 'gen', name: 'Nativa Local', stratum: stratum as any, function: 'Biomassa', suitableRegions: [], lifecycle: 'PERENE' };
        return candidates[0];
      };

      const emergente = pickBest('EMERGENTE');
      const alto = pickBest('ALTO');
      const medio = pickBest('MEDIO');
      const baixo = pickBest('BAIXO');
      
      const newConsortium = { emergente, alto, medio, baixo, horta: [] };

      // GERA O TEXTO DO PROMPT (INGLÊS)
      const promptText = `An educational, realistic cross-section botanical illustration of a syntropic agroforestry system in the ${projectData.biome} biome. 
Layers:
1. Emergent: Towering ${emergente.name} trees receiving full sunlight.
2. High Stratum: Dense layer of ${alto.name} trees below the emergent ones.
3. Medium Stratum: ${medio.name} bushes filling the understory.
4. Low Stratum: Ground covered with ${bajo.name} and organic mulch.
Style: Scientific poster, high detail, 8k resolution, god rays filtering through leaves.`;

      setConsortium(newConsortium);
      setAiExtras({
        image_prompt: promptText,
        sales_hook: ''
      });
      
      setIsLoading(false);
      setStep('results');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-stone-50">
      <nav className="bg-white border-b border-stone-200 py-4 px-4 sm:px-8 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setStep('hero')}>
          <div className="bg-green-700 p-2 rounded-lg">
             <Leaf className="text-white h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-stone-800 tracking-tight">SintroPlan</span>
        </div>
      </nav>

      <main className="flex-grow">
        {step === 'hero' && <Hero onStart={handleStart} />}
        
        {step === 'form' && (
          <InputForm 
            data={projectData} 
            onChange={setProjectData} 
            onSubmit={generateConsortium}
            isLoading={isLoading}
          />
        )}

        {step === 'results' && consortium && (
          <Results 
            consortium={consortium} 
            projectData={projectData} 
            isPro={isPro}
            onUnlock={handleUnlock}
            image_prompt={aiExtras.image_prompt}
            sales_hook={aiExtras.sales_hook}
          />
        )}
      </main>

      <footer className="bg-stone-900 text-stone-400 py-8 px-4 text-center text-sm border-t border-stone-800">
        <p>© {new Date().getFullYear()} SintroPlan.</p>
      </footer>
    </div>
  );
};

export default App;
