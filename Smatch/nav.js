/**
 * nav.js v4 — Smatch (SnowMatch / SunMatch)
 * Auto-init : fonctionne que DOMContentLoaded soit déjà passé ou non.
 * Navbar absolument stable, centrée, season-aware.
 */

// ═══════════════════════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════════════════════
const NAV_STATE = {
  mode:       localStorage.getItem('snm_mode')    || 'hiver',
  loggedIn:   localStorage.getItem('snm_auth')    === '1',
  pseudo:     localStorage.getItem('snm_pseudo')  || 'RiderDu74',
  status:     localStorage.getItem('snm_status')  || 'ready',
  activePage: document.body.dataset.page          || 'accueil',
};

function navSaveState() {
  localStorage.setItem('snm_mode',   NAV_STATE.mode);
  localStorage.setItem('snm_auth',   NAV_STATE.loggedIn ? '1' : '0');
  localStorage.setItem('snm_pseudo', NAV_STATE.pseudo);
  localStorage.setItem('snm_status', NAV_STATE.status);
}

// Le dernier dashboard visité (snm_active_trip_id), sinon le 1er de la saison courante
function _navLatestDashboard(actifs) {
  if (!actifs || !actifs.length) return null;
  const activeId = localStorage.getItem('snm_active_trip_id');
  if (activeId) {
    const found = actifs.find(d => d.id === activeId);
    if (found) return found;
  }
  return actifs.find(d => d.mode === NAV_STATE.mode) || actifs[0];
}

function navIsSouvenir(d) {
  // Un crew issu d'un merge reste actif (sauf s'il a été explicitement archivé)
  if (d.fromMerge && !d.archived) return false;
  return new Date(d.dateEnd) <= Date.now();
}
function navGetDashboards() {
  const stored = localStorage.getItem('snm_dashboards');
  if (stored) try { return JSON.parse(stored); } catch(e) {}
  const defaults = [
    { id:'dh1', mode:'hiver', name:'Crew Chamonix',  spot:'Chamonix Mont-Blanc',  dateEnd:'2026-02-21', members:5, url:'dashboard_hiver.html?trip=dh1' },
    { id:'de1', mode:'ete',   name:'Crew Hossegor',  spot:'Hossegor Côte Basque', dateEnd:'2026-08-12', members:5, url:'dashboard_ete.html?trip=de1'   },
    { id:'dh0', mode:'hiver', name:'Méribel 2025',   spot:'Méribel 3 Vallées',    dateEnd:'2025-03-15', members:4, url:'dashboard_hiver.html?trip=dh0' },
  ];
  localStorage.setItem('snm_dashboards', JSON.stringify(defaults));
  return defaults;
}

function navGetMergeRequests() {
  try { return JSON.parse(localStorage.getItem('snm_merge_requests') || '[]'); } catch(e) { return []; }
}

// ═══════════════════════════════════════════════════════════════════
//  MOTEUR DE NOTIFICATIONS — centralise toute l'activité du site
// ═══════════════════════════════════════════════════════════════════
function navGetNotifs() {
  try { return JSON.parse(localStorage.getItem('snm_notifs') || '[]'); } catch(e) { return []; }
}
function navGetNotifUnread() {
  return navGetNotifs().filter(n => !n.read).length;
}
// Ajoute une notification. type: match|message|merge|chat|crew|system
function navPushNotif(type, title, body, action) {
  const notifs = navGetNotifs();
  // Anti-doublon : même type+title dans les 5 dernières
  if (notifs.slice(0,5).some(n => n.type===type && n.title===title)) return;
  notifs.unshift({
    id: 'n_' + Date.now() + '_' + Math.floor(Math.random()*1000),
    type, title, body: body||'', action: action||null,
    time: Date.now(), read: false,
  });
  // Garde les 40 plus récentes
  localStorage.setItem('snm_notifs', JSON.stringify(notifs.slice(0,40)));
  if (typeof navRender === 'function') navRender();
  // Petit toast discret
  if (typeof showToast === 'function') {
    const icons = { match:'🔥', message:'✉️', merge:'⚡', chat:'💬', crew:'👥', system:'🔔' };
    showToast((icons[type]||'🔔') + ' ' + title);
  }
}
function navMarkNotifsRead() {
  const notifs = navGetNotifs();
  notifs.forEach(n => n.read = true);
  localStorage.setItem('snm_notifs', JSON.stringify(notifs));
}
function navClearNotifs() {
  localStorage.setItem('snm_notifs', '[]');
  navRenderNotifPanel();
  navRender();
}
function _navNotifAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'à l\'instant';
  if (s < 3600) return 'il y a ' + Math.floor(s/60) + ' min';
  if (s < 86400) return 'il y a ' + Math.floor(s/3600) + ' h';
  return 'il y a ' + Math.floor(s/86400) + ' j';
}

function navToggleNotifs(event) {
  if (event) event.stopPropagation();
  const ex = document.getElementById('snm-notif-panel');
  if (ex) { ex.remove(); return; }
  const AC = NAV_STATE.mode === 'ete' ? '#fbbf24' : '#22d3ee';
  const panel = document.createElement('div');
  panel.id = 'snm-notif-panel';
  panel.style.cssText = 'position:fixed;top:60px;right:1rem;z-index:9500;width:340px;max-width:calc(100vw - 1.5rem);max-height:70vh;background:rgba(8,12,24,.97);border:1px solid rgba(30,41,59,.85);border-radius:18px;box-shadow:0 24px 60px rgba(0,0,0,.6);backdrop-filter:blur(20px);overflow:hidden;display:flex;flex-direction:column;animation:snmNotifIn .2s ease;';
  panel.addEventListener('click', e => e.stopPropagation());
  panel.innerHTML = `
    <div style="padding:.9rem 1rem;border-bottom:1px solid rgba(30,41,59,.6);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
      <div style="font-size:.9rem;font-weight:800;color:#fff;">🔔 Notifications</div>
      <button onclick="navClearNotifs()" style="font-size:.66rem;color:#64748b;background:none;border:none;cursor:pointer;" onmouseenter="this.style.color='#94a3b8'" onmouseleave="this.style.color='#64748b'">Tout effacer</button>
    </div>
    <div id="snm-notif-list" style="overflow-y:auto;flex-grow:1;"></div>`;
  document.body.appendChild(panel);
  navRenderNotifPanel();
  navMarkNotifsRead();
  // Re-render navbar pour enlever le badge après ouverture
  setTimeout(() => navRender(), 400);
}

function navRenderNotifPanel() {
  const list = document.getElementById('snm-notif-list');
  if (!list) return;
  const AC = NAV_STATE.mode === 'ete' ? '#fbbf24' : '#22d3ee';
  const notifs = navGetNotifs();
  const icons = { match:'🔥', message:'✉️', merge:'⚡', chat:'💬', crew:'👥', system:'🔔' };
  if (!notifs.length) {
    list.innerHTML = '<div style="text-align:center;padding:2.5rem 1rem;color:#334155;font-size:.85rem;">Aucune notification 🌙<br><span style="font-size:.7rem;">Tout est calme pour le moment.</span></div>';
    return;
  }
  list.innerHTML = notifs.map(n => `
    <div style="position:relative;display:flex;align-items:stretch;border-bottom:1px solid rgba(30,41,59,.5);background:${n.read?'none':'rgba(34,211,238,.04)'};">
      <button onclick="navNotifClick('${n.id}')" style="flex-grow:1;display:flex;gap:.7rem;padding:.75rem 1rem;background:none;border:none;cursor:pointer;text-align:left;min-width:0;" onmouseenter="this.parentElement.style.background='rgba(30,41,59,.4)'" onmouseleave="this.parentElement.style.background='${n.read?'none':'rgba(34,211,238,.04)'}'">
        <div style="width:34px;height:34px;border-radius:10px;background:rgba(30,41,59,.7);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0;">${icons[n.type]||'🔔'}</div>
        <div style="flex-grow:1;min-width:0;">
          <div style="font-size:.8rem;font-weight:700;color:#fff;display:flex;align-items:center;gap:.4rem;">${n.title}${!n.read?`<span style="width:6px;height:6px;border-radius:50%;background:${AC};flex-shrink:0;"></span>`:''}</div>
          ${n.body?`<div style="font-size:.7rem;color:#94a3b8;margin-top:.1rem;line-height:1.3;">${n.body}</div>`:''}
          <div style="font-size:.6rem;color:#475569;margin-top:.2rem;">${_navNotifAgo(n.time)}</div>
        </div>
      </button>
      <button onclick="navDeleteNotif('${n.id}')" aria-label="Supprimer" style="flex-shrink:0;padding:0 .8rem;background:none;border:none;cursor:pointer;color:#475569;font-size:.75rem;" onmouseenter="this.style.color='#f87171'" onmouseleave="this.style.color='#475569'"><i class="fa-solid fa-xmark"></i></button>
    </div>`).join('');
}

function navDeleteNotif(id) {
  const notifs = navGetNotifs().filter(n => n.id !== id);
  localStorage.setItem('snm_notifs', JSON.stringify(notifs));
  navRenderNotifPanel();
  navRender();
}

function navNotifClick(id) {
  const notifs = navGetNotifs();
  const n = notifs.find(x => x.id === id);
  if (!n) return;
  n.read = true;
  localStorage.setItem('snm_notifs', JSON.stringify(notifs));
  const panel = document.getElementById('snm-notif-panel'); if (panel) panel.remove();
  // Action selon le type
  if (n.action === 'messages') navOpenMessages();
  else if (n.action === 'demandes') navOpenDemandesModal();
  else if (n.action === 'matchs') { if (localStorage.getItem('snm_auth')==='1') window.location.href = 'resultats.html'; }
  else if (n.action && n.action.startsWith('validation:')) { navOpenValidationModal(n.action.split(':')[1]); }
  else if (n.action && n.action.startsWith('crew:')) {
    const tid = n.action.split(':')[1];
    const dash = navGetDashboards().find(d => d.id === tid);
    if (dash) navGoToCrew(tid, dash.mode);
    else { const r = (typeof SmatchMerge!=='undefined')?SmatchMerge.all().find(x=>x.tripId===tid):null; if (r) navGoToCrew(tid, r.mode); }
  }
  navRender();
}


// ─── PROFIL D'AVENTURIER (badges + fiabilité) — partagé dashboards/messagerie ──
function renderAdventurerSection(containerId, key, accentColor) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const adv = (window.SMATCH_ADVENTURER || {})[key];
  const badges = window.SMATCH_BADGES || {};
  const rel = (typeof smatchReliabilityScore === 'function') ? smatchReliabilityScore(key) : null;
  const AC = accentColor || '#22d3ee';
  if (!adv || !rel) { el.innerHTML = ''; return; }

  // Jauge de fiabilité
  const gauge = `
    <div style="background:rgba(5,8,20,.5);border:1px solid rgba(30,41,59,.6);border-radius:14px;padding:.85rem 1rem;margin-bottom:.7rem;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.5rem;">
        <span style="display:flex;align-items:center;gap:.4rem;font-size:.78rem;font-weight:700;color:#e2e8f0;"><i class="fa-solid fa-shield-halved" style="color:${rel.tierColor};"></i> Score de fiabilité</span>
        <span style="font-size:.72rem;font-weight:800;color:${rel.tierColor};">${rel.tier}</span>
      </div>
      <div style="height:8px;background:rgba(71,85,105,.3);border-radius:9999px;overflow:hidden;margin-bottom:.45rem;">
        <div style="height:100%;width:${rel.score}%;border-radius:9999px;background:linear-gradient(to right,${rel.tierColor},${rel.tierColor}aa);transition:width 1s cubic-bezier(.4,0,.2,1);"></div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;font-size:.62rem;color:#64748b;">
        <span>${adv.tripsDone}/${adv.tripsTotal} trips menés à terme</span>
        <span style="font-weight:800;color:${rel.tierColor};">${rel.score}/100</span>
      </div>
    </div>`;

  // Ligne de stats fiabilité
  const stats = `
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.4rem;margin-bottom:.7rem;">
      <div style="background:rgba(5,8,20,.5);border:1px solid rgba(30,41,59,.6);border-radius:10px;padding:.5rem;text-align:center;">
        <div style="font-size:.85rem;font-weight:800;color:#e2e8f0;">${Math.round(adv.onTimeRate*100)}%</div>
        <div style="font-size:.55rem;color:#64748b;margin-top:.1rem;">🤝 Ponctualité</div>
      </div>
      <div style="background:rgba(5,8,20,.5);border:1px solid rgba(30,41,59,.6);border-radius:10px;padding:.5rem;text-align:center;">
        <div style="font-size:.85rem;font-weight:800;color:#e2e8f0;">${Math.round(adv.replyRate*100)}%</div>
        <div style="font-size:.55rem;color:#64748b;margin-top:.1rem;">💬 Réactivité</div>
      </div>
      <div style="background:rgba(5,8,20,.5);border:1px solid rgba(30,41,59,.6);border-radius:10px;padding:.5rem;text-align:center;">
        <div style="font-size:.85rem;font-weight:800;color:#e2e8f0;">${(new Date().getFullYear()) - adv.joinedYear}an${(new Date().getFullYear())-adv.joinedYear>1?'s':''}</div>
        <div style="font-size:.55rem;color:#64748b;margin-top:.1rem;">📅 Ancienneté</div>
      </div>
    </div>`;

  // Vérification
  const verif = adv.verified
    ? `<div style="display:inline-flex;align-items:center;gap:.35rem;font-size:.66rem;font-weight:700;color:#4ade80;background:rgba(74,222,128,.1);border:1px solid rgba(74,222,128,.25);border-radius:9999px;padding:.22rem .7rem;margin-bottom:.7rem;"><i class="fa-solid fa-circle-check"></i> Profil vérifié</div>`
    : `<div style="display:inline-flex;align-items:center;gap:.35rem;font-size:.66rem;font-weight:700;color:#64748b;background:rgba(71,85,105,.1);border:1px solid rgba(71,85,105,.25);border-radius:9999px;padding:.22rem .7rem;margin-bottom:.7rem;"><i class="fa-regular fa-circle"></i> Non vérifié</div>`;

  // Badges
  const badgeChips = (adv.badges || []).map(bk => {
    const b = badges[bk];
    if (!b) return '';
    return `<div title="${b.desc}" style="display:flex;align-items:center;gap:.35rem;background:${AC}11;border:1px solid ${AC}33;border-radius:9999px;padding:.28rem .65rem;cursor:help;">
      <span style="font-size:.82rem;">${b.icon}</span>
      <span style="font-size:.64rem;font-weight:700;color:#cbd5e1;">${b.label}</span>
    </div>`;
  }).join('');

  el.innerHTML = `
    <div style="border-top:1px solid rgba(30,41,59,.6);padding-top:.9rem;margin-top:.3rem;">
      <div style="display:flex;align-items:center;gap:.4rem;font-size:.6rem;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:.06em;margin-bottom:.6rem;">🎖️ Profil d'aventurier</div>
      ${verif}
      ${gauge}
      ${stats}
      <div style="font-size:.66rem;font-weight:700;color:#64748b;margin-bottom:.45rem;">Badges débloqués (${(adv.badges||[]).length})</div>
      <div style="display:flex;flex-wrap:wrap;gap:.35rem;">${badgeChips}</div>
    </div>`;
}

