// ---------- TABS ----------
const tabs = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.tab');
tabs.forEach(btn => {
  btn.addEventListener('click', () => {
    tabs.forEach(b => b.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// ---------- TEMA (CLARO/ESCURO) ----------
const darkToggle = document.getElementById('darkToggle');
const app = document.querySelector('.app');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  app.classList.add('dark');
  darkToggle.textContent = '☀️';
}
darkToggle.addEventListener('click', () => {
  app.classList.toggle('dark');
  const isDark = app.classList.contains('dark');
  darkToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ---------- PERFIL ----------
const profileBtn = document.getElementById('profileBtn');
const profileModal = document.getElementById('profileModal');
const closeProfile = document.getElementById('closeProfile');
const saveProfile = document.getElementById('saveProfile');
const profileName = document.getElementById('profileName');
const profileAge = document.getElementById('profileAge');
const profileSex = document.getElementById('profileSex');

let profile = JSON.parse(localStorage.getItem('profile')) || {};
if (profile.name) {
  profileName.value = profile.name;
  profileAge.value = profile.age;
  profileSex.value = profile.sex;
}

profileBtn.addEventListener('click', () => profileModal.classList.remove('hidden'));
closeProfile.addEventListener('click', () => profileModal.classList.add('hidden'));
saveProfile.addEventListener('click', () => {
  profile = {
    name: profileName.value,
    age: profileAge.value,
    sex: profileSex.value
  };
  localStorage.setItem('profile', JSON.stringify(profile));
  profileModal.classList.add('hidden');
});

// ---------- CALCULAR IMC + GORDURA CORPORAL ----------
const calcBtn = document.getElementById('calcBtn');
calcBtn.addEventListener('click', () => {
  const altura = parseFloat(document.getElementById('altura').value);
  const peso = parseFloat(document.getElementById('peso').value);
  const cintura = parseFloat(document.getElementById('cintura').value);
  const pescoco = parseFloat(document.getElementById('pescoco').value);
  const quadril = parseFloat(document.getElementById('quadril').value);
  const sexo = document.getElementById('sexo').value;

  if (!altura || !peso) return alert('Preencha altura e peso');

  const imc = peso / (altura * altura);
  let gordura;

  if (sexo === 'male') {
    gordura = 495 / (1.0324 - 0.19077 * Math.log10(cintura - pescoco) + 0.15456 * Math.log10(altura * 100)) - 450;
  } else if (sexo === 'female') {
    gordura = 495 / (1.29579 - 0.35004 * Math.log10(cintura + quadril - pescoco) + 0.22100 * Math.log10(altura * 100)) - 450;
  } else {
    gordura = '—';
  }

  const resultado = document.getElementById('resultadoBox');
  resultado.innerHTML = `
    <p><b>IMC:</b> ${imc.toFixed(1)}</p>
    <p><b>Gordura corporal:</b> ${typeof gordura === 'number' ? gordura.toFixed(1) + '%' : gordura}</p>
  `;

  addIMCToChart(imc);
});

// ---------- GRÁFICO DE IMC ----------
const ctx = document.getElementById('chartIMC');
const imcData = JSON.parse(localStorage.getItem('imcData')) || [];
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: imcData.map((_, i) => i + 1),
    datasets: [{
      label: 'IMC',
      data: imcData,
      borderWidth: 2
    }]
  },
  options: { scales: { y: { beginAtZero: false } } }
});

function addIMCToChart(imc) {
  imcData.push(imc);
  localStorage.setItem('imcData', JSON.stringify(imcData));
  chart.data.labels.push(imcData.length);
  chart.data.datasets[0].data.push(imc);
  chart.update();
}

// ---------- EVOLUÇÃO (FOTOS) ----------
const gallery = document.getElementById('gallery');
const addFotoBtn = document.getElementById('addFotoBtn');
const uploadFotoEvolucao = document.getElementById('uploadFotoEvolucao');
const clearPhotos = document.getElementById('clearPhotos');
let fotos = JSON.parse(localStorage.getItem('fotos')) || [];

function renderFotos() {
  gallery.innerHTML = fotos.map(src => `<img src="${src}" alt="foto">`).join('');
}
renderFotos();

addFotoBtn.addEventListener('click', () => {
  const file = uploadFotoEvolucao.files[0];
  if (!file) return alert('Selecione uma imagem');
  const reader = new FileReader();
  reader.onload = e => {
    fotos.push(e.target.result);
    localStorage.setItem('fotos', JSON.stringify(fotos));
    renderFotos();
  };
  reader.readAsDataURL(file);
});

clearPhotos.addEventListener('click', () => {
  if (confirm('Deseja remover todas as fotos?')) {
    fotos = [];
    localStorage.removeItem('fotos');
    renderFotos();
  }
});

// ---------- TREINO ----------
const genTreino = document.getElementById('genTreino');
const treinoOutput = document.getElementById('treinoOutput');

const treinos = {
  costas: ['Puxada frontal', 'Remada curvada', 'Serrote', 'Barra fixa'],
  perna: ['Agachamento livre', 'Cadeira extensora', 'Cadeira flexora', 'Leg press'],
  peito: ['Supino reto', 'Supino inclinado', 'Crucifixo', 'Flexão de braço'],
  braco: ['Rosca direta', 'Tríceps testa', 'Martelo', 'Tríceps corda']
};

genTreino.addEventListener('click', () => {
  const grupo = document.getElementById('grupoMuscular').value;
  if (!grupo) return alert('Escolha um grupo muscular');
  const lista = treinos[grupo];
  treinoOutput.innerHTML = `<ul>${lista.map(e => `<li>${e}</li>`).join('')}</ul>`;
});

// ---------- EXPORTAR JSON (APENAS PERFIL) ----------
const downloadJSON = document.getElementById('downloadJSON');
downloadJSON.addEventListener('click', () => {
  const jsonData = JSON.stringify(profile, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'perfil.json';
  a.click();
  URL.revokeObjectURL(url);
});
