const Discord = require('discord.js');

module.exports = {
    "name": "warny",
    "description": "Wypisuje ostrzeżenia danego gracza, bądź ostatnie ostrzeżenie na serwerze.",
    execute(message, args, client) {
        var punishments = client.punishments.find(e => e.guildId == message.guild.id);

        if (typeof punishments === 'undefined') {
            message.channel.send("Błąd konfiguracji! Nic nie zrobisz, możesz tylko kopać lub rzuać...");
            return;
        }

        if (punishments.warnings.length <= 0) {
            message.channel.send("Nikt na tym serwerze nie otrzymał jeszcze ostrzeżenia!");
            return;
        }
        
        if (!(typeof args[0] !== 'undefined' && args[0] != "")) {

            var latestWarn = punishments.warnings[punishments.warnings.length - 1];
            
            var embed = new Discord.MessageEmbed()
                        .setColor('#34c6eb')
                        .setTitle("Najnowszy warn na serwerze")
                        .setFooter("Polecam się na przyszłość :smiley:")
                        .addField(`Identyfikator: ${latestWarn.warnId}`, `**Kto otrzymał:** <@${latestWarn.userId}>\n**Kto wystawił:** <@${latestWarn.issuerId}>\n**Powód:** ${latestWarn.reason}`, false);

            message.channel.send(embed);

            return;
        }

        var id = args[0].replace(/[\\<>@#&!]/g, "");

        var player = message.guild.members.cache.get(id);

        if (typeof player === 'undefined') {
            message.channel.send("Podaj poprawne ID gracza!");
            return;
        }

        if (player.id == '844926717084041238') {
            message.channel.send("Ja nigdy nie będę miał ostrzeżeń :P");
            return;
        }
        
        var embed = new Discord.MessageEmbed()
                        .setColor('#34c6eb')
                        .setTitle(`Warny użytkownika: ${player.nickname}`)
                        .setFooter("Polecam się na przyszłość :)");
        
        for (const warn of punishments.warnings) {
            if (warn.userId == id) embed.addField(`ID ostrzeżenia: ${warn.warnId}`, `**Kto otrzymał:** <@${warn.userId}>\n**Kto wystawił:** <@${warn.issuerId}>\n**Powód:** ${warn.reason}`, false);
        }

        message.channel.send(embed);
    }
}