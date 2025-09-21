console.log("Fitness App script iniciado");

// ---------- Storage ----------
const STORE_KEY = "fitness_app_v1";
function saveStore(obj){ localStorage.setItem(STORE_KEY, JSON.stringify(obj)); }
function loadStore(){ try{ return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }catch(e){ return {}; } }
let STORE = loadStore();
if(!STORE.profile) STORE.profile = {};
if(!STORE.history) STORE.history = [];
if(!STORE.photos) STORE.photos = [];
saveStore(STORE);

// ---------- Elementos ----------
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

const profileBtn = document.getElementById('profileBtn');
const profileModal = document.getElementById('profileModal');
const profileName = document.getElementById('profileName');
const profileAge = document.getElementById('profileAge');
const profileSex = document.getElementById('profileSex');
const saveProfileBtn = document.getElementById('saveProfile');
const closeProfileBtn = document.getElementById('closeProfile');

const chartCtx = document.getElementById('chartIMC')?.getContext('2d');
let chartIMC = null;
let recommendationText = "";

// ---------- Tabs ----------
tabBtns.forEach(btn => btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    sections.forEach(s => s.classList.remove('active'));
    document.getElementById(target).classList.add('active');
    window.scrollTo({top:0, behavior:'smooth'});
}));

// ---------- Profile ----------
profileBtn?.addEventListener('click', () => {
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

// ---------- Calculadora ----------
function calcTMB(weightKg, heightM, age, sex){
    const h = Math.round(heightM*100);
    if(sex==='male') return Math.round(10*weightKg + 6.25*h - 5*age +5);
    return Math.round(10*weightKg + 6.25*h - 5*age -161);
}
function calcMacros(tdee, objetivo){
    let kcal = tdee;
    if(objetivo==='emagrecer') kcal = Math.round(tdee*0.8);
    else if(objetivo==='ganhar') kcal = Math.round(tdee*1.15);
    else if(objetivo==='definir') kcal = Math.round(tdee*0.9);
    const protein_g = Math.round(kcal*0.3/4);
    const fat_g = Math.round(kcal*0.25/9);
    const carbs_g = Math.round(kcal*0.45/4);
    return {kcal, protein_g, fat_g, carbs_g};
}
calcBtn?.addEventListener('click', ()=>{
    const altura=parseFloat(alturaEl.value), peso=parseFloat(pesoEl.value), meta=parseFloat(metaEl.value),
        braco=parseFloat(bracoEl.value), perna=parseFloat(pernaEl.value), cintura=parseFloat(cinturaEl.value),
        idade=parseInt(idadeEl.value), sexo=sexoEl.value, objetivo=objetivoEl.value;
    if(!altura || !peso || !idade || !sexo || !braco || !perna || !cintura){
        return alert('Preencha todos os campos do perfil.');
    }
    const imc = +(peso/(altura*altura)).toFixed(2);
    const gordura = +(1.2*imc + 0.23*idade -5.4).toFixed(1);
    const massaMagra = +(peso-(peso*gordura/100)).toFixed(1);
    const tmb = calcTMB(peso, altura, idade, sexo);
    const tdee = Math.round(tmb*1.4);
    const macros = calcMacros(tdee, objetivo);

    if(imc<18.5) recommendationText="Atenção: abaixo do peso.";
    else if(imc<24.9) recommendationText="Peso dentro da faixa ideal.";
    else if(imc<29.9) recommendationText="Sobrepeso: foco em déficit calórico.";
    else recommendationText="Obesidade: priorizar acompanhamento.";

    resultadoBox.innerHTML = `
    <strong>IMC:</strong> ${imc} (${recommendationText})<br>
    <strong>% Gordura:</strong> ${gordura}%<br>
    <strong>Massa magra:</strong> ${massaMagra} kg<br>
    <strong>TMB:</strong> ${tmb} kcal/dia<br>
    <strong>TDEE:</strong> ${tdee} kcal/dia<br>
    <strong>Macros:</strong> Proteína ${macros.protein_g}g • Carbs ${macros.carbs_g}g • Gordura ${macros.fat_g}g • Kcal ${macros.kcal}
    `;

    STORE.profile.lastCalc={ts:Date.now(), altura,peso,meta,braco,perna,cintura,idade,sexo,objetivo,imc,gordura,massaMagra,tmb,tdee,macros};
    saveStore(STORE);
});

// ---------- Salvar histórico ----------
saveSnapshotBtn?.addEventListener('click', ()=>{
    const p=STORE.profile.lastCalc;
    if(!p) return alert("Faça um cálculo antes de salvar.");
    STORE.history.push({ts:Date.now(), ...p});
    saveStore(STORE);
    alert('Medidas salvas no histórico.');
    renderGallery();
    renderChart();
});

// ---------- Gráfico ----------
function renderChart(){
    if(!chartCtx) return;
    const labels = STORE.history.map(h=>new Date(h.ts).toLocaleDateString());
    const data = STORE.history.map(h=>h.imc);
    if(chartIMC) chartIMC.destroy();
    chartIMC = new Chart(chartCtx,{
        type:'line',
        data:{labels,datasets:[{label:'IMC',data,borderColor:'#ff6b6b',backgroundColor:'rgba(255,107,107,0.15)',fill:true,tension:0.3}]},
        options:{plugins:{legend:{labels:{color:'#fff'}}},scales:{x:{ticks:{color:'#ddd'}},y:{ticks:{color:'#ddd'}}}}
    });
}
renderChart();

// ---------- Galeria ----------
function renderGallery(){
    gallery.innerHTML='';
    STORE.photos.forEach((src,idx)=>{
        const div=document.createElement('div'); div.className='foto';
        const img=document.createElement('img'); img.src=src;
        img.onclick=()=>openLightbox(src);
        const del=document.createElement('button'); del.className='del'; del.innerText='✕';
        del.onclick=e=>{ e.stopPropagation(); if(confirm('Excluir foto?')){ STORE.photos.splice(idx,1); saveStore(STORE); renderGallery(); } };
        div.appendChild(img); div.appendChild(del); gallery.appendChild(div);
    });
}
renderGallery();

addFotoBtn?.addEventListener('click', ()=>{
    const f=uploadInput.files[0];
    if(!f) return alert('Escolha uma foto.');
    const reader=new FileReader();
    reader.onload=e=>{ STORE.photos.push(e.target.result); saveStore(STORE); renderGallery(); uploadInput.value=''; };
    reader.readAsDataURL(f);
});
clearPhotosBtn?.addEventListener('click', ()=>{
    if(!STORE.photos.length) return alert('Nenhuma foto.');

                                     if(confirm('Remover todas as fotos?')){
        STORE.photos = [];
        saveStore(STORE);
        renderGallery();
    }
});

// ---------- Lightbox ----------
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

// ---------- Treino ----------
genTreinoBtn?.addEventListener('click', ()=>{
    const preset = presetTreino.value;
    const grupo = grupoMuscular.value;
    const nivel = nivelEl.value || 'iniciante';
    if(!preset && !grupo) return alert('Escolha preset famoso ou grupo muscular.');
    let plan='';
    if(preset==='ramon') plan=`Ramon Dino - Full Hypertrophy Plan:\n- Agachamento 5x6-8\n- Leg press 4x10\n- Stiff 4x8-10\n- Supino 4x6-8\n- Remada 4x8\n(Nível: ${nivel})`;
    else if(preset==='cbum') plan=`Chris Bumstead (CBum) style:\n- Supino 4x8-10\n- Desenvolvimento 4x8\n- Remada 4x10\n- Rosca 4x10\n(Nível: ${nivel})`;
    else if(preset==='arnold') plan=`Arnold split style:\n- Peito 5x8-12\n- Costas 5x8-12\n- Pernas 5x6-8\n- Ombro volume\n(Nível: ${nivel})`;
    else{
        if(grupo==='costas') plan=`Treino Costas:\n- Barra fixa 4x até falha\n- Remada curvada 4x8-10\n- Pulldown 4x10\n- Levantamento terra 3x6-8\n(Nível: ${nivel})`;
        else if(grupo==='perna') plan=`Treino Pernas:\n- Agachamento 4x8-10\n- Leg press 4x12\n- Stiff 4x10\n- Panturrilha 5x15\n(Nível: ${nivel})`;
        else if(grupo==='peito') plan=`Treino Peito:\n- Supino reto 4x8\n- Supino inclinado 4x10\n- Crucifixo 3x12\n- Flexões 3x15\n(Nível: ${nivel})`;
        else if(grupo==='braco') plan=`Treino Braços:\n- Rosca direta 4x10\n- Rosca martelo 4x10\n- Tríceps pulley 4x12\n- Tríceps testa 3x10\n(Nível: ${nivel})`;
    }
    plan += `\n\nRecomendação: ${recommendationText || 'Faça cálculo antes.'}`;
    treinoOutput.innerHTML = plan.replaceAll('\n','<br>');
});

// ---------- Timer ----------
const timerCard = document.getElementById('timerCard');
const timerDisplay = document.getElementById('timerDisplay');
let timerInterval = null, timerRemaining = 0;

document.getElementById('timerOpen')?.addEventListener('click', ()=>{ timerCard.classList.toggle('hidden'); });
document.getElementById('timerStart')?.addEventListener('click', ()=>{
    if(!timerInterval){
        if(timerRemaining===0) timerRemaining=60;
        timerInterval=setInterval(()=>{
            if(timerRemaining<=0){ clearInterval(timerInterval); timerInterval=null; timerDisplay.innerText='00:00'; return; }
            timerRemaining--;
            const mm=String(Math.floor(timerRemaining/60)).padStart(2,'0');
            const ss=String(timerRemaining%60).padStart(2,'0');
            timerDisplay.innerText = `${mm}:${ss}`;
        },1000);
    }
});
document.getElementById('timerPause')?.addEventListener('click', ()=>{
    if(timerInterval){ clearInterval(timerInterval); timerInterval=null; }
});
document.getElementById('timerReset')?.addEventListener('click', ()=>{
    if(timerInterval){ clearInterval(timerInterval); timerInterval=null; }
    timerRemaining=0; timerDisplay.innerText='00:00';
});

// ---------- Export CSV ----------
exportCSVBtn?.addEventListener('click', ()=>{
    if(!STORE.history.length) return alert('Nenhum histórico salvo.');
    const rows=[['date','altura','peso','imc','braco','perna','cintura']];
    STORE.history.forEach(h=> rows.push([new Date(h.ts).toISOString(),h.altura,h.peso,h.imc,h.braco,h.perna,h.cintura]));
    const blob = new Blob([rows.map(r=>r.join(',')).join('\n')], {type:'text/csv'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='historico.csv'; a.click();
    URL.revokeObjectURL(a.href);
});

// ---------- Export/Import JSON ----------
document.getElementById('downloadJSON')?.addEventListener('click', ()=>{
    const data = JSON.stringify(STORE,null,2);
    const blob = new Blob([data], {type:'application/json'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='fitness-data.json'; a.click();
});
document.getElementById('importJSON')?.addEventListener('click', ()=> document.getElementById('fileImport').click());
document.getElementById('fileImport')?.addEventListener('change', e=>{
    const f=e.target.files[0]; if(!f) return;
    const reader=new FileReader();
    reader.onload=ev=>{
        try{
            STORE=JSON.parse(ev.target.result);
            saveStore(STORE);
            alert('Dados importados. Recarregue para ver.');
        }catch{ alert('Arquivo inválido'); }
    };
    reader.readAsText(f);
});

// ---------- Export PDF ----------
document.getElementById('exportPDFFull')?.addEventListener('click', async ()=>{
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p','mm','a4');
    doc.setFontSize(18); doc.text('Relatório Fitness',105,15,{align:'center'});
    const profile = STORE.profile||{};
    doc.setFontSize(11);
    doc.text(`Nome: ${profile.name||'-'}`,14,30);
    doc.text(`Idade: ${profile.age||'-'}  Sexo: ${profile.sex||'-'}`,14,36);
    if(profile.lastCalc){
        doc.text('Último cálculo:',14,46);
        doc.text(`IMC: ${profile.lastCalc.imc||'-'}`,14,52);
        doc.text(`% Gordura: ${profile.lastCalc.gordura||'-'}`,14,58);
        doc.text(`TMB: ${profile.lastCalc.tmb||'-'}`,14,64);
    }
    let y=75;
    for(let i=0;i<Math.min(4,STORE.photos.length);i++){
        const img = STORE.photos[i];
        await new Promise(resolve=>{
            const image=new Image();
            image.onload=()=>{ doc.addImage(image,'PNG',14+(i%2)*95,y,80,60); resolve(); };
            image.src=img;
        });
        if(i%2===1) y+=65;
    }
    doc.save('relatorio-fitness.pdf');
});

document.getElementById('exportPDF')?.addEventListener('click', ()=>{
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const treinoText = treinoOutput.innerText || 'Nenhum treino gerado';
    const lines = doc.splitTextToSize(treinoText,180);
    doc.setFontSize(16); doc.text('Plano de Treino',105,15,{align:'center'});
    doc.setFontSize(11); doc.text(lines,14,30);
    doc.save('plano-treino.pdf');
});

// ---------- Inicial ----------
renderGallery();
renderChart();
