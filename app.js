const STORAGE_KEY = 'vinhocego-state-v1';

const FIELD_GROUPS = [
  {
    key: 'blind',
    label: 'Às cegas',
    short: 'Nariz e boca',
    fields: [
      { key: 'type', label: 'Tipo de vinho', short: 'Tipo', options: ['Tinto', 'Branco', 'Rosé'] },
      { key: 'aroma', label: 'Aromas principais', short: 'Nariz', type: 'multi', options: ['Frutas vermelhas', 'Frutas negras', 'Frutas brancas', 'Frutas cítricas', 'Frutas tropicais', 'Floral', 'Herbáceo', 'Especiarias', 'Baunilha / madeira', 'Mineral', 'Terroso', 'Balsâmico', 'Defumado', 'Levedura / pão'] },
      { key: 'dryness', label: 'Doçura', short: 'Doçura', proximity: 'adjacent', options: ['Seco', 'Meio-seco', 'Doce'] },
      { key: 'acidity', label: 'Acidez', short: 'Acidez', proximity: 'adjacent', options: ['Baixa', 'Média', 'Alta'] },
      { key: 'body', label: 'Corpo', short: 'Corpo', proximity: 'adjacent', options: ['Leve', 'Médio', 'Encorpado'] },
      { key: 'tannin', label: 'Tanino', short: 'Tanino', proximity: 'adjacent', options: ['Baixo', 'Médio', 'Alto', 'Não se aplica'] },
      { key: 'finish', label: 'Persistência', short: 'Final', proximity: 'adjacent', options: ['Curto', 'Médio', 'Longo'] }
    ]
  },
  {
    key: 'visual',
    label: 'Visual',
    short: 'Depois da revelação',
    fields: [
      { key: 'color', label: 'Cor / tonalidade', short: 'Cor', proximity: 'family', options: ['Rubi', 'Granada', 'Violeta', 'Palha', 'Dourado', 'Salmão'] },
      { key: 'clarity', label: 'Limpidez', short: 'Limpidez', proximity: 'adjacent', options: ['Límpido', 'Levemente turvo'] },
      { key: 'intensity', label: 'Intensidade visual', short: 'Intensidade', proximity: 'adjacent', options: ['Baixa', 'Média', 'Alta'] }
    ]
  }
];

const ALL_FIELDS = FIELD_GROUPS.flatMap(group => group.fields);
const FIELD_BY_KEY = Object.fromEntries(ALL_FIELDS.map(field => [field.key, field]));

// Curadoria rápida baseada em referências gerais de regiões vitivinícolas e variedades
// internacionais; as listas podem ser ampliadas sem mudar o modelo de pontuação.
const CUSTOM_OPTION = '__custom__';
const WINE_COUNTRIES = ['Brasil', 'Argentina', 'Chile', 'Uruguai', 'França', 'Itália', 'Portugal', 'Espanha', 'Estados Unidos', 'África do Sul', 'Austrália', 'Nova Zelândia', 'Alemanha', 'Áustria', 'Grécia', 'Canadá', 'Hungria', 'Suíça', 'Eslovênia', 'Croácia', 'Geórgia', 'México', 'Outro / não sei'];
const WINE_REGIONS = [
  'Brasil · Serra Gaúcha', 'Brasil · Campanha Gaúcha', 'Brasil · Vale do São Francisco', 'Brasil · Planalto Catarinense', 'Brasil · Campos de Cima da Serra',
  'Argentina · Mendoza', 'Argentina · Salta', 'Argentina · Patagônia', 'Argentina · San Juan', 'Argentina · La Rioja', 'Argentina · Catamarca', 'Argentina · Córdoba',
  'Chile · Valle Central', 'Chile · Aconcagua', 'Chile · Coquimbo', 'Chile · Região Sul', 'Chile · Atacama', 'Chile · Maule', 'Chile · Itata', 'Chile · Bío-Bío',
  'Uruguai · Canelones', 'Uruguai · Maldonado', 'Uruguai · Colonia', 'Uruguai · Rivera', 'Uruguai · Montevidéu',
  'França · Bordeaux', 'França · Borgonha', 'França · Champagne', 'França · Vale do Loire', 'França · Rhône', 'França · Alsácia', 'França · Provence', 'França · Languedoc-Roussillon', 'França · Beaujolais', 'França · Jura', 'França · Savoie', 'França · Sudoeste',
  'Itália · Toscana', 'Itália · Piemonte', 'Itália · Veneto', 'Itália · Sicília', 'Itália · Lombardia', 'Itália · Friuli-Venezia Giulia', 'Itália · Trentino-Alto Ádige', 'Itália · Úmbria', 'Itália · Puglia', 'Itália · Campânia', 'Itália · Sardenha', 'Itália · Abruzzo', 'Itália · Marche',
  'Portugal · Douro', 'Portugal · Vinho Verde', 'Portugal · Alentejo', 'Portugal · Dão', 'Portugal · Setúbal', 'Portugal · Lisboa', 'Portugal · Tejo', 'Portugal · Bairrada', 'Portugal · Madeira', 'Portugal · Algarve', 'Portugal · Trás-os-Montes',
  'Espanha · Rioja', 'Espanha · Ribera del Duero', 'Espanha · Rueda', 'Espanha · Priorat', 'Espanha · Galícia', 'Espanha · Catalunha', 'Espanha · La Mancha', 'Espanha · Jerez', 'Espanha · Toro', 'Espanha · Navarra', 'Espanha · Bierzo', 'Espanha · Valência', 'Espanha · Cava',
  'Estados Unidos · Califórnia', 'Estados Unidos · Oregon', 'Estados Unidos · Washington', 'Estados Unidos · Nova York', 'Estados Unidos · Virgínia', 'Estados Unidos · Texas',
  'África do Sul · Western Cape', 'África do Sul · Stellenbosch', 'África do Sul · Paarl', 'África do Sul · Robertson', 'África do Sul · Swartland', 'África do Sul · Hemel-en-Aarde',
  'Austrália · South Australia', 'Austrália · Victoria', 'Austrália · Western Australia', 'Austrália · New South Wales', 'Austrália · Tasmania',
  'Nova Zelândia · Marlborough', 'Nova Zelândia · Central Otago', 'Nova Zelândia · Hawke’s Bay', 'Nova Zelândia · Martinborough', 'Nova Zelândia · Nelson', 'Nova Zelândia · Waipara',
  'Alemanha · Mosel', 'Alemanha · Rheingau', 'Alemanha · Pfalz', 'Alemanha · Nahe', 'Alemanha · Rheinhessen', 'Alemanha · Baden', 'Alemanha · Ahr', 'Alemanha · Franken',
  'Áustria · Niederösterreich', 'Áustria · Burgenland', 'Áustria · Steiermark', 'Áustria · Viena', 'Grécia · Macedônia', 'Grécia · Santorini', 'Grécia · Peloponeso', 'Canadá · Okanagan', 'Canadá · Niagara Peninsula', 'Hungria · Tokaj', 'Geórgia · Kakheti'
];
const WINE_SUBREGIONS = [
  'Brasil · Vale dos Vinhedos', 'Brasil · Pinto Bandeira', 'Brasil · Flores da Cunha', 'Brasil · Monte Belo do Sul', 'Brasil · Altos de Pinto Bandeira',
  'Argentina · Luján de Cuyo', 'Argentina · Maipú', 'Argentina · Valle de Uco', 'Argentina · Tupungato', 'Argentina · Gualtallary', 'Argentina · Cafayate', 'Argentina · Río Negro', 'Argentina · Neuquén', 'Argentina · Pedernal',
  'Chile · Maipo', 'Chile · Colchagua', 'Chile · Casablanca', 'Chile · San Antonio', 'Chile · Cachapoal', 'Chile · Curicó', 'Chile · Maule', 'Chile · Limarí', 'Chile · Elqui', 'Chile · Itata', 'Chile · Malleco',
  'Uruguai · Progreso', 'Uruguai · Las Violetas', 'Uruguai · Garzón', 'Uruguai · Carmelo', 'Uruguai · Atlántida',
  'França · Médoc', 'França · Saint-Émilion', 'França · Pomerol', 'França · Graves', 'França · Côte d’Or', 'França · Chablis', 'França · Sancerre', 'França · Muscadet', 'França · Châteauneuf-du-Pape', 'França · Hermitage', 'França · Côte-Rôtie', 'França · Bandol', 'França · Beaujolais-Villages', 'França · Jura',
  'Itália · Chianti', 'Itália · Montalcino', 'Itália · Montepulciano', 'Itália · Barolo', 'Itália · Barbaresco', 'Itália · Langhe', 'Itália · Valpolicella', 'Itália · Soave', 'Itália · Prosecco', 'Itália · Etna', 'Itália · Franciacorta', 'Itália · Bolgheri', 'Itália · Sagrantino di Montefalco',
  'Portugal · Douro Superior', 'Portugal · Cima Corgo', 'Portugal · Baixo Corgo', 'Portugal · Monção e Melgaço', 'Portugal · Bairrada', 'Portugal · Dão', 'Portugal · Alentejo Central', 'Portugal · Setúbal', 'Portugal · Óbidos', 'Portugal · Tejo', 'Portugal · Madeira',
  'Espanha · Rioja Alta', 'Espanha · Rioja Alavesa', 'Espanha · Rioja Oriental', 'Espanha · Ribera del Duero', 'Espanha · Rías Baixas', 'Espanha · Priorat', 'Espanha · Penedès', 'Espanha · Jerez-Xérès-Sherry', 'Espanha · Rueda', 'Espanha · Toro', 'Espanha · Bierzo', 'Espanha · Cava',
  'Estados Unidos · Napa Valley', 'Estados Unidos · Sonoma County', 'Estados Unidos · Paso Robles', 'Estados Unidos · Santa Barbara County', 'Estados Unidos · Willamette Valley', 'Estados Unidos · Columbia Valley', 'Estados Unidos · Finger Lakes',
  'África do Sul · Stellenbosch', 'África do Sul · Franschhoek', 'África do Sul · Paarl', 'África do Sul · Swartland', 'África do Sul · Robertson', 'África do Sul · Constantia', 'África do Sul · Hemel-en-Aarde',
  'Austrália · Barossa Valley', 'Austrália · McLaren Vale', 'Austrália · Coonawarra', 'Austrália · Yarra Valley', 'Austrália · Mornington Peninsula', 'Austrália · Margaret River', 'Austrália · Hunter Valley', 'Austrália · Tasmania',
  'Nova Zelândia · Marlborough', 'Nova Zelândia · Hawke’s Bay', 'Nova Zelândia · Central Otago', 'Nova Zelândia · Martinborough', 'Nova Zelândia · Waipara', 'Nova Zelândia · Nelson',
  'Alemanha · Mosel', 'Alemanha · Rheingau', 'Alemanha · Pfalz', 'Alemanha · Nahe', 'Alemanha · Rheinhessen', 'Alemanha · Ahr', 'Alemanha · Baden', 'Alemanha · Franken', 'Áustria · Wachau', 'Áustria · Kamptal', 'Áustria · Kremstal', 'Áustria · Burgenland',
  'Grécia · Santorini', 'Grécia · Nemea', 'Grécia · Naoussa', 'Canadá · Okanagan Valley', 'Canadá · Niagara-on-the-Lake', 'Hungria · Tokaj', 'Hungria · Eger', 'Geórgia · Kakheti'
];
const WINE_GRAPES = [
  'Cabernet Sauvignon', 'Merlot', 'Cabernet Franc', 'Malbec', 'Syrah / Shiraz', 'Pinot Noir', 'Carménère', 'Tannat', 'Tempranillo', 'Garnacha / Grenache', 'Sangiovese', 'Nebbiolo', 'Barbera', 'Montepulciano', 'Touriga Nacional', 'Touriga Franca', 'Pinotage', 'Zinfandel / Primitivo', 'Mourvèdre / Monastrell', 'Petit Verdot', 'Gamay', 'Corvina', 'Dolcetto', 'Nero d’Avola', 'Aglianico', 'Primitivo', 'Mencía', 'Bobal', 'Cinsault', 'Carignan', 'Counoise', 'Graševina', 'Blaufränkisch', 'Xinomavro', 'Agiorgitiko', 'Saperavi',
  'Chardonnay', 'Sauvignon Blanc', 'Riesling', 'Pinot Grigio / Pinot Gris', 'Chenin Blanc', 'Viognier', 'Gewürztraminer', 'Alvarinho / Albariño', 'Verdejo', 'Torrontés', 'Moscato / Muscat', 'Trebbiano / Ugni Blanc', 'Arinto', 'Glera', 'Sémillon', 'Marsanne / Roussanne', 'Colombard', 'Grüner Veltliner', 'Viura / Macabeo', 'Godello', 'Garganega', 'Fiano', 'Vermentino', 'Assyrtiko', 'Furmint', 'Müller-Thurgau', 'Roussanne', 'Clairette', 'Picpoul Blanc', 'Ribolla Gialla', 'Albariño', 'Loureiro', 'Palomino', 'Pedro Ximénez', 'Cortese', 'Treixadura'
];
const WINE_APPELLATIONS = ['AOC / AOP', 'DOC / DOCG', 'DOP / DOC', 'IGP / Vinho Regional', 'AVA', 'DO / DOCa', 'Indicação regional', 'Sem denominação / não sei'];
const WINE_VINTAGES = ['NV / sem safra', ...Array.from({ length: 37 }, (_, index) => String(2026 - index))];
const WINE_ALCOHOL_BANDS = ['Até 11,9%', '12 a 12,9%', '13 a 13,9%', '14 a 15,9%', '16% ou mais'];

