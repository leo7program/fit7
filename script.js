// ======== TROCA DE ABAS ========
const tabs = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('.tab');

tabs.forEach(btn => {
  btn.addEventListener('click', () => {
    tabs.forEach(b => b.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));

    btn.classList.add('active');
    const tabId = btn.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
  });
});

// ======== IMC / MASSA / GORDURA ========
let historicoIMC = [];
let graficoIMC = null;

function validarCampos() {
  const campos = document.querySelectorAll('#principal input, #principal select');
  let valido = true;

  campos.forEach(c => {
    if (!c.value || c.value.trim() === "") {
      c.classList.add('invalid');
      c.focus();
      valido = false;
      setTimeout(() => c.classList.remove('invalid'), 300);
    }
  });

  return valido;
}

function calcularPrincipal() {
  if (!validarCampos()) return;

  const altura = parseFloat(document.getElementById("altura").value);
  const peso = parseFloat(document.getElementById("peso").value);
  const meta = parseFloat(document.getElementById("meta").value);
  const braco = parseFloat(document.getElementById("braco").value);
  const perna = parseFloat(document.getElementById("perna").value);
  const cintura = parseFloat(document.getElementById("cintura").value);

  const imc = (peso / (altura * altura)).toFixed(2);
  const gordura = (1.2 * imc) + (0.23 * 25) - 5.4;
  const massa = peso * (1 - gordura / 100);

  let classificacao = "";
  if (imc < 18.5) classificacao = "Abaixo do peso";
  else if (imc < 24.9) classificacao = "Peso normal";
  else if (imc < 29.9) classificacao = "Sobrepeso";
  else classificacao = "Obesidade";

  const dif = (peso - meta).toFixed(1);
  let msg = "";
  if (dif > 0) msg = `Precisa perder ${dif} kg para atingir a meta.`;
  else if (dif < 0) msg = `Precisa ganhar ${Math.abs(dif)} kg para atingir a meta.`;
  else msg = "Você está na meta!";

  document.getElementById("resultadoPrincipal").innerHTML =
    `<p>IMC: ${imc} (${classificacao})</p>
     <p>Massa muscular: ${massa.toFixed(1)} kg</p>
     <p>% Gordura: ${gordura.toFixed(1)}%</p>
     <p>${msg}</p>
     <p>Braço: ${braco} cm | Perna: ${perna} cm | Cintura: ${cintura} cm</p>`;

  // Atualizar gráfico
  historicoIMC.push(parseFloat(imc));
  if (graficoIMC) graficoIMC.destroy();

  const ctx = document.getElementById('graficoIMC').getContext('2d');
  graficoIMC = new Chart(ctx, {
    type: 'line',
    data: {
      labels: historicoIMC.map((_, i) => i + 1),
      datasets: [{
        label: 'IMC',
        data: historicoIMC,
        borderColor: '#ff6b6b',
        fill: false,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#fff' } } },
      scales: {
        y: { beginAtZero: true, ticks: { color: '#fff' } },
        x: { ticks: { color: '#fff' } }
      }
    }
  });
}

// ======== EVOLUÇÃO COM FOTOS ========
function validarEvolucao() {
  const upload = document.getElementById("uploadFotoEvolucao");
  if (!upload.files || !upload.files[0]) {
    upload.classList.add('invalid');
    setTimeout(() => upload.classList.remove('invalid'), 300);
    return;
  }
  adicionarFotoEvolucao();
}

function adicionarFotoEvolucao() {
  const upload = document.getElementById("uploadFotoEvolucao");
  const fotos = document.getElementById("fotosEvolucao");
  if (upload.files && upload.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      fotos.appendChild(img);
    }
    reader.readAsDataURL(upload.files[0]);
  }
}

// ======== PLANO DE TREINO ========
function validarTreino() {
  const objetivo = document.getElementById("objetivoTreino");
  const nivel = document.getElementById("nivelTreino");
  let valido = true;

  if (!objetivo.value) {
    objetivo.classList.add('invalid');
    setTimeout(() => objetivo.classList.remove('invalid'), 300);
    valido = false;
  }
  if (!nivel.value) {
    nivel.classList.add('invalid');
    setTimeout(() => nivel.classList.remove('invalid'), 300);
    valido = false;
  }
  if (!valido) return;

  gerarTreino();
}

function gerarTreino() {
  const objetivo = document.getElementById("objetivoTreino").value;
  const nivel = document.getElementById("nivelTreino").value;

  let plano = "";

  if (objetivo === "atletico") plano = "3x musculação + 2x cardio leve";
  else if (objetivo === "maromba") plano = "5x musculação intensa + 2x cardio";
  else if (objetivo === "emagrecer") plano = "3x musculação + 4x HIIT";
  else plano = "Manutenção leve";

  document.getElementById("planoTreino").innerText = `Plano: ${plano} (Nível: ${nivel})`;
  document.getElementById("recomendacaoAlimentacao").innerText = "Recomendações alimentares: proteínas magras, legumes, hidratação e controle de carboidratos.";
}

// ======== GERAR PDF ========
function gerarPDFProfissional() {
  html2canvas(document.querySelector('.app-container')).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jspdf.jsPDF();
    pdf.addImage(imgData, 'PNG', 0, 0, 210, canvas.height * 210 / canvas.width);
    pdf.save('fitness_app.pdf');
  });
}
