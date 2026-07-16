const money=(n)=>new Intl.NumberFormat('fr-FR',{
  style:'currency',
  currency:'EUR',
  maximumFractionDigits:2
}).format(Number.isFinite(n)?n:0);

const num=(n,d=2)=>new Intl.NumberFormat('fr-FR',{
  maximumFractionDigits:d
}).format(Number.isFinite(n)?n:0);

function setResult(id,value){
  const el=document.getElementById(id);
  if(el) el.textContent=value;
}

function value(id){
  return parseFloat(
    (document.getElementById(id)?.value||'').replace(',','.')
  )||0;
}

function calcTVA(){
  const ht=value('ht');
  const t=value('taux');
  setResult('res',`${money(ht*(1+t/100))} TTC — TVA : ${money(ht*t/100)}`);
}

function calcPourcentage(){
  const a=value('a');
  const b=value('b');
  setResult('res',b?`${num((a/b)*100)} %`:'0 %');
}

function calcRemise(){
  const prix=value('prix');
  const remise=value('remise');
  setResult(
    'res',
    `${money(prix*(1-remise/100))} — économie : ${money(prix*remise/100)}`
  );
}

function calcAge(){
  const input=document.getElementById('naissance');

  if(!input) return;

  const d=new Date(input.value);

  if(isNaN(d)){
    setResult('res','Choisis une date');
    return;
  }

  const now=new Date();
  let age=now.getFullYear()-d.getFullYear();
  const m=now.getMonth()-d.getMonth();

  if(m<0||(m===0&&now.getDate()<d.getDate())) age--;

  setResult('res',`${age} ans`);
}

function calcDates(){
  const input1=document.getElementById('date1');
  const input2=document.getElementById('date2');

  if(!input1||!input2) return;

  const d1=new Date(input1.value);
  const d2=new Date(input2.value);

  if(isNaN(d1)||isNaN(d2)){
    setResult('res','Choisis deux dates');
    return;
  }

  setResult(
    'res',
    `${Math.abs(Math.round((d2-d1)/86400000))} jours`
  );
}

function calcSalaire(){
  const brut=value('brut');
  const statut=document.getElementById('statut')?.value||'noncadre';
  const rate=statut==='cadre'?.75:.78;

  setResult('res',`${money(brut*rate)} net estimé / mois`);
}

function calcIMC(){
  const p=value('poids');
  const t=value('taille')/100;
  const imc=t?p/(t*t):0;

  const categorie=
    imc<18.5?'Insuffisance pondérale':
    imc<25?'Corpulence normale':
    imc<30?'Surpoids':
    'Obésité';

  setResult('res',`${num(imc,1)} — ${categorie}`);
}

function calcMoyenne(){
  const input=document.getElementById('notes');

  if(!input) return;

  const vals=(input.value||'')
    .split(/[;, ]+/)
    .map(x=>parseFloat(x.replace(',','.')))
    .filter(Number.isFinite);

  setResult(
    'res',
    vals.length
      ?`${num(vals.reduce((a,b)=>a+b,0)/vals.length)} / 20`
      :'Entre des notes'
  );
}

function calcInterets(){
  const capital=value('capital');
  const rendement=value('rendement')/100;
  const annees=value('annees');
  const versement=value('versement');

  let total=capital;

  for(let i=0;i<annees;i++){
    total=(total+versement*12)*(1+rendement);
  }

  setResult('res',`${money(total)} après ${annees} ans`);
}

function calcPret(){
  const capital=value('montant');
  const annual=value('taux')/100;
  const years=value('duree');
  const monthlyRate=annual/12;
  const months=years*12;

  const payment=monthlyRate
    ?capital*monthlyRate*Math.pow(1+monthlyRate,months)/
      (Math.pow(1+monthlyRate,months)-1)
    :months?capital/months:0;

  setResult('res',`${money(payment)} / mois`);
}

/* Recherche et catégories de la page d’accueil */

let activeCategory='all';

const toolCategories={
  finance:[
    'tva.html',
    'remise.html',
    'salaire-net.html',
    'interets-composes.html',
    'pret.html',
    'tva-inversee.html',
    'marge-commerciale.html'
  ],

  etudes:[
    'pourcentage.html',
    'moyenne.html',
    'moyenne-coefficients.html',
    'regle-de-trois.html'
  ],

  sante:[
    'imc.html'
  ],

  quotidien:[
    'age.html',
    'jours-entre-dates.html',
    'augmentation-pourcentage.html'
  ]
};

function categoryOf(card){
  const href=card.getAttribute('href')||'';

  for(const [category,files] of Object.entries(toolCategories)){
    if(files.some(file=>href.endsWith(file))){
      return category;
    }
  }

  return 'quotidien';
}

function applyToolFilters(){
  const input=document.getElementById('toolSearch');
  const query=(input?.value||'').trim().toLowerCase();

  document.querySelectorAll('.tool-card').forEach(card=>{
    const matchesSearch=card.innerText.toLowerCase().includes(query);
    const matchesCategory=
      activeCategory==='all'||categoryOf(card)===activeCategory;

    card.classList.toggle(
      'hidden',
      !(matchesSearch&&matchesCategory)
    );
  });
}

function filterTools(){
  applyToolFilters();
}

function filterCategory(category,button){
  activeCategory=category;

  document.querySelectorAll('.category-btn').forEach(btn=>{
    btn.classList.remove('active');
  });

  if(button){
    button.classList.add('active');
  }

  applyToolFilters();
}

/* Actualisation automatique des résultats */

document.addEventListener('input',event=>{
  const form=event.target.closest('[data-calc]');

  if(form&&window[form.dataset.calc]){
    window[form.dataset.calc]();
  }
});

document.addEventListener('change',event=>{
  const form=event.target.closest('[data-calc]');

  if(form&&window[form.dataset.calc]){
    window[form.dataset.calc]();
  }
});

document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('[data-calc]').forEach(form=>{
    if(window[form.dataset.calc]){
      window[form.dataset.calc]();
    }
  });

  applyToolFilters();
});