const LABEL_FIELDS = [
  { key: 'producer', label: 'Produtor / vinícola', short: 'Produtor', type: 'text', placeholder: 'Ex.: Bodega Catena Zapata', scored: false },
  { key: 'wineName', label: 'Nome do vinho / rótulo', short: 'Rótulo', type: 'text', placeholder: 'Ex.: DV Catena Malbec-Malbec', scored: false },
  { key: 'country', label: 'País', short: 'País', type: 'select', options: WINE_COUNTRIES, scored: true },
  { key: 'region', label: 'Região', short: 'Região', type: 'select', options: WINE_REGIONS, scored: true, catalog: true },
  { key: 'subregion', label: 'Sub-região / denominação', short: 'Sub-região', type: 'select', options: WINE_SUBREGIONS, scored: true, catalog: true },
  { key: 'vintage', label: 'Safra', short: 'Safra', type: 'select', options: WINE_VINTAGES, scored: true },
  { key: 'alcohol', label: 'Teor alcoólico (%)', short: 'Álcool', type: 'number', step: '0.1', min: '0', max: '25', placeholder: 'Ex.: 13,5', scored: true },
  { key: 'grapes', label: 'Uvas / corte', short: 'Uvas', type: 'multi', options: WINE_GRAPES, scored: true, catalog: true },
  { key: 'appellation', label: 'Classificação', short: 'Classificação', type: 'select', options: WINE_APPELLATIONS, scored: true },
  { key: 'barcode', label: 'Código de barras', short: 'Código', type: 'text', placeholder: 'EAN / UPC (opcional)', scored: false }
];
const LABEL_SCORE_FIELDS = LABEL_FIELDS.filter(field => field.scored);
const LABEL_FIELD_BY_KEY = Object.fromEntries(LABEL_FIELDS.map(field => [field.key, field]));
const DETAIL_FIELDS = {
  ...FIELD_BY_KEY,
  ...Object.fromEntries(LABEL_SCORE_FIELDS.map(field => [`label_${field.key}`, { ...field, short: field.short }]))
};

const defaultState = () => ({
  participants: [],
  history: [],
  nextRound: 1,
  currentRound: null
});

let state = loadState();
let screen = null;
let reviewId = null;
let toastTimer;

function emptyAnswers() {
  return Object.fromEntries(ALL_FIELDS.map(field => [field.key, field.type === 'multi' ? [] : '']));
}

function emptyLabelInfo() {
  return { ...Object.fromEntries(LABEL_FIELDS.map(field => [field.key, field.type === 'multi' ? [] : ''])), lookupData: {} };
}

function emptyLabelAnswers() {
  return Object.fromEntries(LABEL_SCORE_FIELDS.map(field => [field.key, field.type === 'multi' ? [] : '']));
}

function normalizeMulti(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  return String(value).split(/,|;|\n/).map(item => item.trim()).filter(Boolean);
}

function normalizeAnswers(info = {}) {
  const output = emptyAnswers();
  ALL_FIELDS.forEach(field => {
    output[field.key] = field.type === 'multi' ? normalizeMulti(info[field.key]) : info[field.key] == null ? '' : String(info[field.key]);
  });
  return output;
}

function hasValue(field, value) {
  return field.type === 'multi' ? normalizeMulti(value).length > 0 : Boolean(value);
}

function normalizeLabelInfo(info = {}) {
  const output = emptyLabelInfo();
  LABEL_FIELDS.forEach(field => {
    if (field.type === 'multi') output[field.key] = normalizeMulti(info[field.key]);
    else output[field.key] = info[field.key] == null ? '' : String(info[field.key]);
  });
  output.lookupData = info.lookupData && typeof info.lookupData === 'object' ? info.lookupData : {};
  return output;
}

function normalizeLabelAnswers(info = {}) {
  const output = emptyLabelAnswers();
  LABEL_SCORE_FIELDS.forEach(field => {
    if (field.type === 'multi') output[field.key] = normalizeMulti(info[field.key]);
    else output[field.key] = info[field.key] == null ? '' : String(info[field.key]);
  });
  return output;
}

function normalizeRound(round, participants) {
  if (!round) return null;
  const normalized = {
    ...round,
    answerKey: normalizeAnswers(round.answerKey || {}),
    labelInfo: normalizeLabelInfo(round.labelInfo || round.labelKey || {}),
    answers: { ...(round.answers || {}) },
    labelAnswers: { ...(round.labelAnswers || {}) }
  };
  Object.keys(normalized.answers).forEach(id => {
    normalized.answers[id] = normalizeAnswers(normalized.answers[id]);
  });
  Object.keys(normalized.labelAnswers).forEach(id => {
    normalized.labelAnswers[id] = normalizeLabelAnswers(normalized.labelAnswers[id]);
  });
  const eligible = (participants || []).filter(person => person.id !== normalized.ownerId);
  eligible.forEach(person => {
    normalized.answers[person.id] = normalizeAnswers(normalized.answers[person.id] || {});
    normalized.labelAnswers[person.id] = normalizeLabelAnswers(normalized.labelAnswers[person.id] || {});
  });
  return normalized;
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!parsed || !Array.isArray(parsed.participants) || !Array.isArray(parsed.history)) return defaultState();
    return {
      ...defaultState(),
      ...parsed,
      nextRound: Number(parsed.nextRound) || parsed.history.length + 1,
      currentRound: normalizeRound(parsed.currentRound, parsed.participants),
      history: parsed.history.map(round => normalizeRound(round, parsed.participants))
    };
  } catch (error) {
    return defaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    showToast('Não consegui salvar neste navegador.', 'error');
  }
}

function uid(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
  } catch (error) {
    return '';
  }
}

function participantName(id) {
  return state.participants.find(person => person.id === id)?.name || 'Participante';
}

function getOwner(round) {
  return state.participants.find(person => person.id === round.ownerId);
}

function getEligibleParticipants(round) {
  return state.participants.filter(person => person.id !== round.ownerId);
}

function createRound() {
  const ownerId = state.participants[state.participants.length - 1]?.id || '';
  return {
    id: uid('round'),
    number: state.nextRound,
    ownerId,
    step: 'key',
    answerKey: emptyAnswers(),
    labelInfo: emptyLabelInfo(),
    answers: Object.fromEntries(state.participants.filter(person => person.id !== ownerId).map(person => [person.id, emptyAnswers()])),
    labelAnswers: Object.fromEntries(state.participants.filter(person => person.id !== ownerId).map(person => [person.id, emptyLabelAnswers()])),
    startedAt: new Date().toISOString()
  };
}

function ensureAnswerSlots(round) {
  round.answerKey = normalizeAnswers(round.answerKey || {});
  round.labelInfo = normalizeLabelInfo(round.labelInfo || {});
  round.answers ||= {};
  round.labelAnswers ||= {};
  getEligibleParticipants(round).forEach(person => {
    round.answers[person.id] = normalizeAnswers(round.answers[person.id] || {});
    round.labelAnswers[person.id] = normalizeLabelAnswers(round.labelAnswers[person.id] || {});
  });
}

