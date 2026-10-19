const teams = [
  'Barcelona SC', 'Emelec', 'Liga de Quito', 'Independiente del Valle',
  'Universidad Católica', 'Aucas', 'Orense', 'Deportivo Cuenca'
];

const matches = [
  { round: 1, home: 'Barcelona SC', away: 'Emelec', homeGoals: 2, awayGoals: 1 },
  { round: 1, home: 'Liga de Quito', away: 'Aucas', homeGoals: 1, awayGoals: 1 },
  { round: 1, home: 'Independiente del Valle', away: 'Deportivo Cuenca', homeGoals: 3, awayGoals: 0 },
  { round: 1, home: 'Universidad Católica', away: 'Orense', homeGoals: 2, awayGoals: 2 },
  { round: 2, home: 'Emelec', away: 'Liga de Quito', homeGoals: 0, awayGoals: 2 },
  { round: 2, home: 'Aucas', away: 'Independiente del Valle', homeGoals: 1, awayGoals: 2 },
  { round: 2, home: 'Deportivo Cuenca', away: 'Universidad Católica', homeGoals: 1, awayGoals: 0 },
  { round: 2, home: 'Orense', away: 'Barcelona SC', homeGoals: 1, awayGoals: 3 },
  { round: 3, home: 'Barcelona SC', away: 'Liga de Quito', homeGoals: 1, awayGoals: 1 },
  { round: 3, home: 'Independiente del Valle', away: 'Emelec', homeGoals: 2, awayGoals: 0 },
  { round: 3, home: 'Universidad Católica', away: 'Aucas', homeGoals: 3, awayGoals: 1 },
  { round: 3, home: 'Orense', away: 'Deportivo Cuenca', homeGoals: 0, awayGoals: 0 },
  { round: 4, home: 'Emelec', away: 'Aucas', homeGoals: 2, awayGoals: 2 },
  { round: 4, home: 'Liga de Quito', away: 'Independiente del Valle', homeGoals: 0, awayGoals: 1 },
  { round: 4, home: 'Deportivo Cuenca', away: 'Barcelona SC', homeGoals: 1, awayGoals: 2 },
  { round: 4, home: 'Orense', away: 'Universidad Católica', homeGoals: 1, awayGoals: 2 },
  { round: 5, home: 'Barcelona SC', away: 'Independiente del Valle', homeGoals: 0, awayGoals: 2 },
  { round: 5, home: 'Universidad Católica', away: 'Emelec', homeGoals: 1, awayGoals: 1 },
  { round: 5, home: 'Aucas', away: 'Deportivo Cuenca', homeGoals: 2, awayGoals: 0 },
  { round: 5, home: 'Orense', away: 'Liga de Quito', homeGoals: 1, awayGoals: 3 },
  { round: 6, home: 'Emelec', away: 'Deportivo Cuenca', homeGoals: 1, awayGoals: 0 },
  { round: 6, home: 'Liga de Quito', away: 'Universidad Católica', homeGoals: 2, awayGoals: 2 },
  { round: 6, home: 'Aucas', away: 'Barcelona SC', homeGoals: 0, awayGoals: 1 },
  { round: 6, home: 'Independiente del Valle', away: 'Orense', homeGoals: 2, awayGoals: 1 },
  { round: 7, home: 'Barcelona SC', away: 'Universidad Católica', homeGoals: 2, awayGoals: 0 },
  { round: 7, home: 'Aucas', away: 'Orense', homeGoals: 1, awayGoals: 1 },
  { round: 7, home: 'Deportivo Cuenca', away: 'Liga de Quito', homeGoals: 0, awayGoals: 2 },
  { round: 7, home: 'Independiente del Valle', away: 'Emelec', homeGoals: 1, awayGoals: 1 }
];

const palette = { ink: '#35564b', green: '#82a95b', blue: '#73a9bf', coral: '#df8065', yellow: '#d5aa4d', grid: '#e9eee7', muted: '#839087' };
const charts = {};
const teamFilter = document.querySelector('#team-filter');
const roundFilter = document.querySelector('#round-filter');
const periodFilter = document.querySelector('#period-filter');
const searchInput = document.querySelector('#team-search');

