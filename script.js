function calcularIMC() {
  const altura = parseFloat(document.getElementById("altura").value);
  const peso = parseFloat(document.getElementById("peso").value);
  const meta = parseFloat(document.getElementById("meta").value);
  const shape = document.getElementById("shape").value;
  const resultado = document.getElementById("resultado");
  const progress = document.getElementById("progress");
  const motivacao = document.getElementById("motivacao");

  if (!altura || !peso) {
    resultado.innerHTML = "⚠️ Insira altura e peso.";
    return;
  }

  const imc = (peso / (altura * altura)).toFixed(2);

  let classificacao = "";
  let cor = "";

  if (imc < 18.5) { 
    classificacao = "Abaixo do peso"; 
    cor = "#00bfff"; 
  }
  else if (imc < 24.9) { 
    classificacao = "Peso ideal"; 
    cor = "#00ff95"; 
  }
  else if (imc < 29.9) { 
    classificacao = "Sobrepeso"; 
    cor = "#ffa500"; 
  }
  else if (imc < 34.9) { 
    classificacao = "Obesidade Grau I"; 
    cor = "#ff4d4d"; 
  }
  else if (imc < 39.9) { 
    classificacao = "Obesidade Grau II"; 
    cor = "#e60000"; 
  }
  else { 
    classificacao = "Obesidade Grau III"; 
    cor = "#990000"; 
  }

  let diferenca = meta ? (meta - peso).toFixed(1) : "não definida";

  resultado.innerHTML = `
    <p><strong>IMC:</strong> ${imc}</p>
    <p><strong>Situação:</strong> <span style="color:${cor}; font-weight:bold;">${classificacao}</span></p>
    <p><strong>Peso atual:</strong> ${peso} kg</p>
    <p><strong>Peso meta:</strong> ${meta || "não definido"} kg</p>
    <p><strong>Diferença:</strong> ${diferenca} kg</p>
    <p><strong>Objetivo:</strong> ${shape}</p>
  `;

  if (meta) {
    let progresso = ((peso / meta) * 100).toFixed(0);
    if (progresso > 100) progresso = 100;
    if (progresso < 0) progresso = 0;
    progress.style.width = progresso + "%";
    progress.innerHTML = progresso + "%";
  }

  const frases = [
    "💪 A jornada importa mais que o destino.",
    "🔥 Consistência vence intensidade.",
    "🏋️ Cada treino te aproxima do shape dos sonhos.",
    "🥦 Alimentação é 70% do resultado.",
    "🚀 Pequenos progressos geram grandes mudanças."
  ];
  motivacao.innerHTML = frases[Math.floor(Math.random() * frases.length)];
}

function adicionarFoto() {
  const upload = document.getElementById("uploadFoto");
  const fotos = document.getElementById("fotos");

  if (upload.files && upload.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      fotos.appendChild(img);
    };
    reader.readAsDataURL(upload.files[0]);
  }
}