function showToast(message, tone = 'info') {
  const toast = document.querySelector('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast show ${tone}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.className = 'toast'; }, 2800);
}

function appHeader() {
  const activeLabel = state.currentRound ? `Rodada ${state.currentRound.number}` : state.history.length ? `${state.history.length} rodada${state.history.length === 1 ? '' : 's'}` : 'Preparação';
  return `<header class="app-header">
    <a class="brand" href="#" data-action="go-home" aria-label="Voltar ao início">
      <img class="brand-mark" src="/vinhocego-icon.png" alt="" />
      <span class="brand-copy"><span class="brand-name">Vinho às Cegas</span><span class="brand-tag">${activeLabel}</span></span>
    </a>
    <div class="header-actions">
      ${state.history.length ? `<button class="ghost-button" data-action="open-history">Histórico <span aria-hidden="true">↗</span></button>` : ''}
      ${state.currentRound ? `<button class="ghost-button" data-action="open-history">Placar</button>` : ''}
    </div>
  </header>`;
}

function shell(content) {
  return `<div class="app-shell">${appHeader()}<main class="main">${content}</main><div id="toast" class="toast" role="status" aria-live="polite"></div></div>`;
}

function render() {
  const app = document.querySelector('#app');
  if (!app) return;
  if (screen === 'history') app.innerHTML = shell(renderHistoryPage());
  else if (screen === 'review') app.innerHTML = shell(renderReviewPage());
  else if (state.currentRound) app.innerHTML = shell(renderRoundPage(state.currentRound));
  else app.innerHTML = shell(renderHomePage());
  bindEvents();
}

function renderHomePage() {
  const hasEnough = state.participants.length >= 2;
  const leaderboard = buildLeaderboard();
  return `<section class="hero-grid">
    <article class="hero-card">
      <div class="hero-lockup">
        <div class="hero-copy">
          <div class="eyebrow">Degustação guiada</div>
          <h1>Descubram o vinho,<br><em>sem olhar.</em></h1>
          <p class="lede">Um painel simples para registrar palpites, revelar o rótulo e descobrir quem tem o melhor paladar da mesa.</p>
        </div>
        <img class="hero-symbol" src="/vinhocego-icon.png" alt="Olho estilizado envolvendo uma taça de vinho" />
      </div>
    </article>
    <article class="setup-card">
      <div class="section-label">01 · Preparação</div>
      <h2>Quem está na mesa?</h2>
      <p class="muted">Cadastre os nomes. O último da lista começa como dono da primeira garrafa — dá para trocar depois.</p>
      <form class="participant-form" id="participant-form">
        <input class="input" id="participant-name" name="name" placeholder="Nome do participante" autocomplete="off" maxlength="32" />
        <button class="primary-button add-button" type="submit">Adicionar</button>
      </form>
      <div class="participant-list">
        ${state.participants.length ? state.participants.map((person, index) => `<div class="participant-row">
          <span class="participant-number">${String(index + 1).padStart(2, '0')}</span>
          <span class="participant-name">${esc(person.name)}</span>
          <span class="participant-tools">
            <button class="icon-button" type="button" data-action="move-participant" data-id="${person.id}" data-direction="up" aria-label="Mover ${esc(person.name)} para cima" ${index === 0 ? 'disabled' : ''}>↑</button>
            <button class="icon-button" type="button" data-action="move-participant" data-id="${person.id}" data-direction="down" aria-label="Mover ${esc(person.name)} para baixo" ${index === state.participants.length - 1 ? 'disabled' : ''}>↓</button>
            <button class="icon-button remove" type="button" data-action="remove-participant" data-id="${person.id}" aria-label="Remover ${esc(person.name)}">×</button>
          </span>
        </div>`).join('') : `<div class="empty-state"><strong>A mesa está vazia.</strong>Adicione pelo menos duas pessoas para começar.</div>`}
      </div>
      <p class="owner-note"><strong>Como funciona:</strong> quem estiver por último na lista é o dono da garrafa. Ele preenche o gabarito e fica fora da pontuação dessa rodada.</p>
      <div class="setup-spacer"></div>
      <button class="primary-button full-button" type="button" data-action="start-round" ${hasEnough ? '' : 'disabled'}>Começar ${state.nextRound === 1 ? 'a primeira' : 'a próxima'} rodada <span aria-hidden="true">→</span></button>
    </article>
  </section>
  <section class="dashboard-grid">
    <article class="panel">
      <div class="panel-heading"><div><div class="section-label">Placar geral</div><h2>Quem está levando?</h2><p>Acertos acumulados nas rodadas salvas.</p></div></div>
      ${leaderboard.length ? renderLeaderboard(leaderboard) : `<div class="empty-state"><strong>O placar começa aqui.</strong>Salve a primeira rodada para ver o ranking.</div>`}
    </article>
    <article class="panel">
      <div class="panel-heading"><div><div class="section-label">Memória da mesa</div><h2>Últimas rodadas</h2><p>${state.history.length ? 'Você pode revisar ou apagar qualquer resultado.' : 'Nada salvo ainda.'}</p></div>${state.history.length ? `<button class="text-button" data-action="open-history">Ver tudo</button>` : ''}</div>
      ${state.history.length ? renderHistoryCards(state.history.slice(0, 3)) : `<div class="empty-state"><strong>O histórico fica salvo aqui.</strong>Atualize a página sem perder os resultados.</div>`}
    </article>
  </section>`;
}

function renderLeaderboard(leaderboard) {
  return `<div class="score-list">${leaderboard.slice(0, 8).map((entry, index) => `<div class="score-row">
    <span class="score-rank">${index + 1}</span>
    <span><span class="score-player">${esc(entry.name)}</span><span class="score-meta">${entry.rounds} rodada${entry.rounds === 1 ? '' : 's'} pontuada${entry.rounds === 1 ? '' : 's'}</span></span>
    <span class="score-total">${formatPoints(entry.score)}<small> pts</small></span>
  </div>`).join('')}</div>`;
}

function buildLeaderboard() {
  const map = new Map();
  state.participants.forEach(person => map.set(person.id, { id: person.id, name: person.name, score: 0, rounds: 0 }));
  state.history.forEach(round => {
    (round.scores || []).forEach(entry => {
      const current = map.get(entry.id) || { id: entry.id, name: entry.name, score: 0, rounds: 0 };
      current.name = entry.name;
      current.score += Number(entry.score) || 0;
      current.rounds += 1;
      map.set(entry.id, current);
    });
  });
  return Array.from(map.values()).filter(entry => entry.rounds > 0).sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, 'pt-BR'));
}

function displayValue(value) {
  if (Array.isArray(value)) return value.length ? value.join(', ') : 'Sem resposta';
  return value || 'Sem resposta';
}

function renderHistoryCards(rounds) {
  return `<div class="history-list">${rounds.map(round => `<article class="history-card">
    <div class="history-summary"><div><strong>Rodada ${round.number} · ${esc(round.labelInfo?.wineName || round.ownerName)}</strong><span>${formatDate(round.finishedAt)} · ${round.labelInfo?.region ? `${esc(round.labelInfo.region)} · ` : ''}dono do gabarito: ${esc(round.ownerName)}</span></div><div class="history-actions"><button class="text-button" data-action="review-round" data-id="${round.id}">Revisar</button><button class="icon-button remove" data-action="delete-round" data-id="${round.id}" aria-label="Excluir rodada ${round.number}">×</button></div></div>
    <div class="history-detail"><table><thead><tr><th>Participante</th><th>Pontos</th></tr></thead><tbody>${(round.scores || []).map(score => `<tr><td>${esc(score.name)}</td><td>${formatPoints(score.score)}/${score.max}</td></tr>`).join('')}</tbody></table></div>
  </article>`).join('')}</div>`;
}

function progressSteps(active) {
  const steps = [
    ['key', 'Gabarito'],
    ['blind', 'Às cegas'],
    ['visual', 'Visual'],
    ['label', 'Rótulo'],
    ['results', 'Resultado']
  ];
  const current = steps.findIndex(item => item[0] === active);
  return `<div class="stepper">${steps.map(([key, label], index) => `<div class="step-item ${index === current ? 'active' : ''} ${index < current ? 'done' : ''}"><span class="step-dot">${index < current ? '✓' : index + 1}</span><span>${label}</span></div>`).join('')}</div>`;
}

function renderRoundPage(round) {
  ensureAnswerSlots(round);
  const owner = getOwner(round);
  return `<section class="round-top"><div><div class="eyebrow">Degustação em andamento</div><h1>Rodada ${round.number}</h1><p class="lede">Uma garrafa por vez. Primeiro o palpite, depois a revelação.</p></div><div class="round-meta"><span class="round-number">${String(round.number).padStart(2, '0')}</span><span>Gabarito: <strong>${esc(owner?.name || 'escolha o dono')}</strong></span></div></section>
  ${progressSteps(round.step)}
  <div class="round-layout"><div class="round-main">${round.step === 'key' ? renderKeyStep(round) : round.step === 'blind' ? renderBlindStep(round) : round.step === 'visual' ? renderVisualStep(round) : round.step === 'label' ? renderLabelStep(round) : renderResultsStep(round)}</div><aside class="round-side">${renderRoundSide(round)}</aside></div>`;
}

function renderRoundSide(round) {
  const owner = getOwner(round);
  const eligible = getEligibleParticipants(round);
  const hasBlindCriteria = activeSensoryFields(round, 'blind').length > 0;
  const hasVisualCriteria = activeSensoryFields(round, 'visual').length > 0;
  const hasLabelCriteria = activeLabelFields(round).length > 0;
  const completedBlind = countCompleted(round, 'blind');
  const completedVisual = countCompleted(round, 'visual');
  const completedLabel = countLabelCompleted(round);
  return `<div class="round-card"><div class="section-label">Nesta rodada</div><h3>${eligible.length} participante${eligible.length === 1 ? '' : 's'} jogando</h3><p class="muted">${owner ? `<strong>${esc(owner.name)}</strong> serve a garrafa e guarda o gabarito.` : 'Escolha quem trouxe a garrafa.'}</p><div class="status-line"><span>Palpites sensoriais</span><strong>${round.step === 'key' ? '—' : hasBlindCriteria ? `${completedBlind}/${eligible.length}` : 'não se aplica'}</strong></div><div class="status-meter"><i style="width:${hasBlindCriteria && eligible.length ? Math.round((completedBlind / eligible.length) * 100) : 0}%"></i></div><div class="status-line"><span>Análise visual</span><strong>${['visual', 'label', 'results'].includes(round.step) ? hasVisualCriteria ? `${completedVisual}/${eligible.length}` : 'não se aplica' : '—'}</strong></div><div class="status-meter"><i style="width:${hasVisualCriteria && eligible.length ? Math.round((completedVisual / eligible.length) * 100) : 0}%"></i></div><div class="status-line"><span>Palpite do rótulo</span><strong>${['label', 'results'].includes(round.step) ? hasLabelCriteria ? `${completedLabel}/${eligible.length}` : 'não se aplica' : '—'}</strong></div><div class="status-meter"><i style="width:${hasLabelCriteria && eligible.length ? Math.round((completedLabel / eligible.length) * 100) : 0}%"></i></div></div>
  <div class="callout"><strong>Dica de condução</strong>${round.step === 'key' ? 'O dono preenche o gabarito sensorial e a ficha do rótulo antes de servir. Não mostre esta tela aos convidados.' : round.step === 'blind' ? 'Passe a tela para cada pessoa ou registre as respostas em sentido horário.' : round.step === 'visual' ? 'Agora todos tiram as vendas. Compare a cor e a limpidez com a taça; a garrafa continua coberta.' : round.step === 'label' ? 'A garrafa continua escondida: cada participante faz seu próprio palpite de país, região, safra, álcool e uvas.' : 'Agora revelem a garrafa. Cada ponto vale um acerto contra o gabarito; o dono não entra nesta conta.'}</div>`;
}

function countCompleted(round, groupKey) {
  const fields = activeSensoryFields(round, groupKey);
  return getEligibleParticipants(round).filter(person => fields.every(field => hasValue(field, round.answers[person.id]?.[field.key]))).length;
}

function activeSensoryFields(round, groupKey = null) {
  const groups = groupKey ? FIELD_GROUPS.filter(group => group.key === groupKey) : FIELD_GROUPS;
  return groups.flatMap(group => group.fields.filter(field => hasValue(field, round.answerKey?.[field.key])));
}

function activeLabelFields(round) {
  return LABEL_SCORE_FIELDS.filter(field => hasValue(field, round.labelInfo?.[field.key]));
}

function countLabelCompleted(round) {
  const fields = activeLabelFields(round);
  return getEligibleParticipants(round).filter(person => fields.every(field => {
    const value = round.labelAnswers?.[person.id]?.[field.key];
    return hasValue(field, value);
  })).length;
}

function renderKeyStep(round) {
  return `<article class="round-card"><div class="phase-header"><div><div class="section-label">Etapa de preparação</div><h2>Feche o rótulo. Abra os sentidos.</h2><p>Quem trouxe a garrafa preenche o que souber. Campos sem resposta não serão perguntados nem pontuados.</p></div><span class="phase-pill">Só o dono</span></div>
    <div class="key-owner"><div><label class="form-label" for="owner-select">Quem trouxe esta garrafa?</label><p class="muted" style="font-size:12px;margin:0">Essa pessoa será a última coluna e não pontua na rodada.</p></div><select id="owner-select" class="select-input" data-owner>${state.participants.map(person => `<option value="${person.id}" ${person.id === round.ownerId ? 'selected' : ''}>${esc(person.name)}</option>`).join('')}</select></div>
    <div class="key-groups">${FIELD_GROUPS.map(group => renderKeyGroup(round, group)).join('')}</div>
    ${renderLabelKeySection(round)}
    <div class="round-actions"><div class="left-actions"><button class="secondary-button" data-action="go-home">Sair sem salvar</button></div><div class="right-actions"><button class="primary-button" data-action="to-blind">Gabarito preenchido · começar às cegas <span aria-hidden="true">→</span></button></div></div>
    <p class="save-note">Nome do rótulo e produtor ficam guardados como referência. País, região, sub-região, safra, álcool, uvas e classificação só entram na pontuação quando cadastrados.</p>
  </article>`;
}

