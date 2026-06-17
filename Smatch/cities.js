/**
 * cities.js — Grandes villes mondiales pour Smatch, taguées par terrain.
 * Chaque ville : [nom, [tags terrain]]
 * Tags : mtn (montagne/ski), sea (mer/surf), lake (lac), river (rivière),
 *        urban (ville/culture), climb (escalade/falaise), bike (vélo/gravel)
 * Une ville sans contrainte forte (grande ville) a 'urban' + souvent d'autres.
 * smatchSearchCities(query, terrains) filtre selon les terrains requis.
 */
const SMATCH_CITIES = {
  "🇫🇷 France": [
    ["Paris",["urban","river","bike"]],["Marseille",["urban","sea","climb"]],["Lyon",["urban","river","bike"]],
    ["Toulouse",["urban","bike"]],["Nice",["urban","sea","mtn"]],["Nantes",["urban","river"]],
    ["Montpellier",["urban","sea","bike"]],["Strasbourg",["urban","river","bike"]],["Bordeaux",["urban","river","bike","sea"]],
    ["Lille",["urban","bike"]],["Rennes",["urban"]],["Grenoble",["urban","mtn","climb","bike"]],
    ["Annecy",["urban","lake","mtn","bike"]],["Chambéry",["urban","mtn","lake"]],["Toulon",["urban","sea"]],
    ["Biarritz",["urban","sea"]],["Hossegor",["sea"]],["Chamonix",["mtn","climb"]],["Bayonne",["urban","sea","river"]],
    ["Pau",["urban","mtn","bike"]],["Clermont-Ferrand",["urban","mtn","bike"]],["Aix-en-Provence",["urban","climb"]],
    ["Avignon",["urban","river"]],["Perpignan",["urban","sea","mtn"]],["Brest",["urban","sea"]],
    ["La Rochelle",["urban","sea"]],["Dijon",["urban","bike"]],
    ["Albertville",["mtn"]],["Briançon",["mtn","climb"]],["Gap",["mtn","bike"]],["Tignes",["mtn"]],
    ["Val d'Isère",["mtn"]],["Méribel",["mtn"]],["Courchevel",["mtn"]],["Morzine",["mtn","bike"]],
    ["Les Deux Alpes",["mtn"]],["La Clusaz",["mtn"]],["Megève",["mtn"]],["Anglet",["sea","urban"]],
    ["Capbreton",["sea"]],["Lacanau",["sea"]],["Quiberon",["sea"]],["Verdon",["climb","river","mtn"]]
  ],
  "🇨🇭 Suisse": [
    ["Genève",["urban","lake","mtn"]],["Zurich",["urban","lake"]],["Bâle",["urban","river"]],
    ["Lausanne",["urban","lake","mtn"]],["Berne",["urban","river"]],["Lucerne",["urban","lake","mtn"]],
    ["Sion",["mtn","climb"]],["Verbier",["mtn"]],["Zermatt",["mtn","climb"]],["Davos",["mtn"]],
    ["Saint-Moritz",["mtn","lake"]],["Interlaken",["mtn","lake","climb"]],["Montreux",["urban","lake"]],
    ["Crans-Montana",["mtn"]],["Grindelwald",["mtn","climb"]]
  ],
  "🇮🇹 Italie": [
    ["Rome",["urban"]],["Milan",["urban"]],["Naples",["urban","sea"]],["Turin",["urban","mtn","bike"]],
    ["Florence",["urban","bike"]],["Venise",["urban","sea"]],["Bologne",["urban","bike"]],["Gênes",["urban","sea"]],
    ["Vérone",["urban","lake"]],["Cortina d'Ampezzo",["mtn","climb"]],["Bolzano",["mtn","climb","bike"]],
    ["Aoste",["mtn","climb"]],["Courmayeur",["mtn","climb"]],["Sestriere",["mtn"]],["Livigno",["mtn"]],
    ["Cervinia",["mtn"]],["Bari",["urban","sea"]],["Palerme",["urban","sea"]],["Catane",["urban","sea","mtn"]]
  ],
  "🇪🇸 Espagne": [
    ["Madrid",["urban"]],["Barcelone",["urban","sea","climb"]],["Valence",["urban","sea"]],["Séville",["urban","river"]],
    ["Saragosse",["urban","river"]],["Malaga",["urban","sea"]],["Bilbao",["urban","sea"]],["Saint-Sébastien",["urban","sea"]],
    ["Grenade",["urban","mtn"]],["Palma",["urban","sea"]],["Las Palmas",["urban","sea"]],["Tenerife",["sea","mtn"]],
    ["Santander",["urban","sea"]],["Tarifa",["sea"]],["Sierra Nevada",["mtn"]],["Baqueira",["mtn"]],
    ["Mundaka",["sea"]],["Zarautz",["sea"]]
  ],
  "🇵🇹 Portugal": [
    ["Lisbonne",["urban","sea"]],["Porto",["urban","sea","river"]],["Faro",["urban","sea"]],["Coimbra",["urban","river"]],
    ["Braga",["urban"]],["Ericeira",["sea"]],["Peniche",["sea"]],["Nazaré",["sea"]],["Sagres",["sea"]],
    ["Lagos",["sea"]],["Funchal",["sea","mtn"]]
  ],
  "🇦🇩 Andorre": [["Andorre-la-Vieille",["mtn","urban"]],["Pas de la Casa",["mtn"]],["Soldeu",["mtn"]],["Encamp",["mtn"]]],
  "🇩🇪 Allemagne": [
    ["Berlin",["urban","bike"]],["Munich",["urban","mtn","bike"]],["Hambourg",["urban","sea"]],["Cologne",["urban","river"]],
    ["Francfort",["urban","river"]],["Stuttgart",["urban"]],["Düsseldorf",["urban","river"]],["Dresde",["urban","river"]],
    ["Leipzig",["urban"]],["Garmisch-Partenkirchen",["mtn","climb"]],["Oberstdorf",["mtn"]],["Fribourg",["urban","mtn","bike"]]
  ],
  "🇦🇹 Autriche": [
    ["Vienne",["urban","river"]],["Salzbourg",["urban","mtn"]],["Innsbruck",["urban","mtn","climb"]],["Graz",["urban"]],
    ["Linz",["urban","river"]],["Kitzbühel",["mtn"]],["Sölden",["mtn"]],["Ischgl",["mtn"]],["Saint-Anton",["mtn"]],
    ["Mayrhofen",["mtn"]],["Zell am See",["mtn","lake"]]
  ],
  "🇬🇧 Royaume-Uni": [
    ["Londres",["urban","river"]],["Manchester",["urban"]],["Birmingham",["urban"]],["Édimbourg",["urban","mtn"]],
    ["Glasgow",["urban"]],["Liverpool",["urban","sea"]],["Bristol",["urban","bike"]],["Leeds",["urban"]],
    ["Newquay",["sea"]],["Cornwall",["sea"]],["Aviemore",["mtn"]]
  ],
  "🇧🇪 Belgique": [["Bruxelles",["urban","bike"]],["Anvers",["urban","sea"]],["Gand",["urban","bike"]],["Bruges",["urban"]],["Liège",["urban","river"]],["Charleroi",["urban"]],["Namur",["urban","river","climb"]],["Ostende",["urban","sea"]]],
  "🇳🇱 Pays-Bas": [["Amsterdam",["urban","bike"]],["Rotterdam",["urban","sea","bike"]],["La Haye",["urban","sea"]],["Utrecht",["urban","bike"]],["Eindhoven",["urban","bike"]],["Scheveningen",["sea"]]],
  "🇮🇪 Irlande": [["Dublin",["urban","sea"]],["Cork",["urban","sea"]],["Galway",["urban","sea"]],["Limerick",["urban","river"]],["Bundoran",["sea"]],["Lahinch",["sea"]]],
  "🇳🇴 Norvège": [["Oslo",["urban","mtn"]],["Bergen",["urban","sea","mtn"]],["Trondheim",["urban","sea"]],["Stavanger",["urban","sea","climb"]],["Tromsø",["mtn","sea"]],["Hemsedal",["mtn"]],["Trysil",["mtn"]],["Lofoten",["sea","mtn","climb"]]],
  "🇸🇪 Suède": [["Stockholm",["urban","sea"]],["Göteborg",["urban","sea"]],["Malmö",["urban","sea"]],["Åre",["mtn"]],["Uppsala",["urban","bike"]]],
  "🇮🇸 Islande": [["Reykjavik",["urban","sea","mtn"]],["Akureyri",["mtn","sea"]],["Vík",["sea"]]],
  "🇺🇸 États-Unis": [
    ["New York",["urban"]],["Los Angeles",["urban","sea"]],["Chicago",["urban","lake"]],["San Francisco",["urban","sea"]],
    ["Miami",["urban","sea"]],["Denver",["urban","mtn","bike"]],["Seattle",["urban","sea","mtn"]],["Boston",["urban","sea"]],
    ["Austin",["urban","river"]],["San Diego",["urban","sea"]],["Portland",["urban","river","bike"]],
    ["Salt Lake City",["urban","mtn"]],["Aspen",["mtn"]],["Vail",["mtn"]],["Park City",["mtn"]],["Jackson Hole",["mtn","climb"]],
    ["Mammoth",["mtn"]],["Lake Tahoe",["mtn","lake"]],["Honolulu",["sea"]],["Santa Cruz",["sea"]],["Malibu",["sea"]],
    ["Huntington Beach",["sea"]],["Las Vegas",["urban","climb"]],["Boulder",["urban","mtn","climb","bike"]]
  ],
  "🇨🇦 Canada": [["Toronto",["urban","lake"]],["Montréal",["urban","river"]],["Vancouver",["urban","sea","mtn"]],["Calgary",["urban","mtn"]],["Ottawa",["urban","river"]],["Québec",["urban","river"]],["Whistler",["mtn","bike"]],["Banff",["mtn","climb"]],["Tofino",["sea"]],["Mont-Tremblant",["mtn","lake"]]],
  "🇲🇽 Mexique": [["Mexico",["urban"]],["Cancún",["urban","sea"]],["Guadalajara",["urban"]],["Puerto Escondido",["sea"]],["Sayulita",["sea"]],["Tulum",["sea"]],["Oaxaca",["urban"]]],
  "🇧🇷 Brésil": [["São Paulo",["urban"]],["Rio de Janeiro",["urban","sea","climb"]],["Florianópolis",["sea"]],["Salvador",["urban","sea"]],["Fortaleza",["urban","sea"]],["Brasília",["urban"]],["Itacaré",["sea"]]],
  "🇦🇷 Argentine": [["Buenos Aires",["urban"]],["Bariloche",["mtn","lake"]],["Mendoza",["urban","mtn","climb"]],["Córdoba",["urban"]],["Ushuaia",["mtn","sea"]],["Las Leñas",["mtn"]]],
  "🇨🇱 Chili": [["Santiago",["urban","mtn"]],["Valparaíso",["urban","sea"]],["Pucón",["mtn","lake"]],["Portillo",["mtn"]],["Pichilemu",["sea"]]],
  "🇵🇪 Pérou": [["Lima",["urban","sea"]],["Cusco",["urban","mtn","climb"]],["Máncora",["sea"]],["Arequipa",["urban","mtn"]]],
  "🇨🇷 Costa Rica": [["San José",["urban"]],["Tamarindo",["sea"]],["Santa Teresa",["sea"]],["Jacó",["sea"]],["Nosara",["sea"]]],
  "🇦🇺 Australie": [["Sydney",["urban","sea"]],["Melbourne",["urban","sea"]],["Brisbane",["urban","sea"]],["Perth",["urban","sea"]],["Gold Coast",["sea"]],["Byron Bay",["sea"]],["Adélaïde",["urban","sea"]],["Cairns",["sea"]],["Margaret River",["sea"]],["Torquay",["sea"]],["Thredbo",["mtn"]],["Perisher",["mtn"]]],
  "🇳🇿 Nouvelle-Zélande": [["Auckland",["urban","sea"]],["Wellington",["urban","sea"]],["Christchurch",["urban","mtn"]],["Queenstown",["mtn","lake","climb"]],["Wanaka",["mtn","lake"]],["Raglan",["sea"]],["Dunedin",["urban","sea"]]],
  "🇯🇵 Japon": [["Tokyo",["urban"]],["Osaka",["urban"]],["Kyoto",["urban"]],["Sapporo",["urban","mtn"]],["Niseko",["mtn"]],["Hakuba",["mtn","climb"]],["Nagano",["mtn"]],["Fukuoka",["urban","sea"]],["Nagoya",["urban"]],["Yokohama",["urban","sea"]],["Chiba",["sea"]]],
  "🇰🇷 Corée du Sud": [["Séoul",["urban"]],["Busan",["urban","sea"]],["Pyeongchang",["mtn"]],["Jeju",["sea","mtn"]],["Incheon",["urban","sea"]]],
  "🇮🇩 Indonésie": [["Jakarta",["urban"]],["Bali",["sea"]],["Canggu",["sea"]],["Uluwatu",["sea","climb"]],["Lombok",["sea","mtn"]],["Mentawai",["sea"]]],
  "🇹🇭 Thaïlande": [["Bangkok",["urban"]],["Phuket",["sea"]],["Chiang Mai",["urban","mtn"]],["Koh Samui",["sea"]],["Krabi",["sea","climb"]]],
  "🇵🇭 Philippines": [["Manille",["urban","sea"]],["Cebu",["urban","sea"]],["Siargao",["sea"]],["Boracay",["sea"]],["La Union",["sea"]]],
  "🇱🇰 Sri Lanka": [["Colombo",["urban","sea"]],["Arugam Bay",["sea"]],["Weligama",["sea"]],["Kandy",["urban","mtn"]]],
  "🇿🇦 Afrique du Sud": [["Le Cap",["urban","sea","climb","mtn"]],["Johannesburg",["urban"]],["Durban",["urban","sea"]],["Jeffreys Bay",["sea"]],["Pretoria",["urban"]]],
  "🇲🇦 Maroc": [["Marrakech",["urban","mtn"]],["Casablanca",["urban","sea"]],["Rabat",["urban","sea"]],["Taghazout",["sea"]],["Agadir",["urban","sea"]],["Essaouira",["sea"]],["Tanger",["urban","sea"]]],
  "🇦🇪 Émirats": [["Dubaï",["urban","sea"]],["Abu Dhabi",["urban","sea"]]],
  "🇷🇪 Réunion": [["Saint-Denis",["urban","sea","mtn"]],["Saint-Pierre",["sea","mtn"]],["Saint-Leu",["sea","mtn","climb"]]]
};