// ─── Supprimer un dashboard souvenir ─────────────────────────────────
function navDeleteSouvenir(event, id, name) {
  if (event) { event.preventDefault(); event.stopPropagation(); }
  const existing = document.getElementById('snm-del-souvenir-modal');
  if (existing) existing.remove();
  const div = document.createElement('div');
  div.id = 'snm-del-souvenir-modal';
  div.className = 'snm-modal-overlay'; div.setAttribute('role','dialog'); div.setAttribute('aria-modal','true');
  div.addEventListener('click', e => { if (e.target === div) div.remove(); });
  div.innerHTML = `
    <div class="snm-modal-box" style="max-width:360px;border:1px solid rgba(239,68,68,.3);">
      <div style="padding:1.4rem;text-align:center;">
        <div style="font-size:2.6rem;margin-bottom:.55rem;">🗑️</div>
        <div style="font-size:1rem;font-weight:800;color:#fff;margin-bottom:.45rem;">Supprimer ce souvenir ?</div>
        <div style="font-size:.8rem;color:#94a3b8;line-height:1.5;margin-bottom:1.3rem;">"${name}" et ses photos seront définitivement retirés de tes souvenirs. Cette action est irréversible.</div>
        <div style="display:flex;gap:.6rem;">
          <button onclick="document.getElementById('snm-del-souvenir-modal').remove()" style="flex:1;background:rgba(30,41,59,.65);border:1px solid rgba(71,85,105,.4);color:#94a3b8;font-weight:700;font-size:.82rem;padding:.7rem;border-radius:12px;cursor:pointer;" onmouseenter="this.style.background='rgba(30,41,59,.9)'" onmouseleave="this.style.background='rgba(30,41,59,.65)'">Annuler</button>
          <button onclick="navConfirmDeleteSouvenir('${id}')" style="flex:1;background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;font-weight:800;font-size:.82rem;padding:.7rem;border-radius:12px;border:none;cursor:pointer;" onmouseenter="this.style.opacity='.85'" onmouseleave="this.style.opacity='1'"><i class="fa-solid fa-trash"></i> Supprimer</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(div);
}

function navConfirmDeleteSouvenir(id) {
  let dashboards = navGetDashboards();
  dashboards = dashboards.filter(d => d.id !== id);
  localStorage.setItem('snm_dashboards', JSON.stringify(dashboards));
  localStorage.removeItem('snm_photos_' + id);
  const modal = document.getElementById('snm-del-souvenir-modal'); if (modal) modal.remove();
  navRender();
  // Garde le dropdown ouvert pour voir le résultat
  setTimeout(() => navDD('dash'), 30);
  if (typeof showToast === 'function') showToast('🗑️ Souvenir supprimé');
}

function navApplySeasonBG(mode) {
  const bg = document.getElementById('bg-layer');
  if (!bg) return;
  bg.style.background = mode === 'ete'
    ? 'linear-gradient(160deg,#1a1000 0%,#2d1a00 25%,#3d2800 45%,#1a3040 60%,#0d1f2d 75%,#080f1a 100%)'
    : 'linear-gradient(160deg,#0f1f3d 0%,#0c2340 25%,#1a3a5c 45%,#2d5a7a 60%,#1e3a52 75%,#0a1628 100%)';
  ['svg-hiver','svg-ete'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = (id === 'svg-hiver') === (mode === 'hiver') ? '' : 'none';
  });
}

// ═══════════════════════════════════════════════════════════════════════
//  INJECT CSS (once, idempotent)
// ═══════════════════════════════════════════════════════════════════════
function navInjectCSS() {
  if (document.getElementById('snm-nav-css')) return;
  const s = document.createElement('style');
  s.id = 'snm-nav-css';
  s.textContent = `
    /* Logo — dégradé animé de gauche à droite */
    .snm-logo-grad {
      -webkit-background-clip:text; background-clip:text;
      -webkit-text-fill-color:transparent; color:transparent;
      background-size:300% 100%;
      background-repeat:repeat;
      animation:snmGradShift 4s linear infinite;
      /* évite que la boîte du dégradé soit visible aux bords des glyphes */
      -webkit-box-decoration-break:clone; box-decoration-break:clone;
      will-change:background-position;
    }
    .snm-grad-hiver { background-image:linear-gradient(100deg,#22d3ee,#3b82f6,#60a5fa,#22d3ee,#3b82f6,#22d3ee); }
    .snm-grad-ete   { background-image:linear-gradient(100deg,#fbbf24,#f97316,#fdba74,#fbbf24,#f97316,#fbbf24); }
    @keyframes snmGradShift {
      0%   { background-position:0% center; }
      100% { background-position:300% center; }
    }
    #snm-nav {
      position:sticky; top:0; z-index:9500;
      background:rgba(2,6,23,.95);
      border-bottom:1px solid rgba(30,41,59,.55);
      backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
      width:100%; box-sizing:border-box;
    }
    .snm-inner {
      position:relative; max-width:80rem; margin:0 auto;
      padding:0 1.5rem; height:3.5rem;
      display:flex; align-items:center;
      box-sizing:border-box; overflow:visible;
    }
    .snm-logo {
      text-decoration:none; flex-shrink:0; z-index:1;
      transition:filter .2s,transform .2s;
    }
    .snm-logo:hover { filter:brightness(1.2); transform:scale(1.04); }
    /* Pills — centrées par position absolue, jamais décalées */
    .snm-center {
      position:absolute; left:50%; transform:translateX(-50%);
      display:flex; align-items:center; gap:.25rem;
      background:rgba(15,23,42,.82); border:1px solid rgba(30,41,59,.9);
      border-radius:9999px; padding:.28rem .4rem; z-index:1;
    }
    .snm-right {
      display:flex; align-items:center; gap:.5rem;
      margin-left:auto; flex-shrink:0; z-index:1;
    }
    /* Pills */
    .snm-pill {
      display:inline-flex; align-items:center; gap:.35rem;
      padding:.32rem .9rem; border-radius:9999px;
      font-size:.7rem; font-weight:700; white-space:nowrap;
      cursor:pointer; text-decoration:none;
      border:1px solid transparent; background:none;
      transition:background .18s,color .18s,border-color .18s;
    }
    .snm-pill .fa-solid { font-size:.65rem; }
    .snm-pill-off { color:#94a3b8; }
    .snm-pill-off:hover { background:rgba(255,255,255,.05); color:#e2e8f0; }
    .snm-chev { font-size:.58rem!important; opacity:.5; transition:transform .2s; margin-left:2px; }
    .snm-chev.open { transform:rotate(180deg); }
    /* Dropdowns */
    .snm-dd-wrap { position:relative; display:inline-flex; }
    .snm-dd {
      position:absolute; top:calc(100% + 9px); left:50%;
      transform:translateX(-50%) translateY(-6px) scale(.96);
      background:rgba(8,12,24,.98); border:1px solid rgba(30,41,59,.8);
      border-radius:18px; box-shadow:0 24px 60px rgba(0,0,0,.65);
      backdrop-filter:blur(22px); -webkit-backdrop-filter:blur(22px);
      z-index:9999; opacity:0; pointer-events:none;
      transition:opacity .2s,transform .2s; overflow:hidden; min-width:200px;
    }
    .snm-dd.open {
      opacity:1; pointer-events:auto;
      transform:translateX(-50%) translateY(0) scale(1);
    }
    #dd-compte { left:auto; right:0; transform:translateY(-6px) scale(.96); }
    #dd-compte.open { transform:translateY(0) scale(1); }
    .snm-dd-hdr { padding:.55rem 1rem .35rem; font-size:.6rem; font-weight:800; color:#334155; text-transform:uppercase; letter-spacing:.06em; border-bottom:1px solid rgba(30,41,59,.6); }
    .snm-dd-sec { padding:.45rem 1rem .18rem; font-size:.58rem; font-weight:800; color:#1e293b; text-transform:uppercase; letter-spacing:.06em; }
    .snm-dd-item { display:flex; align-items:center; gap:.6rem; padding:.55rem .85rem; cursor:pointer; transition:background .15s; text-decoration:none; width:100%; box-sizing:border-box; }
    .snm-dd-item:hover { background:rgba(30,41,59,.55); }
    .snm-dd-ico { width:26px; height:26px; border-radius:8px; background:rgba(30,41,59,.7); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .snm-dd-lbl { font-size:.72rem; font-weight:700; color:#e2e8f0; white-space:nowrap; }
    .snm-dd-sub { font-size:.61rem; color:#475569; margin-top:.05rem; white-space:nowrap; }
    /* Modal shared */
    .snm-modal-overlay { position:fixed; inset:0; z-index:19000; background:rgba(2,6,23,.85); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; }
    .snm-modal-box { background:rgba(10,15,30,.98); border-radius:24px; width:94%; max-height:92vh; overflow-y:auto; box-shadow:0 40px 80px rgba(0,0,0,.75); animation:snmPop .28s ease both; scrollbar-width:thin; scrollbar-color:rgba(30,41,59,.5) transparent; }
    .snm-card2 { background:rgba(5,8,20,.65); border:1px solid rgba(30,41,59,.6); border-radius:14px; }
    .snm-input { width:100%; box-sizing:border-box; background:rgba(5,8,20,.7); border:1px solid rgba(71,85,105,.5); border-radius:10px; padding:.55rem .9rem; color:#e2e8f0; font-size:.8rem; outline:none; font-family:inherit; transition:border-color .2s; }
    .snm-label { font-size:.7rem; color:#64748b; display:block; margin-bottom:.3rem; }
    @keyframes snmPop { from{opacity:0;transform:scale(.92) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
    /* Responsivité */
    @media(max-width:640px) { .snm-center { display:none; } .snm-season-lbl { display:none; } }
    @media(max-width:480px) { .snm-pseudo-lbl { display:none; } }
    @media(max-width:560px) {
      /* Les dropdowns ne débordent jamais de l'écran */
      .snm-dd { min-width:auto!important; width:calc(100vw - 1.5rem)!important; max-width:320px!important; }
      #dd-compte { right:.4rem!important; }
      .snm-inner { padding:0 .75rem!important; }
    }
    /* ── Barre de navigation mobile (bas d'écran) ── */
    #snm-bottom-nav { display:none; }
    @keyframes snmSheetUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
    @keyframes snmNotifIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes snmBellRing { 0%,100%{transform:rotate(0)} 20%{transform:rotate(12deg)} 40%{transform:rotate(-10deg)} 60%{transform:rotate(6deg)} 80%{transform:rotate(-4deg)} }
    @media(max-width:640px) {
      #snm-bottom-nav {
        display:flex;
        position:fixed; bottom:0; left:0; right:0; z-index:9400;
        background:rgba(2,6,23,.97);
        border-top:1px solid rgba(30,41,59,.6);
        backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
        padding-bottom:env(safe-area-inset-bottom, 0);
      }
      /* Évite que le contenu soit caché derrière la barre du bas */
      body { padding-bottom:64px; }
    }
    /* Global */
    a,button { transition:filter .17s ease,transform .17s ease; }
    button:active:not(:disabled),a:active { transform:scale(.97)!important; filter:brightness(.92)!important; }
    button:disabled { opacity:.4; cursor:not-allowed; }
  `;
  document.head.appendChild(s);
}

// ═══════════════════════════════════════════════════════════════════════
//  RENDER NAVBAR
// ═══════════════════════════════════════════════════════════════════════
// ─── Barre de navigation mobile (bas d'écran) ────────────────────────
function navBottomBar(page, AC) {
  const isEte = NAV_STATE.mode === 'ete';
  // Compteurs pour les pastilles rouges
  const pendingMerge = (typeof SmatchMerge !== 'undefined')
    ? SmatchMerge.all().filter(r => r.status === 'pending' || r.status === 'accepted' || r.status === 'negotiating').length : 0;
  const pendingValid = (typeof navGetValidationReqs === 'function') ? navGetValidationReqs().length : 0;
  const item = (label, icon, active, onclick, dot) => `
    <button onclick="${onclick}" aria-label="${label}" style="position:relative;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;background:none;border:none;cursor:pointer;padding:.4rem 0;min-height:52px;color:${active?AC:'#64748b'};transition:color .15s;">
      <div style="position:relative;">
        <i class="fa-solid ${icon}" style="font-size:1.05rem;"></i>
        ${dot ? `<span style="position:absolute;top:-4px;right:-7px;min-width:15px;height:15px;padding:0 3px;box-sizing:border-box;background:#ef4444;color:#fff;font-size:.52rem;font-weight:900;border-radius:9999px;display:flex;align-items:center;justify-content:center;border:1.5px solid rgba(2,6,23,.95);">${dot>9?'9+':dot}</span>` : ''}
      </div>
      <span style="font-size:.6rem;font-weight:${active?'800':'600'};">${label}</span>
    </button>`;

  return `
  <nav id="snm-bottom-nav" aria-label="Navigation principale mobile">
    ${item('Accueil','fa-house-chimney', page==='accueil', "window.location.href='accueil.html'", 0)}
    ${item('Matchs','fa-fire', page==='matchs', "navOpenSheet('matchs')", pendingMerge)}
    ${item('Crews','fa-people-group', page==='dashboard', "navOpenSheet('crews')", pendingValid)}
  </nav>`;
}

// Navigation mobile avec garde d'auth
function navBottomGo(dest) {
  if (localStorage.getItem('snm_auth') === '1') { window.location.href = dest; return; }
  try { localStorage.setItem('snm_redirect_after_login', dest); } catch (e) {}
  const modal = document.getElementById('login-modal');
  if (modal) { modal.classList.add('open'); if (typeof navShowGateBanner==='function') navShowGateBanner(); }
  else window.location.href = 'accueil.html?login=1&gated=1';
}

// ─── Bottom sheets mobile (sous-menus Matchs / Crews) ────────────────
function navOpenSheet(which) {
  const isEte = NAV_STATE.mode === 'ete';
  const AC  = isEte ? '#fbbf24' : '#22d3ee';
  const ACB = isEte ? 'rgba(251,191,36,.13)' : 'rgba(34,211,238,.13)';
  const ex = document.getElementById('snm-sheet'); if (ex) ex.remove();

  const row = (icon, label, sub, onclick, badge) => `
    <button onclick="navCloseSheet();${onclick}" style="width:100%;display:flex;align-items:center;gap:.8rem;padding:.9rem 1.1rem;background:none;border:none;border-bottom:1px solid rgba(30,41,59,.5);cursor:pointer;text-align:left;">
      <div style="width:38px;height:38px;border-radius:11px;background:${ACB};display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fa-solid ${icon}" style="color:${AC};font-size:.9rem;"></i></div>
      <div style="flex-grow:1;min-width:0;">
        <div style="font-size:.88rem;font-weight:700;color:#e2e8f0;display:flex;align-items:center;gap:.4rem;">${label}${badge?`<span style="background:#ef4444;color:#fff;font-size:.58rem;font-weight:900;padding:1px 6px;border-radius:9999px;">${badge}</span>`:''}</div>
        <div style="font-size:.68rem;color:#64748b;margin-top:.1rem;">${sub}</div>
      </div>
      <i class="fa-solid fa-chevron-right" style="color:#334155;font-size:.7rem;"></i>
    </button>`;

  let title, content;
  if (which === 'matchs') {
    const pending = (localStorage.getItem('snm_setting_notifs_merge')!=='0' && localStorage.getItem('snm_setting_notif_matchs')!=='0')
      ? navGetMergeRequests().filter(r=>r.status==='pending'||r.status==='accepted'||r.status==='negotiating').length : 0;
    title = '🔥 Mes Matchs';
    content =
      row('fa-magnifying-glass','Nouvelle recherche','Lancer une recherche de crew', "navBottomGo('recherche.html')") +
      row('fa-bullseye','Mes Matchs','Voir les profils correspondants', "navBottomGo('resultats.html')") +
      row('fa-bell','Mes Demandes','Demandes de merge reçues', "navOpenDemandesModal()", pending || '');
  } else {
    const dbs = navGetDashboards();
    const now = Date.now();
    const actifs = dbs.filter(d => !navIsSouvenir(d));
    const souvenirs = dbs.filter(d => navIsSouvenir(d));
    const latest = _navLatestDashboard(actifs);
    const dRow = (d) => row(
      d.mode==='ete'?'fa-sun':'fa-snowflake',
      d.name,
      `${d.spot.length>28?d.spot.substring(0,28)+'…':d.spot} · 👥 ${d.members}`,
      `navGoToDashboard('${d.id}','${d.mode}','${d.url}')`
    );
    title = '👥 Mes Crews';
    let c = '';
    if (latest) c += row('fa-bolt','Dashboard actif', `${latest.name} · ${latest.mode==='ete'?'Été ☀️':'Hiver ❄️'}`, `navGoToDashboard('${latest.id}','${latest.mode}','${latest.url}')`);
    if (actifs.length) c += `<div style="padding:.5rem 1.1rem .2rem;font-size:.6rem;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:.05em;">🟢 Actifs</div>` + actifs.map(dRow).join('');
    if (souvenirs.length) c += `<div style="padding:.5rem 1.1rem .2rem;font-size:.6rem;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:.05em;">📸 Souvenirs</div>` + souvenirs.map(dRow).join('');
    content = c || '<div style="padding:2rem;text-align:center;color:#334155;font-size:.85rem;">Aucun crew pour le moment</div>';
  }

  const sheet = document.createElement('div');
  sheet.id = 'snm-sheet';
  sheet.setAttribute('role','dialog'); sheet.setAttribute('aria-modal','true');
  sheet.style.cssText = 'position:fixed;inset:0;z-index:9600;background:rgba(2,6,23,.7);backdrop-filter:blur(4px);display:flex;align-items:flex-end;';
  sheet.addEventListener('click', e => { if (e.target === sheet) navCloseSheet(); });
  sheet.innerHTML = `
    <div id="snm-sheet-panel" style="width:100%;background:rgba(8,12,24,.99);border-top:1px solid ${AC}33;border-radius:22px 22px 0 0;box-shadow:0 -20px 50px rgba(0,0,0,.6);max-height:80vh;overflow-y:auto;animation:snmSheetUp .28s cubic-bezier(.16,1,.3,1);padding-bottom:env(safe-area-inset-bottom,12px);">
      <div style="display:flex;justify-content:center;padding:.7rem 0 .3rem;"><div style="width:38px;height:4px;border-radius:9999px;background:rgba(71,85,105,.6);"></div></div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:.4rem 1.1rem .7rem;border-bottom:1px solid rgba(30,41,59,.6);">
        <span style="font-size:1rem;font-weight:800;color:#fff;">${title}</span>
        <button onclick="navCloseSheet()" aria-label="Fermer" style="color:#475569;background:none;border:none;cursor:pointer;font-size:1.1rem;"><i class="fa-solid fa-xmark"></i></button>
      </div>
      ${content}
    </div>`;
  document.body.appendChild(sheet);
}
function navCloseSheet() {
  const s = document.getElementById('snm-sheet');
  if (s) s.remove();
}

function navRender() {
  navInjectCSS();

  const m     = NAV_STATE;
  const isEte = m.mode === 'ete';
  const page  = m.activePage;
  const AC    = isEte ? '#fbbf24'              : '#22d3ee';
  const ACB   = isEte ? 'rgba(251,191,36,.13)' : 'rgba(34,211,238,.13)';
  const ACBD  = isEte ? 'rgba(251,191,36,.38)' : 'rgba(34,211,238,.38)';
  const GRAD  = isEte ? 'linear-gradient(135deg,#fbbf24,#f97316)' : 'linear-gradient(135deg,#22d3ee,#3b82f6)';

  // Logo
  const logo = isEte
    ? `<span style="display:flex;align-items:center;"><span class="snm-logo-grad snm-grad-ete" style="font-size:1.4rem;font-weight:900;">S</span><span style="font-size:.95rem;margin:0 -1px;position:relative;top:-1px;">☀️</span><span class="snm-logo-grad snm-grad-ete" style="font-size:1.4rem;font-weight:900;">N</span><span style="color:#fff;font-size:1.4rem;font-weight:900;">MATCH</span></span>`
    : `<span style="display:flex;align-items:center;"><span class="snm-logo-grad snm-grad-hiver" style="font-size:1.4rem;font-weight:900;">SN</span><span style="font-size:.95rem;margin:0 -1px;position:relative;top:-1px;">❄️</span><span class="snm-logo-grad snm-grad-hiver" style="font-size:1.4rem;font-weight:900;">W</span><span style="color:#fff;font-size:1.4rem;font-weight:900;">MATCH</span></span>`;

  const pill = (label, icon, href, active) =>
    `<a href="${href}" class="snm-pill ${active?'snm-pill-on':'snm-pill-off'}" style="${active?`background:${ACB};border-color:${ACBD};color:${AC};`:''}" style="text-decoration:none;"><i class="fa-solid ${icon}"></i>${label}</a>`;

  // Merge badge — toute demande qui demande ton attention
  const notifsOn = (localStorage.getItem('snm_setting_notifs_merge') !== '0') && (localStorage.getItem('snm_setting_notif_matchs') !== '0');
  const pending = notifsOn ? navGetMergeRequests().filter(r=>r.status==='pending'||r.status==='accepted'||r.status==='negotiating').length : 0;
  const badge   = pending ? `<span style="background:#ef4444;color:#fff;font-size:.58rem;font-weight:900;padding:1px 5px;border-radius:9999px;margin-left:2px;">${pending}</span>` : '';

  // Matchs dropdown
  const matchsDD = `
  <div class="snm-dd-wrap" id="dd-matchs-wrap">
    <button class="snm-pill ${page==='matchs'?'snm-pill-on':'snm-pill-off'}" style="${page==='matchs'?`background:${ACB};border-color:${ACBD};color:${AC};`:''}" onclick="navDD('matchs')">
      <i class="fa-solid fa-fire"></i>Matchs${badge}<i class="fa-solid fa-chevron-down snm-chev" id="chev-matchs"></i>
    </button>
    <div class="snm-dd" id="dd-matchs">
      <div class="snm-dd-hdr">🔥 Mes Matchs</div>
      <a href="recherche.html" onclick="return navGuard(event,'recherche.html')" class="snm-dd-item" style="text-decoration:none;">
        <div class="snm-dd-ico" style="background:${ACB};"><i class="fa-solid fa-magnifying-glass" style="color:${AC};font-size:.7rem;"></i></div>
        <div><div class="snm-dd-lbl">Nouvelle recherche</div><div class="snm-dd-sub">Lancer une recherche de crew</div></div>
      </a>
      <a href="resultats.html" onclick="return navGuard(event,'resultats.html')" class="snm-dd-item" style="text-decoration:none;">
        <div class="snm-dd-ico" style="background:${ACB};"><i class="fa-solid fa-bullseye" style="color:${AC};font-size:.7rem;"></i></div>
        <div><div class="snm-dd-lbl">Mes Matchs</div><div class="snm-dd-sub">Voir les profils correspondants</div></div>
      </a>
      <button onclick="navOpenDemandesModal()" class="snm-dd-item" style="background:none;border:none;cursor:pointer;">
        <div class="snm-dd-ico" style="background:${ACB};">${pending?`<span style="color:#ef4444;font-size:.7rem;font-weight:900;">${pending}</span>`:`<i class="fa-solid fa-bell" style="color:${AC};font-size:.7rem;"></i>`}</div>
        <div><div class="snm-dd-lbl">Mes Demandes${pending?` <span style="background:#ef4444;color:#fff;font-size:.55rem;padding:1px 5px;border-radius:9999px;margin-left:3px;">${pending}</span>`:''}</div><div class="snm-dd-sub">Demandes de merge reçues</div></div>
      </button>
    </div>
  </div>`;

  // Dashboards dropdown
  const dbs   = navGetDashboards();
  const now   = Date.now();
  const actifs    = dbs.filter(d => !navIsSouvenir(d));
  const souvenirs = dbs.filter(d => navIsSouvenir(d));
  const latestActive = _navLatestDashboard(actifs);
  const activeDash = latestActive ? latestActive.url : (isEte ? 'dashboard_ete.html?trip=de1' : 'dashboard_hiver.html?trip=dh1');
  const activeId   = latestActive ? latestActive.id  : (isEte ? 'de1' : 'dh1');
  const activeMode = latestActive ? latestActive.mode : m.mode;
  const activeModeLabel = latestActive ? `${latestActive.name} · ${activeMode === 'ete' ? 'Été ☀️' : 'Hiver ❄️'}` : (activeMode === 'ete' ? 'SunMatch — Été ☀️' : 'SnowMatch — Hiver ❄️');

  const dbBtn = (d, isSouvenir) => {
    const isAct = d.mode===m.mode && !navIsSouvenir(d);
    return `<div style="display:flex;align-items:stretch;position:relative;" class="snm-db-row">
      <button onclick="navGoToDashboard('${d.id}','${d.mode}','${d.url}')" class="snm-dd-item" style="background:none;border:none;cursor:pointer;text-align:left;flex-grow:1;${isSouvenir?'padding-right:2.4rem;':''}">
        <div class="snm-dd-ico" style="background:${d.mode==='ete'?'rgba(251,191,36,.13)':'rgba(34,211,238,.13)'};">
          <span style="font-size:.78rem;">${d.mode==='ete'?'☀️':'❄️'}</span>
        </div>
        <div style="flex-grow:1;min-width:0;">
          <div class="snm-dd-lbl" style="display:flex;align-items:center;gap:4px;">${d.name}${d.isNew?`<span style="font-size:.55rem;font-weight:800;padding:1px 5px;border-radius:9999px;background:rgba(74,222,128,.18);color:#4ade80;">Nouveau !</span>`:isAct?`<span style="font-size:.55rem;font-weight:800;padding:1px 5px;border-radius:9999px;background:${ACB};color:${AC};">Actif</span>`:''}
          </div>
          <div class="snm-dd-sub">${d.spot.length>24?d.spot.substring(0,24)+'…':d.spot} · 👥 ${d.members}</div>
        </div>
      </button>
      ${isSouvenir?`<button onclick="navDeleteSouvenir(event,'${d.id}','${d.name.replace(/'/g,"\\\\'")}')" title="Supprimer ce souvenir" style="position:absolute;right:.55rem;top:50%;transform:translateY(-50%);width:24px;height:24px;border-radius:7px;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);color:#f87171;cursor:pointer;font-size:.62rem;display:flex;align-items:center;justify-content:center;transition:all .15s;" onmouseenter="this.style.background='rgba(239,68,68,.2)'" onmouseleave="this.style.background='rgba(239,68,68,.08)'"><i class="fa-solid fa-trash"></i></button>`:''}
    </div>`;
  };

  const dashDD = `
  <div class="snm-dd-wrap" id="dd-dash-wrap">
    <button class="snm-pill ${page==='dashboard'?'snm-pill-on':'snm-pill-off'}" style="${page==='dashboard'?`background:${ACB};border-color:${ACBD};color:${AC};`:''}" onclick="navDD('dash')">
      <i class="fa-solid fa-people-group"></i>Dashboards<i class="fa-solid fa-chevron-down snm-chev" id="chev-dash"></i>
    </button>
    <div class="snm-dd" id="dd-dash" style="min-width:260px;">
      <button onclick="navGoToDashboard('${activeId}','${activeMode}','${activeDash}')" class="snm-dd-item" style="background:none;border:none;cursor:pointer;border-bottom:1px solid rgba(30,41,59,.6);text-align:left;">
        <div class="snm-dd-ico" style="background:${ACB};"><i class="fa-solid fa-bolt" style="color:${AC};font-size:.7rem;"></i></div>
        <div><div class="snm-dd-lbl" style="color:${AC};">Dashboard actif</div><div class="snm-dd-sub">${activeModeLabel}</div></div>
      </button>
      ${actifs.length ? `<div class="snm-dd-sec">🟢 Actifs</div>${actifs.map(d => dbBtn(d, false)).join('')}` : ''}
      ${souvenirs.length ? `<div class="snm-dd-sec">📸 Souvenirs</div>${souvenirs.map(d => dbBtn(d, true)).join('')}` : ''}
    </div>
  </div>`;

  // Season toggle
  const seasonBtn = `
  <button onclick="navToggleSeason()" aria-label="Changer de saison" style="display:flex;align-items:center;gap:5px;padding:.32rem .75rem;border-radius:9999px;cursor:pointer;font-size:.7rem;font-weight:700;white-space:nowrap;border:1px solid ${ACBD};background:${ACB};color:${AC};transition:all .2s;">
    <span style="font-size:.9rem;line-height:1;">${isEte?'❄️':'☀️'}</span>
    <span class="snm-season-lbl">${isEte?'Hiver':'Été'}</span>
  </button>`;

  // Bouton messagerie (seulement si connecté)
  let messageBtn = '';
  let bellBtn = '';
  if (m.loggedIn) {
    // ── Cloche de notifications ──
    const notifUnread = navGetNotifUnread();
    const notifBadge = notifUnread > 0
      ? `<span style="position:absolute;top:-3px;right:-3px;min-width:16px;height:16px;padding:0 4px;box-sizing:border-box;background:#ef4444;color:#fff;font-size:.56rem;font-weight:900;border-radius:9999px;display:flex;align-items:center;justify-content:center;border:1.5px solid rgba(2,6,23,.95);">${notifUnread > 9 ? '9+' : notifUnread}</span>`
      : '';
    bellBtn = `
    <button onclick="navToggleNotifs(event)" title="Notifications" aria-label="Notifications" style="position:relative;display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:9999px;cursor:pointer;border:1px solid rgba(71,85,105,.45);background:rgba(15,23,42,.85);transition:all .2s;" onmouseenter="this.style.borderColor='${ACBD}';this.style.background='${ACB}'" onmouseleave="this.style.borderColor='rgba(71,85,105,.45)';this.style.background='rgba(15,23,42,.85)'">
      <i class="fa-solid fa-bell" style="font-size:.82rem;color:${notifUnread>0?AC:'#94a3b8'};"></i>
      ${notifBadge}
    </button>`;

    const unread = navGetUnreadCount();
    const unreadBadge = unread > 0
      ? `<span style="position:absolute;top:-3px;right:-3px;min-width:16px;height:16px;padding:0 4px;box-sizing:border-box;background:#ef4444;color:#fff;font-size:.56rem;font-weight:900;border-radius:9999px;display:flex;align-items:center;justify-content:center;border:1.5px solid rgba(2,6,23,.95);">${unread > 9 ? '9+' : unread}</span>`
      : '';
    messageBtn = `
    <button onclick="navOpenMessages()" title="Messages" aria-label="Messages" style="position:relative;display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:9999px;cursor:pointer;border:1px solid rgba(71,85,105,.45);background:rgba(15,23,42,.85);transition:all .2s;" onmouseenter="this.style.borderColor='${ACBD}';this.style.background='${ACB}'" onmouseleave="this.style.borderColor='rgba(71,85,105,.45)';this.style.background='rgba(15,23,42,.85)'">
      <i class="fa-solid fa-envelope" style="font-size:.82rem;color:${unread>0?AC:'#94a3b8'};"></i>
      ${unreadBadge}
    </button>`;
  }

  // Right CTA
  let rightCTA;
  if (!m.loggedIn) {
    rightCTA = `<button onclick="navOpenLogin()" style="display:flex;align-items:center;gap:5px;padding:.32rem .9rem;border-radius:9999px;cursor:pointer;font-size:.7rem;font-weight:700;border:1px solid rgba(71,85,105,.5);background:rgba(15,23,42,.85);color:#e2e8f0;transition:all .2s;" onmouseenter="this.style.borderColor='rgba(100,116,139,.7)'" onmouseleave="this.style.borderColor='rgba(71,85,105,.5)'">
      <i class="fa-solid fa-key" style="font-size:.65rem;"></i> Connexion
    </button>`;
  } else {
    const sc = m.status==='passive' ? {dot:'#fb923c'} : {dot:'#4ade80'};
    rightCTA = `
    <div class="snm-dd-wrap" id="dd-compte-wrap">
      <button onclick="navDD('compte')" style="display:flex;align-items:center;gap:6px;padding:.28rem .7rem .28rem .35rem;border-radius:9999px;cursor:pointer;border:1px solid rgba(71,85,105,.45);background:rgba(15,23,42,.85);transition:all .2s;" onmouseenter="this.style.borderColor='rgba(100,116,139,.7)'" onmouseleave="this.style.borderColor='rgba(71,85,105,.45)'">
        <div style="position:relative;width:26px;height:26px;flex-shrink:0;">
          <div style="width:26px;height:26px;border-radius:50%;background:${GRAD};display:flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:900;color:#020617;">${m.pseudo[0].toUpperCase()}</div>
          <div class="snm-status-dot" style="position:absolute;bottom:-1px;right:-1px;width:9px;height:9px;border-radius:50%;background:${sc.dot};border:1.5px solid rgba(2,6,23,.9);"></div>
        </div>
        <span class="snm-pseudo-lbl" style="font-size:.7rem;font-weight:700;color:#e2e8f0;max-width:75px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${m.pseudo}</span>
        <i class="fa-solid fa-chevron-down snm-chev" id="chev-compte" style="font-size:.58rem;opacity:.5;"></i>
      </button>
      <div class="snm-dd" id="dd-compte" style="min-width:230px;">
        <div style="padding:.8rem 1rem .65rem;border-bottom:1px solid rgba(30,41,59,.7);">
          <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.55rem;">
            <div style="width:36px;height:36px;border-radius:50%;background:${GRAD};display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:900;color:#020617;flex-shrink:0;">${m.pseudo[0].toUpperCase()}</div>
            <div><div style="font-size:.8rem;font-weight:800;color:#fff;">${m.pseudo}</div><div style="font-size:.63rem;color:#64748b;">Rider Smatch ${isEte?'☀️':'❄️'}</div></div>
          </div>
          <div style="display:flex;gap:.4rem;">
            <button onclick="navSetStatus('ready')" style="flex:1;padding:.28rem;border-radius:8px;font-size:.62rem;font-weight:800;cursor:pointer;transition:all .18s;border:1px solid ${m.status==='ready'?'rgba(74,222,128,.5)':'rgba(71,85,105,.3)'};background:${m.status==='ready'?'rgba(74,222,128,.1)':'rgba(15,23,42,.5)'};color:${m.status==='ready'?'#4ade80':'#64748b'};">🟢 Prêt</button>
            <button onclick="navSetStatus('passive')" style="flex:1;padding:.28rem;border-radius:8px;font-size:.62rem;font-weight:800;cursor:pointer;transition:all .18s;border:1px solid ${m.status==='passive'?'rgba(251,146,60,.5)':'rgba(71,85,105,.3)'};background:${m.status==='passive'?'rgba(251,146,60,.1)':'rgba(15,23,42,.5)'};color:${m.status==='passive'?'#fb923c':'#64748b'};">🟠 Passif</button>
          </div>
        </div>
        <div style="padding:.4rem;">
          <button onclick="navGoMonProfil()" class="snm-dd-item" style="background:none;border:none;cursor:pointer;">
            <div class="snm-dd-ico" style="background:${ACB};"><i class="fa-solid fa-user-pen" style="color:${AC};font-size:.7rem;"></i></div>
            <div><div class="snm-dd-lbl">Mon Profil</div><div class="snm-dd-sub">Voir & modifier</div></div>
          </button>
          <button onclick="navGoParametres()" class="snm-dd-item" style="background:none;border:none;cursor:pointer;">
            <div class="snm-dd-ico"><i class="fa-solid fa-gear" style="color:#64748b;font-size:.7rem;"></i></div>
            <div><div class="snm-dd-lbl">Paramètres</div><div class="snm-dd-sub">Notifs, compte, RGPD</div></div>
          </button>
        </div>
        <div style="padding:.3rem .65rem .5rem;border-top:1px solid rgba(30,41,59,.6);">
          <button onclick="navLogout()" class="snm-dd-item" style="background:none;border:none;cursor:pointer;">
            <div class="snm-dd-ico" style="background:rgba(239,68,68,.1);"><i class="fa-solid fa-right-from-bracket" style="color:#f87171;font-size:.7rem;"></i></div>
            <div class="snm-dd-lbl" style="color:#f87171;">Déconnexion</div>
          </button>
        </div>
      </div>
    </div>`;
  }

  // Assemble
  const html = `
  <nav id="snm-nav">
    <div class="snm-inner">
      <a href="accueil.html" class="snm-logo">${logo}</a>
      <div class="snm-center">${pill('Accueil','fa-house-chimney','accueil.html',page==='accueil')}${matchsDD}${dashDD}</div>
      <div class="snm-right">${seasonBtn}${bellBtn}${messageBtn}${rightCTA}</div>
    </div>
  </nav>
  ${navBottomBar(page, AC)}`;

  const mount = document.getElementById('nav-mount');
  if (mount) mount.innerHTML = html;

  navApplySeasonBG(m.mode);
  setTimeout(navApplyAllSettings, 0);

  // Outside-click
  document.removeEventListener('click', _navOutside);
  setTimeout(() => document.addEventListener('click', _navOutside), 0);
}

// ═══════════════════════════════════════════════════════════════════════
//  DROPDOWN ENGINE
// ═══════════════════════════════════════════════════════════════════════
function navDD(id) {
  const menu = document.getElementById('dd-'+id);
  const chev = document.getElementById('chev-'+id);
  if (!menu) return;
  const wasOpen = menu.classList.contains('open');
  document.querySelectorAll('.snm-dd').forEach(d => d.classList.remove('open'));
  document.querySelectorAll('.snm-chev').forEach(c => c.classList.remove('open'));
  if (!wasOpen) { menu.classList.add('open'); if(chev) chev.classList.add('open'); }
}
function _navOutside(e) {
  // Ferme le panneau de notifs si clic en dehors
  const np = document.getElementById('snm-notif-panel');
  if (np && !np.contains(e.target) && !e.target.closest('[onclick*="navToggleNotifs"]')) np.remove();
  // Must check ALL wrappers, not just the first one
  const wraps = document.querySelectorAll('.snm-dd-wrap');
  let inside = false;
  wraps.forEach(w => { if (w.contains(e.target)) inside = true; });
  if (!inside) {
    document.querySelectorAll('.snm-dd').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.snm-chev').forEach(c => c.classList.remove('open'));
  }
}
// Legacy aliases
function navToggleDD(id) { navDD(id); }
function navToggleCompte() { navDD('compte'); }

// ═══════════════════════════════════════════════════════════════════════
//  NAVIGATE TO DASHBOARD  (sets mode + trip before navigating)
// ═══════════════════════════════════════════════════════════════════════
function navGoToDashboard(tripId, mode, url) {
  document.querySelectorAll('.snm-dd').forEach(d => d.classList.remove('open'));
  // Garde d'auth : sans connexion, on bloque et on propose de se connecter
  if (localStorage.getItem('snm_auth') !== '1') {
    try { localStorage.setItem('snm_redirect_after_login', url); } catch (e) {}
    window.location.href = 'accueil.html?login=1&gated=1';
    return;
  }
  NAV_STATE.mode = mode; navSaveState();
  localStorage.setItem('snm_active_trip_id', tripId);
  // Retire le badge "Nouveau !" une fois le crew visité
  try {
    const dbs = JSON.parse(localStorage.getItem('snm_dashboards') || '[]');
    const d = dbs.find(x => x.id === tripId);
    if (d && d.isNew) { delete d.isNew; localStorage.setItem('snm_dashboards', JSON.stringify(dbs)); }
  } catch (e) {}
  if (document.body.dataset.page === 'dashboard') {
    document.body.style.transition = 'opacity .25s ease';
    document.body.style.opacity = '0';
    setTimeout(() => { window.location.href = url; }, 230);
  } else {
    window.location.href = url;
  }
}

// ─── GARDE D'AUTH pour les liens navbar ───────────────────────────────
function navGuard(event, dest) {
  if (localStorage.getItem('snm_auth') === '1') return true; // connecté → laisse passer
  // Pas connecté : bloque le lien, mémorise la destination, ouvre la connexion
  if (event) event.preventDefault();
  try { localStorage.setItem('snm_redirect_after_login', dest); } catch (e) {}
  document.querySelectorAll('.snm-dd').forEach(d => d.classList.remove('open'));
  // Si la modale de login existe sur cette page, on l'ouvre directement
  const modal = document.getElementById('login-modal');
  if (modal) { modal.classList.add('open'); navShowGateBanner(); }
  else window.location.href = 'accueil.html?login=1&gated=1';
  return false;
}

// ═══════════════════════════════════════════════════════════════════════
//  ACTIONS
// ═══════════════════════════════════════════════════════════════════════
function navToggleSeason() {
  NAV_STATE.mode = NAV_STATE.mode === 'hiver' ? 'ete' : 'hiver';
  navSaveState();
  localStorage.setItem('snm_mode', NAV_STATE.mode);
  if (document.body.dataset.page === 'dashboard') {
    document.body.style.transition = 'opacity .28s ease';
    document.body.style.opacity = '0';
    setTimeout(() => { window.location.href = 'accueil.html'; }, 250);
    return;
  }
  // Sur la page Matchs : charge la recherche de la nouvelle saison, ou redirige vers Accueil
  if (document.body.dataset.page === 'matchs') {
    const saved = localStorage.getItem('snm_search_' + NAV_STATE.mode);
    if (saved) {
      try {
        const s = JSON.parse(saved);
        localStorage.setItem('snm_activite', s.activite);
        localStorage.setItem('snm_act_name', s.act_name);
        localStorage.setItem('snm_act_icon', s.act_icon);
        localStorage.setItem('snm_dispo_type', s.dispo_type);
        localStorage.setItem('snm_lieu', s.lieu || '');
        localStorage.setItem('snm_date_from', s.date_from || '');
        localStorage.setItem('snm_date_to', s.date_to || '');
      } catch (e) {}
      document.body.style.transition = 'opacity .25s ease';
      document.body.style.opacity = '0';
      setTimeout(() => window.location.reload(), 230);
    } else {
      // Pas de recherche pour cette saison → retour à l'accueil
      if (typeof showToast === 'function') showToast('🔍 Lance une recherche ' + (NAV_STATE.mode==='ete'?'été ☀️':'hiver ❄️'));
      document.body.style.transition = 'opacity .25s ease';
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = 'accueil.html'; }, 250);
    }
    return;
  }
  navRender();
  if (typeof onSeasonChange === 'function') onSeasonChange(NAV_STATE.mode);
}
function navSetStatus(s) {
  NAV_STATE.status = s; navSaveState(); navRender();
  setTimeout(() => navDD('compte'), 10);
  navSyncDashboardStatus(s);
  if (typeof showToast === 'function') showToast(s==='ready'?'🟢 Prêt à rider !':'🟠 Mode passif');
}

// Synchronise le statut sur le dashboard (point avatar + badge crew)
function navSyncDashboardStatus(s) {
  const showOnline = (localStorage.getItem('snm_setting_show_online') !== '0');
  // Dashboard hiver : re-render JS des membres
  if (typeof renderMembers === 'function') {
    try { renderMembers(); } catch (e) {}
  }
  // Dashboard été (HTML statique) : maj directe du DOM
  const dot = document.getElementById('self-status-dot');
  if (dot) {
    dot.classList.remove('bg-emerald-400','bg-amber-500');
    dot.classList.add(s === 'ready' ? 'bg-emerald-400' : 'bg-amber-500');
    dot.style.display = showOnline ? '' : 'none';
  }
  const badge = document.getElementById('crew-status-badge');
  const label = document.getElementById('crew-status-label');
  if (badge && label) {
    badge.style.color = s === 'ready' ? '#4ade80' : '#fb923c';
    label.textContent = s === 'ready' ? '🟢 Prêt' : '🟠 Passif';
    const liveDot = badge.querySelector('.live-dot');
    if (liveDot) {
      liveDot.classList.remove('bg-emerald-400','bg-amber-500');
      liveDot.classList.add(s === 'ready' ? 'bg-emerald-400' : 'bg-amber-500');
    }
  }
  // Si la modale de profil "toi" est ouverte, on met à jour son point aussi
  const modalAv = document.getElementById('modal-avatar');
  if (modalAv && typeof currentMember !== 'undefined' && currentMember === 'R') {
    const d = modalAv.querySelector('div');
    if (d) {
      d.classList.remove('bg-emerald-400','bg-amber-500');
      d.classList.add(s === 'ready' ? 'bg-emerald-400' : 'bg-amber-500');
    }
  }
}
function navOpenLogin() {
  document.querySelectorAll('.snm-dd').forEach(d => d.classList.remove('open'));
  const modal = document.getElementById('login-modal');
  if (modal) { modal.classList.add('open'); return; }
  window.location.href = 'accueil.html?login=1';
}
function navGoMonProfil() {
  document.querySelectorAll('.snm-dd').forEach(d => d.classList.remove('open'));
  if (typeof openProfile === 'function') { openProfile('R'); return; }
  navOpenProfilModal();
}
function navGoParametres() {
  document.querySelectorAll('.snm-dd').forEach(d => d.classList.remove('open'));
  navOpenParamsModal();
}
function navLogout() {
  NAV_STATE.loggedIn = false; navSaveState();
  window.location.href = 'accueil.html';
}
function navLoginSuccess(pseudo) {
  NAV_STATE.loggedIn = true; NAV_STATE.pseudo = pseudo || 'RiderDu74'; navSaveState(); navRender();
  const modal = document.getElementById('login-modal'); if(modal) modal.classList.remove('open');
  // Reviens à la page que l'utilisateur voulait, sinon recherche
  let dest = 'recherche.html';
  try {
    const saved = localStorage.getItem('snm_redirect_after_login');
    if (saved) { dest = saved; localStorage.removeItem('snm_redirect_after_login'); }
  } catch (e) {}
  setTimeout(() => { window.location.href = dest; }, 300);
}

// ═══════════════════════════════════════════════════════════════════════
//  MON PROFIL MODAL
// ═══════════════════════════════════════════════════════════════════════
function navOpenProfilModal() {
  const existing = document.getElementById('snm-profil-modal');
  if (existing) { existing.style.display='flex'; return; }
  const isEte=NAV_STATE.mode==='ete', AC=isEte?'#fbbf24':'#22d3ee';
  const GRAD=isEte?'linear-gradient(135deg,#fbbf24,#f97316)':'linear-gradient(135deg,#22d3ee,#3b82f6)';
  const ACB=isEte?'rgba(251,191,36,.12)':'rgba(34,211,238,.12)';
  const pseudo=NAV_STATE.pseudo, sc=NAV_STATE.status==='passive'?{dot:'#fb923c',label:'🟠 Passif'}:{dot:'#4ade80',label:'🟢 Prêt'};
  const storedBio=localStorage.getItem('snm_bio')||'Passionné de glisse, amateur de raclette et d\'après-ski.';
  const storedVille=localStorage.getItem('snm_ville')||'Annecy';
  const storedAge=localStorage.getItem('snm_age')||'26';
  const div=document.createElement('div'); div.id='snm-profil-modal'; div.className='snm-modal-overlay'; div.setAttribute('role','dialog'); div.setAttribute('aria-modal','true');
  div.addEventListener('click',e=>{if(e.target===div)div.style.display='none';});
  div.innerHTML=`<div class="snm-modal-box" style="max-width:460px;border:1px solid ${AC}28;">
    <div style="padding:1.4rem 1.4rem 1rem;border-bottom:1px solid rgba(30,41,59,.7);">
      <div style="display:flex;align-items:flex-start;gap:1rem;">
        <div style="position:relative;flex-shrink:0;"><div style="width:64px;height:64px;border-radius:18px;background:${GRAD};display:flex;align-items:center;justify-content:center;font-size:1.7rem;font-weight:900;color:#020617;">${pseudo[0].toUpperCase()}</div><div style="position:absolute;bottom:-2px;right:-2px;width:14px;height:14px;border-radius:50%;background:${sc.dot};border:2px solid rgba(10,15,30,.95);"></div></div>
        <div style="flex-grow:1;"><div id="snm-prf-name" style="font-size:1.25rem;font-weight:800;color:#fff;margin-bottom:.2rem;">${pseudo}</div><div style="font-size:.7rem;color:#475569;margin-bottom:.45rem;">Rider Smatch ${isEte?'☀️':'❄️'} · ${sc.label}</div><div style="display:flex;gap:.4rem;flex-wrap:wrap;"><span style="font-size:.65rem;font-weight:700;padding:.18rem .65rem;border-radius:9999px;background:${ACB};border:1px solid ${AC}33;color:${AC};">${isEte?'🏄 Surf':'🏂 Snowboard'}</span><span style="font-size:.65rem;font-weight:700;padding:.18rem .65rem;border-radius:9999px;background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.2);color:#34d399;">${storedVille}</span></div></div>
        <button onclick="document.getElementById('snm-profil-modal').style.display='none'" style="color:#475569;background:none;border:none;cursor:pointer;font-size:1.05rem;" onmouseenter="this.style.color='#fff'" onmouseleave="this.style.color='#475569'" aria-label="Fermer"><i class="fa-solid fa-xmark"></i></button>
      </div>
    </div>
    <div id="snm-prf-view" style="padding:1.2rem;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.55rem;margin-bottom:1rem;">
        <div class="snm-card2" style="padding:.75rem;text-align:center;"><div class="snm-label" style="margin:0 0 .15rem;">Discipline</div><div style="font-size:.82rem;font-weight:700;color:#fff;">${isEte?'🏄 Surf':'🏂 Snowboard'}</div></div>
        <div class="snm-card2" style="padding:.75rem;text-align:center;"><div class="snm-label" style="margin:0 0 .15rem;">Ville</div><div id="snm-prf-ville-d" style="font-size:.82rem;font-weight:700;color:#fff;">${storedVille}</div></div>
        <div class="snm-card2" style="padding:.75rem;text-align:center;"><div class="snm-label" style="margin:0 0 .15rem;">Âge</div><div id="snm-prf-age-d" style="font-size:.82rem;font-weight:700;color:#fff;">${storedAge} ans</div></div>
        <div class="snm-card2" style="padding:.75rem;text-align:center;"><div class="snm-label" style="margin:0 0 .15rem;">Statut</div><div style="font-size:.82rem;font-weight:700;">${sc.label}</div></div>
      </div>
      <div id="snm-prf-bio-d" class="snm-card2" style="padding:1rem;font-size:.8rem;color:#94a3b8;line-height:1.65;margin-bottom:1rem;">${storedBio}</div>
      <div id="snm-prf-adventurer"></div>
      <button onclick="navProfilEdit()" style="width:100%;margin-top:1rem;background:rgba(30,41,59,.65);border:1px solid rgba(71,85,105,.4);border-radius:12px;padding:.6rem;font-size:.73rem;font-weight:700;color:#94a3b8;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.45rem;transition:all .15s;" onmouseenter="this.style.background='rgba(30,41,59,.9)';this.style.color='#e2e8f0'" onmouseleave="this.style.background='rgba(30,41,59,.65)';this.style.color='#94a3b8'"><i class="fa-solid fa-pen-to-square"></i> Modifier mon profil</button>
    </div>
    <div id="snm-prf-edit" style="padding:1.2rem;display:none;">
      <div style="font-size:.6rem;font-weight:800;color:${AC};text-transform:uppercase;letter-spacing:.06em;margin-bottom:.85rem;">✏️ Mode Édition</div>
      <div style="margin-bottom:.75rem;"><label class="snm-label">Pseudo</label><input id="snm-edit-pseudo" class="snm-input" type="text" value="${pseudo}" onfocus="this.style.borderColor='${AC}'" onblur="this.style.borderColor='rgba(71,85,105,.5)'"></div>
      <div style="margin-bottom:.75rem;"><label class="snm-label">Bio</label><textarea id="snm-edit-bio" class="snm-input" rows="3" style="resize:none;" onfocus="this.style.borderColor='${AC}'" onblur="this.style.borderColor='rgba(71,85,105,.5)'">${storedBio}</textarea></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.6rem;margin-bottom:1rem;">
        <div><label class="snm-label">Ville</label><input id="snm-edit-ville" class="snm-input" value="${storedVille}" onfocus="this.style.borderColor='${AC}'" onblur="this.style.borderColor='rgba(71,85,105,.5)'"></div>
        <div><label class="snm-label">Âge</label><input id="snm-edit-age" class="snm-input" type="number" value="${storedAge}" onfocus="this.style.borderColor='${AC}'" onblur="this.style.borderColor='rgba(71,85,105,.5)'"></div>
      </div>
      <div style="display:flex;gap:.55rem;">
        <button onclick="navProfilSave()" style="flex:1;background:${GRAD};color:#020617;font-weight:800;font-size:.8rem;padding:.65rem;border-radius:12px;border:none;cursor:pointer;" onmouseenter="this.style.opacity='.85'" onmouseleave="this.style.opacity='1'"><i class="fa-solid fa-check"></i> Sauvegarder</button>
        <button onclick="navProfilCancelEdit()" style="flex:1;background:rgba(30,41,59,.65);border:1px solid rgba(71,85,105,.4);color:#94a3b8;font-weight:700;font-size:.8rem;padding:.65rem;border-radius:12px;cursor:pointer;" onmouseenter="this.style.background='rgba(30,41,59,.9)'" onmouseleave="this.style.background='rgba(30,41,59,.65)'">Annuler</button>
      </div>
    </div>
  </div>`;
  document.body.appendChild(div);
  // Section profil d'aventurier (identique aux dashboards) pour "R" = toi
  renderAdventurerSection('snm-prf-adventurer', 'R', AC);
}
function navProfilEdit(){document.getElementById('snm-prf-view').style.display='none';document.getElementById('snm-prf-edit').style.display='';}
function navProfilCancelEdit(){document.getElementById('snm-prf-edit').style.display='none';document.getElementById('snm-prf-view').style.display='';}
function navProfilSave(){
  const pseudo=document.getElementById('snm-edit-pseudo')?.value.trim()||NAV_STATE.pseudo;
  const bio=document.getElementById('snm-edit-bio')?.value.trim()||'';
  const ville=document.getElementById('snm-edit-ville')?.value.trim()||'';
  const age=document.getElementById('snm-edit-age')?.value||'';
  NAV_STATE.pseudo=pseudo; navSaveState();
  localStorage.setItem('snm_bio',bio); localStorage.setItem('snm_ville',ville); localStorage.setItem('snm_age',age);
  const nm=document.getElementById('snm-prf-name'); if(nm) nm.textContent=pseudo;
  const bd=document.getElementById('snm-prf-bio-d'); if(bd) bd.textContent=bio;
  const vd=document.getElementById('snm-prf-ville-d'); if(vd) vd.textContent=ville;
  const ad=document.getElementById('snm-prf-age-d'); if(ad) ad.textContent=age+' ans';
  navProfilCancelEdit(); navRender();
  if(typeof showToast==='function') showToast('✓ Profil mis à jour !');
}

// ═══════════════════════════════════════════════════════════════════════
//  PARAMÈTRES MODAL
// ═══════════════════════════════════════════════════════════════════════
function navOpenParamsModal(){
  const existing=document.getElementById('snm-params-modal');
  if(existing){existing.style.display='flex';return;}
  const isEte=NAV_STATE.mode==='ete', AC=isEte?'#fbbf24':'#22d3ee';
  const GRAD=isEte?'linear-gradient(135deg,#fbbf24,#f97316)':'linear-gradient(135deg,#22d3ee,#3b82f6)';
  const mkT=(id,label,sub,def)=>{
    const on=localStorage.getItem('snm_setting_'+id)===null?def:localStorage.getItem('snm_setting_'+id)==='1';
    return `<div style="display:flex;align-items:center;justify-content:space-between;padding:.85rem .9rem;border-radius:14px;background:rgba(5,8,20,.6);">
      <div style="min-width:0;padding-right:.5rem;"><div style="font-size:.78rem;font-weight:700;color:#e2e8f0;">${label}</div><div style="font-size:.63rem;color:#475569;margin-top:.12rem;">${sub}</div></div>
      <div onclick="navToggleSetting('${id}',this)" data-on="${on?'1':'0'}" style="position:relative;width:42px;height:24px;border-radius:9999px;cursor:pointer;transition:background .25s;flex-shrink:0;background:${on?AC:'rgba(71,85,105,.4)'};">
        <div style="position:absolute;top:3px;left:${on?'19':'3'}px;width:18px;height:18px;border-radius:50%;background:#fff;transition:left .25s;box-shadow:0 1px 4px rgba(0,0,0,.4);"></div>
      </div>
    </div>`;
  };
  const sec=(title,content)=>`<div style="margin-bottom:1rem;"><div style="font-size:.6rem;font-weight:800;color:#334155;text-transform:uppercase;letter-spacing:.06em;margin-bottom:.45rem;">${title}</div><div style="display:flex;flex-direction:column;gap:.35rem;">${content}</div></div>`;
  const div=document.createElement('div'); div.id='snm-params-modal'; div.className='snm-modal-overlay'; div.setAttribute('role','dialog'); div.setAttribute('aria-modal','true');
  div.addEventListener('click',e=>{if(e.target===div)div.style.display='none';});
  div.innerHTML=`<div class="snm-modal-box" style="max-width:480px;border:1px solid ${AC}28;">
    <div style="padding:1.2rem;border-bottom:1px solid rgba(30,41,59,.7);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:rgba(10,15,30,.98);z-index:1;">
      <div><div style="font-size:.58rem;font-weight:800;color:${AC};text-transform:uppercase;letter-spacing:.06em;margin-bottom:.15rem;">Configuration</div><div style="font-size:1rem;font-weight:800;color:#fff;">⚙️ Paramètres</div></div>
      <button onclick="document.getElementById('snm-params-modal').style.display='none'" style="color:#475569;background:none;border:none;cursor:pointer;font-size:1rem;" onmouseenter="this.style.color='#fff'" onmouseleave="this.style.color='#475569'" aria-label="Fermer"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div style="padding:1rem 1.1rem 1.4rem;">
      ${sec('👁️ Visibilité & Matching',mkT('visible_matchs','Apparaître dans les résultats','Les autres riders peuvent te trouver',true)+mkT('notifs_merge','Notifications de merge','Alerté quand quelqu\'un veut merger',true)+mkT('show_phone','Afficher mon numéro','Visible par les membres du crew',false)+mkT('show_online','Afficher mon statut','Les autres voient si tu es connecté',true))}
      ${sec('🌍 Saison active',`<div style="padding:.85rem .9rem;border-radius:14px;background:rgba(5,8,20,.6);"><div style="font-size:.78rem;font-weight:700;color:#e2e8f0;margin-bottom:.5rem;">Mode actuel</div><div style="display:flex;gap:.4rem;"><button onclick="navSetSeasonParam('hiver')" style="flex:1;padding:.48rem;border-radius:10px;font-size:.7rem;font-weight:700;cursor:pointer;border:1px solid ${!isEte?'rgba(34,211,238,.5)':'rgba(71,85,105,.3)'};background:${!isEte?'rgba(34,211,238,.1)':'rgba(15,23,42,.5)'};color:${!isEte?'#22d3ee':'#64748b'};">❄️ Hiver — SnowMatch</button><button onclick="navSetSeasonParam('ete')" style="flex:1;padding:.48rem;border-radius:10px;font-size:.7rem;font-weight:700;cursor:pointer;border:1px solid ${isEte?'rgba(251,191,36,.5)':'rgba(71,85,105,.3)'};background:${isEte?'rgba(251,191,36,.1)':'rgba(15,23,42,.5)'};color:${isEte?'#fbbf24':'#64748b'};">☀️ Été — SunMatch</button></div></div>`)}
      ${sec('🔔 Notifications',mkT('notif_matchs','Nouveaux matchs','Alerté quand de nouveaux profils correspondent',true)+mkT('notif_messages','Messages crew','Notifications du chat de groupe',true)+mkT('notif_meteo','Alertes météo','Conditions de glisse pour tes dates',false)+mkT('notif_rdv','Rappels d\'activités','Notification 24h avant chaque étape',true))}
      ${sec('🔐 Compte & Données',`
        <button onclick="navOpenChangePw();document.getElementById('snm-params-modal').style.display='none';" class="snm-dd-item" style="background:rgba(5,8,20,.6);border-radius:14px;border:none;cursor:pointer;"><div class="snm-dd-ico"><i class="fa-solid fa-lock" style="color:#94a3b8;font-size:.7rem;"></i></div><div style="flex-grow:1;text-align:left;"><div class="snm-dd-lbl">Changer de mot de passe</div><div class="snm-dd-sub" id="snm-pw-last">Dernière modif : ${localStorage.getItem('snm_pw_date')||'jamais'}</div></div><i class="fa-solid fa-chevron-right" style="color:#334155;font-size:.7rem;"></i></button>
        <button onclick="navExportData(this)" class="snm-dd-item" style="background:rgba(5,8,20,.6);border-radius:14px;border:none;cursor:pointer;"><div class="snm-dd-ico"><i class="fa-solid fa-download" style="color:#94a3b8;font-size:.7rem;" id="snm-export-icon"></i></div><div style="flex-grow:1;text-align:left;"><div class="snm-dd-lbl">Exporter mes données</div><div class="snm-dd-sub">RGPD — télécharger tout (JSON)</div></div></button>
        <button onclick="navLogout()" class="snm-dd-item" style="background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.2);border-radius:14px;cursor:pointer;border-left:none;border-right:none;border-top:none;"><div class="snm-dd-ico" style="background:rgba(239,68,68,.1);"><i class="fa-solid fa-right-from-bracket" style="color:#f87171;font-size:.7rem;"></i></div><div class="snm-dd-lbl" style="color:#f87171;">Déconnexion</div></button>
      `)}
    </div>
  </div>`;
  document.body.appendChild(div);
}
function navToggleSetting(id,el){
  const on=el.dataset.on==='1';
  el.dataset.on=on?'0':'1';
  const AC=NAV_STATE.mode==='ete'?'#fbbf24':'#22d3ee';
  el.style.background=on?'rgba(71,85,105,.4)':AC;
  const th=el.querySelector('div');if(th)th.style.left=on?'3px':'19px';
  const newVal = on ? '0' : '1';
  localStorage.setItem('snm_setting_'+id, newVal);
  // Applique l'effet réel du paramètre + feedback
  navApplySetting(id, newVal === '1');
}

// Helper global : lit un paramètre (avec défaut)
function smatchGetSetting(id, def) {
  const v = localStorage.getItem('snm_setting_'+id);
  return v === null ? def : v === '1';
}

// Applique l'effet concret d'un paramètre
function navApplySetting(id, enabled) {
  const labels = {
    visible_matchs: enabled ? '👁️ Tu apparais dans les résultats' : '🙈 Tu es masqué des résultats',
    notifs_merge:   enabled ? '🔔 Notifications de merge activées' : '🔕 Notifications de merge coupées',
    show_phone:     enabled ? '📞 Ton numéro est visible par ton crew' : '🔒 Ton numéro est masqué',
    show_online:    enabled ? '🟢 Ton statut en ligne est visible' : '⚫ Statut en ligne masqué',
    notif_matchs:   enabled ? '🔔 Alertes nouveaux matchs ON' : '🔕 Alertes nouveaux matchs OFF',
    notif_messages: enabled ? '💬 Notifications messages ON' : '🔕 Notifications messages OFF',
    notif_meteo:    enabled ? '🌨️ Alertes météo activées' : '🔕 Alertes météo coupées',
    notif_rdv:      enabled ? '📅 Rappels d\'activités ON' : '🔕 Rappels d\'activités OFF',
  };
  if (typeof showToast === 'function' && labels[id]) showToast(labels[id]);

  // Effets visuels immédiats
  switch (id) {
    case 'show_online':
      // Masque/affiche le point de statut sur l'avatar navbar
      document.querySelectorAll('.snm-status-dot').forEach(d => {
        d.style.display = enabled ? '' : 'none';
      });
      // Sur le dashboard aussi
      const selfDot = document.getElementById('self-status-dot');
      if (selfDot) selfDot.style.display = enabled ? '' : 'none';
      break;
    case 'visible_matchs':
      // Badge "masqué" sur le profil
      break;
    case 'notifs_merge':
    case 'notif_matchs':
      // Re-render navbar pour afficher/cacher le badge de notif
      navRender();
      break;
  }
}

// Applique tous les paramètres au chargement (effets persistants)
function navApplyAllSettings() {
  // show_online → visibilité des points de statut
  const showOnline = smatchGetSetting('show_online', true);
  if (!showOnline) {
    document.querySelectorAll('.snm-status-dot').forEach(d => d.style.display = 'none');
    const selfDot = document.getElementById('self-status-dot');
    if (selfDot) selfDot.style.display = 'none';
  }
}
function navSetSeasonParam(mode){NAV_STATE.mode=mode;navSaveState();const m=document.getElementById('snm-params-modal');if(m)m.remove();navRender();if(typeof onSeasonChange==='function')onSeasonChange(mode);}

// ═══════════════════════════════════════════════════════════════════════
//  CHANGER MOT DE PASSE
// ═══════════════════════════════════════════════════════════════════════
function navOpenChangePw(){
  const existing=document.getElementById('snm-pw-modal');if(existing)existing.remove();
  const AC=NAV_STATE.mode==='ete'?'#fbbf24':'#22d3ee';
  const GRAD=NAV_STATE.mode==='ete'?'linear-gradient(135deg,#fbbf24,#f97316)':'linear-gradient(135deg,#22d3ee,#3b82f6)';
  const div=document.createElement('div');div.id='snm-pw-modal';div.className='snm-modal-overlay'; div.setAttribute('role','dialog'); div.setAttribute('aria-modal','true');
  div.addEventListener('click',e=>{if(e.target===div)div.remove();});
  div.innerHTML=`<div class="snm-modal-box" style="max-width:380px;border:1px solid ${AC}28;">
    <div style="padding:1.1rem;border-bottom:1px solid rgba(30,41,59,.7);display:flex;align-items:center;justify-content:space-between;"><div><div style="font-size:.57rem;font-weight:800;color:${AC};text-transform:uppercase;letter-spacing:.06em;margin-bottom:.12rem;">Sécurité</div><div style="font-size:.95rem;font-weight:800;color:#fff;">🔐 Changer mon mot de passe</div></div><button onclick="document.getElementById('snm-pw-modal').remove()" style="color:#475569;background:none;border:none;cursor:pointer;font-size:1rem;" onmouseenter="this.style.color='#fff'" onmouseleave="this.style.color='#475569'" aria-label="Fermer"><i class="fa-solid fa-xmark"></i></button></div>
    <div style="padding:1.1rem;" id="snm-pw-body">
      <div style="margin-bottom:.7rem;"><label class="snm-label">Mot de passe actuel</label><div style="position:relative;"><input id="snm-pw-old" class="snm-input" type="password" placeholder="••••••••" style="padding-right:2.2rem;" onfocus="this.style.borderColor='${AC}'" onblur="this.style.borderColor='rgba(71,85,105,.5)'"><i class="fa-solid fa-eye" onclick="navTogglePwField('snm-pw-old',this)" style="position:absolute;right:.7rem;top:50%;transform:translateY(-50%);color:#475569;cursor:pointer;font-size:.78rem;"></i></div></div>
      <div style="margin-bottom:.7rem;"><label class="snm-label">Nouveau mot de passe</label><div style="position:relative;"><input id="snm-pw-new" class="snm-input" type="password" placeholder="Min. 8 caractères" oninput="navPwStrength(this.value)" style="padding-right:2.2rem;" onfocus="this.style.borderColor='${AC}'" onblur="this.style.borderColor='rgba(71,85,105,.5)'"><i class="fa-solid fa-eye" onclick="navTogglePwField('snm-pw-new',this)" style="position:absolute;right:.7rem;top:50%;transform:translateY(-50%);color:#475569;cursor:pointer;font-size:.78rem;"></i></div><div style="height:3px;background:rgba(71,85,105,.25);border-radius:9999px;margin-top:.35rem;overflow:hidden;"><div id="snm-pw-bar" style="height:100%;width:0;border-radius:9999px;transition:width .3s,background .3s;"></div></div><div id="snm-pw-str" style="font-size:.6rem;color:#475569;margin-top:.18rem;height:.9rem;"></div></div>
      <div style="margin-bottom:.9rem;"><label class="snm-label">Confirmer</label><div style="position:relative;"><input id="snm-pw-confirm" class="snm-input" type="password" placeholder="••••••••" style="padding-right:2.2rem;" onfocus="this.style.borderColor='${AC}'" onblur="this.style.borderColor='rgba(71,85,105,.5)'"><i class="fa-solid fa-eye" onclick="navTogglePwField('snm-pw-confirm',this)" style="position:absolute;right:.7rem;top:50%;transform:translateY(-50%);color:#475569;cursor:pointer;font-size:.78rem;"></i></div></div>
      <div id="snm-pw-err" style="display:none;font-size:.72rem;color:#f87171;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:10px;padding:.55rem .8rem;margin-bottom:.75rem;"></div>
      <button onclick="navSavePw()" style="width:100%;background:${GRAD};color:#020617;font-weight:800;font-size:.82rem;padding:.68rem;border-radius:12px;border:none;cursor:pointer;transition:opacity .15s;" onmouseenter="this.style.opacity='.85'" onmouseleave="this.style.opacity='1'"><i class="fa-solid fa-lock"></i> Mettre à jour</button>
    </div>
  </div>`;
  document.body.appendChild(div);
}
function navTogglePwField(id,icon){const i=document.getElementById(id);if(!i)return;i.type=i.type==='password'?'text':'password';icon.className=i.type==='password'?'fa-solid fa-eye':'fa-solid fa-eye-slash';}
function navPwStrength(val){const bar=document.getElementById('snm-pw-bar'),txt=document.getElementById('snm-pw-str');if(!bar||!txt)return;let s=0;if(val.length>=8)s++;if(/[A-Z]/.test(val))s++;if(/[0-9]/.test(val))s++;if(/[^A-Za-z0-9]/.test(val))s++;const cfg=[null,{w:'25%',c:'#f87171',l:'Trop faible'},{w:'50%',c:'#fb923c',l:'Moyen'},{w:'75%',c:'#fbbf24',l:'Bien'},{w:'100%',c:'#4ade80',l:'Excellent 💪'}];const r=cfg[s]||{w:'0%',c:'transparent',l:''};bar.style.width=r.w;bar.style.background=r.c;txt.textContent=r.l;txt.style.color=r.c;}
function navSavePw(){
  const o=document.getElementById('snm-pw-old')?.value,n=document.getElementById('snm-pw-new')?.value,c=document.getElementById('snm-pw-confirm')?.value,errEl=document.getElementById('snm-pw-err');
  const AC=NAV_STATE.mode==='ete'?'#fbbf24':'#22d3ee';errEl.style.display='none';
  const err=(msg)=>{errEl.textContent=msg;errEl.style.display='block';};
  if(!o)return err('Saisis ton mot de passe actuel.');
  if(o!==(localStorage.getItem('snm_pw')||'password123'))return err('Mot de passe actuel incorrect.');
  if(!n||n.length<8)return err('Minimum 8 caractères.');
  if(n!==c)return err('Les deux mots de passe ne correspondent pas.');
  localStorage.setItem('snm_pw',n);const now=new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});localStorage.setItem('snm_pw_date',now);
  document.getElementById('snm-pw-body').innerHTML=`<div style="text-align:center;padding:2rem;"><div style="font-size:3rem;margin-bottom:.7rem;">✅</div><div style="font-size:.95rem;font-weight:800;color:#fff;margin-bottom:.3rem;">Mot de passe mis à jour !</div><div style="font-size:.7rem;color:#475569;margin-bottom:1.3rem;">Modifié le ${now}</div><button onclick="document.getElementById('snm-pw-modal').remove()" style="background:linear-gradient(135deg,${AC},${AC}88);color:#020617;font-weight:800;font-size:.8rem;padding:.6rem 2rem;border-radius:12px;border:none;cursor:pointer;">Fermer</button></div>`;
}
function navExportData(btn){
  const data={exportDate:new Date().toISOString(),pseudo:NAV_STATE.pseudo,mode:NAV_STATE.mode,status:NAV_STATE.status,profil:{ville:localStorage.getItem('snm_ville')||'',age:localStorage.getItem('snm_age')||'',bio:localStorage.getItem('snm_bio')||''},dashboards:JSON.parse(localStorage.getItem('snm_dashboards')||'[]'),mergeRequests:JSON.parse(localStorage.getItem('snm_merge_requests')||'[]')};
  const a=Object.assign(document.createElement('a'),{href:URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),download:`smatch_${NAV_STATE.pseudo}_${new Date().toISOString().slice(0,10)}.json`});
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  if(btn){const icon=btn.querySelector('#snm-export-icon');if(icon){const orig=icon.className;icon.className='fa-solid fa-check';icon.style.color='#4ade80';setTimeout(()=>{icon.className=orig;icon.style.color='';},2500);}}
}

// ═══════════════════════════════════════════════════════════════════════
//  DEMANDES MODAL
// ═══════════════════════════════════════════════════════════════════════
function navOpenDemandesModal(){
  document.querySelectorAll('.snm-dd').forEach(d=>d.classList.remove('open'));
  if (localStorage.getItem('snm_auth') !== '1') { navGuard(null, 'resultats.html'); return; }
  const existing=document.getElementById('snm-demandes-modal');if(existing)existing.remove();
  const AC=NAV_STATE.mode==='ete'?'#fbbf24':'#22d3ee';
  // N'affiche que les vraies demandes (plus de seed qui pollue)
  let reqs = (typeof SmatchMerge!=='undefined') ? SmatchMerge.all() : [];
  const div=document.createElement('div');div.id='snm-demandes-modal';div.className='snm-modal-overlay'; div.setAttribute('role','dialog'); div.setAttribute('aria-modal','true');
  div.addEventListener('click',e=>{if(e.target===div)div.remove();});
  div.innerHTML=`<div class="snm-modal-box" style="max-width:420px;border:1px solid ${AC}28;"><div style="padding:1.15rem;border-bottom:1px solid rgba(30,41,59,.7);display:flex;align-items:center;justify-content:space-between;"><div><div style="font-size:.57rem;font-weight:800;color:${AC};text-transform:uppercase;letter-spacing:.06em;margin-bottom:.12rem;">Tunnel de fusion</div><div style="font-size:.95rem;font-weight:800;color:#fff;">⚡ Mes Demandes</div></div><div style="display:flex;align-items:center;gap:.6rem;"><button onclick="navClearAllDemandes()" title="Tout effacer" style="font-size:.64rem;color:#64748b;background:none;border:none;cursor:pointer;" onmouseenter="this.style.color='#f87171'" onmouseleave="this.style.color='#64748b'">Tout effacer</button><button onclick="document.getElementById('snm-demandes-modal').remove()" style="color:#475569;background:none;border:none;cursor:pointer;font-size:1rem;" aria-label="Fermer"><i class="fa-solid fa-xmark"></i></button></div></div><div id="snm-demandes-list" style="padding:.75rem;max-height:70vh;overflow-y:auto;"></div></div>`;
  document.body.appendChild(div);navRenderDemandes();
}

// Vide toutes les demandes
function navClearAllDemandes(){
  if(typeof SmatchMerge!=='undefined') SmatchMerge.save([]);
  navRenderDemandes(); navRender();
  if(typeof showToast==='function') showToast('🗑️ Demandes effacées');
}
// Supprime une demande précise
function navDeleteReq(id){
  if(typeof SmatchMerge==='undefined')return;
  const list=SmatchMerge.all().filter(r=>r.id!==id);
  SmatchMerge.save(list);
  navRenderDemandes(); navRender();
}

function navRenderDemandes(){
  const el=document.getElementById('snm-demandes-list');if(!el)return;
  const AC=NAV_STATE.mode==='ete'?'#fbbf24':'#22d3ee';
  // Débloque les demandes restées "en attente" (l'autre finit toujours par accepter)
  if(typeof SmatchMerge!=='undefined'){
    SmatchMerge.all().forEach(r=>{
      if(r.status==='pending'){
        const age=Date.now()-(r.createdAt||0);
        if(age>4000){ SmatchMerge.update(r.id,{status:'accepted',time:'À l\'instant'}); }
      }
    });
  }
  const reqs = (typeof SmatchMerge!=='undefined') ? SmatchMerge.all() : [];
  const card = (r)=>{
    // Étape selon le statut
    let footer='';
    if(r.status==='pending'){
      footer=`<div style="display:flex;align-items:center;gap:.4rem;font-size:.65rem;font-weight:700;color:#f59e0b;"><span style="width:7px;height:7px;border-radius:50%;background:#f59e0b;" class="live-dot"></span> En attente ⏳</div>`;
    } else if(r.status==='accepted'){
      footer=`<button onclick="navOpenNegoChat('${r.id}')" style="width:100%;margin-top:.5rem;background:${AC};color:#020617;font-weight:800;font-size:.72rem;padding:.5rem;border-radius:10px;border:none;cursor:pointer;"><i class="fa-solid fa-comments"></i> Discuter & valider le trip</button>`;
    } else if(r.status==='negotiating'){
      const meOk=r.meConfirmed, themOk=r.themConfirmed;
      footer=`<div style="margin-top:.5rem;display:flex;flex-direction:column;gap:.4rem;">
        <div style="display:flex;gap:.5rem;font-size:.6rem;font-weight:700;">
          <span style="flex:1;text-align:center;padding:.25rem;border-radius:7px;background:${meOk?'rgba(74,222,128,.15)':'rgba(71,85,105,.15)'};color:${meOk?'#4ade80':'#64748b'};">${meOk?'✓ Toi':'Toi'}</span>
          <span style="flex:1;text-align:center;padding:.25rem;border-radius:7px;background:${themOk?'rgba(74,222,128,.15)':'rgba(71,85,105,.15)'};color:${themOk?'#4ade80':'#64748b'};">${themOk?'✓ '+r.from:r.from}</span>
        </div>
        <div style="display:flex;gap:.4rem;">
          <button onclick="navOpenNegoChat('${r.id}')" style="flex:1;background:rgba(30,41,59,.7);border:1px solid rgba(71,85,105,.4);color:#cbd5e1;font-weight:700;font-size:.68rem;padding:.45rem;border-radius:9px;cursor:pointer;"><i class="fa-solid fa-comments"></i> Chat</button>
          <button onclick="navUnionChoice('${r.id}')" ${meOk?'disabled':''} style="flex:1.4;background:${meOk?'rgba(71,85,105,.3)':'linear-gradient(135deg,#4ade80,#16a34a)'};color:${meOk?'#64748b':'#020617'};font-weight:800;font-size:.68rem;padding:.45rem;border-radius:9px;border:none;cursor:${meOk?'default':'pointer'};">${meOk?'En attente…':'🤝 Confirmer l\'Union'}</button>
        </div>
      </div>`;
    } else if(r.status==='united'){
      footer=`<button onclick="navGoToCrew('${r.tripId}','${r.mode}')" style="width:100%;margin-top:.5rem;background:linear-gradient(135deg,#4ade80,#16a34a);color:#020617;font-weight:800;font-size:.72rem;padding:.5rem;border-radius:10px;border:none;cursor:pointer;">🚀 Voir notre Crew</button>`;
    } else if(r.status==='left'){
      footer=`<div style="font-size:.65rem;font-weight:700;color:#64748b;">🚪 Crew quitté</div>`;
    } else if(r.status==='rejected'){
      footer=`<div style="font-size:.65rem;font-weight:700;color:#f87171;">✕ Refusé</div>`;
    }
    const stepBadge = {pending:'1/3',accepted:'2/3',negotiating:'2/3',united:'3/3 ✓',left:'—',rejected:'—'}[r.status]||'';
    return `<div style="padding:.85rem;border-radius:14px;background:rgba(15,23,42,.5);border:1px solid rgba(30,41,59,.6);margin-bottom:.5rem;">
      <div style="display:flex;align-items:center;gap:.7rem;">
        <div style="width:40px;height:40px;border-radius:50%;background:rgba(30,41,59,.8);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;">${r.icon}</div>
        <div style="flex-grow:1;min-width:0;">
          <div style="font-size:.82rem;font-weight:700;color:#fff;display:flex;align-items:center;gap:.4rem;">${r.from}<span style="font-size:.55rem;font-weight:800;padding:1px 6px;border-radius:9999px;background:${AC}22;color:${AC};">${stepBadge}</span></div>
          <div style="font-size:.63rem;color:#475569;">${r.activity||''}${r.spot?' · '+r.spot:''} · ${r.compat||0}% · ${r.time}</div>
        </div>
        ${r.status==='pending'?`<button onclick="navRejectReq('${r.id}')" aria-label="Refuser" style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#f87171;padding:.28rem .5rem;border-radius:8px;font-size:.65rem;cursor:pointer;flex-shrink:0;">✕</button>`:`<button onclick="navDeleteReq('${r.id}')" aria-label="Supprimer" title="Retirer cette demande" style="background:rgba(71,85,105,.15);border:1px solid rgba(71,85,105,.3);color:#64748b;padding:.28rem .5rem;border-radius:8px;font-size:.65rem;cursor:pointer;flex-shrink:0;"><i class="fa-solid fa-trash-can"></i></button>`}
      </div>
      ${footer}
    </div>`;
  };
  const active = reqs.filter(r=>r.status!=='rejected');
  const rej = reqs.filter(r=>r.status==='rejected');
  let html='';
  if(active.length) html += active.map(card).join('');
  if(rej.length) html += `<div style="font-size:.58rem;font-weight:800;color:#f87171;text-transform:uppercase;letter-spacing:.06em;padding:.5rem .2rem .25rem;">Refusées</div>`+rej.map(card).join('');
  el.innerHTML = html || '<div style="text-align:center;padding:2.5rem 1rem;font-size:.85rem;color:#334155;">Aucune demande pour le moment 🤷<br><span style="font-size:.7rem;">Lance des merges depuis "Mes Matchs" !</span></div>';
}

function navRejectReq(id){ if(typeof SmatchMerge!=='undefined') SmatchMerge.reject(id); navRenderDemandes(); navRender(); }

// Chat éphémère de négociation
function navOpenNegoChat(id){
  if(typeof SmatchMerge==='undefined')return;
  let r=SmatchMerge.get(id); if(!r)return;
  if(r.status==='accepted') r=SmatchMerge.accept(id); // passe en negotiating à l'ouverture
  const AC=NAV_STATE.mode==='ete'?'#fbbf24':'#22d3ee';
  const GRAD=NAV_STATE.mode==='ete'?'linear-gradient(135deg,#fbbf24,#f97316)':'linear-gradient(135deg,#22d3ee,#3b82f6)';
  const ex=document.getElementById('snm-nego-modal');if(ex)ex.remove();
  const div=document.createElement('div');div.id='snm-nego-modal';div.className='snm-modal-overlay';div.setAttribute('role','dialog');div.setAttribute('aria-modal','true');
  div.addEventListener('click',e=>{if(e.target===div)div.remove();});
  div.innerHTML=`<div class="snm-modal-box" style="max-width:420px;height:560px;max-height:88vh;border:1px solid ${AC}28;display:flex;flex-direction:column;overflow:hidden;">
    <div style="padding:.9rem 1.1rem;border-bottom:1px solid rgba(30,41,59,.7);display:flex;align-items:center;gap:.6rem;flex-shrink:0;">
      <button onclick="navOpenDemandesModal()" style="color:#94a3b8;background:none;border:none;cursor:pointer;font-size:.9rem;" aria-label="Retour"><i class="fa-solid fa-arrow-left"></i></button>
      <div style="width:34px;height:34px;border-radius:50%;background:rgba(30,41,59,.8);display:flex;align-items:center;justify-content:center;font-size:1rem;">${r.icon}</div>
      <div style="flex-grow:1;"><div style="font-size:.85rem;font-weight:800;color:#fff;">${r.from}</div><div style="font-size:.58rem;color:${AC};">💬 Chat de négociation — éphémère</div></div>
      <button onclick="document.getElementById('snm-nego-modal').remove()" style="color:#475569;background:none;border:none;cursor:pointer;font-size:1rem;" aria-label="Fermer"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div style="padding:.6rem 1rem;background:rgba(251,191,36,.06);border-bottom:1px solid rgba(30,41,59,.5);flex-shrink:0;"><div style="font-size:.64rem;color:#94a3b8;line-height:1.4;">💡 Validez ensemble que vous visez le même trip (dates, spot), puis cliquez chacun sur <strong style="color:${AC};">Confirmer l'Union</strong> pour former le crew.</div></div>
    <div id="snm-nego-msgs" style="flex-grow:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:.5rem;"></div>
    <div style="flex-shrink:0;padding:.7rem;border-top:1px solid rgba(30,41,59,.7);display:flex;gap:.5rem;">
      <input id="snm-nego-input" type="text" placeholder="Écris un message…" style="flex-grow:1;background:rgba(5,8,20,.7);border:1px solid rgba(71,85,105,.5);border-radius:9999px;padding:.55rem 1rem;color:#e2e8f0;font-size:.8rem;outline:none;" onkeydown="if(event.key==='Enter')navSendNego('${id}')">
      <button onclick="navSendNego('${id}')" style="width:38px;height:38px;border-radius:50%;background:${GRAD};border:none;cursor:pointer;color:#020617;flex-shrink:0;"><i class="fa-solid fa-paper-plane"></i></button>
    </div>
    <div style="flex-shrink:0;padding:.6rem .7rem;border-top:1px solid rgba(30,41,59,.7);">
      <button onclick="navUnionChoice('${id}')" id="snm-nego-confirm" ${r.meConfirmed?'disabled':''} style="width:100%;background:${r.meConfirmed?'rgba(71,85,105,.3)':'linear-gradient(135deg,#4ade80,#16a34a)'};color:${r.meConfirmed?'#64748b':'#020617'};font-weight:800;font-size:.8rem;padding:.65rem;border-radius:12px;border:none;cursor:${r.meConfirmed?'default':'pointer'};">${r.meConfirmed?'✓ Tu as confirmé — en attente de '+r.from:'🤝 Confirmer l\'Union'}</button>
    </div>
  </div>`;
  document.body.appendChild(div);
  navRenderNego(id);
  setTimeout(()=>{const i=document.getElementById('snm-nego-input');if(i)i.focus();},50);
}

function navRenderNego(id){
  const r=SmatchMerge.get(id);const wrap=document.getElementById('snm-nego-msgs');if(!r||!wrap)return;
  const GRAD=NAV_STATE.mode==='ete'?'linear-gradient(135deg,#fbbf24,#f97316)':'linear-gradient(135deg,#22d3ee,#3b82f6)';
  if(!r.chat||!r.chat.length){
    wrap.innerHTML=`<div style="text-align:center;color:#334155;font-size:.78rem;padding:1.5rem;">Démarrez la conversation 👋<br><span style="font-size:.66rem;">Ex : "On part à ${r.spot||'la montagne'} le week-end du 15 ?"</span></div>`;return;
  }
  wrap.innerHTML=r.chat.map(msg=>{
    if(msg.from==='me') return `<div style="align-self:flex-end;max-width:80%;"><div style="background:${GRAD};color:#020617;font-weight:600;font-size:.8rem;padding:.5rem .8rem;border-radius:14px 14px 4px 14px;">${msg.text}</div><div style="font-size:.55rem;color:#475569;text-align:right;margin-top:.1rem;">Toi · ${msg.time}</div></div>`;
    return `<div style="align-self:flex-start;max-width:80%;"><div style="background:rgba(15,23,42,.95);border:1px solid rgba(30,41,59,.6);color:#e2e8f0;font-size:.8rem;padding:.5rem .8rem;border-radius:14px 14px 14px 4px;">${msg.text}</div><div style="font-size:.55rem;color:#475569;margin-top:.1rem;">${r.from} · ${msg.time}</div></div>`;
  }).join('');
  wrap.scrollTop=wrap.scrollHeight;
}

function navSendNego(id){
  const inp=document.getElementById('snm-nego-input');if(!inp||!inp.value.trim())return;
  const text=inp.value.trim();inp.value='';
  SmatchMerge.addChat(id,'me',text);
  navRenderNego(id);
  // Réponse simulée de l'autre
  setTimeout(()=>{
    const replies=['Carrément, ça me va ! 🤙','Oui parfait pour moi 👍','Top, on est sur la même longueur d\'onde 🔥','Niquel, je valide ces dates 📅','Hâte d\'y être ! 🏔️'];
    SmatchMerge.addChat(id,'them',replies[Math.floor(Math.random()*replies.length)]);
    navRenderNego(id);
  },1100);
}

// Étape 3 — Choix : nouveau crew OU intégrer à un crew existant
function navUnionChoice(id){
  if(typeof SmatchMerge==='undefined')return;
  const r=SmatchMerge.get(id); if(!r)return;
  const AC=NAV_STATE.mode==='ete'?'#fbbf24':'#22d3ee';
  const now=Date.now();
  // Mes crews actifs (même saison) → pour INTÉGRER la personne
  const myCrews=navGetDashboards().filter(d=>new Date(d.dateEnd)>now && d.mode===r.mode);

  const ex=document.getElementById('snm-union-choice');if(ex)ex.remove();
  const div=document.createElement('div');div.id='snm-union-choice';div.className='snm-modal-overlay';
  div.setAttribute('role','dialog');div.setAttribute('aria-modal','true');
  div.addEventListener('click',e=>{if(e.target===div)div.remove();});

  // Boutons "intégrer à un de mes crews"
  const integrateBtns = myCrews.length
    ? myCrews.map(d=>`<button onclick="navConfirmUnion('${id}','${d.id}')" style="width:100%;display:flex;align-items:center;gap:.7rem;padding:.75rem;margin-bottom:.45rem;background:rgba(15,23,42,.6);border:1px solid rgba(30,41,59,.6);border-radius:12px;cursor:pointer;text-align:left;" onmouseenter="this.style.borderColor='${AC}66'" onmouseleave="this.style.borderColor='rgba(30,41,59,.6)'">
        <div style="width:34px;height:34px;border-radius:10px;background:${d.mode==='ete'?'rgba(251,191,36,.13)':'rgba(34,211,238,.13)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">${d.mode==='ete'?'☀️':'❄️'}</div>
        <div style="flex-grow:1;min-width:0;"><div style="font-size:.8rem;font-weight:700;color:#fff;">${d.name}</div><div style="font-size:.62rem;color:#64748b;">${d.spot} · 👥 ${d.members}</div></div>
        <i class="fa-solid fa-user-plus" style="color:${AC};font-size:.78rem;"></i>
      </button>`).join('')
    : `<div style="padding:.6rem;background:rgba(15,23,42,.4);border:1px dashed rgba(71,85,105,.4);border-radius:10px;font-size:.66rem;color:#64748b;text-align:center;">Tu n'as pas encore de crew actif où l'intégrer.</div>`;

  div.innerHTML=`<div class="snm-modal-box" style="max-width:390px;border:1px solid ${AC}28;">
    <div style="padding:1.1rem 1.2rem .7rem;border-bottom:1px solid rgba(30,41,59,.6);">
      <div style="font-size:.95rem;font-weight:800;color:#fff;">🤝 Unir avec ${r.from}</div>
      <div style="font-size:.7rem;color:#94a3b8;margin-top:.3rem;line-height:1.4;">Choisis comment vous partez ensemble.</div>
    </div>
    <div style="padding:1rem 1.2rem;max-height:60vh;overflow-y:auto;">

      <div style="font-size:.58rem;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.4rem;">✨ Nouveau crew</div>
      <button onclick="navConfirmUnion('${id}','new')" style="width:100%;display:flex;align-items:center;gap:.7rem;padding:.8rem;margin-bottom:1rem;background:linear-gradient(135deg,#4ade80,#16a34a);border:none;border-radius:12px;cursor:pointer;text-align:left;">
        <div style="width:34px;height:34px;border-radius:10px;background:rgba(2,6,23,.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1.05rem;">✨</div>
        <div style="flex-grow:1;"><div style="font-size:.8rem;font-weight:800;color:#020617;">Créer un nouveau crew</div><div style="font-size:.62rem;color:rgba(2,6,23,.7);">Vous deux, départ à zéro</div></div>
      </button>

      <div style="font-size:.58rem;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.4rem;">➕ Intégrer ${r.from} à mon crew</div>
      <div style="margin-bottom:1rem;">${integrateBtns}</div>

      <div style="font-size:.58rem;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.4rem;">🚪 Rejoindre le crew de ${r.from}</div>
      <button onclick="navJoinTheirCrew('${id}')" style="width:100%;display:flex;align-items:center;gap:.7rem;padding:.8rem;background:rgba(15,23,42,.6);border:1px solid ${AC}33;border-radius:12px;cursor:pointer;text-align:left;" onmouseenter="this.style.borderColor='${AC}88'" onmouseleave="this.style.borderColor='${AC}33'">
        <div style="width:34px;height:34px;border-radius:10px;background:${AC}1a;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1.05rem;">${r.icon}</div>
        <div style="flex-grow:1;"><div style="font-size:.8rem;font-weight:800;color:#fff;">Rejoindre son crew</div><div style="font-size:.62rem;color:#94a3b8;">Tu intègres le groupe de ${r.from}</div></div>
        <i class="fa-solid fa-arrow-right-to-bracket" style="color:${AC};font-size:.78rem;"></i>
      </button>

    </div>
  </div>`;
  document.body.appendChild(div);
}

// "Rejoindre le crew de l'autre" : crée un crew côté toi (équivalent fonctionnel en démo)
// avec la personne comme hôte, et toi qui rejoins.
function navJoinTheirCrew(id){
  const r=SmatchMerge.get(id);if(!r)return;
  const choiceModal=document.getElementById('snm-union-choice');if(choiceModal)choiceModal.remove();
  SmatchMerge.confirm(id);
  SmatchMerge.update(id,{unionChoice:'join'});
  setTimeout(()=>{
    SmatchMerge.update(id,{themConfirmed:true});
    if(SmatchMerge.isUnited(id)){
      const crew=SmatchMerge.createCrew(id);
      // Marque le crew comme "hébergé par" l'autre
      try{const fresh=JSON.parse(localStorage.getItem('snm_fresh_trips')||'{}');if(fresh[crew.tripId]){fresh[crew.tripId].host=r.from;fresh[crew.tripId].name='Crew de '+r.from;localStorage.setItem('snm_fresh_trips',JSON.stringify(fresh));}
        const dbs=JSON.parse(localStorage.getItem('snm_dashboards')||'[]');const d=dbs.find(x=>x.id===crew.tripId);if(d){d.name='Crew de '+r.from;localStorage.setItem('snm_dashboards',JSON.stringify(dbs));}
      }catch(e){}
      navCelebrateUnion(id,crew);
    }
  },1600);
  if(typeof showToast==='function') showToast('🚪 Demande envoyée — en attente de '+r.from);
  navRenderDemandes();
}

function navConfirmUnion(id, choice){
  if(typeof SmatchMerge==='undefined')return;
  // Ferme la modale de choix si ouverte
  const choiceModal=document.getElementById('snm-union-choice');if(choiceModal)choiceModal.remove();
  choice = choice || 'new';
  SmatchMerge.confirm(id);
  SmatchMerge.update(id, { unionChoice: choice });
  // Simule la confirmation de l'autre ~1.5s après
  setTimeout(()=>{
    SmatchMerge.update(id,{themConfirmed:true});
    if(SmatchMerge.isUnited(id)){
      const r=SmatchMerge.get(id);
      if(r.unionChoice && r.unionChoice!=='new'){
        // Intégration à un crew existant → passe par la validation des membres
        navStartIntegration(id, r.unionChoice);
      } else {
        const crew=SmatchMerge.createCrew(id);
        navCelebrateUnion(id, crew);
      }
    }
  },1600);
  // Maj immédiate de l'UI
  const r=SmatchMerge.get(id);
  const btn=document.getElementById('snm-nego-confirm');
  if(btn){btn.disabled=true;btn.style.background='rgba(71,85,105,.3)';btn.style.color='#64748b';btn.style.cursor='default';btn.textContent='✓ Tu as confirmé — en attente de '+r.from;}
  navRenderDemandes();
  if(typeof showToast==='function') showToast('🤝 Union confirmée — en attente de '+r.from);
}

// Étape 3 — célébration + redirection vers le nouveau crew
// Étape 4 — Validation des membres pour intégrer le nouveau au crew
function navStartIntegration(reqId, tripId){
  if(typeof SmatchMerge==='undefined')return;
  const r=SmatchMerge.get(reqId);if(!r)return;
  const AC=NAV_STATE.mode==='ete'?'#fbbf24':'#22d3ee';
  // Membres du crew (hors toi et hors le nouveau)
  let trip=null;
  try{ const fresh=JSON.parse(localStorage.getItem('snm_fresh_trips')||'{}'); trip=fresh[tripId]; }catch(e){}
  if(!trip && typeof SMATCH_TRIPS!=='undefined') trip=SMATCH_TRIPS[tripId];
  const memberKeys=(trip&&trip.memberKeys?trip.memberKeys:['R']).filter(k=>k!=='R'&&k!==r.key);
  const dir=window.SMATCH_MEMBERS||{};
  // Un membre accepte automatiquement (le premier), TOI tu valides
  const autoMember = memberKeys.length ? dir[memberKeys[0]] : null;

  const ex=document.getElementById('snm-integration-modal');if(ex)ex.remove();
  const div=document.createElement('div');div.id='snm-integration-modal';div.className='snm-modal-overlay';
  div.setAttribute('role','dialog');div.setAttribute('aria-modal','true');
  const compat = r.compat || 0;
  const newMember = dir[r.key] || {name:r.from, sport:r.activity, emoji:r.icon};
  div.innerHTML=`<div class="snm-modal-box" style="max-width:400px;border:1px solid ${AC}28;">
    <div style="padding:1.2rem 1.2rem .8rem;border-bottom:1px solid rgba(30,41,59,.6);">
      <div style="font-size:.57rem;font-weight:800;color:${AC};text-transform:uppercase;letter-spacing:.06em;">Validation du crew</div>
      <div style="font-size:.95rem;font-weight:800;color:#fff;margin-top:.15rem;">🗳️ ${r.from} veut rejoindre le crew</div>
      <div style="font-size:.72rem;color:#94a3b8;margin-top:.3rem;line-height:1.4;">Les membres du crew valident l'arrivée du nouveau. Tu peux voir son profil et sa compatibilité avant de décider.</div>
    </div>
    <div style="padding:1rem 1.2rem;">
      <button onclick="navViewMemberProfile('${r.from}')" style="width:100%;display:flex;align-items:center;gap:.7rem;padding:.7rem;margin-bottom:.8rem;background:rgba(15,23,42,.6);border:1px solid ${AC}33;border-radius:12px;cursor:pointer;text-align:left;">
        <div style="width:42px;height:42px;border-radius:50%;background:rgba(30,41,59,.8);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;">${r.icon}</div>
        <div style="flex-grow:1;"><div style="font-size:.85rem;font-weight:800;color:#fff;">${r.from}</div><div style="font-size:.66rem;color:#94a3b8;">${newMember.sport||r.activity||''} · Compatibilité ${compat}%</div></div>
        <span style="font-size:.62rem;font-weight:700;color:${AC};">Voir profil ›</span>
      </button>
      <div id="snm-integration-votes" style="margin-bottom:.9rem;"></div>
      <div id="snm-integration-action"></div>
    </div>
  </div>`;
  document.body.appendChild(div);

  // Rendu des votes : membre auto accepte après délai, toi tu décides
  const votesEl=document.getElementById('snm-integration-votes');
  const actionEl=document.getElementById('snm-integration-action');
  function renderVotes(autoDone){
    let rows='';
    if(autoMember){
      rows+=`<div style="display:flex;align-items:center;gap:.6rem;padding:.55rem .7rem;background:rgba(15,23,42,.4);border-radius:10px;margin-bottom:.4rem;">
        <div style="width:30px;height:30px;border-radius:50%;background:rgba(30,41,59,.8);display:flex;align-items:center;justify-content:center;font-size:.85rem;">${autoMember.emoji||'🙂'}</div>
        <span style="flex-grow:1;font-size:.76rem;color:#e2e8f0;font-weight:600;">${autoMember.name}</span>
        ${autoDone?`<span style="font-size:.66rem;font-weight:800;color:#4ade80;">✓ A validé</span>`:`<span style="font-size:.66rem;color:#f59e0b;" class="live-dot">vote…</span>`}
      </div>`;
    }
    // Toi
    rows+=`<div style="display:flex;align-items:center;gap:.6rem;padding:.55rem .7rem;background:rgba(15,23,42,.4);border-radius:10px;">
      <div style="width:30px;height:30px;border-radius:50%;background:${AC}22;display:flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:900;color:${AC};">R</div>
      <span style="flex-grow:1;font-size:.76rem;color:#e2e8f0;font-weight:600;">Toi</span>
      <span style="font-size:.66rem;color:#64748b;">à toi de voter</span>
    </div>`;
    votesEl.innerHTML=rows;
  }
  renderVotes(false);
  // Le membre auto valide après 1.4s
  setTimeout(()=>{
    renderVotes(true);
    actionEl.innerHTML=`<div style="display:flex;gap:.6rem;">
      <button onclick="navRejectIntegration('${reqId}')" style="flex:1;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#f87171;font-weight:700;font-size:.76rem;padding:.6rem;border-radius:11px;cursor:pointer;">Refuser</button>
      <button onclick="navAcceptIntegration('${reqId}','${tripId}')" style="flex:1.6;background:linear-gradient(135deg,#4ade80,#16a34a);color:#020617;font-weight:800;font-size:.76rem;padding:.6rem;border-radius:11px;border:none;cursor:pointer;">✓ Valider l'arrivée</button>
    </div>`;
  },1400);
}

function navAcceptIntegration(reqId, tripId){
  const r=SmatchMerge.get(reqId);
  const res=SmatchMerge.addMemberToCrew(r.key, tripId);
  SmatchMerge.update(reqId,{status:'united',tripId:tripId,integrated:true});
  const modal=document.getElementById('snm-integration-modal');if(modal)modal.remove();
  const demModal=document.getElementById('snm-demandes-modal');if(demModal)demModal.remove();
  const negoModal=document.getElementById('snm-nego-modal');if(negoModal)negoModal.remove();
  // Célébration d'intégration
  const div=document.createElement('div');div.id='snm-union-modal';div.className='snm-modal-overlay';div.setAttribute('role','dialog');
  div.innerHTML=`<div class="snm-modal-box" style="max-width:360px;border:1px solid rgba(74,222,128,.4);text-align:center;">
    <div style="padding:2rem 1.5rem;">
      <div style="font-size:3.5rem;margin-bottom:.6rem;">🎉</div>
      <div style="font-size:1.15rem;font-weight:900;color:#fff;margin-bottom:.4rem;">${r.from} a rejoint le crew !</div>
      <div style="font-size:.82rem;color:#94a3b8;line-height:1.5;margin-bottom:1.4rem;">Vous êtes maintenant ${res?res.members:'plusieurs'} dans le crew. ${r.from} vient de saluer tout le monde dans le chat 👋</div>
      <button onclick="navGoToCrew('${tripId}','${r.mode}')" style="width:100%;background:linear-gradient(135deg,#4ade80,#16a34a);color:#020617;font-weight:800;font-size:.85rem;padding:.7rem;border-radius:12px;border:none;cursor:pointer;">Voir le crew 🚀</button>
    </div>
  </div>`;
  document.body.appendChild(div);
  if(typeof showToast==='function') showToast('🎉 '+r.from+' a rejoint le crew !');
  navRender();
}

function navRejectIntegration(reqId){
  SmatchMerge.update(reqId,{status:'rejected'});
  const modal=document.getElementById('snm-integration-modal');if(modal)modal.remove();
  if(typeof showToast==='function') showToast('Arrivée refusée');
  navRenderDemandes();
}

function navCelebrateUnion(id, crew){
  const negoModal=document.getElementById('snm-nego-modal');if(negoModal)negoModal.remove();
  const demModal=document.getElementById('snm-demandes-modal');if(demModal)demModal.remove();
  const r=SmatchMerge.get(id);
  const div=document.createElement('div');div.id='snm-union-modal';div.className='snm-modal-overlay';div.setAttribute('role','dialog');
  div.innerHTML=`<div class="snm-modal-box" style="max-width:360px;border:1px solid rgba(74,222,128,.4);text-align:center;">
    <div style="padding:2rem 1.5rem;">
      <div style="font-size:3.5rem;margin-bottom:.6rem;animation:snmPop .5s ease;">🚀</div>
      <div style="font-size:1.15rem;font-weight:900;color:#fff;margin-bottom:.4rem;">Crew formé !</div>
      <div style="font-size:.82rem;color:#94a3b8;line-height:1.5;margin-bottom:1.4rem;">Toi et <strong style="color:#4ade80;">${r.from}</strong> partez ensemble${r.spot?' à '+r.spot:''} ! Votre dashboard est prêt : budget, courses et roadmap à remplir ensemble.</div>
      <button onclick="navGoToCrew('${crew.tripId}','${crew.mode}')" style="width:100%;background:linear-gradient(135deg,#4ade80,#16a34a);color:#020617;font-weight:800;font-size:.85rem;padding:.7rem;border-radius:12px;border:none;cursor:pointer;">Découvrir notre Crew 🎉</button>
    </div>
  </div>`;
  document.body.appendChild(div);
  if(typeof showToast==='function') showToast('🎉 '+r.from+' a confirmé ! Crew formé !');
  navRender();
}

function navGoToCrew(tripId, mode){
  // Vérifie que le crew existe encore (pas quitté/supprimé)
  let exists = false;
  try {
    const dbs = JSON.parse(localStorage.getItem('snm_dashboards') || '[]');
    exists = dbs.some(d => d.id === tripId);
  } catch (e) {}
  if (!exists) {
    if (typeof showToast === 'function') showToast('🚪 Tu as quitté ce crew — il n\'est plus accessible.');
    // Marque les demandes liées comme "quittées"
    if (typeof SmatchMerge !== 'undefined') {
      SmatchMerge.all().forEach(r => { if (r.tripId === tripId) SmatchMerge.update(r.id, { status: 'left' }); });
    }
    const dem = document.getElementById('snm-demandes-modal'); if (dem) { navRenderDemandes(); }
    return;
  }
  localStorage.setItem('snm_mode', mode);
  localStorage.setItem('snm_active_trip_id', tripId);
  const url=(mode==='ete'?'dashboard_ete.html':'dashboard_hiver.html')+'?trip='+tripId;
  window.location.href=url;
}


// ═══════════════════════════════════════════════════════════════════════
//  MESSAGERIE PRIVÉE
// ═══════════════════════════════════════════════════════════════════════
function navGetConversations() {
  const stored = localStorage.getItem('snm_messages');
  if (stored) { try { return JSON.parse(stored); } catch(e) {} }
  // Conversations de démo
  const demo = [
    { id:'c1', name:'LucaLaNeige',    avatar:'L', color:'from-cyan-400 to-blue-600',    emoji:'🏂', messages:[
      { from:'them', text:'Yo ! Toujours partant pour Chamonix en février ? 🏔️', time:'14:32', read:false },
      { from:'them', text:'J\'ai trouvé un super chalet avec jacuzzi 🔥', time:'14:33', read:false },
    ]},
    { id:'c2', name:'ZoeWave',        avatar:'Z', color:'from-amber-400 to-orange-500', emoji:'🏄', messages:[
      { from:'me',   text:'Les vagues ont l\'air parfaites cette semaine !', time:'Hier', read:true },
      { from:'them', text:'Carrément ! On se cale une session early ? 🌊', time:'Hier', read:false },
    ]},
    { id:'c3', name:'ThomasOff-Piste',avatar:'T', color:'from-orange-400 to-red-600',   emoji:'🎿', messages:[
      { from:'them', text:'Merci pour le merge ! Hâte de rider ensemble 🤙', time:'Lun', read:true },
      { from:'me',   text:'Avec plaisir ! À très vite', time:'Lun', read:true },
    ]},
  ];
  localStorage.setItem('snm_messages', JSON.stringify(demo));
  return demo;
}

function navGetUnreadCount() {
  return navGetConversations().reduce((sum, c) =>
    sum + c.messages.filter(m => m.from === 'them' && !m.read).length, 0);
}

// Ajoute un vrai message entrant dans la messagerie (pour que les notifs soient réelles)
function navAddIncomingMessage(name, emoji, text) {
  const convs = navGetConversations();
  const now = new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
  let conv = convs.find(c => c.name === name);
  if (conv) {
    conv.messages.push({ from:'them', text, time: now, read:false });
  } else {
    const colors = ['from-cyan-400 to-blue-600','from-amber-400 to-orange-500','from-violet-500 to-purple-700','from-emerald-400 to-teal-600'];
    convs.unshift({
      id: 'c_' + Date.now(), name, avatar: name.charAt(0).toUpperCase(),
      color: colors[Math.floor(Math.random()*colors.length)], emoji: emoji || '🙂',
      messages: [{ from:'them', text, time: now, read:false }],
    });
  }
  localStorage.setItem('snm_messages', JSON.stringify(convs));
}

let _navActiveConv = null;

function navOpenMessages() {
  document.querySelectorAll('.snm-dd').forEach(d => d.classList.remove('open'));
  // Garde d'auth
  if (localStorage.getItem('snm_auth') !== '1') { navGuard(null, 'accueil.html'); return; }
  navInjectModalCSSIfNeeded();
  const existing = document.getElementById('snm-msg-modal'); if (existing) existing.remove();
  _navActiveConv = null;
  const AC = NAV_STATE.mode === 'ete' ? '#fbbf24' : '#22d3ee';
  const div = document.createElement('div');
  div.id = 'snm-msg-modal'; div.className = 'snm-modal-overlay'; div.setAttribute('role','dialog'); div.setAttribute('aria-modal','true');
  div.addEventListener('click', e => { if (e.target === div) div.remove(); });
  div.innerHTML = `<div class="snm-modal-box" style="max-width:440px;height:580px;max-height:88vh;border:1px solid ${AC}28;display:flex;flex-direction:column;overflow:hidden;">
    <div id="snm-msg-header" style="padding:1.1rem;border-bottom:1px solid rgba(30,41,59,.7);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
      <div style="display:flex;align-items:center;gap:.6rem;">
        <div><div style="font-size:.57rem;font-weight:800;color:${AC};text-transform:uppercase;letter-spacing:.06em;margin-bottom:.12rem;">Messagerie</div><div style="font-size:.95rem;font-weight:800;color:#fff;">💬 Mes Messages</div></div>
      </div>
      <button onclick="document.getElementById('snm-msg-modal').remove()" style="color:#475569;background:none;border:none;cursor:pointer;font-size:1rem;" onmouseenter="this.style.color='#fff'" onmouseleave="this.style.color='#475569'" aria-label="Fermer"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div id="snm-msg-body" style="flex-grow:1;overflow-y:auto;scrollbar-width:thin;"></div>
  </div>`;
  document.body.appendChild(div);
  navRenderConvList();
}

function navRenderConvList() {
  _navActiveConv = null;
  const AC = NAV_STATE.mode === 'ete' ? '#fbbf24' : '#22d3ee';
  const body = document.getElementById('snm-msg-body');
  const header = document.getElementById('snm-msg-header');
  if (!body) return;

  // Reconstruit entièrement le header en mode "liste" (fix du nom résiduel)
  if (header) header.innerHTML = `
    <div style="display:flex;align-items:center;gap:.6rem;">
      <div><div style="font-size:.57rem;font-weight:800;color:${AC};text-transform:uppercase;letter-spacing:.06em;margin-bottom:.12rem;">Messagerie</div><div style="font-size:.95rem;font-weight:800;color:#fff;">💬 Mes Messages</div></div>
    </div>
    <button onclick="document.getElementById('snm-msg-modal').remove()" style="color:#475569;background:none;border:none;cursor:pointer;font-size:1rem;" onmouseenter="this.style.color='#fff'" onmouseleave="this.style.color='#475569'" aria-label="Fermer"><i class="fa-solid fa-xmark"></i></button>`;

  // Retire la barre d'input éventuelle (on est en mode liste)
  const inputBar = document.getElementById('snm-msg-input-bar');
  if (inputBar) inputBar.remove();
  // Reset le style flex du body
  body.style.display = '';
  body.style.flexDirection = '';

  const convs = navGetConversations();
  body.innerHTML = convs.map(c => {
    const hasMsg = c.messages && c.messages.length > 0;
    const last = hasMsg ? c.messages[c.messages.length - 1] : null;
    const unread = hasMsg ? c.messages.filter(m => m.from === 'them' && !m.read).length : 0;
    let preview;
    if (!last) preview = 'Démarre la conversation…';
    else if (last.type === 'image') preview = (last.from === 'me' ? 'Toi : ' : '') + '📷 Photo';
    else if (last.type === 'gif') preview = (last.from === 'me' ? 'Toi : ' : '') + 'GIF ' + last.text;
    else preview = (last.from === 'me' ? 'Toi : ' : '') + last.text;
    const time = last ? last.time : '';
    return `<div style="position:relative;display:flex;align-items:stretch;border-bottom:1px solid rgba(30,41,59,.5);">
      <button onclick="navOpenConv('${c.id}')" style="flex-grow:1;display:flex;align-items:center;gap:.75rem;padding:.85rem 1rem;background:none;border:none;cursor:pointer;text-align:left;min-width:0;" onmouseenter="this.parentElement.style.background='rgba(30,41,59,.4)'" onmouseleave="this.parentElement.style.background='none'">
      <div style="position:relative;flex-shrink:0;">
        <div style="width:42px;height:42px;border-radius:50%;font-weight:900;color:#020617;display:flex;align-items:center;justify-content:center;font-size:.9rem;" class="bg-gradient-to-br ${c.color}">${c.avatar}</div>
        ${unread > 0 ? `<span style="position:absolute;top:-2px;right:-2px;width:18px;height:18px;background:#ef4444;color:#fff;font-size:.6rem;font-weight:900;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid rgba(10,15,30,.98);">${unread}</span>` : ''}
      </div>
      <div style="flex-grow:1;min-width:0;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:.5rem;">
          <span style="font-size:.82rem;font-weight:${unread>0?'800':'700'};color:#fff;white-space:nowrap;">${c.name} ${c.emoji}</span>
          <span style="font-size:.62rem;color:#475569;flex-shrink:0;">${time}</span>
        </div>
        <div style="font-size:.72rem;color:${unread>0?'#cbd5e1':'#64748b'};font-weight:${unread>0?'600':'400'};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:.1rem;">${preview}</div>
      </div>
      </button>
      <button onclick="navDeleteConv('${c.id}')" aria-label="Supprimer la conversation" style="flex-shrink:0;padding:0 .85rem;background:none;border:none;cursor:pointer;color:#475569;font-size:.8rem;" onmouseenter="this.style.color='#f87171'" onmouseleave="this.style.color='#475569'"><i class="fa-solid fa-trash-can"></i></button>
    </div>`;
  }).join('') || '<div style="text-align:center;padding:3rem 1rem;color:#334155;font-size:.85rem;">Aucune conversation 📭</div>';
}

function navDeleteConv(convId) {
  const convs = navGetConversations().filter(c => c.id !== convId);
  localStorage.setItem('snm_messages', JSON.stringify(convs));
  navRenderConvList();
  navRender();
  if (typeof showToast === 'function') showToast('🗑️ Conversation supprimée');
}

function navOpenConv(convId) {
  const convs = navGetConversations();
  const conv = convs.find(c => c.id === convId);
  if (!conv) return;
  _navActiveConv = convId;
  const AC = NAV_STATE.mode === 'ete' ? '#fbbf24' : '#22d3ee';
  const GRAD = NAV_STATE.mode === 'ete' ? 'linear-gradient(135deg,#fbbf24,#f97316)' : 'linear-gradient(135deg,#22d3ee,#3b82f6)';

  // Marque les messages comme lus
  conv.messages.forEach(m => { if (m.from === 'them') m.read = true; });
  localStorage.setItem('snm_messages', JSON.stringify(convs));

  // Header → conversation (avatar cliquable → profil)
  const header = document.getElementById('snm-msg-header');
  if (header) header.innerHTML = `
    <div style="display:flex;align-items:center;gap:.6rem;">
      <button onclick="navRenderConvList()" style="color:#94a3b8;background:none;border:none;cursor:pointer;font-size:.9rem;padding:.2rem .4rem;" onmouseenter="this.style.color='#fff'" onmouseleave="this.style.color='#94a3b8'"><i class="fa-solid fa-arrow-left"></i></button>
      <button onclick="navViewMemberProfile('${conv.name}')" title="Voir le profil" style="background:none;border:none;cursor:pointer;padding:0;display:flex;align-items:center;gap:.5rem;">
        <div style="width:34px;height:34px;border-radius:50%;font-weight:900;color:#020617;display:flex;align-items:center;justify-content:center;font-size:.78rem;transition:transform .15s;" class="bg-gradient-to-br ${conv.color}" onmouseenter="this.style.transform='scale(1.08)'" onmouseleave="this.style.transform=''">${conv.avatar}</div>
        <div style="text-align:left;"><div style="font-size:.85rem;font-weight:800;color:#fff;">${conv.name} ${conv.emoji}</div><div style="font-size:.6rem;color:#4ade80;">● En ligne · voir profil</div></div>
      </button>
    </div>
    <button onclick="document.getElementById('snm-msg-modal').remove()" style="color:#475569;background:none;border:none;cursor:pointer;font-size:1rem;" onmouseenter="this.style.color='#fff'" onmouseleave="this.style.color='#475569'" aria-label="Fermer"><i class="fa-solid fa-xmark"></i></button>`;

  const body = document.getElementById('snm-msg-body');
  body.innerHTML = `
    <div id="snm-conv-messages" style="padding:1rem;display:flex;flex-direction:column;gap:.6rem;min-height:100%;box-sizing:border-box;"></div>`;
  // Make body a flex column so input sticks to bottom
  body.style.display = 'flex';
  body.style.flexDirection = 'column';

  renderConvMessages(conv, AC, GRAD);

  // Input bar enrichie (photo / gif / emoji)
  const modalBox = document.querySelector('#snm-msg-modal .snm-modal-box');
  let inputBar = document.getElementById('snm-msg-input-bar');
  if (inputBar) inputBar.remove();
  inputBar = document.createElement('div');
  inputBar.id = 'snm-msg-input-bar';
  inputBar.style.cssText = 'flex-shrink:0;border-top:1px solid rgba(30,41,59,.7);background:rgba(10,15,30,.98);';
  inputBar.innerHTML = `
    <div id="snm-emoji-tray" style="display:none;padding:.5rem .7rem;border-bottom:1px solid rgba(30,41,59,.5);flex-wrap:wrap;gap:.2rem;font-size:1.25rem;line-height:1;"></div>
    <div id="snm-gif-tray" style="display:none;padding:.5rem .7rem;border-bottom:1px solid rgba(30,41,59,.5);grid-template-columns:1fr 1fr 1fr;gap:.4rem;"></div>
    <div style="padding:.6rem .7rem;display:flex;gap:.4rem;align-items:center;">
      <input type="file" id="snm-msg-photo" accept="image/*" style="display:none" onchange="navSendPhoto(this)">
      <button onclick="document.getElementById('snm-msg-photo').click()" title="Photo" style="flex-shrink:0;width:32px;height:32px;border-radius:50%;background:rgba(30,41,59,.6);border:none;cursor:pointer;color:#94a3b8;font-size:.78rem;transition:all .15s;" onmouseenter="this.style.color='${AC}';this.style.background='rgba(30,41,59,.9)'" onmouseleave="this.style.color='#94a3b8';this.style.background='rgba(30,41,59,.6)'"><i class="fa-solid fa-image"></i></button>
      <button onclick="navToggleGifTray()" title="GIF" style="flex-shrink:0;width:32px;height:32px;border-radius:8px;background:rgba(30,41,59,.6);border:none;cursor:pointer;color:#94a3b8;font-size:.6rem;font-weight:900;transition:all .15s;" onmouseenter="this.style.color='${AC}';this.style.background='rgba(30,41,59,.9)'" onmouseleave="this.style.color='#94a3b8';this.style.background='rgba(30,41,59,.6)'">GIF</button>
      <button onclick="navToggleEmojiTray()" title="Emoji" style="flex-shrink:0;width:32px;height:32px;border-radius:50%;background:rgba(30,41,59,.6);border:none;cursor:pointer;color:#94a3b8;font-size:.85rem;transition:all .15s;" onmouseenter="this.style.color='${AC}';this.style.background='rgba(30,41,59,.9)'" onmouseleave="this.style.color='#94a3b8';this.style.background='rgba(30,41,59,.6)'"><i class="fa-regular fa-face-smile"></i></button>
      <input id="snm-msg-input" type="text" placeholder="Écris un message…" style="flex-grow:1;min-width:0;background:rgba(5,8,20,.7);border:1px solid rgba(71,85,105,.5);border-radius:9999px;padding:.55rem 1rem;color:#e2e8f0;font-size:.8rem;outline:none;transition:border-color .2s;" onfocus="this.style.borderColor='${AC}'" onblur="this.style.borderColor='rgba(71,85,105,.5)'" onkeydown="if(event.key==='Enter')navSendMessage()">
      <button onclick="navSendMessage()" style="flex-shrink:0;width:38px;height:38px;border-radius:50%;background:${GRAD};border:none;cursor:pointer;color:#020617;font-size:.85rem;display:flex;align-items:center;justify-content:center;"><i class="fa-solid fa-paper-plane"></i></button>
    </div>`;
  modalBox.appendChild(inputBar);

  setTimeout(() => { const inp = document.getElementById('snm-msg-input'); if (inp) inp.focus(); }, 50);
}

// ─── Trays emoji / gif ───────────────────────────────────────────────
function navToggleEmojiTray() {
  const tray = document.getElementById('snm-emoji-tray');
  const gif = document.getElementById('snm-gif-tray');
  if (!tray) return;
  if (gif) gif.style.display = 'none';
  const open = tray.style.display !== 'none';
  if (open) { tray.style.display = 'none'; return; }
  const emojis = ['😀','😂','🤣','😎','🥳','😍','🤙','👍','🔥','💪','🙌','👏','🎉','❄️','☀️','🏂','🎿','🏄','🌊','🏔️','⛷️','🍻','🧀','🍷','🤩','😬','😅','🥶','🌨️','💨','🚴','📸','✅','❌','💯','⚡'];
  tray.innerHTML = emojis.map(e => `<span onclick="navInsertEmoji('${e}')" style="cursor:pointer;padding:.15rem;border-radius:6px;transition:background .12s;" onmouseenter="this.style.background='rgba(255,255,255,.1)'" onmouseleave="this.style.background='none'">${e}</span>`).join('');
  tray.style.display = 'flex';
}
function navInsertEmoji(e) {
  const inp = document.getElementById('snm-msg-input');
  if (inp) { inp.value += e; inp.focus(); }
}
function navToggleGifTray() {
  const tray = document.getElementById('snm-gif-tray');
  const emo = document.getElementById('snm-emoji-tray');
  if (!tray) return;
  if (emo) emo.style.display = 'none';
  const open = tray.style.display !== 'none';
  if (open) { tray.style.display = 'none'; return; }
  // GIFs simulés (emoji animés en grand façon sticker)
  const gifs = [
    { emoji:'🤙', label:'Shaka' }, { emoji:'🔥', label:'Fire' }, { emoji:'🎉', label:'Party' },
    { emoji:'🏂', label:'Ride' }, { emoji:'🌊', label:'Wave' }, { emoji:'💪', label:'Strong' },
  ];
  tray.innerHTML = gifs.map(g => `<button onclick="navSendGif('${g.emoji}')" style="aspect-ratio:1;border:1px solid rgba(30,41,59,.6);border-radius:10px;background:rgba(5,8,20,.6);cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.2rem;transition:all .15s;" onmouseenter="this.style.borderColor='rgba(100,116,139,.6)';this.style.transform='scale(1.04)'" onmouseleave="this.style.borderColor='rgba(30,41,59,.6)';this.style.transform=''"><span style="font-size:1.8rem;">${g.emoji}</span><span style="font-size:.55rem;color:#64748b;">${g.label}</span></button>`).join('');
  tray.style.display = 'grid';
}

function renderConvMessages(conv, AC, GRAD) {
  const wrap = document.getElementById('snm-conv-messages');
  if (!wrap) return;
  wrap.innerHTML = conv.messages.map(msg => {
    const mine = msg.from === 'me';
    let content;
    if (msg.type === 'image') {
      content = `<img src="${msg.text}" style="max-width:180px;max-height:200px;border-radius:14px;object-fit:cover;display:block;cursor:pointer;" onclick="navMsgLightbox('${msg.text}')">`;
    } else if (msg.type === 'gif') {
      content = `<div style="width:120px;height:120px;border-radius:14px;background:${mine?'rgba(2,6,23,.2)':'rgba(5,8,20,.6)'};display:flex;align-items:center;justify-content:center;font-size:3.5rem;">${msg.text}</div>`;
    } else {
      const bubbleStyle = mine
        ? `background:${GRAD};color:#020617;font-weight:600;border-radius:16px 16px 4px 16px;`
        : `background:rgba(15,23,42,.95);border:1px solid rgba(30,41,59,.6);color:#e2e8f0;border-radius:16px 16px 16px 4px;`;
      content = `<div style="${bubbleStyle}font-size:.8rem;padding:.55rem .85rem;">${msg.text}</div>`;
    }
    const meta = mine
      ? `<div style="font-size:.58rem;color:#475569;text-align:right;margin-top:.15rem;margin-right:.3rem;">Toi · ${msg.time}</div>`
      : `<div style="font-size:.58rem;color:#475569;margin-top:.15rem;margin-left:.3rem;">${conv.name} · ${msg.time}</div>`;
    return `<div style="align-self:${mine?'flex-end':'flex-start'};max-width:78%;">${content}${meta}</div>`;
  }).join('');
  const body = document.getElementById('snm-msg-body');
  if (body) body.scrollTop = body.scrollHeight;
}

// ─── Envoi photo / gif ───────────────────────────────────────────────
function navSendPhoto(input) {
  if (!input.files || !input.files[0] || !_navActiveConv) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const convs = navGetConversations();
    const conv = convs.find(c => c.id === _navActiveConv);
    if (!conv) return;
    const now = new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
    conv.messages.push({ from:'me', type:'image', text: ev.target.result, time: now, read:true });
    localStorage.setItem('snm_messages', JSON.stringify(convs));
    const AC = NAV_STATE.mode === 'ete' ? '#fbbf24' : '#22d3ee';
    const GRAD = NAV_STATE.mode === 'ete' ? 'linear-gradient(135deg,#fbbf24,#f97316)' : 'linear-gradient(135deg,#22d3ee,#3b82f6)';
    renderConvMessages(conv, AC, GRAD);
    navTriggerAutoReply(conv);
  };
  reader.readAsDataURL(input.files[0]);
  input.value = '';
}
function navSendGif(emoji) {
  if (!_navActiveConv) return;
  const convs = navGetConversations();
  const conv = convs.find(c => c.id === _navActiveConv);
  if (!conv) return;
  const now = new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
  conv.messages.push({ from:'me', type:'gif', text: emoji, time: now, read:true });
  localStorage.setItem('snm_messages', JSON.stringify(convs));
  const tray = document.getElementById('snm-gif-tray'); if (tray) tray.style.display = 'none';
  const AC = NAV_STATE.mode === 'ete' ? '#fbbf24' : '#22d3ee';
  const GRAD = NAV_STATE.mode === 'ete' ? 'linear-gradient(135deg,#fbbf24,#f97316)' : 'linear-gradient(135deg,#22d3ee,#3b82f6)';
  renderConvMessages(conv, AC, GRAD);
  navTriggerAutoReply(conv);
}
function navMsgLightbox(src) {
  const ex = document.getElementById('snm-msg-lightbox'); if (ex) ex.remove();
  const div = document.createElement('div');
  div.id = 'snm-msg-lightbox';
  div.style.cssText = 'position:fixed;inset:0;z-index:25000;background:rgba(0,0,0,.93);backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:center;cursor:pointer;';
  div.addEventListener('click', () => div.remove());
  div.innerHTML = `<img src="${src}" style="max-width:92vw;max-height:88vh;border-radius:16px;box-shadow:0 40px 80px rgba(0,0,0,.8);">`;
  document.body.appendChild(div);
}

// ─── Réponse auto simulée ────────────────────────────────────────────
function navTriggerAutoReply(conv) {
  navRender();
  setTimeout(() => {
    const replies = ['Trop bien ! 🔥','Haha j\'adore 😂','Carrément 🤙','Nickel 👍','😍😍','Ça déchire !','On en reparle ce soir ?'];
    conv.messages.push({ from:'them', text: replies[Math.floor(Math.random()*replies.length)], time: new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}), read: _navActiveConv === conv.id });
    const convs = navGetConversations();
    const idx = convs.findIndex(c => c.id === conv.id);
    if (idx >= 0) { convs[idx] = conv; localStorage.setItem('snm_messages', JSON.stringify(convs)); }
    if (_navActiveConv === conv.id) {
      const AC = NAV_STATE.mode === 'ete' ? '#fbbf24' : '#22d3ee';
      const GRAD = NAV_STATE.mode === 'ete' ? 'linear-gradient(135deg,#fbbf24,#f97316)' : 'linear-gradient(135deg,#22d3ee,#3b82f6)';
      renderConvMessages(conv, AC, GRAD);
    }
    navRender();
  }, 1200);
}

// ─── Ouvre/crée une conversation par nom de membre (depuis profil dashboard) ──
function navOpenConvWith(name, avatar, color, emoji) {
  const convs = navGetConversations();
  let conv = convs.find(c => c.name === name);
  if (!conv) {
    // Récupère les infos complètes depuis l'annuaire centralisé
    const dir = (typeof window !== 'undefined' && window.SMATCH_MEMBERS) ? window.SMATCH_MEMBERS : {};
    const mkey = (typeof window !== 'undefined' && window.smatchMemberKeyByName) ? window.smatchMemberKeyByName(name) : null;
    const m = mkey ? dir[mkey] : null;
    conv = {
      id: 'c_' + Date.now(),
      name: name,
      avatar: avatar || mkey || name[0].toUpperCase(),
      color: color || (m ? m.color : 'from-slate-500 to-slate-700'),
      emoji: emoji || (m ? m.emoji : '👋'),
      messages: [],
    };
    convs.push(conv);
    localStorage.setItem('snm_messages', JSON.stringify(convs));
  }
  navOpenMessages();
  setTimeout(() => navOpenConv(conv.id), 60);
}

// ─── Voir le profil d'un membre depuis le chat ───────────────────────
function navViewMemberProfile(name) {
  // 1. Si on est sur un dashboard et le membre est dans le crew → fiche complète native
  if (typeof openProfile === 'function' && typeof MEMBER_NAMES !== 'undefined') {
    const key = Object.keys(MEMBER_NAMES).find(k => MEMBER_NAMES[k] === name);
    if (key) {
      const modal = document.getElementById('snm-msg-modal'); if (modal) modal.remove();
      openProfile(key);
      return;
    }
  }
  // 2. Sinon → fiche depuis l'annuaire COMPLET (base + enregistrés + entrants)
  const dir = (typeof smatchAllMembers === 'function') ? smatchAllMembers() : ((typeof window !== 'undefined' && window.SMATCH_MEMBERS) ? window.SMATCH_MEMBERS : {});
  let mkey = (typeof window !== 'undefined' && window.smatchMemberKeyByName) ? window.smatchMemberKeyByName(name) : null;
  let m = mkey ? dir[mkey] : null;
  // Cherche aussi dans tout l'annuaire par nom (clés inc_/val_ non couvertes par memberKeyByName)
  if (!m) {
    const foundKey = Object.keys(dir).find(k => dir[k] && dir[k].name === name);
    if (foundKey) { mkey = foundKey; m = dir[foundKey]; }
  }
  // Sinon, cherche dans les matchs entrants (snm_incoming_matches)
  if (!m) {
    try {
      const inc = JSON.parse(localStorage.getItem('snm_incoming_matches') || '[]').find(x => x.name === name);
      if (inc) {
        mkey = inc.key;
        m = { name: inc.name, age: 20+Math.floor(Math.random()*15), city: inc.spot||'', sport: inc.sport||'', level: 'Confirmé',
          color: inc.mode==='ete'?'from-amber-400 to-orange-500':'from-cyan-400 to-blue-600', tc:'text-slate-950',
          emoji: inc.icon||'', kiffs: [], bio: 'Nouveau rider qui correspond à tes critères !',
          compat: inc.compat||85, rating: 4.6, rCnt: 8, comments: [] };
      }
    } catch (e) {}
  }
  const conv = navGetConversations().find(c => c.name === name);
  const AC = NAV_STATE.mode === 'ete' ? '#fbbf24' : '#22d3ee';
  const ACB = NAV_STATE.mode === 'ete' ? 'rgba(251,191,36,.1)' : 'rgba(34,211,238,.1)';
  const ex = document.getElementById('snm-mini-profile'); if (ex) ex.remove();
  const div = document.createElement('div');
  div.id = 'snm-mini-profile';
  div.className = 'snm-modal-overlay'; div.setAttribute('role','dialog'); div.setAttribute('aria-modal','true');
  div.style.zIndex = '21000';
  div.addEventListener('click', e => { if (e.target === div) div.remove(); });

  const avatar = m ? (mkey) : (conv ? conv.avatar : (name[0]||'?'));
  const color  = m ? m.color : (conv ? conv.color : 'from-slate-500 to-slate-700');

  if (m) {
    // Fiche COMPLÈTE
    const stars = '★'.repeat(Math.round(m.rating)) + '☆'.repeat(5 - Math.round(m.rating));
    div.innerHTML = `
      <div class="snm-modal-box" style="max-width:400px;border:1px solid ${AC}28;">
        <div style="padding:1.4rem 1.4rem 1rem;border-bottom:1px solid rgba(30,41,59,.7);display:flex;align-items:flex-start;gap:1rem;">
          <div style="width:64px;height:64px;border-radius:18px;flex-shrink:0;font-weight:900;color:#020617;display:flex;align-items:center;justify-content:center;font-size:1.6rem;" class="bg-gradient-to-br ${color}">${avatar}</div>
          <div style="flex-grow:1;"><div style="font-size:1.2rem;font-weight:800;color:#fff;">${m.name} ${m.emoji}</div><div style="font-size:.72rem;color:#475569;margin:.2rem 0 .5rem;">${m.age} ans · ${m.city} · ${m.sport} · ${m.level}</div><div style="display:flex;gap:.35rem;flex-wrap:wrap;">${m.kiffs.map(k=>`<span style="font-size:.62rem;font-weight:700;padding:.15rem .55rem;border-radius:9999px;background:${ACB};color:${AC};">${k}</span>`).join('')}</div></div>
          <button onclick="document.getElementById('snm-mini-profile').remove()" style="color:#475569;background:none;border:none;cursor:pointer;font-size:1rem;flex-shrink:0;" onmouseenter="this.style.color='#fff'" onmouseleave="this.style.color='#475569'" aria-label="Fermer"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div style="padding:1.2rem;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:.55rem;margin-bottom:1rem;">
            <div class="snm-card2" style="padding:.7rem;text-align:center;"><div style="font-size:.62rem;color:#475569;margin-bottom:.15rem;">Discipline</div><div style="font-size:.8rem;font-weight:700;color:#fff;">${m.sport}</div></div>
            <div class="snm-card2" style="padding:.7rem;text-align:center;"><div style="font-size:.62rem;color:#475569;margin-bottom:.15rem;">Niveau</div><div style="font-size:.8rem;font-weight:700;color:#fff;">${m.level}</div></div>
            <div class="snm-card2" style="padding:.7rem;text-align:center;"><div style="font-size:.62rem;color:#475569;margin-bottom:.15rem;">Ville</div><div style="font-size:.8rem;font-weight:700;color:#fff;">${m.city}</div></div>
            <div class="snm-card2" style="padding:.7rem;text-align:center;"><div style="font-size:.62rem;color:#475569;margin-bottom:.15rem;">Note</div><div style="font-size:.8rem;font-weight:700;color:${AC};">${m.rating}/5</div></div>
          </div>
          <div class="snm-card2" style="padding:.85rem;font-size:.78rem;color:#94a3b8;line-height:1.6;margin-bottom:1rem;">${m.bio}</div>
          <div style="border-top:1px solid rgba(30,41,59,.6);padding-top:.85rem;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.6rem;"><span style="font-size:.78rem;font-weight:700;color:#fff;">Avis communauté</span><span style="font-size:.78rem;font-weight:800;color:${AC};">${m.rating}/5 (${m.rCnt} avis)</span></div>
            ${m.comments.map(c=>`<div class="snm-card2" style="padding:.7rem;margin-bottom:.4rem;"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.3rem;"><span style="font-size:.7rem;font-weight:700;color:#fff;">${c.author}</span><span style="font-size:.68rem;color:${AC};">${'★'.repeat(c.stars)}</span></div><div style="font-size:.72rem;color:#94a3b8;">${c.text}</div></div>`).join('')}
          </div>
          <div style="display:flex;gap:.6rem;margin-top:1rem;">
            <button onclick="navMergeFromProfile('${m.name.replace(/'/g,"\\'")}','${mkey}')" style="flex:1.5;background:linear-gradient(135deg,${AC},${AC}cc);color:#020617;font-weight:800;font-size:.8rem;padding:.7rem;border-radius:12px;border:none;cursor:pointer;"><i class="fa-solid fa-bolt"></i> Merger</button>
            <button onclick="document.getElementById('snm-mini-profile').remove();navOpenConvWith('${m.name.replace(/'/g,"\\'")}','${mkey}','${m.color}','${m.emoji||''}')" style="flex:1;background:rgba(30,41,59,.65);border:1px solid rgba(71,85,105,.4);color:#cbd5e1;font-weight:700;font-size:.8rem;padding:.7rem;border-radius:12px;cursor:pointer;"><i class="fa-solid fa-message"></i> Message</button>
          </div>
        </div>
      </div>`;
  } else {
    // Fiche allégée (infos limitées) — mais on garde Merger + Message
    const safeName = name.replace(/'/g,"\\'");
    div.innerHTML = `
      <div class="snm-modal-box" style="max-width:340px;border:1px solid ${AC}28;">
        <div style="padding:1.6rem 1.4rem;text-align:center;">
          <div style="width:72px;height:72px;border-radius:20px;margin:0 auto 1rem;font-weight:900;color:#020617;display:flex;align-items:center;justify-content:center;font-size:2rem;" class="bg-gradient-to-br ${color}">${(name[0]||'?').toUpperCase()}</div>
          <div style="font-size:1.2rem;font-weight:800;color:#fff;margin-bottom:.3rem;">${name} ${conv?conv.emoji:''}</div>
          <div style="font-size:.72rem;color:#4ade80;margin-bottom:1.3rem;">● En ligne</div>
          <div style="display:flex;gap:.6rem;">
            <button onclick="navMergeFromProfile('${safeName}','${mkey||('name_'+name)}')" style="flex:1.5;background:linear-gradient(135deg,${AC},${AC}cc);color:#020617;font-weight:800;font-size:.8rem;padding:.7rem;border-radius:12px;border:none;cursor:pointer;"><i class="fa-solid fa-bolt"></i> Merger</button>
            <button onclick="document.getElementById('snm-mini-profile').remove();navOpenConvWith('${safeName}','${(name[0]||'?').toUpperCase()}','${color}','${conv?conv.emoji:''}')" style="flex:1;background:rgba(30,41,59,.65);border:1px solid rgba(71,85,105,.4);color:#cbd5e1;font-weight:700;font-size:.8rem;padding:.7rem;border-radius:12px;cursor:pointer;"><i class="fa-solid fa-message"></i> Message</button>
          </div>
        </div>
      </div>`;
  }
  document.body.appendChild(div);
}

// Envoie une demande de merge depuis n'importe quel profil (messages, dashboard, matchs…)
function navMergeFromProfile(name, mkey) {
  if (typeof SmatchMerge === 'undefined') return;
  const dir = (typeof smatchAllMembers === 'function') ? smatchAllMembers() : (window.SMATCH_MEMBERS||{});
  let m = dir[mkey];
  // Clé de secours "name_X" → on fabrique une clé stable à partir du nom
  if (!m && mkey && mkey.indexOf('name_') === 0) {
    mkey = 'p_' + name.toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,12);
  }
  // Déjà une demande en cours ?
  const existing = SmatchMerge.all().find(r => (r.key === mkey || r.from === name) && r.status !== 'rejected' && r.status !== 'left');
  if (existing) {
    if (typeof showToast === 'function') showToast('⏳ Demande déjà envoyée à ' + name);
    const mp = document.getElementById('snm-mini-profile'); if (mp) mp.remove();
    navOpenDemandesModal();
    return;
  }
  // Enregistre le membre (au cas où) puis envoie
  if (m && typeof smatchRegisterMember === 'function' && mkey.length > 1) {
    smatchRegisterMember(mkey, m);
  }
  const sent = SmatchMerge.send({
    key: mkey, name: name, sport: m?.sport || '', icon: m?.emoji || (NAV_STATE.mode==='ete'?'🏄':'🏂'),
    spot: localStorage.getItem('snm_lieu') || '', compat: m?.compat || 85,
  });
  const mp = document.getElementById('snm-mini-profile'); if (mp) mp.remove();
  if (sent) {
    if (typeof showToast === 'function') showToast('⚡ Demande de merge envoyée à ' + name + ' !');
    // Acceptation simulée
    setTimeout(() => {
      const r = SmatchMerge.get(sent.id);
      if (r && r.status === 'pending') {
        SmatchMerge.update(sent.id, { status: 'accepted', time: 'À l\'instant' });
        navPushNotif('merge', name + ' a accepté ta demande ⚡', 'Discutez pour valider votre trip ensemble', 'demandes');
        navRender();
      }
    }, 2500 + Math.random()*2000);
    navRender();
  } else {
    if (typeof showToast === 'function') showToast('⏳ Demande déjà existante');
  }
}

function navSendMessage() {
  const inp = document.getElementById('snm-msg-input');
  if (!inp || !inp.value.trim() || !_navActiveConv) return;
  const text = inp.value.trim();
  const convs = navGetConversations();
  const conv = convs.find(c => c.id === _navActiveConv);
  if (!conv) return;
  const now = new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
  conv.messages.push({ from:'me', text, time:now, read:true });
  localStorage.setItem('snm_messages', JSON.stringify(convs));
  inp.value = '';
  const AC = NAV_STATE.mode === 'ete' ? '#fbbf24' : '#22d3ee';
  const GRAD = NAV_STATE.mode === 'ete' ? 'linear-gradient(135deg,#fbbf24,#f97316)' : 'linear-gradient(135deg,#22d3ee,#3b82f6)';
  renderConvMessages(conv, AC, GRAD);
  navRender(); // maj badge

  // Réponse auto simulée après 1.2s
  setTimeout(() => {
    const replies = ['Top ! 🤙','Carrément d\'accord 😎','Je te tiens au courant !','Hâte d\'y être 🔥','Ça marche pour moi 👍','Parfait, on fait comme ça 🌊'];
    conv.messages.push({ from:'them', text: replies[Math.floor(Math.random()*replies.length)], time: new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}), read: _navActiveConv === conv.id });
    localStorage.setItem('snm_messages', JSON.stringify(convs));
    if (_navActiveConv === conv.id) {
      // marque lu car la conv est ouverte
      conv.messages[conv.messages.length-1].read = true;
      localStorage.setItem('snm_messages', JSON.stringify(convs));
      renderConvMessages(conv, AC, GRAD);
    }
    navRender();
  }, 1200);
}

// CSS modale partagée (réutilise celle existante si présente)
function navInjectModalCSSIfNeeded() {
  if (document.getElementById('snm-nav-css')) return; // déjà injectée avec navInjectCSS
  navInjectCSS();
}



// ─── Accessibilité : Échap ferme la modale ouverte ───────────────────
function navGlobalEscapeHandler(e) {
  if (e.key !== 'Escape') return;
  // Ferme la bottom sheet mobile si ouverte
  const sheet = document.getElementById('snm-sheet');
  if (sheet) { sheet.remove(); return; }
  // Ferme la dernière modale overlay ouverte
  const overlays = document.querySelectorAll('.snm-modal-overlay');
  if (overlays.length) {
    const last = overlays[overlays.length - 1];
    // display:flex ou block = visible
    if (last && last.style.display !== 'none') { last.remove(); return; }
  }
  // Ferme les dropdowns
  document.querySelectorAll('.snm-dd').forEach(d => d.classList.remove('open'));
}
if (typeof document !== 'undefined') {
  document.addEventListener('keydown', navGlobalEscapeHandler);
}

// ═══════════════════════════════════════════════════════════════════════
//  AUTH GATE — bloque l'accès aux pages protégées sans connexion
// ═══════════════════════════════════════════════════════════════════════
(function navAuthGate() {
  const PROTECTED = ['matchs', 'dashboard'];
  const page = document.body.dataset.page || 'accueil';
  const isAuth = localStorage.getItem('snm_auth') === '1';

  if (PROTECTED.includes(page) && !isAuth) {
    // Mémorise la destination voulue pour y revenir après connexion
    try {
      localStorage.setItem('snm_redirect_after_login', window.location.pathname.split('/').pop() + window.location.search);
    } catch (e) {}
    // Redirige vers l'accueil avec la modale de connexion ouverte + message
    window.location.replace('accueil.html?login=1&gated=1');
  }
})();

// ═══════════════════════════════════════════════════════════════════════
//  AUTO-INIT — fonctionne que DOMContentLoaded soit passé ou non
// ═══════════════════════════════════════════════════════════════════════
(function navAutoInit() {
  function doInit() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode')) { NAV_STATE.mode = params.get('mode'); navSaveState(); }
    navRender();
    navApplyAllSettings();
    // Applique le statut sauvegardé au dashboard dès l'arrivée
    if (document.body.dataset.page === 'dashboard') {
      setTimeout(() => navSyncDashboardStatus(NAV_STATE.status), 50);
    }
    if (params.get('login') === '1') {
      setTimeout(() => {
        navOpenLogin();
        // Bannière explicative si l'utilisateur a été bloqué
        if (params.get('gated') === '1') navShowGateBanner();
      }, 200);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', doInit);
  } else {
    doInit();
  }
  // Accepte les demandes de merge en attente dès le chargement (robuste)
  setTimeout(() => { if (typeof navResolvePendingMerges === 'function') navResolvePendingMerges(); }, 800);
  // Démarre le simulateur d'activité (site vivant)
  setTimeout(() => { if (typeof navStartLifeSimulator === 'function') navStartLifeSimulator(); }, 1500);
})();

// ═══════════════════════════════════════════════════════════════════
//  SIMULATEUR DE VIE — fait vivre le site (matchs, messages entrants)
// ═══════════════════════════════════════════════════════════════════
let _navLifeTimer = null;
function navStartLifeSimulator() {
  if (_navLifeTimer) return;
  if (localStorage.getItem('snm_auth') !== '1') return; // seulement si connecté
  // Résout tout de suite les demandes en attente trop vieilles (ex : page rechargée)
  navResolvePendingMerges();
  // Puis vérifie régulièrement (toutes les 8s) pour accepter les demandes récentes
  setInterval(navResolvePendingMerges, 8000);
  // Cadence "moyenne" : un événement toutes les 45-90s
  const tick = () => {
    navLifeEvent();
    _navLifeTimer = setTimeout(tick, 45000 + Math.random() * 45000);
  };
  _navLifeTimer = setTimeout(tick, 20000 + Math.random() * 20000); // premier après 20-40s
}

// Accepte automatiquement les demandes de merge en attente (l'autre finit toujours par accepter)
function navResolvePendingMerges() {
  if (typeof SmatchMerge === 'undefined') return;
  let changed = false;
  SmatchMerge.all().forEach(r => {
    if (r.status === 'pending') {
      const age = Date.now() - (r.createdAt || 0);
      if (age > 4000) {
        SmatchMerge.update(r.id, { status: 'accepted', time: 'À l\'instant' });
        if (typeof navPushNotif === 'function') navPushNotif('merge', `${r.from} a accepté ta demande ⚡`, 'Discutez pour valider votre trip ensemble', 'demandes');
        changed = true;
      }
    }
  });
  if (changed && typeof navRender === 'function') navRender();
}

function navLifeEvent() {
  if (localStorage.getItem('snm_auth') !== '1') return;
  if (localStorage.getItem('snm_setting_notif_matchs') === '0' && localStorage.getItem('snm_setting_notifs_merge') === '0') return;
  const mode = NAV_STATE.mode;
  const dir = (window.SMATCH_MEMBERS) ? window.SMATCH_MEMBERS : {};
  // Pool de "nouveaux riders" selon la saison
  const pool = mode === 'ete'
    ? [{n:'ZoeWave',e:'🏄',a:'Surf'},{n:'KevGravel',e:'🚴',a:'Gravel'},{n:'NatachaKite',e:'💨',a:'Kitesurf'},{n:'LéaSwell',e:'🌊',a:'Surf'},{n:'TomTrail',e:'🥾',a:'Rando'}]
    : [{n:'LucaLaNeige',e:'🏂',a:'Snowboard'},{n:'SarahPowder',e:'🌨️',a:'Snowboard'},{n:'MaxFreeride',e:'⛷️',a:'Freeride'},{n:'EvaSummit',e:'🏔️',a:'Alpinisme'},{n:'NinoCarve',e:'🎿',a:'Ski'}];
  const who = pool[Math.floor(Math.random() * pool.length)];
  // Cas spécial : un membre d'un de tes crews propose un nouveau venu → tu dois valider
  const myActiveCrews = navGetDashboards().filter(d => new Date(d.dateEnd) > Date.now() && d.mode === mode && d.members > 1);
  if (myActiveCrews.length && Math.random() < 0.25) {
    const crew = myActiveCrews[Math.floor(Math.random()*myActiveCrews.length)];
    navCreateValidationRequest(crew, who);
    return;
  }
  // Type d'événement aléatoire pondéré
  const roll = Math.random();
  if (roll < 0.5) {
    // Nouveau match compatible avec tes dispos
    const compat = 82 + Math.floor(Math.random() * 16);
    navAddIncomingMatch(who, compat, mode);
    navPushNotif('match', `Nouveau match : ${who.n} ${who.e}`, `${who.a} · ${compat}% compatible · dispo sur tes dates`, 'matchs');
  } else if (roll < 0.8) {
    // Message entrant
    const msgs = ['Salut ! Partant pour un trip ? 🤙','Hello, on matche bien on dirait !','Yo, tu pars où cette saison ? 😎','Ça te dit qu\'on se cale un week-end ?'];
    const text = msgs[Math.floor(Math.random()*msgs.length)];
    if (typeof navAddIncomingMessage === 'function') navAddIncomingMessage(who.n, who.e, text);
    navPushNotif('message', `Message de ${who.n} ${who.e}`, text, 'messages');
  } else {
    // Activité de crew (si tu en as) — message d'un VRAI membre, ajouté au chat
    const dbs = navGetDashboards().filter(d => new Date(d.dateEnd) > Date.now());
    const crewMsg = dbs.length ? navAddCrewChatMessage(dbs[Math.floor(Math.random()*dbs.length)]) : null;
    if (crewMsg) {
      navPushNotif('chat', `${crewMsg.memberName} dans ${crewMsg.crewName}`, crewMsg.text, 'crew:'+crewMsg.tripId);
    } else {
      const compat = 80 + Math.floor(Math.random() * 18);
      navAddIncomingMatch(who, compat, mode);
      navPushNotif('match', `${who.n} correspond à tes critères ${who.e}`, `${who.a} · ${compat}% · vous avez les mêmes dates`, 'matchs');
    }
  }
}

// Ajoute un vrai message d'un membre du crew dans le chat (cohérent avec le dashboard)
function navAddCrewChatMessage(dash) {
  try {
    // Récupère le trip pour connaître les membres + le chat de base
    let trip = null;
    const fresh = JSON.parse(localStorage.getItem('snm_fresh_trips') || '{}');
    if (fresh[dash.id]) trip = fresh[dash.id];
    else if (typeof SMATCH_TRIPS !== 'undefined' && SMATCH_TRIPS[dash.id]) trip = SMATCH_TRIPS[dash.id];
    if (!trip) return null;
    const dir = (typeof smatchAllMembers === 'function') ? smatchAllMembers() : (typeof SMATCH_MEMBERS !== 'undefined' ? SMATCH_MEMBERS : {});
    const others = (trip.memberKeys || []).filter(k => k !== 'R' && dir[k]);
    if (!others.length) return null;
    // Limite : pas de discussion infinie. Max 6 messages "auto" récents d'affilée.
    const baseChat = trip.chat || [];
    const chat = (typeof smatchGetCrewChat === 'function') ? smatchGetCrewChat(dash.id, baseChat) : baseChat;
    const recentAuto = chat.slice(-6).filter(m => m.auto).length;
    if (recentAuto >= 4) return null; // on laisse retomber le calme
    const k = others[Math.floor(Math.random()*others.length)];
    const member = dir[k];
    const isEte = trip.mode === 'ete';
    const lines = isEte
      ? ['On part à quelle heure finalement ? 🚗','J\'ai trouvé un super spot pas loin 🌊','Qui ramène le matos de snorkeling ?','Hâte d\'y être les amis ! ☀️','On réserve le resto pour le 1er soir ?']
      : ['Quelqu\'un a réservé les forfaits ? 🎿','La météo annonce de la poudreuse ! ❄️','On se retrouve où au départ ?','J\'ai hâte de rider avec vous 🏂','Pensez à prendre vos masques de rechange'];
    const text = lines[Math.floor(Math.random()*lines.length)];
    const now = new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
    if (typeof smatchAddCrewChatMessage === 'function') {
      smatchAddCrewChatMessage(dash.id, { key: k, name: member.name, msg: text, time: now, me: false, auto: true }, baseChat);
    }
    return { memberName: member.name, crewName: dash.name, text, tripId: dash.id };
  } catch (e) { return null; }
}

// Un membre du crew propose un nouveau venu → demande de validation
function navCreateValidationRequest(crew, who) {
  try {
    const reqs = JSON.parse(localStorage.getItem('snm_validation_reqs') || '[]');
    if (reqs.some(r => r.crewId === crew.id && r.newcomer === who.n)) return;
    const dir = (typeof smatchAllMembers === 'function') ? smatchAllMembers() : {};
    const trip = (function(){ try { const f = JSON.parse(localStorage.getItem('snm_fresh_trips')||'{}'); return f[crew.id] || (typeof SMATCH_TRIPS!=='undefined'?SMATCH_TRIPS[crew.id]:null); } catch(e){ return null; } })();
    const members = trip && trip.memberKeys ? trip.memberKeys.filter(k=>k!=='R'&&dir[k]) : [];
    const proposer = members.length ? dir[members[Math.floor(Math.random()*members.length)]].name : 'Un membre';
    const compat = 80 + Math.floor(Math.random()*18);
    reqs.unshift({
      id: 'val_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,6), crewId: crew.id, crewName: crew.name, mode: crew.mode,
      newcomer: who.n, icon: who.e, sport: who.a, compat, proposer, time: Date.now(),
    });
    localStorage.setItem('snm_validation_reqs', JSON.stringify(reqs.slice(0,20)));
    navPushNotif('crew', `${proposer} propose ${who.n} pour ${crew.name}`, `${who.a} · ${compat}% · Valide ou refuse son entrée`, 'validation:'+crew.id);
  } catch (e) {}
}

function navGetValidationReqs() {
  try { return JSON.parse(localStorage.getItem('snm_validation_reqs') || '[]'); } catch(e) { return []; }
}

function navOpenValidationModal(crewId) {
  const reqs = navGetValidationReqs().filter(r => !crewId || r.crewId === crewId);
  if (!reqs.length) { if (typeof showToast==='function') showToast('Aucune validation en attente'); return; }
  const r = reqs[0];
  const AC = NAV_STATE.mode === 'ete' ? '#fbbf24' : '#22d3ee';
  const ex = document.getElementById('snm-validation-modal'); if (ex) ex.remove();
  const div = document.createElement('div');
  div.id = 'snm-validation-modal'; div.className = 'snm-modal-overlay';
  div.setAttribute('role','dialog'); div.setAttribute('aria-modal','true');
  div.addEventListener('click', e => { if (e.target === div) div.remove(); });
  div.innerHTML = `<div class="snm-modal-box" style="max-width:400px;border:1px solid ${AC}28;">
    <div style="padding:1.2rem 1.3rem .8rem;border-bottom:1px solid rgba(30,41,59,.6);">
      <div style="font-size:.57rem;font-weight:800;color:${AC};text-transform:uppercase;letter-spacing:.06em;">Validation du crew</div>
      <div style="font-size:.95rem;font-weight:800;color:#fff;margin-top:.15rem;">🗳️ Nouveau venu proposé</div>
      <div style="font-size:.72rem;color:#94a3b8;margin-top:.3rem;line-height:1.4;"><strong style="color:#fff;">${r.proposer}</strong> propose d'ajouter <strong style="color:${AC};">${r.newcomer}</strong> au crew <strong>${r.crewName}</strong>.</div>
    </div>
    <div style="padding:1.1rem 1.3rem;">
      <div style="display:flex;align-items:center;gap:.8rem;padding:.8rem;background:rgba(15,23,42,.5);border-radius:14px;margin-bottom:1rem;">
        <div style="width:46px;height:46px;border-radius:50%;background:rgba(30,41,59,.8);display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;">${r.icon}</div>
        <div style="flex-grow:1;"><div style="font-size:.9rem;font-weight:800;color:#fff;">${r.newcomer}</div><div style="font-size:.68rem;color:#94a3b8;">${r.sport} · Compatibilité ${r.compat}%</div></div>
      </div>
      <div style="display:flex;gap:.7rem;">
        <button onclick="navResolveValidation('${r.id}',false)" style="flex:1;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#f87171;font-weight:700;font-size:.78rem;padding:.65rem;border-radius:12px;cursor:pointer;">Refuser</button>
        <button onclick="navResolveValidation('${r.id}',true)" style="flex:1.6;background:linear-gradient(135deg,#4ade80,#16a34a);color:#020617;font-weight:800;font-size:.78rem;padding:.65rem;border-radius:12px;border:none;cursor:pointer;">✓ Accepter l'arrivée</button>
      </div>
    </div>
  </div>`;
  document.body.appendChild(div);
}

function navResolveValidation(id, accept) {
  const reqs = navGetValidationReqs();
  const r = reqs.find(x => x.id === id);
  const remaining = reqs.filter(x => x.id !== id);
  localStorage.setItem('snm_validation_reqs', JSON.stringify(remaining));
  const modal = document.getElementById('snm-validation-modal'); if (modal) modal.remove();
  if (r && accept) {
    // Ajoute réellement le nouveau au crew (membre simulé + log)
    const key = 'val_' + Date.now().toString(36);
    if (typeof smatchRegisterMember === 'function') {
      smatchRegisterMember(key, { name: r.newcomer, age: 20+Math.floor(Math.random()*15), city: r.crewName, sport: r.sport, level: 'Confirmé', color: r.mode==='ete'?'from-amber-400 to-orange-500':'from-cyan-400 to-blue-600', tc:'text-slate-950', emoji: r.icon, kiffs:[], rating:4.5, rCnt:5, comments:[], isSelf:false });
    }
    if (typeof SmatchMerge !== 'undefined' && SmatchMerge.addMemberToCrew) SmatchMerge.addMemberToCrew(key, r.crewId);
    if (typeof showToast === 'function') showToast('🎉 ' + r.newcomer + ' a rejoint ' + r.crewName + ' !');
    navPushNotif('crew', `${r.newcomer} a rejoint ${r.crewName} 🎉`, 'Tu as validé son arrivée dans le crew', 'crew:'+r.crewId);
  } else if (r) {
    if (typeof showToast === 'function') showToast('Entrée de ' + r.newcomer + ' refusée');
  }
  navRender();
}

// Stocke un nouveau match entrant (apparaîtra dans "Mes Matchs")
function navAddIncomingMatch(who, compat, mode) {
  try {
    const matches = JSON.parse(localStorage.getItem('snm_incoming_matches') || '[]');
    if (matches.some(m => m.name === who.n)) return;
    matches.unshift({
      key: 'inc_' + Date.now().toString(36) + Math.random().toString(36).slice(2,5), name: who.n, icon: who.e, sport: who.a,
      compat: compat, mode: mode, isNew: true,
      spot: localStorage.getItem('snm_lieu') || '',
      dispo: 'Tes dates', time: Date.now(),
    });
    localStorage.setItem('snm_incoming_matches', JSON.stringify(matches.slice(0, 20)));
  } catch (e) {}
}


// Bannière "connexion requise"
function navShowGateBanner() {
  if (document.getElementById('snm-gate-banner')) return;
  const isEte = NAV_STATE.mode === 'ete';
  const AC = isEte ? '#fbbf24' : '#22d3ee';
  const b = document.createElement('div');
  b.id = 'snm-gate-banner';
  b.style.cssText = `position:fixed;top:70px;left:50%;transform:translateX(-50%) translateY(-12px);z-index:21000;background:rgba(10,15,30,.98);border:1px solid ${AC}55;border-radius:14px;padding:.7rem 1.3rem;font-size:.78rem;font-weight:700;color:${AC};backdrop-filter:blur(14px);box-shadow:0 10px 34px rgba(0,0,0,.5);opacity:0;transition:opacity .4s,transform .4s;display:flex;align-items:center;gap:.55rem;white-space:nowrap;`;
  b.innerHTML = `<i class="fa-solid fa-lock"></i> Connecte-toi pour accéder à cette section 🔒`;
  document.body.appendChild(b);
  requestAnimationFrame(() => { b.style.opacity = '1'; b.style.transform = 'translateX(-50%) translateY(0)'; });
  setTimeout(() => { b.style.opacity = '0'; b.style.transform = 'translateX(-50%) translateY(-12px)'; setTimeout(() => b.remove(), 400); }, 4500);
}
