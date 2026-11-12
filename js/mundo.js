/* Mapa, tempo, exploração e sobrevivência. */
/* ---------- Mapa ---------- */
function vizinhos(u){
  const r=[];
  for(const [a,b,w] of ARESTAS){
    if(a===u&&LOCAIS[b].dia<=jogo.dia)r.push([b,w]);
    else if(b===u&&LOCAIS[a].dia<=jogo.dia)r.push([a,w]);
  }
  return r;
}
function caminho(a,b){
  const dist={[a]:0},prev={},aberto=new Set(Object.keys(LOCAIS));
  while(aberto.size){
    let u=null;
    for(const k of aberto)if(dist[k]!==undefined&&(u===null||dist[k]<dist[u]))u=k;
    if(u===null)break;
    aberto.delete(u);
    if(u===b)break;
    for(const [v,w] of vizinhos(u)){
      const nd=dist[u]+w;
      if(dist[v]===undefined||nd<dist[v]){dist[v]=nd;prev[v]=u;}
    }
  }
  if(dist[b]===undefined)return null;
  const path=[];let c=b;
  while(c!==a){path.unshift(c);c=prev[c];}
  return path;
}
function pesoAresta(a,b){const e=ARESTAS.find(([x,y])=>(x===a&&y===b)||(x===b&&y===a));return e?e[2]:1;}
function caminhoTempo(a,b){
  const p=caminho(a,b); if(!p)return 99;
  let t=0,c=a; for(const x of p){t+=pesoAresta(c,x);c=x;}
  return t;
}
function selecionarSaque(local){
  const itens=LOCAIS[local]?.saques||[];
  if(!itens.length)return null;
  const preferidos=PREFERENCIAS_SAQUE[local]||[];
  const pesoTotal=itens.reduce((total,item)=>total+(preferidos.includes(item)?5:1),0);
  let sorteio=Math.random()*pesoTotal;
  for(const item of itens){
    sorteio-=preferidos.includes(item)?5:1;
    if(sorteio<0)return item;
  }
  return itens[itens.length-1];
}
function viajarPara(dest){
  if(dest===jogo.local)return;
  const bl=bloqueio(dest); if(bl)return registrar(bl);
  const path=caminho(jogo.local,dest);
  if(!path)return registrar("Não há caminho seguro até lá agora.");
  if(dest==="quartel"&&jogo.milicia<0){
    if(!gasta("municao",3))return registrar("A milícia não deixa você entrar sem 3 munições.");
    registrar("Você paga 3 munições para a milícia abrir o portão.");
  }
  let atual=jogo.local;
  for(const p of path){
    passarTempo(pesoAresta(atual,p)); if(jogo.morto)return;
    atual=p; jogo.local=p; jogo.visitados[p]=true;
    registrar(`Você chegou a: ${LOCAIS[p].nome}.`);
    atualizarHistoria();
    const risco=Math.max(0.02,Math.min(0.6,0.04+jogo.densidade[p]*0.05-bonusRoupa("furtividade")-bonusAnimal("furtividade")-nivelSkill("rastreador")*0.04));
    if(chance(risco)){iniciarCombate(zumbisPara(p));return;}
  }
  if(chance(0.3))abrirEvento();
}
function zumbisPara(k){
  const n=Math.round(jogo.densidade[k]/2)+rnd(0,1);
  return Array.from({length:limitar(n,1,6)},()=>chance(LOCAIS[k].perigo>=5?0.18:0.08)?"brutamontes":chance(0.24)?"corredor":"zumbi");
}

