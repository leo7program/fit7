function mostrarAba(id){
  document.querySelectorAll('.aba').forEach(a=>a.style.display='none');
  document.getElementById(id).style.display='block';
}

// IMC
function calcularIMC(){
  let altura=parseFloat(document.getElementById("altura").value)||1;
  let peso=parseFloat(document.getElementById("peso").value)||30;
  let meta=parseFloat(document.getElementById("meta").value)||NaN;
  altura=Math.min(Math.max(altura,0.5),2.5);
  peso=Math.min(Math.max(peso,30),500);
  if(!isNaN(meta)) meta=Math.min(Math.max(meta,30),500);
  document.getElementById("altura").value=altura;
  document.getElementById("peso").value=peso;
  if(!isNaN(meta)) document.getElementById("meta").value=meta;
  const imc=(peso/(altura*altura)).toFixed(2);
  let classificacao="",dicas="";
  if(imc<18.5){classificacao="Abaixo do peso";dicas="Ganhar peso saudável";}
  else if(imc<24.9){classificacao="Peso normal";dicas="Manter hábitos saudáveis";}
  else if(imc<29.9){classificacao="Sobrepeso";dicas="Perder peso com exercícios";}
  else{classificacao="Obesidade";dicas="Buscar acompanhamento profissional";}
  const resultado=document.getElementById("resultado");
  resultado.innerHTML=`<p>IMC: ${imc}</p><p>${classificacao}</p><p>${dicas}</p>`;
  if(!isNaN(meta)){
    const dif=(peso-meta).toFixed(1);
    let msg="";
    if(dif>0) msg=`Precisa perder ${dif} kg para meta.`;
    else if(dif<0) msg=`Precisa ganhar ${Math.abs(dif)} kg para meta.`;
    else msg="Parabéns! Você está na meta.";
    resultado.innerHTML+=`<p>${msg}</p>`;
  }
}

// Galeria
function adicionarFoto(){
  const upload=document.getElementById("uploadFoto");
  const fotos=document.getElementById("fotos");
  if(upload.files && upload.files[0]){
    const reader=new FileReader();
    reader.onload=function(e){
      const img=document.createElement("img");
      img.src=e.target.result;
      fotos.appendChild(img);
    }
    reader.readAsDataURL(upload.files[0]);
  }
}

// Massa muscular & Gordura
function calcularMassa(){
  const peso=parseFloat(document.getElementById("pesoMuscular").value)||30;
  const altura=parseFloat(document.getElementById("alturaMuscular").value)||1;
  const braco=parseFloat(document.getElementById("braco").value)||30;
  const cintura=parseFloat(document.getElementById("cintura").value)||70;
  const quadril=parseFloat(document.getElementById("quadril").value)||90;
  const imc=peso/(altura*altura);
  const gordura=(1.2*imc)+(0.23*25)-5.4;
  const massa=peso*(1-gordura/100);
  document.getElementById("resultadoMassa").innerHTML=`<p>% gordura: ${gordura.toFixed(1)}%</p><p>Massa muscular: ${massa.toFixed(1)} kg</p><p>Cardio recomendado: 150 min/semana</p>`;
}

// Plano de treino
function gerarTreino(){
  const objetivo=document.getElementById("objetivoTreino").value;
  const nivel=document.getElementById("nivelTreino").value;
  let plano="";
  if(objetivo==="atletico") plano="3x musculação + 2x cardio leve";
  else if(objetivo==="maromba") plano="4x musculação + 1x cardio leve";
  else if(objetivo==="emagrecer") plano="2x musculação + 4x HIIT";
  else plano="3x musculação + 2x cardio moderado";
  plano+="\nNível: "+nivel;
  document.getElementById("planoTreino").innerText=plano;
  document.getElementById("recomendacaoAlimentacao").innerText="Alimentação sugerida: Proteínas, carboidratos equilibrados e vegetais. (IA placeholder)";
}

// Gerar PDF do treino
function gerarPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const plano=document.getElementById("planoTreino").innerText;
 