// Activité → terrains compatibles. Si une activité n'est pas listée → pas de filtre.
const SMATCH_ACTIVITY_TERRAINS = {
  // Hiver — montagne/neige
  'ski-piste':['mtn'],'snowboard':['mtn'],'freeride':['mtn'],'ski-rando':['mtn'],'snowpark':['mtn'],
  'raquettes':['mtn'],'rando-hiver':['mtn'],'ski-nordique':['mtn'],'luge':['mtn'],'motoneige':['mtn'],
  'helico-ski':['mtn'],'ice-climbing':['mtn','climb'],'via-ferrata-h':['mtn','climb'],'patinage':['mtn','urban','lake'],
  'spa-montagne':['mtn'],'snow-visit':['mtn'],'parachute-h':['mtn','urban'],
  // Été — mer/eau
  'surf':['sea'],'kitesurf':['sea'],'wakeboard':['lake','sea'],'voile':['sea','lake'],'jet-ski':['sea','lake'],
  'plongee':['sea'],'snorkeling':['sea'],'sup-paddle':['sea','lake','river'],'kayak-canoe':['river','lake','sea'],
  'beach-volley':['sea'],'beach-life':['sea'],
  // Été — terre/montagne
  'escalade-ete':['climb','mtn'],'via-ferrata-e':['climb','mtn'],'rando-ete':['mtn'],'trail-run':['mtn'],
  'velo-gravel':['bike'],'velo-route':['bike'],'vtt':['mtn','bike'],'wingsuit':['mtn','climb'],'parachute-e':['urban','mtn'],
  // Urbain / indoor — pas de contrainte géographique forte
  'visite-ville':['urban'],'skate-urbain':['urban'],'festival':['urban','sea'],'course-a-pied':['urban'],
  'salle-sport':['urban'],'arts-martiaux':['urban'],'moto':['urban','mtn'],'yoga-meditation':['urban','sea','mtn'],
};

