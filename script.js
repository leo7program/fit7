// Troca de abas
function mostrarAba(id){
  const abas = document.querySelectorAll('.aba');
  abas.forEach(a => a.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

// IMC
function calcularIMC(){
  const altura = parseFloat(document.getElementById("altura").value);
  const peso = parseFloat(document.getElementById("peso").value);
  const meta = parseFloat(document.getElementById("meta").value);
  const shape = document.getElementById("shape").value;

  const imc = (peso/(altura*altura)).toFixed(2);
  let classificacao="", dicas="";
  if(imc<18.5){classificacao="Abaixo do peso";dicas="Ganhar peso saudável";}
  else if(imc<24.9){classificacao="Peso normal";dicas="Manter hábitos saudáveis";}
  else if(imc<29.9){classificacao="Sobrepeso";dicas="Perder peso com exercícios";}
  else{classificacao="Obesidade";dicas="Buscar acompanhamento profissional";}

  let msg = "";
  if(meta){
    const dif = (peso-meta).toFixed(1);
    if(dif>0) msg=`Precisa perder ${dif} kg para meta.`;
    else if(dif<0) msg=`Precisa ganhar ${Math.abs(dif)} kg para meta.`;
    else msg="Você já está na meta.";
  }

  document.getElementById("resultado").innerHTML=
    `<p>IMC: ${imc}</p><p>${classificacao}</p><p>${dicas}</p><p>${msg}</p>`;
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
  const peso=parseFloat(document.getElementById("pesoMuscular").value);
  const altura=parseFloat(document.getElementById("alturaMuscular").value);
  const imc = peso/(altura*altura);
  const gordura = (1.2*imc)+(0.23*25)-5.4; // simplificado idade=25
  const massa = peso*(1-gordura/100);

  document.getElementById("resultadoMassa").innerHTML=
    `<p>% Gordura: ${gordura.toFixed(1)}%</p>
     <p>Massa muscular: ${massa.toFixed(1)} kg</p>
     <p>Cardio recomendado: 150 min/semana</p>`;
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

  plano += `\nNível: ${nivel}`;
  document.getElementById("planoTreino").innerText=plano;
  document.getElementById("recomendacaoAlimentacao").innerText="Alimentação sugerida: Proteínas, carboidratos e vegetais (IA placeholder)";
}
