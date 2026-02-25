import { Leaf } from 'lucide-react';

export function Hero() {
  return (
    <div className="bg-emerald-900 text-white py-20 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <Leaf className="w-16 h-16 mx-auto mb-6 text-emerald-400" />
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          Planejamento Inteligente de Agrofloresta
        </h1>
        <p className="text-xl text-emerald-100 mb-8">
          Descubra o consórcio ideal para sua terra e maximize seus lucros com sustentabilidade.
        </p>
      </div>
    </div>
  );
}
