const Discord = require('discord.js');

module.exports = {

    "name": "polecenia",
    "description": "Sprawdz polecenia tego admina",


    execute(message, args, client) {
        
        if (typeof args[0] !== 'undefined') {

            var id = args[0].replace(/[\\<>@#&!]/g, "");

            var user = message.guild.members.cache.get(id);

            if (typeof user !== 'undefined') {

                var poleceni = client.poleceni.find(e => e.guildId == message.guild.id);

                var poleceniaNaTegoAdmina = poleceni.polecenia.find(p => p.userId == id);

                const embed = new Discord.MessageEmbed()
                        .setColor('#34c6eb')
                        .setTitle(`Polecenia gracza ${user.user.username}!`)
                        .setFooter("Polecam się na przyszłość!");

                var mamyPolecenie = false;

                for (var polecony of poleceni.polecenia) {

                    if (polecony.userId == id) {

                        embed.addField(`**Za:** ${polecony.reason}\n`, `Ocena: ${polecony.stars}\n\n`, false);
                        mamyPolecenie = true;
                        
                    }

                }

                if (!mamyPolecenie) {
                    embed.addField("Ten administrator nie otrzymał jeszcze żadnego polecenia!", false);
                    return;
                } else {
                    message.channel.send(embed);
                }

            } else {
                message.channel.send("Podaj **prawidłowy** nick/id admina którego chcesz polecić!");
            }

        } else {
            message.channel.send("podaj nick admina którego polecenia checsz zobaczyć!");
        }


    }
}