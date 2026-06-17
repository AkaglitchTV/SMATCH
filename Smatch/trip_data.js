/**
 * trip_data.js — Base de données des trips Smatch
 * Source de vérité unique pour tous les dashboards.
 * Chargé par dashboard_hiver.html ET dashboard_ete.html.
 */

const SMATCH_TRIPS = {

  // ══════════════════ HIVER ══════════════════
  'dh1': {
    id: 'dh1', mode: 'hiver',
    name: 'Crew Chamonix', spot: 'Chamonix Mont-Blanc',
    emoji: '⛷️', dateStart: '2026-02-14', dateEnd: '2026-02-21',
    members: 5, memberKeys: ['R','L','S','T','M'],
    accentColor: '#22d3ee', accentGrad: 'from-cyan-400 to-blue-600',
    budget: { base: 579, label: '579€', saving: '130€' },
    budgetLines: [
      { name: 'Chalet (7 nuits, 5 pers.)', sub: '186€ / pers.', amount: '930€', status: 'reserved', statusLabel: '✓ Réservé', statusColor: 'emerald' },
      { name: 'Forfaits ski (6j, 5 pers.)', sub: '298€ / pers. — éco. de 130€', amount: '1 490€', status: 'pending', statusLabel: '⚠️ À confirmer', statusColor: 'amber' },
    ],
    roadmap: [
      { date: '2026-02-14', title: 'Départ groupé', sub: 'Covoiturage Annecy + Lyon. RDV 7h00 Aire de Voglans. Arrivée ~11h30.', icon: 'fa-car', color: 'cyan', badge: 'Covoiturage · 4h30' },
      { date: '2026-02-14', title: 'Check-in chalet', sub: 'Chalet Les Chamois · 5 ch · Wi-Fi · Jacuzzi. Check-in 15h00.', icon: 'fa-house', color: 'blue', badge: 'Logement · 7 nuits', extra: '✓ Réservé · 186€/pers.' },
      { date: '2026-02-15', title: 'Forfaits remontées', sub: 'Mont-Blanc Unlimited 6 jours. Tarif groupe -8%.', icon: 'fa-ticket', color: 'violet', badge: 'Mont-Blanc Unlimited · 6j', extra: '⚠️ À confirmer · 298€/pers.' },
      { date: '2026-02-18', title: 'Soirée Raclette', sub: 'Grande raclette au chalet + blind test musical montagne.', icon: 'fa-utensils', color: 'orange', badge: 'Activité groupe' },
      { date: '2026-02-20', title: 'Journée Spa', sub: 'Les Bains du Mont-Blanc. Jacuzzi extérieur vue glacier.', icon: 'fa-spa', color: 'emerald', badge: 'Optionnel', participate: true, participants: '2/5' },
    ],
    station: {
      title: 'Chamonix Mont-Blanc', temp: '-8°C', snow: '120 cm',
      meteo: '7j', lifts: '42/52', pistes: '170 km', forfait: '298€',
      alert: '✅ Conditions excellentes prévues la semaine du 14 fév.',
      alertSub: 'Poudreuse fraîche prévue mercredi 19 fév. ☃️',
    },
    chat: [
      { key: 'L', name: 'LucaLaNeige', time: '14:32', msg: "Yo les gars ! Trop hâte de rider ensemble ! 🤙", me: false },
      { key: 'S', name: 'SarahPowder', time: '14:35', msg: "Le chalet a l'air dingue ! Le jacuzzi 🔥", me: false },
      { key: 'R', name: 'Toi', time: '14:38', msg: "Premières traces samedi 8h30 ?", me: true },
      { key: 'T', name: 'ThomasOff-Piste', time: '14:41', msg: "👍 Chaud ! Grands Montets direct ?", me: false },
      { key: 'M', name: 'MaevaRideuse', time: '14:44', msg: "J'amène du fromage savoyard 🧀🏔️", me: false },
    ],
    shopItems: [
      { id:1, name:'Raclette 🧀', price:28, payer:'M', active:['R','L','S','T','M'] },
      { id:2, name:'Lait 🥛', price:4, payer:'R', active:['R','L','S','T','M'] },
      { id:3, name:'Pain 🥖', price:6, payer:'L', active:['R','L','S','T','M'] },
      { id:4, name:'Vin rouge 🍷', price:15, payer:'S', active:['R','L'] },
      { id:5, name:'Café ☕', price:8, payer:'R', active:['R','S','M'] },
    ],
    export: {
      name: 'Crew Chamonix', label: 'Crew Chamonix',
      icsEvents: [
        { date:'2026-02-14', title:'Départ groupé', desc:'Covoiturage Annecy→Chamonix, RDV 7h00' },
        { date:'2026-02-14', title:'Check-in chalet', desc:'Chalet Les Chamois, 7 nuits, 186€/pers.' },
        { date:'2026-02-15', title:'Forfaits remontées', desc:'Mont-Blanc Unlimited 6j, 298€/pers.' },
        { date:'2026-02-18', title:'Soirée Raclette', desc:'Grande raclette + blind test' },
        { date:'2026-02-20', title:'Journée Spa', desc:'Les Bains du Mont-Blanc' },
        { date:'2026-02-21', title:'Retour', desc:'Fin du séjour Chamonix 2026' },
      ],
    },
  },

  'dh0': {
    id: 'dh0', mode: 'hiver',
    name: 'Méribel 2025', spot: 'Méribel 3 Vallées',
    emoji: '🎿', dateStart: '2025-03-12', dateEnd: '2025-03-17',
    members: 4, memberKeys: ['R','L','S','T'],
    accentColor: '#22d3ee', accentGrad: 'from-cyan-400 to-blue-600',
    budget: { base: 420, label: '420€', saving: '85€' },
    budgetLines: [
      { name: 'Appartement Belleville (5 nuits)', sub: '120€ / pers.', amount: '480€', status: 'reserved', statusLabel: '✓ Réservé', statusColor: 'emerald' },
      { name: 'Forfaits 3 Vallées (5j)', sub: '300€ / pers. — tarif groupe', amount: '1 200€', status: 'reserved', statusLabel: '✓ Réservé', statusColor: 'emerald' },
    ],
    roadmap: [
      { date: '2025-03-12', title: 'Départ groupé', sub: 'Covoiturage Lyon → Méribel. Départ 6h30. Arrivée ~11h.', icon: 'fa-car', color: 'cyan', badge: 'Covoiturage · 4h' },
      { date: '2025-03-12', title: "Check-in appartement", sub: "Appart Belleville · 4 ch. Check-in 14h00.", icon: 'fa-house', color: 'blue', badge: 'Logement · 5 nuits', extra: '✓ Réservé · 120€/pers.' },
      { date: '2025-03-13', title: 'Forfaits 3 Vallées', sub: 'Pass 3 Vallées 5 jours. Domaine skiable 600 km.', icon: 'fa-ticket', color: 'violet', badge: '3 Vallées · 5j', extra: '✓ Réservé · 300€/pers.' },
      { date: '2025-03-15', title: 'Folie Douce', sub: 'La soirée la plus légendaire de la semaine 🎉', icon: 'fa-music', color: 'orange', badge: 'Soirée iconic' },
      { date: '2025-03-17', title: 'Retour', sub: 'Tous fatigués, tous heureux. On refera ça !', icon: 'fa-flag-checkered', color: 'emerald', badge: 'Fin du séjour' },
    ],
    station: {
      title: 'Méribel — 3 Vallées', temp: '-5°C', snow: '180 cm',
      meteo: '5j', lifts: '58/68', pistes: '600 km', forfait: '300€',
      alert: '📸 Trip terminé — mars 2025.',
      alertSub: 'Conditions étaient parfaites. Poudreuse tout le séjour ! 🏔️',
    },
    chat: [
      { key: 'L', name: 'LucaLaNeige', time: '09:12', msg: "C'était LEGENDARY ce trip 🔥", me: false },
      { key: 'S', name: 'SarahPowder', time: '09:15', msg: "La Folie Douce... je peux pas y croire", me: false },
      { key: 'R', name: 'Toi', time: '09:18', msg: "On repart l'année prochaine ? 🎿", me: true },
      { key: 'T', name: 'ThomasOff-Piste', time: '09:21', msg: "100% ! Déjà les dates ?", me: false },
    ],
    shopItems: [],
    export: {
      name: 'Méribel 2025', label: 'Méribel 2025',
      icsEvents: [
        { date:'2025-03-12', title:'Départ', desc:'Covoiturage Lyon→Méribel' },
        { date:'2025-03-12', title:'Check-in Appart Belleville', desc:'5 nuits, 120€/pers.' },
        { date:'2025-03-13', title:'Forfaits 3 Vallées', desc:'Pass 5j, 300€/pers.' },
        { date:'2025-03-15', title:'Folie Douce', desc:'La soirée légendaire 🎉' },
        { date:'2025-03-17', title:'Retour', desc:'Fin du séjour Méribel 2025' },
      ],
    },
  },

  // ══════════════════ ÉTÉ ══════════════════
  'de1': {
    id: 'de1', mode: 'ete',
    name: 'Crew Hossegor', spot: 'Hossegor Côte des Basques',
    emoji: '🏄', dateStart: '2026-08-05', dateEnd: '2026-08-12',
    members: 5, memberKeys: ['R','Z','K','N','B'],
    accentColor: '#fbbf24', accentGrad: 'from-amber-400 to-orange-500',
    budget: { base: 494, label: '494€', saving: '95€' },
    budgetLines: [
      { name: 'Villa Les Pins (7 nuits, 5 pers.)', sub: '200€ / pers.', amount: '1 000€', status: 'reserved', statusLabel: '✓ Réservée', statusColor: 'emerald' },
      { name: 'Location planches surf (7j)', sub: '45€ / pers.', amount: '225€', status: 'pending', statusLabel: '⚠️ À confirmer', statusColor: 'amber' },
    ],
    roadmap: [
      { date: '2026-08-05', title: 'Départ groupé', sub: "Covoiturage Bordeaux + Toulouse. RDV 8h00 Aire d'Onesse. Arrivée ~13h30.", icon: 'fa-car', color: 'amber', badge: 'Covoiturage · 5h' },
      { date: '2026-08-05', title: 'Check-in villa', sub: 'Villa Les Pins · 5 ch · Piscine · BBQ. Check-in 16h00.', icon: 'fa-house', color: 'blue', badge: '7 nuits · Piscine', extra: '✓ Réservée · 200€/pers.' },
      { date: '2026-08-06', title: 'Première session surf', sub: "Côte des Basques · 7h30 · Houle O 1.5m · Vent léger offshore.", icon: 'fa-water', color: 'amber', badge: 'Côte des Basques' },
      { date: '2026-08-08', title: 'Soirée Barbecue', sub: 'Grande terrasse + soirée beach coucher de soleil. 🌅', icon: 'fa-fire', color: 'orange', badge: 'Activité groupe' },
      { date: '2026-08-11', title: 'Tournoi Beach-volley', sub: 'Tournoi inter-crew sur la plage centrale. 5€/pers.', icon: 'fa-trophy', color: 'emerald', badge: 'Optionnel', participate: true, participants: '3/5' },
    ],
    station: {
      title: 'Hossegor — Conditions Surf',
      temp: '26°C', snow: '1.5 m', meteo: '32°C', lifts: '12 km/h',
      pistes: '4/5', forfait: '45€',
      alert: '✅ Conditions excellentes jeudi matin dès 7h30 !',
      alertSub: 'Houle longue 14s, vent léger offshore. Planche longue recommandée.',
      isSurf: true,
    },
    chat: [
      { key: 'Z', name: 'ZoeWave', time: '11:20', msg: "Les vagues sont parfaites demain matin ! 🌊", me: false },
      { key: 'K', name: 'KevGravel', time: '11:35', msg: "J'ai amené du rosé frais 🍷☀️", me: false },
      { key: 'R', name: 'Toi', time: '11:42', msg: "Réveil 6h45 pour l'early session ? 🤙", me: true },
      { key: 'N', name: 'NatachaKite', time: '11:45', msg: "On y est ! BBQ ce soir aussi ! 🔥🥩", me: false },
    ],
    shopItems: [
      { id:1, name:'Côtes de bœuf 🥩', price:45, payer:'R', active:['R','Z','K','N','B'] },
      { id:2, name:'Rosé 🍷', price:18, payer:'Z', active:['R','Z','K','N','B'] },
      { id:3, name:'Pain & fromage 🧀', price:12, payer:'K', active:['R','Z','K','N','B'] },
      { id:4, name:'Crème solaire ☀️', price:8, payer:'N', active:['R','Z','N'] },
      { id:5, name:'Café ☕', price:6, payer:'R', active:['R','Z','K'] },
    ],
    export: {
      name: 'Crew Hossegor', label: 'Crew Hossegor',
      icsEvents: [
        { date:'2026-08-05', title:'Départ groupé', desc:"Covoiturage → Hossegor, RDV 8h00" },
        { date:'2026-08-05', title:'Check-in villa', desc:'Villa Les Pins · piscine · 200€/pers.' },
        { date:'2026-08-06', title:'Première session surf', desc:'Côte des Basques 7h30 — Houle 1.5m' },
        { date:'2026-08-08', title:'Soirée Barbecue', desc:'Grande terrasse + after-beach' },
        { date:'2026-08-11', title:'Tournoi Beach-volley', desc:'Tournoi inter-crew plage centrale' },
        { date:'2026-08-12', title:'Départ retour', desc:'Fin du trip Hossegor 2026 🌊' },
      ],
    },
  },
};

