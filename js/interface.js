/* Renderização e componentes da interface. */
/* ---------- Interface ---------- */
function barra(cls,rot,v){
  const w=Math.max(0,Math.min(100,v));
  return `<div class="rotulo"><span>${rot}</span><span>${Math.round(v)}%</span></div><div class="barra ${cls}"><i style="width:${w}%"></i></div>`;
}
function btn(a,t,arg,disabled=false){return `<button data-acao="${a}"${arg===undefined?"":` data-arg="${esc(arg)}"`}${disabled?" disabled":""}>${t}</button>`;}
function nivelConf(v){return v<0?"Desconfiança":v<10?"Neutro":v<30?"Respeitado":"Confiança total";}
function nivelMilicia(){const v=jogo.milicia;return v>=10?"aliada":v>=0?"neutra":v>=-10?"desconfiada":"hostil";}
function objetivo(){
  if(jogo.capitulo===0)return "Encontre a oficina de Tião ou explore qualquer outra região.";
  if(jogo.capitulo===1)return "Reúna peças e ganhe a confiança de Tião; a história não impede outras atividades.";
  if(jogo.capitulo===2)return "Ouça a frequência no rádio e prepare seu grupo para a próxima noite.";
  if(jogo.capitulo===3)return "Investigue a escola, a feira ou siga uma pista por conta própria.";
  if(jogo.capitulo===4)return "Explore o hospital ou a clínica; ajude quem encontrar pelo caminho.";
  if(jogo.capitulo===5)return "Investigue o Instituto ou fortaleça sua comunidade antes da evacuação.";
  if(jogo.capitulo===6)return "A partida se aproxima. Reúna quem quiser levar até a Marina.";
  return "Você deixou o Rio para trás.";
}
function htmlLesoes(){
  let h=jogo.lesoes.map(l=>{
    if(l.tipo==="mordida")return `<span class="lesao">Mordida · ${l.horas<=12?"febre e tremores":"sintomas em "+(l.horas-12)+"h"}</span>`;
    if(l.tipo==="fratura")return `<span class="lesao">Fratura · ${Math.max(0,l.horas)}h para consolidar</span>`;
    return `<span class="lesao">Disenteria · ${Math.max(0,l.horas)}h</span>`;
  }).join("");
  if(jogo.sequelaPerna)h+=`<span class="lesao">Sequela: perna fraca</span>`;
  return h||`<span class="pequeno">Sem ferimentos.</span>`;
}
function htmlMapa(){
  const linhas=ARESTAS.map(([a,b])=>{const A=LOCAIS[a],B=LOCAIS[b];return `<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}"/>`;}).join("");
  const bases=new Set((jogo.bases||[]).map(b=>b.local));
  const nos=Object.keys(LOCAIS).map(k=>{
    const L=LOCAIS[k], d=jogo.densidade[k]||0;
    const horda=(jogo.hordas||[]).find(h=>h.local===k);
    const cor=horda?"#a82727":d<2?"#2f6b3a":d<5?"#8a6d1c":"#8a2f2f";
    const cls=(k===jogo.local?" atual":"")+(bloqueio(k)?" fechado":"");
    const marca=(k===jogo.local?"● você ":"")+(bases.has(k)?"⌂ ":"");
    const pess=jogo.visitados[k]?pessoasEm(k).length+" pess.":"?";
    return `<button class="no${cls}" style="left:${L.x}%;top:${L.y}%;background:${cor}" data-nome="${esc(`${L.nome} ${L.c} ${k}`.toLowerCase())}" data-acao="ir" data-arg="${k}" title="${esc(L.nome)}${horda?` · horda ${horda.forca}`:""}">${marca}${horda?"! ":""}${L.c}<small>${pess} · risco ${Math.ceil(d)}</small></button>`;
  }).join("");
  return `<svg viewBox="0 0 100 100" preserveAspectRatio="none">${linhas}</svg>${nos}`;
}
function htmlEvento(){
  return `<p><strong>${esc(evento.t)}</strong></p><p>${esc(evento.x)}</p>${evento.o.map((o,i)=>btn("evento",o[0],i)).join("")}`;
}
function htmlIndicador(rotulo,valor,classe){
  const nivel=valor<=20?"critico":valor<=40?"alerta":"";
  const porcentagem=Math.max(0,Math.min(100,valor));
  return `<div class="indicador ${nivel}" role="meter" aria-label="${rotulo}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(valor)}"><div><span>${rotulo}</span><strong>${Math.round(valor)}%</strong></div><div class="indicador-barra"><i class="${classe}" style="width:${porcentagem}%"></i></div></div>`;
}
function htmlCombate(){
  const arma=armaAtual(), a=combate.inim[0], n=combate.inim.length;
  return `<p><strong>${n} ${a.humano?"homem(ns) armado(s)":"morto(s)-vivo(s)"} avançando!</strong></p>
    <p class="pequeno">Alvo da frente: ${Math.max(0,a.vida)} de vida · Arma: ${NOMES[arma]||"punhos"} · Munição: ${jogo.inv.municao}</p>
    ${ARMAS[arma].tipo==="fogo"?btn("c-tiro",`Atirar com ${NOMES[arma]}`):btn("c-arma",`Atacar (${arma==="punhos"?"com as mãos":NOMES[arma].toLowerCase()})`)}${ARMAS[arma].tipo!=="fogo"?btn("c-pesado","Golpe pesado (12 cansaço)"):""}${btn("c-defender","Defender")}${btn("c-esquiva","Esquivar (3 cansaço)")}${btn("c-fuga","Fugir")}`;
}
function htmlPessoas(){
  const l=pessoasEm(jogo.local);
  if(!l.length)return `<p class="pequeno">Ninguém aqui agora.</p>`;
  return l.map(p=>`<div class="linha"><strong>${p.nome}</strong> · ${p.papel} · <span class="pequeno">${etiqueta(p)} · ${nivelVinculo(p)} ${p.vinculo||0}%</span><div class="vinculo"><i style="width:${Math.min(100,p.vinculo||0)}%"></i></div>
    <div>${btn("conversar","Conversar",p.id)}${p.grupo!=="milicia"?btn("trocarPessoa","Trocar 1 munição",p.id):""}${!p.grupo&&!jogo.meuGrupo||!p.grupo&&jogo.meuGrupo==="jogador"?btn("convidar","Convidar para o grupo",p.id):""}${p.id==="juliana"&&!jogo.meuGrupo?btn("entrarJuliana","Pedir para entrar no grupo"):""}</div></div>`).join("");
}
function htmlAcoes(){
  const L=LOCAIS[jogo.local];
  let h=`<p class="pequeno">${L.desc}</p><div>`;
  if(L.saques.length)h+=btn("explorar","Vasculhar (2h)");
  h+=btn("descansar","Descansar (6h)")+`</div>`;
  const base=baseAqui();
  if(base){
    const estoque=estoqueDaBase(base),plantadas=base.plantios.length;
    h+=`<details class="secundario"><summary>Gerenciar ${esc(base.nome)} · defesa ${base.defesa}/4</summary><p class="pequeno">Canteiros: ${plantadas}/${base.canteiros} ocupados · Fertilidade ${base.fertilidade??70}% · Armazém nível ${base.nivel} · Canil ${base.canil||0} · Estufa ${base.estufa||0}</p>`;
    h+=btn("construir","Erguer barricada (2 lenha, sucata, prego)","barricada")+btn("construir","Construir canteiro (2 lenha, sucata)","canteiro")+btn("construir","Ampliar armazém (3 lenha, 2 pregos)","armazem");
    h+=btn("construir","Construir canil (2 lenha, sucata, prego)","canil")+btn("construir","Montar estufa (3 lenha, 2 sucata, tecido)","estufa");
    if(base.canteiros>plantadas)h+=Object.entries(CULTURAS).map(([id,c])=>btn("semear",`Plantar ${c.nome} · ${c.dias} dias`,id)).join("");
    if(plantadas)h+=`<p class="pequeno">Plantios: ${base.plantios.map(p=>`${CULTURAS[p.cultura]?.nome||"Milho"} · ${Math.max(0,p.colheitaDia-jogo.dia)} dia(s) · umidade ${p.umidade??1}/2`).join(" · ")}</p>`;
    const guardados=Object.keys(estoque).filter(k=>k!=="capacidade"&&estoque[k]>0);
    h+=`<p class="pequeno">Estoque da base: ${guardados.map(k=>`${NOMES[k]||k} × ${estoque[k]}`).join(" · ")||"vazio"}</p>`;
    h+=guardados.map(k=>btn("retirarBase",`Retirar 1 ${NOMES[k]||k}`,k)).join("")+`</details>`;
  }else h+=btn("fundarBase","Fundar base (4 lenha, 2 sucatas, 2 pregos)");
  const locaisPessoas=pessoasEm(jogo.local);
  h+=`<details class="secundario"><summary>Sobreviventes no local (${locaisPessoas.length})</summary>${htmlPessoas()}`;
  if(jogo.local==="abrigo")h+=`<div>${btn("tratar","Pedir tratamento a Helena")}</div>`;
  if(jogo.local==="posto"&&P.breno.status==="vivo")h+=`<div>${btn("negBreno","Negociar com Breno")}</div>`;
  if(jogo.local==="oficina")h+=`<div>${jogo.barco?`<p class="pequeno">O barco já está pronto.</p>`:btn("consertar","Consertar o barco com Tião")}</div>`;
  h+=`</details>`;
  if(jogo.local==="marina"&&jogo.barco)h+=`<div>${btn("embarcar","Embarcar na caravana")}</div>`;
  h+=`<p class="pequeno" style="margin-top:8px">Para viajar, clique em outro local no mapa. Se houver mortos-vivos no caminho, você para no meio da rota.</p>`;
  return h;
}
function htmlAnimais(){
  const animais=(jogo.animais||[]).filter(a=>!a.fugiu);
  const lotacao=(jogo.bases||[]).some(b=>b.canil>0)?3:1;
  if(!animais.length)return `<h2 style="margin-top:16px">Animais · 0/${lotacao}</h2><p class="pequeno">Nenhum animal acolhido. Você pode encontrar um cão ou gato explorando regiões residenciais. Um canil aumenta a capacidade para três.</p>`;
  return `<h2 style="margin-top:16px">Animais companheiros · ${animais.length}/${lotacao}</h2>${animais.map(a=>{
    const ativo=jogo.animalAtivo===a.id,dados=ESPECIES[a.especie];
    return `<div class="linha"><strong>${esc(a.nome)}</strong> · ${dados.nome} · ${ativo?"acompanha você":"na base"}<div class="pequeno">Fome ${a.fome}% · Vínculo ${a.vinculo}% · ${dados.beneficio}</div><div>${btn("alimentarAnimal","Alimentar (1 comida)",a.id)}${btn("cuidarAnimal","Fazer carinho",a.id)}${btn("alternarAnimal",ativo?"Deixar na base":"Levar com você",a.id)}</div></div>`;
  }).join("")}`;
}
function htmlGrupo(){
  if(!jogo.meuGrupo)return `<p class="pequeno">Você está sozinho. Converse com sobreviventes e convide os que confiam em você: quando você convida o primeiro, funda um grupo e vira o líder. Você também pode pedir para entrar no grupo da Juliana, no abrigo.</p>${htmlAnimais()}`;
  const G=jogo.grupos[jogo.meuGrupo];
  const membros=membrosDe(jogo.meuGrupo).map(p=>`<div class="linha">${p.nome} · ${p.papel} · ${nivelVinculo(p)} ${p.vinculo||0}%${p.emMissao?" · em missão":""}${p.ferido?" · ferido":""}</div>`).join("")||`<p class="pequeno">Nenhum membro além de você.</p>`;
  const est=Object.keys(G.estoque).filter(k=>G.estoque[k]>0);
  const aqui=jogo.local===G.base;
  return `<p><strong>${esc(G.nome)}</strong><br><span class="pequeno">Base: ${LOCAIS[G.base].nome} · Moral: ${Math.round(G.moral)}% · ${G.lider==="jogador"?"Você lidera":"Juliana lidera"}</span></p>
    ${membros}
    <p class="pequeno">Estoque: ${est.map(k=>`${NOMES[k]} × ${G.estoque[k]}`).join(" · ")||"vazio"}</p>
    ${aqui?btn("depositar","Guardar seus itens no estoque")+est.map(k=>btn("retirar",`Retirar 1 ${NOMES[k]}`,k)).join("")+btn("compartilharHistoria","Compartilhar uma refeição (1 comida, 2h)"):`<p class="pequeno">Vá até a base para mexer no estoque.</p>`}${htmlAnimais()}`;
}
function htmlMochila(){
  const itens=Object.keys(NOMES).filter(k=>jogo.inv[k]>0);
  if(jogo.pistola&&!itens.includes("pistola"))itens.push("pistola");
  const nomesCategoria={consumiveis:"Consumo",armas:"Armas",roupas:"Vestuário",materiais:"Materiais"};
  const categoria=k=>USAVEIS.includes(k)?"consumiveis":ARMAS[k]?"armas":ROUPAS[k]?"roupas":"materiais";
  const categorias=[["todos","Tudo"],...["consumiveis","armas","roupas","materiais"].map(k=>[k,nomesCategoria[k]])];
  const carga=pesoAtual(),porcentagem=Math.min(100,carga/CAP*100);
  let h=`<div class="inventario-resumo"><div><span class="pequeno">Carga carregada</span><strong>${carga} <span>/ ${CAP}</span></strong></div><div class="carga-barra"><i style="width:${porcentagem}%"></i></div><p class="pequeno">Arma: ${NOMES[armaAtual()]||"punhos"} · Pistola ${jogo.pistola?"disponível":"não encontrada"}</p></div>`;
  h+=`<div class="inventario-controles"><label class="busca-item">Buscar item<input id="busca-item" type="search" placeholder="Água, tecido, munição..."></label><div class="filtros-inventario" role="group" aria-label="Filtrar itens">${categorias.map(([id,nome])=>`<button type="button" data-inv-cat="${id}" aria-pressed="${id==="todos"}">${nome}${id==="todos"?` · ${itens.length}`:` · ${itens.filter(k=>categoria(k)===id).length}`}</button>`).join("")}</div></div>`;
  h+=`<div class="itens-grade">${itens.map(k=>{
    const tipo=categoria(k),arma=ARMAS[k],roupa=ROUPAS[k];
    const equipada=arma&&jogo.armaEquip===k,vestida=roupa&&jogo.roupas[roupa.slot]===k;
    const acoes=`${USAVEIS.includes(k)?btn("usar","Usar",k):""}${arma?btn("equipar",equipada?"Equipada":"Equipar",k,equipada):""}${roupa?btn("equiparRoupa",vestida?"Vestindo":"Vestir",k,vestida):""}`;
    return `<article class="item-inventario" data-categoria="${tipo}" data-busca="${esc(`${NOMES[k]} ${k}`.toLowerCase())}"><div class="item-cabecalho"><span class="item-tipo">${nomesCategoria[tipo]}</span><span class="item-quantidade">× ${k==="pistola"?1:jogo.inv[k]}</span></div><strong>${esc(NOMES[k])}</strong>${arma?`<span class="pequeno">Dano ${arma.dano[0]}–${arma.dano[1]}${arma.tipo==="fogo"?` · Ruído ${arma.ruido||3}`:" · Corpo a corpo"}</span>`:roupa?`<span class="pequeno">${esc(roupa.descricao)}</span>`:`<span class="pequeno">${USAVEIS.includes(k)?"Suprimento de sobrevivência":"Recurso para trocas e fabricação"}</span>`}<div class="item-acoes">${acoes||`<span class="pequeno">No inventário</span>`}</div></article>`;
  }).join("")||`<p class="vazio-inventario">Mochila vazia.</p>`}</div>`;
  h+=`<div class="fabricacao-cabecalho"><div><span class="pequeno">Bancada de campo</span><h2>Fabricação</h2></div><span class="pequeno">${RECEITAS.length} receitas</span></div><div class="receitas-grade">${RECEITAS.map((r,i)=>{
    const pronta=Object.entries(r.precisa).every(([k,v])=>(jogo.inv[k]||0)>=v);
    const custo=Object.entries(r.precisa).map(([k,v])=>`<span class="${(jogo.inv[k]||0)>=v?"recurso-ok":"recurso-falta"}">${NOMES[k]||k} ${jogo.inv[k]||0}/${v}</span>`).join("");
    const produto=Object.entries(r.faz).map(([k,v])=>`${NOMES[k]||k} × ${v}`).join(", ");
    return `<article class="receita"><div><strong>${esc(r.nome)}</strong><span class="pequeno">Produz: ${esc(produto)}</span><div class="receita-custos">${custo}</div></div>${btn("fabricar",pronta?"Fabricar":"Faltam itens",i,!pronta)}</article>`;
  }).join("")}</div>`;
  return h;
}
function htmlSkills(){
  return `<h2 style="margin-top:16px">Treinamento · ${jogo.pontosSkill||0} ponto(s)</h2>${Object.entries(SKILLS).map(([id,s])=>{
    const nivel=nivelSkill(id),botao=nivel>=s.max?`<button disabled>Máximo</button>`:btn("skill",`Treinar · ${nivel}/${s.max}`,id);
    return `<div class="skill-linha"><div><strong>${s.nome}</strong><div class="pequeno">${s.descricao}</div></div>${jogo.pontosSkill?botao:`<span class="pequeno">Nível ${nivel}/${s.max}</span>`}</div>`;
  }).join("")}`;
}
function htmlEquipamentos(){
  const slots=[["torso","Tronco"],["casaco","Casaco"],["botas","Calçados"]];
  return `<h2 style="margin-top:16px">Vestuário</h2><div class="equip-grade">${slots.map(([slot,titulo])=>{
    const id=jogo.roupas?.[slot],r=id&&ROUPAS[id];
    return `<div class="equip-slot"><span class="pequeno">${titulo}</span><strong>${r?NOMES[id]:"Vazio"}</strong><span class="pequeno">${r?r.descricao:"Sem bônus"}</span></div>`;
  }).join("")}</div><p class="pequeno">Proteção ${bonusRoupa("armadura")} · Furtividade ${Math.round(bonusRoupa("furtividade")*100)}% · Botas de trilha reduzem o cansaço ao viajar.</p>`;
}
function htmlEditorPersonagem(){
  const a=jogo.aparencia||{pele:"media",cabelo:"castanho"};
  const opcoes=(lista,atual)=>lista.map(([valor,texto])=>`<option value="${valor}"${atual===valor?" selected":""}>${texto}</option>`).join("");
  return `<details class="secundario"><summary>Alterar ficha e aparência</summary><div class="criacao-grade"><label>Nome<input id="editar-nome" maxlength="20" value="${esc(jogo.nome)}"></label><label>Idade<input id="editar-idade" type="number" min="16" max="80" value="${jogo.idade}"></label><label>Tom de pele<select id="editar-pele">${opcoes([["clara","Claro"],["media","Médio"],["escura","Escuro"]],a.pele)}</select></label><label>Cabelo<select id="editar-cabelo">${opcoes([["preto","Preto"],["castanho","Castanho"],["grisalho","Grisalho"],["raspado","Raspado"]],a.cabelo)}</select></label></div>${btn("editarPersonagem","Atualizar ficha")}</details>`;
}
function htmlMissoesJuliana(){
  let h="";
  if(!jogo.missoes.length)h+=`<p class="pequeno">Nenhuma missão ativa.</p>`;
  for(const m of jogo.missoes){
    const pronta=missaoPronta(m);
    h+=`<div class="cartao"><span class="rank">${m.rank}</span><strong>${esc(m.titulo)}</strong>
      <div class="pequeno">${progressoTxt(m)} · até o dia ${m.expiraDia}</div>
      ${pronta?(jogo.local==="abrigo"?btn("entregar","Entregar à Juliana",m.id):`<div class="pequeno">Pronta: entregue no abrigo.</div>`):""}</div>`;
  }
  h+=`<h2 style="margin-top:12px">Quadro de Juliana</h2>`;
  for(const m of jogo.quadro){
    const req=RANKS[m.rank];
    const extra=Object.entries(m.extra).map(([k,v])=>`${v}× ${NOMES[k]}`).join(", ");
    const botao=P.juliana.conf<req?`<button disabled>Requer confiança ${req}</button>`
      :jogo.missoes.length>=3?`<button disabled>Missões cheias (3)</button>`
      :btn("aceitar","Aceitar",m.id);
    h+=`<div class="cartao"><span class="rank">${m.rank}</span><strong>${esc(m.titulo)}</strong>
      <div class="pequeno">Prazo: ${m.prazo} dia(s) · +${m.conf} confiança${extra?` · extra: ${extra}`:""}</div>${botao}</div>`;
  }
  return h;
}
function htmlMissoesLider(){
  let h=`<p class="pequeno">Você lidera o grupo. Planeje missões, escolha quem vai e lance a equipe. Quem sai só volta quando a missão termina.</p>`;
  h+=MISSOES_LIDER.map((t,i)=>btn("criarMissao",`Planejar: ${t.t}`,i)).join("");
  for(const m of jogo.missoesLider){
    const mem=m.membros.map(id=>P[id]).filter(Boolean).map(p=>p.nome).join(", ")||"ninguém";
    h+=`<div class="cartao"><strong>${esc(m.t)}</strong> <span class="pequeno">· ${LOCAIS[m.local].nome}</span>
      <div class="pequeno">${m.estado==="plano"?"Planejamento":`Em andamento · volta em ${Math.max(0,m.retorno-jogo.tempo)}h`} · Equipe: ${esc(mem)}</div>`;
    if(m.estado==="plano"){
      h+=membrosDe("jogador").filter(p=>!p.emMissao).map(p=>btn("designar",`Enviar ${p.nome}`,m.id+"|"+p.id)).join("");
      if(m.membros.length)h+=btn("lancar",`Lançar missão (${m.membros.length})`,m.id);
    }
    h+="</div>";
  }
  return h;
}
function htmlMissoes(){
  let h=`<h2>Tarefas do mundo</h2>${htmlTarefas()}`;
  if(!jogo.meuGrupo)return `${h}<p class="pequeno">As missões de grupo aparecem quando você se juntar a uma comunidade.</p>`;
  h+=`<h2 style="margin-top:18px">Missões da comunidade</h2>`;
  return h+(jogo.meuGrupo==="juliana"?htmlMissoesJuliana():htmlMissoesLider());
}

