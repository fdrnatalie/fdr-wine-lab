const STORAGE_KEY = 'vinhocego-state-v1';

const FIELD_GROUPS = [
  {
    key: 'blind',
    label: 'Às cegas',
    short: 'Nariz e boca',
    fields: [
      { key: 'type', label: 'Tipo de vinho', short: 'Tipo', options: ['Tinto', 'Branco', 'Rosé'] },
      { key: 'aroma', label: 'Aroma dominante', short: 'Nariz', options: ['Frutas vermelhas', 'Frutas negras', 'Frutas brancas', 'Floral', 'Herbáceo', 'Especiarias', 'Baunilha / madeira', 'Mineral'] },
      { key: 'dryness', label: 'Doçura', short: 'Doçura', options: ['Seco', 'Meio-seco', 'Doce'] },
      { key: 'acidity', label: 'Acidez', short: 'Acidez', options: ['Baixa', 'Média', 'Alta'] },
      { key: 'body', label: 'Corpo', short: 'Corpo', options: ['Leve', 'Médio', 'Encorpado'] },
      { key: 'tannin', label: 'Tanino', short: 'Tanino', options: ['Baixo', 'Médio', 'Alto', 'Não se aplica'] },
      { key: 'finish', label: 'Persistência', short: 'Final', options: ['Curto', 'Médio', 'Longo'] }
    ]
  },
  {
    key: 'visual',
    label: 'Visual',
    short: 'Depois da revelação',
    fields: [
      { key: 'color', label: 'Cor / tonalidade', short: 'Cor', options: ['Rubi', 'Granada', 'Violeta', 'Palha', 'Dourado', 'Salmão'] },
      { key: 'clarity', label: 'Limpidez', short: 'Limpidez', options: ['Límpido', 'Levemente turvo'] },
      { key: 'intensity', label: 'Intensidade visual', short: 'Intensidade', options: ['Baixa', 'Média', 'Alta'] }
    ]
  }
];

const ALL_FIELDS = FIELD_GROUPS.flatMap(group => group.fields);
const FIELD_BY_KEY = Object.fromEntries(ALL_FIELDS.map(field => [field.key, field]));

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

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!parsed || !Array.isArray(parsed.participants) || !Array.isArray(parsed.history)) return defaultState();
    return {
      ...defaultState(),
      ...parsed,
      nextRound: Number(parsed.nextRound) || parsed.history.length + 1
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

function emptyAnswers() {
  return Object.fromEntries(ALL_FIELDS.map(field => [field.key, '']));
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
    answers: Object.fromEntries(state.participants.filter(person => person.id !== ownerId).map(person => [person.id, emptyAnswers()])),
    startedAt: new Date().toISOString()
  };
}