/**
 * Retourne le trip actif selon snm_active_trip_id ou le premier du bon mode.
 */
function smatchGetActiveTrip() {
  // Helper : cherche un trip dans les trips officiels OU les trips fraîchement créés (merge)
  function _findTrip(id) {
    if (id && SMATCH_TRIPS[id]) return _applyTripOverrides(SMATCH_TRIPS[id], id);
    try {
      const fresh = JSON.parse(localStorage.getItem('snm_fresh_trips') || '{}');
      if (id && fresh[id]) return _hydrateFreshTrip(fresh[id]);
    } catch (e) {}
    return null;
  }
  // Applique les modifs utilisateur (nom/lieu/dates) à un trip officiel
  function _applyTripOverrides(trip, id) {
    try {
      const ov = JSON.parse(localStorage.getItem('snm_trip_overrides') || '{}');
      if (ov[id]) {
        const t = JSON.parse(JSON.stringify(trip));
        if (ov[id].name)      t.name = ov[id].name;
        if (ov[id].spot)    { t.spot = ov[id].spot; if (t.station) t.station.title = ov[id].spot; }
        if (ov[id].dateStart) t.dateStart = ov[id].dateStart;
        if (ov[id].dateEnd)   t.dateEnd = ov[id].dateEnd;
        if (ov[id].roadmap)   t.roadmap = ov[id].roadmap;
        return t;
      }
    } catch (e) {}
    return trip;
  }
  // Priority 1: URL param ?trip=xxx
  if (typeof window !== 'undefined') {
    const urlParam = new URLSearchParams(window.location.search).get('trip');
    const t = _findTrip(urlParam);
    if (t) { localStorage.setItem('snm_active_trip_id', urlParam); return t; }
  }
  // Priority 2: localStorage
  const id   = localStorage.getItem('snm_active_trip_id');
  const mode = localStorage.getItem('snm_mode') || 'hiver';
  const t = _findTrip(id);
  if (t) return t;
  // Default: first trip matching mode
  return Object.values(SMATCH_TRIPS).find(t => t.mode === mode) || Object.values(SMATCH_TRIPS)[0];
}

