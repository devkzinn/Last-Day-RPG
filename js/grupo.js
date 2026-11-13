/* Sobreviventes e grupos. */
/* ---------- Pessoas e grupos ---------- */
function etiqueta(p){
  const base=p.grupo==="juliana"?"grupo da Juliana":p.grupo==="jogador"?"seu grupo":p.grupo==="milicia"?"milícia":"sozinho(a)";
  return base+(p.ferido?", ferido(a)":"");
}
function nivelVinculo(p){
  const v=p.vinculo||0;
  return v>=80?"Laço profundo":v>=50?"Amigo(a)":v>=20?"Parceiro(a)":"Conhecido(a)";
}
function fortalecerVinculo(p,q){
  if(!p||p.status!=="vivo")return;
  const antes=p.vinculo||0;
  p.vinculo=limitar(antes+q,0,100);p.marcosVinculo=p.marcosVinculo||[];
  for(const [limite,nome] of [[20,"parceria"],[50,"amizade"],[80,"laço profundo"]]){
    if(antes<limite&&p.vinculo>=limite&&!p.marcosVinculo.includes(limite)){
      p.marcosVinculo.push(limite);p.conf=limitar(p.conf+3,-100);
      registrar(`${p.nome}: o vínculo de vocês chegou a ${nome}.`);
      if(limite===50&&p.grupo&&jogo.grupos[p.grupo])jogo.grupos[p.grupo].moral=limitar(jogo.grupos[p.grupo].moral+5);
    }
  }
}
function podeAcolherAnimal(){
  const lotacao=(jogo.bases||[]).some(b=>b.canil>0)?3:1;
  return (jogo.animais||[]).filter(a=>!a.fugiu).length<lotacao;
}
function resgatarAnimal(especie){
  const dados=ESPECIES[especie];if(!dados)return "Você não conseguiu identificar o animal.";
  jogo.animais=jogo.animais||[];
  if(jogo.animais.some(a=>a.especie===especie&&!a.fugiu))return `Você já acolheu um ${dados.nome.toLowerCase()}.`;
  if(!podeAcolherAnimal())return "Não há espaço seguro para mais animais. Construa um canil em uma base.";
  const animal={id:`animal-${especie}-${jogo.dia}-${jogo.tempo}`,especie,nome:dados.nomeAnimal,fome:100,vinculo:10,base:jogo.meuGrupo?jogo.grupos[jogo.meuGrupo].base:"abrigo",fugiu:false};
  jogo.animais.push(animal);
  if(!jogo.animalAtivo)jogo.animalAtivo=animal.id;
  registrar(`${animal.nome} foi acolhido. Vai precisar de comida, água e cuidado.`);
  return `${animal.nome} confiou em você e agora faz parte do grupo.`;
}
function animalPorId(id){return (jogo.animais||[]).find(a=>a.id===id&&!a.fugiu);}
function alimentarAnimal(id){
  const animal=animalPorId(id);if(!animal)return;
  if(!gasta("comida"))return registrar("Você não tem comida para alimentar o animal.");
  animal.fome=limitar(animal.fome+55);animal.vinculo=limitar(animal.vinculo+5);
  passarTempo(1);registrar(`${animal.nome} comeu e parece mais tranquilo.`);
}
function cuidarAnimal(id){
  const animal=animalPorId(id);if(!animal)return;
  if(jogo.animalAtivo!==id&&jogo.local!==animal.base)return registrar(`${animal.nome} está na base. Volte para cuidar dele(a).`);
  animal.vinculo=limitar(animal.vinculo+8);passarTempo(1);
  registrar(`${animal.nome} se aproxima sem medo. Vínculo: ${animal.vinculo}%.`);
}
function alternarAnimal(id){
  const animal=animalPorId(id);if(!animal)return;
  if(jogo.animalAtivo===id){animal.base=jogo.local;jogo.animalAtivo=null;registrar(`${animal.nome} ficará em ${LOCAIS[jogo.local].c}.`);}
  else{if(jogo.animalAtivo){const anterior=animalPorId(jogo.animalAtivo);if(anterior)anterior.base=jogo.local;}jogo.animalAtivo=id;registrar(`${animal.nome} vai acompanhar você.`);}
}
function processarAnimais(){
  for(const animal of jogo.animais||[]){
    if(animal.fugiu)continue;
    animal.fome=Math.max(0,(animal.fome??100)-30);
    if(animal.fome===0){animal.vinculo=Math.max(0,animal.vinculo-8);registrar(`${animal.nome} está com fome. Alimente-o para não perder a confiança.`);}
    else if(animal.fome<35)registrar(`${animal.nome} precisa comer em breve.`);
    if(animal.fome===0&&animal.vinculo<15&&chance(0.2)){animal.fugiu=true;if(jogo.animalAtivo===animal.id)jogo.animalAtivo=null;registrar(`${animal.nome} fugiu para procurar comida.`);}
  }
}
function bonusAnimal(tipo){
  const animal=animalPorId(jogo.animalAtivo);
  if(!animal||animal.fome<20)return 0;
  if(animal.especie==="cao"&&tipo==="furtividade")return animal.vinculo>=50?0.12:0.06;
  if(animal.especie==="cao"&&tipo==="catador")return animal.vinculo>=50?0.18:0.08;
  if(animal.especie==="gato"&&tipo==="sanidade")return animal.vinculo>=50?2:1;
  return 0;
}
function compartilharHistoria(){
  const grupo=jogo.meuGrupo&&jogo.grupos[jogo.meuGrupo];
  if(!grupo||jogo.local!==grupo.base)return registrar("Reúna o grupo na base para compartilhar uma refeição.");
  if(!gasta("comida"))return registrar("Falta comida para preparar uma refeição comunitária.");
  passarTempo(2);
  const presentes=membrosDe(jogo.meuGrupo).filter(p=>!p.emMissao);
  presentes.forEach(p=>fortalecerVinculo(p,6));
  grupo.moral=limitar(grupo.moral+5);
  registrar("A refeição termina com histórias e planos. A moral do grupo melhora.");
}
function conversar(id){
  const p=P[id]; if(!p||p.status!=="vivo")return;
  if(p.local!==jogo.local)return registrar(`${p.nome} não está aqui.`);
  if(p.ultConv===jogo.dia)return registrar(`${p.nome} não tem mais tempo para conversar hoje.`);
  p.ultConv=jogo.dia; p.conf=limitar(p.conf+2,-100);fortalecerVinculo(p,8);
  passarTempo(1); if(jogo.morto)return;
  const f=FALAS[id];
  registrar(f?f[rnd(0,f.length-1)]:`${p.nome}: ${FALAS_GERAIS[rnd(0,FALAS_GERAIS.length-1)]}`);
}
function trocarPessoa(id){
  const p=P[id];
  if(!p||p.local!==jogo.local)return registrar("Essa pessoa não está aqui.");
  if(p.grupo==="milicia")return registrar(`${p.nome} nem olha para você.`);
  if(!gasta("municao"))return registrar("Você não tem munição para trocar.");
  const it=chance(0.5)?"comida":"agua";
  jogo.inv[it]++; p.conf=limitar(p.conf+1,-100);fortalecerVinculo(p,3);passarTempo(1);
  registrar(`${p.nome} trocou com você: 1 munição por 1 ${NOMES[it].toLowerCase()}.`);
}
function convidar(id){
  const p=P[id];
  if(!p||p.grupo||p.status!=="vivo")return;
  if(p.conf<8)return registrar(`${p.nome} ainda desconfia de você.`);
  if(jogo.meuGrupo==="juliana")return registrar("Você faz parte do grupo da Juliana. Ela decide quem entra.");
  if(!jogo.meuGrupo){
    jogo.grupos.jogador={nome:`Grupo de ${jogo.nome}`,base:jogo.local,lider:"jogador",moral:60,estoque:{}};
    jogo.meuGrupo="jogador";
    registrar(`Você funda o seu grupo na ${LOCAIS[jogo.local].nome}. Agora você lidera.`);
  }
  p.grupo="jogador"; p.local=jogo.grupos.jogador.base; p.emMissao=null;fortalecerVinculo(p,5);
  passarTempo(1); registrar(`${p.nome} aceitou se juntar ao grupo.`);
}
function entrarJuliana(){
  if(jogo.local!=="abrigo")return registrar("O grupo da Juliana fica no abrigo.");
  if(jogo.meuGrupo)return registrar("Você já faz parte de um grupo.");
  if(P.juliana.conf<10)return registrar("Juliana: \"Ainda não te conheço o bastante.\"");
  jogo.meuGrupo="juliana"; passarTempo(1);
  registrar("Juliana: \"Você fica. Cumpra as missões e não nos decepcione.\"");
}
function depositar(){
  const G=jogo.grupos[jogo.meuGrupo]; if(!G)return;
  if(jogo.local!==G.base)return registrar("Você precisa estar na base do grupo.");
  let n=0;
  for(const k of Object.keys(jogo.inv)){
    if(["faca","machado","cano","lanca","pistola"].includes(k)||!(jogo.inv[k]>0))continue;
    G.estoque[k]=(G.estoque[k]||0)+jogo.inv[k];n+=jogo.inv[k];jogo.inv[k]=0;
  }
  passarTempo(1); registrar(`Você guardou ${n} itens no estoque do grupo.`);
}
function retirar(k){
  const G=jogo.grupos[jogo.meuGrupo]; if(!G)return;
  if(jogo.local!==G.base)return registrar("Você precisa estar na base do grupo.");
  if(!(G.estoque[k]>0))return registrar("Não há mais disso no estoque.");
  G.estoque[k]--;
  if(k==="pistola"){
    if(!jogo.pistola){
      jogo.pistola=true;
      const municao=Math.min(3,Math.max(0,CAP-pesoAtual()-1));
      jogo.inv.municao+=municao;
      registrar(`Você equipou uma pistola retirada do estoque${municao?` e recebeu ${municao}× munição`:""}.`);
    }
    else jogo.inv.municao++;
  }else jogo.inv[k]=(jogo.inv[k]||0)+1;
  passarTempo(1);
}
function tratar(){
  if(jogo.local!=="abrigo")return registrar("Helena só atende no abrigo.");
  const mord=temLesao("mordida"), frat=temLesao("fratura");
  if(!mord&&!frat)return registrar("Helena: você não precisa de tratamento agora.");
  const gratis=P.helena.conf>=5;
  if(frat&&!gratis&&jogo.inv.kit<=0)return registrar("Helena: sem confiança e sem kit médico, não posso imobilizar sua perna.");
  if(mord){
    if(jogo.inv.soro>0){registrar("Helena aplica o soro experimental.");usar("soro");}
    else registrar("Helena: a mordida só responde ao soro experimental. Sem ele, não posso fazer nada.");
  }
  if(frat){if(!gratis)jogo.inv.kit--;removerLesao("fratura");registrar("Helena imobilizou sua perna. Sem sequelas.");}
  P.helena.conf=limitar(P.helena.conf+2,-100);
  passarTempo(2);
}
function trocarBreno(){
  const b=P.breno;
  if(b.status!=="vivo")return registrar("Breno não está mais no posto.");
  if(jogo.local!=="posto")return registrar("Breno só negocia no posto.");
  if(b.conf<-20)return registrar("Breno: \"Some daqui antes que eu mude de ideia.\"");
  const caro=b.conf<0,custo=caro?8:5;
  if(jogo.inv.municao<custo)return registrar(`Breno: "Sem ${custo} munições, sem negócio."`);
  jogo.inv.municao-=custo; jogo.inv.comida+=caro?1:2; if(!caro)jogo.inv.agua+=1;
  b.conf=limitar(b.conf+3,-100); passarTempo(1);
  registrar(`Troca feita: ${custo} munições por ${caro?"1 lata de comida":"2 latas de comida e 1 água"}.`);
}
function consertarBarco(){
  if(jogo.local!=="oficina")return registrar("Tião só mexe no barco na oficina.");
  if(jogo.barco)return registrar("O barco já está pronto.");
  if(P.tiao.conf<10)return registrar("Tião: \"Ainda não confio em você o bastante para mexer no meu barco.\"");
  if(jogo.inv.bateria<1||jogo.inv.combustivel<4)return registrar("Tião: \"Preciso de 1 bateria e 4 de combustível. Sem isso, nada feito.\"");
  jogo.inv.bateria--;jogo.inv.combustivel-=4;jogo.barco=true;
  passarTempo(3); registrar("Tião colocou o motor de pé. O barco está pronto para a Marina.");
  atualizarHistoria();ganharXP(35,"barco consertado");
}
function embarcar(){
  if(jogo.local!=="marina")return registrar("Você precisa estar na Marina para embarcar.");
  const b=bloqueio("marina"); if(b)return registrar(b);
  jogo.venceu=true;combate=null;
  avancarHistoria(7);
  registrar("A caravana sai da Baía. Você olha para trás e vê a cidade pela última vez.");
  try{localStorage.removeItem(CHAVE);}catch(e){}
}
