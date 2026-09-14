(() => {
  'use strict';
  const KEY = 'kolkata-puja-state-v3';
  const LEGACY_KEYS = ['kolkata-puja-bingo-v1','kolkata-pujo-favourites-v1','kolkata-pujo-visited-v1','kolkata-pujo-notes-v1','kolkata-puja-2026-personal-v2','kolkata-puja-2026-suite-v1','kolkata-pujo-route','kolkata-pujo-completed','kolkata-pujo-mode'];
  const defaults = () => ({version:3,saved:[],visited:[],notes:{},route:[],completed:[],mode:'walking',bingo:[]});
  const readJson = (key, fallback) => { try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch { return fallback; } };
  const clean = value => String(value ?? '').trim();
  const unique = list => [...new Set((Array.isArray(list) ? list : []).map(clean).filter(Boolean))];
  const normalize = raw => {
    const state = {...defaults(), ...(raw && typeof raw === 'object' ? raw : {})};
    state.version = 3;
    state.saved = unique(state.saved);
    state.visited = unique(state.visited);
    state.completed = unique(state.completed);
    state.route = (Array.isArray(state.route) ? state.route : []).filter(x => x && clean(x.name)).map(x => ({name:clean(x.name), lat:Number(x.lat), lng:Number(x.lng)}));
    state.notes = state.notes && typeof state.notes === 'object' ? Object.fromEntries(Object.entries(state.notes).filter(([k,v]) => clean(k) && typeof v === 'string')) : {};
    state.mode = ['walking','driving','transit','two-wheeler'].includes(state.mode) ? state.mode : 'walking';
    state.bingo = Array.isArray(state.bingo) ? [...new Set(state.bingo.map(Number).filter(Number.isInteger))] : [];
    return state;
  };
  const migrate = () => {
    const existing = readJson(KEY, null);
    if (existing && existing.version === 3) return normalize(existing);
    const next = defaults();
    next.saved = unique(readJson('kolkata-pujo-favourites-v1', []));
    next.visited = unique(readJson('kolkata-pujo-visited-v1', []));
    next.notes = readJson('kolkata-pujo-notes-v1', {});
    const personal = readJson('kolkata-puja-2026-personal-v2', {});
    next.saved = unique(next.saved.concat(personal.saved || []));
    next.visited = unique(next.visited.concat(personal.visited || []));
    next.notes = {...next.notes, ...(personal.notes || {})};
    const suite = readJson('kolkata-puja-2026-suite-v1', {});
    next.visited = unique(next.visited.concat(suite.visited || []));
    next.route = Array.isArray(suite.route) ? suite.route : readJson('kolkata-pujo-route', []);
    next.completed = unique(readJson('kolkata-pujo-completed', []));
    next.mode = readJson('kolkata-pujo-mode', 'walking');
    const bingo = readJson('kolkata-puja-bingo-v1', {});
    next.bingo = Array.isArray(bingo.done) ? bingo.done : [];
    return normalize(next);
  };
  let state = migrate();
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} };
  const notify = () => window.dispatchEvent(new CustomEvent('kolkata:state', {detail:typeof structuredClone === 'function' ? structuredClone(state) : {...state}}));
  persist();
  try { LEGACY_KEYS.forEach(key => localStorage.removeItem(key)); } catch {}
  window.KolkataState = Object.freeze({
    key: KEY,
    get: () => normalize(state),
    update: patch => { state = normalize({...state, ...(patch || {})}); persist(); notify(); return normalize(state); },
    reset: () => { state = defaults(); persist(); notify(); return normalize(state); }
  });
  window.addEventListener('storage', event => { if (event.key === KEY) { state = normalize(readJson(KEY, defaults())); notify(); } });
  window.dispatchEvent(new CustomEvent('kolkata:state-ready', {detail:{key:KEY}}));
})();
