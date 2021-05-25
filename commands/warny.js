const Discord = require('discord.js');

module.exports = {
    "name": "warny",
    "description": "Wypisuje ostrzeżenia danego gracza, bądź ostatnie ostrzeżenie na serwerze.",
    execute(message, args, client) {
        var config = client.configFile.find(c => c.guildId == message.guild.id);

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

        if (player.user.bot) {
            message.channel.send("Bot nigdy nie ma warnów :smiley:");
            return;
        }
        
        var embed = new Discord.MessageEmbed()
                        .setColor('#34c6eb')
                        .setTitle(`Warny użytkownika: ${player.user.username}`)
                        .setFooter("Polecam się na przyszłość :)");
        
        var thereWasAWarning = false;

        for (const warn of punishments.warnings) {
            if (warn.userId == id) {
                embed.addField(`ID ostrzeżenia: ${warn.warnId}`, `**Kto otrzymał:** <@${warn.userId}>\n**Kto wystawił:** <@${warn.issuerId}>\n**Powód:** ${warn.reason}`, false);
                thereWasAWarning = true;
            }
        }

        if (!thereWasAWarning) {
            embed.addField("Ten użytkownik nie otrzymał jeszcze żadnego ostrzeżenia!", "Gratulujemy!", false);
        }

        message.channel.send(embed);
    }
}