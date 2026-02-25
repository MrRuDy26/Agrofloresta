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
    focus: 'Fruticultura',
    areaSize: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl -mt-10 relative z-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Configure seu Projeto</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bioma</label>
          <select 
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Região</label>
          <input 
            type="text"
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
            value={formData.region}
            onChange={e => setFormData({...formData, region: e.target.value})}
            placeholder="Ex: Sul de Minas"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Foco Principal</label>
          <select 
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
            value={formData.focus}
            onChange={e => setFormData({...formData, focus: e.target.value})}
          >
            <option>Fruticultura</option>
            <option>Madeira</option>
            <option>Hortaliças</option>
            <option>Recuperação de Solo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho da Área</label>
          <input 
            type="text"
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
            value={formData.areaSize}
            onChange={e => setFormData({...formData, areaSize: e.target.value})}
            placeholder="Ex: 2 hectares"
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-lg transition-colors mt-6 disabled:opacity-70"
        >
          {isLoading ? 'Gerando Plano...' : 'Gerar Consórcio Ideal'}
        </button>
      </div>
    </form>
  );
}
