import React, { useState } from 'react';
import { 
  Leaf, Sprout, MapPin, Mountain, Ruler, Loader2, 
  TreeDeciduous, Carrot, Lock, Image as ImageIcon,
  CheckCircle2, Info, Star, PlayCircle
} from 'lucide-react';

// --- BANCO DE DADOS TÉCNICO ---
const PLANTS_DB = {
  EMERGENTE: [
    { name: 'Eucalipto', type: 'Biomassa', cycle: 'Pioneira' },
    { name: 'Mogno Africano', type: 'Madeira Nobre', cycle: 'Clímax' },
    { name: 'Ipê Amarelo', type: 'Madeira', cycle: 'Secundária' },
    { name: 'Cedro Rosa', type: 'Madeira Nobre', cycle: 'Clímax' }
  ],
  ALTO: [
    { name: 'Bananeira Prata', type: 'Fruta/Biomassa', cycle: 'Placenta II' },
    { name: 'Abacateiro', type: 'Fruta', cycle: 'Clímax' },
    { name: 'Mangueira', type: 'Fruta', cycle: 'Secundária' },
    { name: 'Ingá', type: 'Fixação N', cycle: 'Pioneira' }
  ],
  MEDIO: [
    { name: 'Café Arábica', type: 'Faturamento', cycle: 'Perene' },
    { name: 'Cacau', type: 'Faturamento', cycle: 'Perene' },
    { name: 'Limão Taiti', type: 'Fruta', cycle: 'Secundária' },
    { name: 'Mandioca', type: 'Alimento', cycle: 'Placenta II' }
  ],
  BAIXO: [
    { name: 'Feijão de Porco', type: 'Adubação Verde', cycle: 'Placenta I' },
    { name: 'Abacaxi', type: 'Fruta', cycle: 'Placenta II' },
    { name: 'Batata Doce', type: 'Cobertura', cycle: 'Placenta I' },
    { name: 'Cúrcuma', type: 'Medicinal', cycle: 'Placenta II' }
  ]
};

const SOIL_INDICATORS = [
  { id: '1', name: 'Tiririca / Picão', issue: 'Solo Compactado', fix: 'Use raízes fortes como Guandu.' },
  { id: '2', name: 'Samambaia / Barba de Bode', issue: 'Solo Ácido', fix: 'Necessário Calagem ou Cinzas.' }
];

