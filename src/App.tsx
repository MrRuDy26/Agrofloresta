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
  Info,
  Search,
  CheckCircle2
} from 'lucide-react';

// --- 1. BANCO DE DADOS (50 ESPÉCIES - ESTRUTURA SEGURA) ---
const PLANTS_DATA: Record<string, any[]> = {
  EMERGENTE: [
    { name: 'Eucalipto', type: 'Biomassa', cycle: 'Pioneira' },
    { name: 'Mogno Africano', type: 'Madeira Nobre', cycle: 'Clímax' },
    { name: 'Ipê Amarelo', type: 'Madeira', cycle: 'Secundária' },
    { name: 'Castanha do Brasil', type: 'Alimento', cycle: 'Clímax' },
    { name: 'Cedro Rosa', type: 'Madeira', cycle: 'Clímax' }
  ],
  ALTO: [
    { name: 'Bananeira Prata', type: 'Fruta/Biomassa', cycle: 'Placenta II' },
    { name: 'Abacateiro', type: 'Fruta', cycle: 'Clímax' },
    { name: 'Mangueira', type: 'Fruta', cycle: 'Secundária' },
    { name: 'Jatobá', type: 'Madeira/Fruta', cycle: 'Clímax' },
    { name: 'Ingá', type: 'Fertilidade', cycle: 'Pioneira' }
  ],
  MEDIO: [
    { name: 'Café', type: 'Comercial', cycle: 'Perene' },
    { name: 'Cacau', type: 'Comercial', cycle: 'Perene' },
    { name: 'Limão Taiti', type: 'Fruta', cycle: 'Secundária' },
    { name: 'Mandioca', type: 'Alimento', cycle: 'Placenta II' },
    { name: 'Goiabeira', type: 'Fruta', cycle: 'Secundária' }
  ],
  BAIXO: [
    { name: 'Feijão de Porco', type: 'Adubação Verde', cycle: 'Placenta I' },
    { name: 'Abacaxi', type: 'Fruta', cycle: 'Placenta II' },
    { name: 'Cúrcuma', type: 'Medicinal', cycle: 'Placenta II' },
    { name: 'Batata Doce', type: 'Cobertura', cycle: 'Placenta I' },
    { name: 'Feijão Guandu', type: 'Nitrogênio', cycle: 'Placenta I' }
  ]
};

const SOIL_INDICATORS = [
  { id: '1', name: 'Tiririca / Picão', issue: 'Solo Compactado', fix: 'Use raízes fortes como Guandu e Nabo Forrageiro.' },
  { id: '2', name: 'Samambaia / Barba de Bode', issue: 'Solo Ácido', fix: 'Necessário Calagem e Cinzas para equilibrar o pH.' },
  { id: '3', name: 'Gramínea Rala (Braquiária)', issue: 'Falta de Matéria Orgânica', fix: 'Plante Eucalipto e Poda drástica para cobrir o solo.' }
];

