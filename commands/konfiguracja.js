const Discord = require("discord.js");

module.exports = {
    "name": "konfiguracja",
    "description": "Skonfiguruj mnie na tym serwerze!",
    async execute(message, args, client) {
        var config = client.configFile.find(c => c.guildId == message.guild.id);

        if (typeof config === 'undefined') {
            if (message.author.id != message.guild.ownerID) {
                message.channel.send("Pierwszą konfigurację przeprowadzić moze tylko właściciel!");
                return;
            }
        } else {
            if (typeof config.moderatorRoles === 'undefined' || config.moderatorRoles.length <= 0) {
                message.channel.send("Błąd konfiguracji! Niepoprawny format pliku konfiguracyjnego. Skontaktuj się z twórcami bota.");
                return;
            }

            let hasPermission = false;

            config.moderatorRoles.forEach(role => {
                if (message.member.roles.cache.has(role)) {
                    hasPermission = true;
                }
            });

            if (!hasPermission) {
                message.channel.send("Nie masz wystarczających uprawnień!");
                return;
            }
        }

        var configChannel = await message.guild.channels.create(`konfiguracja-${client.user.username}`, {
            type: 'text',
            permissionOverwrites: [
                {
                    id: guild.roles.everyone.id,
                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                },
                {
                    id: message.author.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                }
            ]
        });

        let infoEmbed = new Discord.MessageEmbed()
        .setColor('#34c6eb')
        .setTitle("Rozpocznijmy konfigurację!")
        .setDescription("Odpręż się, a ja zadam Tobie kilka pytań. Spokojnie, nie potrwa to zbyt długo.")
        .setFooter("Polecam się na przyszłość :)");

        message.channel.send(infoEmbed);
        message.channel.send("Najpierw proszę cię o wskazanie mi ról moderatorskich. Wystarczy że spingujesz każdą z nich w osobnej wiadomości. Gdy skończysz, wpisz **/koniec**");

        /*client.configFile.push({
            "guildId": message.guild.id,
            "modUpdateChannelId": "0",
            "vcNotifyLinks": [],
            "vcNotifyConfig": []
        });*/
    }
}