function renderKeyGroup(round, group) {
  return `<section><div class="key-group-title"><h3>${group.label}</h3><span>${group.short}</span></div><div class="key-fields">${group.fields.map(field => `<label class="key-field"><span>${field.label}</span>${selectFor(field, round.answerKey[field.key], { scope: 'key', field: field.key })}</label>`).join('')}</div></section>`;
}

function renderLabelLookup(round) {
  return `<section class="label-lookup"><div><div class="section-label">Atalho opcional</div><h3>Buscar ficha pelo código</h3><p>Digite o EAN/UPC ou tente ler o código de barras com a câmera. A consulta usa a base pública Open Food Facts; revise o preenchimento antes de confirmar.</p></div><div class="lookup-actions"><input class="input lookup-code" id="label-code" inputmode="numeric" autocomplete="off" value="${esc(round.labelInfo?.barcode || '')}" placeholder="Ex.: 7890000000000" aria-label="Código de barras do vinho" /><button class="secondary-button" type="button" data-action="lookup-label">Buscar ficha</button><label class="secondary-button scan-label-button" for="label-scan">Ler código com câmera<input id="label-scan" class="scan-input" type="file" accept="image/*" capture="environment" data-scan-label /></label></div><p class="lookup-note">No Safari do iPad, a leitura automática da câmera pode não estar disponível; nesse caso, digite o número e toque em Buscar.</p></section>`;
}

function renderLabelKeySection(round) {
  return `<section class="label-key-section">${renderLabelLookup(round)}${renderLookupDetails(round.labelInfo?.lookupData)}<div class="key-group-title"><div><h3>Ficha do rótulo · gabarito</h3><p>O dono preenche agora. Os participantes respondem depois que a garrafa for revelada.</p></div><span>7 critérios</span></div><div class="label-form-grid key-label-grid">${LABEL_FIELDS.map(field => `<label class="label-field ${['producer', 'wineName', 'grapes', 'barcode'].includes(field.key) ? 'wide' : ''}"><span>${esc(field.label)}${field.scored ? '' : ' · referência'}</span>${renderLabelKeyControl(field, round.labelInfo[field.key])}</label>`).join('')}</div></section>`;
}

function renderLabelKeyControl(field, value) {
  if (field.type === 'multi') return renderMultiPicker(field, value, 'label-key');
  if (field.type === 'select') return field.catalog ? renderCatalogSelect(field, value, 'label-key') : `<select class="answer-select label-input" data-label-key data-field="${field.key}"><option value="">Escolher…</option>${field.options.map(option => `<option value="${esc(option)}" ${option === value ? 'selected' : ''}>${esc(option)}</option>`).join('')}</select>`;
  return `<input class="input label-input" data-label-key data-field="${field.key}" type="${field.type}" ${field.step ? `step="${field.step}"` : ''} ${field.min ? `min="${field.min}"` : ''} ${field.max ? `max="${field.max}"` : ''} value="${esc(value || '')}" placeholder="${esc(field.placeholder || '')}" />`;
}

function selectFor(field, value, meta = {}) {
  if (field.type === 'multi') return renderMultiPicker(field, value, meta.scope === 'key' ? 'answer-key' : 'answer-player', meta.participant || '');
  const attrs = `data-answer data-scope="${meta.scope || 'player'}" data-field="${field.key}"${meta.participant ? ` data-participant="${meta.participant}"` : ''}`;
  return `<select class="answer-select" ${attrs}><option value="">Escolher…</option>${field.options.map(option => `<option value="${esc(option)}" ${option === value ? 'selected' : ''}>${esc(option)}</option>`).join('')}</select>`;
}

function labelSelectFor(field, value, participantId) {
  if (field.catalog) return renderCatalogSelect(field, value, 'label-answer', participantId);
  return `<select class="answer-select" data-label-answer data-field="${field.key}" data-participant="${participantId}"><option value="">Escolher…</option>${field.options.map(option => `<option value="${esc(option)}" ${option === value ? 'selected' : ''}>${esc(option)}</option>`).join('')}</select>`;
}

function renderCatalogSelect(field, value, scope, participantId = '') {
  const customValue = value && !field.options.includes(value) ? value : '';
  const selectedValue = customValue ? CUSTOM_OPTION : value;
  const baseAttrs = scope === 'label-key' ? `data-label-key data-field="${field.key}"` : `data-label-answer data-field="${field.key}" data-participant="${participantId}"`;
  return `<div class="catalog-control"><select class="answer-select" ${baseAttrs} data-catalog-select><option value="">Escolher…</option>${field.options.map(option => `<option value="${esc(option)}" ${option === selectedValue ? 'selected' : ''}>${esc(option)}</option>`).join('')}<option value="${CUSTOM_OPTION}" ${selectedValue === CUSTOM_OPTION ? 'selected' : ''}>Não encontrei — inserir</option></select><input class="input catalog-custom-input" data-catalog-custom data-scope="${scope}" data-field="${field.key}"${participantId ? ` data-participant="${participantId}"` : ''} value="${esc(customValue)}" placeholder="Não encontrou? digite aqui" autocomplete="off" /></div>`;
}

function renderMultiPicker(field, selected = [], scope, participantId = '') {
  const selectedValues = normalizeMulti(selected);
  const isLabelGuess = scope === 'label-answer';
  const isLabelKey = scope === 'label-key';
  const isBulk = scope.startsWith('bulk-');
  const attribute = isLabelGuess ? `data-label-answer data-field="${field.key}" data-participant="${participantId}"` : isLabelKey ? `data-label-key data-field="${field.key}"` : isBulk ? `data-bulk-multi data-bulk-scope="${scope === 'bulk-label' ? 'label' : 'player'}" data-field="${field.key}"` : `data-answer-multi data-scope="${scope === 'answer-key' ? 'key' : 'player'}" data-field="${field.key}"${participantId ? ` data-participant="${participantId}"` : ''}`;
  const selectedText = selectedValues.length ? `${selectedValues.length} selecionada${selectedValues.length === 1 ? '' : 's'}` : 'Escolher…';
  const customValues = selectedValues.filter(value => !field.options.includes(value));
  const customAttrs = isLabelGuess ? `data-label-answer-custom data-field="${field.key}" data-participant="${participantId}"` : isLabelKey ? `data-label-key-custom data-field="${field.key}"` : isBulk ? `data-bulk-custom data-bulk-scope="${scope === 'bulk-label' ? 'label' : 'player'}" data-field="${field.key}"` : `data-answer-multi-custom data-scope="${scope === 'answer-key' ? 'key' : 'player'}" data-field="${field.key}"${participantId ? ` data-participant="${participantId}"` : ''}`;
  return `<div class="multi-picker" data-multi-picker><details class="multi-details"><summary><span data-multi-summary>${esc(selectedText)}</span><span aria-hidden="true">⌄</span></summary><div class="multi-menu">${field.options.map(option => `<label class="multi-option"><input type="checkbox" ${attribute} data-multi-value="${esc(option)}" ${selectedValues.includes(option) ? 'checked' : ''}><span>${esc(option)}</span></label>`).join('')}<label class="multi-custom-field"><span>Outra(s) — digite separadas por vírgula</span><input class="input" type="text" ${customAttrs} value="${esc(customValues.join(', '))}" placeholder="Ex.: casta ou aroma fora do catálogo" autocomplete="off" /></label><button class="multi-close" type="button" data-action="close-multi">Fechar seleção</button></div></details></div>`;
}

function renderBlindStep(round) {
  return `<article class="round-card"><div class="phase-header"><div><div class="section-label">Etapa 1 · sem ver o rótulo</div><h2>O que a taça está dizendo?</h2><p>Registre o nariz e a boca de cada participante antes da revelação.</p></div><span class="phase-pill">Vendados</span></div><div class="reveal-banner"><span class="reveal-icon">◌</span><span><strong>Gabarito escondido.</strong> A última coluna está protegida até a correção.</span></div>${renderBoard(round, 'blind', false)}<div class="round-actions"><div class="left-actions"><button class="secondary-button" data-action="back-key">← Voltar ao gabarito</button></div><div class="right-actions"><button class="primary-button" data-action="to-visual">Tirar as vendas · análise visual <span aria-hidden="true">→</span></button></div></div></article>`;
}

function renderVisualStep(round) {
  return `<article class="round-card"><div class="phase-header"><div><div class="section-label">Etapa 2 · depois das vendas</div><h2>Agora, olhem a taça.</h2><p>Tirem as vendas e registrem cor, limpidez e intensidade visual.</p></div><span class="phase-pill">Visual</span></div><div class="reveal-banner"><span class="reveal-icon">✦</span><span><strong>A garrafa ainda fica escondida.</strong> Usem a luz e a cor do vinho, mas segurem a revelação do rótulo.</span></div>${renderBoard(round, 'visual', false)}<div class="round-actions"><div class="left-actions"><button class="secondary-button" data-action="back-blind">← Voltar aos palpites</button></div><div class="right-actions"><button class="primary-button" data-action="to-label">Adivinhar o rótulo <span aria-hidden="true">→</span></button></div></div></article>`;
}

function renderLabelStep(round) {
  return `<article class="round-card"><div class="phase-header"><div><div class="section-label">Etapa 3 · ficha do rótulo</div><h2>O que vocês acham que está no rótulo?</h2><p>Antes de revelar a garrafa, cada participante registra seu próprio palpite. Nome do rótulo e produtor ficam fora da pontuação.</p></div><span class="phase-pill">Cada participante</span></div><div class="reveal-banner"><span class="reveal-icon">⌁</span><span><strong>Hora de marcar.</strong> País, região, sub-região, safra, álcool, uvas e classificação valem pontos; revelem a garrafa só na correção.</span></div>${renderLabelBoard(round)}<div class="round-actions"><div class="left-actions"><button class="secondary-button" data-action="back-visual">← Voltar ao visual</button></div><div class="right-actions"><button class="primary-button" data-action="to-results">Revelar e mostrar resultado <span aria-hidden="true">→</span></button></div></div><p class="save-note">Use “Outra / corte não sei” quando não quiser arriscar uma casta específica. Para as uvas, marque quantas achar necessário.</p></article>`;
}

function bulkOptionsFor(field) {
  return field.key === 'alcohol' ? WINE_ALCOHOL_BANDS : field.options || [];
}

function renderBulkRowControl(field, scope) {
  const mode = scope === 'label' ? 'bulk-label' : 'bulk-answer';
  if (field.type === 'multi') {
    return `<div class="row-bulk"><span>igual para todos</span>${renderMultiPicker(field, [], mode)}<button class="row-apply-button" type="button" data-action="apply-row" data-bulk-scope="${scope}" data-field="${field.key}">Aplicar</button></div>`;
  }
  const options = bulkOptionsFor(field);
  const custom = field.catalog;
  return `<div class="row-bulk"><span>igual para todos</span><div class="bulk-select-wrap"><select class="bulk-select" data-bulk-select data-field="${field.key}" data-bulk-scope="${scope}"><option value="">Escolher…</option>${options.map(option => `<option value="${esc(option)}">${esc(option)}</option>`).join('')}${custom ? `<option value="${CUSTOM_OPTION}">Não encontrei — inserir</option>` : ''}</select>${custom ? `<input class="input bulk-custom-input" data-bulk-custom data-field="${field.key}" data-bulk-scope="${scope}" placeholder="ou digite" autocomplete="off" />` : ''}</div><button class="row-apply-button" type="button" data-action="apply-row" data-bulk-scope="${scope}" data-field="${field.key}">Aplicar</button></div>`;
}

