import React, { useState } from 'react';
import { 
  Leaf, Sprout, Loader2, TreeDeciduous, Carrot, LogOut, LogIn, RefreshCw, BookOpen, Layout
} from 'lucide-react';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './services/supabase';

// BIBLIOTECA EXPANDIDA DE PLANTAS
const PLANTS_LIBRARY = [
  { name: 'Eucalipto', stratum: 'EMERGENTE', function: 'Biomassa/Madeira' },
  { name: 'Mogno Africano', stratum: 'EMERGENTE', function: 'Madeira Nobre' },
  { name: 'Ipê Amarelo', stratum: 'EMERGENTE', function: 'Nativa/Madeira' },
  { name: 'Cedro Rosa', stratum: 'EMERGENTE', function: 'Nativa Nobre' },
  { name: 'Pinho Cuiabano', stratum: 'EMERGENTE', function: 'Crescimento Rápido' },
  { name: 'Angico', stratum: 'EMERGENTE', function: 'Fixação de Nitrogênio' },
  { name: 'Bananeira Prata', stratum: 'ALTO', function: 'Fruta/Água' },
  { name: 'Abacateiro', stratum: 'ALTO', function: 'Fruta/Gordura' },
  { name: 'Mangueira', stratum: 'ALTO', function: 'Fruta/Sombra' },
  { name: 'Jatobá', stratum: 'ALTO', function: 'Nativa/Fruta' },
  { name: 'Ingá', stratum: 'ALTO', function: 'Fixação de Nitrogênio' },
  { name: 'Graviola', stratum: 'ALTO', function: 'Fruta Medicinal' },
  { name: 'Café', stratum: 'MEDIO', function: 'Comercial/Sombra' },
  { name: 'Cacau', stratum: 'MEDIO', function: 'Comercial/Sombra' },
  { name: 'Limão Taiti', stratum: 'MEDIO', function: 'Fruta Cítrica' },
  { name: 'Mandioca', stratum: 'MEDIO', function: 'Energia/Acúmulo' },
  { name: 'Guaraná', stratum: 'MEDIO', function: 'Estimulante' },
  { name: 'Pimenta do Reino', stratum: 'MEDIO', function: 'Condimento' },
  { name: 'Abacaxi', stratum: 'BAIXO', function: 'Fruta de Ciclo Curto' },
  { name: 'Feijão de Porco', stratum: 'BAIXO', function: 'Adubação Verde' },
  { name: 'Batata Doce', stratum: 'BAIXO', function: 'Cobertura de Solo' },
  { name: 'Feijão Guandu', stratum: 'BAIXO', function: 'Nitrogênio/Grão' },
  { name: 'Cúrcuma', stratum: 'BAIXO', function: 'Raiz Medicinal' },
  { name: 'Gengibre', stratum: 'BAIXO', function: 'Raiz/Condimento' },
];

