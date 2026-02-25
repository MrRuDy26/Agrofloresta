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

// --- 1. DEFINIÇÃO DOS TIPOS (Para não depender de types.ts) ---
export interface Plant {
  id: string;
  name: string;
  stratum: 'EMERGENTE' | 'ALTO' | 'MEDIO' | 'BAIXO';
  function: 'Madeira' | 'Fruta' | 'Horta' | 'Biomassa' | 'Adubação Verde';
  suitableRegions: string[];
  lifecycle: 'PLACENTA_1' | 'PLACENTA_2' | 'SECUNDARIA' | 'CLIMAX' | 'PERENE';
  price?: number;
}

export interface Consortium {
  emergente: Plant;
  alto: Plant;
  medio: Plant;
  baixo: Plant;
  horta: Plant[];
}

export interface ProjectData {
  projectName: string;
  areaSize: number;
  biome: string;
  region: string;
  focus: string[];
  selectedSpeciesIds: string[];
}

// --- 2. BANCO DE DADOS EMBUTIDO (Para não depender de constants.ts) ---
const PLANTS_DB: Plant[] = [
  // EMERGENTES
  { id: '1', name: 'Guanandi', stratum: 'EMERGENTE', function: 'Madeira', suitableRegions: ['SUL', 'SUDESTE', 'NORDESTE'], lifecycle: 'CLIMAX' },
  { id: '2', name: 'Mogno Africano', stratum: 'EMERGENTE', function: 'Madeira', suitableRegions: ['CENTRO-OESTE', 'NORTE', 'SUDESTE', 'NORDESTE'], lifecycle: 'CLIMAX' },
  { id: '3', name: 'Eucalipto', stratum: 'EMERGENTE', function: 'Biomassa', suitableRegions: ['SUL', 'SUDESTE', 'CENTRO-OESTE', 'NORDESTE'], lifecycle: 'SECUNDARIA' },
  { id: '4', name: 'Castanheira', stratum: 'EMERGENTE', function: 'Fruta', suitableRegions: ['NORTE', 'CENTRO-OESTE'], lifecycle: 'CLIMAX' },
  
  // ALTO
  { id: '5', name: 'Bananeira Prata', stratum: 'ALTO', function: 'Fruta', suitableRegions: ['SUL', 'SUDESTE', 'NORDESTE', 'CENTRO-OESTE', 'NORTE'], lifecycle: 'PLACENTA_2' },
  { id: '6', name: 'Juçara', stratum: 'ALTO', function: 'Fruta', suitableRegions: ['SUL', 'SUDESTE'], lifecycle: 'CLIMAX' },
  { id: '7', name: 'Abacateiro', stratum: 'ALTO', function: 'Fruta', suitableRegions: ['SUDESTE', 'SUL', 'CENTRO-OESTE'], lifecycle: 'CLIMAX' },
  
  // MÉDIO
  { id: '8', name: 'Café Arábica', stratum: 'MEDIO', function: 'Fruta', suitableRegions: ['SUDESTE', 'SUL', 'NORDESTE'], lifecycle: 'PERENE' },
  { id: '9', name: 'Cacau', stratum: 'MEDIO', function: 'Fruta', suitableRegions: ['NORTE', 'NORDESTE'], lifecycle: 'PERENE' },
  { id: '10', name: 'Limão Taiti', stratum: 'MEDIO', function: 'Fruta', suitableRegions: ['SUDESTE', 'NORDESTE', 'CENTRO-OESTE'], lifecycle: 'PERENE' },
  { id: '11', name: 'Mandioca', stratum: 'MEDIO', function: 'Horta', suitableRegions: ['NORTE', 'NORDESTE', 'CENTRO-OESTE', 'SUDESTE', 'SUL'], lifecycle: 'PLACENTA_2' },

  // BAIXO
  { id: '12', name: 'Abacaxi', stratum: 'BAIXO', function: 'Fruta', suitableRegions: ['NORTE', 'NORDESTE', 'SUDESTE'], lifecycle: 'PLACENTA_2' },
  { id: '13', name: 'Batata Doce', stratum: 'BAIXO', function: 'Horta', suitableRegions: ['SUL', 'SUDESTE', 'NORDESTE', 'CENTRO-OESTE'], lifecycle: 'PLACENTA_1' },
  { id: '14', name: 'Gengibre', stratum: 'BAIXO', function: 'Horta', suitableRegions: ['SUDESTE', 'SUL'], lifecycle: 'PLACENTA_2' },
  { id: '15', name: 'Abóbora', stratum: 'BAIXO', function: 'Horta', suitableRegions: ['SUL', 'SUDESTE', 'CENTRO-OESTE', 'NORDESTE', 'NORTE'], lifecycle: 'PLACENTA_1' }
];

