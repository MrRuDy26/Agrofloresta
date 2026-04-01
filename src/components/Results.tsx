import { Lock, Image as ImageIcon, CheckCircle2, Sprout, TreePine, Leaf, ArrowRight } from 'lucide-react';
import { PlanResult } from '../types';

export function Results({ plan }: { plan: PlanResult }) {
  if (!plan) return null;

  // Função simples para dar uma cor diferente para cada estrato da floresta
  const getStratumColor = (stratum: string) => {
    const s = stratum.toLowerCase();
    if (s.includes('emergente')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (s.includes('alto')) return 'bg-green-100 text-green-800 border-green-200';
    if (s.includes('médio') || s.includes('medio')) return 'bg-lime-100 text-lime-800 border-lime-200';
    return 'bg-amber-100 text-amber-800 border-amber-200'; // Baixo
  };

  return (
    <div className="max-w-4xl mx-auto mt-16 px-4 sm:px-6 pb-24 animate-fade-in-up">
      
      {/* Cabeçalho de Sucesso */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-4">
          <Sprout className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Seu Consórcio <span className="text-emerald-600 border-b-4 border-emerald-200">Sintrópico</span>
        </h2>
        <p className="text-gray-500 text-lg">A IA analisou sua região e gerou a combinação perfeita.</p>
      </div>

      {/* O Gancho (Sales Hook) - Destacado como um "Aviso do Especialista" */}
      <div className="bg-gradient-to-r from-emerald-900 to-green-900 rounded-2xl p-1 mb-12 shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-300">
        <div className="bg-white rounded-xl p-6 sm:p-8 h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-amber-600 text-xl">💡</span>
            </div>
            <h3 className="font-bold text-gray-800 text-xl">Por que este sistema funciona?</h3>
          </div>
          <p className="text-lg text-gray-700 font-medium italic leading-relaxed border-l-4 border-emerald-400 pl-4">
            "{plan.sales_hook}"
          </p>
        </div>
      </div>

      {/* A Lista de Plantas (O que entregar de graça) */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TreePine className="text-emerald-600" />
            Estrutura de Plantio Recomendada
          </h3>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Visão Geral
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {plan.consortium.map((layer, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h4 className={`font-bold text-sm mb-4 uppercase tracking-wider px-3 py-1 rounded-md inline-block border ${getStratumColor(layer.stratum)}`}>
                Estrato {layer.stratum}
              </h4>
              <ul className="space-y-3">
                {layer.plants.map((plant, pIdx) => (
                  <li key={pIdx} className="flex items-start text-gray-700 font-medium">
                    <Leaf className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span>{plant}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* The Visualization Prompt (Escondido/Técnico - mantive a sua estrutura que é ótima) */}
      <div className="hidden md:block bg-gray-900 text-white p-6 rounded-2xl mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <ImageIcon className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center mb-3 text-emerald-400">
            <ImageIcon className="w-5 h-5 mr-2" />
            <span className="font-semibold text-sm uppercase tracking-wider">Metadados de Geração Visual</span>
          </div>
          <p className="text-gray-400 text-xs mb-3">
            Prompt para Midjourney/DALL-E gerar o croqui deste canteiro.
          </p>
          <div className="bg-black/50 p-4 rounded-lg font-mono text-xs text-gray-500 border border-gray-800 select-all">
            {plan.image_prompt}
          </div>
        </div>
      </div>

      {/* O PAYWALL (A área de venda) */}
      <div className="bg-gradient-to-b from-white to-gray-50 border-2 border-emerald-100 p-8 sm:p-12 rounded-3xl shadow-2xl text-center relative overflow-hidden">
        
        {/* Efeito de brilho no topo */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-green-400"></div>
        
        <div className="inline-flex items-center justify-center p-4 bg-red-50 text-red-600 rounded-full mb-6">
          <Lock className="w-8 h-8" />
        </div>
        
        <h3 className="text-3xl font-extrabold text-gray-900 mb-4">
          O Segredo está no <span className="text-emerald-600">Tempo e Espaço</span>
        </h3>
        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
          Saber QUAIS plantas usar é apenas 20% do trabalho. Para o sistema não morrer e gerar lucro, você precisa dominar o manejo. <strong className="text-gray-800">Este material está bloqueado:</strong>
        </p>

        {/* Lista de segredos embaçados */}
        <div className="space-y-4 max-w-lg mx-auto mb-10">
          {plan.technical_secrets.map((secret, idx) => (
            <div key={idx} className="relative bg-white border border-gray-200 p-5 rounded-xl flex items-center justify-between overflow-hidden group">
              <div className="flex items-center w-full">
                <CheckCircle2 className="w-5 h-5 text-gray-300 mr-3" />
                <span className="font-bold text-gray-800 blur-[5px] select-none transition-all group-hover:blur-[6px] w-full text-left">
                  {secret}
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
                <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Lock className="w-3 h-3" /> Exclusivo PRO
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Botão de Compra (Checkout) */}
        <a 
          href="https://pay.kiwify.com.br/SEU_LINK_AQUI" // Coloque seu link de checkout aqui depois
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xl py-5 px-10 rounded-2xl shadow-[0_10px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_30px_rgba(16,185,129,0.4)] transition-all transform hover:-translate-y-1 group"
        >
          DESBLOQUEAR O GUIA COMPLETO 
          <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </a>
        
        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-sm text-gray-500 font-medium">Pagamento 100% seguro via Hotmart/Kiwify. Acesso imediato.</p>
        </div>
      </div>

    </div>
  );
}