function render(){
  const app=$("#app"),ov=$("#overlay"),salvar=$("#btn-salvar"),novo=$("#btn-novo");
  if(!jogo){app.innerHTML=telaInicial();ov.hidden=true;$("#sub").textContent="";salvar.hidden=true;novo.hidden=true;return;}
  salvar.hidden=!!(jogo.morto||jogo.venceu);novo.hidden=false;
  const noite=jogo.hora>=19||jogo.hora<6;
  document.body.dataset.luz=noite?"noite":(jogo.hora<7||jogo.hora>=17?"entardecer":"dia");
  document.body.dataset.clima=jogo.clima;
  atualizarHistoria();
  $("#sub").textContent=`Dia ${jogo.dia}/7 · ${String(jogo.hora).padStart(2,"0")}:00 · ${noite?"Noite" :"Dia"} · ${CLIMAS[jogo.clima]}`;
  const cap=CAPITULOS[Math.min(jogo.capitulo,CAPITULOS.length-1)];
  const narrativa=`<div class="capitulo">${cap.titulo}</div><div class="historia">${cap.texto}</div><div style="margin-top:8px"><strong>Trama · opcional:</strong> ${cap.objetivo}</div><div class="pequeno" style="margin-top:6px">O mundo continua aberto: explore, recrute, cultive e construa no seu ritmo.</div>`;
  const abas=[["explorar","Explorar"],["personagem","Personagem"],["grupo","Grupo"],["mochila","Mochila"],["missoes","Missões"],["diario","Diário"]];
  const tab=(id,titulo)=>`<section class="painel painel-aba ${id==="explorar"?"larga":""}" id="aba-${id}" role="tabpanel" ${abaAtiva===id?"":"hidden"}>${titulo}</section>`;
  app.innerHTML=`<div class="objetivo">${narrativa}<div class="pequeno" style="margin-top:6px">Próximo passo: ${objetivo()} · Energia ${jogo.energia?"ligada":"desligada"} · Milícia ${nivelMilicia()}</div></div>
    <section class="painel-status" aria-label="Condição do sobrevivente"><div class="status-cabecalho"><strong>${esc(jogo.nome)}</strong><span>${esc(LOCAIS[jogo.local].nome)} · Dia ${jogo.dia}, ${String(jogo.hora).padStart(2,"0")}:00</span><span>${jogo.hordas.length} horda(s)</span></div><div class="indicadores">${htmlIndicador("Vida",jogo.vida,"vida")}${htmlIndicador("Fome",jogo.fome,"fome")}${htmlIndicador("Sede",jogo.sede,"sede")}${htmlIndicador("Cansaço",jogo.cansaco,"cansaco")}${htmlIndicador("Sanidade",jogo.sanidade,"sanidade")}</div></section>
    <nav class="abas" role="tablist" aria-label="Áreas do jogo">${abas.map(([id,titulo])=>`<button role="tab" id="tab-${id}" aria-controls="aba-${id}" aria-selected="${abaAtiva===id}" data-aba="${id}">${titulo}</button>`).join("")}</nav>
    <div class="grade">
      ${tab("explorar",`<h2>Mundo · ${Object.keys(LOCAIS).length} regiões</h2><div class="explorar-grade"><div><label>Buscar região<input id="busca-local" type="search" placeholder="Hospital, sítio, metrô..."></label><div class="mapa-frame"><div class="mapa">${htmlMapa()}</div></div><label>Destino<select id="rota-local"><option value="">Escolher uma região acessível...</option>${Object.keys(LOCAIS).filter(k=>k!==jogo.local&&!bloqueio(k)&&caminhoTempo(jogo.local,k)<99).map(k=>`<option value="${k}">${LOCAIS[k].c} · ${caminhoTempo(jogo.local,k)}h${jogo.hordas.some(h=>h.local===k)?" · horda":""}</option>`).join("")}</select></label><p class="legenda">Verde: menos infectados · amarelo: perigo · vermelho: horda. ● você · ⌂ base · ! horda</p></div><div><h2>${esc(LOCAIS[jogo.local].nome)}</h2>${evento?htmlEvento():combate?htmlCombate():htmlAcoes()}</div></div>`)}
      ${tab("personagem",`<h2>Sobrevivente</h2><div class="perfil"><div class="retrato pele-${esc(jogo.aparencia?.pele||"media")} cabelo-${esc(jogo.aparencia?.cabelo||"castanho")}">${esc(jogo.nome.slice(0,1).toUpperCase())}</div><div><strong>${esc(jogo.nome)}</strong><div class="pequeno">${jogo.idade} anos · ${HABILIDADES[jogo.hab].split(":")[0]}</div><div class="pequeno">Nível ${jogo.nivel} · ${jogo.xp}/${jogo.xpProximo} XP</div><div class="xp"><i style="width:${Math.min(100,jogo.xp/jogo.xpProximo*100)}%"></i></div></div></div>${jogo.local==="abrigo"?htmlEditorPersonagem():""}<div class="pequeno">${jogo.pontosAtributo} ponto(s) para distribuir</div>${[["forca","Força · dano corpo a corpo"],["agilidade","Agilidade · precisão e fuga"],["foco","Foco · precisão com armas de fogo"]].map(([k,t])=>`<div class="atributo"><span>${t}: ${jogo.atributos[k]}</span>${jogo.pontosAtributo?btn("atributo",`+ ${k}`,k):""}</div>`).join("")}${htmlSkills()}${htmlEquipamentos()}<h2 style="margin-top:16px">Condição</h2>${barra("vida","Vida",jogo.vida)}${barra("fome","Fome",jogo.fome)}${barra("sede","Sede",jogo.sede)}${barra("cansaco","Cansaço",jogo.cansaco)}${barra("sanidade","Sanidade",jogo.sanidade)}<div>${htmlLesoes()}</div>`)}
      ${tab("grupo",`<h2>Grupo e sobreviventes</h2>${htmlGrupo()}`)}
      ${tab("mochila",`<h2>Mochila e equipamentos</h2>${htmlMochila()}`)}
      ${tab("missoes",`<h2>Missões e histórias</h2>${htmlMissoes()}`)}
      ${tab("diario",`<h2>Diário e acontecimentos</h2><div class="log">${jogo.log.map(l=>`<p>${esc(l)}</p>`).join("")}</div>`)}
    </div>`;
  if(confirmandoNovoJogo){
    ov.hidden=false;
    ov.innerHTML=`<div class="painel confirmacao-novo" role="dialog" aria-modal="true" aria-labelledby="titulo-novo-jogo"><h2 id="titulo-novo-jogo">Começar outro jogo?</h2>
      <p>A partida atual será encerrada. O salvamento existente só será substituído quando você iniciar outro sobrevivente.</p>
      <div>${btn("cancelarNovo","Continuar jogando")}${btn("confirmarNovo","Voltar à tela inicial")}</div></div>`;
  }else if(jogo.venceu){
    ov.hidden=false;
    ov.innerHTML=`<div class="painel"><h2>Você escapou</h2>
      <p>${esc(jogo.nome)} saiu do Rio no dia ${jogo.dia}.</p>
      <p class="pequeno">Mortos-vivos eliminados: ${jogo.zumbisMortos} · Missões concluídas: ${jogo.missoesConcluidas}</p>
      ${btn("novo","Começar outro sobrevivente")}</div>`;
  }else if(jogo.morto){
    ov.hidden=false;
    ov.innerHTML=`<div class="painel"><h2>Fim de jogo</h2>
      <p>${esc(jogo.nome)} sobreviveu ${jogo.dia} dia(s).</p>
      <p class="pequeno">Mortos-vivos eliminados: ${jogo.zumbisMortos} · Missões concluídas: ${jogo.missoesConcluidas}</p>
      ${btn("novo","Começar outro sobrevivente")}</div>`;
  }else ov.hidden=true;
}