export default function App() {
  const [step, setStep] = useState('hero'); // hero, form, results, premium
  const [loading, setLoading] = useState(false);
  const [area, setArea] = useState('');
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [result, setResult] = useState(null);

  const sortear = (lista) => lista[Math.floor(Math.random() * lista.length)];

  const gerarPlano = () => {
    setLoading(true);
    setTimeout(() => {
      setResult({
        strata: {
          emergente: sortear(PLANTS_DB.EMERGENTE),
          alto: sortear(PLANTS_DB.ALTO),
          medio: sortear(PLANTS_DB.MEDIO),
          baixo: sortear(PLANTS_DB.BAIXO)
        },
        soilFix: selectedIndicators.map(id => SOIL_INDICATORS.find(i => i.id === id))
      });
      setLoading(false);
      setStep('results');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      {/* HEADER */}
      <nav className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-50 shadow-sm px-6">
        <div className="flex items-center font-bold text-xl text-green-800 uppercase tracking-tighter cursor-pointer" onClick={() => setStep('hero')}>
          <Leaf className="mr-2 text-green-600" /> SINTROPLAN
        </div>
        <button onClick={() => setStep('premium')} className="text-xs font-black bg-amber-100 text-amber-700 px-3 py-1 rounded-full flex items-center">
            <Star className="w-3 h-3 mr-1 fill-amber-700" /> ÁREA PREMIUM
        </button>
      </nav>

      {/* TELA 1: HERO */}
      {step === 'hero' && (
        <div className="relative bg-stone-900 text-white py-32 px-4 text-center">
          <div className="absolute inset-0 opacity-40">
            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200" className="w-full h-full object-cover" alt="Agrofloresta" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-black mb-6 uppercase leading-tight">Sua Agrofloresta Inteligente</h1>
            <p className="text-xl mb-10 text-stone-200">A agricultura que imita a natureza para produzir abundância.</p>
            <button onClick={() => setStep('form')} className="px-12 py-5 bg-green-600 rounded-full font-bold text-xl shadow-2xl hover:bg-green-500 transition-all transform hover:scale-105">
              COMEÇAR PLANEJAMENTO
            </button>
          </div>
        </div>
      )}

      {/* TELA 2: FORMULÁRIO */}
      {step === 'form' && (
        <div className="py-12 px-4 max-w-3xl mx-auto">
          <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-stone-100">
            <h2 className="text-2xl font-black text-center mb-8 uppercase text-stone-800 tracking-tight">Diagnóstico Ambiental</h2>
            
            <div className="mb-8">
              <label className="block text-[10px] font-black text-stone-400 mb-2 uppercase tracking-widest">Área Total (m²)</label>
              <div className="relative">
                <Ruler className="absolute left-3 top-3.5 h-4 w-4 text-stone-300" />
                <input type="number" className="w-full pl-10 p-4 bg-stone-50 border rounded-2xl outline-none focus:border-green-500" value={area} onChange={(e) => setArea(e.target.value)} />
              </div>
            </div>

            <div className="mb-8">
                <label className="block text-[10px] font-black text-stone-400 mb-4 uppercase tracking-widest">Indicadores de Solo (Bioindicação)</label>
                <div className="grid grid-cols-1 gap-2">
                    {SOIL_INDICATORS.map(ind => (
                        <button key={ind.id} onClick={() => setSelectedIndicators(prev => prev.includes(ind.id) ? prev.filter(i => i !== ind.id) : [...prev, ind.id])}
                        className={`p-4 text-left border-2 rounded-2xl transition-all ${selectedIndicators.includes(ind.id) ? 'border-amber-500 bg-amber-50' : 'border-stone-50 bg-stone-50'}`}>
                            <span className="font-bold text-sm">{ind.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-10">
                <label className="block text-[10px] font-black text-stone-400 mb-4 uppercase tracking-widest text-center">Foco do Sistema</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 border-2 rounded-2xl border-stone-100 text-center text-sm">🪵 Madeira</div>
                    <div className="p-4 border-2 rounded-2xl border-green-500 bg-green-50 text-center text-sm font-bold">🍎 Fruta</div>
                    <div className="p-4 border-2 rounded-2xl border-stone-100 text-center text-sm">🥬 Horta</div>
                    <div className="p-4 border-2 rounded-2xl border-stone-100 text-center text-sm">🌿 Biomassa</div>
                </div>
            </div>

            <button onClick={gerarPlano} disabled={loading || !area} className="w-full py-5 bg-green-700 text-white font-black rounded-2xl shadow-xl text-lg hover:bg-green-800 transition-all">
              {loading ? <div className="flex justify-center items-center"><Loader2 className="animate-spin mr-2" /> Analisando Estratos...</div> : 'GERAR MEU PLANO'}
            </button>
          </div>
        </div>
      )}

      {/* TELA 3: RESULTADOS */}
      {step === 'results' && result && (
        <div className="py-12 px-4 max-w-4xl mx-auto">
          <div className="bg-stone-900 rounded-[2.5rem] overflow-hidden shadow-2xl mb-8 relative border-4 border-white">
            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000" className="w-full aspect-video object-cover opacity-40" alt="Plano" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <h3 className="text-white text-3xl font-black uppercase tracking-tighter">Design Sintonizado</h3>
              <p className="text-green-300 italic text-sm mt-2 italic">"Sincronizando Sucessão e Estratos"</p>
            </div>
          </div>

          {result.soilFix.length > 0 && (
              <div className="mb-8 space-y-2">
                  {result.soilFix.map(fix => (
                      <div key={fix.id} className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
                          <p className="text-xs font-black text-amber-900 uppercase">Correção: {fix.issue}</p>
                          <p className="text-sm text-amber-800">{fix.fix}</p>
                      </div>
                  ))}
              </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {Object.entries(result.strata).map(([key, plant]: any, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-stone-100 flex items-center shadow-sm">
                <div className="mr-4 text-green-700 bg-green-50 p-4 rounded-2xl"><TreeDeciduous/></div>
                <div>
                  <p className="text-[10px] uppercase font-black text-stone-300 tracking-widest">{key}</p>
                  <p className="font-black text-xl text-stone-800">{plant.name}</p>
                  <p className="text-[10px] text-green-600 font-bold uppercase">{plant.type} • {plant.cycle}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-700 rounded-[2.5rem] p-12 text-center text-white shadow-2xl">
            <Lock className="mx-auto mb-4 w-12 h-12 text-green-300" />
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter leading-none">Desbloqueie o Próximo Ciclo</h3>
            <p className="mb-10 text-green-100 opacity-80">Acesse o manual de podas, a tabela de 2.500 espécies e o vídeo de implantação.</p>
            <button onClick={() => window.open('https://pay.hotmart.com/V98127357T?off=m0f73v7g', '_blank')} 
            className="px-12 py-5 bg-white text-green-800 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
              Acessar Guia Premium
            </button>
          </div>
        </div>
      )}

      {/* TELA 4: SIMULAÇÃO ÁREA PREMIUM (O QUE ELE GANHA) */}
      {step === 'premium' && (
        <div className="py-12 px-4 max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-stone-800 uppercase tracking-tighter">Área do Membro SintroPlan</h2>
                <p className="text-stone-500">Recursos exclusivos liberados após a compra</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-8 rounded-3xl border-2 border-stone-100 text-center opacity-50 relative group">
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10 rounded-3xl"><Lock className="w-8 h-8 text-stone-400" /></div>
                    <Database className="mx-auto mb-4 w-10 h-10 text-green-600" />
                    <h4 className="font-bold mb-2">Tabela Master</h4>
                    <p className="text-xs text-stone-500">2.500 espécies catalogadas</p>
                </div>
                <div className="bg-white p-8 rounded-3xl border-2 border-stone-100 text-center opacity-50 relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10 rounded-3xl"><Lock className="w-8 h-8 text-stone-400" /></div>
                    <PlayCircle className="mx-auto mb-4 w-10 h-10 text-green-600" />
                    <h4 className="font-bold mb-2">Aulas de Poda</h4>
                    <p className="text-xs text-stone-500">Vídeos passo a passo</p>
                </div>
                <div className="bg-white p-8 rounded-3xl border-2 border-stone-100 text-center opacity-50 relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10 rounded-3xl"><Lock className="w-8 h-8 text-stone-400" /></div>
                    <CheckCircle2 className="mx-auto mb-4 w-10 h-10 text-green-600" />
                    <h4 className="font-bold mb-2">Suporte Solo</h4>
                    <p className="text-xs text-stone-500">Análise técnica direta</p>
                </div>
            </div>

            <div className="text-center">
                <button onClick={() => window.open('https://pay.hotmart.com/V98127357T?off=m0f73v7g', '_blank')} className="px-12 py-5 bg-green-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">
                    DESBLOQUEAR TUDO AGORA
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
