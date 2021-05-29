const Discord = require("discord.js");

module.exports = {

    "name": "top",
    "description": "Ranking roli",

    execute(message, args, client) {

        var rank = client.rank.find(e => e.guildID == message.guild.id);

        if (typeof rank === 'undefined') {
            message.channel.send("Wystąpił błąd konfiguracji! Skontaktuj się z moimi twórcami.");
            return;
        }

        if (rank.textChannelRank.length <= 0) {
            message.channel.send("Nikt na tym serwerze nie otrzymał jeszcze punktów doświadczenia!");
            return;
        }

        if (rank.textChannelRank.length == 1) {
            var topExperienceObjects = [rank.textChannelRank[0]];
        } else {          
            for (let i = 0; i < rank.textChannelRank; i++) {
                for (let j = rank.textChannelRank - 1; j >= 0; j--) {
                    let firstXp = rank.textChannelRank[j];
                    let secondXp = rank.textChannelRank[j - 1];
    
                    if (parseInt(firstXp.experience) > parseInt(secondXp.experience)) {
                        rank.textChannelRank[j] = secondXp;
                        rank.textChannelRank[j - 1] = firstXp;
                    }
                }
            }

            var topExperienceObjects = rank.textChannelRank.filter(e => topExperienceObjects.indexOf(e) <= 9);
        }

        var embed = new Discord.MessageEmbed()
        .setTitle("**Top 10 wyników exp na serwerze:**")
        .setFooter("Polecam się na przyszłość :)");

        for (const expObj of topExperienceObjects) {
            embed.addField(`Miejsce ${topExperienceObjects.indexOf(expObj) + 1}:`, `**Gracz:** <@${topExperienceObjects.userID}>\n**Exp:** ${parseInt(expObj.experience)}`, false);
        }

        message.channel.send(embed);
    }
}