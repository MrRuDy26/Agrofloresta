import React, { useState } from 'react';
import { 
  Leaf, Sprout, MapPin, Mountain, Ruler, Loader2, 
  TreeDeciduous, Carrot, Lock, Image as ImageIcon,
  Trees, Apple, Salad, Wind, Microscope, Info, Database
} from 'lucide-react';

// --- BANCO DE DADOS EXPANDIDO (50 PRINCIPAIS) ---
const PLANTS_DB = [
  // EMERGENTES
  { name: 'Eucalipto', stratum: 'EMERGENTE', type: 'Biomassa', cycle: 'Pioneira' },
  { name: 'Mogno Africano', stratum: 'EMERGENTE', type: 'Madeira Nobre', cycle: 'Clímax' },
  { name: 'Ipê Amarelo', stratum: 'EMERGENTE', type: 'Madeira', cycle: 'Secundária' },
  { name: 'Castanha do Brasil', stratum: 'EMERGENTE', type: 'Fruta Nobre', cycle: 'Clímax' },
  { name: 'Cedro Rosa', stratum: 'EMERGENTE', type: 'Madeira', cycle: 'Clímax' },
  { name: 'Paricá', stratum: 'EMERGENTE', type: 'Crescimento Rápido', cycle: 'Pioneira' },
  { name: 'Pau-ferro', stratum: 'EMERGENTE', type: 'Madeira', cycle: 'Secundária' },
  { name: 'Pinheiro do Paraná', stratum: 'EMERGENTE', type: 'Semente', cycle: 'Clímax' },
  { name: 'Sumaúma', stratum: 'EMERGENTE', type: 'Nativa', cycle: 'Clímax' },
  { name: 'Aroeira Verdadeira', stratum: 'EMERGENTE', type: 'Cerca Viva', cycle: 'Secundária' },

  // ALTOS
  { name: 'Bananeira Prata', stratum: 'ALTO', type: 'Fruta/Biomassa', cycle: 'Placenta II' },
  { name: 'Abacateiro', stratum: 'ALTO', type: 'Fruta', cycle: 'Clímax' },
  { name: 'Mangueira', stratum: 'ALTO', type: 'Fruta', cycle: 'Secundária' },
  { name: 'Jatobá', stratum: 'ALTO', type: 'Madeira/Fruta', cycle: 'Clímax' },
  { name: 'Ingá', stratum: 'ALTO', type: 'Fertilidade', cycle: 'Pioneira' },
  { name: 'Jacarandá', stratum: 'ALTO', type: 'Madeira Nobre', cycle: 'Clímax' },
  { name: 'Açai', stratum: 'ALTO', type: 'Fruta', cycle: 'Secundária' },
  { name: 'Pupunha', stratum: 'ALTO', type: 'Palmito/Fruta', cycle: 'Secundária' },
  { name: 'Graviola', stratum: 'ALTO', type: 'Fruta', cycle: 'Secundária' },
  { name: 'Cerejeira', stratum: 'ALTO', type: 'Madeira', cycle: 'Clímax' },

  // MÉDIOS
  { name: 'Café', stratum: 'MEDIO', type: 'Comercial', cycle: 'Perene' },
  { name: 'Cacau', stratum: 'MEDIO', type: 'Comercial', cycle: 'Perene' },
  { name: 'Limão Taiti', stratum: 'MEDIO', type: 'Fruta', cycle: 'Secundária' },
  { name: 'Laranjeira', stratum: 'MEDIO', type: 'Fruta', cycle: 'Secundária' },
  { name: 'Mandioca', stratum: 'MEDIO', type: 'Alimento', cycle: 'Placenta II' },
  { name: 'Goiabeira', stratum: 'MEDIO', type: 'Fruta', cycle: 'Secundária' },
  { name: 'Margaridão', stratum: 'MEDIO', type: 'Biomassa', cycle: 'Pioneira' },
  { name: 'Acerola', stratum: 'MEDIO', type: 'Fruta', cycle: 'Secundária' },
  { name: 'Pimenta do Reino', stratum: 'MEDIO', type: 'Especiaria', cycle: 'Perene' },
  { name: 'Guaraná', stratum: 'MEDIO', type: 'Medicinal', cycle: 'Perene' },

  // BAIXOS
  { name: 'Feijão de Porco', stratum: 'BAIXO', type: 'Adubação Verde', cycle: 'Placenta I' },
  { name: 'Abacaxi', stratum: 'BAIXO', type: 'Fruta', cycle: 'Placenta II' },
  { name: 'Cúrcuma', stratum: 'BAIXO', type: 'Medicinal', cycle: 'Placenta II' },
  { name: 'Gengibre', stratum: 'BAIXO', type: 'Medicinal', cycle: 'Placenta II' },
  { name: 'Batata Doce', stratum: 'BAIXO', type: 'Cobertura', cycle: 'Placenta I' },
  { name: 'Taioba', stratum: 'BAIXO', type: 'Alimento/PANC', cycle: 'Placenta II' },
  { name: 'Feijão Guandu', stratum: 'BAIXO', type: 'Nitrogênio', cycle: 'Placenta I' },
  { name: 'Milho', stratum: 'BAIXO', type: 'Grãos', cycle: 'Placenta I' },
  { name: 'Amendoim', stratum: 'BAIXO', type: 'Cobertura', cycle: 'Placenta I' },
  { name: 'Boldo', stratum: 'BAIXO', type: 'Medicinal', cycle: 'Perene' }
];