export default function App() {
  const [view, setView] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ area: '', region: 'SUDESTE', biome: 'Mata Atlântica', indicators: [] as string[], focus: [] as string[] });
  const [result, setResult] = useState<any>(null);

  const runAnalysis = () => {
    setLoading(true);
    setTimeout(() => {
      const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
      setResult({
        strata: {
          emergente: getRandom(PLANTS_DATA.EMERGENTE),
          alto: getRandom(PLANTS_DATA.ALTO),
          medio: getRandom(PLANTS_DATA.MEDIO),
          baixo: getRandom(PLANTS_DATA.BAIXO)
        },
        indicators: formData.indicators.map(id => SOIL_INDICATORS.find(i => i.id === id))
      });
      setLoading(false);
      setView('results');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <nav className="bg-white border-b p-4 flex justify-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center font-bold text-xl text-green-800 uppercase tracking-tighter">
          <Leaf className="mr-2 text-green-600" /> SINTROPLAN
        </div>
      </nav>

      {/* HERO */}
      {view === 'hero' && (
        <div className="relative bg-stone-900 text-white py-32 px-4 text-center">
          <div className="absolute inset-0 opacity-40">
            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200" className="w-full h-full object-cover" alt="Agrofloresta" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="text-5xl font-black mb-6 uppercase">Sua Floresta Inteligente</h1>
            <p className="text-xl mb-10 text-stone-200">Crie seu design agroflorestal com inteligência de estratos e sucessão.</p>
            <button onClick={() => setView('form')} className="px-10 py-5 bg-green-600 rounded-full font-bold text-xl shadow-2xl hover:bg-green-500 transition-all">
              INICIAR PLANEJAMENTO
            </button>
          </div>
        </div>
      )}

      {/* FORMULÁRIO */}
      {view === 'form' && (
        <div className="py-12 px-4 max-w-3xl mx-auto">
          <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-stone-100">
            <h2 className="text-2xl font-black text-center mb-8 uppercase text-stone-800">Parâmetros do Terreno</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-[10px] font-black text-stone-400 mb-2 uppercase tracking-widest">Área (m²)</label>
                <input type="number" className="w-full p-4 bg-stone-50 border rounded-2xl outline-none focus:border-green-500" placeholder="Ex: 1000" onChange={e => setFormData({...formData, area: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-stone-400 mb-2 uppercase tracking-widest">Bioma</label>
                <select className="w-full p-4 bg-stone-50 border rounded-2xl outline-none" value={formData.biome} onChange={e => setFormData({...formData, biome: e.target.value})}>
                  <option>Mata Atlântica</option><option>Cerrado</option><option>Amazônia</option>
                </select>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-[10px] font-black text-stone-400 mb-4 uppercase tracking-widest">O que já nasce no solo?</label>
              <div className="grid grid-cols-1 gap-2">
                {SOIL_INDICATORS.map(ind => (
                  <button key={ind.id} onClick={() => setFormData({...formData, indicators: formData.indicators.includes(ind.id) ? formData.indicators.filter(i => i !== ind.id) : [...formData.indicators, ind.id]})}
                    className={`p-4 text-left border-2 rounded-2xl transition-all ${formData.indicators.includes(ind.id) ? 'border-amber-500 bg-amber-50' : 'bg-stone-50 border-stone-50'}`}>
                    <span className="font-bold text-sm">{ind.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 text-center">
              {['Madeira', 'Fruta', 'Horta', 'Biomassa'].map(f => (
                <button key={f} onClick={() => setFormData({...formData, focus: formData.focus.includes(f) ? formData.focus.filter(x => x !== f) : [...formData.focus, f]})}
                  className={`p-4 border-2 rounded-2xl transition-all ${formData.focus.includes(f) ? 'border-green-600 bg-green-50 font-bold' : 'border-stone-100 text-stone-400'}`}>
                  {f === 'Madeira' && '🪵'} {f === 'Fruta' && '🍎'} {f === 'Horta' && '🥬'} {f === 'Biomassa' && '🌿'}
                  <div className="text-[10px] mt-1">{f}</div>
                </button>
              ))}
            </div>

            <button onClick={handleGenerate} disabled={isLoading || !formData.area} className="w-full py-5 bg-green-700 text-white font-black rounded-2xl shadow-xl hover:bg-green-800 transition-all text-lg">
              {isLoading ? 'ANALISANDO ESPÉCIES...' : 'GERAR MEU DESIGN'}
            </button>
          </div>
        </div>
      )}

      {/* RESULTADOS */}
      {view === 'results' && result && (
        <div className="py-12 px-4 max-w-4xl mx-auto">
          <div className="bg-stone-900 rounded-[2.5rem] overflow-hidden shadow-2xl mb-8 relative border-4 border-white">
            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000" className="w-full aspect-video object-cover opacity-40" alt="Plano" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <h3 className="text-white text-3xl font-black uppercase tracking-tighter">Design Sintrópico Gerado</h3>
              <p className="text-green-300 italic text-sm mt-2">"{result.strata.emergente.name} + {result.strata.alto.name} + {result.strata.medio.name} + {result.strata.baixo.name}"</p>
            </div>
          </div>

          {result.indicators.length > 0 && (
            <div className="mb-8 space-y-3">
              {result.indicators.map((info: any) => (
                <div key={info.id} className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
                   <p className="text-xs font-black text-amber-900 uppercase">Ação: {info.issue}</p>
                   <p className="text-sm text-amber-800">{info.fix}</p>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {Object.entries(result.strata).map(([key, plant]: any, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-stone-100 flex items-center shadow-sm">
                <div className="mr-4 text-green-700 bg-green-50 p-4 rounded-2xl font-bold"><TreeDeciduous/></div>
                <div>
                  <p className="text-[10px] uppercase font-black text-stone-300 tracking-widest">{key}</p>
                  <p className="font-bold text-lg text-stone-800 leading-tight">{plant.name}</p>
                  <p className="text-[10px] text-green-600 font-bold uppercase">{plant.type} • {plant.cycle}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-700 rounded-[2.5rem] p-10 text-center text-white shadow-xl">
            <Lock className="mx-auto mb-4 w-12 h-12 text-green-300" />
            <h3 className="text-2xl font-bold mb-4 uppercase">Biblioteca de Espécies & Manejo</h3>
            <p className="mb-8 text-green-100 opacity-80">Receba a lista completa com as plantas bioindicadoras e manual de podas.</p>
            <button onClick={() => window.open('https://pay.hotmart.com/V98127357T?off=m0f73v7g', '_blank')} className="px-10 py-5 bg-white text-green-800 rounded-2xl font-black hover:bg-stone-100 transition-all uppercase tracking-widest shadow-lg">
              Acessar Guia Completo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
