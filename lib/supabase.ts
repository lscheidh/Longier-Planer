import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Erweiterte Debug-Ausgabe
console.log('🔍 Debug Info:');
console.log('  Raw VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('  Raw VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Vorhanden' : 'FEHLT');
console.log('  Supabase URL:', supabaseUrl || '❌ FEHLT');
console.log('  Supabase Key:', supabaseAnonKey ? '✅ Geladen' : '❌ FEHLT');

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);