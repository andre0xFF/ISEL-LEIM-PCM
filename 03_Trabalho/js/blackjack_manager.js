var jogo;
var debugMode = true;

function debug(an_object) {
  if(debugMode) {
    document.getElementById("debug").innerHTML = JSON.stringify(an_object);
  }
}

function debugScore() {
  debug([
    "Player: ",
    jogo.terminou(jogo.cartas_player),
    jogo.cartas_player,
    "Dealer: ",
    jogo.terminou(jogo.cartas_dealer),
    jogo.cartas_dealer
  ]);
}

function novo_jogo() {
  jogo = new BlackJack();
  cleanLayout();
  jogo.criar_baralho();
  jogada_player();
  jogada_dealer();
  jogada_player();
}

function jogada_player() {
  if(jogo.playerPass)
    return;

  jogo.jogada_player();
  insertCardFace("player", jogo.cartas_player);
  if(verifyScore(jogo.cartas_player)) {
    document.getElementById("player").style.color = "#C5DB5F";
    document.getElementById("dealer").style.color = "#FF4200";
  }

}

function jogada_dealer() {
  jogo.jogada_dealer();
  insertCardFace("dealer", jogo.cartas_dealer);
  if(verifyScore(jogo.cartas_dealer)) {
    document.getElementById("dealer").style.color = "#C5DB5F";
    document.getElementById("player").style.color = "#FF4200";
  }
}

function dealer_acaba() {
  jogo.playerPass = true;
  document.getElementById("carta").disabled = jogo.playerPass;
  jogada_dealer();
}

function verifyScore(hand) {
  var r = jogo.terminou(hand);

  if(r[0] || r[1]) {
    finaliza_butoes();
    return true;
  }

}
/*
function insertCardFace(name, hand) {
  document.getElementById(name.toString() + "Img" + hand.length.toString()).src = getCardFace(hand[hand.length - 1]);
}
*/

function insertCardFace(name, hand) {
  var img = document.createElement("IMG");
  img.src = getCardFace(hand[hand.length - 1]);
  document.getElementById(name + "Group").appendChild(img);
}

function cleanLayout() {
  document.getElementById("dealer").style.color = "#000000";
  document.getElementById("player").style.color = "#000000";

  var elem = document.getElementById("playerGroup");
  while (elem.firstChild) {
      elem.removeChild(elem.firstChild);
  }

  var elem = document.getElementById("dealerGroup");
  while (elem.firstChild) {
      elem.removeChild(elem.firstChild);
  }

  inicializa_butoes();
}

function getCardFace(num) {
  var card = new faceFetcher();
  return card.faces[num - 1][Math.floor(Math.random() * 4)];
}

function inicializa_butoes() {
    document.getElementById("carta").disabled = false;
    document.getElementById("passo").disabled = false;
    document.getElementById("novo_jogo").disabled = true;
}

function finaliza_butoes() {
    document.getElementById("carta").disabled = true;
    document.getElementById("passo").disabled = true;
    document.getElementById("novo_jogo").disabled = false;
}