/* ---------- Tempo e mundo ---------- */
function transformar(p){
  p.status="transformado";p.emMissao=null;
  jogo.densidade[p.local]=(jogo.densidade[p.local]||0)+2;
  if(p.grupo){registrar(`${p.nome} se transformou dentro do grupo!`);p.grupo=null;}
  else if(p.local===jogo.local)registrar(`${p.nome} se transformou bem ao seu lado!`);
}
function novoDia(){
  jogo.clima=["calor","calor","chuva","nublado"][rnd(0,3)];
  jogo.conversouHoje={};
  if(jogo.dia===2)jogo.energia=false;
  registrar(`Boletim: ${BOLETIM[jogo.dia]||"Silêncio no rádio. Só estática."}`);
  for(const k of Object.keys(LOCAIS))jogo.densidade[k]=Math.min(10,(jogo.densidade[k]||0)+0.4+(LOCAIS[k].perigo>=5?0.4:0));
  processarBases();
    processarAnimais();
  for(const p of Object.values(P)){
    if(p.status!=="vivo")continue;
    const visivel=p.local===jogo.local||p.grupo==="juliana"||p.grupo==="jogador";
    if(p.inf&&jogo.dia===p.turno-1&&visivel)registrar(`${p.nome} está suando e tremendo. Dizem que foi mordido(a).`);
    if(p.inf&&jogo.dia>=p.turno){transformar(p);continue;}
    if(!p.fixo&&!p.grupo&&!p.emMissao){
      if(chance(0.02))p.status="morto";
      else if(chance(0.35)){const v=vizinhos(p.local);if(v.length)p.local=v[rnd(0,v.length-1)][0];}
    }
  }
  if(jogo.dia===7&&jogo.milicia<-20&&P.breno.status==="vivo"){
    P.breno.status="morto";LOCAIS.posto.perigo=5;LOCAIS.posto.zumbis=[2,5];
    registrar("Breno foi encontrado morto no posto. A milícia não deixou testemunhas.");
  }
  for(const [g,G] of Object.entries(jogo.grupos)){
    const n=membrosDe(g).length;
    if(!n)continue;
    const faltou=G.estoque.comida<n||G.estoque.agua<n;
    G.estoque.comida=Math.max(0,(G.estoque.comida||0)-n);
    G.estoque.agua=Math.max(0,(G.estoque.agua||0)-n);
    G.moral=limitar(G.moral+(faltou?-12:2));
      membrosDe(g).forEach(p=>{
        if(faltou)p.vinculo=Math.max(0,(p.vinculo||0)-2);
        else fortalecerVinculo(p,1);
      });
    if(G.moral<=20&&chance(0.4)){
      const m=membrosDe(g)[0]; m.grupo=null;
      registrar(`${m.nome} foi embora do grupo durante a noite. A comida estava acabando.`);
    }
  }
  movimentarHordas();
  jogo.missoes=jogo.missoes.filter(m=>{
    if(jogo.dia>m.expiraDia){P.juliana.conf=limitar(P.juliana.conf-4,-100);registrar(`Missão expirou: ${m.titulo}.`);return false;}
    return true;
  });
  gerarQuadro();
}
function passarTempo(h,desc=false){
  for(let i=0;i<h&&!jogo.morto;i++){
    jogo.hora++;jogo.tempo++;
    if(jogo.hora>=24){jogo.hora=0;jogo.dia++;novoDia();}
    const noite=jogo.hora>=19||jogo.hora<6;
    const calorDia=jogo.clima==="calor"&&jogo.hora>=9&&jogo.hora<=17;
    if(jogo.hora===19&&!jogo.energia){
      if(jogo.inv.pilhas>0)jogo.inv.pilhas--;
      else if(jogo.inv.lenha>0)jogo.inv.lenha--;
      else registrar("A noite chegou sem luz nem fogo. O escuro pesa.");
    }
    jogo.fome=limitar(jogo.fome-(desc?1:2));
    jogo.sede=limitar(jogo.sede-(desc?2:3)-(calorDia&&!desc?1:0));
    if(desc){
      jogo.cansaco=limitar(jogo.cansaco+12);jogo.sanidade=limitar(jogo.sanidade+2+bonusAnimal("sanidade"));
      if(jogo.fome>20&&jogo.sede>20)jogo.vida=limitar(jogo.vida+1);
    }else{
      jogo.cansaco=limitar(jogo.cansaco-(jogo.roupas?.botas==="botas"?2:3));
      if(noite){
            jogo.sanidade=limitar(jogo.sanidade-(jogo.roupas?.casaco==="jaqueta"?0.5:1));
        if(!jogo.energia&&!jogo.inv.pilhas&&!jogo.inv.lenha)jogo.sanidade=limitar(jogo.sanidade-2);
      }
        if(jogo.clima==="chuva"&&jogo.local!=="abrigo"&&jogo.roupas?.casaco!=="capa_chuva")jogo.cansaco=limitar(jogo.cansaco-0.5);
    }
    if(jogo.fome===0||jogo.sede===0)jogo.vida=limitar(jogo.vida-3);
    jogo.ruido=Math.max(0,jogo.ruido-1);
    for(const l of jogo.lesoes){l.horas--;if(l.tipo==="mordida"&&l.horas===12)registrar("Febre e tremores começam. Não há mais tempo.");}
    if(temLesao("disenteria")){jogo.vida=limitar(jogo.vida-1);jogo.fome=limitar(jogo.fome-1);}
    if(temLesao("mordida"))jogo.sanidade=limitar(jogo.sanidade-1);
    resolverMissoesLider();
    if(jogo.lesoes.some(l=>l.tipo==="mordida"&&l.horas<=0)){morrer("A infecção da mordida tomou conta. Você se transformou em um deles.");return;}
    jogo.lesoes=jogo.lesoes.filter(l=>{
      if(l.horas>0)return true;
      if(l.tipo==="fratura"){jogo.sequelaPerna=true;registrar("A fratura consolidou torta. Sua perna nunca mais será a mesma.");}
      if(l.tipo==="disenteria")registrar("A disenteria passou, mas você ficou muito fraco.");
      return false;
    });
    if(jogo.vida<=0){morrer("Ferimentos, fome e sede cobraram o preço.");return;}
  }
}

