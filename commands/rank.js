const Discord = require('discord.js');

module.exports = {

    "name": "rank",
    "description": "Pozwala sprawdzić twój ranking",

    execute(message, args, client) {
        var rank = client.rank.find(e => e.guildID == message.guild.id);

        if (typeof args[0] === 'undefined' || args[0] == "") {
            var id = message.author.id;
        } else {
            var id = args[0].replace(/[\\<>@#&!]/g, "");
        }

        var member = message.guild.members.cache.get(id);

        if (typeof member === 'undefined') {
            message.channel.send("Gracza o takim ID nie ma na serwerze!");
            return;
        }

        var rankofplayer = rank.textChannelRank.find(r => r.userID == id);

        if (typeof rankofplayer === 'undefined') {
            let messageToSend = "Ten gracz nie napisał jeszcze żadnej wiadomości!";

            if (id == message.author.id)
                messageToSend = "Nie napisałeś jeszcze żadnej wiadomości!";

            message.channel.send("Ten gracz nie napisał jeszcze żadnej wiadomości!");
            return;
        }

        var progress = `${rankofplayer.experience} / ${rankofplayer.experienceToNextLvl}`;

        var embed = new Discord.MessageEmbed()
            .setColor('#34c6eb')
            .setTitle(`Ranking gracza ${member.user.username}`)
            .setDescription(`**Aktualny poziom: ${rankofplayer.level}\nDo następnego poziomu zostało: ${progress}**`)
            .setFooter("Polecam się na przyszłość :)");

        message.channel.send(embed);


    }
}