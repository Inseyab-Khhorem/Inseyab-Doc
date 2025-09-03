import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Export configuration status for components to use
export const supabaseConfig = {
  hasCredentials: !!(supabaseUrl && supabaseAnonKey),
  url: supabaseUrl,
  keyPresent: !!supabaseAnonKey,
};

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  });
  console.warn('Supabase client will not be functional without proper configuration');
}

// Only create client if we have credentials
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null;

// Test connection on initialization
if (supabase) {
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('Supabase connection error:', error);
    } else {
      console.log('Supabase connected successfully');
    }
  });
} else {
  console.warn('Supabase client not initialized - missing environment variables');
}

export type Database = {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string;
          user_id: string;
          action: 'OCR' | 'DOCGEN';
          created_at: string;
          prompt: string | null;
          ocr_image_path: string | null;
          docx_path: string | null;
          pdf_path: string | null;
          status: 'processing' | 'completed' | 'failed';
          metadata: any;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: 'OCR' | 'DOCGEN';
          created_at?: string;
          prompt?: string | null;
          ocr_image_path?: string | null;
          docx_path?: string | null;
          pdf_path?: string | null;
          status?: 'processing' | 'completed' | 'failed';
          metadata?: any;
        };
        Update: {
          id?: string;
          user_id?: string;
          action?: 'OCR' | 'DOCGEN';
          created_at?: string;
          prompt?: string | null;
          ocr_image_path?: string | null;
          docx_path?: string | null;
          pdf_path?: string | null;
          status?: 'processing' | 'completed' | 'failed';
          metadata?: any;
        };
      };
    };
  };
};