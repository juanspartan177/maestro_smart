import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zjavbipyhftmystsuoso.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_5uSztv0TofPPojqBLCL2uQ_EGl9A...';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);