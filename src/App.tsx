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

// --- 1. TUDO QUE ERA EXTERNO AGORA ESTÁ AQUI (TIPOS) ---
export interface Plant {
  id: string;
  name: string;
  stratum: 'EMERGENTE' | 'ALTO' | 'MEDIO' | 'BAIXO';
  function: 'Madeira' | 'Fruta' | 'Horta' | 'Biomassa' | 'Adubação Verde';
  suitableRegions: string[];
  lifecycle: 'PLACENTA_1' | 'PLACENTA_2' | 'SECUNDARIA' | 'CLIMAX' | 'PERENE';
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

// --- 2. BANCO DE DADOS DAS PLANTAS (EMBUTIDO AQUI PARA NÃO DAR ERRO) ---
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
