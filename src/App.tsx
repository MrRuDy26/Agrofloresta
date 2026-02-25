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
} from 'lucide-center'; // Nota: se der erro de ícone, mude para 'lucide-react'

// --- BANCO DE DADOS ---
const PLANTS_DB = [
  { id: '1', name: 'Guanandi', stratum: 'EMERGENTE', regions: ['SUL', 'SUDESTE', 'NORDESTE'] },
  { id: '2', name: 'Mogno Africano', stratum: 'EMERGENTE', regions: ['CENTRO-OESTE', 'NORTE', 'SUDESTE'] },
  { id: '3', name: 'Bananeira Prata', stratum: 'ALTO', regions: ['SUL', 'SUDESTE', 'NORDESTE', 'NORTE'] },
  { id: '4', name: 'Abacateiro', stratum: 'ALTO', regions: ['SUDESTE', 'SUL', 'CENTRO-OESTE'] },
  { id: '5', name: 'Café Arábica', stratum: 'MEDIO', regions: ['SUDESTE', 'SUL', 'NORDESTE'] },
  { id: '6', name: 'Mandioca', stratum: 'MEDIO', regions: ['NORTE', 'NORDESTE', 'SUDESTE'] },
  { id: '7', name: 'Abacaxi', stratum: 'BAIXO', regions: ['NORTE', 'NORDESTE', 'SUDESTE'] },
  { id: '8', name: 'Batata Doce', stratum: 'BAIXO', regions: ['SUL', 'SUDESTE', 'NORDESTE'] }
];

