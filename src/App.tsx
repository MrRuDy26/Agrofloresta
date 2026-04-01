import React, { useState } from 'react';
import { 
  Leaf, Sprout, Loader2, TreeDeciduous, Carrot, Lock, Info,
  CheckCircle2, Image as ImageIcon, LogOut, LogIn
} from 'lucide-react';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './services/supabase';

const PLANTS_DATA = {
  EMERGENTE: ['Eucalipto', 'Mogno Africano', 'Ipê Amarelo', 'Cedro Rosa'],
  ALTO: ['Bananeira Prata', 'Abacateiro', 'Mangueira', 'Jatobá'],
  MEDIO: ['Café', 'Cacau', 'Limão Taiti', 'Mandioca'],
  BAIXO: ['Feijão de Porco', 'Abacaxi', 'Batata Docce', 'Feijão Guandu']
};

function AppContent() {
  const [step, setStep] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [area, setArea] = useState('');
  const [result, setResult] = useState<any>(null);
  
  const { user, signOut, loading: authLoading } = useAuth();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

  const gerarPlano = () => {
    setLoading(true);
    setTimeout(() => {
      const sortear = (lista: string[]) => lista[Math.floor(Math.random() * lista.length)];
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="animate-spin text-green-600 w-10 h-10" />
      </div>
    );
  }

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
              <button onClick={() => signOut()} className="text-stone-500 hover:text-red-600 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button onClick={handleGoogleLogin} className="text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2 rounded-xl flex items-center gap-2 transition-all border border-stone-200 shadow-sm">
              <LogIn className="w-4 h-4" /> ENTRAR
            </button>
          )}
          
          <button onClick={() => setStep('premium')} className="text-[10px] font-black bg-amber-100 text-amber-700 px-3 py-1 rounded-full border border-amber-200">
              🔒 ÁREA PREMIUM
          </button>
        </div>
      </nav>

      {step === 'hero' && (
        <div className="relative bg-stone-900 text-white py-32 px-4 text-center">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="text-5xl font-black mb-6 uppercase leading-tight">Sua Floresta Inteligente</h1>
            <p className="text-xl mb-10 text-stone-200">Planejamento sintrópico com inteligência de dados.</p>
            <button onClick={() => setStep('form')} className="px-10 py-5 bg-green-600 rounded-full font-bold text-xl shadow-2xl hover:bg-green-500 transition-all">
              COMEÇAR PLANEJAMENTO
            </button>
          </div>
        </div>
      )}

      {step === 'form' && (
        <div className="py-12 px-4 max-w-3xl mx-auto">
          <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-stone-100 text-center">
            <h2 className="text-2xl font-black mb-8 uppercase text-stone-800 tracking-tight">Configurações</h2>
            <div className="mb-8 text-left">
              <label className="block text-[10px] font-black text-stone-400 mb-2 uppercase tracking-widest">Área Total (m²)</label>
              <input type="number" className="w-full p-4 bg-stone-50 border rounded-2xl outline-none focus:border-green-500 text-lg font-bold" placeholder="Ex: 1000" value={area} onChange={(e) => setArea(e.target.value)} />
            </div>
            <button onClick={gerarPlano} disabled={loading || !area} className="w-full py-5 bg-green-700 text-white font-black rounded-2xl shadow-xl text-lg hover:bg-green-600 transition-all disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin mx-auto" /> : 'GERAR MEU PLANO'}
            </button>
          </div>
        </div>
      )}

      {step === 'results' && result && (
        <div className="py-12 px-4 max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-black uppercase tracking-tighter mb-8">Design Gerado</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
            {[
              { label: 'Emergente', name: result.emergente, icon: <TreeDeciduous/> },
              { label: 'Alto', name: result.alto, icon: <TreeDeciduous/> },
              { label: 'Médio', name: result.medio, icon: <Sprout/> },
              { label: 'Baixo', name: result.baixo, icon: <Carrot/> }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-stone-100 flex items-center shadow-sm">
                <div className="mr-4 text-green-700 bg-stone-50 p-4 rounded-2xl">{item.icon}</div>
                <div>
                  <p className="text-[10px] uppercase font-black text-stone-300 tracking-widest">{item.label}</p>
                  <p className="font-black text-xl text-stone-800">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setStep('form')} className="text-green-700 font-bold underline">Criar outro plano</button>
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
