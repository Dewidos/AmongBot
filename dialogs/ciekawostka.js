module.exports = (message, client) => {

  var nrCiekawostki = Math.floor(Math.random()*10+1);

  if (nrCiekawostki == 1) {
    message.channel.send("Nasza galaktyka w jezyku angielskim nazywa sie tak samo jak jednen batonik mianowicie: **Milkiway**");
  } else if (nrCiekawostki == 2) {
    message.channel.send("Nasza galaktyka ma 100 000 lat świetlnych średnicy.");
  } else if (nrCiekawostki == 3) {
    message.channel.send("Wieże eiffla pewnie znasz, ale zastanawiałeś się nad jej wysokością? Jest to całe **324**");
  } else if (nrCiekawostki == 4) {
    message.channel.send("'Losowanie' w kodowaniu nie jest w 100% losowe. Odbywa się to na zasadzie że np. mamy losowanie liczby w zakresie do 100 - to dzielimy liczbe sekund, które upłyneły od początku 1970 roku przez 100 i reszta to nasza 'losowa liczba'");
  } else if (nrCiekawostki == 5) {
    message.channel.send("zastanawiałeś się kiedyś ile istnieje piramid w egipcie? Jest to dokłanie **138**");
  } else if (nrCiekawostki == 6) {
    message.channel.send("Dużo osób uważa że: einstein był najmądrzejszym i najlepszym fizykiem wszechczasów - prawda jest taka, że najlepszym fizykiem wszechczasów był: Nikola Tesla");
  } else if (nrCiekawostki == 7) {
    message.channel.send("Wata cukrowa została **na prawdę** wynaleziona przez dentyste.");
  } else if (nrCiekawostki == 8) {
    message.channel.send("Na twoim ciele może być wiecej bakterii niż ludzi na ziemi");
  } else if (nrCiekawostki == 9) {
    message.channel.send("Discord ma biały motyw - dużo osób o tym nie wie");
  } else if (nrCiekawostki == 10) {
    message.channel.send("pierwszym faraonem był **Menes**");
  }


}