import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vrmxccuklpnysvtnmfja.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZybXhjY3VrbHBueXN2dG5tZmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NzIwMTQsImV4cCI6MjA2MzI0ODAxNH0.e2J2o2o0Cv0-gJpTzt27pXThEg0jMSZWKOfdrCGpe2k';

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'undefined' || supabaseAnonKey === 'undefined') {
  console.error('❌ Error: Supabase configuration is missing or invalid');
  console.error('VITE_SUPABASE_URL:', supabaseUrl);
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '[SET]' : '[MISSING]');
  throw new Error('Supabase configuration is missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