function AppContent() {
  const [activeTab, setActiveTab] = useState<'app' | 'library'>('app');
  const [step, setStep] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [area, setArea] = useState('');
  const [result, setResult] = useState<any>(null);
  
  const { user, signOut, loading: authLoading } = useAuth();

  const handleGoogleLogin = async () => {
    const redirectUrl = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectUrl }
    });
  };

  const gerarPlano = async () => {
    setLoading(true);
    setResult(null);

    const filterByStratum = (stratum: string) => 
      PLANTS_LIBRARY.filter(p => p.stratum === stratum).map(p => p.name);

    const sortear = (lista: string[]) => lista[Math.floor(Math.random() * lista.length)];
    
    const novoPlano = {
      emergente: sortear(filterByStratum('EMERGENTE')),
      alto: sortear(filterByStratum('ALTO')),
      medio: sortear(filterByStratum('MEDIO')),
      baixo: sortear(filterByStratum('BAIXO'))
    };

    if (user) {
      try {
        await supabase.from('projetos').insert([
          { user_id: user.id, area, ...novoPlano }
        ]);
      } catch (err) {
        console.error(err);
      }
    }

    setTimeout(() => {
      setResult(novoPlano);
      setLoading(false);
      setStep('results');
    }, 1000);
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <Loader2 className="animate-spin text-green-600 w-10 h-10" />
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-20">
      {/* NAVBAR */}
      <nav className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-50 px-6">
        <div className="flex items-center font-bold text-xl text-green-800 uppercase tracking-tighter cursor-pointer" onClick={() => {setStep('hero'); setActiveTab('app');}}>
          <Leaf className="mr-2 text-green-600" /> SINTROPLAN
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab(activeTab === 'app' ? 'library' : 'app')}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-green-600 transition-colors"
          >
            {activeTab === 'app' ? <><BookOpen className="w-4 h-4" /> Biblioteca</> : <><Layout className="w-4 h-4" /> Gerador</>}
          </button>
          <div className="h-4 w-px bg-stone-200" />
          {user ? (
            <button onClick={() => signOut()} className="text-stone-400 hover:text-red-600 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={handleGoogleLogin} className="text-[10px] font-black bg-stone-100 px-4 py-2 rounded-xl border border-stone-200">
              ENTRAR
            </button>
          )}
        </div>
      </nav>

      {/* CONTEÚDO DA BIBLIOTECA */}
      {activeTab === 'library' ? (
        <div className="max-w-6xl mx-auto p-8 animate-in fade-in duration-500">
          <header className="mb-12 text-center">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Biblioteca de Espécies</h2>
            <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Catálogo de estratificação e funções</p>
          </header>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLANTS_LIBRARY.map((plant, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[2rem] border-2 border-stone-50 shadow-sm hover:border-green-100 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                    plant.stratum === 'EMERGENTE' ? 'bg-emerald-100 text-emerald-700' :
                    plant.stratum === 'ALTO' ? 'bg-green-100 text-green-700' :
                    plant.stratum === 'MEDIO' ? 'bg-lime-100 text-lime-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {plant.stratum}
                  </span>
                  <Sprout className="w-4 h-4 text-stone-200 group-hover:text-green-400 transition-colors" />
                </div>
                <h4 className="text-xl font-black text-stone-800 mb-1">{plant.name}</h4>
                <p className="text-xs text-stone-400 font-medium">{plant.function}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* CONTEÚDO DO GERADOR (O que você já tinha) */
        <main>
          {step === 'hero' && (
            <div className="py-32 px-4 text-center bg-stone-900 text-white">
              <h1 className="text-5xl font-black mb-6 uppercase tracking-tighter">Sua Floresta Inteligente</h1>
              <button onClick={() => setStep('form')} className="px-12 py-6 bg-green-600 rounded-full font-black text-xl hover:bg-green-500 transition-all shadow-xl">
                COMEÇAR AGORA
              </button>
            </div>
          )}

          {step === 'form' && (
            <div className="py-12 px-4 max-w-3xl mx-auto">
              <div className="bg-white rounded-[3rem] shadow-2xl p-10 border border-stone-100 text-center">
                <h2 className="text-2xl font-black mb-10 uppercase text-stone-800">Configurações do Plantio</h2>
                <div className="mb-10">
                  <label className="block text-[10px] font-black text-stone-400 mb-3 uppercase tracking-widest">Área Estimada (m²)</label>
                  <input type="number" className="w-full p-5 bg-stone-50 border-2 border-stone-100 rounded-3xl outline-none focus:border-green-500 text-center text-xl font-bold" placeholder="Ex: 1000" value={area} onChange={(e) => setArea(e.target.value)} />
                </div>
                <button onClick={gerarPlano} disabled={loading || !area} className="w-full py-6 bg-green-700 text-white font-black rounded-3xl shadow-xl hover:bg-green-800 disabled:bg-stone-200 transition-all uppercase tracking-widest text-sm">
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : 'GERAR MEU PLANO SINTRÓPICO'}
                </button>
              </div>
            </div>
          )}

          {step === 'results' && result && (
            <div className="py-12 px-4 max-w-4xl mx-auto text-center">
              <h3 className="text-4xl font-black uppercase mb-12 tracking-tighter text-stone-800">Sistema Recomendado</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 text-left">
                {[
                  { label: 'Emergente', plant: result.emergente, icon: <TreeDeciduous />, color: 'bg-emerald-50' },
                  { label: 'Alto', plant: result.alto, icon: <TreeDeciduous />, color: 'bg-green-50' },
                  { label: 'Médio', plant: result.medio, icon: <Sprout />, color: 'bg-lime-50' },
                  { label: 'Baixo', plant: result.baixo, icon: <Carrot />, color: 'bg-amber-50' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-[2rem] border-2 border-stone-50 shadow-sm flex items-center gap-6">
                    <div className={`${item.color} p-4 rounded-2xl text-green-600`}>{item.icon}</div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-stone-300 tracking-widest">{item.label}</p>
                      <p className="font-black text-2xl text-stone-800">{item.plant}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep('form')} className="flex items-center gap-2 mx-auto px-8 py-4 bg-stone-900 text-white font-black rounded-2xl hover:bg-stone-800 transition-all uppercase text-xs tracking-widest">
                <RefreshCw className="w-4 h-4" /> Novo Plano
              </button>
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
