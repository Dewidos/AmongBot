const Discord = require('discord.js');

module.exports = {

    "name": "rank",
    "description": "Pozwala sprawdzić twój ranking",

    execute(message, args, client) {
        var rank = client.rank.find(e => e.guildID == message.guild.id);
        if (typeof args[0] !== 'undefined' && args[0] != "") {
            var id = args[0].replace(/[\\<>@#&!]/g, "");
            if (args[0] !== message.author.id) {

                if (typeof message.guild.members.cache.get(id) === 'undefined') {
                  message.channel.send("Gracza o takim ID nie ma na serwerze!");
                }
                
                var rankofplayer = rank.textChannelRank.find(r => r.userID == id);

                if (typeof rankofplayer === 'undefined') {
                    message.channel.send("Ten gracz nie napisał jeszcze żadnej wiadomości!");
                    return;
                }

                var checkingrankplayer = message.guild.members.cache.get(id);

                var progress = `${rankofplayer.experience} / ${rankofplayer.experienceToNextLvl}`;

                var embed = new Discord.MessageEmbed()
                .setColor('#34c6eb')
                .setTitle(`Ranking gracza: ${checkingrankplayer.user.username}`)
                .setDescription(`**Aktualny level to: ${rankofplayer.level}\nTemu graczowi do następnego levela zostało: ${progress}**`)
                .setFooter("Polecam się na przyszłość :)");

                message.channel.send(embed);

            } else {

                message.channel.send("**Jak chcesz sprawdzić swoją role to wpisz po prostu ab!rank :wink:**");

            }

        } else {
            
            var rankofplayer = rank.textChannelRank.find(r => r.userID == message.author.id);

            var progress = `${rankofplayer.experience} / ${rankofplayer.experienceToNextLvl}`;

            var embed = new Discord.MessageEmbed()
            .setColor('#34c6eb')
            .setTitle("Twój poziom!")
            .setDescription(`**Aktualny LVL:** ${rankofplayer.level}\n**Do następnego levela zostało ci __${progress}__ punktów EXPa.**`)
            .setFooter("Polecam się na przyszłość!");

            message.channel.send(embed);
        }

    }
}