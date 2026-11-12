/* Tarefas e missões. */
/* ---------- Missões ---------- */
function missaoPronta(m){return m.tipo==="eliminar"?m.progresso>=m.qtd:(jogo.inv[m.item]||0)>=m.qtd;}
function progressoTxt(m){
  return m.tipo==="eliminar"?`${m.progresso}/${m.qtd} mortos-vivos`:`${Math.min(jogo.inv[m.item]||0,m.qtd)}/${m.qtd} ${NOMES[m.item].toLowerCase()}`;
}
function progredirEliminar(){for(const m of jogo.missoes)if(m.tipo==="eliminar"&&m.progresso<m.qtd)m.progresso++;}
function progressoTarefa(t){
  if(t.tipo==="locais")return Object.keys(jogo.visitados).filter(k=>jogo.visitados[k]).length;
  if(t.tipo==="saques")return jogo.exploracoes||0;
  if(t.tipo==="infectados")return jogo.zumbisMortos||0;
  if(t.tipo==="recrutas")return jogo.meuGrupo?Object.values(P).filter(p=>p.status==="vivo"&&p.grupo===jogo.meuGrupo&&p.id.startsWith("resgatado-")).length:0;
  if(t.tipo==="bases")return Math.max(0,(jogo.bases||[]).length-1);
  if(t.tipo==="colheitas")return jogo.colheitas||0;
  if(t.tipo==="barricadas")return (jogo.bases||[]).reduce((n,b)=>n+Math.max(0,b.defesa-1),0);
  if(t.tipo==="local-chave")return jogo.visitados.hospital||jogo.visitados.lab?1:0;
  return 0;
}
function tarefaPronta(t){return progressoTarefa(t)>=t.meta;}
function aceitarTarefa(id){
  jogo.tarefasAtivas=jogo.tarefasAtivas||[];jogo.tarefasFeitas=jogo.tarefasFeitas||[];
  if(jogo.tarefasAtivas.length>=3)return registrar("Você já tem três tarefas em andamento.");
  if(jogo.tarefasFeitas.includes(id)||jogo.tarefasAtivas.some(t=>t.id===id))return;
  const tarefa=TAREFAS_ABERTAS.find(t=>t.id===id);if(!tarefa)return;
  jogo.tarefasAtivas.push({id});registrar(`Tarefa aceita: ${tarefa.titulo}.`);
}
function entregarTarefa(id){
  const tarefa=TAREFAS_ABERTAS.find(t=>t.id===id),ativas=jogo.tarefasAtivas||[];
  if(!tarefa||!ativas.some(t=>t.id===id)||!tarefaPronta(tarefa))return;
  jogo.tarefasAtivas=ativas.filter(t=>t.id!==id);jogo.tarefasFeitas=jogo.tarefasFeitas||[];jogo.tarefasFeitas.push(id);
  jogo.inv[tarefa.recompensa.item]=(jogo.inv[tarefa.recompensa.item]||0)+tarefa.recompensa.qtd;
  ganharXP(tarefa.xp,"tarefa concluída");registrar(`Concluída: ${tarefa.titulo}. Recompensa: ${tarefa.recompensa.qtd}× ${NOMES[tarefa.recompensa.item]}.`);
}
function htmlTarefas(){
  const ativas=jogo.tarefasAtivas||[],feitas=jogo.tarefasFeitas||[];
  let h=`<p class="pequeno">Contratos opcionais do mundo · ${ativas.length}/3 em andamento · ${feitas.length} concluídas</p>`;
  for(const t of TAREFAS_ABERTAS){
    const ativa=ativas.some(a=>a.id===t.id),feita=feitas.includes(t.id),progresso=Math.min(t.meta,progressoTarefa(t));
    const controle=feita?`<span class="pequeno">Concluída</span>`:ativa?(tarefaPronta(t)?btn("entregarTarefa","Resgatar recompensa",t.id):`<span class="pequeno">${progresso}/${t.meta}</span>`):ativas.length>=3?`<button disabled>Limite de tarefas</button>`:btn("aceitarTarefa","Aceitar tarefa",t.id);
    h+=`<div class="cartao"><strong>${esc(t.titulo)}</strong><div class="pequeno">${esc(t.texto)} · ${progresso}/${t.meta} · recompensa: ${t.xp} XP + ${t.recompensa.qtd}× ${NOMES[t.recompensa.item]}</div>${controle}</div>`;
  }
  return h;
}
function aceitarMissao(id){
  if(jogo.meuGrupo!=="juliana")return registrar("Você precisa estar no grupo da Juliana para aceitar missões.");
  const m=jogo.quadro.find(x=>x.id===id); if(!m)return;
  if(P.juliana.conf<RANKS[m.rank])return registrar(`Juliana não confia em você para a missão ${m.rank} ainda.`);
  if(jogo.missoes.length>=3)return registrar("Você já tem 3 missões ativas.");
  jogo.quadro=jogo.quadro.filter(x=>x.id!==id);
  jogo.missoes.push({...m,progresso:0,expiraDia:jogo.dia+m.prazo});
  registrar(`Missão aceita: ${m.titulo}.`);
}
function entregarMissao(id){
  const m=jogo.missoes.find(x=>x.id===id); if(!m)return;
  if(jogo.local!=="abrigo")return registrar("Entregue as missões no abrigo.");
  if(!missaoPronta(m))return registrar("Ainda não cumpriu os requisitos desta missão.");
  if(m.tipo==="coletar")jogo.inv[m.item]-=m.qtd;
  P.juliana.conf=limitar(P.juliana.conf+m.conf,-100);
  for(const [k,v] of Object.entries(m.extra))jogo.inv[k]=(jogo.inv[k]||0)+v;
  jogo.missoes=jogo.missoes.filter(x=>x!==m);
  jogo.missoesConcluidas++;
  registrar(`Missão ${m.rank} concluída. Juliana confia mais em você.`);
  ganharXP(25+RANKS[m.rank],"missão concluída");
}
function criarMissao(i){
  const T=MISSOES_LIDER[i];
  if(jogo.meuGrupo!=="jogador")return;
  if(jogo.missoesLider.length>=3)return registrar("Seu grupo já tem 3 missões planejadas ou em andamento.");
  const bl=bloqueio(T.local); if(bl)return registrar(bl);
  jogo.missoesLider.push({id:"L"+jogo.tempo+"-"+i,...T,membros:[],estado:"plano",retorno:0,duracao:0});
  registrar(`Você planejou: ${T.t}.`);
}
function designar(arg){
  const [mid,pid]=arg.split("|");
  const m=jogo.missoesLider.find(x=>x.id===mid), p=P[pid];
  if(!m||!p||m.estado!=="plano")return;
  if(p.emMissao)return registrar(`${p.nome} já está em outra missão.`);
  if(m.membros.length>=4)return registrar("A equipe já está completa (4 pessoas).");
  m.membros.push(pid); p.emMissao=m.id;
  registrar(`${p.nome} foi designado(a) para: ${m.t}.`);
}
function lancar(mid){
  const m=jogo.missoesLider.find(x=>x.id===mid); if(!m||m.estado!=="plano")return;
  if(!m.membros.length)return registrar("Escolha pelo menos uma pessoa para a equipe.");
  const base=jogo.grupos.jogador.base, ida=caminhoTempo(base,m.local);
  if(ida>=99)return registrar("Não há caminho seguro até lá.");
  m.duracao=ida*2+2; m.retorno=jogo.tempo+m.duracao; m.estado="andamento";
  registrar(`Equipe saiu para: ${m.t}. Volta prevista em ${m.duracao}h.`);
}
function resolverMissoesLider(){
  for(const m of [...jogo.missoesLider])if(m.estado==="andamento"&&jogo.tempo>=m.retorno)resolverMissao(m);
}
function resolverMissao(m){
  const G=jogo.grupos.jogador, L=LOCAIS[m.local];
  const membros=m.membros.map(id=>P[id]).filter(p=>p&&p.status==="vivo");
  const lutadores=membros.filter(p=>p.hab==="lutador").length;
  const vinculoMedio=membros.length?membros.reduce((total,p)=>total+(p.vinculo||0),0)/membros.length:0;
  const pSucesso=limitar(50+8*Math.min(3,membros.length)+12*Math.min(2,lutadores)+Math.min(8,vinculoMedio*0.1)-L.perigo*3.5,10,90)/100;
  const ok=chance(pSucesso);
  if(m.tipo==="saque"){
    if(ok){
      for(let i=rnd(2,3);i>0;i--){const it=selecionarSaque(m.local);if(!it)break;const q=quantidadeItem(it)||1;G.estoque[it]=(G.estoque[it]||0)+q;}
      registrar(`${m.t}: o grupo voltou com suprimentos.`);
    }else registrar(`${m.t}: deu errado e voltaram de mãos vazias.`);
  }else if(m.tipo==="patrulha"){
    if(ok){jogo.densidade[m.local]=Math.max(0,(jogo.densidade[m.local]||0)-2);registrar(`${m.t}: o grupo abateu vários mortos-vivos.`);}
    else registrar(`${m.t}: foram cercados e tiveram que recuar.`);
  }else{
    const solo=Object.values(P).filter(p=>p.status==="vivo"&&!p.grupo&&!p.fixo&&p.local===m.local);
    if(ok&&solo.length){const p=solo[0];p.grupo="jogador";p.local=G.base;registrar(`${p.nome} aceitou se juntar ao seu grupo.`);}
    else registrar(`${m.t}: ninguém quis se juntar desta vez.`);
  }
  if(ok)membros.forEach(p=>fortalecerVinculo(p,4));
  if(membros.length&&(!ok||chance(0.15))){
    const v=membros[rnd(0,membros.length-1)];
    if(!ok&&chance(0.35)){v.status="morto";registrar(`${v.nome} não voltou.`);}
    else{v.ferido=true;registrar(`${v.nome} voltou ferido.`);}
  }
  for(const p of membros){p.emMissao=null;p.local=G.base;}
  jogo.missoesLider=jogo.missoesLider.filter(x=>x!==m);
  if(ok)jogo.missoesConcluidas++;
}
