import React, { useState } from 'react';
import { 
  Leaf, Sprout, Loader2, TreeDeciduous, Carrot, LogOut, LogIn
} from 'lucide-react';

// IMPORTANTE: Verifique se sua pasta se chama 'contexts' ou 'Contexts'
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './services/supabase';

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
      setResult({
        emergente: 'Eucalipto',
        alto: 'Bananeira',
        medio: 'Café',
        baixo: 'Feijão'
      });
      setLoading(false);
      setStep('results');
    }, 1500);
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <Loader2 className="animate-spin text-green-600 w-10 h-10" />
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      <nav className="bg-white border-b p-4 flex justify-between items-center px-6">
        <div className="flex items-center font-bold text-xl text-green-800 cursor-pointer" onClick={() => setStep('hero')}>
          <Leaf className="mr-2 text-green-600" /> SINTROPLAN
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
               <span className="text-xs font-bold text-stone-500">{user.email?.split('@')[0]}</span>
              <button onClick={() => signOut()} className="text-stone-400 hover:text-red-600">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button onClick={handleGoogleLogin} className="bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold">
              ENTRAR
            </button>
          )}
        </div>
      </nav>

      <main className="py-20 px-4 text-center">
        {step === 'hero' && (
          <button onClick={() => setStep('form')} className="bg-green-600 text-white px-8 py-4 rounded-full font-bold">
            COMEÇAR
          </button>
        )}

        {step === 'form' && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-sm border">
            <input type="number" className="w-full p-4 bg-stone-50 border rounded-xl mb-4" placeholder="Área m²" value={area} onChange={(e) => setArea(e.target.value)} />
            <button onClick={gerarPlano} className="w-full bg-green-700 text-white py-4 rounded-xl font-bold">
              {loading ? <Loader2 className="animate-spin mx-auto" /> : 'GERAR PLANO'}
            </button>
          </div>
        )}

        {step === 'results' && result && (
          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border">
              <p className="text-xs uppercase font-bold text-stone-400">Emergente</p>
              <p className="text-xl font-bold">{result.emergente}</p>
            </div>
            <button onClick={() => setStep('form')} className="col-span-2 text-green-700 underline">Novo Plano</button>
          </div>
        )}
      </main>
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
