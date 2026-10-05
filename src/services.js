import { config } from './config.js';
import { demoData, validateDashboard } from './data.js';
// Tokens só em memória: recarregar a página exige novo login.
let session = null;
export const isDemo = config.mode === 'demo';
export function hasSession() { return !!session && session.expiresAt > Date.now(); }
async function request(path, options = {}) {
  const response = await fetch(`${config.supabaseUrl}${path}`, {
    ...options, signal: AbortSignal.timeout(15000),
    headers: { apikey: config.publishableKey, 'Content-Type':'application/json', ...(session ? {Authorization:`Bearer ${session.access_token}`} : {}), ...options.headers }
  });
  if (!response.ok) {
    if(response.status===401) session=null;
    throw new Error(response.status===401 || response.status===400 ? 'Não foi possível autenticar ou consultar os dados. Verifique suas credenciais e a configuração.' : 'Não foi possível acessar seus dados. Tente novamente.');
  }
  return response.status === 204 ? null : response.json();
}
export async function signIn(email, password) {
  const result = await request('/auth/v1/token?grant_type=password', {method:'POST',body:JSON.stringify({email,password})});
  session = {...result, expiresAt:Date.now()+result.expires_in*1000};
}
export async function signOut() {
  try { if(session) await request('/auth/v1/logout',{method:'POST'}); } finally { session=null; }
}
export async function loadDashboard(month) {
  if(isDemo) return demoData(month);
  if(!hasSession()) throw new Error('Entre novamente para acessar seus dados.');
  // Contrato isolado: adaptar aqui as views existentes quando seus schemas forem disponibilizados.
  const rows = await request(`/rest/v1/dashboard_snapshots?select=payload&month=eq.${encodeURIComponent(month)}-01`);
  if(rows.length===0) return null;
  if(rows.length!==1) throw new Error('Mais de um resumo recebido. Verifique as políticas de acesso.');
  const data = validateDashboard(rows[0].payload);
  if(data.month!==month) throw new Error('O período recebido não corresponde ao filtro.');
  return data;
}
