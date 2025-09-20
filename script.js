// Função para trocar abas
function mostrarAba(id) {
  document.querySelectorAll('.aba').forEach(a => a.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

// ------------------ IMC ------------------
function calcularIMC() {
    let altura = parseFloat(document.getElementById("altura").value) || 1;
    let peso = parseFloat(document.getElementById("peso").value) || 30;
    let meta = parseFloat(document.getElementById("meta").value) || NaN;

    altura = Math.min(Math.max(altura,0.5),2.5);
    peso = Math.min(Math.max(peso,30),500);
    if(!isNaN(meta)) meta = Math.min(Math.max(meta,30),500);

    document.getElementById("altura").value = altura;
    document.getElementById("peso").value = peso;
    if(!isNaN(meta)) document.getElementById("meta").value = meta;

    const imc = (peso / (altura*altura)).toFixed(2);
    let classificacao="", recomendacao="", dicas="";
    if(imc<18.5){classificacao="Abaixo do peso";recomendacao="Ganhe peso de forma saudável.";dicas="🏋️ Musculação, exercícios com peso corporal, aumentar proteínas."}
    else if(imc<24.9){classificacao="Peso normal";recomendacao="Mantenha hábitos saudáveis.";dicas="🏃‍♂️ Corrida leve, caminhada, yoga, treinos funcionais."}
    else if(imc<29.9){classificacao="Sobrepeso";recomendacao="Reduzir peso até a faixa saudável.";dicas="🏃‍♂️ Caminhada rápida, HIIT, treino funcional, controlar alimentação."}
    else if(imc<34.9){classificacao="Obesidade Grau I";recomendacao="Reduzir peso com acompanhamento.";dicas="🏃‍♂️ Caminhada diária, natação, exercícios de baixo impacto."}
    else if(imc<39.9){classificacao="Obesidade Grau II";recomendacao="Buscar orientação profissional.";dicas="🏃‍♂️ Exercícios leves supervisionados, dieta controlada."}
    else {classificacao="Obesidade Grau III";recomendacao="Risco alto, acompanhamento médico obrigatório.";dicas="🏃‍♂️ Exercícios supervisionados, fisioterapia, dieta rigorosa."}

    const resultado=document.getElementById("resultado");
    resultado.innerHTML=`<p>IMC: <strong>${imc}</strong></p><p>Classificação: <strong>${classificacao}</strong></p><p>Recomendação: ${recomendacao}</p><p>Dicas: ${dicas}</p>`;
    if(!isNaN(meta)){
        const dif = (peso-meta).toFixed(1);
        let msg="";
        if(dif>0) msg=`Você precisa perder ${dif} kg para a meta.`;
        else if(dif<0) msg=`Você precisa ganhar ${Math.abs(dif)} kg para a meta.`;
        else msg="Parabéns! Você já está na sua meta.";
        resultado.innerHTML+=`<p>${msg}</p>`;
    }

    const pesoMin=(18.5*altura*altura).toFixed(1);
    const pesoMax=(24.9*altura*altura).toFixed(1);
    document.getElementById("pesoIdeal").innerHTML=`<p>Faixa de Peso Ideal: <strong>${pesoMin} kg - ${pesoMax} kg</strong></p>`;

    const shape = document.getElementById("shape").value;
    let tipoShape="";
    if(shape==="atletico") tipoShape="Foco em definição muscular e resistência.";
    else if(shape==="maromba") tipoShape="Foco em hipertrofia e ganho de massa muscular.";
    else if(shape==="emagrecer") tipoShape="Foco em perda de gordura e condicionamento.";
    else if(shape==="manter") tipoShape="Foco em manter o corpo saudável e equilibrado.";
    else tipoShape="Escolha seu objetivo para receber dicas personalizadas.";
    document.getElementById("tipoShape").innerHTML=`<p>Objetivo: <strong>${shape}</strong></p><p>${tipoShape}</p>`;
}

// ------------------ Galeria ------------------
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

// ------------------ Massa muscular & Gordura ------------------
function calcularMassa(){
    const peso=parseFloat(document.getElementById("pesoMuscular").value)||30;
    const altura=parseFloat(document.getElementById("alturaMuscular").value)||1;
    const braco=parseFloat(document.getElementById("braco").value)||30;
    const cintura=parseFloat(document.getElementById("cintura").value)||70;
    const quadril=parseFloat(document.getElementById("quadril").value)||90;

    // Fórmula simplificada de % gordura corporal
    const imc=peso/(altura*altura);
    const gordura=(1.2*imc)+(0.23*25)-5.4; // idade padrão 25 anos
    const massaMuscular=peso*(1-gordura/100);

    const resultado=document.getElementById("resultadoMassa");
    resultado.innerHTML=`<p>Percentual estimado de gordura corporal: <strong>${gordura.toFixed(1)}%</strong></p>
                         <p>Massa muscular estimada: <strong>${massaMuscular.toFixed(1)} kg</strong></p>
                         <p>Cardio recomendado: 150 min/semana (moderado) ou HIIT leve, dependendo do seu objetivo.</p>`;
}

// ------------------ Plano de Treino ------------------
function gerarTreino(){
    const objetivo=document.getElementById("objetivoTreino").value;
    const nivel=document.getElementById("nivelTreino").value;
    let plano="";
    if(objetivo==="atletico") plano="Treino: 3x musculação + 2x cardio leve por semana.";
    else if(objetivo==="maromba") plano="Treino: 4x musculação + 1x cardio leve, foco em hipertrofia.";
    else if(objetivo==="emagrecer") plano="Treino: 2x musculação + 4x cardio HIIT, foco em perda de gordura.";
    else plano="Treino: 3x musculação + 2x cardio moderado, manter corpo saudável.";

    if(nivel==="iniciante") plano+="\nNível: Iniciante, cargas leves e foco em execução correta.";
    else if(nivel==="intermediario") plano+="\nNível: Intermediário, cargas moderadas, intensidade média.";
    else plano+="\nNível: Avançado, altas cargas, intensidade alta, cuidado com lesões.";

    document.getElementById("planoTreino").innerText=plano;
}
