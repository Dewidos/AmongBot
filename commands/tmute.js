const Discord = require('discord.js');

module.exports = {

    "name": "tmute",
    "description": "czasowo wycisz jakiegoś użytkownika!",

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

        if (typeof args[0] === 'undefined' || args[0] == "") {
            message.channel.send("Musisz podać ID gracza!");
            return;
        }

        var id = args[0].replace(/[\\<>@#&!]/g, "");

        if (typeof args[1] !== 'undefined' && args[1] != "") {
            message.channel.send("Musisz podać czas :unamused:");
            return;
        }

        var time = args[1];
        if (args[1].endsWith("m")) {

            try {
                var czas = args[1].replace("m", "");
                console.log(czas);
                czas = parseInt(czas);
                console.log(typeof czas);

                if (czas === null) {
                    message.channel.send("Wprowadź prawidłowy czas!");
                    return;
                }

                czas = czas * 60000;
                console.log(czas + " - obliczone milisekundy");
            } catch (error) {
                message.channel.send("Wystąpił błąd, prosze spróbuj ponownie.");
                console.error(error);
            }

            //mute na godziny
        } else if (args[1].endsWith("h")) {

            try {
                var czas = args[1].replace("h", "");
                czas = parseInt(czas);
                if (czas === null) {
                    message.channel.send("Wprowadź prawidłowy czas!");
                    return;
                }
                czas = czas * 3600000;
                console.log(czas);
            } catch (error) {
                message.channel.send("Wystąpił błąd, prosze spróbuj ponownie.");
            }

            //mute na dni
        } else if (args[1].endsWith("d")) {

            try {
                var czas = args[1].replace("d", "");
                czas = parseInt(czas);
                if (czas === null) {
                    message.channel.send("Wprowadź prawidłowy czas!");
                    return;
                }
                czas = czas * 86400000;
                console.log(czas);
            } catch (error) {
                message.channel.send("Wystąpił błąd, prosze spróbuj ponownie.");
            }

        } else if (args[1].endsWith("s")) {

            try {
                var czas = args[1].replace("s", "");
                czas = parseInt(czas);
                if (czas === null) {
                    message.channel.send("Wprowadź prawidłowy czas!");
                    return;
                }
                czas = czas * 1000;
                console.log(czas);
            } catch (error) {
                message.channel.send("Wystąpił błąd, prosze spróbuj ponownie.");
            }

        } else {
            message.channel.send("Zły format czasu muta!");
            return;
        }

        //ustalamy powód
        var reason = "";

        if (typeof args[2] !== 'undefined' && args[2] != "") {
            var length = args.length - 1;

            for (let i = 1; i <= length; i++) {
                reason = reason + args[i];
                if (i != length) reason = reason + " ";
            }
        }

        var player = message.guild.members.cache.get(id);

        if (typeof player === 'undefined') {
            message.channel.send("Nie znalazłem gracza o takim id :cry:");
            return;
        }

        if (czas != null) {
            punishments.mutes.push({
                "userId": id,
                "issuerId": message.author.id,
                "duration": czas,
                "reason": reason,
            });

            var embed = new Discord.MessageEmbed()
            .setColor('#34c6eb')
            .setTitle("Wykonano!")
            .setDescription(`**Wyciszyłem gracza o nicku: **<@${id}>\n\n**Na czas:** ${time}`)
            .setFooter("Polecam się na przyszłość :smiley:");

            message.channel.send(embed);
            player.roles.add('841617507168288798');
            
            this.muted(czas, player, client, message);

            client.updateConfig();
        } else {
            message.channel.send("Wystąpił bliżej niezidentyfikowany błąd!");
            return;
        }


    },
    muted(time, mutedplayer, client, message) {

        setTimeout(function () {

            mutedplayer.roles.remove('841617507168288798');

            var punishments = client.punishments.find(e => e.guildId == message.guild.id);
            var mute = client.punishments.mutes.find(m => m.userId == mutedplayer.id);

            try {
                punishments.mutes.splice(punishments.mutes.indexOf(mute), 1);
                client.updateConfig();
            } catch (error) {
                console.error(error);
            }

        }, time)
    }
}