function renderBoard(round, groupKey, showKey) {
  const group = FIELD_GROUPS.find(item => item.key === groupKey);
  const eligible = getEligibleParticipants(round);
  const fields = activeSensoryFields(round, groupKey);
  if (!fields.length) return `<div class="label-empty"><strong>Nenhum critério oficial informado nesta etapa.</strong><span>O dono não cadastrou uma resposta para este grupo; ninguém será perguntado e nenhum ponto será descontado.</span></div>`;
  return `<div class="board-wrap"><div class="board-scroll"><table class="score-grid"><thead><tr><th scope="col">Critério</th>${eligible.map(person => `<th scope="col" class="player-head">${esc(person.name)}<small>palpite</small></th>`).join('')}<th scope="col" class="key-head">Gabarito<small>${esc(participantName(round.ownerId))}</small></th></tr></thead><tbody>${fields.map(field => `<tr><th scope="row"><span>${field.label}</span><small>${field.type === 'multi' ? 'marque várias' : `${field.options.length} opções`}</small>${renderBulkRowControl(field, 'player')}</th>${eligible.map(person => `<td>${selectFor(field, round.answers[person.id]?.[field.key] || '', { scope: 'player', field: field.key, participant: person.id })}</td>`).join('')}<td class="key-cell">${showKey ? renderKeyValue(round.answerKey[field.key]) : '<span class="hidden-key">oculto</span>'}</td></tr>`).join('')}</tbody></table></div></div><p class="board-help">Dica: escolha “igual para todos” na própria linha e toque em Aplicar quando a mesa tiver o mesmo palpite. Deslize a tabela para o lado no celular.</p>`;
}

function renderLabelBoard(round) {
  const eligible = getEligibleParticipants(round);
  const fields = activeLabelFields(round);
  if (!fields.length) return `<div class="label-empty"><strong>Nenhuma informação de rótulo foi cadastrada no gabarito.</strong><span>Essa etapa será pulada na pontuação. O resultado poderá ser salvo sem perguntar nada aos participantes.</span></div>`;
  return `<div class="board-wrap label-board"><div class="board-scroll"><table class="score-grid"><thead><tr><th scope="col">Característica</th>${eligible.map(person => `<th scope="col" class="player-head">${esc(person.name)}<small>palpite</small></th>`).join('')}<th scope="col" class="key-head">Gabarito<small>oculto até a correção</small></th></tr></thead><tbody>${fields.map(field => `<tr><th scope="row"><span>${esc(field.label)}</span><small>${field.key === 'grapes' ? 'marque várias' : field.key === 'alcohol' ? 'faixa aproximada' : 'uma opção'}</small>${renderBulkRowControl(field, 'label')}</th>${eligible.map(person => `<td>${renderLabelGuessControl(field, round.labelAnswers[person.id]?.[field.key], person.id)}</td>`).join('')}<td class="key-cell"><span class="hidden-key">oculto</span></td></tr>`).join('')}</tbody></table></div></div><p class="board-help">Só aparecem os campos que o dono cadastrou. Use o controle “igual para todos” por linha quando fizer sentido e deslize a tabela no iPad.</p>`;
}

function renderLabelGuessControl(field, value, participantId) {
  if (field.key === 'alcohol') {
    const guessField = { ...field, type: 'select', options: WINE_ALCOHOL_BANDS };
    return labelSelectFor(guessField, value, participantId);
  }
  if (field.type === 'multi') return renderMultiPicker(field, value, 'label-answer', participantId);
  return labelSelectFor(field, value, participantId);
}

function renderKeyValue(value) {
  return value ? `<span class="key-value">${esc(displayValue(value))}<span>resposta certa</span></span>` : '<span class="hidden-key">não preenchido</span>';
}

function renderLabelSnapshot(info) {
  const normalized = normalizeLabelInfo(info);
  const title = normalized.wineName || normalized.producer || 'Garrafa revelada';
  const chips = LABEL_FIELDS.filter(field => normalized[field.key] && field.key !== 'wineName' && field.key !== 'producer').map(field => `<span class="label-chip"><small>${esc(field.label)}</small>${esc(field.key === 'alcohol' ? `${normalized[field.key]}%` : displayValue(normalized[field.key]))}</span>`).join('');
  if (!hasLabelInfo(normalized)) return `<div class="label-empty"><strong>Ficha do rótulo ainda vazia.</strong><span>O dono pode completar as informações na próxima rodada.</span></div>`;
  return `<section class="label-snapshot"><div><div class="section-label">Ficha do rótulo</div><h3>${esc(title)}</h3>${normalized.producer && normalized.wineName ? `<p>${esc(normalized.producer)}</p>` : ''}</div><div class="label-chips">${chips}</div>${renderLookupDetails(normalized.lookupData)}</section>`;
}

function hasLabelInfo(info) {
  return LABEL_FIELDS.some(field => field.type === 'multi' ? Array.isArray(info[field.key]) && info[field.key].length : String(info[field.key] || '').trim()) || Object.keys(info.lookupData?.fields || {}).length > 0;
}

function renderResultsStep(round) {
  const result = calculateRound(round);
  const winner = [...result.scores].filter(score => score.score > 0).sort((a, b) => b.score - a.score)[0];
  return `<article class="round-card"><div class="result-hero"><div class="eyebrow">Etapa 5 · hora da verdade</div><h2>${winner ? `${esc(winner.name)} puxou a fila.` : 'A mesa chegou ao veredito.'}</h2><p>${winner ? `${formatPoints(winner.score)} ponto${winner.score === 1 ? '' : 's'} em ${winner.max} critérios. Verde vale 1, amarelo vale 0,5; agora é só salvar a rodada.` : 'Confira os palpites antes de registrar o resultado.'}</p></div>${renderLabelSnapshot(round.labelInfo || {})}${renderWineLearning(round)}<div class="score-legend"><span class="legend-exact">● 1,0 ponto · igual</span><span class="legend-near">● 0,5 ponto · aproximado</span><span class="legend-wrong">● 0 ponto · diferente</span></div><div class="result-cards">${result.scores.map(score => `<div class="result-card ${winner && score.id === winner.id ? 'leader' : ''}"><div class="result-name">${esc(score.name)}</div><div class="result-points">${formatPoints(score.score)}<small>/${score.max}</small></div><div class="result-status">${score.max ? Math.round((score.score / score.max) * 100) : 0}% de aproveitamento</div></div>`).join('')}</div><div class="detail-block">${result.scores.map(score => renderDetailPerson(score)).join('')}</div><div class="round-actions"><div class="left-actions"><button class="secondary-button" data-action="back-label">← Revisar palpites</button></div><div class="right-actions"><button class="primary-button" data-action="save-round">Salvar rodada e iniciar próxima <span aria-hidden="true">→</span></button></div></div></article>`;
}

function alcoholBandMatches(guessBand, correctAlcohol) {
  const value = Number(String(correctAlcohol).replace(',', '.'));
  if (!guessBand || !Number.isFinite(value)) return false;
  if (guessBand.startsWith('Até')) return value < 12;
  if (guessBand.startsWith('12')) return value >= 12 && value < 13;
  if (guessBand.startsWith('13')) return value >= 13 && value < 14;
  if (guessBand.startsWith('14')) return value >= 14 && value < 16;
  if (guessBand.startsWith('16')) return value >= 16;
  return false;
}

function alcoholBandIndex(value) {
  if (!value) return -1;
  if (String(value).startsWith('Até')) return 0;
  if (String(value).startsWith('12')) return 1;
  if (String(value).startsWith('13')) return 2;
  if (String(value).startsWith('14')) return 3;
  if (String(value).startsWith('16')) return 4;
  return -1;
}

function sameMulti(left, right) {
  const a = normalizeMulti(left).map(item => item.toLocaleLowerCase()).sort();
  const b = normalizeMulti(right).map(item => item.toLocaleLowerCase()).sort();
  return a.length > 0 && a.length === b.length && a.every((item, index) => item === b[index]);
}

function overlapsMulti(left, right) {
  const correct = new Set(normalizeMulti(right).map(item => item.toLocaleLowerCase()));
  return normalizeMulti(left).some(item => correct.has(item.toLocaleLowerCase()));
}

function colorFamily(value) {
  const normalized = normalizeLookupText(value);
  if (['rubi', 'granada', 'violeta'].some(item => normalized.includes(item))) return 'red';
  if (['palha', 'dourado'].some(item => normalized.includes(item))) return 'white';
  if (normalized.includes('salmao')) return 'rose';
  return '';
}

function sameCountry(left, right, answerCountry = '', correctCountry = '') {
  const countryOf = (value, fallback) => {
    const parts = String(value || '').split(' · ');
    return parts.length > 1 ? parts[0].trim() : String(fallback || '').trim();
  };
  const answerOrigin = countryOf(left, answerCountry);
  const correctOrigin = countryOf(right, correctCountry);
  return Boolean(answerOrigin && correctOrigin && answerOrigin === correctOrigin);
}

function scoreResult(points, status, answer, correct, explanation) {
  return { points, status, answer, correctAnswer: correct, isCorrect: status === 'exact', explanation };
}

function evaluateSensory(field, answer, correct) {
  const hasAnswer = hasValue(field, answer);
  const exact = hasAnswer && (field.type === 'multi' ? sameMulti(answer, correct) : answer === correct);
  if (exact) return scoreResult(1, 'exact', answer, correct, explainDetail(field.key, answer, correct, 'exact'));
  let near = false;
  if (hasAnswer && field.type === 'multi') near = overlapsMulti(answer, correct);
  if (hasAnswer && field.proximity === 'adjacent') {
    const answerIndex = field.options.indexOf(answer);
    const correctIndex = field.options.indexOf(correct);
    near = answerIndex >= 0 && correctIndex >= 0 && Math.abs(answerIndex - correctIndex) === 1;
  }
  if (hasAnswer && field.proximity === 'family') near = Boolean(colorFamily(answer) && colorFamily(answer) === colorFamily(correct));
  return scoreResult(near ? 0.5 : 0, near ? 'near' : 'wrong', answer, correct, explainDetail(field.key, answer, correct, near ? 'near' : 'wrong'));
}

function evaluateLabel(field, answer, correct, context = {}) {
  const hasAnswer = hasValue(field, answer);
  let exact = false;
  if (field.key === 'grapes') exact = hasAnswer && sameMulti(answer, correct);
  else if (field.key === 'alcohol') exact = hasAnswer && alcoholBandMatches(answer, correct);
  else exact = hasAnswer && answer === correct;
  if (exact) return scoreResult(1, 'exact', answer, correct, explainDetail(`label_${field.key}`, answer, correct, 'exact'));
  let near = false;
  if (hasAnswer && field.key === 'grapes') near = overlapsMulti(answer, correct);
  if (hasAnswer && field.key === 'alcohol') {
    const guessIndex = alcoholBandIndex(answer);
    const actualValue = Number(String(correct || '').replace(',', '.'));
    const actualIndex = actualValue < 12 ? 0 : actualValue < 13 ? 1 : actualValue < 14 ? 2 : actualValue < 16 ? 3 : actualValue >= 16 ? 4 : -1;
    near = guessIndex >= 0 && actualIndex >= 0 && Math.abs(guessIndex - actualIndex) === 1;
  }
  if (hasAnswer && ['region', 'subregion'].includes(field.key)) near = sameCountry(answer, correct, context.answerCountry, context.correctCountry);
  if (hasAnswer && field.key === 'vintage' && /^\d{4}$/.test(answer) && /^\d{4}$/.test(correct)) near = Math.abs(Number(answer) - Number(correct)) === 1;
  return scoreResult(near ? 0.5 : 0, near ? 'near' : 'wrong', answer, correct, explainDetail(`label_${field.key}`, answer, correct, near ? 'near' : 'wrong'));
}

