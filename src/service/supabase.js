import { createClient } from "@supabase/supabase-js";

// Vite exposes env variables prefixed with VITE_ via import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate that the required environment variables are set
// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error(
//     "Supabase URL ya Anon Key missing hai! " +
//       "Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set."
//   );
// }

// Create and export the Supabase client instance
export const supabase = createClient(
  supabaseUrl || 'https://dummy.supabase.co', 
  supabaseAnonKey || 'dummykey'
);