export default function App() {
  const [view, setView] = useState('hero'); // 'hero', 'form', 'results'
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ area: '', region: 'SUDESTE', biome: 'Mata Atlântica', focus: [] as string[] });
  const [result, setResult] = useState<any>(null);

  // Função para gerar o plano
  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      const filtered = PLANTS_DB.filter(p => p.regions.includes(data.region));
      const getP = (s: string) => filtered.find(p => p.stratum === s) || PLANTS_DB.find(p => p.stratum === s);
      
      setResult({
        emergente: getP('EMERGENTE'),
        alto: getP('ALTO'),
        medio: getP('MEDIO'),
        baixo: getP('BAIXO')
      });
      setLoading(false);
      setView('results');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* HEADER */}
      <nav className="bg-white border-b p-4 flex justify-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center font-bold text-xl text-green-800 uppercase tracking-tighter">
          <Leaf className="mr-2 text-green-600" /> SINTROPLAN
        </div>
      </nav>

      {/* TELA 1: HERO */}
      {view === 'hero' && (
        <div className="relative bg-stone-900 text-white py-32 px-4 text-center">
          <div className="absolute inset-0 opacity-40">
            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200" className="w-full h-full object-cover" alt="Agrofloresta" />
          </div>
          <div className="relative z-10">
            <h1 className="text-5xl font-black mb-6 uppercase">Sua Agrofloresta em Segundos</h1>
            <p className="text-xl mb-10 text-stone-200">Inteligência de dados para o seu plantio.</p>
            <button onClick={() => setView('form')} className="px-10 py-4 bg-green-600 rounded-full font-bold text-lg hover:bg-green-500 transition-all shadow-xl">
              COMEÇAR PLANEJAMENTO
            </button>
          </div>
        </div>
      )}

      {/* TELA 2: FORMULÁRIO */}
      {view === 'form' && (
        <div className="py-12 px-4 max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-stone-100">
            <h2 className="text-2xl font-bold text-center mb-8 text-stone-800 uppercase">Configurações</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-xs font-black text-stone-500 mb-2 uppercase">Área (m²)</label>
                <input type="number" className="w-full p-3 bg-stone-50 border rounded-xl outline-none focus:border-green-500" value={data.area} onChange={e => setData({...data, area: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-black text-stone-500 mb-2 uppercase">Região</label>
                <select className="w-full p-3 bg-stone-50 border rounded-xl outline-none" value={data.region} onChange={e => setData({...data, region: e.target.value})}>
                  <option value="SUDESTE">SUDESTE</option><option value="SUL">SUL</option><option value="NORTE">NORTE</option><option value="NORDESTE">NORDESTE</option><option value="CENTRO-OESTE">CENTRO-OESTE</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-stone-500 mb-2 uppercase">Bioma</label>
                <select className="w-full p-3 bg-stone-50 border rounded-xl outline-none" value={data.biome} onChange={e => setData({...data, biome: e.target.value})}>
                  <option value="Mata Atlântica">Mata Atlântica</option><option value="Cerrado">Cerrado</option><option value="Amazônia">Amazônia</option>
                </select>
              </div>
            </div>

            <label className="block text-xs font-black text-stone-500 mb-4 uppercase text-center">Objetivo</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[ {id: 'Madeira', icon: '🪵'}, {id: 'Fruta', icon: '🍎'}, {id: 'Horta', icon: '🥬'}, {id: 'Biomassa', icon: '🌿'} ].map(opt => (
                <button 
                  key={opt.id} 
                  onClick={() => setData({...data, focus: data.focus.includes(opt.id) ? data.focus.filter(f => f !== opt.id) : [...data.focus, opt.id]})}
                  className={`p-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition-all ${data.focus.includes(opt.id) ? 'border-green-500 bg-green-50' : 'border-stone-100'}`}
                >
                  <span className="text-3xl">{opt.icon}</span>
                  <span className="font-bold text-xs uppercase">{opt.id}</span>
                </button>
              ))}
            </div>

            <button onClick={handleGenerate} disabled={loading || data.focus.length === 0} className="w-full py-5 bg-green-700 text-white font-bold rounded-2xl shadow-lg flex justify-center items-center text-lg hover:bg-green-800 transition-all">
              {loading ? <><Loader2 className="animate-spin mr-2" /> Analisando...</> : 'GERAR MEU PLANO'}
            </button>
          </div>
        </div>
      )}

      {/* TELA 3: RESULTADOS */}
      {view === 'results' && result && (
        <div className="py-12 px-4 max-w-4xl mx-auto">
          <div className="bg-stone-900 rounded-[2.5rem] overflow-hidden shadow-2xl mb-8 relative">
            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000" className="w-full aspect-video object-cover opacity-40" alt="Plano" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <ImageIcon className="w-12 h-12 text-green-500 mb-4 animate-pulse" />
              <h3 className="text-white text-2xl font-bold">Design do Sistema Gerado</h3>
              <p className="text-stone-300 italic text-sm mt-2">"{result.emergente.name} + {result.alto.name} + {result.medio.name} + {result.baixo.name}"</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {[
              { label: 'Emergente', name: result.emergente.name, icon: <TreeDeciduous/> },
              { label: 'Alto', name: result.alto.name, icon: <TreeDeciduous/> },
              { label: 'Médio', name: result.medio.name, icon: <Leaf/> },
              { label: 'Baixo', name: result.baixo.name, icon: <Carrot/> }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-stone-100 flex items-center shadow-sm">
                <div className="mr-4 text-green-600 bg-green-50 p-3 rounded-xl">{item.icon}</div>
                <div>
                  <p className="text-[10px] uppercase font-black text-stone-400 tracking-widest">{item.label}</p>
                  <p className="font-bold text-xl text-stone-800">{item.name}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-700 rounded-[2.5rem] p-10 text-center text-white shadow-xl">
            <Lock className="mx-auto mb-4 w-12 h-12" />
            <h3 className="text-2xl font-bold mb-6">Guia Completo de Implementação</h3>
            <button onClick={() => window.open('https://pay.hotmart.com/V98127357T?off=m0f73v7g', '_blank')} className="px-10 py-4 bg-white text-green-700 rounded-xl font-bold hover:bg-stone-100 transition-all uppercase tracking-widest">
              Acessar Guia Agora
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
