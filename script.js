console.log("Fitness App Iniciado");

// ---------- UTIL ----------

const STORE_KEY = "fitness_app_v1";

let STORE = JSON.parse(localStorage.getItem(STORE_KEY)) || {};
STORE.profile = STORE.profile || {};
STORE.history = STORE.history || [];
STORE.photos = STORE.photos || [];

const saveStore = () => localStorage.setItem(STORE_KEY, JSON.stringify(STORE));

// ---------- ELEMENTOS ----------

const tabs = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.tab');
const resultadoBox = document.getElementById('resultadoBox');

const alturaEl = document.getElementById('altura');
const pesoEl = document.getElementById('peso');
const metaEl = document.getElementById('meta');
const bracoEl = document.getElementById('braco');
const pernaEl = document.getElementById('perna');
const cinturaEl = document.getElementById('cintura');
const idadeEl = document.getElementById('idade');
const sexoEl = document.getElementById('sexo');
const objetivoEl = document.getElementById('objetivo');

const saveSnapshotBtn = document.getElementById('saveSnapshot');
const exportCSVBtn = document.getElementById('exportCSV');

const gallery = document.getElementById('gallery');
const uploadInput = document.getElementById('uploadFotoEvolucao');
const addFotoBtn = document.getElementById('addFotoBtn');
const clearPhotosBtn = document.getElementById('clearPhotos');

const presetTreino = document.getElementById('presetTreino');
const grupoMuscular = document.getElementById('grupoMuscular');
const nivelEl = document.getElementById('nivel');
const genTreinoBtn = document.getElementById('genTreino');
const treinoOutput = document.getElementById('treinoOutput');

const profileBtn = document.getElementById('profileBtn');
const profileModal = document.getElementById('profileModal');
const profileName = document.getElementById('profileName');
const profileAge = document.getElementById('profileAge');
const profileSex = document.getElementById('profileSex');
const saveProfileBtn = document.getElementById('saveProfile');
const closeProfileBtn = document.getElementById('closeProfile');

const chartCtx = document.getElementById('chartIMC')?.getContext('2d');
let chartIMC = null;

// simple state
let recommendationText = "";

// ---------- NAVIGATION ----------

tabs.forEach(btn => btn.addEventListener('click', () => openTab(btn.dataset.tab)));