const FIELD_GUIDANCE = {
  type: 'O tipo é uma leitura estrutural; cor, corpo e acidez ajudam, mas estilos rosados e cortes podem confundir.',
  aroma: 'Aromas se sobrepõem: fruta, flor, erva, especiaria e madeira podem aparecer juntos no mesmo vinho.',
  dryness: 'A doçura percebida pode ser mascarada pela acidez, pelo álcool e pela temperatura de serviço.',
  acidity: 'Acidez dá frescor e faz a boca salivar; álcool e temperatura podem alterar a sensação.',
  body: 'Corpo é o peso do vinho na boca e combina álcool, concentração, açúcar e extração.',
  tannin: 'Tanino dá sensação de secura ou adstringência na gengiva; comida e acidez podem escondê-lo.',
  finish: 'Persistência é quanto o sabor continua depois de engolir, não apenas a intensidade do primeiro gole.',
  color: 'Luz, taça, idade e oxidação alteram a tonalidade; compare sempre contra um fundo claro.',
  clarity: 'Sedimentos, filtração e estilos naturais podem deixar o vinho menos límpido sem significar defeito.',
  intensity: 'Intensidade visual depende da concentração de pigmento, da taça e da iluminação.',
  label_country: 'O país é uma pista ampla; clima, altitude e uvas internacionais fazem países diferentes se parecerem.',
  label_region: 'Região e sub-região podem compartilhar clima e castas. Por isso a resposta pode estar geograficamente perto.',
  label_subregion: 'Sub-regiões são divisões mais específicas dentro de um território maior e costumam ser confundidas com a região-mãe.',
  label_vintage: 'Safra é o ano da colheita; clima de cada ano e o tempo de guarda mudam a expressão do vinho.',
  label_alcohol: 'O álcool percebido depende também de temperatura, doçura, acidez e equilíbrio do vinho.',
  label_grapes: 'Um corte pode ter várias castas e uma uva aromática pode dominar o nariz sem ser a única do rótulo.',
  label_appellation: 'A classificação segue regras do país ou da denominação; o nome comercial nem sempre revela essa categoria.'
};

function explainDetail(fieldKey, answer, correct, status) {
  const guidance = FIELD_GUIDANCE[fieldKey] || 'A percepção depende da combinação entre uva, clima, vinificação e serviço.';
  if (status === 'exact') return `Acertou. ${guidance}`;
  if (status === 'near') return `Quase: você marcou “${displayValue(answer)}” e o gabarito era “${displayValue(correct)}”. ${guidance}`;
  return answer ? `Você marcou “${displayValue(answer)}”; o gabarito era “${displayValue(correct)}”. ${guidance}` : `Sem resposta. O gabarito era “${displayValue(correct)}”. ${guidance}`;
}

function calculateRound(round) {
  const scores = getEligibleParticipants(round).map(person => {
    const blindDetails = activeSensoryFields(round).map(field => {
      const answer = round.answers[person.id]?.[field.key] || (field.type === 'multi' ? [] : '');
      const correctAnswer = round.answerKey[field.key] || (field.type === 'multi' ? [] : '');
      return { fieldKey: field.key, label: field.label, ...evaluateSensory(field, answer, correctAnswer) };
    });
    const labelDetails = activeLabelFields(round).map(field => {
      const answer = round.labelAnswers?.[person.id]?.[field.key] || (field.type === 'multi' ? [] : '');
      const correctAnswer = round.labelInfo?.[field.key] || (field.type === 'multi' ? [] : '');
      return { fieldKey: `label_${field.key}`, label: field.label, ...evaluateLabel(field, answer, correctAnswer, { answerCountry: round.labelAnswers?.[person.id]?.country, correctCountry: round.labelInfo?.country }) };
    });
    const details = [...blindDetails, ...labelDetails];
    return { id: person.id, name: person.name, score: details.reduce((total, item) => total + item.points, 0), max: details.length, details };
  });
  return { scores };
}

function formatPoints(value) {
  const number = Number(value) || 0;
  return Number.isInteger(number) ? String(number) : number.toFixed(1).replace('.', ',');
}

const GRAPE_PROFILES = {
  'Malbec': 'costuma contribuir com fruta escura, cor intensa e textura macia, especialmente em climas quentes e de altitude.',
  'Cabernet Sauvignon': 'costuma trazer estrutura, tanino e notas de cassis, ervas ou pimentão, além de boa capacidade de guarda.',
  'Merlot': 'tende a oferecer fruta madura, corpo macio e taninos mais redondos, embora o clima mude bastante o perfil.',
  'Syrah / Shiraz': 'pode combinar fruta escura, especiarias e um toque defumado; clima fresco ou quente altera muito a expressão.',
  'Pinot Noir': 'é delicada na cor e no tanino, com fruta vermelha e notas terrosas ou florais quando amadurece bem.',
  'Chardonnay': 'pode ir de cítrica e mineral a cremosa e amanteigada, conforme clima, malolática e uso de madeira.',
  'Sauvignon Blanc': 'frequentemente mostra acidez alta e aromas cítricos, herbáceos ou tropicais.',
  'Riesling': 'normalmente preserva acidez alta e pode variar de seco a doce, com fruta branca, cítricos e notas minerais.',
  'Tempranillo': 'costuma unir fruta vermelha, acidez equilibrada e tanino, ganhando notas de couro, baunilha ou especiaria com guarda.',
  'Tannat': 'é conhecido por cor profunda e taninos firmes, que podem ficar mais macios com tempo e comida.',
  'Carménère': 'pode lembrar frutas escuras, ervas e especiarias, com tanino médio e sensação vegetal quando colhida cedo.',
  'Touriga Nacional': 'costuma entregar cor, perfume floral, fruta escura e estrutura em tintos portugueses.'
};

function renderWineLearning(round) {
  const info = normalizeLabelInfo(round.labelInfo || {});
  const key = round.answerKey || {};
  const notes = [];
  normalizeMulti(info.grapes).slice(0, 3).forEach(grape => {
    const profile = GRAPE_PROFILES[grape] || 'pode contribuir para o perfil aromático, a textura e a estrutura; o resultado depende do clima e da vinificação.';
    notes.push(`<li><strong>${esc(grape)}:</strong> ${esc(profile)}</li>`);
  });
  if (key.acidity) notes.push(`<li><strong>Acidez ${esc(key.acidity.toLocaleLowerCase())}:</strong> ajuda a explicar ${key.acidity === 'Alta' ? 'o frescor e a salivação' : key.acidity === 'Baixa' ? 'uma sensação mais macia e redonda' : 'o equilíbrio entre frescor e volume'}.</li>`);
  if (key.body) notes.push(`<li><strong>Corpo ${esc(key.body.toLocaleLowerCase())}:</strong> é a impressão de peso na boca, influenciada por álcool, concentração, açúcar e extração.</li>`);
  if (key.tannin && key.tannin !== 'Não se aplica') notes.push(`<li><strong>Tanino ${esc(key.tannin.toLocaleLowerCase())}:</strong> é a sensação de secura ou adstringência que aparece principalmente na gengiva.</li>`);
  if (info.region || info.subregion) notes.push(`<li><strong>Origem:</strong> clima, altitude e solo de ${esc(info.subregion || info.region)} podem mudar maturação, acidez e concentração.</li>`);
  if (!notes.length) notes.push('<li>Complete o gabarito da garrafa para receber uma leitura didática mais específica nesta etapa.</li>');
  return `<section class="learning-card"><div class="section-label">Para entender melhor</div><h3>Por que este vinho pode ter esse perfil?</h3><p>São tendências de estilo, não regras absolutas: a uva, o lugar, a safra e a vinificação trabalham juntos.</p><ul>${notes.join('')}</ul></section>`;
}

function renderDetailPerson(score) {
  const details = score.details.length ? score.details.map(detail => { const status = detail.status || (detail.isCorrect ? 'exact' : 'wrong'); const points = detail.points ?? (detail.isCorrect ? 1 : 0); const explanation = detail.explanation || explainDetail(detail.fieldKey, detail.answer, detail.correctAnswer, status); return `<div class="detail-item ${status}"><div class="detail-line"><strong>${status === 'exact' ? '✓' : status === 'near' ? '≈' : '×'} ${esc(DETAIL_FIELDS[detail.fieldKey]?.short || detail.label)}</strong><b>${points === 1 ? '1,0' : points === 0.5 ? '0,5' : '0'} pt</b></div><span title="${esc(displayValue(detail.answer))}">${esc(displayValue(detail.answer))}</span><small>${esc(explanation)}</small></div>`; }).join('') : '<div class="detail-empty">Nenhum critério com gabarito nesta rodada.</div>';
  return `<section class="detail-person"><div class="detail-person-head"><strong>${esc(score.name)}</strong><span>${formatPoints(score.score)}/${score.max}</span></div><div class="detail-grid">${details}</div></section>`;
}

function renderHistoryPage() {
  const leaderboard = buildLeaderboard();
  return `<section class="review-head"><div><div class="eyebrow">Memória da mesa</div><h1>Placar geral</h1><p>${state.history.length} rodada${state.history.length === 1 ? '' : 's'} salva${state.history.length === 1 ? '' : 's'} neste dispositivo.</p></div><button class="secondary-button" data-action="go-home">← Voltar ao início</button></section><div class="dashboard-grid"><article class="panel"><div class="panel-heading"><div><div class="section-label">Ranking</div><h2>Acertos acumulados</h2></div></div>${leaderboard.length ? renderLeaderboard(leaderboard) : `<div class="empty-state"><strong>Nenhum ponto ainda.</strong>Salve uma rodada para montar o ranking.</div>`}</article><article class="panel"><div class="panel-heading"><div><div class="section-label">Controle</div><h2>Jogo salvo localmente</h2></div></div><p class="muted" style="font-size:14px;line-height:1.6">O histórico fica neste navegador e neste dispositivo. Se quiser recomeçar do zero, use o botão abaixo.</p><button class="danger-button full-button" data-action="reset-game">Reiniciar jogo inteiro</button></article></div><section class="panel" style="margin-top:24px"><div class="panel-heading"><div><div class="section-label">Rodadas</div><h2>Resultados por garrafa</h2></div></div>${state.history.length ? renderHistoryCards(state.history) : `<div class="empty-state"><strong>Ainda não há rodadas.</strong></div>`}</section>`;
}

