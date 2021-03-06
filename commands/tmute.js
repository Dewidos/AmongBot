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

        if (typeof args[1] === 'undefined' || args[1] == "") {
            message.channel.send("Musisz podać czas :unamused:");
            return;
        }

        var time = args[1];
        if (args[1].endsWith("m")) {

            try {
                var czas = args[1].replace("m", "");
                var timetype = "m";
                czas = parseInt(czas);

                if (czas === null) {
                    message.channel.send("Wprowadź prawidłowy czas!");
                    return;
                }

                czas = czas * 60000;
            } catch (error) {
                message.channel.send("Wystąpił błąd, prosze spróbuj ponownie.");
                console.error(error);
            }

            //mute na godziny
        } else if (args[1].endsWith("h")) {

            try {
                var czas = args[1].replace("h", "");
                var timetype = "h";
                czas = parseInt(czas);
                if (czas === null) {
                    message.channel.send("Wprowadź prawidłowy czas!");
                    return;
                }
                czas = czas * 3600000;
            } catch (error) {
                message.channel.send("Wystąpił błąd, prosze spróbuj ponownie.");
            }

            //mute na dni
        } else if (args[1].endsWith("d")) {

            try {
                var czas = args[1].replace("d", "");
                var timetype = "d";
                czas = parseInt(czas);
                if (czas === null) {
                    message.channel.send("Wprowadź prawidłowy czas!");
                    return;
                }
                czas = czas * 86400000;
            } catch (error) {
                message.channel.send("Wystąpił błąd, prosze spróbuj ponownie.");
            }

        } else if (args[1].endsWith("s")) {

            try {
                var czas = args[1].replace("s", "");
                var timetype = "s";
                czas = parseInt(czas);
                if (czas === null) {
                    message.channel.send("Wprowadź prawidłowy czas!");
                    return;
                }
                czas = czas * 1000;
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

            for (let i = 2; i <= length; i++) {
                reason = reason + args[i];
                if (i != length) reason = reason + " ";
            }
        }

        var player = message.guild.members.cache.get(id);

        if (typeof player === 'undefined') {
            message.channel.send("Nie znalazłem gracza o takim id :cry:");
            return;
        }

        if (typeof punishments.mutes.find(m => m.userId == id) !== 'undefined') {
            message.channel.send("Ten gracz jest już wyciszony!");
            return;
        }

        if (czas != null) {
            let currentDate = new Date();
            currentDate.setMilliseconds(currentDate.getMilliseconds() + czas);
            
            let dateJSON = currentDate.toJSON();
            
            punishments.mutes.push({
                "userId": id,
                "issuerId": message.author.id,
                "duration": czas,
                "reason": reason,
                "timetype": timetype,
                "expires": dateJSON
            });

            var embed = new Discord.MessageEmbed()
            .setColor('#34c6eb')
            .setTitle("Wykonano!")
            .setDescription(`**Wyciszyłem gracza o nicku: **<@${id}>\n\n**Czas wyciszenia:** ${time}\n**Powód:** ${reason}`)
            .setFooter("Polecam się na przyszłość :smiley:");

            message.channel.send(embed);
            player.roles.add(config.muteRole);
            
            this.muted(czas, player, client, message);

            client.updateConfig();
        } else {
            message.channel.send("Wystąpił bliżej niezidentyfikowany błąd!");
            return;
        }


    },
    muted(time, mutedplayer, client, message) {

        setTimeout(() => {

            mutedplayer.roles.remove(config.muteRole);

            var punishments = client.punishments.find(e => e.guildId == message.guild.id);

            if (typeof punishments === 'undefined') {
                console.error("Błąd przy szukaniu tablicy kar!");
                return;
            }

            var mute = punishments.mutes.find(m => m.userId == mutedplayer.id);

            try {
                punishments.mutes.splice(punishments.mutes.indexOf(mute), 1);
                client.updateConfig();
            } catch (error) {
                console.error(error);
            }

        }, time)
    }
}
