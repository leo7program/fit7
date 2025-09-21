// CONTROLES DE ABAS
const tabs = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('.tab');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.tab;
    sections.forEach(s=>s.classList.remove('active'));
    document.getElementById(target).classList.add('active');
  });
});

// ELEMENTOS
const alturaEl = document.getElementById('altura');
const pesoEl = document.getElementById('peso');
const idadeEl = document.getElementById('idade');
const sexoEl = document.getElementById('sexo');
const objetivoEl = document.getElementById('objetivo');
const bracoEl = document.getElementById('braco');
const pernaEl = document.getElementById('perna');
const cinturaEl = document.getElementById('cintura');
const savedEl = document.getElementById('savedMeasures');
const resultadoEl = document.getElementById('resultado');
const recomEl = document.getElementById('recomendacoes');
const calcularBtn = document.getElementById('calcularBtn');

// ARMAZENAMENTO LOCAL SIMPLES
let STORE = { history: [] };
function saveMeasure() {
  const data = {
    altura:+alturaEl.value, peso:+pesoEl.value, idade:+idadeEl.value, sexo:sexoEl.value,
    objetivo:objetivoEl.value, braco:+bracoEl.value, perna:+pernaEl.value, cintura:+cinturaEl.value,
    ts:Date.now()
  };
  STORE.history.push(data);
  populateSavedMeasuresSelect();
}

function populateSavedMeasuresSelect(){
  savedEl.innerHTML = '<option value="">Selecionar medidas salvas</option>';
  STORE.history.slice().reverse().forEach((h, idx)=>{
    savedEl.innerHTML += `<option value="${idx}">${new Date(h.ts).toLocaleDateString()} - ${h.peso}kg / ${h.altura}m</option>`;
  });
}

savedEl.addEventListener('change', e=>{
  const idx = e.target.value;
  if(idx!==""){
    const h = STORE.history[idx];
    alturaEl.value=h.altura; pesoEl.value=h.peso; objetivoEl.value=h.objetivo;
    bracoEl.value=h.braco; pernaEl.value=h.perna; cinturaEl.value=h.cintura;
    idadeEl.value=h.idade; sexoEl.value=h.sexo;
  }
});

// VALIDAÇÃO E CALCULO
calcularBtn.addEventListener('click',()=>{
  let valid=true;
  [alturaEl,pesoEl,idadeEl,sexoEl,objetivoEl,bracoEl,pernaEl,cinturaEl].forEach(i=>{
    if(!i.value){i.classList.add('invalid'); valid=false;}
    else i.classList.remove('invalid');
  });
  if(!valid) return;

  const imc = pesoEl.value / (alturaEl.value**2);
  let categoria="";
  if(imc<18.5) categoria="Abaixo do peso";
  else if(imc<25) categoria="Peso normal";
  else if(imc<30) categoria="Sobrepeso";
  else if(imc<35) categoria="Obesidade I";
  else if(imc<40) categoria="Obesidade II";
  else categoria="Obesidade III";

  resultadoEl.innerHTML=`Seu IMC é <b>${imc.toFixed(1)}</b> (${categoria})`;

  let recom="";
  if(imc>=25) recom+="Recomenda-se perder peso com treino cardiovascular e musculação.<br>";
  else if(imc<18.5) recom+="Recomenda-se ganhar massa muscular com treino de força.<br>";
  else recom+="Mantenha seu peso com treino equilibrado.<br>";
  recomEl.innerHTML=recom;

  saveMeasure();
});

// GALERIA
const galeriaEl = document.getElementById('galeria');
const addFotoEl = document.getElementById('addFoto');

addFotoEl.addEventListener('change', e=>{
  const file = e.target.files[0];
  if(!file) return;
  const url = URL.createObjectURL(file);
  const img = document.createElement('img');
  img.src=url;
  img.addEventListener('click', ()=>img.classList.toggle('enlarged'));
  img.addEventListener('contextmenu', (ev)=>{ ev.preventDefault(); img.remove(); });
  galeriaEl.appendChild(img);
});

// TREINO SIMPLES
const gerarTreinoBtn = document.getElementById('gerarTreinoBtn');
const treinoResultadoEl = document.getElementById('treinoResultado');

gerarTreinoBtn.addEventListener('click', ()=>{
  let treino="";
  if(objetivoEl.value==="perda") treino="Cardio 30min + Treino de força leve";
  else if(objetivoEl.value==="ganho") treino="Treino pesado: Peito, Costas, Pernas, Braços";
  else treino="Treino equilibrado 4x/semana";
  treinoResultadoEl.innerHTML=treino;
});
