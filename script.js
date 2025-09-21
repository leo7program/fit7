console.log("Fitness App script iniciado");

// ---------- util localStorage ----------
const STORE_KEY = "fitness_app_v1";
function saveStore(obj){
  localStorage.setItem(STORE_KEY, JSON.stringify(obj));
}
function loadStore(){
  try{
    return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
  }catch(e){ return {}; }
}
let STORE = loadStore();
if(!STORE.profile) STORE.profile = {};
if(!STORE.history) STORE.history = [];
if(!STORE.photos) STORE.photos = [];
saveStore(STORE);

// ---------- element refs ----------
const tabBtns = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.tab');
const calcBtn = document.getElementById('calcBtn');
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

const exportPDFFullBtn = document.getElementById('exportPDFFull');
const exportPDFBtn = document.getElementById('exportPDF');

const profileBtn = document.getElementById('profileBtn');
const profileModal = document.getElementById('profileModal');
const profileName = document.getElementById('profileName');
const profileAge = document.getElementById('profileAge');
const profileSex = document.getElementById('profileSex');
const saveProfileBtn = document.getElementById('saveProfile');
const closeProfileBtn = document.getElementById('closeProfile');

const chartCtx = document.getElementById('chartIMC')?.getContext('2d');
let chartIMC = null;

// ---------- state ----------
let recommendationText = "";

// ---------- navigation ----------
tabBtns.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const target = btn.dataset.tab;
    openTab(target);
  });
});
function openTab(id){
  tabBtns.forEach(b=>b.classList.remove('active'));
  document.querySelectorAll(`[data-tab="${id}"]`).forEach(b=>b.classList.add('active'));
  sections.forEach(s=>s.classList.remove('active'));
  const sec = document.getElementById(id);
  if(sec) sec.classList.add('active');
  sec.scrollIntoView({behavior:'smooth', block:'start'});
}

// ---------- profile modal ----------
profileBtn?.addEventListener('click', ()=> {
  profileModal.classList.remove('hidden');
  profileName.value = STORE.profile.name || "";
  profileAge.value = STORE.profile.age || "";
  profileSex.value = STORE.profile.sex || "";
});
closeProfileBtn?.addEventListener('click', ()=> profileModal.classList.add('hidden'));
saveProfileBtn?.addEventListener('click', ()=>{
  STORE.profile.name = profileName.value || "";
  STORE.profile.age = profileAge.value || "";
  STORE.profile.sex = profileSex.value || "";
  saveStore(STORE);
  profileModal.classList.add('hidden');
  alert("Perfil salvo.");
});

// ---------- auto-fill profile on load ----------
window.addEventListener('DOMContentLoaded', ()=>{
  if(STORE.profile.name) profileName.value = STORE.profile.name;
  if(STORE.profile.age) profileAge.value = STORE.profile.age;
  if(STORE.profile.sex) profileSex.value = STORE.profile.sex;

  if(STORE.profile.lastCalc){
    alturaEl.value = STORE.profile.lastCalc.altura || '';
    pesoEl.value = STORE.profile.lastCalc.peso || '';
    metaEl.value = STORE.profile.lastCalc.meta || '';
    bracoEl.value = STORE.profile.lastCalc.braco || '';
    pernaEl.value = STORE.profile.lastCalc.perna || '';
    cinturaEl.value = STORE.profile.lastCalc.cintura || '';
    idadeEl.value = STORE.profile.lastCalc.idade || '';
    sexoEl.value = STORE.profile.lastCalc.sexo || '';
    objetivoEl.value = STORE.profile.lastCalc.objetivo || '';
    resultadoBox.innerHTML = `
      <strong>IMC:</strong> ${STORE.profile.lastCalc.imc} (${STORE.profile.lastCalc.recommendation || ''})<br>
      <strong>% Gordura (estim.):</strong> ${STORE.profile.lastCalc.gordura}%<br>
      <strong>Massa magra:</strong> ${STORE.profile.lastCalc.massaMagra} kg<br>
      <strong>TMB:</strong> ${STORE.profile.lastCalc.tmb} kcal/dia<br>
      <strong>TDEE (estim.):</strong> ${STORE.profile.lastCalc.tdee} kcal/dia<br>
    `;
  }
});

