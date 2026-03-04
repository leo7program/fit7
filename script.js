// ========= Util: armazenamento =========
const STORE_KEY = 'fitness_store_v2';
function loadStore(){
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
  catch(e){ return {}; }
}
function saveStore(obj){ localStorage.setItem(STORE_KEY, JSON.stringify(obj)); }

let STORE = loadStore();
if(!STORE.profile) STORE.profile = {};
if(!STORE.imcHistory) STORE.imcHistory = [];   // {ts, imc, gordura}
if(!STORE.photos) STORE.photos = [];
if(!STORE.snapshots) STORE.snapshots = [];
saveStore(STORE);

// ========= TABS =========
const tabBtns = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.tab');
tabBtns.forEach(btn => btn.addEventListener('click', () => openTab(btn.dataset.tab)));
function openTab(id){
  tabBtns.forEach(b=>b.classList.remove('active'));
  document.querySelectorAll(`[data-tab="${id}"]`).forEach(b=>b.classList.add('active'));
  sections.forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ========= TEMA CLARO / ESCURO =========
const darkToggle = document.getElementById('darkToggle');
const app = document.querySelector('.app');
const savedTheme = localStorage.getItem('theme_pref') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

function applyTheme(t){
  if(t === 'light'){ app.classList.remove('dark'); app.classList.add('light'); darkToggle.textContent = '🌙'; }
  else { app.classList.remove('light'); app.classList.add('dark'); darkToggle.textContent = '☀️'; }
  localStorage.setItem('theme_pref', t);
}
applyTheme(savedTheme);

darkToggle.addEventListener('click', () => {
  const isLight = app.classList.contains('light');
  applyTheme(isLight ? 'dark' : 'light');
});

// ========= PROFILE MODAL =========
const profileBtn = document.getElementById('profileBtn');
const profileModal = document.getElementById('profileModal');
const closeProfile = document.getElementById('closeProfile');
const saveProfileBtn = document.getElementById('saveProfile');
const profileName = document.getElementById('profileName');
const profileAge = document.getElementById('profileAge');
const profileSex = document.getElementById('profileSex');

function loadProfileToForm(){
  profileName.value = STORE.profile.name || '';
  profileAge.value = STORE.profile.age || '';
  profileSex.value = STORE.profile.sex || '';
}
loadProfileToForm();

profileBtn.addEventListener('click', ()=>{
  loadProfileToForm();
  profileModal.classList.remove('hidden');
});
closeProfile.addEventListener('click', ()=> profileModal.classList.add('hidden') );
saveProfileBtn.addEventListener('click', ()=>{
  STORE.profile = {
    name: profileName.value.trim(),
    age: profileAge.value ? parseInt(profileAge.value,10) : '',
    sex: profileSex.value || ''
  };
  saveStore(STORE);
  profileModal.classList.add('hidden');
  alert('Perfil salvo.');
});

// ========= CALCULAR IMC + GORDURA (Deurenberg) =========
const calcBtn = document.getElementById('calcBtn');
const resultadoBox = document.getElementById('resultadoBox');

function calcIMC(peso, altura){
  return peso / (altura*altura);
}
/*
 Deurenberg et al. (1991) estimate:
 %BF = 1.20*BMI + 0.23*age - 10.8*sex - 5.4
 sex = 1 for men, 0 for women
*/
function estimateBodyFat(bmi, age, sex){
  const s = (sex === 'male') ? 1 : 0;
  return 1.20*bmi + 0.23*(age||0) - 10.8*s - 5.4;
}

// ========= GRÁFICO (IMC + GORDURA) =========
const chartCanvas = document.getElementById('chartIMC');
let chart;

function buildChart() {
  const labels = STORE.imcHistory.map(e => new Date(e.ts).toLocaleDateString());
  const imcData = STORE.imcHistory.map(e => e.imc);
  const gordData = STORE.imcHistory.map(e => e.gordura === null ? null : e.gordura);

  const ctx = chartCanvas.getContext('2d');

  const gradientIMC = ctx.createLinearGradient(0,0,0,300);
  gradientIMC.addColorStop(0, 'rgba(124,58,237,0.25)');
  gradientIMC.addColorStop(1, 'rgba(124,58,237,0.03)');

  const gradientGord = ctx.createLinearGradient(0,0,0,300);
  gradientGord.addColorStop(0, 'rgba(255,107,129,0.22)');
  gradientGord.addColorStop(1, 'rgba(255,107,129,0.03)');

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'IMC',
          data: imcData,
          borderColor: 'rgba(124,58,237,1)',
          backgroundColor: gradientIMC,
          tension: 0.28,
          pointRadius: 4,
          pointHoverRadius:6,
          fill: true,
          yAxisID: 'y'
        },
        {
          label: 'Gordura % (estimada)',
          data: gordData,
          borderColor: 'rgba(255,107,129,1)',
          backgroundColor: gradientGord,
          tension: 0.28,
          pointRadius: 4,
          pointHoverRadius:6,
          fill: true,
          yAxisID: 'y2'
        }
      ]
    },
    options: {
      responsive:true,
      plugins:{
        legend:{position:'top'},
        tooltip:{
          mode:'index',
          intersect:false,
          callbacks:{
            label: function(ctx){
              const v = ctx.parsed.y;
              if(ctx.dataset.label.includes('Gordura')) return `${ctx.dataset.label}: ${v === null ? '—' : v.toFixed(1)+'%'}`;
              return `${ctx.dataset.label}: ${v.toFixed(1)}`;
            }
          }
        }
      },
      interaction:{mode:'index', intersect:false},
      scales:{
        x:{ grid:{display:false} },
        y:{
          type:'linear',
          display:true,
          position:'left',
          title:{display:true, text:'IMC'},
          grid:{color:'rgba(255,255,255,0.03)'}
        },
        y2:{
          type:'linear',
          display:true,
          position:'right',
          title:{display:true, text:'Gordura %'},
          grid:{display:false},
          ticks:{callback: v => v + '%'}
        }
      }
    }
  });
}

