import React, { useState } from 'react';
import { 
  Leaf, Sprout, Loader2, TreeDeciduous, Carrot, Lock, Info,
  CheckCircle2, Image as ImageIcon, LogOut, Google, LogIn
} from 'lucide-react';

// Importando a nossa conexão com o Supabase e a memória de Login
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './services/supabase';

// --- BANCO DE DADOS TEMPORÁRIO (Será substituído pela sua API Gemini depois) ---
const PLANTS_DATA = {
  EMERGENTE: ['Eucalipto', 'Mogno Africano', 'Ipê Amarelo', 'Cedro Rosa'],
  ALTO: ['Bananeira Prata', 'Abacateiro', 'Mangueira', 'Jatobá'],
  MEDIO: ['Café', 'Cacau', 'Limão Taiti', 'Mandioca'],
  BAIXO: ['Feijão de Porco', 'Abacaxi', 'Batata Doce', 'Feijão Guandu']
};

function AppContent() {
  const [step, setStep] = useState('hero'); // hero, form, results, premium
  const [loading, setLoading] = useState(false);
  const [area, setArea] = useState('');
  const [result, setResult] = useState(null);
  
  // Puxando dados do usuário logado do nosso contexto
  const { user, signOut, loading: authLoading } = useAuth();

  // Função de Login com Google
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

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

  if (authLoading) return (
    <div className="h-screen w-full flex items-center justify-center bg-stone-50">
      <Loader2 className="animate-spin text-green-600 w-10 h-10" />
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      {/* NAVBAR ATUALIZADA */}
      <nav className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-50 px-6">
        <div className="flex items-center font-bold text-xl text-green-800 uppercase tracking-tighter cursor-pointer" onClick={() => setStep('hero')}>
          <Leaf className="mr-2 text-green-600" /> SINTROPLAN
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-bold text-stone-500 hidden sm:block uppercase tracking-widest">
                Olá, {user.email?.split('@')[0]}
              </span>
              <button 
                onClick={() => signOut()} 
                className="text-stone-500 hover:text-red-600 transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleGoogleLogin}
              className="text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2 rounded-xl flex items-center gap-2 transition-all border border-stone-200 shadow-sm"
            >
              <LogIn className="w-4 h-4" /> ENTRAR
            </button>
          )}
          
          <button onClick={() => setStep('premium')} className="text-[10px] font-black bg-amber-100 text-amber-700 px-3 py-1 rounded-full flex items-center border border-amber-200">
              🔒 ÁREA PREMIUM
          </button>
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
            <button onClick={() => setStep('form')} className="px-10 py-5 bg-green-600 rounded-full font-bold text-xl shadow-2xl hover:bg-green-500 transition-all border-b-4 border-green-800">
              COMEÇAR PLANEJAMENTO
            </button>
          </div>
        </div>
      )}

      {/* TELA 2: FORMULÁRIO */}
      {step === 'form' && (
        <div className="py-12 px-4 max-w-3xl mx-auto">
          <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-stone-100">
            <h2 className="text-2xl font-black text-center mb-8 uppercase text-stone-800 tracking-tight">Configurações</h2>
            <div className="mb-8 text-left">
              <label className="block text-[10px] font-black text-stone-400 mb-2 uppercase tracking-widest">Área Total (m²)</label>
              <input type="number" className="w-full p-4 bg-stone-50 border rounded-2xl outline-none focus:border-green-500 text-lg font-bold" placeholder="Ex: 1000" value={area} onChange={(e) => setArea(e.target.value)} />
            </div>
            
            <button 
              onClick={gerarPlano} 
              disabled={loading || !area} 
              className="w-full py-5 bg-green-700 text-white font-black rounded-2xl shadow-xl text-lg hover:bg-green-600 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <Loader2 className="animate-spin mr-2" /> Cruzando Dados...
                </div>
              ) : 'GERAR MEU PLANO'}
            </button>
            
            {!user && (
              <p className="text-center text-stone-400 text-[10px] mt-4 font-bold uppercase tracking-widest">
                Dica: Faça login para salvar seus projetos
              </p>
            )}
          </div>
        </div>
      )}

      {/* TELA 3: RESULTADOS */}
      {step === 'results' && result && (
        <div className="py-12 px-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-stone-900 rounded-[2.5rem] overflow-hidden shadow-2xl mb-8 relative border-4 border-white">
            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000" className="w-full aspect-video object-cover opacity-40" alt="Plano" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <h3 className="text-white text-3xl font-black uppercase tracking-tighter">Design Gerado</h3>
              <p className="text-green-300 italic text-sm mt-2 italic font-medium">
                "{result.emergente} + {result.alto} + {result.medio} + {result.baixo}"
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
            {[
              { label: 'Emergente', name: result.emergente, icon: <TreeDeciduous/>, color: 'text-emerald-700' },
              { label: 'Alto', name: result.alto, icon: <TreeDeciduous/>, color: 'text-green-700' },
              { label: 'Médio', name: result.medio, icon: <Sprout/>, color: 'text-lime-700' },
              { label: 'Baixo', name: result.baixo, icon: <Carrot/>, color: 'text-amber-700' }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-stone-100 flex items-center shadow-sm hover:shadow-md transition-shadow">
                <div className={`mr-4 ${item.color} bg-stone-50 p-4 rounded-2xl`}>{item.icon}</div>
                <div>
                  <p className="text-[10px] uppercase font-black text-stone-300 tracking-widest">{item.label}</p>
                  <p className="font-black text-xl text-stone-800">{item.name}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ÁREA DE CONVERSÃO / PAYWALL */}
          <div className="bg-green-700 rounded-[2.5rem] p-10 text-center text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform">
               <Sprout className="w-32 h-32" />
            </div>
            <Lock className="mx-auto mb-4 w-12 h-12 text-green-300" />
            <h3 className="text-2xl font-black mb-4 uppercase">Manual de Implementação Bloqueado</h3>
            <p className="text-green-100 mb-8 max-w-md mx-auto">Desbloqueie o cronograma de podas e manejo para garantir que suas plantas não morram por falta de luz.</p>
            <button 
              onClick={() => window.open('https://pay.hotmart.com/V98127357T?off=m0f73v7g', '_blank')} 
              className="px-12 py-5 bg-white text-green-800 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-transform"
            >
              Acessar Guia Premium
            </button>
          </div>
        </div>
      )}

      {/* TELA 4: ÁREA PREMIUM */}
      {step === 'premium' && (
        <div className="py-12 px-4 max-w-4xl mx-auto animate-in zoom-in-95 duration-500">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-stone-800 uppercase tracking-tighter">Área do Membro SintroPlan</h2>
                <p className="text-stone-500 mt-2">Recursos exclusivos para assinantes</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                  { icon: <Info/>, title: 'Tabela Master', desc: '2.500 espécies' },
                  { icon: <ImageIcon/>, title: 'Aulas de Poda', desc: 'Vídeos Passo a Passo' },
                  { icon: <CheckCircle2/>, title: 'Suporte Solo', desc: 'Análise Direta' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-3xl border-2 border-stone-100 text-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center z-10 opacity-100 group-hover:bg-white/70 transition-all">
                        <div className="bg-stone-900 text-white p-2 rounded-full"><Lock className="w-5 h-5" /></div>
                      </div>
                      <div className="text-green-600 flex justify-center mb-4">{item.icon}</div>
                      <h4 className="font-bold mb-2 text-stone-800">{item.title}</h4>
                      <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">{item.desc}</p>
                  </div>
                ))}
            </div>
            <div className="text-center">
                <button onClick={() => window.open('https://pay.hotmart.com/V98127357T?off=m0f73v7g', '_blank')} className="px-12 py-6 bg-green-700 text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:bg-green-600 transition-all border-b-8 border-green-900 active:border-b-0 active:translate-y-2">
                    DESBLOQUEAR TUDO AGORA
                </button>
            </div>
        </div>
      )}
    </div>
  );
}

// O App principal que envolve o conteúdo com a Memória de Login
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