/**
 * [PRIVÉ] Recherche fuzzy locale groupée par pays, filtrée par terrains de l'activité.
 * @param {string} query
 * @param {string[]} [terrains] - terrains requis (au moins un en commun). Vide/null = pas de filtre.
 */
function _smatchSearchLocal(query, terrains, maxPerCountry, maxTotal) {
  maxPerCountry = maxPerCountry || 6;
  maxTotal = maxTotal || 40;
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const nq = norm((query||"").trim());
  const filterTerrains = (terrains && terrains.length) ? terrains : null;
  const results = [];
  let total = 0;

  for (const country in SMATCH_CITIES) {
    if (total >= maxTotal) break;
    const matches = [];
    for (const entry of SMATCH_CITIES[country]) {
      const city = entry[0], cityTags = entry[1] || [];
      // Filtre terrain : au moins un terrain commun
      if (filterTerrains && !filterTerrains.some(t => cityTags.includes(t))) continue;
      if (!nq) { matches.push({ city, score: 0 }); continue; }
      const nc = norm(city);
      if (nc.startsWith(nq))      matches.push({ city, score: 3 });
      else if (nc.includes(nq))   matches.push({ city, score: 2 });
      else {
        let i = 0;
        for (const ch of nc) { if (ch === nq[i]) i++; if (i === nq.length) break; }
        if (i === nq.length && nq.length >= 3) matches.push({ city, score: 1 });
      }
    }
    if (matches.length) {
      matches.sort((a,b) => b.score - a.score || a.city.localeCompare(b.city));
      const slice = matches.slice(0, maxPerCountry).map(m => m.city);
      results.push({ country, cities: slice, topScore: matches[0].score });
      total += slice.length;
    }
  }
  results.sort((a,b) => b.topScore - a.topScore);
  return results;
}

