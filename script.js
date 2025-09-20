// Troca de abas
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const tabId = btn.getAttribute('data-tab');
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
  });
});

let historicoIMC = [];
let grafico;

function calcularPrincipal(){
  const altura=parseFloat(document.getElementById("altura").value)||1;
  const peso=parseFloat(document.getElementById("peso").value)||30;
  const meta=parseFloat(document.getElementById("meta").value)||NaN;
  const shape=document.getElementById("shape").value;
  const braco=parseFloat(document.getElementById("braco").value)||30;
  const perna=parseFloat(document.getElementById("perna").value)||50;
  const cintura=parseFloat(document.getElementById("cintura").value)||70;

  const imc=(peso/(altura*altura)).toFixed(2);
  const gordura=(1.2*imc)+(0.23*25)-5.4;
  const massa=peso*(1-gordura/100);

  let classificacao="";
  if(imc<18.5) classificacao="Abaixo do peso";
  else if(imc<24.9) classificacao="Peso normal";
  else if(imc<29.9) classificacao="Sobrepeso";
  else classificacao="Obesidade";

  let msg="";
  if(!isNaN(meta)){
    const dif=(peso-meta).toFixed(1);
    if(dif>0) msg=`Precisa perder ${dif} kg para meta.`;
    else if(dif<0) msg=`Precisa ganhar ${Math.abs(dif)} kg para meta.`;
    else msg="Você está na meta!";
  }

  document.getElementById("resultadoPrincipal").innerHTML=
    `<p>IMC: ${imc} (${classificacao})</p>
     <p>Massa muscular: ${massa.toFixed(1)} kg</p>
     <p>% Gordura: ${gordura.toFixed(1)}%</p>
     <p>${msg}</p>`;

  const medidas=document.getElementById("medidasSalvas");
  medidas.innerHTML+=`<p>Peso:${peso}kg | Braço:${braco}cm | Perna:${perna}cm | Cintura:${cintura}cm | Meta:${meta}kg | Objetivo:${shape}</p>`;

  historicoIMC.push(parseFloat(imc));
  if(grafico) grafico.destroy();
  const ctx=document.getElementById('graficoIMC').getContext('2d');
  grafico=new Chart(ctx,{
    type:'line',
    data:{
      labels:historicoIMC.map((_,i)=>i+1),
      datasets:[{label:'IMC',data:historicoIMC,borderColor:'#ff6b6b',fill:false,tension:0.3}]
    },
    options:{
      responsive:true,
      plugins:{legend:{labels:{color:'#fff'}}},
      scales:{y:{beginAtZero:true,color:'#fff'},x:{color:'#fff'}}
    }
  });
}

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

function gerarTreino(){
  const objetivo=document.getElementById("objetivoTreino").value;
  const nivel=document.getElementById("nivelTreino").value;
  let plano="";
  if(objetivo==="atletico") plano="3x musculação + 2x cardio leve";
  else if(objetivo==="maromba") plano="5x musculação intensa + 2x cardio";
  else if(objetivo==="emagrecer") plano="3x musculação + 4x HIIT";
  else plano="Manutenção leve";

  document.getElementById("planoTreino").innerText=plano;
  document.getElementById("recomendacaoAlimentacao").innerText="Comer proteínas magras, legumes e hidratar-se bem.";
}

function gerarPDFProfissional(){
  html2canvas(document.querySelector('.app-container')).then(canvas=>{
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jspdf.jsPDF();
    pdf.addImage(imgData,'PNG',0,0,210,canvas.height*210/canvas.width);
    pdf.save('fitness_app.pdf');
  });
}