function renderReviewPage() {
  const round = state.history.find(item => item.id === reviewId);
  if (!round) return renderHistoryPage();
  const sensoryFields = activeSensoryFields(round);
  const labelFields = activeLabelFields(round);
  return `<section class="review-head"><div><div class="eyebrow">Rodada ${round.number} · revisão</div><h1>O que a taça revelou.</h1><p>Gabarito de <strong>${esc(round.ownerName)}</strong> · ${formatDate(round.finishedAt)}</p></div><button class="secondary-button" data-action="open-history">← Voltar ao histórico</button></section><section class="panel">${renderLabelSnapshot(round.labelInfo || {})}${renderWineLearning(round)}<div class="section-label">Gabarito sensorial</div><h2>Respostas da garrafa</h2><div class="review-key">${sensoryFields.length ? sensoryFields.map(field => `<div class="review-key-item"><small>${esc(field.short)}</small><strong>${esc(displayValue(round.answerKey[field.key]))}</strong></div>`).join('') : '<p class="muted">Nenhum critério sensorial foi cadastrado.</p>'}</div><div class="section-label">Gabarito do rótulo</div><div class="review-key">${labelFields.length ? labelFields.map(field => `<div class="review-key-item"><small>${esc(field.short)}</small><strong>${esc(displayValue(round.labelInfo[field.key]))}</strong></div>`).join('') : '<p class="muted">Nenhuma característica do rótulo foi cadastrada.</p>'}</div>${(round.scores || []).map(score => renderDetailPerson(score)).join('')}</section>`;
}

function isComplete(round, scope, participantId = null) {
  const fields = activeSensoryFields(round, scope);
  const source = scope === 'key' ? round.answerKey : round.answers[participantId];
  return fields.every(field => hasValue(field, source?.[field.key]));
}

function allParticipantsComplete(round, scope) {
  return getEligibleParticipants(round).every(person => isComplete(round, scope, person.id));
}

function completeLabelKey(round) {
  return true;
}

function completeKey(round) {
  return Boolean(round?.ownerId);
}

function allLabelAnswersComplete(round) {
  const fields = activeLabelFields(round);
  return getEligibleParticipants(round).every(person => fields.every(field => {
    const value = round.labelAnswers?.[person.id]?.[field.key];
    return hasValue(field, value);
  }));
}

function goToStep(step) {
  if (!state.currentRound) return;
  state.currentRound.step = step;
  saveState();
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function saveRound() {
  const round = state.currentRound;
  const result = calculateRound(round);
  state.history.unshift({
    ...round,
    finishedAt: new Date().toISOString(),
    ownerName: participantName(round.ownerId),
    scores: result.scores
  });
  state.currentRound = null;
  state.nextRound = Math.max(state.nextRound, round.number + 1);
  screen = null;
  saveState();
  render();
  showToast('Rodada salva. A mesa está pronta para a próxima.', 'success');
}

function updateMultiSummary(details) {
  if (!details) return;
  const checked = [...details.querySelectorAll('input[type="checkbox"]:checked')];
  const custom = details.querySelector('[data-multi-custom], [data-label-key-custom], [data-label-answer-custom], [data-answer-multi-custom], [data-bulk-custom]')?.value.trim();
  const summary = details.querySelector('[data-multi-summary]');
  const count = checked.length + (custom ? normalizeMulti(custom).length : 0);
  if (summary) summary.textContent = count ? `${count} selecionada${count === 1 ? '' : 's'}` : 'Escolher…';
}

function bindEvents() {
  const app = document.querySelector('#app');
  if (!app) return;
  app.addEventListener('click', handleClick);
  app.addEventListener('change', handleChange);
  app.addEventListener('input', handleInput);
  const form = document.querySelector('#participant-form');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const input = document.querySelector('#participant-name');
    const name = input?.value.trim();
    if (!name) { showToast('Digite um nome para adicionar.', 'error'); return; }
    if (state.participants.some(person => person.name.toLocaleLowerCase() === name.toLocaleLowerCase())) { showToast('Esse nome já está na mesa.', 'error'); return; }
    state.participants.push({ id: uid('person'), name });
    saveState();
    render();
    document.querySelector('#participant-name')?.focus();
    showToast(`${name} entrou na mesa.`, 'success');
  });
}

function handleChange(event) {
  const target = event.target;
  if (target.matches('[data-scan-label]')) {
    scanBarcodeFile(target.files?.[0]);
    return;
  }
  if (target.matches('[data-owner]') && state.currentRound) {
    const oldAnswers = state.currentRound.answers || {};
    const oldLabelAnswers = state.currentRound.labelAnswers || {};
    state.currentRound.ownerId = target.value;
    state.currentRound.answers = Object.fromEntries(getEligibleParticipants(state.currentRound).map(person => [person.id, oldAnswers[person.id] || emptyAnswers()]));
    state.currentRound.labelAnswers = Object.fromEntries(getEligibleParticipants(state.currentRound).map(person => [person.id, oldLabelAnswers[person.id] || emptyLabelAnswers()]));
    saveState();
    render();
    showToast(`${participantName(target.value)} agora guarda o gabarito.`);
    return;
  }
  if (target.matches('[data-label-key]') && state.currentRound) {
    const field = target.dataset.field;
    if (target.dataset.multiValue) {
      const current = normalizeMulti(state.currentRound.labelInfo[field]);
      state.currentRound.labelInfo[field] = target.checked ? [...new Set([...current, target.dataset.multiValue])] : current.filter(value => value !== target.dataset.multiValue);
      updateMultiSummary(target.closest('.multi-details'));
    } else if (target.dataset.catalogSelect && target.value === CUSTOM_OPTION) {
      state.currentRound.labelInfo[field] = target.closest('.catalog-control')?.querySelector('[data-catalog-custom]')?.value.trim() || '';
    } else {
      state.currentRound.labelInfo[field] = target.value;
    }
    saveState();
    return;
  }
  if (target.matches('[data-label-answer]') && state.currentRound) {
    const participantId = target.dataset.participant;
    const field = target.dataset.field;
    state.currentRound.labelAnswers[participantId] ||= emptyLabelAnswers();
    if (target.dataset.multiValue) {
      const current = normalizeMulti(state.currentRound.labelAnswers[participantId][field]);
      state.currentRound.labelAnswers[participantId][field] = target.checked ? [...new Set([...current, target.dataset.multiValue])] : current.filter(value => value !== target.dataset.multiValue);
      updateMultiSummary(target.closest('.multi-details'));
    } else if (target.dataset.catalogSelect && target.value === CUSTOM_OPTION) {
      state.currentRound.labelAnswers[participantId][field] = target.closest('.catalog-control')?.querySelector('[data-catalog-custom]')?.value.trim() || '';
    } else {
      state.currentRound.labelAnswers[participantId][field] = target.value;
    }
    saveState();
    refreshRoundStatus();
    return;
  }
  if (target.matches('[data-answer-multi]') && state.currentRound) {
    const field = target.dataset.field;
    const participantId = target.dataset.participant;
    const source = target.dataset.scope === 'key' ? state.currentRound.answerKey : state.currentRound.answers[participantId];
    const current = normalizeMulti(source[field]);
    source[field] = target.checked ? [...new Set([...current, target.dataset.multiValue])] : current.filter(value => value !== target.dataset.multiValue);
    saveState();
    updateMultiSummary(target.closest('.multi-details'));
    refreshRoundStatus();
    return;
  }
  if (!target.matches('[data-answer]') || !state.currentRound) return;
  const scope = target.dataset.scope;
  const field = target.dataset.field;
  if (scope === 'key') state.currentRound.answerKey[field] = target.value;
  else if (scope === 'player' && target.dataset.participant) state.currentRound.answers[target.dataset.participant][field] = target.value;
  saveState();
  refreshRoundStatus();
}

function mergeCustomValues(current, field, text) {
  const catalogValues = normalizeMulti(current).filter(value => field.options.includes(value));
  return [...new Set([...catalogValues, ...normalizeMulti(text)])];
}

function handleInput(event) {
  const target = event.target;
  if (!state.currentRound) return;
  if (target.matches('[data-catalog-custom]')) {
    const value = target.value.trim();
    const select = target.closest('.catalog-control')?.querySelector('[data-catalog-select]');
    if (select) select.value = value ? CUSTOM_OPTION : '';
    if (target.dataset.scope === 'label-key') state.currentRound.labelInfo[target.dataset.field] = value;
    if (target.dataset.scope === 'label-answer') {
      state.currentRound.labelAnswers[target.dataset.participant] ||= emptyLabelAnswers();
      state.currentRound.labelAnswers[target.dataset.participant][target.dataset.field] = value;
    }
    saveState();
    refreshRoundStatus();
    return;
  }
  if (target.matches('[data-label-key-custom]')) {
    state.currentRound.labelInfo[target.dataset.field] = mergeCustomValues(state.currentRound.labelInfo[target.dataset.field], LABEL_FIELD_BY_KEY[target.dataset.field], target.value);
    saveState();
    updateMultiSummary(target.closest('.multi-details'));
    return;
  }
  if (target.matches('[data-label-answer-custom]')) {
    const participantId = target.dataset.participant;
    state.currentRound.labelAnswers[participantId] ||= emptyLabelAnswers();
    state.currentRound.labelAnswers[participantId][target.dataset.field] = mergeCustomValues(state.currentRound.labelAnswers[participantId][target.dataset.field], LABEL_FIELD_BY_KEY[target.dataset.field], target.value);
    saveState();
    updateMultiSummary(target.closest('.multi-details'));
    refreshRoundStatus();
    return;
  }
  if (target.matches('[data-answer-multi-custom]')) {
    const field = FIELD_BY_KEY[target.dataset.field];
    const source = target.dataset.scope === 'key' ? state.currentRound.answerKey : state.currentRound.answers[target.dataset.participant];
    source[target.dataset.field] = mergeCustomValues(source[target.dataset.field], field, target.value);
    saveState();
    updateMultiSummary(target.closest('.multi-details'));
    refreshRoundStatus();
  }
}

function refreshRoundStatus() {
  const round = state.currentRound;
  if (!round) return;
  const eligible = getEligibleParticipants(round);
  const blind = countCompleted(round, 'blind');
  const visual = countCompleted(round, 'visual');
  const label = countLabelCompleted(round);
  const meters = document.querySelectorAll('.status-meter i');
  if (meters[0]) meters[0].style.width = `${eligible.length ? Math.round((blind / eligible.length) * 100) : 0}%`;
  if (meters[1]) meters[1].style.width = `${eligible.length ? Math.round((visual / eligible.length) * 100) : 0}%`;
  if (meters[2]) meters[2].style.width = `${eligible.length ? Math.round((label / eligible.length) * 100) : 0}%`;
  const statuses = document.querySelectorAll('.status-line strong');
  if (statuses[0] && round.step !== 'key') statuses[0].textContent = `${blind}/${eligible.length}`;
  if (statuses[1] && ['visual', 'label', 'results'].includes(round.step)) statuses[1].textContent = `${visual}/${eligible.length}`;
  if (statuses[2] && ['label', 'results'].includes(round.step)) statuses[2].textContent = `${label}/${eligible.length}`;
}

function copyAnswerValue(value) {
  return Array.isArray(value) ? [...value] : value;
}

function applyRowAnswers(actionElement) {
  const round = state.currentRound;
  const row = actionElement.closest('tr');
  const fieldKey = actionElement.dataset.field;
  const scope = actionElement.dataset.bulkScope;
  const field = scope === 'label' ? LABEL_FIELD_BY_KEY[fieldKey] : FIELD_BY_KEY[fieldKey];
  if (!round || !row || !field) return;
  let value;
  if (field.type === 'multi') {
    const checked = [...row.querySelectorAll('[data-bulk-multi]:checked')].map(input => input.dataset.multiValue);
    const custom = row.querySelector('[data-bulk-custom]')?.value || '';
    value = [...new Set([...checked, ...normalizeMulti(custom)])];
  } else {
    const select = row.querySelector('[data-bulk-select]');
    const custom = row.querySelector('[data-bulk-custom]')?.value.trim() || '';
    value = select?.value === CUSTOM_OPTION ? custom : (select?.value || '');
  }
  if (!hasValue(field, value)) {
    showToast('Escolha uma resposta na linha antes de aplicar.', 'error');
    return;
  }
  getEligibleParticipants(round).forEach(person => {
    if (scope === 'label') round.labelAnswers[person.id][fieldKey] = copyAnswerValue(value);
    else round.answers[person.id][fieldKey] = copyAnswerValue(value);
  });
  saveState();
  render();
  showToast(`${field.label}: resposta aplicada a todos.`, 'success');
}

