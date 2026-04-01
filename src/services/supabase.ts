import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificação de segurança para o build não falhar se as chaves sumirem
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Atenção: Chaves do Supabase não encontradas no arquivo .env');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
