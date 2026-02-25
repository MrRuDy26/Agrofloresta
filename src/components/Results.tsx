import { Lock, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { PlanResult } from '../types';

export function Results({ plan }: { plan: PlanResult }) {
  if (!plan) return null;

  return (
    <div className="max-w-4xl mx-auto mt-16 px-6 pb-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Seu Consórcio Ideal: Projeto Agroflorestal
        </h2>
        <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full"></div>
      </div>

      {/* The Hook */}
      <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl mb-10">
        <p className="text-lg text-emerald-900 font-medium italic leading-relaxed">
          "{plan.sales_hook}"
        </p>
      </div>

      {/* The List */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Estrutura do Consórcio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.consortium.map((layer, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-emerald-700 mb-3 uppercase tracking-wider text-sm">
                Estrato {layer.stratum}
              </h4>
              <ul className="space-y-2">
                {layer.plants.map((plant, pIdx) => (
                  <li key={pIdx} className="flex items-center text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                    {plant}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* The Visualization Prompt */}
      <div className="bg-gray-900 text-white p-6 rounded-2xl mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <ImageIcon className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center mb-4 text-emerald-400">
            <ImageIcon className="w-5 h-5 mr-2" />
            <span className="font-semibold text-sm uppercase tracking-wider">Visualização do Projeto</span>
          </div>
          <p className="text-gray-300 text-sm mb-4">
            O Prompt para sua imagem realista foi gerado. (Futura integração com IA de Imagem)
          </p>
          <div className="bg-black/50 p-4 rounded-lg font-mono text-xs text-gray-400 border border-gray-800">
            {plan.image_prompt}
          </div>
        </div>
      </div>

      {/* The Paywall */}
      <div className="bg-gradient-to-b from-white to-gray-50 border border-gray-200 p-8 rounded-3xl shadow-lg text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Guia de Implementação Técnica</h3>
        <p className="text-gray-600 mb-8">Para que este consórcio funcione e traga lucro, você precisa dominar os seguintes segredos:</p>

        <div className="space-y-3 max-w-md mx-auto mb-10">
          {plan.technical_secrets.map((secret, idx) => (
            <div key={idx} className="relative bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between overflow-hidden group">
              <span className="font-medium text-gray-800 blur-[4px] select-none transition-all group-hover:blur-[5px]">
                {secret}
              </span>
              <div className="absolute inset-0 flex items-center justify-center bg-white/40">
                <Lock className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          ))}
        </div>

        <a 
          href="#checkout" 
          className="inline-block w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg py-5 px-10 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all transform hover:-translate-y-1 animate-pulse"
        >
          LIBERAR GUIA COMPLETO E CRONOGRAMA
        </a>
        <p className="text-xs text-gray-500 mt-4">Pagamento 100% seguro. Acesso imediato.</p>
      </div>
    </div>
  );
}
