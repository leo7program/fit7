/* Fitness App — script.js (completo) */
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
if(!STORE.history) STORE.history = []; // cada item: {ts, altura,peso,meta,braco,perna,cintura,imc}
if(!STORE.photos) STORE.photos = []; // dataURL list
saveStore(STORE);

// ---------- element refs ----------
const tabs = document.querySelectorAll('.nav-btn, .tab-btn'); // we use tab-btn in markup
const tabBtns = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('.tab');
const calcBtn = document.getElementById('calcBtn') || document.getElementById('calcBtn');
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

const presetTreino = document.getElementById('presetTreino') || document.getElementById('presetTreino');
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

// simple state
let recommendationText = "";

// ---------- navigation ----------
tabBtns.forEach(btn=>{
  btn.addEventListener('click', ()=> {
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
  window.scrollTo({top:0,behavior:'smooth'});
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

// ---------- calculations ----------
function calcTMB(weightKg, heightM, age, sex){
  // Mifflin-St Jeor (height in cm)
  const h = Math.round(heightM * 100);
  if(sex === 'male'){
    return Math.round((10*weightKg) + (6.25*h) - (5*age) + 5);
  } else {
    return Math.round((10*weightKg) + (6.25*h) - (5*age) - 161);
  }
}
function calcMacros(tdee, objetivo){
  // objetivo: manter / emagrecer / ganhar / definir
  let kcal = tdee;
  if(objetivo === 'emagrecer') kcal = Math.round(tdee * 0.8);
  else if(objetivo === 'ganhar') kcal = Math.round(tdee * 1.15);
  else if(objetivo === 'definir') kcal = Math.round(tdee * 0.9);

  const proteinPerc = 0.3; // 30% calories
  const fatPerc = 0.25;
  const carbPerc = 0.45;
  const proteinKcal = Math.round(kcal * proteinPerc);
  const fatKcal = Math.round(kcal * fatPerc);
  const carbKcal = Math.round(kcal * carbPerc);

  return {
    kcal,
    protein_g: Math.round(proteinKcal / 4),
    fat_g: Math.round(fatKcal / 9),
    carbs_g: Math.round(carbKcal / 4)
  };
}

document.getElementById('calcBtn').addEventListener('click', ()=> {
  // read inputs
  const altura = parseFloat(alturaEl.value);
  const peso = parseFloat(pesoEl.value);
  const meta = parseFloat(metaEl.value);
  const braco = parseFloat(bracoEl.value);
  const perna = parseFloat(pernaEl.value);
  const cintura = parseFloat(cinturaEl.value);
  const idade = parseInt(idadeEl.value);
  const sexo = sexoEl.value;
  const objetivo = objetivoEl.value;

  // basic validation
  if(!altura || !peso || !idade || !sexo || !braco || !perna || !cintura){
    alert('Preencha todos os campos do perfil (altura, peso, idade, sexo e medidas).');
    return;
  }

  // IMC
  const imc = +(peso / (altura * altura)).toFixed(2);

  // gordura (estimativa)
  const gordura = +(1.2 * imc + 0.23 * idade - 5.4).toFixed(1);
  const massaMagra = +(peso - (peso * gordura / 100)).toFixed(1);

  // TMB e TDEE (estimativa com fator moderado)
  const tmb = calcTMB(peso, altura, idade, sexo);
  const activityFactor = 1.4; // moderada
  const tdee = Math.round(tmb * activityFactor);

  // macros
  const macros = calcMacros(tdee, objetivo);

  // recommendation text
  if(imc < 18.5) recommendationText = "Atenção: abaixo do peso. Focar hipertrofia e alimentação hipercalórica controlada.";
  else if(imc < 24.9) recommendationText = "Peso dentro da faixa ideal. Manter e ajustar treino para objetivo.";
  else if(imc < 29.9) recommendationText = "Sobrepeso: foco em déficit calórico moderado e cardio.";
  else recommendationText = "Obesidade: priorizar atividade regular de baixo impacto e acompanhamento.";

  // update UI
  resultadoBox.innerHTML = `
    <strong>IMC:</strong> ${imc} (${recommendationText})<br>
    <strong>% Gordura (estim.):</strong> ${gordura}%<br>
    <strong>Massa magra:</strong> ${massaMagra} kg<br>
    <strong>TMB:</strong> ${tmb} kcal/dia<br>
    <strong>TDEE (estim.):</strong> ${tdee} kcal/dia<br>
    <strong>Macros (aprox.):</strong> Proteína ${macros.protein_g}g • Carbs ${macros.carbs_g}g • Gordura ${macros.fat_g}g • Kcal ${macros.kcal}
  `;

  // save current profile quick
  STORE.profile.lastCalc = { ts: Date.now(), altura, peso, meta, braco, perna, cintura, idade, sexo, objetivo, imc, gordura, massaMagra, tmb, tdee, macros };
  saveStore(STORE);
});

// ---------- save snapshot (history) ----------
saveSnapshotBtn.addEventListener('click', ()=> {
  const p = STORE.profile.lastCalc;
  if(!p){
    alert("Faça um cálculo antes de salvar.");
    return;
  }
  STORE.history.push({ ts: Date.now(), ...p });
  saveStore(STORE);
  alert('Medidas salvas no histórico.');
  renderGallery();
  renderChart();
});

// ---------- chart render ----------
function renderChart(){
  const labels = STORE.history.map((h,i)=> new Date(h.ts).toLocaleDateString());
  const data = STORE.history.map(h=>h.imc);

  if(chartIMC) chartIMC.destroy();
  chartIMC = new Chart(chartCtx, {
    type:'line',
    data:{
      labels,
      datasets:[{
        label:'IMC',
        data,
        borderColor:'#ff6b6b',
        backgroundColor:'rgba(255,107,107,0.15)',
        fill:true,
        tension:0.3
      }]
    },
    options:{
      plugins:{legend:{labels:{color:'#fff'}}},
      scales:{x:{ticks:{color:'#ddd'}},y:{ticks:{color:'#ddd'}}}
    }
  });
}
renderChart();

// ---------- gallery render ----------
function renderGallery(){
  gallery.innerHTML = '';
  // photos from STORE.photos
  STORE.photos.forEach((dataUrl, idx)=>{
    const div = document.createElement('div'); div.className = 'foto';
    const img = document.createElement('img'); img.src = dataUrl;
    img.onclick = ()=> openLightbox(dataUrl);
    const del = document.createElement('button'); del.className='del';
    del.innerText = '✕';
    del.onclick = (e)=>{
      e.stopPropagation();
      if(confirm('Excluir foto?')){
        STORE.photos.splice(idx,1);
        saveStore(STORE);
        renderGallery();
      }
    };
    div.appendChild(img); div.appendChild(del); gallery.appendChild(div);
  });

  // also list last saved measurements (mini-cards) below gallery
  STORE.history.slice().reverse().slice(0,6).forEach(h=>{
    // small tile could be added; for simplicity keep just gallery of photos.
  });
}
renderGallery();

// ---------- add photo ----------
addFotoBtn.addEventListener('click', ()=> {
  const f = uploadInput.files[0];
  if(!f){ alert('Escolha uma foto.'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    STORE.photos.push(e.target.result);
    saveStore(STORE);
    renderGallery();
    uploadInput.value = '';
  };
  reader.readAsDataURL(f);
});

clearPhotosBtn.addEventListener('click', ()=>{
  if(!STORE.photos.length) return alert('Nenhuma foto.');
  if(confirm('Remover todas as fotos?')){
    STORE.photos = [];
    saveStore(STORE);
    renderGallery();
  }
});

// ---------- lightbox ----------
function openLightbox(src){
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  img.src = src;
  lightbox.classList.remove('hidden');
}
function closeLightbox(){
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.add('hidden');
  document.getElementById('lightboxImg').src = '';
}

// ---------- treino generation ----------
genTreinoBtn?.addEventListener('click', ()=> {
  const preset = document.getElementById('presetTreino')?.value;
  const grupo = grupoMuscular?.value;
  const nivel = nivelEl?.value || 'iniciante';
  if(!preset && !grupo){ alert('Escolha preset famoso ou um grupo muscular.'); return; }
  // preset overrides group
  let plan = '';
  if(preset === 'ramon'){
    plan = `Ramon Dino - Full Hypertrophy Plan (exemplo):\n- Agachamento 5x6-8\n- Leg press 4x10\n- Stiff 4x8-10\n- Supino 4x6-8\n- Remada 4x8\n\n(Nível: ${nivel})`;
  } else if(preset === 'cbum'){
    plan = `Chris Bumstead (CBum) style - Classic Classic Physique:\n- Supino 4x8-10\n- Desenvolvimento 4x8\n- Remada 4x10\n- Rosca 4x10\n- Pernas moderadas\n\n(Nível: ${nivel})`;
  } else if(preset === 'arnold'){
    plan = `Arnold split style:\n- Peito 5x8-12\n- Costas 5x8-12\n- Pernas pesadas 5x6-8\n- Ombro volume\n\n(Nível: ${nivel})`;
  } else {
    // group-based
    if(grupo === 'costas'){
      plan = `Treino Costas:\n- Barra fixa 4x até falha\n- Remada curvada 4x8-10\n- Pulldown 4x10\n- Levantamento terra 3x6-8\n\n(Nível: ${nivel})`;
    } else if(grupo === 'perna'){
      plan = `Treino Pernas:\n- Agachamento 4x8-10\n- Leg press 4x12\n- Stiff 4x10\n- Panturrilha 5x15\n\n(Nível: ${nivel})`;
    } else if(grupo === 'peito'){
      plan = `Treino Peito:\n- Supino reto 4x8\n- Supino inclinado 4x10\n- Crucifixo 3x12\n- Flexões 3x15\n\n(Nível: ${nivel})`;
    } else if(grupo === 'braco'){
      plan = `Treino Braços:\n- Rosca direta 4x10\n- Rosca martelo 4x10\n- Tríceps pulley 4x12\n- Tríceps testa 3x10\n\n(Nível: ${nivel})`;
    }
  }
  // include recommendation from last calculation
  plan += `\n\nRecomendação automática: ${recommendationText || 'Execute cálculo antes para recomendação personalizada.'}`;
  treinoOutput.innerHTML = plan.replaceAll('\n','<br>');
});

// ---------- Timer ----------
const timerCard = document.getElementById('timerCard');
const timerDisplay = document.getElementById('timerDisplay');
let timerInterval=null, timerRemaining=0;
document.getElementById('timerOpen')?.addEventListener('click', ()=> {
  timerCard.classList.toggle('hidden');
});
document.getElementById('timerStart')?.addEventListener('click', ()=> {
  if(!timerInterval){
    // default 60s if first start
    if(timerRemaining === 0) timerRemaining = 60;
    timerInterval = setInterval(()=> {
      if(timerRemaining<=0){ clearInterval(timerInterval); timerInterval=null; timerDisplay.innerText='00:00'; return; }
      timerRemaining--;
      const mm = String(Math.floor(timerRemaining/60)).padStart(2,'0');
      const ss = String(timerRemaining%60).padStart(2,'0');
      timerDisplay.innerText = `${mm}:${ss}`;
    }, 1000);
  }
});
document.getElementById('timerPause')?.addEventListener('click', ()=> {
  if(timerInterval){ clearInterval(timerInterval); timerInterval=null; }
});
document.getElementById('timerReset')?.addEventListener('click', ()=> {
  if(timerInterval){ clearInterval(timerInterval); timerInterval=null; }
  timerRemaining = 0; timerDisplay.innerText = '00:00';
});

// ---------- export CSV ----------
exportCSVBtn?.addEventListener('click', ()=> {
  if(!STORE.history.length) return alert('Nenhum histórico salvo.');
  const rows = [['date','altura','peso','imc','braco','perna','cintura']];
  STORE.history.forEach(h=>{
    rows.push([new Date(h.ts).toISOString(), h.altura, h.peso, h.imc, h.braco, h.perna, h.cintura]);
  });
  const csv = rows.map(r=>r.join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download = 'historico.csv'; a.click();
  URL.revokeObjectURL(url);
});

// ---------- export/import json ----------
document.getElementById('downloadJSON')?.addEventListener('click', ()=> {
  const data = JSON.stringify(STORE, null, 2);
  const blob = new Blob([data], {type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'fitness-data.json'; a.click();
});
document.getElementById('importJSON')?.addEventListener('click', ()=> {
  document.getElementById('fileImport').click();
});
document.getElementById('fileImport')?.addEventListener('change', (e)=> {
  const f = e.target.files[0]; if(!f) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try{
      const parsed = JSON.parse(ev.target.result);
      STORE = parsed;
      saveStore(STORE);
      alert('Dados importados com sucesso. Recarregue a página para ver atualizações.');
    }catch(err){ alert('Arquivo inválido.'); }
  };
  reader.readAsText(f);
});

// ---------- export PDF full ----------
exportPDFFullBtn?.addEventListener('click', async ()=> {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p','mm','a4');
  doc.setFontSize(18); doc.text('Relatório Fitness', 105, 15, {align:'center'});
  const profile = STORE.profile || {};
  doc.setFontSize(11);
  doc.text(`Nome: ${profile.name||'-'}`, 14, 30);
  doc.text(`Idade: ${profile.age||'-'}   Sexo: ${profile.sex||'-'}`, 14, 36);
  // last calc
  if(STORE.profile.lastCalc){
    doc.text('Último cálculo:',14,46);
    doc.text(STORE.profile.lastCalc.imc ? `IMC: ${STORE.profile.lastCalc.imc}` : '', 14, 52);
    doc.text(`% Gordura (est): ${STORE.profile.lastCalc.gordura || '-'}`, 14, 58);
    doc.text(`TMB: ${STORE.profile.lastCalc.tmb || '-'}`, 14, 64);
  }
  // append photos as small
  let y=75;
  for(let i=0;i<Math.min(4,STORE.photos.length);i++){
    const img = STORE.photos[i];
    await new Promise(resolve=>{
      const image = new Image();
      image.onload = ()=> {
        doc.addImage(image, 'PNG', 14 + (i%2)*95, y, 80, 60);
        resolve();
      };
      image.src = img;
    });
    if(i%2===1) y += 65;
  }
  doc.save('relatorio-fitness.pdf');
});

// ---------- export single plan PDF (treino) ----------
exportPDFBtn?.addEventListener('click', async ()=> {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Plano de Treino', 105, 15, {align:'center'});
  const treinoText = treinoOutput.innerText || 'Nenhum treino gerado';
  const lines = doc.splitTextToSize(treinoText, 180);
  doc.setFontSize(11);
  doc.text(lines, 14, 30);
  doc.save('plano-treino.pdf');
});

// ---------- startup render ----------
renderGallery();
renderChart();

// ---------- small helpers ----------
function alertNotify(msg){ // in-app notification
  const toast = document.createElement('div');
  toast.className = 'toast'; toast.innerText = msg;
  toast.style.position = 'fixed'; toast.style.bottom = '18px'; toast.style.right = '18px';
  toast.style.background = '#111'; toast.style.color='#fff'; toast.style.padding='8px 12px'; toast.style.borderRadius='8px';
  document.body.appendChild(toast);
  setTimeout(()=> toast.remove(), 3000);
}