// inicializa gráfico
chart = buildChart();

// função para adicionar nova entrada
function updateChartWithEntry(entry){
  STORE.imcHistory.push(entry);
  saveStore(STORE);

  chart.data.labels.push(new Date(entry.ts).toLocaleDateString());
  chart.data.datasets[0].data.push(entry.imc);
  chart.data.datasets[1].data.push(entry.gordura === null ? null : entry.gordura);
  chart.update();
}

// botão calcular
calcBtn.addEventListener('click', ()=>{
  const altura = parseFloat(document.getElementById('altura').value);
  const peso = parseFloat(document.getElementById('peso').value);
  const idade = parseInt(document.getElementById('idade').value,10) || 0;
  const sexo = document.getElementById('sexo').value;

  if(!altura || !peso){ alert('Preencha altura e peso'); return; }
  const imc = calcIMC(peso, altura);
  const gordura = (sexo === 'male' || sexo === 'female') ? estimateBodyFat(imc, idade, sexo) : null;

  resultadoBox.innerHTML = `
    <p><strong>IMC:</strong> ${imc.toFixed(1)}</p>
    <p><strong>Gordura estimada:</strong> ${gordura !== null ? gordura.toFixed(1)+'%' : '—'}</p>
  `;

  const entry = { ts: new Date().toISOString(), imc: parseFloat(imc.toFixed(2)), gordura: gordura !== null ? parseFloat(gordura.toFixed(2)) : null };
  updateChartWithEntry(entry);
});

// ========= RESETAR GRÁFICOS =========
const resetChartBtn = document.getElementById('resetChartBtn');
resetChartBtn.addEventListener('click', ()=>{
  if(confirm('Deseja realmente resetar todo o histórico de IMC e Gordura?')){
    STORE.imcHistory = [];
    saveStore(STORE);           
    resultadoBox.innerHTML = '';
    if(chart) chart.destroy();
    chart = buildChart();
  }
});

// ========= SALVAR SNAPSHOT (medidas) =========
document.getElementById('saveSnapshot').addEventListener('click', ()=>{
  const altura = document.getElementById('altura').value;
  const peso = document.getElementById('peso').value;
  const cintura = document.getElementById('cintura').value;
  const idade = document.getElementById('idade').value;
  const sexo = document.getElementById('sexo').value;
  if(!altura || !peso) return alert('Preencha altura e peso antes de salvar.');
  STORE.snapshots.push({ ts: new Date().toISOString(), altura, peso, cintura, idade, sexo });
  saveStore(STORE);
  alert('Medidas salvas.');
});

