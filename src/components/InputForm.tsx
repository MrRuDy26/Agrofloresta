import { useState } from 'react';
import { FormData } from '../types';

interface InputFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [formData, setFormData] = useState<FormData>({
    biome: 'Mata Atlântica',
    region: '',
    focus: 'Misto (Horta + Pomar)', // Atualizado para a nossa estratégia
    areaSize: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-2xl border border-emerald-50 -mt-10 relative z-10">
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Crie seu Canteiro</h2>
        <p className="text-gray-500 mt-2 text-sm">Preencha os dados abaixo para a IA desenhar o seu consórcio sintrópico.</p>
      </div>
      
      <div className="space-y-5">
        
        {/* Campo Bioma */}
        <div>
          <label className="block text-sm font-bold text-emerald-900 mb-1">🌿 Qual é o seu Bioma?</label>
          <select 
            className="w-full border-2 border-emerald-100 rounded-xl p-3 focus:ring-0 focus:border-emerald-500 bg-gray-50 text-gray-700 font-medium transition-colors cursor-pointer outline-none"
            value={formData.biome}
            onChange={e => setFormData({...formData, biome: e.target.value})}
          >
            <option>Mata Atlântica</option>
            <option>Cerrado</option>
            <option>Amazônia</option>
            <option>Caatinga</option>
            <option>Pampa</option>
            <option>Pantanal</option>
          </select>
        </div>

        {/* Campo Região */}
        <div>
          <label className="block text-sm font-bold text-emerald-900 mb-1">📍 Região / Cidade</label>
          <input 
            type="text"
            required
            className="w-full border-2 border-emerald-100 rounded-xl p-3 focus:ring-0 focus:border-emerald-500 bg-gray-50 text-gray-700 font-medium transition-colors outline-none"
            value={formData.region}
            onChange={e => setFormData({...formData, region: e.target.value})}
            placeholder="Ex: Curitiba - PR"
          />
        </div>

        {/* Campo Foco (A Estratégia Freemium entra aqui) */}
        <div>
          <label className="block text-sm font-bold text-emerald-900 mb-1">🎯 Objetivo do Plantio</label>
          <select 
            className="w-full border-2 border-emerald-100 rounded-xl p-3 focus:ring-0 focus:border-emerald-500 bg-gray-50 text-gray-700 font-medium transition-colors cursor-pointer outline-none"
            value={formData.focus}
            onChange={e => setFormData({...formData, focus: e.target.value})}
          >
            <option value="Apenas Horta">🍅 Apenas Horta (Ciclo Curto)</option>
            <option value="Apenas Pomar">🍎 Apenas Pomar (Frutíferas)</option>
            <option value="Misto (Horta + Pomar)">🌳 Misto (Horta + Pomar - Sistema Completo)</option>
            <option value="Madeira e Recuperação">🪵 Madeira / Recuperação de Solo</option>
          </select>
        </div>

        {/* Campo Área */}
        <div>
          <label className="block text-sm font-bold text-emerald-900 mb-1">📐 Tamanho da Área</label>
          <input 
            type="text"
            required
            className="w-full border-2 border-emerald-100 rounded-xl p-3 focus:ring-0 focus:border-emerald-500 bg-gray-50 text-gray-700 font-medium transition-colors outline-none"
            value={formData.areaSize}
            onChange={e => setFormData({...formData, areaSize: e.target.value})}
            placeholder="Ex: 50m², 1 hectare, etc."
          />
        </div>

        {/* Botão de Ação */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg py-4 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(5,150,105,0.39)] hover:shadow-[0_6px_20px_rgba(5,150,105,0.23)] mt-8 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando Inteligência...
            </>
          ) : (
            '✨ Gerar Plano Sintrópico'
          )}
        </button>
      </div>
    </form>
  );
}
