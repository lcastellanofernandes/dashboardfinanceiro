export function publicConfig(env) {
  const mode = env.PUBLIC_DATA_MODE || 'demo';
  if(!['demo','supabase'].includes(mode)) throw new Error('PUBLIC_DATA_MODE precisa ser demo ou supabase.');
  const supabaseUrl = (env.PUBLIC_SUPABASE_URL || '').replace(/\/$/,'');
  const publishableKey = env.PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
  if (publishableKey && !/^sb_publishable_[A-Za-z0-9_-]+$/.test(publishableKey)) throw new Error('Use somente a chave sb_publishable_. Chaves privadas e JWT legados não são aceitos.');
  if(mode==='supabase') {
    if(!supabaseUrl || !publishableKey) throw new Error('Informe URL e chave pública para ativar Supabase.');
    const url = new URL(supabaseUrl);
    if(url.protocol!=='https:' || url.username || url.password || url.pathname!=='/' || url.search || url.hash) throw new Error('PUBLIC_SUPABASE_URL precisa ser uma origem HTTPS válida.');
  }
  return { mode, supabaseUrl, publishableKey };
}