function ensureAnswerSlots(round) {
  getEligibleParticipants(round).forEach(person => {
    round.answers[person.id] ||= emptyAnswers();
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
    <span class="score-total">${entry.score}<small> pts</small></span>
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

function renderHistoryCards(rounds) {
  return `<div class="history-list">${rounds.map(round => `<article class="history-card">
    <div class="history-summary"><div><strong>Rodada ${round.number} · ${esc(round.ownerName)}</strong><span>${formatDate(round.finishedAt)} · dono do gabarito</span></div><div class="history-actions"><button class="text-button" data-action="review-round" data-id="${round.id}">Revisar</button><button class="icon-button remove" data-action="delete-round" data-id="${round.id}" aria-label="Excluir rodada ${round.number}">×</button></div></div>
    <div class="history-detail"><table><thead><tr><th>Participante</th><th>Pontos</th></tr></thead><tbody>${(round.scores || []).map(score => `<tr><td>${esc(score.name)}</td><td>${score.score}/${score.max}</td></tr>`).join('')}</tbody></table></div>
  </article>`).join('')}</div>`;
}

function progressSteps(active) {
  const steps = [
    ['key', 'Gabarito'],
    ['blind', 'Às cegas'],
    ['visual', 'Visual'],
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
  <div class="round-layout"><div class="round-main">${round.step === 'key' ? renderKeyStep(round) : round.step === 'blind' ? renderBlindStep(round) : round.step === 'visual' ? renderVisualStep(round) : renderResultsStep(round)}</div><aside class="round-side">${renderRoundSide(round)}</aside></div>`;
}

function renderRoundSide(round) {
  const owner = getOwner(round);
  const eligible = getEligibleParticipants(round);
  const completedBlind = countCompleted(round, 'blind');
  const completedVisual = countCompleted(round, 'visual');
  return `<div class="round-card"><div class="section-label">Nesta rodada</div><h3>${eligible.length} participante${eligible.length === 1 ? '' : 's'} jogando</h3><p class="muted">${owner ? `<strong>${esc(owner.name)}</strong> serve a garrafa e guarda o gabarito.` : 'Escolha quem trouxe a garrafa.'}</p><div class="status-line"><span>Palpites preenchidos</span><strong>${round.step === 'key' ? '—' : `${completedBlind}/${eligible.length}`}</strong></div><div class="status-meter"><i style="width:${eligible.length ? Math.round((completedBlind / eligible.length) * 100) : 0}%"></i></div><div class="status-line"><span>Visual preenchido</span><strong>${round.step === 'visual' || round.step === 'results' ? `${completedVisual}/${eligible.length}` : '—'}</strong></div><div class="status-meter"><i style="width:${eligible.length ? Math.round((completedVisual / eligible.length) * 100) : 0}%"></i></div></div>
  <div class="callout"><strong>Dica de condução</strong>${round.step === 'key' ? 'O dono preenche o gabarito antes de servir. Não mostre esta tela aos convidados.' : round.step === 'blind' ? 'Passe a tela para cada pessoa ou registre as respostas em sentido horário.' : round.step === 'visual' ? 'Agora todos tiram as vendas. Compare a cor e a limpidez com a taça.' : 'Cada ponto vale um acerto contra o gabarito. O dono não entra nesta conta.'}</div>`;
}

function countCompleted(round, groupKey) {
  const fields = FIELD_GROUPS.find(group => group.key === groupKey)?.fields || [];
  return getEligibleParticipants(round).filter(person => fields.every(field => round.answers[person.id]?.[field.key])).length;
}

function renderKeyStep(round) {
  return `<article class="round-card"><div class="phase-header"><div><div class="section-label">Etapa de preparação</div><h2>Feche o rótulo. Abra os sentidos.</h2><p>Quem trouxe a garrafa preenche o gabarito. Ele ficará protegido até a hora da correção.</p></div><span class="phase-pill">Só o dono</span></div>
    <div class="key-owner"><div><label class="form-label" for="owner-select">Quem trouxe esta garrafa?</label><p class="muted" style="font-size:12px;margin:0">Essa pessoa será a última coluna e não pontua na rodada.</p></div><select id="owner-select" class="select-input" data-owner>${state.participants.map(person => `<option value="${person.id}" ${person.id === round.ownerId ? 'selected' : ''}>${esc(person.name)}</option>`).join('')}</select></div>
    <div class="key-groups">${FIELD_GROUPS.map(group => renderKeyGroup(round, group)).join('')}</div>
    <div class="round-actions"><div class="left-actions"><button class="secondary-button" data-action="go-home">Sair sem salvar</button></div><div class="right-actions"><button class="primary-button" data-action="to-blind">Gabarito preenchido · começar às cegas <span aria-hidden="true">→</span></button></div></div>
    <p class="save-note">O andamento desta rodada é salvo automaticamente neste dispositivo. Você pode atualizar a página sem perder o que já preencheu.</p>
  </article>`;
}

function renderKeyGroup(round, group) {
  return `<section><div class="key-group-title"><h3>${group.label}</h3><span>${group.short}</span></div><div class="key-fields">${group.fields.map(field => `<label class="key-field"><span>${field.label}</span>${selectFor(field, round.answerKey[field.key], { scope: 'key', field: field.key })}</label>`).join('')}</div></section>`;
}

function selectFor(field, value, meta = {}) {
  const attrs = `data-answer data-scope="${meta.scope || 'player'}" data-field="${field.key}"${meta.participant ? ` data-participant="${meta.participant}"` : ''}`;
  return `<select class="answer-select" ${attrs}><option value="">Escolher…</option>${field.options.map(option => `<option value="${esc(option)}" ${option === value ? 'selected' : ''}>${esc(option)}</option>`).join('')}</select>`;
}

function renderBlindStep(round) {
  return `<article class="round-card"><div class="phase-header"><div><div class="section-label">Etapa 1 · sem ver o rótulo</div><h2>O que a taça está dizendo?</h2><p>Registre o nariz e a boca de cada participante antes da revelação.</p></div><span class="phase-pill">Vendados</span></div><div class="reveal-banner"><span class="reveal-icon">◌</span><span><strong>Gabarito escondido.</strong> A última coluna está protegida até a correção.</span></div>${renderBoard(round, 'blind', false)}<div class="round-actions"><div class="left-actions"><button class="secondary-button" data-action="back-key">← Voltar ao gabarito</button></div><div class="right-actions"><button class="primary-button" data-action="to-visual">Tirar as vendas · análise visual <span aria-hidden="true">→</span></button></div></div></article>`;
}

function renderVisualStep(round) {
  return `<article class="round-card"><div class="phase-header"><div><div class="section-label">Etapa 2 · depois da revelação</div><h2>Agora, olhem a taça.</h2><p>Tirem as vendas e registrem cor, limpidez e intensidade visual.</p></div><span class="phase-pill">Revelado</span></div><div class="reveal-banner"><span class="reveal-icon">✦</span><span><strong>Rótulo revelado.</strong> Continuem a análise usando a luz e a cor do vinho.</span></div>${renderBoard(round, 'visual', false)}<div class="round-actions"><div class="left-actions"><button class="secondary-button" data-action="back-blind">← Voltar aos palpites</button></div><div class="right-actions"><button class="primary-button" data-action="to-results">Corrigir e mostrar resultado <span aria-hidden="true">→</span></button></div></div></article>`;
}

function renderBoard(round, groupKey, showKey) {
  const group = FIELD_GROUPS.find(item => item.key === groupKey);
  const eligible = getEligibleParticipants(round);
  return `<div class="board-wrap"><div class="board-scroll"><table class="score-grid"><thead><tr><th scope="col">Critério</th>${eligible.map(person => `<th scope="col" class="player-head">${esc(person.name)}<small>palpite</small></th>`).join('')}<th scope="col" class="key-head">Gabarito<small>${esc(participantName(round.ownerId))}</small></th></tr></thead><tbody>${group.fields.map(field => `<tr><th scope="row">${field.label}<small>${field.options.length} opções</small></th>${eligible.map(person => `<td>${selectFor(field, round.answers[person.id]?.[field.key] || '', { scope: 'player', field: field.key, participant: person.id })}</td>`).join('')}<td class="key-cell">${showKey ? renderKeyValue(round.answerKey[field.key]) : '<span class="hidden-key">oculto</span>'}</td></tr>`).join('')}</tbody></table></div></div><p class="board-help">Dica: deslize a tabela para o lado no celular. Cada célula é um seletor rápido.</p>`;
}

function renderKeyValue(value) {
  return value ? `<span class="key-value">${esc(value)}<span>resposta certa</span></span>` : '<span class="hidden-key">não preenchido</span>';
}

function renderResultsStep(round) {
  const result = calculateRound(round);
  const winner = [...result.scores].sort((a, b) => b.score - a.score)[0];
  return `<article class="round-card"><div class="result-hero"><div class="eyebrow">Etapa 4 · hora da verdade</div><h2>${winner ? `${esc(winner.name)} puxou a fila.` : 'A mesa chegou ao veredito.'}</h2><p>${winner ? `${winner.score} acerto${winner.score === 1 ? '' : 's'} em ${winner.max} critérios. Agora é só salvar a rodada.` : 'Confira os palpites antes de registrar o resultado.'}</p></div><div class="result-cards">${result.scores.map(score => `<div class="result-card ${winner && score.id === winner.id ? 'leader' : ''}"><div class="result-name">${esc(score.name)}</div><div class="result-points">${score.score}<small>/${score.max}</small></div><div class="result-status">${Math.round((score.score / score.max) * 100)}% de acerto</div></div>`).join('')}</div><div class="detail-block">${result.scores.map(score => renderDetailPerson(score)).join('')}</div><div class="round-actions"><div class="left-actions"><button class="secondary-button" data-action="back-visual">← Revisar respostas</button></div><div class="right-actions"><button class="primary-button" data-action="save-round">Salvar rodada e iniciar próxima <span aria-hidden="true">→</span></button></div></div></article>`;
}

function calculateRound(round) {
  const scores = getEligibleParticipants(round).map(person => {
    const details = ALL_FIELDS.map(field => {
      const answer = round.answers[person.id]?.[field.key] || '';
      const correctAnswer = round.answerKey[field.key] || '';
      return { fieldKey: field.key, label: field.label, answer, correctAnswer, isCorrect: answer !== '' && answer === correctAnswer };
    });
    return { id: person.id, name: person.name, score: details.filter(item => item.isCorrect).length, max: details.length, details };
  });
  return { scores };
}

function renderDetailPerson(score) {
  return `<section class="detail-person"><div class="detail-person-head"><strong>${esc(score.name)}</strong><span>${score.score}/${score.max}</span></div><div class="detail-grid">${score.details.map(detail => `<div class="detail-item ${detail.isCorrect ? 'correct' : 'wrong'}"><strong>${detail.isCorrect ? '✓' : '×'} ${esc(FIELD_BY_KEY[detail.fieldKey].short)}</strong><span title="${esc(detail.answer || 'Sem resposta')}">${esc(detail.answer || 'Sem resposta')}</span></div>`).join('')}</div></section>`;
}

function renderHistoryPage() {
  const leaderboard = buildLeaderboard();
  return `<section class="review-head"><div><div class="eyebrow">Memória da mesa</div><h1>Placar geral</h1><p>${state.history.length} rodada${state.history.length === 1 ? '' : 's'} salva${state.history.length === 1 ? '' : 's'} neste dispositivo.</p></div><button class="secondary-button" data-action="go-home">← Voltar ao início</button></section><div class="dashboard-grid"><article class="panel"><div class="panel-heading"><div><div class="section-label">Ranking</div><h2>Acertos acumulados</h2></div></div>${leaderboard.length ? renderLeaderboard(leaderboard) : `<div class="empty-state"><strong>Nenhum ponto ainda.</strong>Salve uma rodada para montar o ranking.</div>`}</article><article class="panel"><div class="panel-heading"><div><div class="section-label">Controle</div><h2>Jogo salvo localmente</h2></div></div><p class="muted" style="font-size:14px;line-height:1.6">O histórico fica neste navegador e neste dispositivo. Se quiser recomeçar do zero, use o botão abaixo.</p><button class="danger-button full-button" data-action="reset-game">Reiniciar jogo inteiro</button></article></div><section class="panel" style="margin-top:24px"><div class="panel-heading"><div><div class="section-label">Rodadas</div><h2>Resultados por garrafa</h2></div></div>${state.history.length ? renderHistoryCards(state.history) : `<div class="empty-state"><strong>Ainda não há rodadas.</strong></div>`}</section>`;
}

function renderReviewPage() {
  const round = state.history.find(item => item.id === reviewId);
  if (!round) return renderHistoryPage();
  return `<section class="review-head"><div><div class="eyebrow">Rodada ${round.number} · revisão</div><h1>O que a taça revelou.</h1><p>Gabarito de <strong>${esc(round.ownerName)}</strong> · ${formatDate(round.finishedAt)}</p></div><button class="secondary-button" data-action="open-history">← Voltar ao histórico</button></section><section class="panel"><div class="section-label">Gabarito oficial</div><h2>Respostas da garrafa</h2><div class="review-key">${ALL_FIELDS.map(field => `<div class="review-key-item"><small>${esc(field.short)}</small><strong>${esc(round.answerKey[field.key] || 'Sem resposta')}</strong></div>`).join('')}</div>${(round.scores || []).map(score => renderDetailPerson(score)).join('')}</section>`;
}

function isComplete(round, scope, participantId = null) {
  const fields = FIELD_GROUPS.find(group => group.key === scope)?.fields || [];
  const source = scope === 'key' ? round.answerKey : round.answers[participantId];
  return fields.every(field => source?.[field.key]);
}

function allParticipantsComplete(round, scope) {
  return getEligibleParticipants(round).every(person => isComplete(round, scope, person.id));
}

function completeKey(round) {
  return ALL_FIELDS.every(field => round.answerKey[field.key]);
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

function bindEvents() {
  const app = document.querySelector('#app');
  if (!app) return;
  app.addEventListener('click', handleClick);
  app.addEventListener('change', handleChange);
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
  if (target.matches('[data-owner]') && state.currentRound) {
    const oldAnswers = state.currentRound.answers || {};
    state.currentRound.ownerId = target.value;
    state.currentRound.answers = Object.fromEntries(getEligibleParticipants(state.currentRound).map(person => [person.id, oldAnswers[person.id] || emptyAnswers()]));
    saveState();
    render();
    showToast(`${participantName(target.value)} agora guarda o gabarito.`);
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

function refreshRoundStatus() {
  const round = state.currentRound;
  if (!round) return;
  const eligible = getEligibleParticipants(round);
  const blind = countCompleted(round, 'blind');
  const visual = countCompleted(round, 'visual');
  const meters = document.querySelectorAll('.status-meter i');
  if (meters[0]) meters[0].style.width = `${eligible.length ? Math.round((blind / eligible.length) * 100) : 0}%`;
  if (meters[1]) meters[1].style.width = `${eligible.length ? Math.round((visual / eligible.length) * 100) : 0}%`;
  const status = document.querySelector('.status-line strong');
  if (status && round.step !== 'key') status.textContent = `${blind}/${eligible.length}`;
}

function handleClick(event) {
  const actionElement = event.target.closest('[data-action]');
  if (!actionElement) return;
  event.preventDefault();
  const action = actionElement.dataset.action;
  const id = actionElement.dataset.id;
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
    if (!completeKey(state.currentRound)) { showToast('Preencha todas as respostas do gabarito antes de começar.', 'error'); return; }
    goToStep('blind'); return;
  }
  if (action === 'back-key') { goToStep('key'); return; }
  if (action === 'to-visual') {
    if (!allParticipantsComplete(state.currentRound, 'blind')) { showToast('Complete os palpites de nariz e boca de todos antes da revelação.', 'error'); return; }
    goToStep('visual'); return;
  }
  if (action === 'back-blind') { goToStep('blind'); return; }
  if (action === 'to-results') {
    if (!allParticipantsComplete(state.currentRound, 'visual')) { showToast('Complete a análise visual de todos antes de corrigir.', 'error'); return; }
    goToStep('results'); return;
  }
  if (action === 'back-visual') { goToStep('visual'); return; }
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