function recordTemplate(name) {
  return { team: name, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0 };
}

function calculateStandings(matchSet) {
  const standings = new Map(teams.map((team) => [team, recordTemplate(team)]));
  matchSet.forEach((match) => {
    const home = standings.get(match.home);
    const away = standings.get(match.away);
    home.played += 1;
    away.played += 1;
    home.goalsFor += match.homeGoals;
    home.goalsAgainst += match.awayGoals;
    away.goalsFor += match.awayGoals;
    away.goalsAgainst += match.homeGoals;
    if (match.homeGoals > match.awayGoals) {
      home.wins += 1;
      home.points += 3;
      away.losses += 1;
    } else if (match.homeGoals < match.awayGoals) {
      away.wins += 1;
      away.points += 3;
      home.losses += 1;
    } else {
      home.draws += 1;
      away.draws += 1;
      home.points += 1;
      away.points += 1;
    }
  });
  return [...standings.values()].map((item) => ({ ...item, goalDifference: item.goalsFor - item.goalsAgainst }))
    .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor || a.team.localeCompare(b.team, 'es'));
}

function getFilteredMatches() {
  const selectedRound = roundFilter.value;
  const selectedPeriod = periodFilter.value;
  return matches.filter((match) => {
    if (selectedRound !== 'all' && match.round !== Number(selectedRound)) return false;
    if (selectedPeriod === 'opening' && match.round > 3) return false;
    if (selectedPeriod === 'closing' && match.round < 4) return false;
    return true;
  });
}

function selectedRecord(standings) {
  const selected = teamFilter.value;
  return selected === 'all' ? null : standings.find((item) => item.team === selected);
}

function updateKpis(matchSet, standings) {
  const goals = matchSet.reduce((total, match) => total + match.homeGoals + match.awayGoals, 0);
  const leader = standings[0];
  const topScorer = [...standings].sort((a, b) => b.goalsFor - a.goalsFor || b.goalDifference - a.goalDifference)[0];
  const selected = selectedRecord(standings);
  document.querySelector('#kpi-matches').textContent = matchSet.length;
  document.querySelector('#kpi-goals').textContent = goals;
  document.querySelector('#kpi-average').textContent = matchSet.length ? (goals / matchSet.length).toFixed(2) : '0.00';
  document.querySelector('#kpi-leader').textContent = leader?.played ? leader.team : 'Sin datos';
  document.querySelector('#kpi-leader-note').textContent = leader?.played ? `${leader.points} puntos · ${leader.played} PJ` : 'sin partidos en el filtro';
  document.querySelector('#kpi-top-scorer').textContent = topScorer?.played ? topScorer.team : 'Sin datos';
  document.querySelector('#kpi-scorer-note').textContent = topScorer?.played ? `${topScorer.goalsFor} goles a favor` : 'sin partidos en el filtro';
  document.querySelector('#kpi-selected').textContent = selected ? selected.points : '—';
  document.querySelector('#kpi-selected-note').textContent = selected ? `${selected.team} · ${selected.played} partidos` : 'selecciona un equipo';
}

function chartOptions(extra = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#142c2b', titleFont: { family: 'DM Sans', size: 10 }, bodyFont: { family: 'DM Sans', size: 10 }, padding: 9, displayColors: true } },
    scales: {
      x: { grid: { display: false }, ticks: { color: palette.muted, font: { family: 'DM Sans', size: 9 } }, border: { display: false } },
      y: { beginAtZero: true, grid: { color: palette.grid }, ticks: { color: palette.muted, font: { family: 'DM Sans', size: 9 }, precision: 0 }, border: { display: false } }
    },
    ...extra
  };
}

function replaceChart(id, config) {
  if (charts[id]) charts[id].destroy();
  const canvas = document.querySelector(`#${id}-chart`);
  charts[id] = new Chart(canvas, config);
}

