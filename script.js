console.log("script carregado");

// Troca de abas
const tabs=document.querySelectorAll('.tab-btn');
const sections=document.querySelectorAll('.tab');
function abrirTab(nome){
  tabs.forEach(b=>b.classList.remove('active'));
  sections.forEach(s=>s.classList.remove('active'));
  document.querySelector(`[data-tab="${nome}"]`).classList.add('active');
  document.getElementById(nome).classList.add('active');
}
tabs.forEach(btn=>{
  btn.addEventListener('click',()=>abrirTab(btn.dataset.tab));
});

// ===== Cálculo principal =====
let ultimaRecomendacao="";

function calcularPrincipal(){
  const altura=parseFloat(document.getElementById("altura").value);
  const peso=parseFloat(document.getElementById("peso").value);
  const meta=parseFloat(document.getElementById("meta").value);
  const braco=document.getElementById("braco").value;
  const perna=document.getElementById("perna").value;
  const cintura=document.getElementById("cintura").value;

  if(!altura||!peso||!meta||!braco||!perna||!cintura){
    alert("Preencha todos os campos!");
    return;
  }

  const imc=(peso/(altura*altura)).toFixed(2);
  let status="";
  if(imc<18.5) status="Abaixo do peso";
  else if(imc<24.9) status="Peso ideal";
  else if(imc<29.9) status="Sobrepeso";
  else status="Obesidade";

  const gordura=(1.2*imc+0.23*25-5.4).toFixed(1);
  const massa=(peso-(peso*gordura/100)).toFixed(1);

  if(imc<18.5){
    ultimaRecomendacao="Foco em Peito e Braços (hipertrofia)";
  } else if(imc<24.9){
    ultimaRecomendacao="Treino equilibrado: Costas, Peito, Braços e Pernas";
  } else if(imc<29.9){
    ultimaRecomendacao="Mais Pernas e Cardio + musculação leve";
  } else {
    ultimaRecomendacao="Foco em Cardio + Pernas e Costas";
  }

  document.getElementById("resultadoPrincipal").innerHTML=`
    <p><b>IMC:</b> ${imc} (${status})</p>
    <p><b>% Gordura:</b> ${gordura}%</p>
    <p><b>Massa magra:</b> ${massa} kg</p>
    <p><b>Braço:</b> ${braco} cm | <b>Perna:</b> ${perna} cm | <b>Cintura:</b> ${cintura} cm</p>
    <p><b>Meta:</b> ${meta} kg</p>
    <p style="color:#ff6b6b"><b>Recomendação:</b> ${ultimaRecomendacao}</p>
  `;
}

// ===== Evolução =====
function validarEvolucao(){
  const input=document.getElementById("uploadFotoEvolucao");
  if(input.files.length===0){alert("Escolha uma foto!");return;}
  const file=input.files[0];
  const reader=new FileReader();
  reader.onload=function(e){
    const container=document.createElement("div");
    container.classList.add("foto-container");
    const img=document.createElement("img");
    img.src=e.target.result;
    img.onclick=()=>abrirModal(img.src);

    const btn=document.createElement("button");
    btn.innerText="×";
    btn.classList.add("delete-btn");
    btn.onclick=()=>container.remove();

    container.appendChild(img);
    container.appendChild(btn);
    document.getElementById("fotosEvolucao").appendChild(container);
  }
  reader.readAsDataURL(file);
}

function abrirModal(src){
  let modal=document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML=`<img src="${src}">`;
  modal.onclick=()=>modal.remove();
  document.body.appendChild(modal);
  modal.style.display="flex";
}

// ===== Treino =====
function validarTreino(){
  const objetivo=document.getElementById("objetivoTreino").value;
  if(!objetivo){alert("Escolha um treino!");return;}

  let treino="";
  if(objetivo==="costas"){
    treino=`Treino de Costas:<br>
    - Barra fixa 4x até falha<br>
    - Remada curvada 4x10<br>
    - Puxada alta 4x12<br>
    - Levantamento terra 4x8`;
  } else if(objetivo==="perna"){
    treino=`Treino de Pernas:<br>
    - Agachamento livre 4x10<br>
    - Leg press 4x12<br>
    - Cadeira extensora 3x15<br>
    - Stiff 4x12<br>
    - Panturrilha 5x20`;
  } else if(objetivo==="peito"){
    treino=`Treino de Peito:<br>
    - Supino reto 4x8<br>
    - Supino inclinado 4x10<br>
    - Crucifixo 3x12<br>
    - Flexão 3x15`;
  } else if(objetivo==="braco"){
    treino=`Treino de Braços:<br>
    - Rosca bíceps 4x12<br>
    - Rosca martelo 4x12<br>
    - Tríceps pulley 4x12<br>
    - Tríceps testa 3x12`;
  }

  treino += `<br><br><b>Recomendação calculadora:</b> ${ultimaRecomendacao}`;
  document.getElementById("planoTreino").innerHTML=treino;
}

// ===== PDF =====
function gerarPDFProfissional(){
  const { jsPDF } = window.jspdf;
  const doc=new jsPDF();
  doc.setFont("helvetica","bold");
  doc.setFontSize(18);
  doc.text("Plano Fitness",105,20,{align:"center"});

  doc.setFontSize(12);
  doc.text(document.getElementById("resultadoPrincipal").innerText,20,40);
  doc.text("Treino:",20,80);
  doc.text(document.getElementById("planoTreino").innerText,20,90);

  doc.save("plano-fitness.pdf");
}
