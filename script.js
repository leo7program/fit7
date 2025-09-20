function calcularIMC() {
    let alturaInput = parseFloat(document.getElementById("altura").value);
    // Limita altura entre 0.5 e 2.5
    const altura = Math.min(Math.max(alturaInput, 0.5), 2.5);

    const peso = parseFloat(document.getElementById("peso").value);
    const meta = parseFloat(document.getElementById("meta").value);
    const shape = document.getElementById("shape").value;

    const resultado = document.getElementById("resultado");
    const pesoIdealDiv = document.getElementById("pesoIdeal");
    const tipoShapeDiv = document.getElementById("tipoShape");

    if (isNaN(peso)) {
        alert("Insira valores válidos.");
        return;
    }

    const imc = (peso / (altura * altura)).toFixed(2);

    // Classificação IMC
    let classificacao = "", recomendacao = "", dicas = "";

    if (imc < 18.5) {
        classificacao = "Abaixo do peso";
        recomendacao = "Ganhe peso de forma saudável.";
        dicas = "🏋️ Musculação, exercícios com peso corporal, aumentar proteínas.";
    } else if (imc < 24.9) {
        classificacao = "Peso normal (ideal)";
        recomendacao = "Mantenha hábitos saudáveis.";
        dicas = "🏃‍♂️ Corrida leve, caminhada, yoga, treinos funcionais.";
    } else if (imc < 29.9) {
        classificacao = "Sobrepeso";
        recomendacao = "Reduzir peso até a faixa saudável.";
        dicas = "🏃‍♂️ Caminhada rápida, HIIT, treino funcional, controlar alimentação.";
    } else if (imc < 34.9) {
        classificacao = "Obesidade Grau I";
        recomendacao = "Reduzir peso com acompanhamento.";
        dicas = "🏃‍♂️ Caminhada diária, natação, exercícios de baixo impacto.";
    } else if (imc < 39.9) {
        classificacao = "Obesidade Grau II";
        recomendacao = "Buscar orientação profissional.";
        dicas = "🏃‍♂️ Exercícios leves supervisionados, dieta controlada.";
    } else {
        classificacao = "Obesidade Grau III";
        recomendacao = "Risco alto, acompanhamento médico obrigatório.";
        dicas = "🏃‍♂️ Exercícios supervisionados, fisioterapia, dieta rigorosa.";
    }

    resultado.innerHTML = `
        <p>IMC: <strong>${imc}</strong></p>
        <p>Classificação: <strong>${classificacao}</strong></p>
        <p>Recomendação: ${recomendacao}</p>
        <p>Dicas: ${dicas}</p>
    `;

    if (!isNaN(meta)) {
        const diferenca = (peso - meta).toFixed(1);
        let msgMeta = "";
        if (diferenca > 0) msgMeta = `Você precisa perder ${diferenca} kg para a meta.`;
        else if (diferenca < 0) msgMeta = `Você precisa ganhar ${Math.abs(diferenca)} kg para a meta.`;
        else msgMeta = "Parabéns! Você já está na sua meta.";
        resultado.innerHTML += `<p>${msgMeta}</p>`;
    }

    // Peso ideal
    const pesoMin = (18.5 * altura * altura).toFixed(1);
    const pesoMax = (24.9 * altura * altura).toFixed(1);
    pesoIdealDiv.innerHTML = `<p>Faixa de Peso Ideal: <strong>${pesoMin} kg - ${pesoMax} kg</strong></p>`;

    // Tipo de corpo / shape
    let tipoShape = "";
    if (shape === "atletico") tipoShape = "Foco em definição muscular e resistência.";
    else if (shape === "maromba") tipoShape = "Foco em hipertrofia e ganho de massa muscular.";
    else if (shape === "emagrecer") tipoShape = "Foco em perda de gordura e condicionamento.";
    else if (shape === "manter") tipoShape = "Foco em manter o corpo saudável e equilibrado.";
    else tipoShape = "Escolha seu objetivo para receber dicas personalizadas.";

    tipoShapeDiv.innerHTML = `<p>Objetivo: <strong>${shape}</strong></p><p>${tipoShape}</p>`;
}

// Galeria de fotos
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
