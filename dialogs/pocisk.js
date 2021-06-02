module.exports = (message, client) => {

  var nrCiekawostki = Math.floor(Math.random()*10+1);

  if (nrCiekawostki == 1) {
      message.channel.send("Dobra dzieciaku grający w lola przez 4 lata swojego życia (czyli oczywiscie od urodzenia bo jestes takim tryhardem) kto cie kurwa pytał?");
    } else if (nrCiekawostki == 2) {
      message.channel.send("No u");
    } else if (nrCiekawostki == 3) {
      message.channel.send("Chyba ty");
    } else if (nrCiekawostki == 4) {
      message.channel.send("nO pO pROstU jEBniJ sIĘ w łEB");
    } else if (nrCiekawostki == 5) {
      message.channel.send("zastanawiałeś się nad samobójstwem?");
    } else if (nrCiekawostki == 6) {
      message.channel.send("Chłopie kto ciebie cegłą jebnął?");
    } else if (nrCiekawostki == 7) {
      message.channel.send("Odezwała się tocząca kulka metr dwadzieścia");
    } else if (nrCiekawostki == 8) {
      message.channel.send("Twoja stara jest taka gruba że mogłaby stanowić orbite dla planety");
    } else if (nrCiekawostki == 9) {
      message.channel.send("Jesteś taki zjebany, że próbowałeś utopić karpia na wigilie");
    } else if (nrCiekawostki == 10) {
      message.channel.send("Twój stary wyciąga chleb z piekarnika, jak Żydzi - wiecznie spalony");
    }



}