// ---------- calculations ----------
function calcTMB(weightKg, heightM, age, sex){
  const h = Math.round(heightM * 100);
  return sex==='male'? Math.round((10*weightKg)+(6.25*h)-(5*age)+5)
                     : Math.round((10*weightKg)+(6.25*h)-(5*age)-161);
}

function calcMacros(tdee, objetivo){
  let kcal = tdee;
  if(objetivo==='emagrecer') kcal*=0.8;
  else if(objetivo==='ganhar') kcal*=1.15;
  else if(objetivo==='definir') kcal*=0.9;
  const protein_g = Math.round((kcal*0.3)/4);
  const fat_g = Math.round((kcal*0.25)/9);
  const carbs_g = Math.round((kcal*0.45)/4);
  return {kcal:Math.round(kcal), protein_g, fat_g, carbs_g};
}

calcBtn?.addEventListener('click', ()=>{
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
    alert('Preencha todos os campos do perfil.');
    return;
  }

  const imc = +(peso/(altura*altura)).toFixed(2);
  const gordura = +(1.2*imc + 0.23*idade - 5.4).toFixed(1);
  const massaMagra = +(peso - (peso*gordura/100)).toFixed(1);
  const tmb = calcTMB(peso, altura, idade, sexo);
  const tdee = Math.round(tmb*1.4);
  const macros = calcMacros(tdee, objetivo);

  if(imc<18.5) recommendationText = "Atenção: abaixo do peso.";
  else if(imc<24.9) recommendationText = "Peso ideal.";
  else if(imc<29.9) recommendationText = "Sobrepeso.";
  else recommendationText = "Obesidade.";

  resultadoBox.innerHTML = `
    <strong>IMC:</strong> ${imc} (${recommendationText})<br>
    <strong>% Gordura (estim.):</strong> ${gordura}%<br>
    <strong>Massa magra:</strong> ${massaMagra} kg<br>
    <strong>TMB:</strong> ${tmb} kcal/dia<br>
    <strong>TDEE:</strong> ${tdee} kcal/dia<br>
  `;

  STORE.profile.lastCalc = {ts:Date.now(), altura, peso, meta, braco, perna, cintura, idade, sexo, objetivo, imc, gordura, massaMagra, tmb, tdee, macros, recommendation: recommendationText};
  saveStore(STORE);
});

// ---------- save snapshot ----------
saveSnapshotBtn?.addEventListener('click', ()=>{
  const p = STORE.profile.lastCalc;
  if(!p){ alert("Faça um cálculo antes de salvar."); return; }
  STORE.history.push({ts:Date.now(), ...p});
  saveStore(STORE);
  alert('Medidas salvas no histórico.');
});

// ---------- gallery ----------
function renderGallery(){
  gallery.innerHTML = '';
  STORE.photos.forEach((dataUrl, idx)=>{
    const div = document.createElement('div'); div.className='foto';
    const img = document.createElement('img'); img.src=dataUrl; img.onclick = ()=>openLightbox(dataUrl);
    div.appendChild(img);
    gallery.appendChild(div);
  });
}
addFotoBtn?.addEventListener('click', ()=>{
  const file = uploadInput.files[0];
  if(!file){ alert('Selecione uma foto'); return; }
  const reader = new FileReader();
  reader.onload = e=>{
    STORE.photos.push(e.target.result);
    saveStore(STORE);
    renderGallery();
  }
  reader.readAsDataURL(file);
});
clearPhotosBtn?.addEventListener('click', ()=>{
  if(confirm('Deseja limpar todas as fotos?')){
    STORE.photos=[];
    saveStore(STORE);
    renderGallery();
  }
});
function openLightbox(src){
  const lb = document.getElementById('lightbox');
  document.getElementById('lightboxImg').src=src;
  lb.classList.remove('hidden');
}
function closeLightbox(){
  document.getElementById('lightbox').classList.add('hidden');
}
renderGallery();

// ---------- footer credit ----------
const footer = document.createElement('footer');
footer.style.textAlign = 'center';
footer.style.padding = '10px';
footer.style.fontSize = '14px';
footer.style.color = '#555';
footer.textContent = "Desenvolvido por leo7ocean";
document.body.appendChild(footer);
