/* Dados do mundo e acontecimentos. */
/* ---------- Mundo ---------- */
const BOLETIM={
  1:"Autoridades confirmam um surto de infecção transmitida por mordida. Fiquem em casa.",
  2:"A energia caiu em quase toda a cidade. O governo pede calma e diz que a situação está sob controle.",
  3:"Faltam água e combustível. Caminhões-pipa não conseguem chegar aos bairros.",
  4:"Grupos armados assumiram áreas da Zona Norte e cobram 'taxa de proteção'.",
  5:"Um instituto de pesquisa afirma ter um soro experimental. Não há data para distribuição.",
  6:"As últimas pontes estão fechadas. Barcos particulares saem da Marina para Niterói.",
  7:"O rádio está quase sem sinal. Ninguém sabe quem ainda está no comando."
};
const CLIMAS={calor:"Calor e sol",chuva:"Chuva forte",nublado:"Nublado"};
const CULTURAS={
  milho:{nome:"Milho",dias:3,rendimento:3,familia:"graminea"},
  feijao:{nome:"Feijão",dias:2,rendimento:2,familia:"leguminosa"},
  batata:{nome:"Batata",dias:4,rendimento:4,familia:"raiz"}
};
const ESPECIES={
  cao:{nome:"Cão",nomeAnimal:"Bidu",beneficio:"Fareja perigos e encontra suprimentos."},
  gato:{nome:"Gato",nomeAnimal:"Pingo",beneficio:"Acalma o grupo durante o descanso."}
};
const LOCAIS={
  abrigo:{nome:"Igreja São Jorge (abrigo)",c:"Igreja",x:50,y:37,desc:"Sacos de areia, arame farpado e racionamento. Juliana organiza o grupo daqui.",perigo:1,zumbis:[0,1],saques:[],dia:1},
  bairro:{nome:"Bairro Residencial",c:"Bairro",x:21,y:37,desc:"Casas com portas arrombadas. Alguns moradores ainda se escondem atrás das janelas.",perigo:2,zumbis:[1,3],saques:["comida","agua_suja","bandagem","municao","lenha","pilhas","sementes"],dia:1},
  supermercado:{nome:"Supermercado",c:"Mercado",x:65,y:37,desc:"Prateleiras viradas. Ainda há latas nos fundos, mas outros também sabem disso.",perigo:3,zumbis:[2,4],saques:["comida","agua","bandagem","pilhas","faca","sementes"],dia:1},
  posto:{nome:"Posto de Gasolina",c:"Posto",x:7,y:62,desc:"Breno controla o posto com uma espingarda e um sorriso torto.",perigo:3,zumbis:[1,3],saques:["municao","combustivel","comida","bateria","pilhas"],dia:1},
  feira:{nome:"Feira Livre",c:"Feira",x:50,y:12,desc:"Barracas tombadas e gente trocando comida por pilhas. Dona Nair ainda vende o que sobrou.",perigo:2,zumbis:[1,2],saques:["comida","agua","lenha","sementes"],dia:1},
  escola:{nome:"Escola Municipal",c:"Escola",x:35,y:62,desc:"Salas fechadas com cadeiras empilhadas. Vera e Marcos cuidam de quem sobrou.",perigo:2,zumbis:[1,2],saques:["comida","bandagem","pilhas","tecido"],dia:1},
  viaduto:{nome:"Viaduto",c:"Viaduto",x:7,y:87,desc:"Carros abandonados em duas faixas. Hordas costumam passar por aqui à noite.",perigo:4,zumbis:[2,4],saques:["municao","comida","sucata","prego"],dia:2},
  oficina:{nome:"Oficina do Tião (Madureira)",c:"Oficina",x:79,y:62,desc:"Carros desmontados, ferramentas penduradas e um barco de alumínio coberto por lona.",perigo:3,zumbis:[1,3],saques:["bateria","cano","combustivel","machado","lenha","sucata","prego"],dia:2},
  hospital:{nome:"Hospital Municipal",c:"Hospital",x:65,y:12,desc:"Corredores escuros e cheiro forte. Remédios espalhados, mas alguns pacientes ainda estão nas camas.",perigo:5,zumbis:[3,6],saques:["remedio","bandagem","kit","agua"],dia:2},
  quartel:{nome:"Quartel",c:"Quartel",x:7,y:12,desc:"A milícia controla o portão. Dentro ainda há armas e munição.",perigo:6,zumbis:[3,6],saques:["municao","machado","kit","bateria","prego","colete","revolver","escopeta"],dia:4},
  lab:{nome:"Instituto Biomédico",c:"Instituto",x:93,y:12,desc:"Refrigeradores quebrados. Pesquisadores tentaram um soro antes da queda.",perigo:7,zumbis:[3,6],saques:["remedio","kit","sementes"],dia:5},
  marina:{nome:"Marina da Glória",c:"Marina",x:65,y:87,desc:"Barcos particulares e uma caravana saindo para Niterói. A única saída que ainda funciona.",perigo:4,zumbis:[2,4],saques:["combustivel","comida"],dia:6},
  estacao:{nome:"Estação Central",c:"Estação",x:21,y:12,desc:"Plataformas lotadas de malas abandonadas. O túnel ainda leva a outros bairros.",perigo:4,zumbis:[2,5],saques:["municao","pilhas","tecido"],dia:1},
  delegacia:{nome:"Delegacia do Centro",c:"Polícia",x:35,y:12,desc:"As celas foram abertas por dentro. O arsenal talvez ainda esteja trancado.",perigo:5,zumbis:[3,6],saques:["municao","pistola","revolver","escopeta","bandagem","prego"],dia:2},
  deposito:{nome:"Depósito Municipal",c:"Depósito",x:79,y:12,desc:"Caixas de mantimentos empilhadas atrás de um portão empenado.",perigo:3,zumbis:[1,4],saques:["comida","agua","lenha","sucata","prego"],dia:2},
  metro:{nome:"Túnel do Metrô",c:"Metrô",x:7,y:37,desc:"A escuridão engole o som. Há marcas recentes nas paredes e vagões parados no túnel.",perigo:6,zumbis:[4,7],saques:["pilhas","municao","sucata"],dia:2},
  clinica:{nome:"Clínica Santa Marta",c:"Clínica",x:35,y:37,desc:"Uma clínica de bairro saqueada às pressas. Armários médicos ainda estão fechados.",perigo:3,zumbis:[1,4],saques:["bandagem","remedio","kit","tecido"],dia:2},
  ponte:{nome:"Ponte Rio-Niterói",c:"Ponte",x:79,y:37,desc:"Carros abandonados formam um corredor estreito entre a cidade e a baía.",perigo:6,zumbis:[3,7],saques:["combustivel","sucata","municao"],dia:3},
  favela:{nome:"Morro da Esperança",c:"Morro",x:21,y:62,desc:"Escadarias íngremes, vielas apertadas e moradores que conhecem cada saída.",perigo:4,zumbis:[2,5],saques:["comida","agua_suja","sementes","lenha"],dia:1},
  cemiterio:{nome:"Cemitério do Caju",c:"Cemitério",x:50,y:62,desc:"A terra está revolvida. Portões abertos deixam a rua exposta ao que saiu de lá.",perigo:5,zumbis:[3,6],saques:["lenha","cano","faca","tecido"],dia:3},
  docas:{nome:"Docas Abandonadas",c:"Docas",x:65,y:62,desc:"Contêineres enferrujados e água subindo pelos degraus. Há combustível nos barcos presos.",perigo:4,zumbis:[2,5],saques:["combustivel","bateria","sucata","prego"],dia:3},
  barragem:{nome:"Barragem do Norte",c:"Barragem",x:21,y:87,desc:"Válvulas rangem sobre um reservatório turvo. A manutenção deixou ferramentas para trás.",perigo:4,zumbis:[2,5],saques:["agua","agua_suja","cano","sucata"],dia:3},
  condominio:{nome:"Condomínio Fechado",c:"Condomínio",x:35,y:87,desc:"Muros altos protegem apartamentos vazios. Um gerador ainda ronca no subsolo.",perigo:3,zumbis:[1,4],saques:["comida","pilhas","tecido","sementes"],dia:2},
  parque:{nome:"Parque da Quinta",c:"Parque",x:50,y:87,desc:"Trilhas e estufas destruídas. Plantas resistentes ainda crescem entre o concreto.",perigo:2,zumbis:[1,3],saques:["sementes","lenha","agua"],dia:1},
  fazenda:{nome:"Sítio Boa Vista",c:"Sítio",x:79,y:87,desc:"Uma pequena propriedade cercada. O celeiro parece intacto, mas a casa está silenciosa.",perigo:3,zumbis:[1,4],saques:["comida","agua","sementes","lenha"],dia:3},
  universidade:{nome:"Universidade Estadual",c:"Universidade",x:93,y:37,desc:"Laboratórios e salas de aula foram abandonados durante uma evacuação incompleta.",perigo:4,zumbis:[2,5],saques:["sementes","remedio","sucata","tecido"],dia:2},
  porto:{nome:"Porto do Rio",c:"Porto",x:93,y:62,desc:"Guindastes parados e navios presos ao cais. A maré trouxe destroços e suprimentos.",perigo:5,zumbis:[3,6],saques:["combustivel","agua","bateria","sucata"],dia:4},
  rodoviaria:{nome:"Rodoviária Novo Rio",c:"Rodoviária",x:93,y:87,desc:"Ônibus atravessados bloqueiam as saídas. As mochilas deixadas para trás ainda podem ajudar.",perigo:5,zumbis:[3,6],saques:["comida","municao","combustivel","tecido"],dia:3}
};
const PREFERENCIAS_SAQUE={
  bairro:["comida","agua_suja","lenha"],
  supermercado:["comida","agua"],
  posto:["combustivel","bateria","municao"],
  feira:["comida","sementes"],
  escola:["comida","bandagem","pilhas"],
  viaduto:["municao","sucata","prego"],
  oficina:["bateria","cano","combustivel","machado","sucata","prego"],
  hospital:["remedio","bandagem","kit"],
  quartel:["municao","revolver","escopeta","colete","machado"],
  lab:["remedio","kit","sementes"],
  marina:["combustivel"],
  estacao:["pilhas","tecido","municao"],
  delegacia:["municao","pistola","revolver","escopeta"],
  deposito:["comida","agua","lenha"],
  metro:["pilhas","municao","sucata"],
  clinica:["bandagem","remedio","kit"],
  ponte:["combustivel","sucata","municao"],
  favela:["comida","agua_suja","sementes"],
  cemiterio:["lenha","cano","tecido"],
  docas:["combustivel","bateria","sucata"],
  barragem:["agua","agua_suja","cano"],
  condominio:["comida","pilhas","sementes"],
  parque:["sementes","lenha","agua"],
  fazenda:["comida","sementes","lenha"],
  universidade:["sementes","remedio","tecido"],
  porto:["combustivel","bateria","agua"],
  rodoviaria:["comida","combustivel","tecido"]
};
const ARESTAS=[["abrigo","bairro",1],["abrigo","escola",1],["abrigo","feira",2],["bairro","posto",1],["bairro","supermercado",1],["bairro","viaduto",2],["supermercado","feira",1],["supermercado","hospital",2],["feira","quartel",2],["posto","quartel",2],["posto","viaduto",1],["escola","viaduto",2],["escola","oficina",3],["viaduto","oficina",2],["oficina","lab",2],["hospital","lab",2],["lab","marina",2],["oficina","marina",3],["bairro","estacao",1],["estacao","quartel",1],["estacao","delegacia",1],["delegacia","hospital",1],["hospital","deposito",1],["abrigo","metro",1],["metro","bairro",1],["abrigo","clinica",1],["clinica","hospital",2],["bairro","ponte",2],["supermercado","ponte",2],["bairro","favela",1],["favela","posto",2],["escola","cemiterio",1],["cemiterio","hospital",2],["oficina","docas",2],["docas","marina",1],["viaduto","barragem",2],["barragem","escola",2],["escola","condominio",2],["condominio","oficina",2],["viaduto","parque",1],["parque","condominio",2],["oficina","fazenda",2],["fazenda","marina",2],["hospital","universidade",1],["universidade","feira",2],["docas","porto",1],["porto","marina",1],["viaduto","rodoviaria",1],["rodoviaria","marina",2]];
const NOMES={comida:"Lata de comida",agua:"Água potável",agua_suja:"Água de fonte duvidosa",bandagem:"Bandagem",remedio:"Antibiótico",kit:"Kit médico",soro:"Soro experimental",municao:"Munição",combustivel:"Combustível",bateria:"Bateria",lenha:"Lenha",pilhas:"Pilhas",faca:"Faca",machado:"Machado",cano:"Cano de ferro",lanca:"Lança improvisada",facao:"Facão",bastao:"Bastão reforçado",pistola:"Pistola",revolver:"Revólver",escopeta:"Escopeta",sementes:"Sementes",sucata:"Sucata",prego:"Pregos",tecido:"Tecido",roupa_comum:"Roupa de trabalho",roupa_reforcada:"Roupa reforçada",colete:"Colete balístico",capa_chuva:"Capa impermeável",jaqueta:"Jaqueta acolchoada",tenis:"Tênis usado",botas:"Botas de trilha"};
const USAVEIS=["comida","agua","agua_suja","bandagem","remedio","kit","soro"];
const RECEITAS=[
  {nome:"Ferver água suja (1 lenha)",precisa:{agua_suja:1,lenha:1},faz:{agua:1}},
  {nome:"Lança improvisada (faca + cano)",precisa:{faca:1,cano:1},faz:{lanca:1}},
  {nome:"Bastão reforçado (cano + lenha)",precisa:{cano:1,lenha:1},faz:{bastao:1}},
  {nome:"Facão de sucata (faca + cano + lenha)",precisa:{faca:1,cano:1,lenha:1},faz:{facao:1}},
  {nome:"Roupa reforçada (2 tecidos + sucata)",precisa:{tecido:2,sucata:1},faz:{roupa_reforcada:1}},
  {nome:"Capa impermeável (2 tecidos + sucata)",precisa:{tecido:2,sucata:1},faz:{capa_chuva:1}},
  {nome:"Jaqueta acolchoada (3 tecidos + lenha)",precisa:{tecido:3,lenha:1},faz:{jaqueta:1}},
  {nome:"Botas de trilha (2 tecidos + sucata)",precisa:{tecido:2,sucata:1},faz:{botas:1}}
];
const ARMAS={punhos:{dano:[2,4],tipo:"corpo"},faca:{dano:[4,7],tipo:"corpo"},lanca:{dano:[7,11],tipo:"corpo"},bastao:{dano:[6,10],tipo:"corpo"},machado:{dano:[8,13],tipo:"corpo"},facao:{dano:[9,14],tipo:"corpo"},pistola:{dano:[11,16],tipo:"fogo",ruido:3},revolver:{dano:[14,20],tipo:"fogo",ruido:4},escopeta:{dano:[18,28],tipo:"fogo",ruido:6,custo:2}};
const ROUPAS={
  roupa_comum:{slot:"torso",armadura:0,furtividade:0,descricao:"Tecido leve, sem proteção."},
  roupa_reforcada:{slot:"torso",armadura:2,furtividade:-0.02,descricao:"Camadas de tecido e placas de sucata."},
  colete:{slot:"torso",armadura:5,furtividade:-0.08,descricao:"Proteção balística pesada. Raro e barulhento."},
  capa_chuva:{slot:"casaco",armadura:0,furtividade:0,descricao:"Ajuda a manter o corpo seco sob chuva."},
  jaqueta:{slot:"casaco",armadura:1,furtividade:0,descricao:"Acolchoada contra frio e arranhões."},
  tenis:{slot:"botas",armadura:0,furtividade:0,descricao:"Calçado leve, já bastante usado."},
  botas:{slot:"botas",armadura:1,furtividade:0.04,descricao:"Solado firme para caminhar em escombros e reduzir o desgaste."}
};
const SKILLS={
  combate:{nome:"Combate próximo",descricao:"Golpes mais precisos e dano corpo a corpo.",max:3},
  tiro:{nome:"Mira controlada",descricao:"Melhora a precisão com armas de fogo.",max:3},
  primeiros_socorros:{nome:"Primeiros socorros",descricao:"Aumenta a eficácia de curativos e kits.",max:3},
  rastreador:{nome:"Leitura de terreno",descricao:"Reduz encontros durante exploração e viagem.",max:3},
  catador:{nome:"Catador experiente",descricao:"Encontra recursos extras ao vasculhar.",max:3}
};
const CAPITULOS=[
  {titulo:"Capítulo I · A cidade prende a respiração",texto:"O rádio morreu no meio de uma frase. Do lado de fora, sirenes se misturam a gritos e ao barulho de portões sendo fechados. No abrigo, Juliana aponta para o mapa: alguém ainda mantém uma oficina funcionando.",objetivo:"Encontre a oficina de Tião."},
  {titulo:"Capítulo II · O último motor",texto:"Tião não olha para você quando fala. O barco pode tirar vocês da cidade, mas o motor está aberto e faltam peças. Lá fora, cada ruído parece chamar alguma coisa para mais perto.",objetivo:"Conquiste a confiança de Tião e reúna 1 bateria e 4 combustíveis."},
  {titulo:"Capítulo III · Frequência fantasma",texto:"O motor está pronto, mas o rádio do abrigo capta uma transmissão curta: alguém no hospital sabe por que a infecção chegou tão depressa. A mensagem termina com coordenadas e três batidas de estática.",objetivo:"Descubra quem ainda transmite da cidade."},
  {titulo:"Capítulo IV · A lista dos vivos",texto:"No mural da escola há nomes riscados, rotas anotadas e uma lista de pessoas que ninguém conseguiu encontrar. Cada abrigo guarda uma versão diferente do que aconteceu naquela primeira noite.",objetivo:"Explore os abrigos e decida quem merece um lugar seguro."},
  {titulo:"Capítulo V · Enfermaria escura",texto:"No hospital, as macas estão vazias e os prontuários foram arrancados. Uma enfermeira deixou uma gravação: o primeiro foco não veio de um bairro, mas de uma instalação de pesquisa.",objetivo:"Siga as pistas do hospital ou da clínica."},
  {titulo:"Capítulo VI · O que ficou enterrado",texto:"O Instituto Biomédico está cercado. Os arquivos falam de uma evacuação feita às pressas e de uma equipe que se recusou a abandonar os pacientes. A resposta está perto, mas cada disparo chama a horda.",objetivo:"Investigue o Instituto Biomédico ou escolha outro caminho para sobreviver."},
  {titulo:"Capítulo VII · Ninguém fica para trás",texto:"A última chamada anuncia a partida na Marina. Pessoas que você conheceu ainda estão espalhadas pela cidade. O barco tem espaço limitado e a noite está chegando; partir também é uma escolha.",objetivo:"Chegue à Marina e decida quem vai com você."},
  {titulo:"Fim · Depois da última noite",texto:"A baía engole o som da cidade. O horizonte não promete salvação, apenas distância. Pela primeira vez em dias, o silêncio não parece estar esperando por você. Quem ficou para trás continua nas suas lembranças.",objetivo:"Você deixou o Rio para trás."}
];
const TAREFAS_ABERTAS=[
  {id:"mapear",titulo:"Reconhecer a vizinhança",texto:"Visite 4 regiões diferentes.",tipo:"locais",meta:4,xp:20,recompensa:{item:"agua",qtd:1}},
  {id:"saquear",titulo:"Suprimentos para mais um dia",texto:"Vasculhe 3 locais em busca de recursos.",tipo:"saques",meta:3,xp:24,recompensa:{item:"comida",qtd:1}},
  {id:"proteger",titulo:"Limpar uma rota",texto:"Elimine 5 infectados.",tipo:"infectados",meta:5,xp:30,recompensa:{item:"municao",qtd:4}},
  {id:"recrutar",titulo:"Ninguém sobrevive sozinho",texto:"Recrute um sobrevivente para o seu grupo.",tipo:"recrutas",meta:1,xp:28,recompensa:{item:"bandagem",qtd:1}},
  {id:"fundar",titulo:"Um lugar para voltar",texto:"Fundar uma nova base além do abrigo inicial.",tipo:"bases",meta:1,xp:35,recompensa:{item:"prego",qtd:2}},
  {id:"horta",titulo:"Comida que cresce",texto:"Colha duas safras em qualquer base.",tipo:"colheitas",meta:2,xp:36,recompensa:{item:"sementes",qtd:2}},
  {id:"defesa",titulo:"A noite não passa de graça",texto:"Reforce bases com duas barricadas.",tipo:"barricadas",meta:2,xp:30,recompensa:{item:"sucata",qtd:2}},
  {id:"arquivo",titulo:"Uma pista entre os escombros",texto:"Alcance o Hospital ou o Instituto Biomédico.",tipo:"local-chave",meta:1,xp:32,recompensa:{item:"kit",qtd:1}}
];
const HABILIDADES={atleta:"Atleta: foge com mais facilidade",atirador:"Atirador: começa com pistola e mais munição",medico:"Médico: cura mais e começa com um kit",mecanico:"Mecânico: encontra mais materiais"};
const INIMIGOS={
  zumbi:{nome:"Morto-vivo",vida:12,dano:[4,7],mordida:0.12,humano:false},
  corredor:{nome:"Infectado corredor",vida:10,dano:[5,9],mordida:0.2,humano:false},
  brutamontes:{nome:"Brutamontes",vida:25,dano:[7,12],mordida:0.16,humano:false},
  saqueador:{nome:"Saqueador armado",vida:14,dano:[3,7],mordida:0,humano:true}
};
const GENERICOS=[
  ["Vera","professora","escola","comum"],["Seu Aurélio","pescador","marina","pescador"],["Dona Nair","feirante","feira","comercio"],
  ["Caio","motoboy","supermercado","motorista"],["Rafa","ex-soldado","quartel","lutador","milicia"],["Joana","enfermeira","hospital","medico"],
  ["Zé","segurança","bairro","lutador"],["Marcos","estudante","escola","comum"],["Nina","cozinheira","bairro","comum"],
  ["Paulo","eletricista","bairro","mecanico"],["Lúcia","vendedora","feira","comercio"],["Bruno","entregador","supermercado","motorista"],
  ["Otávio","veterinário","posto","medico"],["Edinho","caminhoneiro","viaduto","motorista"],["Iara","jornalista","escola","comum"],
  ["Miguel","padeiro","abrigo","comum","juliana"],["Tânia","faxineira","hospital","comum"],["Ricardo","PM aposentado","quartel","lutador","milicia"],
  ["Gabi","estudante","feira","comum"],["Wagner","pedreiro","viaduto","lutador"]
];
const FALAS={
  juliana:["Juliana: \"Aqui ninguém come sem trabalhar. Escolha missões que você consiga cumprir.\"","Juliana: \"Lá fora não existe herói. Existe quem volta vivo.\""],
  helena:["Dra. Helena: \"Infecção mata mais gente que mordida. Limpe qualquer ferimento.\"","Dra. Helena: \"Ferver água salva mais gente que qualquer remédio. Não esqueça.\""],
  breno:["Breno: \"Tenho o que você precisa, se tiver o que eu quero.\"","Breno: \"A milícia cobra pedágio até da minha sombra. Não me complique.\""],
  tiao:["Tião: \"Motor a gasolina só pega com bateria boa e combustível limpo.\"","Tião: \"Cada peça que eu acho lá fora vale mais que uma arma.\""]
};
const FALAS_GERAIS=["\"Não sei até quando isso vai durar.\"","\"Você viu o que aconteceu na Zona Norte?\"","\"Se tiver água limpa, eu troco por qualquer coisa.\"","\"Fique de olho na rua, ouvi barulho ontem à noite.\""];
const MODELOS=[
  {rank:"D",titulo:"Buscar água nas casas do bairro",tipo:"coletar",item:"agua",qtd:2,prazo:2,conf:4,extra:{comida:1}},
  {rank:"C",titulo:"Trazer latas de comida do supermercado",tipo:"coletar",item:"comida",qtd:3,prazo:2,conf:6,extra:{bandagem:1}},
  {rank:"B",titulo:"Eliminar mortos-vivos perto da estrada",tipo:"eliminar",qtd:5,prazo:3,conf:9,extra:{municao:4}},
  {rank:"A",titulo:"Buscar kits médicos no hospital",tipo:"coletar",item:"kit",qtd:2,prazo:3,conf:12,extra:{remedio:1}},
  {rank:"S",titulo:"Trazer munição do quartel para a defesa",tipo:"coletar",item:"municao",qtd:15,prazo:3,conf:20,extra:{kit:1}}
];
const RANKS={D:0,C:5,B:15,A:30,S:50};
const MISSOES_LIDER=[
  {t:"Saquear o Mercado",local:"supermercado",tipo:"saque"},
  {t:"Buscar remédios no Hospital",local:"hospital",tipo:"saque"},
  {t:"Patrulhar o Viaduto",local:"viaduto",tipo:"patrulha"},
  {t:"Buscar peças na Oficina",local:"oficina",tipo:"saque"},
  {t:"Recrutar sobreviventes na Feira",local:"feira",tipo:"recrutar"}
];

