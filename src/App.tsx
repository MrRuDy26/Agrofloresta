import React, { useState } from 'react';
import { 
  Leaf, Sprout, MapPin, Mountain, Ruler, Loader2, 
  TreeDeciduous, Carrot, Lock, Image as ImageIcon,
  Trees, Apple, Salad, Wind, Microscope, AlertTriangle
} from 'lucide-react';

// --- BANCO DE DADOS EXPANDIDO ---
const PLANTS_DB = [
  { id: '1', name: 'Guanandi', stratum: 'EMERGENTE', type: 'Madeira' },
  { id: '2', name: 'Mogno Africano', stratum: 'EMERGENTE', type: 'Madeira' },
  { id: '3', name: 'Eucalipto', stratum: 'EMERGENTE', type: 'Biomassa' },
  { id: '4', name: 'Cedro Australiano', stratum: 'ALTO', type: 'Madeira' },
  { id: '5', name: 'Abacateiro', stratum: 'ALTO', type: 'Fruta' },
  { id: '6', name: 'Bananeira', stratum: 'ALTO', type: 'Fruta' },
  { id: '7', name: 'Café', stratum: 'MEDIO', type: 'Fruta' },
  { id: '8', name: 'Mandioca', stratum: 'MEDIO', type: 'Alimento' },
  { id: '9', name: 'Citros (Limão/Laranja)', stratum: 'MEDIO', type: 'Fruta' },
  { id: '10', name: 'Cúrcuma/Gengibre', stratum: 'BAIXO', type: 'Medicinal' },
  { id: '11', name: 'Abacaxi', stratum: 'BAIXO', type: 'Fruta' },
  { id: '12', name: 'Batata Doce', stratum: 'BAIXO', type: 'Alimento' }
];

const INDICATORS = [
  { id: 'acid', name: 'Samambaia / Barba de Bode', issue: 'Solo Ácido' },
  { id: 'compact', name: 'Tiririca / Picão', issue: 'Solo Compactado' },
  { id: 'poor', name: 'Gramíneas ralas', issue: 'Baixa Matéria Orgânica' }
];

export default function App() {
  const [view, setView] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ 
    area: '', 
    region: 'SUDESTE', 
    indicators: [] as string[],
    focus: [] as string[] 
  });
  const [result, setResult] = useState<any>(null);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      // Lógica de seleção por estrato
      const getP = (s: string) => PLANTS_DB.filter(p => p.stratum === s)[Math.floor(Math.random() * 2)];
      
      setResult({
        species: { emergente: getP('EMERGENTE'), alto: getP('ALTO'), medio: getP('MEDIO'), baixo: getP('BAIXO') },
        soilAnalysis: data.indicators.length > 0 ? "Necessário correção com calagem e aumento de biomassa." : "Solo equilibrado. Foco em manutenção."
      });
      setLoading(false);
      setView('results');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      <nav className="bg-white border-b p-4 flex justify-center sticky top-0 z-50">
        <div className="flex items-center font-bold text-xl text-green-800 uppercase tracking-tighter">
          <Leaf className="mr-2 text-green-600" /> SINTROPLAN
        </div>
      </nav>

      {view === 'hero' && (
        <div className="relative bg-stone-900 text-white py-32 px-4 text-center">
          <div className="absolute inset-0 opacity-40">
            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200" className="w-full h-full object-cover" alt="Agrofloresta" />
          </div>
          <div className="relative z-10">
            <h1 className="text-5xl font-black mb-6 uppercase">Inteligência Sintrópica</h1>
            <p className="text-xl mb-10 text-stone-200">Seu solo diz o que ele precisa. Nós dizemos o que plantar.</p>
            <button onClick={() => setView('form')} className="px-10 py-4 bg-green-600 rounded-full font-bold text-lg hover:bg-green-500 transition-all shadow-xl">
              ANALYSE SEU TERRENO
            </button>
          </div>
        </div>
      )}

      {view === 'form' && (
        <div className="py-12 px-4 max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-stone-100">
            <h2 className="text-2xl font-bold text-center mb-8 uppercase tracking-tight">Diagnóstico Ambiental</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-xs font-black text-stone-500 mb-2 uppercase">Área (m²)</label>
                <input type="number" className="w-full p-3 bg-stone-50 border rounded-xl outline-none focus:border-green-500" onChange={e => setData({...data, area: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-black text-stone-500 mb-2 uppercase">Região</label>
                <select className="w-full p-3 bg-stone-50 border rounded-xl outline-none" onChange={e => setData({...data, region: e.target.value})}>
                  <option value="SUDESTE">SUDESTE</option><option value="SUL">SUL</option><option value="NORTE">NORTE</option><option value="NORDESTE">NORDESTE</option>
                </select>
              </div>
            </div>

            {/* SEÇÃO DE INDICADORES (O DIFERENCIAL) */}
            <div className="mb-8">
              <label className="flex items-center text-xs font-black text-stone-500 mb-4 uppercase">
                <Microscope className="w-4 h-4 mr-2" /> O que já cresce no local? (Bioindicadores)
              </label>
              <div className="grid grid-cols-1 gap-2">
                {INDICATORS.map(ind => (
                  <button 
                    key={ind.id}
                    onClick={() => setData({...data, indicators: data.indicators.includes(ind.id) ? data.indicators.filter(i => i !== ind.id) : [...data.indicators, ind.id]})}
                    className={`p-3 text-left border rounded-xl text-sm transition-all ${data.indicators.includes(ind.id) ? 'bg-amber-50 border-amber-500 text-amber-800' : 'bg-white border-stone-100'}`}
                  >
                    {ind.name}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleGenerate} disabled={loading} className="w-full py-5 bg-green-700 text-white font-bold rounded-2xl shadow-lg flex justify-center items-center text-lg hover:bg-green-800 transition-all">
              {loading ? <><Loader2 className="animate-spin mr-2" /> Cruzando Dados...</> : 'GERAR MEU DESIGN'}
            </button>
          </div>
        </div>
      )}

      {view === 'results' && result && (
        <div className="py-12 px-4 max-w-4xl mx-auto">
          {/* ALERTAS DE SOLO */}
          {data.indicators.length > 0 && (
            <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl flex items-start">
              <AlertTriangle className="text-amber-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <p className="font-bold text-amber-900 text-sm uppercase">Alerta de Solo</p>
                <p className="text-amber-800 text-sm">{result.soilAnalysis}</p>
              </div>
            </div>
          )}

          {/* DIAGRAMA SIMPLIFICADO */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {Object.entries(result.species).map(([key, plant]: any) => (
              <div key={key} className="bg-white p-6 rounded-2xl border text-center shadow-sm">
                <p className="text-[10px] font-black text-stone-400 uppercase">{key}</p>
                <p className="font-bold text-stone-800">{plant.name}</p>
              </div>
            ))}
          </div>

          <div className="bg-green-700 rounded-[2.5rem] p-10 text-center text-white shadow-xl">
            <Lock className="mx-auto mb-4 w-12 h-12" />
            <h2 className="text-2xl font-bold mb-4">Acesse a Lista com 2.500 Espécies</h2>
            <p className="mb-8 text-green-100">Inclui tabelas de bioindicação, funções medicinais e consórcios prontos.</p>
            <button onClick={() => window.open('https://pay.hotmart.com/V98127357T?off=m0f73v7g', '_blank')} className="px-10 py-4 bg-white text-green-700 rounded-xl font-bold uppercase tracking-widest">
              Comprar Guia Completo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