// ========= EVOLUÇÃO (FOTOS) =========
const gallery = document.getElementById('gallery');
const uploadFoto = document.getElementById('uploadFotoEvolucao');
const addFotoBtn = document.getElementById('addFotoBtn');
const clearPhotos = document.getElementById('clearPhotos');

function renderGallery(){
  gallery.innerHTML = '';
  STORE.photos.forEach((src, i)=>{
    const div = document.createElement('div');
    div.className = 'foto';
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Evolução';
    const del = document.createElement('button');
    del.className = 'del';
    del.textContent = 'X';
    del.addEventListener('click', ()=>{
      STORE.photos.splice(i,1); saveStore(STORE); renderGallery();
    });
    div.appendChild(img);
    div.appendChild(del);
    gallery.appendChild(div);
  });
}
renderGallery();

addFotoBtn.addEventListener('click', ()=>{
  const file = uploadFoto.files[0];
  if(!file) return alert('Selecione uma imagem');
  const reader = new FileReader();
  reader.onload = e=>{
    STORE.photos.push(e.target.result);
    saveStore(STORE);
    renderGallery();
  };
  reader.readAsDataURL(file);
});
clearPhotos.addEventListener('click', ()=>{
  if(confirm('Deseja remover todas as fotos?')){
    STORE.photos = [];
    saveStore(STORE);
    renderGallery();
  }
});

// ========= TREINOS =========
const genTreinoBtn = document.getElementById('genTreino');
const treinoOutput = document.getElementById('treinoOutput');

const baseExercises = {
  costas: ['Puxada frontal na barra', 'Remada curvada', 'Remada baixa', 'Pullover'],
  perna: ['Agachamento livre', 'Leg press', 'Cadeira extensora', 'Stiff'],
  peito: ['Supino reto', 'Supino inclinado', 'Crucifixo', 'Flexão de braço'],
  braco: ['Rosca direta', 'Rosca martelo', 'Tríceps testa', 'Mergulho (paralelas)']
};

const levelAdjust = {
  iniciante: { sets: '3x8-12', notes: 'foco em técnica' },
  intermediario: { sets: '4x8-12', notes: 'aumentar intensidade' },
  avancado: { sets: '5x6-12', notes: 'variações e intensidade' }
};

genTreinoBtn.addEventListener('click', ()=>{
  const grupo = document.getElementById('grupoMuscular').value;
  const nivel = document.getElementById('nivel').value || 'iniciante';
  const preset = document.getElementById('presetTreino').value;

  if(!grupo) return alert('Escolha um grupo muscular');

  const list = baseExercises[grupo].slice(0,4);
  const lvl = levelAdjust[nivel];

  let presetNote = '';
  if(preset === 'cbum') presetNote = 'Preset CBum: foco em hipertrofia, mais volume.';
  if(preset === 'arnold') presetNote = 'Preset Arnold: foco em força e volume clássico.';
  if(preset === 'ramon') presetNote = 'Preset Ramon: foco em intensidade e compostos.';

  const html = `
    <p><strong>Grupo:</strong> ${grupo} — <strong>Nível:</strong> ${nivel}</p>
    ${presetNote ? `<p class="muted">${presetNote}</p>` : ''}
    <ul>
      ${list.map(ex => `<li>${ex} — <em>${lvl.sets}</em></li>`).join('')}
    </ul>
    <p class="muted">Observação: ${lvl.notes}.</p>
  `;
  treinoOutput.innerHTML = html;
});

// ========= EXPORTAR / IMPORTAR JSON =========
const downloadJSON = document.getElementById('downloadJSON');
const importJSONBtn = document.getElementById('importJSON');

downloadJSON.addEventListener('click', ()=>{
  const profileOnly = { profile: STORE.profile || {} };
  const blob = new Blob([JSON.stringify(profileOnly, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'perfil.json'; a.click();
  URL.revokeObjectURL(url);
});

importJSONBtn.addEventListener('click', ()=>{
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'application/json';
  input.onchange = e=>{
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ev=>{
      try{
        const parsed = JSON.parse(ev.target.result);
        if(parsed.profile){
          STORE.profile = parsed.profile;
          saveStore(STORE);
          loadProfileToForm();
          alert('Perfil importado com sucesso.');
        } else alert('Arquivo JSON não contém perfil válido.');
      }catch(err){ alert('Arquivo inválido.'); }
    };
    reader.readAsText(file);
  };
  input.click();
});
