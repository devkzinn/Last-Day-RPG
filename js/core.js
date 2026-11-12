/* Núcleo e utilitários. */
/* Lógica do jogo: mundo, estado, ações, combate e interface. */
const CHAVE="lastday-rpg-v3";
const $=s=>document.querySelector(s);
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const chance=p=>Math.random()<p;
const limitar=(v,min=0,max=100)=>Math.max(min,Math.min(max,v));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const CAP=24;
let jogo=null,P={},combate=null,evento=null,abaAtiva="explorar",confirmandoNovoJogo=false;
