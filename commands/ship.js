const Discord = require('discord.js');

module.exports = {

  "name": "ship",
  "description": "Sprawdź jak pasujesz do drugiej osoby!",

  execute(message, args, client) {

    const channelId = "848494212538171442";
    
    if (message.channel.id !== channelId) {
      message.channel.send(`**Do tej komendy jest przeznaczony specjalny kanał: <#${channelId}>**`);
      return;
    }

    if (typeof args[0] !== 'undefined' && args[0] != "" && typeof args[1] !== 'undefined' && args[1] != "") {

      var channel = message.guild.channels.cache.get(channelId);

      if (typeof channel === 'undefined') {
        message.channel.send("**Błąd konfiguracji! Skontaktuj się z administracją!**");
        return;
      }

      var shipy = client.forFun.find(s => s.guildID == message.guild.id);

      var id1 = args[0].replace(/[\\<>@#&!]/g, "");
      var id2 = args[1].replace(/[\\<>@#&!]/g, "");


      var firstOfShip = message.guild.members.cache.get(id1);
      var secondOfShip = message.guild.members.cache.get(id2);


      if (typeof firstOfShip !== 'undefined' && typeof secondOfShip !== 'undefined') {

        var ship = shipy.ships.find(s => ((s.firstNickId == id1 && s.secondNickId == id2) || (s.firstNickId == id2 && s.secondNickId == id1)));

        if (typeof ship === 'undefined') {

          var procentOfLove = Math.floor(Math.random() * 100 + 1);

          var embed = new Discord.MessageEmbed()
            .setColor('#34c6eb')
            .setTitle(`Ship graczy: ${firstOfShip.user.username} i ${secondOfShip.user.username}`)
            .setDescription(`**Ci gracze pasują do ciebie w ${procentOfLove}%!**`)
            .setFooter("Polecam się na przyszłość!");

          message.channel.send(embed);

          shipy.ships.push({

            "firstNickId": `${id1}`,
            "secondNickId": `${id2}`,
            "howMuchProcent": procentOfLove

          });

        } else {
          var embed = new Discord.MessageEmbed()
            .setColor('#34c6eb')
            .setTitle(`Ship graczy: ${firstOfShip.user.username} i ${secondOfShip.user.username}`)
            .setDescription(`**Ci gracze pasują do ciebie w ${ship.howMuchProcent}%!**`)
            .setFooter("Polecam się na przyszłość!");

          message.channel.send(embed);
        }


      } else {
        message.channel.send("**Podaj prawidłowe nicki graczy!**");
      }

    } else {
      message.channel.send("**Podaj prawidłowe nicki graczy!**");
    }

  }

}