import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vgtfaprvrhkhmnstdclq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZndGZhcHJ2cmhraG1uc3RkY2xxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NDk4NTYsImV4cCI6MjA1OTIyNTg1Nn0.dkAZUD0aSMr7rrC4n17rwwXomH3OyfQX_uRj-XGuDnE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
