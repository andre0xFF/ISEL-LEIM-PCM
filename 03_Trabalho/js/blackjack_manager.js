/** TODO
 * Display player and dealer score
 * Dynamically insert cards
 */

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
  jogo.criar_baralho();
  debugScore();
  // give two cards to player and dealer
  jogada_player();
  jogada_player();
}

function jogada_player() {
  jogo.jogada_player();
  insertCardFace("player", jogo.cartas_player);
  jogo.jogada_dealer();
  insertCardFace("dealer", jogo.cartas_dealer);
  debugScore();
  // TODO: verify score if any hand >= 21 end game
}

function dealer_acaba() {
  jogo.jogada_dealer();
  insertCardFace("dealer", jogo.cartas_dealer);
  debugScore();
  // TODO: end game
}

function getCardFace(num) {
  var card = new faceFetcher();
  return card.faces[num - 1][Math.floor(Math.random() * 4)];
}

function insertCardFace(name, hand) {
  document.getElementById(name.toString() + "Img" + hand.length.toString()).src = getCardFace(hand[hand.length - 1]);
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
