/* Expansão: zumbi especial, abrigo secreto, eventos dinâmicos e tempestade. */
INIMIGOS.berrador={nome:"Berrador",vida:14,dano:[3,6],mordida:0.1,humano:false,grito:true};
CLIMAS.tempestade="Tempestade com ventania";
LOCAIS.bunker={nome:"Abrigo subterrâneo secreto",c:"Bunker",x:44,y:52,desc:"Uma porta de metal sob o pátio da escola, com um símbolo militar meio apagado. Quem estava aqui trancou tudo por dentro.",perigo:3,zumbis:[0,2],saques:["kit","remedio","soro","municao","bandagem"],dia:4};
ARESTAS.push(["escola","bunker",2]);
EVENTOS.push(
  {t:"Suprimentos militares",x:"Um zumbido de hélice cruza o céu. Pouco depois, um paraquedas cinza cai atrás de um depósito a poucas ruas daqui.",
   c:l=>jogo.dia>=3&&l!=="abrigo",
   o:[["Correr até o paraquedas",()=>{
        if(chance(0.4)){iniciarCombate(zumbisPara(jogo.local));return null;}
        jogo.inv.municao=(jogo.inv.municao||0)+rnd(4,8);
        if(chance(0.5))jogo.inv.kit=(jogo.inv.kit||0)+1;
        return "Você abre a caixa: munição e, talvez, um kit médico. Rápido, antes que alguém veja.";}],
      ["Esperar e observar de longe",()=>{jogo.ruido=Math.max(0,jogo.ruido-2);return "Um grupo armado saqueia a caixa. Você decide não se arriscar.";}]]},
  {t:"Tiros distantes",x:"Uma rajada ecoa pelo bairro, seguida de gritos que somem depressa demais. Não dá para saber a direção.",
   c:l=>l!=="abrigo",
   o:[["Investigar com cuidado",()=>{
        if(chance(0.5)){iniciarCombate(["saqueador"]);return null;}
        jogo.inv.municao=(jogo.inv.municao||0)+rnd(2,4);
        return "Você encontra cartuchos espalhados e um rastro de sangue que leva a uma porta arrombada.";}],
      ["Ficar escondido e esperar",()=>{jogo.ruido=0;return "Você fica quieto até o silêncio voltar. O som não se repete.";}]]},
  {t:"Ventania e raios",x:"O céu escurece em minutos. Portas batem nas ruas e uma chapa de metal despenca do telhado.",
   c:()=>jogo.clima==="tempestade",
   o:[["Buscar abrigo e esperar",()=>{jogo.cansaco=limitar(jogo.cansaco+4);jogo.ruido=0;return "A tempestade abafa todo o barulho. Você descansa enquanto os raios passam.";}],
      ["Aproveitar o temporal para saquear",()=>{
        jogo.ruido=Math.max(0,jogo.ruido-1);
        if(chance(0.2)){iniciarCombate(zumbisPara(jogo.local));return null;}
        jogo.inv.sucata=(jogo.inv.sucata||0)+rnd(1,2);
        return "Entre um raio e outro, você recolhe sucata de um telhado caído.";}]]}
);
