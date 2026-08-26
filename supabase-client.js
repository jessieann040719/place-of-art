import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const cfg = window.POA_CONFIG || {};
export const configured = Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey);
export const supabase = configured ? createClient(cfg.supabaseUrl, cfg.supabaseAnonKey) : null;

export function requireConfigured(messageEl){
  if(configured) return true;
  if(messageEl){
    messageEl.innerHTML = '<div class="notice bad"><strong>One-time setup required.</strong><br>Add your Supabase Project URL and public anon/publishable key to <code>config.js</code>. After that, artist login and no-code publishing work from this page.</div>';
  }
  return false;
}
