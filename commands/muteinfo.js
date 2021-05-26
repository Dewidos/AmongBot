const Discord = require('discord.js');

module.exports = {
    "name": "muteinfo",
    "description": "Sprawdź powód mute lub na ile czasu został nadany!",

    execute(message, args, client) {

        if (typeof args[0] !== 'undefined' && args[0] != "") {

            var punishments = client.punishments.find(e => e.guildId == message.guild.id);
            var id = args[0].replace(/[\\<>@#&!]/g, "");
            var player = message.guild.members.cache.get(id);

            if (typeof player !== 'undefined') {

                var mute = punishments.mutes.find(m => m.userId == id);

                if (typeof mute !== 'undefined') {

                    var duration;
                    if (typeof mute.duration === 'undefined') {
                        duration = "nieokreślony";
                    }
                    else {
                        duration = mute.duration;
                    }

                    var embed = new Discord.MessageEmbed()
                    .setColor('#34c6eb')
                    .setTitle(`Informacje o mute użytkownika: ${player.user.username}!`)
                    .setDescription(`**Wyciszona osoba: <@${id}>\nWyciszony przez: <@${mute.issuerId}>\nCzas wyciszenia (w milisekundach): ${duration}\nZa: ${mute.reason}**`)
                    .setFooter("Polecam się na przyszłość :smiley:");

                    message.channel.send(embed);
                } else {

                    message.channel.send("**Aktualnie ten gracz nie ma żadnego wyciszenia!**");

                }


            } else {
                message.channel.send("**Podaj prawidłową nazwe gracza!**");
            }

        } else {

            message.channel.send("**Musisz wpisać nick/id gracza!**");

        }

    }
}