function updateCharts(matchSet, standings) {
  const playedTeams = standings.filter((item) => item.played > 0);
  const selected = selectedRecord(standings);
  const activeTeam = selected?.team ?? playedTeams[0]?.team;
  const current = selected ?? playedTeams[0];
  const pointsColors = playedTeams.map((item) => item.team === activeTeam ? palette.green : '#aac399');

  replaceChart('points', { type: 'bar', data: { labels: playedTeams.map((item) => item.team), datasets: [{ label: 'Puntos', data: playedTeams.map((item) => item.points), backgroundColor: pointsColors, borderRadius: 2, maxBarThickness: 26 }] }, options: chartOptions() });
  replaceChart('record', { type: 'doughnut', data: { labels: ['Victorias', 'Empates', 'Derrotas'], datasets: [{ data: current ? [current.wins, current.draws, current.losses] : [0, 0, 0], backgroundColor: [palette.green, palette.yellow, palette.coral], borderWidth: 0, hoverOffset: 5 }] }, options: chartOptions({ cutout: '68%', plugins: { legend: { display: true, position: 'bottom', labels: { boxWidth: 8, boxHeight: 8, padding: 12, color: palette.muted, font: { family: 'DM Sans', size: 9 } } }, tooltip: chartOptions().plugins.tooltip } }) });

  const rounds = [...new Set(matchSet.map((match) => match.round))].sort((a, b) => a - b);
  const roundPoints = rounds.map((round) => {
    const oneRound = matchSet.filter((match) => match.round === round);
    const stats = calculateStandings(oneRound).find((item) => item.team === activeTeam);
    return stats?.points ?? 0;
  });
  replaceChart('trend', { type: 'line', data: { labels: rounds.map((round) => `J${round}`), datasets: [{ label: `${activeTeam ?? 'Equipo'} · puntos`, data: roundPoints, borderColor: palette.blue, backgroundColor: 'rgba(115,169,191,.14)', pointBackgroundColor: palette.blue, pointRadius: 3, borderWidth: 2, tension: .3, fill: true }] }, options: chartOptions() });
  replaceChart('goals', { type: 'bar', data: { labels: playedTeams.map((item) => item.team), datasets: [{ label: 'A favor', data: playedTeams.map((item) => item.goalsFor), backgroundColor: palette.green, borderRadius: 2 }, { label: 'En contra', data: playedTeams.map((item) => item.goalsAgainst), backgroundColor: palette.coral, borderRadius: 2 }] }, options: chartOptions({ plugins: { legend: { display: true, position: 'bottom', labels: { boxWidth: 8, boxHeight: 8, color: palette.muted, font: { family: 'DM Sans', size: 9 } } }, tooltip: chartOptions().plugins.tooltip } }) });
  const outcomes = matchSet.reduce((totals, match) => {
    if (match.homeGoals === match.awayGoals) totals.draws += 1;
    else if (match.homeGoals > match.awayGoals) totals.homeWins += 1;
    else totals.awayWins += 1;
    return totals;
  }, { homeWins: 0, draws: 0, awayWins: 0 });
  replaceChart('distribution', { type: 'doughnut', data: { labels: ['Gana local', 'Empate', 'Gana visitante'], datasets: [{ data: [outcomes.homeWins, outcomes.draws, outcomes.awayWins], backgroundColor: [palette.green, palette.yellow, palette.blue], borderWidth: 0, hoverOffset: 5 }] }, options: chartOptions({ cutout: '65%', plugins: { legend: { display: true, position: 'bottom', labels: { boxWidth: 8, boxHeight: 8, padding: 12, color: palette.muted, font: { family: 'DM Sans', size: 9 } } }, tooltip: chartOptions().plugins.tooltip } }) });
  document.querySelector('#record-subtitle').textContent = current ? `Balance de ${current.team}` : 'Sin partidos para mostrar';
}

