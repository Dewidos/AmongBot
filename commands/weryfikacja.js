const Discord = require('discord.js');

module.exports = {
  "name": "weryfikacja",
  "description": "pozwala zrobic weryfikacyjna wiadomość!",
  async execute(message, args, client) {

    var content = "";

    
    var config = client.configFile.find(c => c.guildId == message.guild.id);

    if(typeof config === 'undefined') {
      message.channel.send("Błąd konfiguracji!");
      return;
    }

    var weryficationChannel = client.configFile.find(m => m.weryficationChannel == message.channel.id);

    if (typeof weryficationChannel === "undefined") {
      message.channel.send("Tej komendy można używać tylko na kanale do weryfikacji!");
      return;
    }

    if (config.moderatorRoles.length <= 0) {
        message.channel.send("Błąd konfiguracji! Nikt nie skonfigurował roli moderatorskich.");
        return;
      }

      var hasPermission = false;

      config.moderatorRoles.forEach(role => {
        if (message.member.roles.cache.has(role)) {
            hasPermission = true;
        }
      });

      if (!hasPermission) {
        message.channel.send("Nie masz wystarczających uprawnień!");
        return;
      }

    if (typeof args[0] !== 'undefined' && args[0] != "") {
          var length = args.length;

          for (let i = 0; i <= length; i++) {
              content = content + args[i];
              if (i != length) content = content + " ";
          }
      }
    if (content.endsWith("undefined")) {
      content = content.replace("undefined", "");
    }

    let embed = new Discord.MessageEmbed()
          .setColor('#27f500')
          .setTitle("Weryfikacja!")
          .setDescription(`**${content}**`)
          .setFooter("Klkiknij ✅, aby się zweryfikować!");
    
    let messageEmbed = await message.channel.send(embed);

    await messageEmbed.react('✅');

    client.on('messageReactionAdd', async (reaction, user) => {

      if (reaction.message.partial) await reaction.message.fetch();
      if (reaction.partial) await reaction.fetch();
      if (user.bot) return;
      if (!reaction.message.guild) return;

      if (reaction.message.channel.id == weryficationChannel) {

        reaction.guild.channels.cache.get(message.channel.id).send("siema");
        
      }

    });

  }
}