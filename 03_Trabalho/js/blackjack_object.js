function BlackJack() {
  this.baralho = [];
  this.cartas_dealer = [];
  this.cartas_player = [];

  this.criar_baralho = function() {
    this.cartas_dealer = [];
    this.cartas_player = [];
    this.baralho = this.baralha(this.novo_baralho());
  }

  this.novo_baralho = function () {
    var deck = [];

    for(var i = 0; i < 13 * 4; i++) {
      deck.push(i % 13 + 1);
    }

    return deck;
  }

  this.baralha = function(baralho) {
    for(var i = 0; i < baralho.length; i++) {
      var r = Math.floor(Math.random() * baralho.length);
      var t = baralho[i];
      baralho[i] = baralho[r];
      baralho[r] = t;
    }

    return baralho;
  }

  this.terminou = function(cartas) {
    var result = this.valor(cartas);

    if(result == 21) {
      return [true, true];
    }

    if(result > 21) {
        return [true, false];
    }

    return [false, false];
  }

  this.jogada_player = function() {
    this.cartas_player.push(this.baralho.pop());
  }

  this.jogada_dealer = function() {
    this.cartas_dealer.push(this.baralho.pop());
    var total = this.terminou(this.cartas_dealer);

    if(total[0] && total[1]) {
      return [true, true];
    }

    if(this.valor(this.cartas_dealer) > this.valor(this.cartas_player)) {
      if(this.valor(this.cartas_dealer) < 21) {
        return [false, true];
      }

      return [true, true];
    }

    return [false, false];
  }

  this.valor = function(cartas) {
    var total = 0;
    var joker = false;

    for(var i = 0; i < cartas.length; i++) {
      var value;

      if(cartas[i] > 11) {
        value = 10;
      } else if(cartas[i] == 1) {
        value = 11;
        joker = true;
      } else {
        value = cartas[i];
      }

      total += value;
    }

    // Joker value
    if(joker == true && total > 21) {
      total -= 10;
    }

    return total;
  }

  this.getNumberOfCards = function(hand) {
    return hand.length;
  }
}
