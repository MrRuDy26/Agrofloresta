import React, { useState } from 'react';
import { 
  Leaf, Sprout, Loader2, TreeDeciduous, Carrot, LogOut, LogIn
} from 'lucide-react';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './services/supabase';

const PLANTS_DATA = {
  EMERGENTE: ['Eucalipto', 'Mogno Africano', 'Ipê Amarelo', 'Cedro Rosa'],
  ALTO: ['Bananeira Prata', 'Abacateiro', 'Mangueira', 'Jatobá'],
  MEDIO: ['Café', 'Cacau', 'Limão Taiti', 'Mandioca'],
  BAIXO: ['Feijão de Porco', 'Abacaxi', 'Batata Doce', 'Feijão Guandu']
};

function AppContent() {
  const [step, setStep] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [area, setArea] = useState('');
  const [result, setResult] = useState<any>(null);
  
  const { user, signOut, loading: authLoading } = useAuth();

  const handleGoogleLogin = async () => {
    const redirectUrl = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          // Removido o prompt:consent para login automático
        },
      }
    });
  };

  const gerarPlano = async () => {
    setLoading(true);
    
    // Sorteia as plantas
    const sortear = (lista: string[]) => lista[Math.floor(Math.random() * lista.length)];
    const novoPlano = {
      emergente: sortear(PLANTS_DATA.EMERGENTE),
      alto: sortear(PLANTS_DATA.ALTO),
      medio: sortear(PLANTS_DATA.MEDIO),
      baixo: sortear(PLANTS_DATA.BAIXO)
    };

    // Se o usuário estiver logado, salva no banco de dados
    if (user) {
      try {
        const { error } = await supabase
          .from('projetos')
          .insert([
            { 
              user_id: user.id, 
              area: area,
              emergente: novoPlano.emergente,
              alto: novoPlano.alto,
              medio: novoPlano.medio,
              baixo: novoPlano.baixo
            }
          ]);
        
        if (error) console.error("Erro ao salvar projeto:", error.message);
      } catch (err) {
        console.error("Erro na conexão:", err);
      }
    }

    // Simula um carregamento visual e mostra o resultado
    setTimeout(() => {
      setResult(novoPlano);
      setLoading(false);
      setStep('results');
    }, 1200);
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <Loader2 className="animate-spin text-green-600 w-10 h-10" />
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      <nav className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-50 px-6">
        <div className="flex items-center font-bold text-xl text-green-800 uppercase tracking-tighter cursor-pointer" onClick={() => setStep('hero')}>
          <Leaf className="mr-2 text-green-600" /> SINTROPLAN
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-bold text-stone-500 hidden sm:block uppercase tracking-widest">
                {user.email?.split('@')[0]}
              </span>
              <button onClick={() => signOut()} className="text-stone-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button onClick={handleGoogleLogin} className="text-xs font-bold bg-stone-100 px-4 py-2 rounded-xl flex items-center gap-2 border border-stone-200 hover:bg-stone-200 transition-all">
              <LogIn className="w-4 h-4" /> ENTRAR
            </button>
          )}
        </div>
      </nav>

      {step === 'hero' && (
        <div className="py-32 px-4 text-center bg-stone-900 text-white">
          <h1 className="text-5xl font-black mb-6 uppercase tracking-tighter">Sua Floresta Inteligente</h1>
          <p className="mb-10 text-stone-400 max-w-md mx-auto uppercase text-[10px] tracking-[0.2em] font-bold leading-relaxed">
            Planejamento agroflorestal baseado em sucessão natural e estratificação
          </p>
          <button onClick={() => setStep('form')} className="px-12 py-6 bg-green-600 rounded-full font-black text-xl hover:bg-green-500 transition-all shadow-[0_20px_50px_rgba(22,_163,_74,_0.3)] hover:-translate-y-1">
            COMEÇAR AGORA
          </button>
        </div>
      )}

      {step === 'form' && (
        <div className="py-12 px-4 max-w-3xl mx-auto">
          <div className="bg-white rounded-[3rem] shadow-2xl p-10 border border-stone-100">
            <h2 className="text-2xl font-black text-center mb-10 uppercase text-stone-800 tracking-tight">Configurações do Plantio</h2>
            <div className="mb-10">
              <label className="block text-[10px] font-black text-stone-400 mb-3 uppercase tracking-widest text-left ml-2">Área Estimada (m²)</label>
              <input 
                type="number" 
                className="w-full p-5 bg-stone-50 border-2 border-stone-100 rounded-3xl outline-none focus:border-green-500 focus:bg-white transition-all text-xl font-bold" 
                placeholder="Ex: 1000" 
                value={area} 
                onChange={(e) => setArea(e.target.value)} 
              />
            </div>
            <button 
              onClick={gerarPlano} 
              disabled={loading || !area} 
              className="w-full py-6 bg-green-700 text-white font-black rounded-3xl shadow-xl hover:bg-green-800 disabled:bg-stone-200 disabled:text-stone-400 transition-all uppercase tracking-widest text-sm"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" /> : 'GERAR MEU PLANO SINTRÓPICO'}
            </button>
          </div>
        </div>
      )}

      {step === 'results' && result && (
        <div className="py-12 px-4 max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            Design de Sucessão
          </div>
          <h3 className="text-4xl font-black uppercase mb-12 tracking-tighter text-stone-800">Sistema Recomendado</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 text-left">
            {[
              { label: 'Emergente', plant: result.emergente, icon: <TreeDeciduous />, color: 'bg-emerald-50' },
              { label: 'Alto', plant: result.alto, icon: <TreeDeciduous />, color: 'bg-green-50' },
              { label: 'Médio', plant: result.medio, icon: <Sprout />, color: 'bg-lime-50' },
              { label: 'Baixo', plant: result.baixo, icon: <Carrot />, color: 'bg-amber-50' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2rem] border-2 border-stone-50 shadow-sm hover:shadow-md transition-all flex items-center gap-6">
                <div className={`${item.color} p-4 rounded-2xl text-green-600`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-stone-300 tracking-widest">{item.label}</p>
                  <p className="font-black text-2xl text-stone-800">{item.plant}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-6">
            <button 
              onClick={() => setStep('form')} 
              className="px-8 py-4 bg-stone-900 text-white font-black rounded-2xl hover:bg-stone-800 transition-all uppercase text-xs tracking-widest"
            >
              Novo Plano
            </button>
            {user && (
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-tight">
                ✓ Este plano foi salvo automaticamente na sua conta
              </p>
            )}
          </div>
        </div>
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
