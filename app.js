javascript
// --- Saisie Partie ---
function updateScoreMoinsGap() {
  const score = parseInt(document.getElementById('input-score-joueur').value) || 0;
  const gap = parseInt(document.getElementById('input-gap').value) || 0;
  document.getElementById('score-moins-gap').value = score - gap;
  updateRatioScoreCoups();
}

function updateRatioScoreCoups() {
  const score = parseInt(document.getElementById('input-score-joueur').value) || 0;
  const nbCoups = parseInt(document.getElementById('input-nb-coups').value) || 1;
  document.getElementById('ratio-score-coups').value = (score / nbCoups).toFixed(2);
}

document.getElementById('input-score-joueur').addEventListener('input', updateScoreMoinsGap);
document.getElementById('input-gap').addEventListener('input', updateScoreMoinsGap);
document.getElementById('input-nb-coups').addEventListener('input', updateRatioScoreCoups);

function enregistrerPartie() {
  alert('Fonctionnalité à compléter selon votre gestion des parties.');
}

// --- Mots ratés ---
let motsRates = JSON.parse(localStorage.getItem('motsRatesGPS') || '[]');

function trierLettresMot(mot) {
  return mot.toUpperCase().split('').sort().join('');
}

function ajouterMotRate() {
  let mot = document.getElementById('mot-rate').value.trim();
  if (!mot) return;
  let motTrie = trierLettresMot(mot);
  let S = document.getElementById('cb-s').checked;
  let INC = document.getElementById('cb-inc').checked;
  let PC = document.getElementById('cb-pc').checked;
  let PL = document.getElementById('cb-pl').checked;
  let RCH = document.getElementById('cb-rch').checked;
  motsRates.push({mot: motTrie, S, INC, PC, PL, RCH});
  localStorage.setItem('motsRatesGPS', JSON.stringify(motsRates));
  document.getElementById('form-mot-rate').reset();
  afficherMotsRates();
  updateChart();
}

function afficherMotsRates() {
  let ul = document.getElementById('liste-mots-rates');
  ul.innerHTML = '';
  motsRates.forEach((item, index) => {
    let li = document.createElement('li');
    let tags = [];
    if (item.S) tags.push('S');
    if (item.INC) tags.push('INC');
    if (item.PC) tags.push('PC');
    if (item.PL) tags.push('PL');
    if (item.RCH) tags.push('RCH');
    li.innerHTML = item.mot + (tags.length ? ' (' + tags.join(', ') + ')' : '');
    ul.appendChild(li);
  });
}

function exporterMotsRatesCSV() {
  if (!motsRates.length) {
    alert("Aucun mot raté à exporter.");
    return;
  }
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Mot raté (lettres triées),S,INC,PC,PL,RCH\n";
  motsRates.forEach(item => {
    csvContent += `${item.mot},${item.S?1:0},${item.INC?1:0},${item.PC?1:0},${item.PL?1:0},${item.RCH?1:0}\n`;
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  const dateStr = new Date().toISOString().slice(0,10);
  link.setAttribute("download", `mots_rates_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.getElementById("btn-export-csv").addEventListener("click", exporterMotsRatesCSV);

afficherMotsRates();

// ------ Chart.js histogramme ------
let chartInstance = null;
function updateChart() {
  // Calcule le nombre d'occurrences pour chaque tag
  let S=0, INC=0, PC=0, PL=0, RCH=0;
  for (let item of motsRates) {
    if (item.S) S++;
    if (item.INC) INC++;
    if (item.PC) PC++;
    if (item.PL) PL++;
    if (item.RCH) RCH++;
  }
  let data = [S, INC, PC, PL, RCH];
  const ctx = document.getElementById('chart-mots-rates').getContext('2d');
  if(chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['S', 'INC', 'PC', 'PL', 'RCH'],
      datasets: [{
        label: "Nombre d'occurrences",
        data: data,
        backgroundColor: [
          'rgba(40, 167, 69, 0.6)',
          'rgba(255, 193, 7, 0.6)',
          'rgba(220, 53, 69, 0.6)',
          'rgba(23, 162, 184, 0.6)',
          'rgba(108, 117, 125, 0.6)'
        ]
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
updateChart();
