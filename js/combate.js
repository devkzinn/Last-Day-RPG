/* Combate. */
/* ---------- Combate ---------- */
function iniciarCombate(lista){
  combate={inim:lista.map(k=>({...INIMIGOS[k]}))};
  const a=combate.inim[0];
  registrar(`${combate.inim.length} ${a.humano?"homem(ns) armado(s)":"morto(s)-vivo(s)"} atacando! Decida rápido.`);
}
function turnoCombate(t){
  if(!combate)return;
  const c=combate, arma=armaAtual(), configArma=ARMAS[arma], alvo=c.inim[0];
  let defendendo=t==="defender";
  if(t==="fuga"){
    const p=0.5+(jogo.hab==="atleta"?0.2:0)+jogo.atributos.agilidade*0.03-(jogo.sequelaPerna?0.15:0)-(jogo.cansaco<30?0.1:0);
    if(chance(p)){combate=null;registrar("Você escapou, ofegante.");passarTempo(1);return;}
    registrar("A fuga falhou!");
  }else if(t==="tiro"){
    if(configArma.tipo!=="fogo")return registrar("Equipe uma arma de fogo primeiro.");
    const custo=configArma.custo||1;
    if(jogo.inv.municao<custo)return registrar("Sem munição suficiente!");
    jogo.inv.municao-=custo;jogo.ruido+=configArma.ruido||3;
    if(chance(precisao((jogo.hab==="atirador"?0.82:0.67)+jogo.atributos.foco*0.025+nivelSkill("tiro")*0.04))){alvo.vida-=rnd(...configArma.dano);registrar(`Disparo certeiro com ${NOMES[arma].toLowerCase()} em ${alvo.nome.toLowerCase()}.`);}
    else registrar("O tiro passou longe.");
  }else if(t==="pesado"){
    if(jogo.cansaco<12)return registrar("Você está exausto demais para um golpe pesado.");
    jogo.cansaco-=12;
    if(chance(precisao(0.66+jogo.atributos.forca*0.02+nivelSkill("combate")*0.035))){alvo.vida-=rnd(...configArma.dano)+Math.ceil(jogo.atributos.forca*1.5)+nivelSkill("combate");registrar(`Golpe pesado de ${NOMES[arma]||"punhos"} acertou em cheio!`);}
    else registrar("O golpe pesado passou longe.");
  }else if(defendendo){registrar("Você se protegeu e espera o momento de reagir.");
  }else{
    if(configArma.tipo==="fogo")return registrar("Essa arma precisa ser usada com o comando Atirar.");
    if(chance(precisao(0.78+jogo.atributos.agilidade*0.02+nivelSkill("combate")*0.035))){
      alvo.vida-=rnd(...ARMAS[arma].dano)+Math.floor(jogo.atributos.forca/2)+nivelSkill("combate");
      registrar(`Você golpeou com ${arma==="punhos"?"as mãos":NOMES[arma].toLowerCase()}.`);
      if(arma!=="punhos"&&chance(arma==="facao"?0.05:0.08)){jogo.inv[arma]--;registrar("Sua arma quebrou.");}
    }else registrar("Você errou o golpe.");
  }
  const caidos=c.inim.filter(z=>z.vida<=0);
  if(caidos.length){
    c.inim=c.inim.filter(z=>z.vida>0);
    for(const z of caidos)if(!z.humano){jogo.zumbisMortos++;progredirEliminar();ganharXP(z.nome==="Brutamontes"?35:18,"inimigo eliminado");jogo.densidade[jogo.local]=Math.max(0,(jogo.densidade[jogo.local]||0)-0.3);}
    registrar(`${caidos.length} inimigo(s) caíram.`);
  }
  if(!c.inim.length){combate=null;registrar("A área está limpa por enquanto.");passarTempo(1);return;}
  for(const z of c.inim){
    if(chance(0.7)){
      const protecao=Math.floor(bonusRoupa("armadura"));
      const dano=Math.max(1,rnd(z.dano[0],z.dano[1])-protecao-(defendendo?Math.ceil(8+jogo.atributos.forca):0));
      jogo.vida=limitar(jogo.vida-dano);
      registrar(`${z.nome} te acertou (-${dano} de vida).`);
      if(dano>=6&&!temLesao("fratura")&&chance(0.25)){jogo.lesoes.push({tipo:"fratura",horas:48});registrar("Você sentiu algo quebrar na perna.");}
      if(z.mordida&&chance(z.mordida)&&!temLesao("mordida")){jogo.lesoes.push({tipo:"mordida",horas:36});registrar("Você foi MORDIDO! Sem o soro, a infecção é certa.");}
    }else registrar(`${z.nome} errou o ataque.`);
    if(jogo.vida<=0){morrer("Você caiu no meio da briga.");return;}
  }
  jogo.cansaco=limitar(jogo.cansaco-(defendendo?2:5));
}