/* ---------- Eventos ---------- */
const EVENTOS=[
  {t:"Sobrevivente ferido",x:"Um homem sangra encostado num muro e pede ajuda. Há marcas de dente no braço dele.",
   o:[["Ajudar (gasta 1 bandagem)",()=>{
        if(!gasta("bandagem"))return "Você não tem bandagem. Ele segue sozinho, mancando.";
        if(chance(0.25)&&!temLesao("mordida")){jogo.lesoes.push({tipo:"mordida",horas:36});return "Ao tentar enfaixá-lo, ele te morde no antebraço!";}
        jogo.inv.comida++;return "Você enfaixa o ferimento. Ele te dá uma lata de comida em agradecimento.";}],
      ["Seguir em frente",()=>"Você segue sem olhar para trás. Não é a primeira pessoa que deixa para trás."],
      ["Revistar a mochila dele",()=>{jogo.inv.comida++;jogo.sanidade=limitar(jogo.sanidade-8);return "Você pega uma lata e sai com o estômago revirado.";}]]},
  {t:"Saqueadores armados",x:"Dois homens com facões e um revólver bloqueiam a rua. Eles querem tudo que você tem.",
   c:l=>!["abrigo","hospital"].includes(l),
   o:[["Lutar",()=>{iniciarCombate(["saqueador","saqueador"]);return null;}],
      ["Negociar (2 latas ou 1 água)",()=>(gasta("comida",2)||gasta("agua"))?"Eles aceitam a troca e somem pela rua.":(iniciarCombate(["saqueador","saqueador"]),"Você não tem o que oferecer. Eles partem para cima!")],
      ["Fugir",()=>chance(0.6)?"Você corre e se esconde atrás de um carro. Eles não te veem.":(iniciarCombate(["saqueador"]),"Eles te pegaram correndo!")]]},
  {t:"Checkpoint da milícia",x:"Homens armados com coletes improvisados montaram uma barreira. Querem 'taxa de proteção'.",
   c:l=>jogo.dia>=4&&["bairro","supermercado","posto","oficina"].includes(l),
   o:[["Pagar a taxa (2 munições)",()=>{
        if(gasta("municao",2)){jogo.milicia+=5;return "Os homens te deixam passar sem perguntas.";}
        jogo.milicia-=3; if(gasta("comida"))return "Você não tinha munição. Eles levam uma lata e te mandam embora."; return "Você não tinha o que pagar. Eles anotam seu rosto.";}],
      ["Oferecer comida (2 latas)",()=>gasta("comida",2)?(jogo.milicia+=3,"Eles aceitam. Por enquanto."):"Você não tem comida suficiente."],
      ["Recusar",()=>{jogo.milicia-=6;if(chance(0.5)){iniciarCombate(["saqueador","saqueador"]);return null;}return "Eles deixam você ir, mas anotam seu rosto.";}]]},
  {t:"Chuva forte",x:"A chuva cai com força. Telhados vazam sobre uma calçada que ainda está seca.",
   c:l=>jogo.clima==="chuva"&&l!=="abrigo",
   o:[["Juntar água da chuva (baldes improvisados)",()=>{jogo.inv.agua+=2;return "Você coleta 2 garrafas de água limpa da chuva.";}],
      ["Abrigar-se e descansar um pouco",()=>{jogo.sanidade=limitar(jogo.sanidade+4);return "Você espera a chuva passar e se acalma um pouco.";}]]},
  {t:"Casa silenciosa",x:"Uma casa com a porta aberta. Nenhum som, mas há passos pesados no andar de cima.",
   c:l=>["bairro","supermercado"].includes(l),
   o:[["Entrar com cuidado",()=>{if(chance(0.4)){iniciarCombate(["zumbi"]);return null;}jogo.inv.pilhas++;jogo.inv.comida++;return "Você pega pilhas e uma lata sem fazer barulho.";}],
      ["Passar direto",()=>"Você segue em silêncio."]]},
    {t:"Batidas atrás da porta",x:"Uma voz fraca pede ajuda de dentro de um apartamento trancado. Há arranhões recentes no corredor.",
     c:l=>["condominio","clinica","universidade","favela"].includes(l),
     o:[["Arrombar e tirar a pessoa dali",()=>{if(chance(0.35)){iniciarCombate(["zumbi","zumbi"]);return null;}const id=`resgatado-${Object.keys(P).length}`;const nomes=["Lara","Davi","Cecília","Nando","Sol","Ícaro"];P[id]={id,nome:nomes[rnd(0,nomes.length-1)],papel:"sobrevivente resgatado",local:jogo.local,hab:"comum",grupo:null,status:"vivo",conf:5,inf:chance(0.08),turno:rnd(3,6),fixo:false,ferido:false,emMissao:null};return `${P[id].nome} saiu vivo(a). Ainda está assustado(a), mas pode aceitar seu grupo se ganhar confiança.`;}],
      ["Deixar a porta fechada",()=>"A voz some depois de alguns minutos. Você não sabe se foi a decisão certa."]]},
    {t:"Veículo tombado",x:"Uma caminhonete virou na pista. Caixas ficaram espalhadas e o barulho de metal ecoa pelos prédios.",
     c:l=>["viaduto","ponte","rodoviaria","porto"].includes(l),
     o:[["Vasculhar rápido",()=>{jogo.inv.comida++;jogo.inv.sucata++;jogo.ruido+=2;if(chance(0.35)){iniciarCombate(["corredor","zumbi"]);return null;}return "Você recupera comida e sucata antes que o ruído atraia algo.";}],
      ["Empurrar a caminhonete para bloquear a pista",()=>{jogo.densidade[jogo.local]=Math.max(0,jogo.densidade[jogo.local]-1);jogo.inv.prego++;return "A pista fica bloqueada. A horda vai demorar mais para cruzar por aqui.";}]]},
    {t:"Horda na vizinhança",x:"O chão vibra com passos e gemidos. Uma massa de infectados atravessa as ruas próximas.",
     c:l=>(jogo.hordas||[]).some(h=>h.local===l),
     o:[["Apagar as luzes e se esconder",()=>{if(chance(0.7)){jogo.ruido=0;return "Você fica imóvel no escuro. A horda passa sem notar o abrigo.";}iniciarCombate(zumbisPara(jogo.local));return null;}],
      ["Criar uma distração (3 munições)",()=>{if(!gasta("municao",3))return "Você não tem munição suficiente para afastá-los.";const h=jogo.hordas.find(x=>x.local===jogo.local);if(h){const v=vizinhos(h.local);if(v.length)h.local=v[rnd(0,v.length-1)][0];}return "Os disparos ecoam longe. A horda muda de direção.";}],
      ["Correr para a rua",()=>{iniciarCombate(zumbisPara(jogo.local));return null;}]]},
  {t:"Rádio de pilha",x:"Um rádio portátil ainda funciona em cima de um balcão. Chiado, depois uma voz muito distante.",
   c:l=>l!=="abrigo",
   o:[["Ouvir até o fim",()=>{jogo.sanidade=limitar(jogo.sanidade+5);return `Voz no rádio: "${BOLETIM[jogo.dia]||"Só estática."}"`;}],
      ["Levar o rádio e as pilhas",()=>{jogo.inv.pilhas+=2;return "Você leva o rádio e as pilhas dele.";}]]}
    ,{t:"Latidos entre os carros",x:"Um cão magro está preso sob uma caminhonete. Ele rosna quando você se aproxima, mas está exausto.",
    c:l=>podeAcolherAnimal()&&!(jogo.animais||[]).some(a=>a.especie==="cao")&&["bairro","viaduto","parque","fazenda","rodoviaria"].includes(l),
    o:[["Acolher o cão (1 lata)",()=>{if(!podeAcolherAnimal())return "Não há espaço seguro para mais animais. Construa um canil em uma base.";if(!gasta("comida"))return "Você não tem comida para conquistar a confiança do cão.";return resgatarAnimal("cao");}],
      ["Deixar o local em silêncio",()=>"O cão se esconde de novo entre os destroços."]]},
    {t:"Miado no depósito",x:"Um gato está encolhido dentro de um armário aberto. A água no pote acabou há dias.",
    c:l=>podeAcolherAnimal()&&!(jogo.animais||[]).some(a=>a.especie==="gato")&&["deposito","condominio","escola","parque","fazenda"].includes(l),
    o:[["Levar o gato e dividir água (1 garrafa)",()=>{if(!podeAcolherAnimal())return "Não há espaço seguro para mais animais. Construa um canil em uma base.";if(!gasta("agua"))return "Você precisa de água para levar o gato com segurança.";return resgatarAnimal("gato");}],
      ["Deixar a porta aberta",()=>"O gato espera você se afastar antes de sair do armário."]]},
];
