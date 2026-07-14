const money=(n)=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:2}).format(Number.isFinite(n)?n:0);
const num=(n,d=2)=>new Intl.NumberFormat('fr-FR',{maximumFractionDigits:d}).format(Number.isFinite(n)?n:0);
function setResult(id,value){const el=document.getElementById(id); if(el) el.textContent=value}
function value(id){return parseFloat((document.getElementById(id)?.value||'').replace(',','.'))||0}
function calcTVA(){const ht=value('ht'),t=value('taux');setResult('res',`${money(ht*(1+t/100))} TTC — TVA : ${money(ht*t/100)}`)}
function calcPourcentage(){const a=value('a'),b=value('b');setResult('res',b?`${num((a/b)*100)} %`:'0 %')}
function calcRemise(){const prix=value('prix'),remise=value('remise');setResult('res',`${money(prix*(1-remise/100))} — économie : ${money(prix*remise/100)}`)}
function calcAge(){const d=new Date(document.getElementById('naissance').value);if(isNaN(d)){setResult('res','Choisis une date');return}const now=new Date();let age=now.getFullYear()-d.getFullYear();const m=now.getMonth()-d.getMonth();if(m<0||(m===0&&now.getDate()<d.getDate()))age--;setResult('res',`${age} ans`)}
function calcDates(){const d1=new Date(document.getElementById('date1').value),d2=new Date(document.getElementById('date2').value);if(isNaN(d1)||isNaN(d2)){setResult('res','Choisis deux dates');return}setResult('res',`${Math.abs(Math.round((d2-d1)/86400000))} jours`)}
function calcSalaire(){const brut=value('brut'),statut=document.getElementById('statut').value;const rate=statut==='cadre'?.75:.78;setResult('res',`${money(brut*rate)} net estimé / mois`)}
function calcIMC(){const p=value('poids'),t=value('taille')/100;const imc=t?p/(t*t):0;let c=imc<18.5?'Insuffisance pondérale':imc<25?'Corpulence normale':imc<30?'Surpoids':'Obésité';setResult('res',`${num(imc,1)} — ${c}`)}
function calcMoyenne(){const vals=(document.getElementById('notes').value||'').split(/[;, ]+/).map(x=>parseFloat(x.replace(',','.'))).filter(Number.isFinite);setResult('res',vals.length?`${num(vals.reduce((a,b)=>a+b,0)/vals.length)} / 20`:'Entre des notes')}
function calcInterets(){const c=value('capital'),r=value('rendement')/100,n=value('annees'),v=value('versement');let total=c;for(let i=0;i<n;i++)total=(total+v*12)*(1+r);setResult('res',`${money(total)} après ${n} ans`)}
function calcPret(){const c=value('montant'),annual=value('taux')/100,years=value('duree'),m=annual/12,n=years*12;const pay=m?c*m*Math.pow(1+m,n)/(Math.pow(1+m,n)-1):c/n;setResult('res',`${money(pay)} / mois`)}
function filterTools(){const q=(document.getElementById('toolSearch').value||'').toLowerCase();document.querySelectorAll('.tool-card').forEach(c=>c.classList.toggle('hidden',!c.innerText.toLowerCase().includes(q)))}
document.addEventListener('input',e=>{const form=e.target.closest('[data-calc]');if(form&&window[form.dataset.calc])window[form.dataset.calc]()});
document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('[data-calc]').forEach(f=>{if(window[f.dataset.calc])window[f.dataset.calc]()})});
