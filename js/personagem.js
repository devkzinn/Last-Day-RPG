/* Estado e progressão do personagem. */
/* ---------- Estado ---------- */
function criarPessoas(){
  const o={};
  o.juliana={id:"juliana",nome:"Juliana",papel:"líder do abrigo",local:"abrigo",hab:"lider",grupo:"juliana",status:"vivo",conf:10,vinculo:0,marcosVinculo:[],inf:false,fixo:true,ferido:false,emMissao:null};
  o.helena={id:"helena",nome:"Dra. Helena",papel:"médica",local:"abrigo",hab:"medico",grupo:"juliana",status:"vivo",conf:0,vinculo:0,marcosVinculo:[],inf:false,fixo:true,ferido:false,emMissao:null};
  o.breno={id:"breno",nome:"Breno",papel:"negociante do posto",local:"posto",hab:"comercio",grupo:null,status:"vivo",conf:0,vinculo:0,marcosVinculo:[],inf:false,fixo:true,ferido:false,emMissao:null};
  o.tiao={id:"tiao",nome:"Tião",papel:"mecânico",local:"oficina",hab:"mecanico",grupo:null,status:"vivo",conf:4,vinculo:0,marcosVinculo:[],inf:false,fixo:true,ferido:false,emMissao:null};
  GENERICOS.forEach((g,i)=>{
    o["g"+i]={id:"g"+i,nome:g[0],papel:g[1],local:g[2],hab:g[3],grupo:g[4]||null,status:"vivo",conf:0,vinculo:0,marcosVinculo:[],
      inf:chance(0.08),turno:rnd(3,6),fixo:!!g[4],ferido:false,emMissao:null};
  });
  return o;
}
function novoJogo(nome,idade,hab,modo="hibrido",aparencia={}){
  const at=hab==="atirador",me=hab==="medico",mc=hab==="mecanico";
  return {nome,idade,hab,modo,aparencia:{pele:aparencia.pele||"media",cabelo:aparencia.cabelo||"castanho"},vida:100,fome:80,sede:80,cansaco:90,sanidade:90,dia:1,hora:8,tempo:0,local:"abrigo",
    clima:"calor",energia:true,ruido:0,pistola:at,barco:false,milicia:0,
    inv:{comida:2,agua:2,agua_suja:0,bandagem:1,remedio:0,soro:0,kit:me?1:0,municao:at?12:6,combustivel:mc?2:0,bateria:0,lenha:0,pilhas:1,faca:1,machado:0,cano:0,lanca:0,facao:0,bastao:0,revolver:0,escopeta:0,sementes:1,sucata:0,prego:0,tecido:0,roupa_comum:1,tenis:1,roupa_reforcada:0,colete:0,capa_chuva:0,jaqueta:0,botas:0},
    nivel:1,xp:0,xpProximo:100,pontosAtributo:0,pontosSkill:1,skills:{},atributos:{forca:1,agilidade:1,foco:1},armaEquip:at?"pistola":"faca",roupas:{torso:"roupa_comum",casaco:null,botas:"tenis"},capitulo:0,capitulosVistos:[],tarefasAtivas:[],tarefasFeitas:[],exploracoes:0,colheitas:0,
    lesoes:[],missoes:[],quadro:[],missoesLider:[],
    densidade:Object.fromEntries(Object.entries(LOCAIS).map(([k,L])=>[k,(L.zumbis[0]+L.zumbis[1])/2])),hordas:[],
    visitados:{abrigo:true},
    grupos:{juliana:{nome:"Grupo da Juliana",base:"abrigo",lider:"juliana",moral:70,estoque:{comida:6,agua:6,bandagem:2,remedio:1,kit:1,municao:4}}},
    animais:[],animalAtivo:null,
    bases:[{id:"base-abrigo",nome:"Abrigo da igreja",local:"abrigo",nivel:1,defesa:1,canteiros:0,canil:0,estufa:0,fertilidade:70,ultimoCultivo:null,plantios:[],estoque:{}}],
    meuGrupo:null,P:criarPessoas(),
    zumbisMortos:0,missoesConcluidas:0,sequelaPerna:false,log:[],morto:false,venceu:false};
}
function registrar(t){jogo.log.unshift(`[Dia ${jogo.dia} · ${String(jogo.hora).padStart(2,"0")}h] ${t}`);jogo.log=jogo.log.slice(0,80);}
function temLesao(t){return jogo.lesoes.some(l=>l.tipo===t);}
function removerLesao(t){jogo.lesoes=jogo.lesoes.filter(l=>l.tipo!==t);}
function gasta(item,q=1){if(jogo.inv[item]>=q){jogo.inv[item]-=q;return true;}return false;}
function pesoAtual(){
  const vestido=Object.values(jogo.roupas||{}).filter(Boolean).length;
  return Math.max(0,Object.values(jogo.inv).reduce((a,b)=>a+b,0)-vestido)+(jogo.pistola?1:0);
}
function possuiArma(id){return id==="punhos"||id==="pistola"?id==="punhos"||jogo.pistola:(jogo.inv[id]||0)>0;}
function armaAtual(){return possuiArma(jogo.armaEquip)?jogo.armaEquip:"punhos";}
function ganharXP(q,motivo){
  jogo.xp=(jogo.xp||0)+q; registrar(`+${q} XP · ${motivo}.`);
  while(jogo.xp>=jogo.xpProximo){jogo.xp-=jogo.xpProximo;jogo.nivel++;jogo.xpProximo=100+(jogo.nivel-1)*35;jogo.pontosAtributo++;jogo.pontosSkill=(jogo.pontosSkill||0)+1;jogo.vida=limitar(jogo.vida+10);registrar(`Nível ${jogo.nivel}! Você ganhou 1 ponto de atributo, 1 ponto de skill e recuperou 10 de vida.`);}
}
function atualizarHistoria(){
  if(jogo.capitulo===0&&jogo.local==="oficina")avancarHistoria(1);
  if(jogo.capitulo===1&&jogo.barco)avancarHistoria(2);
  if(jogo.capitulo===2&&jogo.dia>=3)avancarHistoria(3);
  if(jogo.capitulo===3&&(jogo.visitados.escola||jogo.visitados.feira))avancarHistoria(4);
  if(jogo.capitulo===4&&(jogo.visitados.hospital||jogo.visitados.clinica))avancarHistoria(5);
  if(jogo.capitulo===5&&jogo.dia>=5)avancarHistoria(6);
  if(jogo.capitulo===6&&jogo.dia>=6&&jogo.local==="marina")avancarHistoria(7);
}
function avancarHistoria(n){
  if(jogo.capitulo>=n)return;
  jogo.capitulo=n; const c=CAPITULOS[n];
  registrar(`${c.titulo}: ${c.texto}`);
}
function evoluirAtributo(a){
  if(!jogo.pontosAtributo)return registrar("Você não tem pontos de atributo disponíveis.");
  if(!["forca","agilidade","foco"].includes(a))return;
  jogo.atributos[a]++;jogo.pontosAtributo--;registrar(`${a[0].toUpperCase()+a.slice(1)} aumentou para ${jogo.atributos[a]}.`);
}
function nivelSkill(id){return (jogo.skills&&jogo.skills[id])||0;}
function aprenderSkill(id){
  if(!SKILLS[id])return;
  const nivel=nivelSkill(id);
  if(!jogo.pontosSkill)return registrar("Você não tem pontos de skill disponíveis.");
  if(nivel>=SKILLS[id].max)return registrar("Essa skill já chegou ao nível máximo.");
  jogo.skills[id]=nivel+1;jogo.pontosSkill--;
  registrar(`${SKILLS[id].nome} alcançou o nível ${nivel+1}.`);
}
function bonusRoupa(tipo){
  return Object.values(jogo.roupas||{}).reduce((total,id)=>total+(ROUPAS[id]?.[tipo]||0),0);
}
function equiparRoupa(id){
  const roupa=ROUPAS[id];
  if(!roupa||!(jogo.inv[id]>0))return registrar("Você não tem essa peça de roupa.");
  jogo.roupas[roupa.slot]=id;
  registrar(`${NOMES[id]} equipada no slot ${roupa.slot}.`);
}
function editarPersonagem(){
  if(jogo.local!=="abrigo")return registrar("Só é possível alterar sua ficha no abrigo.");
  const nome=( $("#editar-nome").value||"").trim().slice(0,20);
  const idade=parseInt($("#editar-idade").value,10);
  if(!nome||!(idade>=16&&idade<=80))return registrar("Informe um nome e uma idade entre 16 e 80 anos.");
  jogo.nome=nome;jogo.idade=idade;
  jogo.aparencia={pele:$("#editar-pele").value,cabelo:$("#editar-cabelo").value};
  registrar("Ficha atualizada no abrigo.");
}
function precisao(b){return Math.min(0.95,Math.max(0.2,b-(jogo.sanidade<30?0.1:0)-(jogo.cansaco<20?0.1:0)));}
function quantidadeItem(i){
  if(i==="pistola")return 1;
  if(i==="municao")return rnd(3,8);
  if(["comida","agua","agua_suja","pilhas","lenha","combustivel"].includes(i))return rnd(1,2);
  if(i==="bandagem")return 1;
  return chance(0.35)?1:0;
}
function bloqueio(d){
  const L=LOCAIS[d];
  if(jogo.dia<L.dia)return `${L.nome} está fechado até o dia ${L.dia}.`;
  if(d==="marina"){
    if(!jogo.barco)return "Você precisa de um barco. Tião ainda não consertou o dele.";
    if(jogo.milicia<-15)return "A milícia bloqueia a Marina. Melhore sua relação com eles.";
  }
  return null;
}
function gerarQuadro(){jogo.quadro=MODELOS.map((m,i)=>({...m,id:`q${jogo.dia}-${i}`}));}
function pessoasEm(l){return Object.values(P).filter(p=>p.status==="vivo"&&p.local===l&&!p.emMissao);}
function membrosDe(g){return Object.values(P).filter(p=>p.grupo===g&&p.status==="vivo");}
function baseAqui(){return (jogo.bases||[]).find(b=>b.local===jogo.local);}
function estoqueDaBase(base){
  const grupo=Object.values(jogo.grupos).find(g=>g.base===base.local);
  return grupo?grupo.estoque:base.estoque;
}
function fundarBase(){
  if(baseAqui())return registrar("Já existe uma base neste local.");
  const custo={lenha:4,sucata:2,prego:2};
  if(!Object.entries(custo).every(([k,v])=>jogo.inv[k]>=v))return registrar("Para fundar uma base: 4 lenhas, 2 sucatas e 2 pregos.");
  for(const [k,v] of Object.entries(custo))jogo.inv[k]-=v;
  const base={id:`base-${jogo.local}-${jogo.tempo}`,nome:`${LOCAIS[jogo.local].c} fortificada`,local:jogo.local,nivel:1,defesa:1,canteiros:0,canil:0,estufa:0,fertilidade:70,ultimoCultivo:null,plantios:[],estoque:{}};
  jogo.bases.push(base);
  if(jogo.meuGrupo&&jogo.meuGrupo==="jogador")jogo.grupos.jogador.base=jogo.local;
  passarTempo(2);registrar(`Você estabeleceu a base ${base.nome}. O grupo tem um lugar para voltar.`);
}
function construir(tipo){
  const base=baseAqui();if(!base)return registrar("Você precisa estar em uma base para construir.");
  const projetos={barricada:{nome:"Barricada reforçada",custo:{lenha:2,sucata:1,prego:1},limite:4,alvo:"defesa"},canteiro:{nome:"Canteiro de cultivo",custo:{lenha:2,sucata:1},limite:4,alvo:"canteiros"},armazem:{nome:"Armazém seco",custo:{lenha:3,prego:2},limite:2,alvo:"nivel"},canil:{nome:"Canil protegido",custo:{lenha:2,sucata:1,prego:1},limite:1,alvo:"canil"},estufa:{nome:"Estufa improvisada",custo:{lenha:3,sucata:2,tecido:1},limite:1,alvo:"estufa"}};
  const p=projetos[tipo];if(!p)return;
  if(base[p.alvo]>=p.limite)return registrar(`${p.nome}: limite de construção atingido.`);
  if(!Object.entries(p.custo).every(([k,v])=>jogo.inv[k]>=v))return registrar(`Materiais insuficientes para ${p.nome.toLowerCase()}.`);
  for(const [k,v] of Object.entries(p.custo))jogo.inv[k]-=v;
  base[p.alvo]++;if(tipo==="armazem")base.estoque.capacidade=(base.estoque.capacidade||0)+10;
  passarTempo(2);ganharXP(8,"construção");registrar(`Construído: ${p.nome}.`);
}
function semear(tipo="milho"){
  const base=baseAqui();if(!base)return registrar("Só é possível plantar em um canteiro da sua base.");
  const cultura=CULTURAS[tipo];if(!cultura)return registrar("Escolha uma cultura válida.");
  if(base.plantios.length>=base.canteiros)return registrar("Construa um canteiro vazio antes de plantar.");
  if(!gasta("sementes"))return registrar("Você precisa de sementes.");
  if(!gasta("agua")){jogo.inv.sementes++;return registrar("É preciso 1 água limpa para regar o plantio.");}
  const dias=Math.max(1,cultura.dias-(base.estufa||0));
  base.plantios.push({cultura:tipo,colheitaDia:jogo.dia+dias,umidade:1,diasSeca:0});
  passarTempo(1);registrar(`${cultura.nome} plantado. Colheita prevista em ${dias} dia(s), se o solo não secar.`);
}
function retirarBase(item){
  const base=baseAqui();if(!base)return;
  const estoque=estoqueDaBase(base);if(!(estoque[item]>0))return registrar("Não há mais disso guardado nesta base.");
  if(pesoAtual()>=CAP)return registrar("Sua mochila está cheia.");
  estoque[item]--;jogo.inv[item]=(jogo.inv[item]||0)+1;passarTempo(1);
}
function processarBases(){
  for(const base of jogo.bases||[]){
    const estoque=estoqueDaBase(base);
    base.fertilidade=base.fertilidade??70;
    base.ultimoCultivo=base.ultimoCultivo||null;
    base.plantios=base.plantios.filter(p=>{
      const cultura=CULTURAS[p.cultura]||CULTURAS.milho;
      p.cultura=CULTURAS[p.cultura]?p.cultura:"milho";
      p.umidade=p.umidade??1;p.diasSeca=p.diasSeca||0;
      if(jogo.clima==="chuva")p.umidade=Math.min(2,p.umidade+1);
      else if(jogo.clima==="calor")p.umidade=Math.max(0,p.umidade-1);
      if(p.umidade===0){p.diasSeca++;if(p.diasSeca%2===0)p.colheitaDia++;}
      else p.diasSeca=0;
      if(p.colheitaDia>jogo.dia)return true;
      const mesmaFamilia=base.ultimoCultivo===cultura.familia;
      const clima=jogo.clima==="chuva"?1:jogo.clima==="calor"&&p.umidade===0?-1:0;
      const colheita=Math.max(1,cultura.rendimento+clima+(base.estufa||0)+(base.fertilidade<30?-1:0)-(mesmaFamilia?1:0));
      estoque.comida=(estoque.comida||0)+colheita;
      if(chance(cultura.familia==="leguminosa"?0.8:0.35))estoque.sementes=(estoque.sementes||0)+1;
      jogo.colheitas=(jogo.colheitas||0)+1;
      base.fertilidade=limitar(base.fertilidade+(mesmaFamilia?-12:cultura.familia==="leguminosa"?14:5));
      base.ultimoCultivo=cultura.familia;
      registrar(`${base.nome}: a colheita de ${cultura.nome.toLowerCase()} rendeu ${colheita} porções. Fertilidade do solo: ${base.fertilidade}%.`);return false;
    });
  }
}
function movimentarHordas(){
  const existentes=[...(jogo.hordas||[])];
  for(const h of existentes){
    const rotas=vizinhos(h.local);if(!rotas.length)continue;
    const destino=rotas[rnd(0,rotas.length-1)][0];h.local=destino;h.forca=Math.max(2,h.forca+rnd(-1,1));
    jogo.densidade[destino]=Math.min(10,(jogo.densidade[destino]||0)+1.5);
    registrar(`Horda de ${h.forca} infectados avança para ${LOCAIS[destino].c}.`);
    const base=jogo.bases.find(b=>b.local===destino);
    if(base){
      const defensores=Object.values(P).filter(p=>p.status==="vivo"&&p.local===destino&&p.grupo).length;
      const defesa=base.defesa*2+defensores;
      if(h.forca>defesa){
        const estoque=estoqueDaBase(base),perda=Object.keys(estoque).find(k=>k!=="capacidade"&&estoque[k]>0);
        if(perda){estoque[perda]--;registrar(`${base.nome} foi invadida. A horda levou ${NOMES[perda]||perda}.`);}
        base.defesa=Math.max(0,base.defesa-1);h.forca-=defesa;
        const vitima=membrosDe(jogo.meuGrupo||"juliana").find(p=>p.local===destino&&!p.fixo);
        if(vitima&&chance(0.2)){vitima.status="morto";vitima.grupo=null;registrar(`${vitima.nome} morreu defendendo ${base.nome}.`);}
      }else{registrar(`${base.nome} resistiu à horda.`);h.forca-=defesa;}
    }else if(destino===jogo.local&&!combate){
      registrar("A horda alcançou sua posição. Não há para onde correr!");
      iniciarCombate(Array.from({length:Math.min(7,h.forca)},()=>chance(0.18)?"brutamontes":chance(0.3)?"corredor":"zumbi"));
    }
  }
  jogo.hordas=existentes.filter(h=>h.forca>0);
  if(jogo.hordas.length<2&&chance(Math.min(0.62,0.22+jogo.dia*0.045))){
    const candidatas=Object.keys(LOCAIS).filter(k=>LOCAIS[k].perigo>=3&&(jogo.densidade[k]||0)>=2&&!jogo.hordas.some(h=>h.local===k));
    if(candidatas.length){const local=candidatas[rnd(0,candidatas.length-1)],forca=rnd(3,5)+Math.floor(jogo.dia/3);jogo.hordas.push({local,forca});registrar(`O rádio relata uma horda de ${forca} infectados perto de ${LOCAIS[local].c}.`);}
  }
}
function morrer(motivo){
  if(jogo.morto)return;
  jogo.morto=true;combate=null;evento=null;
  registrar(motivo);
  try{localStorage.removeItem(CHAVE);}catch(e){}
}