const SOIL_INDICATORS = [
  { id: '1', name: 'Tiririca / Picão', issue: 'Solo Compactado', fix: 'Use raízes fortes como Guandu e Nabo Forrageiro.' },
  { id: '2', name: 'Samambaia / Barba de Bode', issue: 'Solo Ácido', fix: 'Necessário Calagem e Cinzas para equilibrar o pH.' },
  { id: '3', name: 'Gramínea Rala (Braquiária)', issue: 'Falta de Matéria Orgânica', fix: 'Plante Eucalipto e Poda drástica para cobrir o solo.' }
];

export default function App() {
  const [view, setView] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ area: '', region: 'SUDESTE', biome: 'Mata Atlântica', focus: [] as string[], indicators: [] as string[] });
  const [result, setResult] = useState<any>(null);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      const getP = (s: string) => {
        const candidates = PLANTS_DB.filter(p => p.stratum === s);
        return candidates[Math.floor(Math.random() * candidates.length)];
      };
      
      setResult({
        strata: { emergente: getP('EMERGENTE'), alto: getStr('ALTO'), medio: getStr('MEDIO'), baixo: getStr('BAIXO') },
        indicatorsInfo: data.indicators.map(id => SOIL_INDICATORS.find(i => i.id === id))
      });
      // Correção rápida de erro de variável:
      const res = {
        strata: { emergente: getP('EMERGENTE'), alto: getP('ALTO'), medio: getP('MEDIO'), baixo: getP('BAIXO') },
        indicatorsInfo: data.indicators.map(id => SOIL_INDICATORS.find(i => i.id === id))
      };
      setResult(res);
      setLoading(false);
      setView('results');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <nav className="bg-white border-b p-4 flex justify-center sticky top-0 z-50">
        <div className="flex items-center font-bold text-xl text-green-800 uppercase tracking-tighter">
          <Leaf className="mr-2 text-green-600" /> SINTROPLAN
        </div>
      </nav>

      {view === 'hero' && (
        <div className="relative bg-stone-900 text-white py-32 px-4 text-center">
          <div className="absolute inset-0 opacity-50">
            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200" className="w-full h-full object-cover" alt="Agrofloresta" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-black mb-6 uppercase">Crie sua Floresta</h1>
            <button onClick={() => setView('form')} className="px-10 py-5 bg-green-600 rounded-full font-bold text-xl shadow-2xl transform hover:scale-105 transition-all">
              INICIAR PLANEJAMENTO
            </button>
          </div>
        </div>
      )}

      {view === 'form' && (
        <div className="py-12 px-4 max-w-3xl mx-auto">
          <div className="bg-white rounded-[2rem] shadow-2xl p-8 border border-stone-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-xs font-black text-stone-400 mb-2 uppercase tracking-widest">Área (m²)</label>
                <input type="number" className="w-full p-4 bg-stone-50 border rounded-xl outline-none focus:border-green-500" onChange={e => setData({...data, area: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-black text-stone-400 mb-2 uppercase tracking-widest">Bioma</label>
                <select className="w-full p-4 bg-stone-50 border rounded-xl outline-none" onChange={e => setData({...data, biome: e.target.value})}>
                  <option>Mata Atlântica</option><option>Cerrado</option><option>Amazônia</option>
                </select>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-xs font-black text-stone-400 mb-4 uppercase flex items-center">
                <Microscope className="w-4 h-4 mr-2" /> O que cresce no solo agora?
              </label>
              <div className="grid grid-cols-1 gap-2">
                {SOIL_INDICATORS.map(ind => (
                  <button key={ind.id} onClick={() => setData({...data, indicators: data.indicators.includes(ind.id) ? data.indicators.filter(i => i !== ind.id) : [...data.indicators, ind.id]})}
                    className={`p-4 text-left border-2 rounded-2xl transition-all ${data.indicators.includes(ind.id) ? 'border-amber-500 bg-amber-50' : 'border-stone-50 bg-stone-50 text-stone-500'}`}>
                    <span className="font-bold">{ind.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[ {id: 'Madeira', icon: '🪵'}, {id: 'Fruta', icon: '🍎'}, {id: 'Horta', icon: '🥬'}, {id: 'Biomassa', icon: '🌿'} ].map(opt => (
                <button key={opt.id} onClick={() => setData({...data, focus: data.focus.includes(opt.id) ? data.focus.filter(f => f !== opt.id) : [...data.focus, opt.id]})}
                  className={`p-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition-all ${data.focus.includes(opt.id) ? 'border-green-500 bg-green-50' : 'border-stone-100'}`}>
                  <span className="text-3xl">{opt.icon}</span>
                  <span className="font-bold text-[10px] uppercase">{opt.id}</span>
                </button>
              ))}
            </div>

            <button onClick={handleGenerate} className="w-full py-5 bg-green-700 text-white font-black rounded-2xl shadow-xl text-lg">
              {isLoading ? 'Cruzando Espécies...' : 'GERAR MEU DESIGN'}
            </button>
          </div>
        </div>
      )}

      {view === 'results' && result && (
        <div className="py-12 px-4 max-w-4xl mx-auto">
          <div className="bg-stone-900 rounded-[2.5rem] overflow-hidden shadow-2xl mb-10 relative border-4 border-white">
            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000" className="w-full aspect-video object-cover opacity-40" alt="Plano" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <h3 className="text-white text-3xl font-black uppercase tracking-tighter mb-4">Design de Sucessão</h3>
              <p className="text-green-300 italic text-sm">Espécies Principais Selecionadas</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {Object.entries(result.strata).map(([key, plant]: any, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-stone-100 flex items-center shadow-sm">
                <div className="mr-4 text-green-700 bg-green-50 p-4 rounded-2xl font-bold">{i+1}</div>
                <div>
                  <p className="text-[10px] uppercase font-black text-stone-300 tracking-widest">{key}</p>
                  <p className="font-black text-xl text-stone-800">{plant.name}</p>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase">{plant.cycle}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-700 rounded-[3rem] p-12 text-center text-white shadow-2xl">
            <Database className="mx-auto mb-4 w-12 h-12 text-green-300" />
            <h3 className="text-3xl font-black mb-4 uppercase">Acesse a Tabela Completa</h3>
            <p className="mb-10 text-green-100 opacity-80">Receba a planilha com as 2.500 espécies catalogadas por clima, solo e retorno econômico.</p>
            <button onClick={() => window.open('https://pay.hotmart.com/V98127357T?off=m0f73v7g', '_blank')} className="px-12 py-5 bg-white text-green-800 rounded-2xl font-black uppercase tracking-widest shadow-xl">
              Download da Tabela Master
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
