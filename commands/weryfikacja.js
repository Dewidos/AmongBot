const Discord = require('discord.js');

module.exports = {
  "name": "weryfikacja",
  "description": "pozwala zrobic weryfikacyjna wiadomość!",
  async execute(message, args, client) {

    var content = "";

    var config = client.configFile.find(c => c.guildId == message.guild.id);

    if (typeof config === 'undefined') {
      message.channel.send("Błąd konfiguracji!");
      return;
    }

    var verificationChannel = message.guild.channels.cache.get(config.verificationChannel);

    if (typeof verificationChannel === "undefined") {
      message.channel.send("Błąd konfiguracji!");
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
        if (typeof args[i] === 'undefined' || args[i] == "") continue;
        content = content + args[i];
        if (i != length) content = content + " ";
      }
    }

    let embed = new Discord.MessageEmbed()
      .setColor('#27f500')
      .setTitle("Weryfikacja!")
      .setDescription(`**${content}**`)
      .setFooter("Kliknij ✅, aby się zweryfikować!");

    var messageEmbed = await verificationChannel.send(embed);

    await messageEmbed.react('✅');

    var callback = async (reaction, user) => {

      if (reaction.message.partial) await reaction.message.fetch();
      if (reaction.partial) await reaction.fetch();

      if (reaction.message != messageEmbed) return false;

      if (reaction.emoji.name === '✅') {
        let member = message.guild.members.cache.get(user.id);

        if (typeof member === 'undefined') {
          message.channel.send("Wystąpił dziwny błąd!");
          return false;
        }

        member.roles.add(config.verificationRole);
      }

      return false;
    };

    client.reactionCallbacks.push(callback);

  }
}