// ─── Nominatim (OpenStreetMap) ─────────────────────────────────────────────

const _nominatimCache = Object.create(null);

function _ccToFlag(cc) {
  if (!cc || cc.length !== 2) return '🌍';
  const b = 0x1F1E6 - 65;
  return String.fromCodePoint(b + cc.toUpperCase().charCodeAt(0),
                               b + cc.toUpperCase().charCodeAt(1));
}

async function _fetchNominatim(query) {
  const key = query.toLowerCase();
  if (_nominatimCache[key]) return _nominatimCache[key];
  const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=8'
    + '&featuretype=settlement&addressdetails=1&accept-language=fr'
    + '&q=' + encodeURIComponent(query);
  try {
    const r = await fetch(url);
    if (!r.ok) return [];
    const data = await r.json();
    _nominatimCache[key] = data;
    return data;
  } catch (e) { return []; }
}

function _nominatimToGroups(data) {
  const byCountry = Object.create(null);
  // Charge les coords déjà en cache et enrichit avec les nouvelles
  let extraCoords = {};
  try { extraCoords = JSON.parse(localStorage.getItem('snm_extra_coords') || '{}'); } catch (e) {}

  for (const item of data) {
    const cc = (item.address && item.address.country_code) || '';
    const countryName = (item.address && item.address.country) || 'Monde';
    const key = _ccToFlag(cc) + ' ' + countryName;
    if (!byCountry[key]) byCountry[key] = [];
    const city = (item.address && (item.address.city || item.address.town
                  || item.address.municipality || item.address.village))
                 || item.display_name.split(',')[0].trim();
    if (city) {
      if (!byCountry[key].includes(city)) byCountry[key].push(city);
      // Stocke les coordonnées pour _smatchGeoScore (via snm_extra_coords)
      if (item.lat && item.lon) {
        extraCoords[city.toLowerCase().trim()] = [parseFloat(item.lat), parseFloat(item.lon)];
      }
    }
  }

  try { localStorage.setItem('snm_extra_coords', JSON.stringify(extraCoords)); } catch (e) {}

  return Object.entries(byCountry).map(([country, cities]) =>
    ({ country, cities, topScore: 2 })
  );
}

