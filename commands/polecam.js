const Discord = require('discord.js');

module.exports = {

    "name": "polecam",
    "description": "możesz polecić tym admina!",
    "aliases": "polec",

    execute(message, args, client) {

        var poleceni = client.poleceni.find(e => e.guildId == message.guild.id);

        var config = client.configFile.find(c => c.guildId == message.guild.id);

        if (typeof args[0] !== 'undefined') {
            message.channel.send("Podaj prawidłowy nick admina, którego chcesz polecić!");
            return;
        }

        var id = args[0].replace(/[\\<>@#&!]/g, "");

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

        if (typeof args[1] === 'undefined') {
            message.channel.send("Podaj ocene w skali 1 do 5 (napisz samą cyfre a nie np. 2/5)")
            return;
        }

        if (isNaN(args[1])) {
            message.channel.send("Ocena musi być cyfrą!");
            return;
        }

        if (!(args[1] < 6 && args[1] > 0)) {
            message.channel.send("Ocena musi być w skali od 1 do 5 (napisz samą cyfrę np. 2 a nie np. 2/5)");
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
                    "stars": args[1],
                    "reason": powodPolecenia,
                    "ktoPoleca": message.author.id

                });

                var embed = new Discord.MessageEmbed()
                    .setColor('#34c6eb')
                    .setTitle("Twoje polecenie zostało przekazane do bazy danych :smiley:")
                    .setDescription(`**Poleciłeś gracza <@${id}>\nZa: ${powodPolecenia}\nTwoja ocena: ${args[1]}**`)
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