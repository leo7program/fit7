// Troca de abas
function mostrarAba(id){
  document.querySelectorAll('.aba').forEach(a => a.style.display='none');
  document.getElementById(id).style.display='block';
}

// Calcular IMC + Massa + Gordura + salvar medidas
function calcularPrincipal(){
  const altura=parseFloat(document.getElementById("altura").value)||1;
  const peso=parseFloat(document.getElementById("peso").value)||30;
  const meta=parseFloat(document.getElementById("meta").value)||NaN;
  const shape=document.getElementById("shape").value;
  const braco=parseFloat(document.getElementById("braco").value)||30;
  const perna=parseFloat(document.getElementById("perna").value)||50;
  const cintura=parseFloat(document.getElementById("cintura").value)||70;

  const imc=(peso/(altura*altura)).toFixed(2);
  const gordura=(1.2*imc)+(0.23*25)-5.4; // simplificado idade=25
  const massa=peso*(1-gordura/100);

  // Classificação IMC
  let classificacao="";
  if(imc<18.5) classificacao="Abaixo do peso";
  else if(imc<24.9) classificacao="Peso normal";
  else if(imc<29.9) classificacao="Sobrepeso";
  else classificacao="Obesidade";

  // Meta
  let msg="";
  if(!isNaN(meta)){
    const dif=(peso-meta).toFixed(1);
    if(dif>0) msg=`Precisa perder ${dif} kg para meta.`;
    else if(dif<0) msg=`Precisa ganhar ${Math.abs(dif)} kg para meta.`;
    else msg="Você está na meta!";
  }

  // Resultado
  document.getElementById("resultadoPrincipal").innerHTML=
    `<p>IMC: ${imc} (${classificacao})</p>
     <p>Massa muscular: ${massa.toFixed(1)} kg</p>
     <p>% Gordura: ${gordura.toFixed(1)}%</p>
     <p>${msg}</p>`;

  // Salvar medidas na aba Evolução
  const medidas=document.getElementById("medidasSalvas");
  medidas.innerHTML+=`<p>Peso:${peso}kg | Braço:${braco}cm | Perna:${perna}cm | Cintura:${cintura}cm | Meta:${meta}kg | Objetivo:${shape}</p>`;
}

// Evolução - fotos
function adicionarFotoEvolucao(){
  const upload=document.getElementById("uploadFotoEvolucao");
  const fotos=document.getElementById("fotosEvolucao");
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

// Plano de Treino
function gerarTreino(){
  const objetivo=document.getElementById("objetivoTreino").value;
  const nivel=document.getElementById("nivelTreino").value;
  let plano="";
  if(objetivo==="atletico") plano="3x musculação + 2x cardio leve";
  else if(objetivo==="maromba") plano="4x musculação + 1x cardio leve";
  else if(objetivo==="emagrecer") plano="2x musculação + 4x HIIT";
  else plano="3x musculação + 2x cardio moderado";
  plano+=`\nNível: ${nivel}`;

  document.getElementById("planoTreino").innerText=plano;
  document.getElementById("recomendacaoAlimentacao").innerText="Alimentação sugerida: Proteínas, carboidratos equilibrados e vegetais (IA placeholder)";
}