/* ---------- Ações do jogador ---------- */
function explorar(){
  const L=LOCAIS[jogo.local];
  if(!L.saques.length)return registrar("Não há nada útil para vasculhar aqui.");
  passarTempo(2); if(jogo.morto)return;
  jogo.ruido+=1;
  let achou=0;
  for(let i=rnd(1,2);i>0;i--){
    if(pesoAtual()>=CAP){registrar("Sua mochila está cheia. O resto ficou para trás.");break;}
    if(jogo.local==="lab"&&chance(0.2)){jogo.inv.soro++;achou++;registrar("Você encontrou um frasco de soro experimental, ainda selado!");continue;}
    const it=selecionarSaque(jogo.local);
    let q=quantidadeItem(it);
    if(jogo.hab==="mecanico"&&["combustivel","bateria","cano","machado","lenha"].includes(it))q++;
    if(chance(Math.min(0.5,nivelSkill("catador")*0.12+bonusAnimal("catador"))))q++;
    if(it==="pistola"){
      const limite=Math.max(0,CAP-pesoAtual()-(jogo.pistola?0:1));
      const municao=Math.min(rnd(3,6),limite);
      if(!jogo.pistola){jogo.pistola=true;registrar("Você encontrou uma pistola.");}
      else registrar("Você encontrou munição compatível com sua pistola.");
      if(municao){jogo.inv.municao+=municao;registrar(`Você também encontrou ${municao}× munição.`);}
      achou++;
      continue;
    }
    q=Math.min(q,Math.max(0,CAP-pesoAtual()));
    if(q>0){jogo.inv[it]+=q;achou+=q;registrar(`Você encontrou ${q}× ${NOMES[it]}.`);}
  }
  if(!achou)registrar("Você vasculhou o local e não encontrou nada útil.");
  ganharXP(12,"exploração");
  jogo.exploracoes=(jogo.exploracoes||0)+1;
  if(jogo.local==="quartel"&&!jogo.pistola&&chance(0.12)){jogo.pistola=true;registrar("Você achou uma pistola com um pente de munição!");}
  if(jogo.local==="quartel"&&!jogo.inv.revolver&&chance(0.08)){jogo.inv.revolver=1;registrar("No fundo de um armário, você encontrou um revólver enferrujado.");}
  if(jogo.local==="quartel"&&!jogo.inv.escopeta&&chance(0.06)){jogo.inv.escopeta=1;registrar("Uma escopeta ainda carregada estava caída sob a mesa.");}
  const d=jogo.densidade[jogo.local]||0;
  const pZumbi=Math.max(0.02,Math.min(0.7,0.05+d*0.05+Math.min(0.25,jogo.ruido*0.04)-bonusRoupa("furtividade")-bonusAnimal("furtividade")-nivelSkill("rastreador")*0.05));
  if(chance(pZumbi))return iniciarCombate(zumbisPara(jogo.local));
  if(chance(0.35))abrirEvento();
}
function abrirEvento(){
  if(combate)return;
  const ok=EVENTOS.filter(e=>!e.c||e.c(jogo.local));
  if(ok.length)evento=ok[rnd(0,ok.length-1)];
}
function resolverEvento(i){
  const e=evento; evento=null; if(!e)return;
  const r=e.o[i][1]();
  if(typeof r==="string")registrar(r);
  passarTempo(1);
}
function descansar(){
  const seguro=jogo.local==="abrigo";
  passarTempo(6,true); if(jogo.morto)return;
  if(!seguro&&chance(0.15)){registrar("Um morto-vivo te achou enquanto descansava!");iniciarCombate(["zumbi"]);}
  else registrar("Você descansou. Cansaço e sanidade se recuperaram um pouco.");
}
function usar(i){
  if(!(jogo.inv[i]>0))return registrar("Você não tem isso.");
  const med=(jogo.hab==="medico"?1.3:1)*(1+nivelSkill("primeiros_socorros")*0.12);
  jogo.inv[i]--;
  switch(i){
    case "comida": jogo.fome=limitar(jogo.fome+35); break;
    case "agua": jogo.sede=limitar(jogo.sede+35); break;
    case "agua_suja":
      jogo.sede=limitar(jogo.sede+30);
      if(chance(0.3)&&!temLesao("disenteria")){jogo.lesoes.push({tipo:"disenteria",horas:24});registrar("A água tinha algo ruim. Você está com disenteria.");}
      else registrar("Você bebe a água suja e torce para não passar mal.");
      break;
    case "bandagem": jogo.vida=limitar(jogo.vida+Math.round(15*med));registrar("Você enfaixou um ferimento."); break;
    case "kit": jogo.vida=limitar(jogo.vida+Math.round(40*med));removerLesao("fratura");registrar("Kit médico usado. Fratura tratada."); break;
    case "remedio":
      if(temLesao("disenteria")){removerLesao("disenteria");registrar("O antibiótico tratou a disenteria.");}
      else{jogo.vida=limitar(jogo.vida+Math.round(8*med));registrar("Você tomou antibiótico preventivo.");}
      break;
    case "soro":
      if(!temLesao("mordida")){jogo.inv.soro++;return registrar("Você não tem mordida para tratar. Guardou o frasco.");}
      if(chance(med>1?0.8:0.7)){removerLesao("mordida");registrar("O soro funcionou! A febre começa a ceder.");}
      else registrar("O soro não teve efeito. A infecção segue.");
      break;
    default: jogo.inv[i]++; return registrar("Isso não se usa diretamente.");
  }
  passarTempo(1);
}
function fabricar(i){
  const r=RECEITAS[i];
  if(!Object.entries(r.precisa).every(([k,v])=>jogo.inv[k]>=v))return registrar("Faltam materiais para fabricar isso.");
  for(const [k,v] of Object.entries(r.precisa))jogo.inv[k]-=v;
  for(const [k,v] of Object.entries(r.faz))jogo.inv[k]+=v;
  passarTempo(1); registrar(`Você fabricou: ${r.nome}.`);
}
