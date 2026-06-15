/**
 * store.js — Accès centralisé et robuste au localStorage de Smatch.
 *
 * Objectif : une seule porte d'entrée pour lire/écrire l'état, avec
 * valeurs par défaut, parsing JSON sûr et gestion d'erreur (mode privé,
 * quota plein, JSON corrompu). Le code existant qui utilise localStorage
 * directement continue de fonctionner — ce module est additif et peut être
 * adopté progressivement.
 *
 * Usage :
 *   SmatchStore.get('mode')            → 'hiver' (défaut) ou la valeur
 *   SmatchStore.set('status','ready')
 *   SmatchStore.getJSON('dashboards')  → [] (défaut) ou le tableau parsé
 *   SmatchStore.setJSON('messages', [...])
 *   SmatchStore.getBool('setting_show_online', true)
 *   SmatchStore.remove('active_trip_id')
 *
 * Les clés sont passées SANS le préfixe 'snm_' (ajouté automatiquement).
 */
(function () {
  const PREFIX = 'snm_';

  // Valeurs par défaut centralisées (clés sans préfixe)
  const DEFAULTS = {
    mode: 'hiver',
    auth: '0',
    pseudo: 'RiderDu74',
    status: 'ready',
    bio: '',
    ville: '',
    age: '',
    level: 'avance',
    intensity: 'sportif',
    budget: 'medium',
    dispo_type: 'flexible',
    activite: '',
    act_name: '',
    act_icon: '',
    lieu: '',
    active_trip_id: '',
    pw: 'password123',
    pw_date: '',
  };

  const JSON_DEFAULTS = {
    dashboards: [],
    merge_requests: [],
    messages: [],
    kiffs: [],
  };

  // Test de disponibilité du localStorage (mode privé strict, etc.)
  let _available = true;
  try {
    const t = '__smatch_test__';
    localStorage.setItem(t, '1');
    localStorage.removeItem(t);
  } catch (e) {
    _available = false;
    console.warn('[SmatchStore] localStorage indisponible — fallback mémoire.');
  }

  // Fallback mémoire si localStorage bloqué
  const _mem = {};

  function _key(k) {
    return k.startsWith(PREFIX) ? k : PREFIX + k;
  }

  function _rawGet(fullKey) {
    if (_available) {
      try { return localStorage.getItem(fullKey); } catch (e) { return _mem[fullKey] ?? null; }
    }
    return _mem[fullKey] ?? null;
  }

  function _rawSet(fullKey, value) {
    if (_available) {
      try { localStorage.setItem(fullKey, value); return true; }
      catch (e) { _mem[fullKey] = value; return false; }
    }
    _mem[fullKey] = value;
    return false;
  }

  const SmatchStore = {
    /** Lit une chaîne. Renvoie le défaut si absente. */
    get(key, fallback) {
      const v = _rawGet(_key(key));
      if (v !== null) return v;
      if (fallback !== undefined) return fallback;
      return DEFAULTS[key] !== undefined ? DEFAULTS[key] : null;
    },

    /** Écrit une chaîne. */
    set(key, value) {
      return _rawSet(_key(key), String(value));
    },

    /** Lit et parse du JSON. Renvoie le défaut (ou []) si absent/corrompu. */
    getJSON(key, fallback) {
      const raw = _rawGet(_key(key));
      const def = fallback !== undefined ? fallback
        : (JSON_DEFAULTS[key] !== undefined ? JSON_DEFAULTS[key] : null);
      if (raw === null) return def;
      try { return JSON.parse(raw); }
      catch (e) { console.warn('[SmatchStore] JSON corrompu pour', key); return def; }
    },

    /** Sérialise et écrit du JSON. */
    setJSON(key, value) {
      try { return _rawSet(_key(key), JSON.stringify(value)); }
      catch (e) { return false; }
    },

    /** Lit un booléen ('1'/'0'). */
    getBool(key, fallback) {
      const v = _rawGet(_key(key));
      if (v === null) return fallback !== undefined ? fallback : false;
      return v === '1' || v === 'true';
    },

    /** Écrit un booléen sous forme '1'/'0'. */
    setBool(key, value) {
      return _rawSet(_key(key), value ? '1' : '0');
    },

    /** Supprime une clé. */
    remove(key) {
      const fk = _key(key);
      if (_available) { try { localStorage.removeItem(fk); } catch (e) {} }
      delete _mem[fk];
    },

    /** True si la clé existe. */
    has(key) {
      return _rawGet(_key(key)) !== null;
    },

    /** Indique si le vrai localStorage est utilisable. */
    isAvailable() { return _available; },
  };

  if (typeof window !== 'undefined') {
    window.SmatchStore = SmatchStore;
  }
})();
