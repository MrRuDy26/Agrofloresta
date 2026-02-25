import React, { useState } from 'react';
import { 
  Leaf, 
  Sprout, 
  MapPin, 
  Mountain, 
  Ruler, 
  Loader2, 
  TreeDeciduous, 
  Carrot, 
  Lock, 
  Image as ImageIcon 
} from 'lucide-react';

// --- 1. BANCO DE DADOS E TIPOS ---
const PLANTS_DB = [
  { id: '1', name: 'Guanandi', stratum: 'EMERGENTE', suitableRegions: ['SUL', 'SUDESTE', 'NORDESTE'] },
  { id: '2', name: 'Mogno Africano', stratum: 'EMERGENTE', suitableRegions: ['CENTRO-OESTE', 'NORTE', 'SUDESTE', 'NORDESTE'] },
  { id: '3', name: 'Eucalipto', stratum: 'EMERGENTE', suitableRegions: ['SUL', 'SUDESTE', 'CENTRO-OESTE', 'NORDESTE'] },
  { id: '4', name: 'Bananeira Prata', stratum: 'ALTO', suitableRegions: ['SUL', 'SUDESTE', 'NORDESTE', 'NORTE'] },
  { id: '5', name: 'Abacateiro', stratum: 'ALTO', suitableRegions: ['SUDESTE', 'SUL', 'CENTRO-OESTE'] },
  { id: '6', name: 'Café Arábica', stratum: 'MEDIO', suitableRegions: ['SUDESTE', 'SUL', 'NORDESTE'] },
  { id: '7', name: 'Mandioca', stratum: 'MEDIO', suitableRegions: ['NORTE', 'NORDESTE', 'SUDESTE'] },
  { id: '8', name: 'Abacaxi', stratum: 'BAIXO', suitableRegions: ['NORTE', 'NORDESTE', 'SUDESTE'] },
  { id: '9', name: 'Batata Doce', stratum: 'BAIXO', suitableRegions: ['SUL', 'SUDESTE', 'NORDESTE'] }
];

// --- 2. COMPONENTE HERO ---
const Hero: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="relative bg-stone-900 text-white py-24 px-4">
    <div className="absolute inset-0 z-0 opacity-40">
       <img src="https://images.unsplash.com/photo-1598555848386-302380596377?auto=format&fit=crop&w=1200&q=80" alt="Agrofloresta" className="w-full h-full object-cover" />
    </div>
    <div className="relative z-10 max-w-4xl mx-auto text-center">
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 uppercase">
        Sua Agrofloresta <span className="text-green-400">em Segundos</span>
      </h1>
      <p className="text-xl text-stone-300 mb-10 font-medium">Inteligência de dados para agricultura sintrópica.</p>
      <button onClick={onStart} className="px-10 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full text-lg shadow-lg transform hover:scale-105 transition-all">
        Começar Planejamento
      </button>
    </div>
  </div>
);

// --- 3. COMPONENTE FORMULÁRIO ---
const InputForm = ({ data, onChange, onSubmit, isLoading }: any) => {
  const focusOptions = [
    { id: 'Madeira', label: 'Madeira', icon: '🪵' },
    { id: 'Fruta', label: 'Fruta', icon: '🍎' },
    { id: 'Horta', label: 'Horta', icon: '🥬' },
    { id: 'Biomassa', label: 'Biomassa', icon: '🌿' },
  ];

  return (
    <section className="py-12 px-4 bg-stone-50">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-stone-100">
        <h2 className="text-2xl font-bold text-stone-800 mb-8 text-center uppercase tracking-tight">Configuração do Sistema</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Área (m²)</label>
            <div className="relative">
                <Ruler className="absolute left-3 top-3.5 h-4 w-4 text-stone-400" />
                <input type="number" className="w-full pl-10 p-3 border-2 border-stone-100 rounded-xl outline-none focus:border-green-500" value={data.areaSize || ''} onChange={e => onChange({...data, areaSize: Number(e.target.value)})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Região</label>
            <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-stone-400" />
                <select className="w-full pl-10 p-3 border-2 border-stone-100 rounded-xl outline-none focus:border-green-500 appearance-none" value={data.region} onChange={e => onChange({...data, region: e.target.value})}>
                    <option value="SUDESTE">SUDESTE</option>
                    <option value="SUL">SUL</option>
                    <option value="NORTE">NORTE</option>
                    <option value="NORDESTE">NORDESTE</option>
                    <option value="CENTRO-OESTE">CENTRO-OESTE</option>
                </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Bioma</label>
            <div className="relative">
                <Mountain className="absolute left-3 top-3.5 h-4 w-4 text-stone-400" />
                <select className="w-full pl-10 p-3 border-2 border-stone-100 rounded-xl outline-none focus:border-green-500 appearance-none" value={data.biome} onChange={e => onChange({...data, biome: e.target.value})}>
                    <option value="Mata Atlântica">Mata Atlântica</option>
                    <option value="Cerrado">Cerrado</option>