// --- 3. COMPONENTE INPUT FORM ---
interface InputFormProps {
  data: ProjectData;
  onChange: (data: ProjectData) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ data, onChange, onSubmit, isLoading = false }) => {
  const handleChange = (field: keyof ProjectData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const toggleFocus = (focusItem: string) => {
    const currentFocus = data.focus || [];
    const newFocus = currentFocus.includes(focusItem)
      ? currentFocus.filter(f => f !== focusItem)
      : [...currentFocus, focusItem];
    handleChange('focus', newFocus);
  };

  const focusOptions = [
    { id: 'Madeira', label: 'Madeira', icon: '🪵' },
    { id: 'Fruta', label: 'Fruta', icon: '🍎' },
    { id: 'Horta', label: 'Horta', icon: '🥬' },
    { id: 'Biomassa', label: 'Biomassa', icon: '🌿' },
  ];

  return (
    <section id="planner-form" className="py-16 px-4 sm:px-8 bg-stone-50">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-green-800 text-sm font-semibold mb-4">
            Passo 1: Diagnóstico da Área
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-4">
            Configuração do Sistema
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Defina os parâmetros para o algoritmo selecionar as espécies ideais.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 space-y-8 border border-stone-100">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">
              Nome do Projeto
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Sprout className="h-5 w-5 text-stone-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border-2 border-stone-200 rounded-xl leading-5 bg-white placeholder-stone-400 focus:outline-none focus:border-green-500 focus:ring-green-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Ex: Sítio Vale do Sol"
                value={data.projectName}
                onChange={(e) => handleChange('projectName', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">
                Área (m²)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Ruler className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="number"
                  className="block w-full pl-10 pr-3 py-3 border-2 border-stone-200 rounded-xl leading-5 bg-white placeholder-stone-400 focus:outline-none focus:border-green-500 focus:ring-green-500 sm:text-sm transition duration-150 ease-in-out"
                  placeholder="Ex: 5000"
                  value={data.areaSize || ''}
                  onChange={(e) => handleChange('areaSize', Number(e.target.value))}
                />
              </div>
              <p className="mt-1 text-xs text-stone-500">Tamanho total em m².</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">
                Região
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-stone-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-10 py-3 border-2 border-stone-200 rounded-xl leading-5 bg-white focus:outline-none focus:border-green-500 focus:ring-green-500 sm:text-sm appearance-none transition duration-150 ease-in-out text-stone-700"
                  value={data.region}
                  onChange={(e) => handleChange('region', e.target.value)}
                >
                  <option value="SUL">SUL</option>
                  <option value="SUDESTE">SUDESTE</option>
                  <option value="CENTRO-OESTE">CENTRO-OESTE</option>
                  <option value="NORDESTE">NORDESTE</option>
                  <option value="NORTE">NORTE</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">
                Bioma
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mountain className="h-5 w-5 text-stone-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-10 py-3 border-2 border-stone-200 rounded-xl leading-5 bg-white focus:outline-none focus:border-green-500 focus:ring-green-500 sm:text-sm appearance-none transition duration-150 ease-in-out text-stone-700"
                  value={data.biome}
                  onChange={(e) => handleChange('biome', e.target.value)}
                >
                   <option value="Mata Atlântica">Mata Atlântica</option>
                   <option value="Cerrado">Cerrado</option>
                   <option value="Amazônia">Amazônia</option>
                   <option value="Caatinga">Caatinga</option>
                   <option value="Pampa">Pampa</option>
                   <option value="Pantanal">Pantanal</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-4">
              Foco Principal (Selecione)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {focusOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => toggleFocus(option.id)}
                  className={`py-4 px-2 rounded-xl border-2 text-center transition-all duration-200 ease-in-out flex flex-col items-center justify-center gap-2 ${
                    data.focus.includes(option.id)
                      ? 'border-green-600 bg-green-50 text-green-800 shadow-md transform scale-105'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="font-bold text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={onSubmit}
              disabled={isLoading || data.focus.length === 0}
              className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-br from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 focus:outline-none transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
                (isLoading