// Complète un trip fraîchement créé (merge) avec les membres réels + structures vides
// Génère un chat de démo pour un crew : membres qui discutent + salutations des nouveaux
function _smatchSeedCrewChat(trip) {
  if (trip.chat && trip.chat.length) return trip.chat;
  const keys = (trip.memberKeys || ['R']).filter(k => k !== 'R');
  const dir = (typeof SMATCH_MEMBERS !== 'undefined') ? SMATCH_MEMBERS : {};
  const isEte = trip.mode === 'ete';
  const spot = (trip.spot || '').split(/[ ,]/)[0] || 'le spot';
  const chat = [];
  let t = 9 * 60;
  const time = () => { const h = Math.floor(t / 60), m = t % 60; t += 3 + Math.floor(Math.random() * 8); return String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0'); };

  if (keys.length) {
    const m0 = dir[keys[0]];
    if (m0) {
      const openers = isEte
        ? [`Hello le crew ! Trop hâte pour ${spot} 🌊`, `Yo ! On va se régaler à ${spot} ☀️`, `Salut tout le monde, prêts pour ${spot} ? 🏄`]
        : [`Salut la team ! Vivement ${spot} ❄️`, `Hello ! Trop hâte de rider à ${spot} 🏂`, `Yo le crew, ça va être épique à ${spot} ! ⛷️`];
      chat.push({ key: keys[0], name: m0.name, msg: openers[Math.floor(Math.random()*openers.length)], time: time(), me: false });
    }
  }
  chat.push({ key: 'R', name: 'Toi', msg: isEte ? 'Carrément ! On planifie ça 🙌' : 'Hâte aussi ! On cale les détails 🔥', time: time(), me: true });

  // Petit échange de logistique pour rendre le chat vivant dès le départ
  if (keys.length) {
    const m0 = dir[keys[0]];
    if (m0) {
      const followUps = isEte
        ? [`On part de quelle ville ? Je peux prendre des gens en voiture 🚗`, `Faut qu'on réserve le logement vite, ça part vite à ${spot} !`, `Qui gère les réservations resto ? 🍽️`]
        : [`On réserve les forfaits ensemble ? Ça revient moins cher 🎿`, `Faut penser au covoiturage, qui a une caisse ? 🚙`, `Je regarde les chalets dispo et je vous fais un récap 🏠`];
      chat.push({ key: keys[0], name: m0.name, msg: followUps[Math.floor(Math.random()*followUps.length)], time: time(), me: false });
      chat.push({ key: 'R', name: 'Toi', msg: isEte ? 'Top, je m\'occupe du planning et je partage 📋' : 'Nickel, je lance un doc partagé pour tout centraliser 📋', time: time(), me: true });
    }
  }

  for (let i = 1; i < keys.length; i++) {
    const m = dir[keys[i]];
    if (!m) continue;
    const greetings = isEte
      ? [`Hey ! Ravi de rejoindre le crew 🤙`, `Salut à tous, merci pour l'accueil ! 😎`, `Yo ! Content d'être dans l'équipe 🌴`]
      : [`Salut tout le monde, merci de m'accueillir ! 🙏`, `Hello le crew, trop content d'en être 🤝`, `Yo ! Prêt à tout déchirer avec vous ❄️`];
    chat.push({ key: keys[i], name: m.name, msg: greetings[Math.floor(Math.random()*greetings.length)], time: time(), me: false });
    if (keys[0] && keys[0] !== keys[i]) {
      const m0 = dir[keys[0]];
      if (m0) chat.push({ key: keys[0], name: m0.name, msg: ['Bienvenue à bord ! 🎉','Trop bien, on est au complet 🙌','Welcome ! 🤙'][i % 3], time: time(), me: false });
    }
  }
  return chat;
}

function _hydrateFreshTrip(trip) {
  const t = JSON.parse(JSON.stringify(trip));
  const isEte = t.mode === 'ete';
  // Budget en OBJET (comme les vrais trips) — initialisé à 0
  t.budget = { base: 0, label: '0€', saving: '0€' };
  // Dates : prochaine date cohérente avec la saison (évite "Invalid Date"/"NaNj")
  if (!t.dateStart || !t.dateEnd) {
    const now = new Date();
    const year = now.getFullYear();
    let start;
    if (isEte) {
      // Prochain été (juillet). Si on est déjà après juillet, l'année prochaine.
      start = new Date(now.getMonth() > 6 ? year + 1 : year, 6, 15);
    } else {
      // Prochain hiver (février). Si on est déjà après février, l'année prochaine.
      start = new Date(now.getMonth() > 1 ? year + 1 : year, 1, 14);
    }
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    t.dateStart = start.toISOString().slice(0, 10);
    t.dateEnd   = end.toISOString().slice(0, 10);
  }
  // Structures vides prêtes à remplir
  t.roadmap = t.roadmap && t.roadmap.length ? t.roadmap : [];
  t.budgetLines = t.budgetLines || [];
  t.shopItems = t.shopItems || [];
  // Chat de démo : fais parler les membres, avec salutation des nouveaux
  t.chat = _smatchSeedCrewChat(t);
  t.accentGrad = isEte ? 'from-amber-400 to-orange-500' : 'from-cyan-400 to-blue-600';
  t.accentColor = isEte ? '#fbbf24' : '#22d3ee';
  // Station avec le BON schéma + valeurs fictives mais réalistes pour la démo
  if (!t.station || !t.station.title) {
    if (isEte) {
      const temps = ['24°C','26°C','27°C','28°C'], waves = ['1.2 m','1.5 m','1.8 m','2.1 m'], winds = ['10 km/h','14 km/h','18 km/h'], waters = ['21°C','22°C','23°C'];
      const pick = a => a[Math.floor(Math.random()*a.length)];
      t.station = {
        title: t.spot + ' — Conditions Surf', isSurf: true,
        temp: pick(temps), snow: pick(waves), meteo: pick(temps),
        lifts: pick(winds), pistes: '4 spots', forfait: 'Gratuit',
        alert: '🌊 Belles vagues prévues — sessions au lever du soleil recommandées.',
        alertSub: 'Eau à ' + pick(waters) + ', conditions idéales pour le crew. 🏄',
      };
    } else {
      const temps = ['-4°C','-6°C','-8°C','-10°C'], snows = ['80 cm','120 cm','150 cm','180 cm'], lifts = ['28/34','35/42','40/48'], pistes = ['90 km','120 km','150 km'], forfaits = ['258€','280€','298€','312€'];
      const pick = a => a[Math.floor(Math.random()*a.length)];
      t.station = {
        title: t.spot, isSurf: false,
        temp: pick(temps), snow: pick(snows), meteo: '7j',
        lifts: pick(lifts), pistes: pick(pistes), forfait: pick(forfaits),
        alert: '❄️ Bonnes conditions de neige prévues pour votre séjour.',
        alertSub: 'Poudreuse fraîche attendue — pensez à réserver vos forfaits groupe ! 🏔️',
      };
    }
  }
  // Export ICS vide
  if (!t.export) t.export = { icsEvents: [] };
  return t;
}

/**
 * SMATCH_MEMBERS — Annuaire centralisé des membres (source de vérité unique)
 * Utilisé par dashboard_hiver, dashboard_ete ET la messagerie (nav.js).
 * Chaque membre a TOUJOURS un profil complet : name, age, city, sport,
 * level, color, tc, phone, bio, kiffs, rating, rCnt, comments, emoji.
 * Pour ajouter un membre : copier un bloc et remplir TOUS les champs.
 */
const SMATCH_MEMBERS = {
  R: { name:'RiderDu74', age:26, city:'Annecy', sport:'Snowboard & Surf', level:'Avancé', color:'from-cyan-400 to-blue-600', tc:'text-slate-950', emoji:'🏂', phone:'+33 6 12 34 56 78', bio:"Passionné de glisse depuis 10 ans. Snow l'hiver, surf l'été. Amateur de raclette, de BBQ et d'après-ski tardifs.", kiffs:['🎿 Premières traces','🍻 Après-Ski','🔥 BBQ'], rating:4.8, rCnt:12, isSelf:true, comments:[{author:'LucaLaNeige',text:'Super rider, toujours partant pour les premières traces !',stars:5,date:'3 jan.'},{author:'SarahPowder',text:'Organisé et sympa.',stars:5,date:'12 déc.'}] },
  L: { name:'LucaLaNeige', age:28, city:'Annecy', sport:'Snowboard', level:'Avancé', color:'from-cyan-400 to-blue-600', tc:'text-slate-950', emoji:'🏂', phone:'+33 6 22 33 44 55', bio:"Snowboarder depuis l'ado, je vis pour la poudreuse. Chamonix c'est ma deuxième maison.", kiffs:['🎿 Premières traces','🧀 Raclette','🍻 Après-Ski'], rating:4.7, rCnt:9, isSelf:false, comments:[{author:'RiderDu74',text:'Excellent rider, connaît tous les spots !',stars:5,date:'5 jan.'}] },
  S: { name:'SarahPowder', age:25, city:'Lyon', sport:'Snowboard', level:'Expert', color:'from-violet-500 to-purple-700', tc:'text-white', emoji:'🌨️', phone:'+33 6 55 66 77 88', bio:"Snowboardeuse experte, j'adore le hors-piste et les faces nord. Fan de spa après une bonne journée.", kiffs:['🌨️ Hors-piste','🧖 Spa'], rating:4.9, rCnt:21, isSelf:false, comments:[{author:'LucaLaNeige',text:'Super équipière, très bonne vibe.',stars:5,date:'18 déc.'}] },
  T: { name:'ThomasOff-Piste', age:31, city:'Grenoble', sport:'Ski', level:'Expert', color:'from-orange-400 to-red-600', tc:'text-white', emoji:'🎿', phone:'+33 6 98 76 54 32', bio:"Skieur freeride depuis 15 ans. Pisteur secouriste bénévole. Je ne ski que hors-piste.", kiffs:['🍻 Après-Ski','🧀 Raclette'], rating:4.6, rCnt:7, isSelf:false, comments:[{author:'SarahPowder',text:'Connaît parfaitement le terrain.',stars:5,date:'8 jan.'}] },
  M: { name:'MaevaRideuse', age:27, city:'Clermont-Fd', sport:'Ski & Snow', level:'Avancé', color:'from-emerald-400 to-teal-600', tc:'text-white', emoji:'⛷️', phone:'+33 6 11 22 33 44', bio:"Je ride tout : ski, snow, les deux si possible ! Fan de spa. J'apporte toujours du fromage 🧀", kiffs:['🧖 Spa','🧀 Raclette'], rating:4.5, rCnt:5, isSelf:false, comments:[{author:'LucaLaNeige',text:'Super présence dans le groupe !',stars:5,date:'15 déc.'}] },
  Z: { name:'ZoeWave', age:24, city:'Hossegor', sport:'Surf', level:'Confirmée', color:'from-amber-400 to-orange-500', tc:'text-slate-950', emoji:'🏄', phone:'+33 7 11 22 33 44', bio:"Surfeuse côtière depuis l'enfance. Je connais chaque spot d'Hossegor par cœur.", kiffs:['🌊 Early session','🍹 Sunset','🏖️ Beach'], rating:4.9, rCnt:16, isSelf:false, comments:[{author:'KevGravel',text:'La meilleure pour les spots !',stars:5,date:'10 juil.'}] },
  K: { name:'KevGravel', age:29, city:'Bordeaux', sport:'Gravel', level:'Confirmé', color:'from-lime-400 to-green-600', tc:'text-slate-950', emoji:'🚴', phone:'+33 7 22 33 44 55', bio:"Gravel & bikepacking enthusiast. Traversé les Pyrénées 3 fois. Toujours une bière dans le bidon.", kiffs:['🚴 Gravel','☕ Café étape','⛺ Bivouac'], rating:4.7, rCnt:11, isSelf:false, comments:[{author:'ZoeWave',text:'Toujours partant, grande énergie !',stars:5,date:'5 juil.'}] },
  N: { name:'NatachaKite', age:26, city:'Palavas', sport:'Kitesurf', level:'Avancée', color:'from-sky-400 to-cyan-600', tc:'text-slate-950', emoji:'💨', phone:'+33 7 33 44 55 66', bio:"Kitesurfeuse confirmée, je chasse les conditions partout en Europe.", kiffs:['💨 Kitesurf','🌊 Waterstart','📸 Aérien'], rating:4.6, rCnt:8, isSelf:false, comments:[{author:'KevGravel',text:'Niveau impressionnant !',stars:5,date:'2 juil.'}] },
  B: { name:'BaptisteWake', age:32, city:'Annecy', sport:'Wakeboard', level:'Expert', color:'from-rose-400 to-pink-600', tc:'text-white', emoji:'🛥️', phone:'+33 7 44 55 66 77', bio:"Wakebordiste sur le lac d'Annecy depuis 10 ans. Le lac c'est ma piscine privée.", kiffs:['🛥️ Bateau','🏊 Baignade','🎉 Ambiance'], rating:4.4, rCnt:7, isSelf:false, comments:[{author:'ZoeWave',text:'Super ambiance !',stars:5,date:'15 juil.'}] },
};

// Nom → clé (lookup inverse)
function smatchMemberKeyByName(name) {
  // Cherche d'abord dans l'annuaire de base, puis dans les membres enregistrés (merge)
  const inBase = Object.keys(SMATCH_MEMBERS).find(k => SMATCH_MEMBERS[k].name === name);
  if (inBase) return inBase;
  const reg = _smatchRegisteredMembers();
  return Object.keys(reg).find(k => reg[k].name === name) || null;
}

// Membres enregistrés dynamiquement (candidats fusionnés) — persistés
function _smatchRegisteredMembers() {
  try { return JSON.parse(localStorage.getItem('snm_registered_members') || '{}'); } catch (e) { return {}; }
}
function smatchRegisterMember(key, profile) {
  const reg = _smatchRegisteredMembers();
  reg[key] = profile;
  localStorage.setItem('snm_registered_members', JSON.stringify(reg));
  // Ajoute aussi à l'annuaire en mémoire pour cette session
  if (typeof SMATCH_MEMBERS !== 'undefined') SMATCH_MEMBERS[key] = profile;
}
// Annuaire complet = base + enregistrés (pour les dashboards)
function smatchAllMembers() {
  return Object.assign({}, SMATCH_MEMBERS, _smatchRegisteredMembers());
}

// ─── Chat de crew persistant (source unique partagée dashboard + notifs) ──────
// Retourne le chat persisté pour ce crew, ou initialise avec le chat de base
function smatchGetCrewChat(tripId, baseChat) {
  try {
    const stored = localStorage.getItem('snm_crewchat_' + tripId);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  // Pas encore de chat persisté → on initialise avec le chat de base
  const init = Array.isArray(baseChat) ? baseChat.slice() : [];
  try { localStorage.setItem('snm_crewchat_' + tripId, JSON.stringify(init)); } catch (e) {}
  return init;
}
function smatchSaveCrewChat(tripId, chat) {
  try { localStorage.setItem('snm_crewchat_' + tripId, JSON.stringify((chat||[]).slice(-200))); } catch (e) {}
}
// Ajoute un message au chat persisté (et le retourne)
function smatchAddCrewChatMessage(tripId, msg, baseChat) {
  const chat = smatchGetCrewChat(tripId, baseChat);
  chat.push(msg);
  smatchSaveCrewChat(tripId, chat);
  return chat;
}

/**
 * SMATCH_ADVENTURER — couche "Profil d'aventurier" (badges, fiabilité, vérif).
 * Indexée par clé membre. Source de vérité unique pour les dashboards + profil.
 */
const SMATCH_ADVENTURER = {
  R: { tripsDone:7, tripsTotal:8, onTimeRate:0.95, replyRate:0.92, verified:true,  joinedYear:2023, badges:['organizer','punctual','content','streak'] },
  L: { tripsDone:11,tripsTotal:12,onTimeRate:0.98, replyRate:0.88, verified:true,  joinedYear:2022, badges:['veteran','punctual','local'] },
  S: { tripsDone:21,tripsTotal:22,onTimeRate:0.96, replyRate:0.95, verified:true,  joinedYear:2021, badges:['veteran','expert','organizer','punctual'] },
  T: { tripsDone:6, tripsTotal:7, onTimeRate:0.90, replyRate:0.80, verified:true,  joinedYear:2023, badges:['rescuer','expert'] },
  M: { tripsDone:5, tripsTotal:6, onTimeRate:0.92, replyRate:0.85, verified:false, joinedYear:2024, badges:['foodie','goodvibes'] },
  Z: { tripsDone:16,tripsTotal:17,onTimeRate:0.94, replyRate:0.97, verified:true,  joinedYear:2022, badges:['local','content','earlybird','organizer'] },
  K: { tripsDone:11,tripsTotal:13,onTimeRate:0.88, replyRate:0.90, verified:true,  joinedYear:2023, badges:['explorer','goodvibes','streak'] },
  N: { tripsDone:8, tripsTotal:9, onTimeRate:0.93, replyRate:0.86, verified:false, joinedYear:2024, badges:['expert','content'] },
  B: { tripsDone:7, tripsTotal:8, onTimeRate:0.85, replyRate:0.82, verified:true,  joinedYear:2023, badges:['goodvibes','foodie'] },
};

// Catalogue des badges (icône, label, description)
const SMATCH_BADGES = {
  organizer: { icon:'⭐', label:'Super-organisateur',  desc:'Organise et mène les trips de main de maître' },
  punctual:  { icon:'🤝', label:'Toujours ponctuel',    desc:'Jamais en retard à un point de rendez-vous' },
  content:   { icon:'📸', label:'Roi du contenu',       desc:'Ramène toujours photos et vidéos du trip' },
  streak:    { icon:'🔥', label:'En feu',               desc:'3 crews ou plus ce mois-ci' },
  veteran:   { icon:'🏔️', label:'Vétéran',              desc:'Plus de 10 trips complétés' },
  local:     { icon:'📍', label:'Local du coin',        desc:'Connaît tous les spots de sa région' },
  expert:    { icon:'🎓', label:'Expert technique',     desc:'Niveau confirmé ou expert' },
  rescuer:   { icon:'🛟', label:'Sécurité avant tout',  desc:'Formé aux premiers secours' },
  foodie:    { icon:'🧀', label:'Chef de crew',         desc:'Régale le groupe à chaque trip' },
  goodvibes: { icon:'😎', label:'Bonne ambiance',       desc:"L'ambiance du groupe, c'est lui/elle" },
  explorer:  { icon:'🧭', label:'Explorateur',          desc:'Toujours partant pour de nouveaux spots' },
  earlybird: { icon:'🌅', label:'Lève-tôt',             desc:'Premier sur le spot, toujours' },
};

/**
 * Score de fiabilité (0-100). Pondère complétion 35%, ponctualité 25%,
 * réactivité 20%, note communauté 15%, vérification 5%.
 */
function smatchReliabilityScore(key) {
  const a = SMATCH_ADVENTURER[key];
  const m = SMATCH_MEMBERS[key];
  if (!a || !m) return null;
  const completion = a.tripsTotal ? a.tripsDone / a.tripsTotal : 0;
  const ratingNorm = (m.rating || 0) / 5;
  const score = Math.round(
    completion * 35 + a.onTimeRate * 25 + a.replyRate * 20 + ratingNorm * 15 + (a.verified ? 5 : 0)
  );
  let tier, tierColor;
  if (score >= 90)      { tier = 'Légendaire'; tierColor = '#fbbf24'; }
  else if (score >= 78) { tier = 'Très fiable'; tierColor = '#4ade80'; }
  else if (score >= 62) { tier = 'Fiable';      tierColor = '#22d3ee'; }
  else                  { tier = 'En rodage';   tierColor = '#94a3b8'; }
  return { score, tier, tierColor };
}

/**
 * SMATCH COMPATIBILITY ENGINE — calcul de compatibilité crew intelligent
 * Compare le profil de l'utilisateur (localStorage) à un profil candidat.
 * Retourne un score 0-100 pondéré + un détail explicable par critère.
 *
 * Critères et pondérations :
 *   - Niveau (22%)        : proximité des niveaux de glisse
 *   - Disponibilité (20%) : chevauchement des dispos
 *   - Intensité (18%)     : style de ride (chill ↔ extrême)
 *   - Budget (14%)        : compatibilité de budget
 *   - Kiffs (16%)         : centres d'intérêt partagés
 *   - Géo (10%)           : proximité géographique (covoiturage)
 */
const SMATCH_LEVELS    = ['debutant','intermediaire','avance','expert'];
const SMATCH_INTENSITY = ['chill','active','sportif','extreme'];
const SMATCH_BUDGETS   = ['eco','medium','luxe'];

// Coordonnées approximatives pour la proximité géographique (covoiturage)
const SMATCH_CITY_COORDS = {
  'annecy':[45.90,6.13],'lyon':[45.76,4.84],'grenoble':[45.19,5.72],
  'clermont-fd':[45.78,3.08],'chambery':[45.56,5.92],'genève':[46.20,6.14],
  'hossegor':[43.66,-1.40],'bordeaux':[44.84,-0.58],'biarritz':[43.48,-1.56],
  'palavas':[43.53,3.93],'montpellier':[43.61,3.88],'toulouse':[43.60,1.44],
  'paris':[48.86,2.35],'marseille':[43.30,5.37],'nantes':[47.22,-1.55],
};

function _smatchGeoScore(cityA, cityB) {
  if (!cityA || !cityB) return 60;
  const _lookupCoord = c => {
    const k = c.toLowerCase().trim();
    if (SMATCH_CITY_COORDS[k]) return SMATCH_CITY_COORDS[k];
    try { const x = JSON.parse(localStorage.getItem('snm_extra_coords') || '{}'); return x[k] || null; } catch (e) { return null; }
  };
  const a = _lookupCoord(cityA);
  const b = _lookupCoord(cityB);
  if (!a || !b) return 60;
  // Distance haversine simplifiée (km)
  const R = 6371, dLat = (b[0]-a[0])*Math.PI/180, dLon = (b[1]-a[1])*Math.PI/180;
  const lat1 = a[0]*Math.PI/180, lat2 = b[0]*Math.PI/180;
  const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
  const dist = 2 * R * Math.asin(Math.sqrt(h));
  // 0 km = 100, 600 km+ = 30
  return Math.max(30, Math.round(100 - dist / 6));
}

function _smatchOrdinalScore(arr, a, b) {
  const ia = arr.indexOf(a), ib = arr.indexOf(b);
  if (ia < 0 || ib < 0) return 70;
  const gap = Math.abs(ia - ib), maxGap = arr.length - 1;
  return Math.round(100 - (gap / maxGap) * 65); // même = 100, opposé = 35
}

// Score de disponibilité : combine type de dispo + chevauchement de dates
function _smatchDispoScore(me, profile) {
  // Base : compatibilité des types de dispo
  let typeScore;
  if (me.dispo_type && profile.dispo_type) {
    if (me.dispo_type === profile.dispo_type) typeScore = 95;
    else if (me.dispo_type === 'flexible' || profile.dispo_type === 'flexible') typeScore = 85;
    else typeScore = 65;
  } else {
    typeScore = (profile.compat_d && profile.compat_d.dispo) ? profile.compat_d.dispo : 78;
  }
  // Bonus/malus selon le chevauchement de dates si les deux ont des dates
  const myFrom = me.dateFrom ? new Date(me.dateFrom) : null;
  const myTo   = me.dateTo ? new Date(me.dateTo) : myFrom;
  const pFrom  = profile.dateFrom ? new Date(profile.dateFrom) : null;
  const pTo    = profile.dateTo ? new Date(profile.dateTo) : pFrom;
  if (myFrom && pFrom && !isNaN(myFrom) && !isNaN(pFrom)) {
    // Chevauchement ?
    const overlapStart = Math.max(myFrom.getTime(), pFrom.getTime());
    const overlapEnd   = Math.min(myTo.getTime(), pTo.getTime());
    if (overlapStart <= overlapEnd) {
      return Math.min(100, typeScore + 5); // dates qui se chevauchent → top
    }
    // Pas de chevauchement : pénalité selon l'écart
    const gapDays = (overlapStart - overlapEnd) / 86400000;
    if (gapDays <= 7)  return Math.max(55, typeScore - 15); // proche (même mois)
    if (gapDays <= 30) return Math.max(45, typeScore - 30);
    return Math.max(30, typeScore - 45);                    // très éloigné
  }
  return typeScore;
}

function _smatchKiffsScore(kiffsA, kiffsB) {
  if (!kiffsA || !kiffsB || !kiffsA.length || !kiffsB.length) return 55;
  // Compare les emojis/thèmes (normalise en retirant les espaces)
  const norm = s => s.toLowerCase().replace(/[\s]/g,'');
  const setA = new Set(kiffsA.map(norm));
  let shared = 0;
  kiffsB.forEach(k => { if (setA.has(norm(k))) shared++; });
  const ratio = shared / Math.max(kiffsA.length, kiffsB.length);
  return Math.round(45 + ratio * 55); // 0 commun = 45, tous communs = 100
}

/**
 * Calcule la compatibilité entre l'utilisateur courant et un profil candidat.
 * @param {object} profile - profil candidat {level, intensity, budget, kiffs, city/ville}
 * @param {object} [me] - profil utilisateur (sinon lu depuis localStorage)
 * @returns {object} {score, breakdown:{niveau,dispo,intensite,budget,kiffs,geo}, reasons:[...], topReason}
 */
function smatchComputeCompat(profile, me) {
  // Profil utilisateur depuis localStorage si non fourni
  if (!me) {
    me = {
      level:     localStorage.getItem('snm_level')     || 'avance',
      intensity: localStorage.getItem('snm_intensity') || 'sportif',
      budget:    localStorage.getItem('snm_budget')    || 'medium',
      dispo_type:localStorage.getItem('snm_dispo_type')|| 'flexible',
      dateFrom:  localStorage.getItem('snm_date_from') || '',
      dateTo:    localStorage.getItem('snm_date_to')   || '',
      city:      localStorage.getItem('snm_ville')     || 'Annecy',
      kiffs:     (function(){ try { return JSON.parse(localStorage.getItem('snm_kiffs')||'[]'); } catch(e){ return []; } })(),
    };
  }
  const pCity = profile.city || profile.ville || '';
  const pKiffs = profile.kiffs || [];

  // Scores par critère
  const sNiveau    = _smatchOrdinalScore(SMATCH_LEVELS, me.level, profile.level);
  const sIntensite = _smatchOrdinalScore(SMATCH_INTENSITY, me.intensity, profile.intensity);
  const sBudget    = _smatchOrdinalScore(SMATCH_BUDGETS, me.budget, profile.budget);
  const sKiffs     = _smatchKiffsScore(me.kiffs, pKiffs);
  const sGeo       = _smatchGeoScore(me.city, pCity);
  // Dispo : combine le type ET le chevauchement de dates si disponibles
  const sDispo = _smatchDispoScore(me, profile);

  const breakdown = { niveau:sNiveau, dispo:sDispo, intensite:sIntensite, budget:sBudget, kiffs:sKiffs, geo:sGeo };

  // Score pondéré
  const score = Math.round(
    sNiveau*0.22 + sDispo*0.20 + sIntensite*0.18 + sBudget*0.14 + sKiffs*0.16 + sGeo*0.10
  );

  // Raisons explicables (triées par contribution)
  const reasons = [];
  if (sNiveau >= 80)    reasons.push({ icon:'🎯', txt:'Niveau de glisse très proche', score:sNiveau });
  else if (sNiveau < 55) reasons.push({ icon:'⚠️', txt:'Écart de niveau à anticiper', score:sNiveau });
  if (sKiffs >= 70)     reasons.push({ icon:'💚', txt:'Vous partagez plusieurs kiffs', score:sKiffs });
  if (sGeo >= 80)       reasons.push({ icon:'🚗', txt:'Proches géographiquement (covoiturage facile)', score:sGeo });
  else if (sGeo >= 65)  reasons.push({ icon:'🗺️', txt:'Distance raisonnable pour se rejoindre', score:sGeo });
  if (sIntensite >= 80) reasons.push({ icon:'⚡', txt:'Même style de ride', score:sIntensite });
  else if (sIntensite < 55) reasons.push({ icon:'🔀', txt:'Styles de ride différents', score:sIntensite });
  if (sBudget >= 85)    reasons.push({ icon:'💰', txt:'Budgets alignés', score:sBudget });
  if (sDispo >= 90)     reasons.push({ icon:'📅', txt:'Disponibilités qui matchent', score:sDispo });

  reasons.sort((a,b) => b.score - a.score);
  const topReason = reasons.length ? reasons[0] : { icon:'✨', txt:'Profil intéressant à découvrir', score:score };

  return { score, breakdown, reasons, topReason };
}

/**
 * Expose pour nav.js et autres pages
 */
if (typeof window !== 'undefined') {
  window.SMATCH_TRIPS    = SMATCH_TRIPS;
  window.smatchGetActiveTrip = smatchGetActiveTrip;
  window.SMATCH_MEMBERS  = SMATCH_MEMBERS;
  window.smatchMemberKeyByName = smatchMemberKeyByName;
  window.smatchRegisterMember = smatchRegisterMember;
  window.smatchAllMembers = smatchAllMembers;
  window.smatchGetCrewChat = smatchGetCrewChat;
  window.smatchAddCrewChatMessage = smatchAddCrewChatMessage;
  window.smatchSaveCrewChat = smatchSaveCrewChat;
  window.smatchComputeCompat = smatchComputeCompat;
  window.SMATCH_ADVENTURER = SMATCH_ADVENTURER;
  window.SMATCH_BADGES = SMATCH_BADGES;
  window.smatchReliabilityScore = smatchReliabilityScore;
}

/**
 * SmatchMerge — Moteur du "Tunnel de fusion" (Merge → Crew).
 * Gère les 3 étapes : demande en attente → chat de négo → union → nouveau crew.
 * Tout est persisté dans localStorage. L'autre partie est simulée de façon
 * crédible (acceptation auto + réponses de négo), prêt à brancher un vrai
 * backend plus tard sur la même structure.
 */
// Vérifie si une personne (par clé ou nom) est déjà membre d'un de tes crews actifs
function _smatchAlreadyInActiveCrew(key, name) {
  try {
    const dashboards = JSON.parse(localStorage.getItem('snm_dashboards') || '[]');
    const fresh = JSON.parse(localStorage.getItem('snm_fresh_trips') || '{}');
    const now = Date.now();
    for (const d of dashboards) {
      if (new Date(d.dateEnd) <= now && !d.fromMerge) continue; // souvenir → on ignore
      let trip = fresh[d.id] || (typeof SMATCH_TRIPS !== 'undefined' ? SMATCH_TRIPS[d.id] : null);
      if (!trip || !trip.memberKeys) continue;
      // Match par clé directe
      if (trip.memberKeys.includes(key)) return true;
      // Match par nom (clés différentes mais même personne)
      if (name) {
        const dir = (typeof smatchAllMembers === 'function') ? smatchAllMembers() : SMATCH_MEMBERS;
        for (const k of trip.memberKeys) {
          if (dir[k] && dir[k].name === name) return true;
        }
      }
    }
  } catch (e) {}
  return false;
}

const SmatchMerge = {
  _key: 'snm_merge_requests',

  all() {
    try { return JSON.parse(localStorage.getItem(this._key) || '[]'); } catch (e) { return []; }
  },
  save(list) {
    localStorage.setItem(this._key, JSON.stringify(list));
  },

  // Étape 1 — Envoyer une demande de merge (statut: pending)
  send(profile) {
    const list = this.all();
    if (list.find(r => r.key === profile.key && r.status !== 'rejected')) return null;
    // Déjà dans un de nos crews actifs ? → pas de nouvelle invitation
    if (_smatchAlreadyInActiveCrew(profile.key, profile.name)) return null;
    const mode = localStorage.getItem('snm_mode') || 'hiver';
    const req = {
      id: 'mr_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8),
      key: profile.key,
      from: profile.name,
      icon: profile.icon || (mode === 'ete' ? '🏄' : '🏂'),
      activity: profile.sport || profile.activity || '',
      spot: profile.spot || localStorage.getItem('snm_lieu') || '',
      compat: profile.compat || 0,
      mode: mode,
      status: 'pending',          // pending → accepted → negotiating → united
      direction: 'sent',          // 'sent' (toi→lui) ou 'received' (lui→toi)
      time: 'À l\'instant',
      chat: [],                   // chat éphémère de négociation
      meConfirmed: false,
      themConfirmed: false,
      createdAt: Date.now(),
    };
    list.unshift(req);
    this.save(list);
    return req;
  },

  get(id) { return this.all().find(r => r.id === id) || null; },

  update(id, patch) {
    const list = this.all();
    const r = list.find(x => x.id === id);
    if (!r) return null;
    Object.assign(r, patch);
    this.save(list);
    return r;
  },

  // Étape 1→2 — Accepter une demande : ouvre le chat de négo
  accept(id) {
    return this.update(id, { status: 'negotiating', time: 'Maintenant' });
  },
  reject(id) {
    return this.update(id, { status: 'rejected', time: 'Maintenant' });
  },

  // Chat de négociation
  addChat(id, from, text) {
    const r = this.get(id); if (!r) return null;
    r.chat = r.chat || [];
    r.chat.push({ from, text, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) });
    return this.update(id, { chat: r.chat });
  },

  // Étape 2→3 — Confirmer l'union (côté "moi")
  confirm(id) {
    const r = this.update(id, { meConfirmed: true });
    // Simule la confirmation de l'autre peu après si pas déjà fait
    return r;
  },

  // Vrai test : les deux ont confirmé ?
  isUnited(id) {
    const r = this.get(id);
    return r && r.meConfirmed && r.themConfirmed;
  },

  // Étape 3 — Crée le nouveau crew (dashboard) à partir de la demande
  // Intègre un membre à un crew existant (après validation des membres)
  addMemberToCrew(memberKey, tripId) {
    // Cherche le trip : fresh d'abord, sinon officiel (mais seuls les fresh sont modifiables côté user)
    let fresh = {};
    try { fresh = JSON.parse(localStorage.getItem('snm_fresh_trips') || '{}'); } catch (e) {}
    let trip = fresh[tripId];
    let isFresh = !!trip;
    if (!trip && typeof SMATCH_TRIPS !== 'undefined' && SMATCH_TRIPS[tripId]) {
      // Clone un trip officiel vers fresh pour pouvoir le modifier
      trip = JSON.parse(JSON.stringify(SMATCH_TRIPS[tripId]));
      isFresh = true;
    }
    if (!trip) return null;
    trip.memberKeys = trip.memberKeys || ['R'];
    if (!trip.memberKeys.includes(memberKey)) trip.memberKeys.push(memberKey);
    trip.members = trip.memberKeys.length;
    // Salutation du nouveau membre dans le chat du crew (+ réponse d'un membre)
    // Seed le chat de base s'il est vide (membres existants qui discutent)
    if (!trip.chat || !trip.chat.length) {
      const baseTrip = JSON.parse(JSON.stringify(trip));
      baseTrip.memberKeys = trip.memberKeys.filter(k => k !== memberKey); // chat AVANT l'arrivée
      trip.chat = _smatchSeedCrewChat(baseTrip);
    }
    const m = (typeof SMATCH_MEMBERS !== 'undefined') ? SMATCH_MEMBERS[memberKey] : null;
    const newName = m ? m.name : memberKey;
    if (m) {
      const isEte = trip.mode === 'ete';
      const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      const greet = isEte ? `Hey le crew ! Merci de m'accueillir, hâte d'y être 🤙` : `Salut tout le monde ! Trop content de rejoindre le crew 🙏`;
      trip.chat.push({ key: memberKey, name: newName, msg: greet, time: now, me: false });
      // Un membre existant souhaite la bienvenue
      const others = trip.memberKeys.filter(k => k !== 'R' && k !== memberKey);
      if (others.length) {
        const w = SMATCH_MEMBERS[others[0]];
        if (w) trip.chat.push({ key: others[0], name: w.name, msg: `Bienvenue ${newName} ! 🎉`, time: now, me: false });
      }
    }
    fresh[tripId] = trip;
    localStorage.setItem('snm_fresh_trips', JSON.stringify(fresh));
    // Journalise l'arrivée du membre
    try {
      const log = JSON.parse(localStorage.getItem('snm_crewlog_' + tripId) || '[]');
      log.unshift({ who: localStorage.getItem('snm_pseudo') || 'RiderDu74', action: '🎉 Arrivée', detail: newName + ' a rejoint le crew', time: Date.now() });
      localStorage.setItem('snm_crewlog_' + tripId, JSON.stringify(log.slice(0, 100)));
    } catch (e) {}
    // Met à jour l'entrée dashboard (compteur de membres)
    try {
      const dbs = JSON.parse(localStorage.getItem('snm_dashboards') || '[]');
      const d = dbs.find(x => x.id === tripId);
      if (d) { d.members = trip.members; d.isNew = true; localStorage.setItem('snm_dashboards', JSON.stringify(dbs)); }
    } catch (e) {}
    return { tripId, members: trip.members, newName, memberKey };
  },

  createCrew(id) {
    const r = this.get(id);
    if (!r) return null;
    const mode = r.mode || 'hiver';
    const spot = r.spot || (mode === 'ete' ? 'Hossegor' : 'Chamonix');
    const tripId = 'crew_' + Date.now();
    const isEte = mode === 'ete';

    // Membres : toi (R) + la personne fusionnée
    const memberKey = r.key;

    // Dates : héritées de la dispo choisie lors de la recherche, sinon dates saisonnières
    let dateStart = localStorage.getItem('snm_date_from') || '';
    let dateEnd   = localStorage.getItem('snm_date_to')   || '';
    if (!dateStart || !dateEnd) {
      const now = new Date(), year = now.getFullYear();
      let s;
      if (isEte) s = new Date(now.getMonth() > 6 ? year + 1 : year, 6, 15);
      else       s = new Date(now.getMonth() > 1 ? year + 1 : year, 1, 14);
      const e = new Date(s); e.setDate(e.getDate() + 6);
      dateStart = s.toISOString().slice(0, 10);
      dateEnd   = e.toISOString().slice(0, 10);
    } else {
      // Si les dates choisies sont déjà passées, on les reporte à l'année suivante
      // (un crew fraîchement formé doit être un trip À VENIR, pas un souvenir)
      const now = new Date(); now.setHours(0,0,0,0);
      let dS = new Date(dateStart), dE = new Date(dateEnd);
      if (dE < now) {
        const shift = (now.getFullYear() - dE.getFullYear()) + 1;
        dS.setFullYear(dS.getFullYear() + shift);
        dE.setFullYear(dE.getFullYear() + shift);
        dateStart = dS.toISOString().slice(0, 10);
        dateEnd   = dE.toISOString().slice(0, 10);
      }
    }

    // Dashboard "vierge" : budget à 0, courses vides, roadmap minimale
    const newTrip = {
      id: tripId,
      mode: mode,
      name: 'Crew ' + spot.split(/[ ,]/)[0],
      spot: spot,
      emoji: isEte ? '☀️' : '❄️',
      dateStart: dateStart,
      dateEnd: dateEnd,
      members: 2,
      memberKeys: ['R', memberKey],
      accentColor: isEte ? '#fbbf24' : '#22d3ee',
      budget: 0,
      fresh: true,
      budgetLines: [],
      roadmap: [],
      shopItems: [],
      chat: [],
      fromMerge: true,
    };

    // Ajoute à la liste des dashboards de l'utilisateur
    let dashboards = [];
    try { dashboards = JSON.parse(localStorage.getItem('snm_dashboards') || '[]'); } catch (e) {}
    dashboards.unshift({
      id: tripId, mode: mode, name: newTrip.name, spot: spot,
      dateEnd: newTrip.dateEnd, members: 2,
      url: (isEte ? 'dashboard_ete.html' : 'dashboard_hiver.html') + '?trip=' + tripId,
      isNew: true, fromMerge: true,
    });
    localStorage.setItem('snm_dashboards', JSON.stringify(dashboards));

    // Stocke le trip fraîchement créé (pour que le dashboard le lise)
    let freshTrips = {};
    try { freshTrips = JSON.parse(localStorage.getItem('snm_fresh_trips') || '{}'); } catch (e) {}
    freshTrips[tripId] = newTrip;
    localStorage.setItem('snm_fresh_trips', JSON.stringify(freshTrips));

    // La demande devient "unie"
    this.update(id, { status: 'united', tripId: tripId });
    localStorage.setItem('snm_mode', mode);
    localStorage.setItem('snm_active_trip_id', tripId);
    return { tripId, url: dashboards[0].url, mode };
  },
};

function _smatchFutureDate(mode) {
  const d = new Date();
  d.setMonth(d.getMonth() + (mode === 'ete' ? 2 : 3));
  return d.toISOString().slice(0, 10);
}

if (typeof window !== 'undefined') {
  window.SmatchMerge = SmatchMerge;
  window._smatchFutureDate = _smatchFutureDate;
}
