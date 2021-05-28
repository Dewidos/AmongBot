const Discord = require('discord.js');

module.exports = {

    "name": "rank",
    "description": "Pozwala sprawdzić twój ranking",

    execute(message, args, client) {
        var rank = client.rank.find(e => e.guildID == message.guild.id);
        if (typeof args[0] !== 'undefined' && args[0] != "") {
            var id = args[0].replace(/[\\<>@#&!]/g, "");
            if (args[0] !== message.author.id) {

                var rankofplayer = rank.textchannelrank.find(r => r.userID == id);

                if (typeof rankofplayer !== 'undefined') {
                    message.channel.send("**Wystąpił bład lub podanego gracza nie ma na serverze, bądź nie napisał jeszcze żadnej wiadomości!**");
                    return;
                }

                var checkingrankplayer = message.guild.member.cache.get(id);

                var progress = `${rankofplayer.level} / ${rankofplayer.expiriencetonextlvl}`;

                var embed = new Discord.MessageEmbed()
                .setColor('#34c6eb')
                .setTitle(`Ranking gracza: ${checkingrankplayer.user.username}`)
                .setDescription(`**Aktualny level to: ${rankofplayer.level}\nTemu graczowi do następnego levela zostało: ${progress}**`)
                .setFooter("Polecam się na przyszłość!");

                message.channel.send(embed);

            } else {

                message.channel.send("**Jak chcesz sprawdzić swoją role to wpisz po prostu ab!rank :wink:**");

            }

        } else {
            
            var rankofplayer = rank.textchannelrank.find(r => r.userID == message.author.id);

            var progress = `${rankofplayer.expirience} / ${rankofplayer.expiriencetonextlvl}`;

            var embed = new Discord.MessageEmbed()
            .setColor('#34c6eb')
            .setTitle("Twój ranking!")
            .setDescription(`**Twój aktualny level to: ${rankofplayer.level}\nDo następnego levela zostało ci: ${progress}**`)
            .setFooter("Polecam się na przyszłość!");

            message.channel.send(embed);
        }

    }
}