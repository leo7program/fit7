console.log("Fitness App iniciado");
const STORE_KEY="fitness_app_v1";
function saveStore(obj){localStorage.setItem(STORE_KEY,JSON.stringify(obj))}
function loadStore(){try{return JSON.parse(localStorage.getItem(STORE_KEY))||{}}catch(e){return{}}}
let STORE=loadStore();
if(!STORE.profile) STORE.profile={};
if(!STORE.history) STORE.history=[];
if(!STORE.photos) STORE.photos=[];
saveStore(STORE);

// ---------- Tabs ----------
const tabBtns=document.querySelectorAll(".nav-btn");
const sections=document.querySelectorAll(".tab");
tabBtns.forEach(btn=>btn.addEventListener("click",()=>{openTab(btn.dataset.tab)}));
function openTab(id){
  tabBtns.forEach(b=>b.classList.remove("active"));
  document.querySelectorAll(`[data-tab="${id}"]`).forEach(b=>b.classList.add("active"));
  sections.forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ---------- Profile ----------
const profileBtn=document.getElementById("profileBtn");
const profileModal=document.getElementById("profileModal");
const profileName=document.getElementById("profileName");
const profileAge=document.getElementById("profileAge");
const profileSex=document.getElementById("profileSex");
const saveProfileBtn=document.getElementById("saveProfile");
const closeProfileBtn=document.getElementById("closeProfile");

profileBtn?.addEventListener("click",()=>{
  profileModal.classList.remove("hidden");
  profileName.value=STORE.profile.name||"";
  profileAge.value=STORE.profile.age||"";
  profileSex.value=STORE.profile.sex||"";
});
saveProfileBtn?.addEventListener("click",()=>{
  STORE.profile={name:profileName.value,age:profileAge.value,sex:profileSex.value};
  saveStore(STORE);
  profileModal.classList.add("hidden");
});
closeProfileBtn?.addEventListener("click",()=>profileModal.classList.add("hidden"));

// ---------- IMC ----------
const alturaInput=document.getElementById("altura");
const pesoInput=document.getElementById("peso");
const metaInput=document.getElementById("meta");
const bracoInput=document.getElementById("braco");
const pernaInput=document.getElementById("perna");
const cinturaInput=document.getElementById("cintura");
const idadeInput=document.getElementById("idade");
const sexoSelect=document.getElementById("sexo");
const objetivoSelect=document.getElementById("objetivo");
const resultadoBox=document.getElementById("resultadoBox");
const calcBtn=document.getElementById("calcBtn");

calcBtn?.addEventListener("click",()=>{
  const altura=parseFloat(alturaInput.value);
  const peso=parseFloat(pesoInput.value);
  if(!altura||!peso){alert("Preencha altura e peso");return;}
  const imc=peso/(altura*altura);
  resultadoBox.innerHTML=`<p>Seu IMC: <b>${imc.toFixed(2)}</b></p>`;
  STORE.history.push({timestamp:new Date().toISOString(),imc});
  saveStore(STORE);
  renderChart();
});

// ---------- Chart ----------
const ctx=document.getElementById("chartIMC").getContext("2d");
let chartIMC=new Chart(ctx,{type:"line",data:{labels:[],datasets:[{label:"IMC",data:[],borderColor:"#ff6b6b",fill:false}]},options:{responsive:true,plugins:{legend:{display:true}}}});
function renderChart(){
  chartIMC.data.labels=STORE.history.map(h=>new Date(h.timestamp).toLocaleDateString());
  chartIMC.data.datasets[0].data=STORE.history.map(h=>h.imc);
  chartIMC.update();
}
renderChart();

// ---------- Evolução ----------
const gallery=document.getElementById("gallery");
const uploadFotoEvolucao=document.getElementById("uploadFotoEvolucao");
const addFotoBtn=document.getElementById("addFotoBtn");
const clearPhotosBtn=document.getElementById("clearPhotos");

function renderGallery(){
  gallery.innerHTML="";
  STORE.photos.forEach((src,i)=>{
    const div=document.createElement("div");div.className="foto";
    const img=document.createElement("img");img.src=src;img.addEventListener("click",()=>openLightbox(src));
    const del=document.createElement("button");del.className="del";del.textContent="X";del.addEventListener("click",()=>{STORE.photos.splice(i,1);saveStore(STORE);renderGallery();});
    div.appendChild(img);div.appendChild(del);
    gallery.appendChild(div);
  });
}
addFotoBtn?.addEventListener("click",()=>{
  if(uploadFotoEvolucao.files.length===0)return;
  const file=uploadFotoEvolucao.files[0];
  const reader=new FileReader();
  reader.onload=e=>{
    STORE.photos.push(e.target.result);
    saveStore(STORE);
    renderGallery();
  };reader.readAsDataURL(file);
});
clearPhotosBtn?.addEventListener("click",()=>{STORE.photos=[];saveStore(STORE);renderGallery();});
renderGallery();

// ---------- Lightbox ----------
function openLightbox(src){
  let lb=document.getElementById("lightbox");
  if(!lb){lb=document.createElement("div");lb.id="lightbox";lb.className="modal hidden";const img=document.createElement("img");img.id="lightboxImg";lb.appendChild(img);document.body.appendChild(lb);}
  lb.querySelector("#lightboxImg").src=src;
  lb.classList.remove("hidden");
}
function closeLightbox(){document.getElementById("lightbox").classList.add("hidden");}
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeLightbox()});

// ---------- Treino ----------
const genTreinoBtn=document.getElementById("genTreino");
const treinoOutput=document.getElementById("treinoOutput");
genTreinoBtn?.addEventListener("click",()=>{
  const preset=document.getElementById("presetTreino").value;
  const grupo=document.getElementById("grupoMuscular").value;
  const nivel=document.getElementById("nivel").value;
  let treino=`Treino Gerado: ${grupo||"Não selecionado"} - Nível ${nivel||"Não definido"}<br>`;
  if(preset) treino+=`Preset: ${preset}<br>`;
  treino+="Exercícios:<ul><li>Ex1</li><li>Ex2</li><li>Ex3</li></ul>";
  treinoOutput.innerHTML=treino;
});

// ---------- JSON Export/Import ----------
document.getElementById("downloadJSON")?.addEventListener("click",()=>{
  const dataStr="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(STORE,null,2));
  const a=document.createElement("a");a.href=dataStr;a.download="fitness_store.json";a.click();
});
document.getElementById("importJSON")?.addEventListener("click",()=>{
  const input=document.createElement("input");input.type="file";input.accept="application/json";
  input.onchange=()=>{const file=input.files[0];const reader=new FileReader();reader.onload=e=>{try{STORE=JSON.parse(e.target.result);saveStore(STORE);renderGallery();renderChart();alert("Importado com sucesso!");}catch(e){alert("Arquivo inválido")}};reader.readAsText(file);}
  input.click();
});
