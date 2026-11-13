/* Ações e inicialização. */
function acao(a,arg){
  if(!jogo){
    if(a==="comecar")iniciar();
    else if(a==="continuar")carregar();
    else return;
    return render();
  }
  if(a==="cancelarNovo"){confirmandoNovoJogo=false;return render();}
  if(a==="confirmarNovo"){
    confirmandoNovoJogo=false;jogo=null;P={};combate=null;evento=null;abaAtiva="explorar";
    return render();
  }
  if((jogo.morto||jogo.venceu)&&!["novo","confirmarNovo","cancelarNovo"].includes(a))return;
  if(combate&&!a.startsWith("c-")&&!["salvar","novo","confirmarNovo","cancelarNovo"].includes(a))return;
  if(evento&&!["evento","salvar","novo","confirmarNovo","cancelarNovo"].includes(a))return;
  switch(a){
    case "ir": viajarPara(arg); break;
    case "explorar": explorar(); break;
    case "descansar": descansar(); break;
    case "usar": usar(arg); break;
    case "fabricar": fabricar(+arg); break;
    case "fundarBase": fundarBase(); break;
    case "construir": construir(arg); break;
    case "semear": semear(arg); break;
    case "retirarBase": retirarBase(arg); break;
    case "conversar": conversar(arg); break;
    case "trocarPessoa": trocarPessoa(arg); break;
    case "convidar": convidar(arg); break;
    case "entrarJuliana": entrarJuliana(); break;
    case "depositar": depositar(); break;
    case "retirar": retirar(arg); break;
    case "compartilharHistoria": compartilharHistoria(); break;
    case "alimentarAnimal": alimentarAnimal(arg); break;
    case "cuidarAnimal": cuidarAnimal(arg); break;
    case "alternarAnimal": alternarAnimal(arg); break;
    case "tratar": tratar(); break;
    case "negBreno": trocarBreno(); break;
    case "consertar": consertarBarco(); break;
    case "embarcar": embarcar(); break;
    case "aceitar": aceitarMissao(arg); break;
    case "entregar": entregarMissao(arg); break;
    case "aceitarTarefa": aceitarTarefa(arg); break;
    case "entregarTarefa": entregarTarefa(arg); break;
    case "criarMissao": criarMissao(+arg); break;
    case "designar": designar(arg); break;
    case "lancar": lancar(arg); break;
    case "evento": resolverEvento(+arg); break;
    case "c-arma": turnoCombate("arma"); break;
    case "c-tiro": turnoCombate("tiro"); break;
    case "c-pesado": turnoCombate("pesado"); break;
    case "c-defender": turnoCombate("defender"); break;
    case "c-esquiva": turnoCombate("esquiva"); break;
    case "c-fuga": turnoCombate("fuga"); break;
    case "equipar": if(ARMAS[arg]&&possuiArma(arg)){jogo.armaEquip=arg;registrar(`${NOMES[arg]} equipada.`);} break;
    case "equiparRoupa": equiparRoupa(arg); break;
    case "atributo": evoluirAtributo(arg); break;
    case "skill": aprenderSkill(arg); break;
    case "editarPersonagem": editarPersonagem(); break;
    case "salvar": salvarJogo(true); break;
    case "novo": confirmandoNovoJogo=true; return render();
  }
  if(jogo&&!jogo.morto&&!jogo.venceu&&a!=="salvar")salvarJogo(false);
  render();
}
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-acao]");
  if(b&&!b.disabled)acao(b.dataset.acao,b.dataset.arg);
});
document.addEventListener("input",e=>{
  if(e.target.id==="busca-item"){filtrarInventario();return;}
  if(e.target.id==="busca-local"){
    const q=e.target.value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    document.querySelectorAll(".no").forEach(n=>{n.hidden=!n.dataset.nome.normalize("NFD").replace(/[\u0300-\u036f]/g,"").includes(q);});
  }
});
function filtrarInventario(){
  const campo=$("#busca-item"),selecionado=document.querySelector("[data-inv-cat][aria-pressed='true']");
  if(!campo)return;
  const q=campo.value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  const categoria=selecionado?.dataset.invCat||"todos";
  document.querySelectorAll(".item-inventario").forEach(item=>{
    const nome=item.dataset.busca.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    item.hidden=(categoria!=="todos"&&item.dataset.categoria!==categoria)||!nome.includes(q);
  });
}
document.addEventListener("click",e=>{
  const filtro=e.target.closest("[data-inv-cat]");
  if(!filtro)return;
  document.querySelectorAll("[data-inv-cat]").forEach(b=>b.setAttribute("aria-pressed",b===filtro?"true":"false"));
  filtrarInventario();
});
document.addEventListener("change",e=>{
  if(e.target.id==="rota-local"&&e.target.value)acao("ir",e.target.value);
});
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-aba]");
  if(b){abaAtiva=b.dataset.aba;render();}
});
render();