function normalizeLookupText(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
}

function firstText(...values) {
  for (const value of values.flat(Infinity)) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function listText(...values) {
  return values.flat(Infinity).filter(value => typeof value === 'string' && value.trim()).join(' ');
}

function catalogMatch(options, text) {
  const normalized = normalizeLookupText(text);
  return options.find(option => {
    const full = normalizeLookupText(option);
    const local = normalizeLookupText(option.split(' · ').pop());
    return normalized.includes(full) || (local.length > 3 && normalized.includes(local));
  }) || '';
}

function extractGrapes(product) {
  const raw = listText(product.varieties, product.varieties_tags, product.ingredients_text, product.ingredients_text_pt, product.ingredients_text_en);
  const found = WINE_GRAPES.filter(grape => {
    const parts = grape.split('/').map(part => normalizeLookupText(part).trim()).filter(Boolean);
    return parts.some(part => raw && normalizeLookupText(raw).includes(part));
  });
  if (found.length) return [...new Set(found)];
  const varieties = firstText(product.varieties, product.varieties_text);
  return varieties ? normalizeMulti(varieties) : [];
}

function buildLookupData(product = {}, barcode = '') {
  const fields = {
    'Código consultado': barcode,
    'Nome encontrado': firstText(product.product_name_pt, product.product_name, product.generic_name_pt, product.generic_name),
    'Marca / produtor': firstText(product.brands, product.brand_owner, product.manufacturing_places),
    'Países': listText(product.countries, product.countries_tags),
    'Origem': listText(product.origins, product.origins_tags),
    'Região': listText(product.regions, product.regions_tags),
    'Local de fabricação': listText(product.manufacturing_places, product.manufacturing_places_tags),
    'Safra': firstText(product.vintage, product.vintage_year, product.year),
    'Teor alcoólico': product.alcohol ?? product.alcohol_100g ?? '',
    'Uvas / variedades': listText(product.varieties, product.varieties_tags),
    'Categorias': listText(product.categories, product.categories_tags),
    'Classificações / rótulos': listText(product.labels, product.labels_tags),
    'Quantidade': firstText(product.quantity, product.product_quantity),
    'Embalagem': listText(product.packaging, product.packaging_tags),
    'Ingredientes': firstText(product.ingredients_text_pt, product.ingredients_text, product.ingredients_text_en),
    'Alergênicos': listText(product.allergens, product.allergens_tags),
    'Traços': listText(product.traces, product.traces_tags),
    'Lojas': listText(product.stores, product.stores_tags),
    'Tamanho da porção': firstText(product.serving_size, product.serving_quantity),
    'Imagem frontal': firstText(product.image_front_url, product.image_front_small_url)
  };
  return {
    source: 'Open Food Facts',
    searchedAt: new Date().toISOString(),
    fields: Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== '' && value != null)),
    raw: product
  };
}

function renderLookupDetails(lookupData = {}) {
  const fields = lookupData.fields && typeof lookupData.fields === 'object' ? lookupData.fields : {};
  const entries = Object.entries(fields);
  if (!entries.length && !lookupData.raw) return '';
  let raw = '';
  try { raw = lookupData.raw ? JSON.stringify(lookupData.raw, null, 2) : ''; } catch (error) { raw = ''; }
  return `<details class="lookup-details"><summary>Ficha técnica encontrada · ${esc(lookupData.source || 'consulta automática')}</summary><div class="lookup-data-grid">${entries.map(([label, value]) => `<div><small>${esc(label)}</small><strong>${esc(displayValue(value))}</strong></div>`).join('')}</div>${raw ? `<details class="lookup-raw"><summary>Ver todos os dados recebidos</summary><pre>${esc(raw)}</pre></details>` : ''}</details>`;
}

function mapProductToLabelInfo(product, barcode) {
  const countriesText = listText(product.countries, product.countries_tags, product.origins, product.origins_tags);
  const regionsText = listText(product.regions, product.regions_tags, product.origins, product.origins_tags);
  const country = catalogMatch(WINE_COUNTRIES.filter(item => item !== 'Outro / não sei'), countriesText);
  const region = catalogMatch(WINE_REGIONS, regionsText);
  const subregion = catalogMatch(WINE_SUBREGIONS, regionsText);
  const alcohol = product.alcohol ?? product.alcohol_100g ?? '';
  const info = normalizeLabelInfo({
    barcode,
    wineName: firstText(product.product_name_pt, product.product_name, product.generic_name_pt, product.generic_name),
    producer: firstText(product.brands, product.brand_owner),
    country,
    region: region || (firstText(product.regions, product.origins) || ''),
    subregion: subregion || '',
    alcohol: alcohol === '' ? '' : String(alcohol),
    grapes: extractGrapes(product),
    appellation: catalogMatch(WINE_APPELLATIONS, listText(product.categories, product.categories_tags, product.labels, product.labels_tags))
  });
  info.lookupData = buildLookupData(product, barcode);
  return info;
}

async function lookupProductByBarcode(rawBarcode) {
  const barcode = String(rawBarcode || '').replace(/\D/g, '');
  if (barcode.length < 8) {
    showToast('Digite um código de barras válido com pelo menos 8 números.', 'error');
    return;
  }
  if (!state.currentRound) return;
  showToast('Buscando a ficha pública da garrafa…');
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}`, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('lookup-failed');
    const payload = await response.json();
    if (Number(payload.status) !== 1 || !payload.product) {
      showToast('Não encontrei esse código na base pública. Você pode preencher ou inserir manualmente.', 'error');
      return;
    }
    const mapped = mapProductToLabelInfo(payload.product, barcode);
    const mergedLabelInfo = { ...state.currentRound.labelInfo, lookupData: mapped.lookupData };
    LABEL_FIELDS.forEach(field => {
      if (hasValue(field, mapped[field.key])) mergedLabelInfo[field.key] = mapped[field.key];
    });
    state.currentRound.labelInfo = mergedLabelInfo;
    saveState();
    render();
    showToast('Ficha encontrada. Revise os campos antes de começar a degustação.', 'success');
  } catch (error) {
    showToast('Não foi possível consultar agora. Confira a internet ou preencha manualmente.', 'error');
  }
}

async function scanBarcodeFile(file) {
  if (!file || !state.currentRound) return;
  if (!('BarcodeDetector' in window)) {
    showToast('A leitura automática por câmera não está disponível neste Safari. Digite o número e toque em Buscar.', 'error');
    return;
  }
  try {
    const detector = new window.BarcodeDetector();
    const image = await createImageBitmap(file);
    const results = await detector.detect(image);
    image.close?.();
    const code = results[0]?.rawValue;
    if (!code) {
      showToast('Não consegui identificar o código na foto. Tente aproximar a câmera ou digite o número.', 'error');
      return;
    }
    document.querySelector('#label-code')?.setAttribute('value', code);
    await lookupProductByBarcode(code);
  } catch (error) {
    showToast('A câmera não conseguiu ler esse código. Digite o número para consultar.', 'error');
  }
}

function handleClick(event) {
  const insideDetails = event.target.closest('.multi-details');
  document.querySelectorAll('.multi-details[open]').forEach(details => {
    if (details !== insideDetails) details.removeAttribute('open');
  });
  const actionElement = event.target.closest('[data-action]');
  if (!actionElement) return;
  event.preventDefault();
  const action = actionElement.dataset.action;
  const id = actionElement.dataset.id;
  if (action === 'close-multi') {
    actionElement.closest('.multi-details')?.removeAttribute('open');
    return;
  }
  if (action === 'apply-row') { applyRowAnswers(actionElement); return; }
  if (action === 'lookup-label') { lookupProductByBarcode(document.querySelector('#label-code')?.value || ''); return; }
  if (action === 'go-home') { screen = null; render(); return; }
  if (action === 'open-history') { screen = 'history'; render(); return; }
  if (action === 'review-round') { reviewId = id; screen = 'review'; render(); return; }
  if (action === 'start-round') {
    if (state.participants.length < 2) { showToast('Cadastre pelo menos duas pessoas para começar.', 'error'); return; }
    screen = null;
    state.currentRound = createRound();
    saveState();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  if (action === 'move-participant') { moveParticipant(id, actionElement.dataset.direction); return; }
  if (action === 'remove-participant') { removeParticipant(id); return; }
  if (action === 'to-blind') {
    if (!completeKey(state.currentRound)) { showToast('Escolha quem trouxe a garrafa antes de começar.', 'error'); return; }
    goToStep('blind'); return;
  }
  if (action === 'back-key') { goToStep('key'); return; }
  if (action === 'to-visual') {
    if (!allParticipantsComplete(state.currentRound, 'blind')) { showToast('Complete os palpites de nariz e boca de todos antes da revelação.', 'error'); return; }
    goToStep('visual'); return;
  }
  if (action === 'back-blind') { goToStep('blind'); return; }
  if (action === 'to-label') {
    if (!allParticipantsComplete(state.currentRound, 'visual')) { showToast('Complete a análise visual de todos antes de abrir o rótulo.', 'error'); return; }
    goToStep('label'); return;
  }
  if (action === 'to-results') {
    if (!allLabelAnswersComplete(state.currentRound)) { showToast('Complete os palpites do rótulo de todos antes de corrigir.', 'error'); return; }
    goToStep('results'); return;
  }
  if (action === 'back-visual') { goToStep('visual'); return; }
  if (action === 'back-label') { goToStep('label'); return; }
  if (action === 'save-round') { saveRound(); return; }
  if (action === 'delete-round') { deleteRound(id); return; }
  if (action === 'reset-game') { resetGame(); return; }
}

function moveParticipant(id, direction) {
  const index = state.participants.findIndex(person => person.id === id);
  const target = direction === 'up' ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= state.participants.length) return;
  [state.participants[index], state.participants[target]] = [state.participants[target], state.participants[index]];
  saveState();
  render();
}

function removeParticipant(id) {
  const person = state.participants.find(item => item.id === id);
  if (!person) return;
  if (state.participants.length <= 2) { showToast('Mantenha pelo menos duas pessoas na mesa.', 'error'); return; }
  if (!window.confirm(`Remover ${person.name} da mesa?`)) return;
  state.participants = state.participants.filter(item => item.id !== id);
  saveState();
  render();
}

function deleteRound(id) {
  const round = state.history.find(item => item.id === id);
  if (!round || !window.confirm(`Excluir a rodada ${round.number}? Essa ação altera o placar acumulado.`)) return;
  state.history = state.history.filter(item => item.id !== id);
  screen = screen === 'review' ? 'history' : screen;
  saveState();
  render();
  showToast(`Rodada ${round.number} excluída.`);
}

function resetGame() {
  if (!window.confirm('Reiniciar o jogo inteiro? Participantes, rodada atual e histórico serão apagados deste dispositivo.')) return;
  state = defaultState();
  screen = null;
  reviewId = null;
  saveState();
  render();
  showToast('Jogo reiniciado. Uma nova mesa está pronta.');
}

render();
