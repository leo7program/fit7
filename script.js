    if(confirm('Remover todas as fotos?')){
        STORE.photos = [];
        saveStore(STORE);
        renderGallery();
    }
});

// ---------- Lightbox ----------
function openLightbox(src){
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    img.src = src;
    lightbox.classList.remove('hidden');
}
function closeLightbox(){
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.add('hidden');
    document.getElementById('lightboxImg').src = '';
}

// ---------- Treino ----------
genTreinoBtn?.addEventListener('click', ()=>{
    const preset = presetTreino.value;
    const grupo = grupoMuscular.value;
    const nivel = nivelEl.value || 'iniciante';
    if(!preset && !grupo) return alert('Escolha preset famoso ou grupo muscular.');
    let plan='';
    if(preset==='ramon') plan=`Ramon Dino - Full Hypertrophy Plan:\n- Agachamento 5x6-8\n- Leg press 4x10\n- Stiff 4x8-10\n- Supino 4x6-8\n- Remada 4x8\n(Nível: ${nivel})`;
    else if(preset==='cbum') plan=`Chris Bumstead (CBum) style:\n- Supino 4x8-10\n- Desenvolvimento 4x8\n- Remada 4x10\n- Rosca 4x10\n(Nível: ${nivel})`;
    else if(preset==='arnold') plan=`Arnold split style:\n- Peito 5x8-12\n- Costas 5x8-12\n- Pernas 5x6-8\n- Ombro volume\n(Nível: ${nivel})`;
    else{
        if(grupo==='costas') plan=`Treino Costas:\n- Barra fixa 4x até falha\n- Remada curvada 4x8-10\n- Pulldown 4x10\n- Levantamento terra 3x6-8\n(Nível: ${nivel})`;
        else if(grupo==='perna') plan=`Treino Pernas:\n- Agachamento 4x8-10\n- Leg press 4x12\n- Stiff 4x10\n- Panturrilha 5x15\n(Nível: ${nivel})`;
        else if(grupo==='peito') plan=`Treino Peito:\n- Supino reto 4x8\n- Supino inclinado 4x10\n- Crucifixo 3x12\n- Flexões 3x15\n(Nível: ${nivel})`;
        else if(grupo==='braco') plan=`Treino Braços:\n- Rosca direta 4x10\n- Rosca martelo 4x10\n- Tríceps pulley 4x12\n- Tríceps testa 3x10\n(Nível: ${nivel})`;
    }
    plan += `\n\nRecomendação: ${recommendationText || 'Faça cálculo antes.'}`;
    treinoOutput.innerHTML = plan.replaceAll('\n','<br>');
});

// ---------- Timer ----------
const timerCard = document.getElementById('timerCard');
const timerDisplay = document.getElementById('timerDisplay');
let timerInterval = null, timerRemaining = 0;

document.getElementById('timerOpen')?.addEventListener('click', ()=>{ timerCard.classList.toggle('hidden'); });
document.getElementById('timerStart')?.addEventListener('click', ()=>{
    if(!timerInterval){
        if(timerRemaining===0) timerRemaining=60;
        timerInterval=setInterval(()=>{
            if(timerRemaining<=0){ clearInterval(timerInterval); timerInterval=null; timerDisplay.innerText='00:00'; return; }
            timerRemaining--;
            const mm=String(Math.floor(timerRemaining/60)).padStart(2,'0');
            const ss=String(timerRemaining%60).padStart(2,'0');
            timerDisplay.innerText = `${mm}:${ss}`;
        },1000);
    }
});
document.getElementById('timerPause')?.addEventListener('click', ()=>{
    if(timerInterval){ clearInterval(timerInterval); timerInterval=null; }
});
document.getElementById('timerReset')?.addEventListener('click', ()=>{
    if(timerInterval){ clearInterval(timerInterval); timerInterval=null; }
    timerRemaining=0; timerDisplay.innerText='00:00';
});

// ---------- Export CSV ----------
exportCSVBtn?.addEventListener('click', ()=>{
    if(!STORE.history.length) return alert('Nenhum histórico salvo.');
    const rows=[['date','altura','peso','imc','braco','perna','cintura']];
    STORE.history.forEach(h=> rows.push([new Date(h.ts).toISOString(),h.altura,h.peso,h.imc,h.braco,h.perna,h.cintura]));
    const blob = new Blob([rows.map(r=>r.join(',')).join('\n')], {type:'text/csv'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='historico.csv'; a.click();
    URL.revokeObjectURL(a.href);
});

// ---------- Export/Import JSON ----------
document.getElementById('downloadJSON')?.addEventListener('click', ()=>{
    const data = JSON.stringify(STORE,null,2);
    const blob = new Blob([data], {type:'application/json'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='fitness-data.json'; a.click();
});
document.getElementById('importJSON')?.addEventListener('click', ()=> document.getElementById('fileImport').click());
document.getElementById('fileImport')?.addEventListener('change', e=>{
    const f=e.target.files[0]; if(!f) return;
    const reader=new FileReader();
    reader.onload=ev=>{
        try{
            STORE=JSON.parse(ev.target.result);
            saveStore(STORE);
            alert('Dados importados. Recarregue para ver.');
        }catch{ alert('Arquivo inválido'); }
    };
    reader.readAsText(f);
});

// ---------- Export PDF ----------
document.getElementById('exportPDFFull')?.addEventListener('click', async ()=>{
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p','mm','a4');
    doc.setFontSize(18); doc.text('Relatório Fitness',105,15,{align:'center'});
    const profile = STORE.profile||{};
    doc.setFontSize(11);
    doc.text(`Nome: ${profile.name||'-'}`,14,30);
    doc.text(`Idade: ${profile.age||'-'}  Sexo: ${profile.sex||'-'}`,14,36);
    if(profile.lastCalc){
        doc.text('Último cálculo:',14,46);
        doc.text(`IMC: ${profile.lastCalc.imc||'-'}`,14,52);
        doc.text(`% Gordura: ${profile.lastCalc.gordura||'-'}`,14,58);
        doc.text(`TMB: ${profile.lastCalc.tmb||'-'}`,14,64);
    }
    let y=75;
    for(let i=0;i<Math.min(4,STORE.photos.length);i++){
        const img = STORE.photos[i];
        await new Promise(resolve=>{
            const image=new Image();
            image.onload=()=>{ doc.addImage(image,'PNG',14+(i%2)*95,y,80,60); resolve(); };
            image.src=img;
        });
        if(i%2===1) y+=65;
    }
    doc.save('relatorio-fitness.pdf');
});

document.getElementById('exportPDF')?.addEventListener('click', ()=>{
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const treinoText = treinoOutput.innerText || 'Nenhum treino gerado';
    const lines = doc.splitTextToSize(treinoText,180);
    doc.setFontSize(16); doc.text('Plano de Treino',105,15,{align:'center'});
    doc.setFontSize(11); doc.text(lines,14,30);
    doc.save('plano-treino.pdf');
});

// ---------- Inicial ----------
renderGallery();
renderChart();
