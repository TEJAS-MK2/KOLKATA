(() => {
  'use strict';
  const SUPABASE_URL = 'https://zbtvhoutdmlszsngihpn.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_pgxvM76yy7dQORnBBq5TUQ_fiyz_OQz';
  const SUPABASE_AUTH = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpidHZob3V0ZG1sc3pzbmdpaHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4Mzc4NTEsImV4cCI6MjEwMjQxMzg1MX0.3MmxUVTQk-4gtn7zTjowCBSiHXvjs3P1SP8XczWwWHk';
  const SESSION_KEY = 'kolkata-puja-supabase-session-v1';
  const TABLE = 'kolkata_puja_user_state';
  const stateKey = () => localStorage.getItem(SESSION_KEY) || (() => { const id = crypto.randomUUID(); localStorage.setItem(SESSION_KEY, id); return id; })();
  const sessionId = stateKey();
  const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_AUTH}`, 'Content-Type': 'application/json', 'x-kolkata-session': sessionId };
  const request = async (url, options = {}) => { const response = await fetch(url, { ...options, headers: { ...headers, ...(options.headers || {}) } }); if (!response.ok) throw new Error(`Supabase ${response.status}`); return response.status === 204 ? null : response.json(); };
  const load = async () => {
    try {
      const rows = await request(`${SUPABASE_URL}/rest/v1/${TABLE}?session_id=eq.${encodeURIComponent(sessionId)}&select=state&limit=1`);
      const remote = rows?.[0]?.state;
      if (remote && window.KolkataState) window.KolkataState.update(remote);
      else if (window.KolkataState) await save(window.KolkataState.get());
    } catch (error) { console.warn('[Kolkata] Cloud state unavailable; local state remains active.', error); }
  };
  const save = async state => {
    try { await request(`${SUPABASE_URL}/rest/v1/${TABLE}`, { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify({ session_id: sessionId, state, updated_at: new Date().toISOString() }) }); }
    catch (error) { console.warn('[Kolkata] Cloud save failed; local state remains active.', error); }
  };
  let timer;
  const queueSave = state => { clearTimeout(timer); timer = setTimeout(() => save(state), 500); };
  const start = () => { if (!window.KolkataState) return; window.addEventListener('kolkata:state', event => queueSave(event.detail || window.KolkataState.get())); load(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();
