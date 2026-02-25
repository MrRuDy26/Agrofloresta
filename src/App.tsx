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

// --- BANCO DE DADOS ---
const PLANTS_DATA = {
  EMERGENTE: ['Eucalipto', 'Mogno Africano', 'Ipê Amarelo', 'Cedro Rosa'],
  ALTO: ['Bananeira Prata', 'Abacateiro', 'Mangueira', 'Jatobá'],
  MEDIO: ['Café', 'Cacau', 'Limão Taiti', 'Mandioca'],
  BAIXO: ['Feijão de Porco', 'Abacaxi', 'Batata Doce', 'Feijão Guandu']
};

export default function App() {
  const [step, setStep] = useState('hero'); // hero, form, results
  const [loading, setLoading] = useState(false);
  const [area, setArea] = useState('');
  const [indicators, setIndicators] = useState([]);
  const [result, setResult] = useState(null);

  // Função para avançar do Hero para o Form
  const irParaForm = () => setStep('form');

  // Função para gerar o resultado
  const gerarPlano = () => {
    setLoading(true);
    setTimeout(() => {
      const sortear = (lista) => lista[Math.floor(Math.random() * lista.length)];
      setResult({
        emergente: sortear(PLANTS_DATA.EMERGENTE),
        alto: sortear(PLANTS_DATA.ALTO),
        medio: sortear(PLANTS_DATA.MEDIO),
        baixo: sortear(PLANTS_DATA.BAIXO)
      });
      setLoading(false);
      setStep('results');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      {/* MENU SUPERIOR */}
      <nav className="bg-white border-b p-4 flex justify-center sticky top-0 z-50">
        <div className="flex items-center font-bold text-xl text-green-800 uppercase tracking-tighter">
          <Leaf className="mr-2 text-green-600" /> SINTROPLAN
        </div>
      </nav>

      {/* TELA 1: HERO */}
      {step === 'hero' && (
        <div className="relative bg-stone-900 text-white py-32 px-4 text-center">
          <div className="absolute inset-0 opacity-40">
            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200" className="w-full h-full object-cover" alt="Agrofloresta" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="text-5xl font-black mb-6 uppercase leading-tight">Sua Floresta Inteligente</h1>
            <p className="text-xl mb-10 text-stone-200">Planejamento sintrópico com inteligência de dados.</p>
            <button 
              onClick={irParaForm} 
              className="px-10 py-5 bg-green-600 rounded-full font-bold text-xl shadow-2xl hover:bg-green-500 transition-all"
            >
              COMEÇAR PLANEJAMENTO
            </button>
          </div>
        </div>
      )}

      {/* TELA 2: FORMULÁRIO */}
      {step === 'form' && (
        <div className="py-12 px-4 max-w-3xl mx-auto">
          <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-stone-100 text-center">
            <h2 className="text-2xl font-black mb-8 uppercase text-stone-800 tracking-tight">Configurações</h2>
            
            <div className="mb-8 text-left">
              <label className="block text-[10px] font-black text-stone-400 mb-2 uppercase tracking-widest">Área Total (m²)</label>
              <input 
                type="number" 
                className="w-full p-4 bg-stone-50 border rounded-2xl outline-none focus:border-green-500" 
                placeholder="Ex: 1000" 
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>

            <div className="mb-10">
                <label className="block text-[10px] font-black text-stone-400 mb-4 uppercase tracking-widest text-left">Objetivos do Sistema</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 border-2 rounded-2xl border-stone-100 bg-stone-50 opacity-50">🪵 Madeira</div>
                    <div className="p-4 border-2 rounded-2xl border-green-500 bg-green-50 font-bold">🍎 Fruta</div>
                    <div className="p-4 border-2 rounded-2xl border-stone-100 bg-stone-50 opacity-50">🥬 Horta</div>
                    <div className="p-4 border-2 rounded-2xl border-stone-100 bg-stone-50 opacity-50">🌿 Biomassa</div>
                </div>
            </div>

            <button 
              onClick={gerarPlano} 
              disabled={loading || !area} 
              className="w-full py-5 bg-green-700 text-white font-black rounded-2xl shadow-xl hover:bg-green-800 transition-all text-lg"
            >
              {loading ? <div className="flex justify-center items-center"><Loader2 className="animate-spin mr-2" /> Cruzando Dados...</div> : 'GERAR MEU PLANO'}
            </button>
          </div>
        </div>
      )}

      {/* TELA 3: RESULTADOS */}
      {step === 'results' && result && (
        <div className="py-12 px-4 max-w-4xl mx-auto animate-in fade-in duration-500">
          <div className="bg-stone-900 rounded-[2.5rem] overflow-hidden shadow-2xl mb-8 relative border-4 border-white">
            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000" className="w-full aspect-video object-cover opacity-40" alt="Plano" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <h3 className="text-white text-3xl font-black uppercase tracking-tighter">Design Gerado</h3>
              <p className="text-green-300 italic text-sm mt-2 max-w-md italic">
                "{result.emergente} + {result.alto} + {result.medio} + {result.baixo}"
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {[
              { label: 'Emergente', name: result.emergente, icon: <TreeDeciduous/> },
              { label: 'Alto', name: result.alto, icon: <TreeDeciduous/> },
              { label: 'Médio', name: result.medio, icon: <Sprout/> },
              { label: 'Baixo', name: result.baixo, icon: <Carrot/> }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-stone-100 flex items-center shadow-sm">
                <div className="mr-4 text-green-700 bg-green-50 p-4 rounded-2xl">{item.icon}</div>
                <div>
                  <p className="text-[10px] uppercase font-black text-stone-300 tracking-widest">{item.label}</p>
                  <p className="font-black text-xl text-stone-800">{item.name}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-700 rounded-[2.5rem] p-10 text-center text-white shadow-xl">
            <Lock className="mx-auto mb-4 w-12 h-12 text-green-300" />
            <h3 className="text-2xl font-black mb-4 uppercase">Manual de Implementação</h3>
            <p className="mb-8 text-green-100 opacity-80">Acesse o guia completo com o passo a passo de como plantar cada espécie.</p>
            <button 
              onClick={() => window.open('https://pay.hotmart.com/V98127357T?off=m0f73v7g', '_blank')} 
              className="px-12 py-5 bg-white text-green-800 rounded-2xl font-black hover:bg-stone-100 transition-all uppercase tracking-widest shadow-lg"
            >
              Comprar Guia por R$ 47
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
