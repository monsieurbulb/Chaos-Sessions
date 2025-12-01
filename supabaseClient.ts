import { createClient } from '@supabase/supabase-js';

// INSTRUCTIONS:
// 1. Go to https://supabase.com/dashboard/project/_/settings/api
// 2. Copy "Project URL" -> Paste into SUPABASE_URL below
// 3. Copy "anon" "public" key -> Paste into SUPABASE_KEY below

const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co'; // <-- PASTE URL HERE
const SUPABASE_KEY = 'YOUR_ANON_KEY'; // <-- PASTE KEY HERE

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);