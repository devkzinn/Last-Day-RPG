/* Menu, início e salvamento. */
function telaInicial(){
  let temSave=false;
  try{temSave=!!localStorage.getItem(CHAVE);}catch(e){}
  const opcoes=Object.entries(HABILIDADES).map(([k,v])=>`<option value="${k}">${v}</option>`).join("");
  return `<section class="painel" style="max-width:540px;margin:24px auto;border-top:2px solid var(--perigo)">
    <h2>Arquivo de sobrevivente · Rio de Janeiro</h2>
    <p class="historia">O rádio parou. As ruas não. Sete dias até a última embarcação deixar a Baía. Quem você era antes pode ser a única coisa que ainda resta.</p>
    <label>Nome<input id="nome" maxlength="20" placeholder="Seu nome"></label>
    <label>Idade<input id="idade" type="number" min="16" max="80" value="28"></label>
    <label>Habilidade<select id="habilidade">${opcoes}</select></label>
    <div class="criacao-grade"><label>Tom de pele<select id="pele"><option value="clara">Claro</option><option value="media" selected>Médio</option><option value="escura">Escuro</option></select></label>
    <label>Cabelo<select id="cabelo"><option value="preto">Preto</option><option value="castanho" selected>Castanho</option><option value="grisalho">Grisalho</option><option value="raspado">Raspado</option></select></label></div>
    <p class="pequeno">Você começa com 1 ponto de skill para especializar seu sobrevivente. A aparência e a ficha podem ser alteradas no abrigo.</p>
    <p class="pequeno">História integrada ao mundo aberto: siga os capítulos quando quiser ou ignore o objetivo e explore, recrute, plante e construa livremente.</p>
    ${btn("comecar","Começar")}
    ${temSave?btn("continuar","Continuar jogo salvo"):""}
  </section>`;
}
function iniciar(){
  const nome=($("#nome").value||"").trim().slice(0,20)||"Sobrevivente";
  let idade=parseInt($("#idade").value,10); if(!(idade>=16&&idade<=80))idade=28;
  jogo=novoJogo(nome,idade,$("#habilidade").value,"hibrido",{pele:$("#pele").value,cabelo:$("#cabelo").value});
  P=jogo.P;
  gerarQuadro();
  registrar(`Boletim: ${BOLETIM[1]}`);
  registrar("Juliana: \"Bem-vindo. Aqui você precisa provar que vale o pedaço de pão.\"");
  registrar("Você chegou ao abrigo da igreja no primeiro dia do colapso.");
  registrar(`${CAPITULOS[0].titulo}: ${CAPITULOS[0].texto}`);
  salvarJogo(false);
}
function salvarJogo(mostrar){
  try{localStorage.setItem(CHAVE,JSON.stringify(jogo));if(mostrar)registrar("Jogo salvo.");}
  catch(e){if(mostrar)registrar("Não foi possível salvar neste navegador.");}
}
function carregar(){
  try{
    const s=localStorage.getItem(CHAVE);
    if(!s)return;
    jogo=JSON.parse(s);P=jogo.P||{};jogo.P=P;jogo.modo="hibrido";
    jogo.nivel=jogo.nivel||1;jogo.xp=jogo.xp||0;jogo.xpProximo=jogo.xpProximo||100;
    jogo.pontosAtributo=jogo.pontosAtributo||0;jogo.pontosSkill=jogo.pontosSkill||0;
    jogo.skills=jogo.skills||{};jogo.aparencia=jogo.aparencia||{pele:"media",cabelo:"castanho"};
    jogo.atributos=jogo.atributos||{forca:1,agilidade:1,foco:1};jogo.armaEquip=jogo.armaEquip||"faca";
    jogo.roupas={torso:"roupa_comum",casaco:null,botas:"tenis",...(jogo.roupas||{})};
    jogo.animais=jogo.animais||[];jogo.animalAtivo=jogo.animalAtivo||null;
    jogo.animais.forEach(a=>{a.fome=a.fome??100;a.vinculo=a.vinculo||0;a.fugiu=!!a.fugiu;a.base=a.base||"abrigo";});
    Object.values(P).forEach(p=>{p.vinculo=p.vinculo||0;p.marcosVinculo=p.marcosVinculo||[];});
    jogo.capitulo=jogo.capitulo||0;jogo.capitulosVistos=jogo.capitulosVistos||[];jogo.hordas=jogo.hordas||[];
    jogo.bases=jogo.bases||[{id:"base-abrigo",nome:"Abrigo da igreja",local:"abrigo",nivel:1,defesa:1,canteiros:0,plantios:[],estoque:{}}];
    jogo.bases.forEach(b=>{
      b.plantios=b.plantios||[];b.estoque=b.estoque||{};b.canil=b.canil||0;b.estufa=b.estufa||0;
      b.fertilidade=b.fertilidade??70;b.ultimoCultivo=b.ultimoCultivo||null;
      b.plantios.forEach(p=>{p.cultura=p.cultura||"milho";p.umidade=p.umidade??1;p.diasSeca=p.diasSeca||0;});
    });
    jogo.inv=jogo.inv||{};Object.keys(NOMES).forEach(k=>{if(jogo.inv[k]===undefined)jogo.inv[k]=0;});
    if(!jogo.inv.roupa_comum)jogo.inv.roupa_comum=1;if(!jogo.inv.tenis)jogo.inv.tenis=1;
    combate=null;evento=null;registrar("Você retomou sua jornada.");
  }catch(e){jogo=null;P={};}
}