function openTab(id){
  tabs.forEach(b => b.classList.remove('active'));
  document.querySelectorAll(`[data-tab="${id}"]`).forEach(b => b.classList.add('active'));
  sections.forEach(s => s.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
  window.scrollTo({top:0, behavior:'smooth'});
}

// ---------- PROFILE MODAL ----------

profileBtn?.addEventListener('click', () => {
  profileModal.classList.remove('hidden');
  profileName.value = STORE.profile.name || "";
  profileAge.value = STORE.profile.age || "";
  profileSex.value = STORE.profile.sex || "";
});

closeProfileBtn?.addEventListener('click', () => profileModal.classList.add('hidden'));

saveProfileBtn?.addEventListener('click', () => {
  STORE.profile.name = profileName.value || "";
  STORE.profile.age = profileAge.value || "";
  STORE.profile.sex = profileSex.value || "";
  saveStore();
  profileModal.classList.add('hidden');
  alertNotify("Perfil salvo com sucesso!");
});

// ---------- CÁLCULOS ----------

function calcTMB(weight, height, age, sex){
  const h = Math.round(height * 100);
  return sex === 'male'
    ? Math.round(10*weight + 6.25*h - 5*age + 5)
    : Math.round(10*weight + 6.25*h - 5*age -161);
}

function calcMacros(tdee, objetivo){
  let kcal = tdee;
  if(objetivo === 'emagrecer') kcal = Math.round(tdee*0.8);
  else if(objetivo === 'ganhar') kcal = Math.round(tdee*1.15);
  else if(objetivo === 'definir') kcal = Math.round(tdee*0.9);

  const protein = Math.round((kcal*0.3)/4);
  const fat = Math.round((kcal*0.25)/9);
  const carbs = Math.round((kcal*0.45)/4);
  return { kcal, protein_g: protein, fat_g: fat, carbs_g: carbs };
}

document.getElementById('calcBtn')?.addEventListener('click', () => {
  const altura = parseFloat(alturaEl.value);
  const peso = parseFloat(pesoEl.value);
  const meta = parseFloat(metaEl.value);
  const braco = parseFloat(bracoEl.value);
  const perna = parseFloat(pernaEl.value);
  const cintura = parseFloat(cinturaEl.value);
  const idade = parseInt(idadeEl.value);
  const sexo = sexoEl.value;
  const objetivo = objetivoEl.value;

  if(!altura || !peso || !idade || !sexo || !braco || !perna || !cintura){
    return alertNotify('Preencha todos os campos do perfil!');
  }

  const imc = +(peso / (altura*altura)).toFixed(2);
  const gordura = +(1.2*imc + 0.23*idade - 5.4).toFixed(1);
  const massaMagra = +(peso - (peso*gordura/100)).toFixed(1);
  const tmb = calcTMB(peso, altura, idade, sexo);
  const tdee = Math.round(tmb*1.4);
  const macros = calcMacros(tdee, objetivo);

  if(imc < 18.5) recommendationText = "Abaixo do peso, foco em hipertrofia e alimentação controlada.";
  else if(imc < 24.9) recommendationText = "Peso ideal, mantenha e ajuste treino.";
  else if(imc < 29.9) recommendationText = "Sobrepeso, déficit calórico moderado.";
  else recommendationText = "Obesidade, priorizar atividade regular e acompanhamento.";

  resultadoBox.innerHTML = `
    <strong>IMC:</strong> ${imc} (${recommendationText})<br>
    <strong>% Gordura:</strong> ${gordura}%<br>
    <strong>Massa magra:</strong> ${massaMagra} kg<br>
    <strong>TMB:</strong> ${tmb} kcal/dia<br>
    <strong>TDEE:</strong> ${tdee} kcal/dia<br>
    <strong>Macros:</strong> P:${macros.protein_g}g C:${macros.carbs_g}g G:${macros.fat_g}g Kcal:${macros.kcal}
  `;

  STORE.profile.lastCalc = { ts: Date.now(), altura, peso, meta, braco, perna, cintura, idade, sexo, objetivo, imc, gordura, massaMagra, tmb, tdee, macros };
  saveStore();
  renderChart();
});

// ---------- HISTÓRICO ----------

saveSnapshotBtn?.addEventListener('click', () => {
  if(!STORE.profile.lastCalc) return alertNotify("Faça um cálculo antes!");
  STORE.history.push({ ts: Date.now(), ...STORE.profile.lastCalc });
  saveStore();
  alertNotify("Medidas salvas!");
  renderGallery();
  renderChart();
});

// ---------- CHART ----------

function renderChart(){
  if(!chartCtx) return;
  const labels = STORE.history.map(h=>new Date(h.ts).toLocaleDateString());
  const data = STORE.history.map(h=>h.imc);

  if(chartIMC) chartIMC.destroy();

  chartIMC = new Chart(chartCtx, {
    type:'line',
    data:{ labels, datasets:[{ label:'IMC', data, borderColor:var('--accent'), backgroundColor:'rgba(255,107,107,0.2)', fill:true, tension:0.3 }] },
    options:{ plugins:{legend:{labels:{color:'#fff'}}}, scales:{x:{ticks:{color:'#ddd'}},y:{ticks:{color:'#ddd'}}} }
  });
}

// ---------- GALLERY ----------

function renderGallery(){
  gallery.innerHTML = '';
  STORE.photos.forEach((src, idx)=>{
    const div = document.createElement('div'); div.className='foto';
    const img = document.createElement('img'); img.src=src; img.onclick=()=> openLightbox(src);
    const del = document.createElement('button'); del.className='del'; del.innerText='✕';
    del.onclick = e => { e.stopPropagation(); if(confirm('Excluir foto?')){ STORE.photos.splice(idx,1); saveStore(); renderGallery(); } };
    div.appendChild(img); div.appendChild(del); gallery.appendChild(div);
  });
}

addFotoBtn?.addEventListener('click', ()=>{
  const f = uploadInput.files[0]; if(!f) return alertNotify('Escolha uma foto.');
  const reader = new FileReader();
  reader.onload = e => { STORE.photos.push(e.target.result); saveStore(); renderGallery(); uploadInput.value=''; };
  reader.readAsDataURL(f);
});

clearPhotosBtn?.addEventListener('click', ()=>{
  if(!STORE.photos.length) return alertNotify('Nenhuma foto.');
  if(confirm('Remover todas as fotos?')){ STORE.photos = []; saveStore(); renderGallery(); }
});

// ---------- LIGHTBOX ----------

function openLightbox(src){
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  img.src=src; lb.classList.remove('hidden');
}

function closeLightbox(){
  const lb=document.getElementById('lightbox'); lb.classList.add('hidden'); document.getElementById('lightboxImg').src='';
}

// ---------- TREINO ----------

genTreinoBtn?.addEventListener('click', ()=>{
  const preset = presetTreino.value;
  const grupo = grupoMuscular.value;
  const nivel = nivelEl.value || 'iniciante';
  if(!preset && !grupo) return alertNotify('Escolha preset ou grupo muscular!');

  let plan = '';
  const plans = {
    ramon:`Ramon Dino - Full Hypertrophy:\n- Agachamento 5x6-8\n- Leg Press 4x10\n- Supino 4x6-8\n(Nível:${nivel})`,
    cbum:`Chris Bumstead - Classic Physique:\n- Supino 4x8-10\n- Desenvolvimento 4x8\n- Remada 4x10\n(Nível:${nivel})`,
    arnold:`Arnold Split:\n- Peito 5x8-12\n- Costas 5x8-12\n- Pernas 5x6-8\n(Nível:${nivel})`
  };
  const groups = {
    costas:'- Barra fixa 4x até falha\n- Remada curvada 4x8-10\n- Levantamento terra 3x6-8',
    perna:'- Agachamento 4x8-10\n- Leg press 4x12\n- Stiff 4x10\n- Panturrilha 5x15',
    peito:'- Supino reto 4x8\n- Supino inclinado 4x10\n- Crucifixo 3x12\n- Flexões 3x15',
    braco:'- Rosca direta 4x10\n- Rosca martelo 4x10\n- Tríceps pulley 4x12\n- Tríceps testa 3x10'
  };
  plan = preset ? plans[preset] || '' : `Treino ${grupo}:\n${groups[grupo] || ''}\n(Nível:${nivel})`;
  plan += `\n\nRecomendação: ${recommendationText || 'Calcule IMC antes.'}`;
  treinoOutput.innerHTML = plan.replaceAll('\n','<br>');
});

// ---------- ALERT ----------

function alertNotify(msg){
  const t = document.createElement('div');
  t.className='toast'; t.innerText=msg;
  Object.assign(t.style,{position:'fixed',bottom:'18px',right:'18px',background:'#111',color:'#fff',padding:'8px 12px',borderRadius:'8px',zIndex:9999});
  document.body.appendChild(t); setTimeout(()=>t.remove(),3000);
}

// ---------- STARTUP ----------

renderGallery();
renderChart();
