const Discord = require('discord.js');

module.exports = {

    "name": "polecam",
    "description": "możesz polecić tym admina!",
    "aliases": ["polec"],

    execute(message, args, client) {

        var poleceni = client.poleceni.find(e => e.guildId == message.guild.id);

        if (typeof poleceni === 'undefined') {
            message.channel.send("Błąd konfiguracji systemu poleceń!");
            return;
        }

        var config = client.configFile.find(c => c.guildId == message.guild.id);

        if (typeof args[0] === 'undefined') {
            message.channel.send("Podaj prawidłowy nick admina, którego chcesz polecić!");
            return;
        }

        var messages = message.channel.messages.fetch({ limit: 2 }).then(messages => {
            let firstMessage = true;

            for (const collectionElement of messages) {
                if (firstMessage) {
                    firstMessage = false;
                    continue;
                }

                const messageFetched = collectionElement[1];

                console.log(messageFetched);
                let lines = messageFetched.content.split("\n");

                lines.forEach(l => lines[lines.indexOf(l)] = lines.split(": "));

                try {
                    if (lines.length != 3) throw new Error();

                    let idLine = lines.find(l => l[0].toLowerCase() == "nazwa");

                    if (typeof idLine === 'undefined') throw new Error();
                    
                    var id = idLine[1].replace(/[\\<>@#&!]/g, "");

                    let markLine = lines.find(l => l[0].toLowerCase() == "ocena");

                    if (typeof markLine === 'undefined') throw new Error();

                    var ocena = parseInt(markLine[1]);
            
                    if (typeof ocena === 'undefined' || isNaN(ocena)) throw new Error();
                } catch (error) {
                    message.channel.send("Błędny format polecenia!");
                    return;
                }
            }
        });

        if (message.author.id == id) {
            message.channel.send("Nie możesz sam sobie wystawić pochwały!");
            return;
        }

        if (config.moderatorRoles.length <= 0) {
            message.channel.send("Błąd konfiguracji! Nikt nie skonfigurował roli moderatorskich.");
            return;
        }

        var isModerator = false;

        config.moderatorRoles.forEach(role => {
            if (message.guild.members.cache.get(id).roles.cache.has(role)) {
                isModerator = true;
            }
        });

        if (!isModerator) {
            message.channel.send("Ta osoba nie należy do administracji!");
            return;
        }

        var hasPermission = true;

        config.moderatorRoles.forEach(role => {
            if (message.member.roles.cache.has(role)) {
                hasPermission = false;
            }
        });

        if (!hasPermission) {
            message.channel.send("Administrator nie może wystawiać pochwał!");
            return;
        }

        if (config.moderatorRoles.length <= 0) {
            message.channel.send("Błąd konfiguracji! Nikt nie skonfigurował roli moderatorskich.");
            return;
        }

        var hasPermission = false;

        config.moderatorRoles.forEach(role => {
            if (message.guild.members.cache.get(id).roles.cache.has(role)) {
                hasPermission = true;
            }
        });

        if (!hasPermission) {
            message.channel.send("Ta osoba nie należy do administracji!");
            return;
        }

        if (message.channel.id != config.polecAdminaChannelId) {
            message.channel.send(`Tej komendy można używać tylko na kanale <#${config.polecAdminaChannelId}>`);
            return;
        }

        if (typeof args[2] !== 'undefined') {

            var powodPolecenia = "";

            var length = args.length - 1;

            for (let i = 2; i <= length; i++) {
                powodPolecenia = powodPolecenia + args[i];
                if (i != length) powodPolecenia = powodPolecenia + " ";
            }

            var poleceniaTegoGracza = poleceni.polecenia.find(p => p.ktoPoleca == message.author.id && p.userId == id);

            if (typeof poleceniaTegoGracza === 'undefined') {

                poleceni.polecenia.push({

                    "userId": id,
                    "stars": ocena,
                    "reason": powodPolecenia,
                    "ktoPoleca": message.author.id

                });

                var embed = new Discord.MessageEmbed()
                    .setColor('#34c6eb')
                    .setTitle("Twoje polecenie zostało przekazane do bazy danych :smiley:")
                    .setDescription(`**Poleciłeś gracza <@${id}>\nZa: ${powodPolecenia}\nTwoja ocena: ${ocena}**`)
                    .setFooter("Pamiętaj! Jendego admina możesz polecić tylko raz.");

                message.channel.send(embed);

            } else {
                message.channel.send("Już raz poleciłeś tego admina!");
            }

        } else {
            message.channel.send("Powiedz dlaczego chcesz go polecić!");
        }

    }

}