/**
 * Recherche asynchrone : locale (filtrée terrain) + enrichissement Nominatim mondial.
 * Même format de retour que smatchSearchCities : [{country, cities, topScore}].
 */
async function smatchSearchCitiesAsync(query, terrains, maxPerCountry, maxTotal) {
  maxPerCountry = maxPerCountry || 6;
  const nq = (query || '').trim();
  if (nq.length < 2) return _smatchSearchLocal(query, terrains, maxPerCountry, maxTotal);
  const [localGroups, nominatimData] = await Promise.all([
    Promise.resolve(_smatchSearchLocal(query, terrains, maxPerCountry, maxTotal)),
    _fetchNominatim(nq)
  ]);
  const nominatimGroups = _nominatimToGroups(nominatimData);
  if (!nominatimGroups.length) return localGroups;
  const localCities = new Set(localGroups.flatMap(g => g.cities));
  const merged = [...localGroups];
  for (const ng of nominatimGroups) {
    const newCities = ng.cities.filter(c => !localCities.has(c));
    if (!newCities.length) continue;
    const existing = merged.find(g => g.country === ng.country);
    if (existing) {
      existing.cities = [...new Set([...existing.cities, ...newCities])].slice(0, maxPerCountry);
    } else {
      merged.push({ country: ng.country, cities: newCities, topScore: ng.topScore });
    }
  }
  return merged;
}

// smatchSearchCities conservé synchrone pour compatibilité (résultats locaux uniquement)
function smatchSearchCities(query, terrains, maxPerCountry, maxTotal) {
  return _smatchSearchLocal(query, terrains, maxPerCountry, maxTotal);
}

// Donne les terrains d'une activité (pour le filtre)
function smatchActivityTerrains(actId) {
  return SMATCH_ACTIVITY_TERRAINS[actId] || null;
}

if (typeof window !== 'undefined') {
  window.SMATCH_CITIES = SMATCH_CITIES;
  window.smatchSearchCities = smatchSearchCities;
  window.smatchSearchCitiesAsync = smatchSearchCitiesAsync;
  window.SMATCH_ACTIVITY_TERRAINS = SMATCH_ACTIVITY_TERRAINS;
  window.smatchActivityTerrains = smatchActivityTerrains;
}