function updateAnalysis(standings) {
  const selected = selectedRecord(standings);
  const panel = document.querySelector('#team-analysis');
  if (!selected) {
    panel.innerHTML = '<p class="analysis-lead">Selecciona un equipo para interpretar su rendimiento.</p><p class="analysis-copy">Los indicadores y el texto de análisis se calcularán a partir de los partidos que coincidan con los filtros.</p>';
    return;
  }
  const balance = selected.goalDifference > 0 ? `balance goleador positivo de +${selected.goalDifference}` : selected.goalDifference < 0 ? `balance goleador negativo de ${selected.goalDifference}` : 'balance goleador equilibrado';
  const outcome = selected.wins > selected.losses ? 'ha ganado más partidos de los que ha perdido' : selected.losses > selected.wins ? 'ha perdido más partidos de los que ha ganado' : 'mantiene el mismo número de victorias y derrotas';
  const scoring = selected.goalsFor > selected.goalsAgainst ? 'anota más goles de los que recibe' : selected.goalsFor < selected.goalsAgainst ? 'recibe más goles de los que anota' : 'anota y recibe la misma cantidad de goles';
  panel.innerHTML = `<p class="analysis-lead">${selected.team} presenta ${balance} en el conjunto visible.</p><p class="analysis-copy">Con ${selected.points} puntos, ${selected.wins} victorias y ${selected.played} partidos jugados, ${outcome}. Además, ${scoring}.</p><div class="analysis-stats"><span>${selected.goalsFor} GF</span><span>${selected.goalsAgainst} GC</span><span>${selected.draws} empates</span><span>${selected.losses} derrotas</span></div>`;
}

function updateTable(standings) {
  const query = searchInput.value.trim().toLocaleLowerCase('es');
  const selectedTeam = teamFilter.value;
  const visible = standings.filter((item) => item.team.toLocaleLowerCase('es').includes(query) && (selectedTeam === 'all' || item.team === selectedTeam));
  const body = document.querySelector('#standings-body');
  body.innerHTML = visible.map((item) => {
    const position = standings.indexOf(item) + 1;
    return `<tr class="${position <= 3 && item.played ? 'top-row' : ''}"><td class="position-cell">${String(position).padStart(2, '0')}</td><td class="team-cell">${item.team}</td><td>${item.played}</td><td>${item.wins}</td><td>${item.draws}</td><td>${item.losses}</td><td>${item.goalsFor}</td><td>${item.goalsAgainst}</td><td>${item.goalDifference > 0 ? '+' : ''}${item.goalDifference}</td><td class="points-cell">${item.points}</td></tr>`;
  }).join('');
  document.querySelector('#empty-state').classList.toggle('d-none', visible.length > 0);
}

function renderDashboard() {
  const matchSet = getFilteredMatches();
  const standings = calculateStandings(matchSet);
  updateKpis(matchSet, standings);
  updateCharts(matchSet, standings);
  updateAnalysis(standings);
  updateTable(standings);
  const selectedRound = roundFilter.value === 'all' ? 'todas las jornadas visibles' : `jornada ${roundFilter.value}`;
  const selectedPeriod = periodFilter.value === 'all' ? '' : ` · ${periodFilter.options[periodFilter.selectedIndex].text}`;
  document.querySelector('#table-scope').textContent = `Conjunto filtrado: ${selectedRound}${selectedPeriod}. Desempates por diferencia de goles y goles a favor.`;
  document.querySelector('#filter-status').textContent = `${matchSet.length} partidos · ${standings.filter((item) => item.played).length} equipos con actividad`;
}

teams.forEach((team) => teamFilter.add(new Option(team, team)));
for (let round = 1; round <= 7; round += 1) roundFilter.add(new Option(`Jornada ${round}`, String(round)));
[teamFilter, roundFilter, periodFilter].forEach((control) => control.addEventListener('change', renderDashboard));
searchInput.addEventListener('input', () => updateTable(calculateStandings(getFilteredMatches())));
document.querySelector('#clear-filters').addEventListener('click', () => {
  teamFilter.value = 'all';
  roundFilter.value = 'all';
  periodFilter.value = 'all';
  searchInput.value = '';
  renderDashboard();
});
renderDashboard();