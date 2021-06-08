const Discord = require('discord.js');

module.exports = {

    "name": "wiadomosci",
    "description": "Ta komenda pozwala zarzadac wiadomosciami na serverze",
    "aliases": ["messages"],

    execute(message, args, client) {

        if (typeof args[0] !== 'undefined') {

            if (args[0] == 'szukaj') {
                
                if (typeof args[1] !== 'undefined') {

                    var foundedMessage = message.guild.messages.cache.get(args[0]);

                    if (typeof foundedMessage !== 'undefined') {

                        var embed = new Discord.MessageEmbed()
                        .setColor('#34c6eb')
                        .setTitle(`Wiadomosc o id ${foundedMessage.id}!`)
                        .setDescription(`**${foundedMessage.content}**`)
                        .setFooter("Polecam się na przyszłość :)");


                    } else {

                        message.channel.send("Podaj prawidłowe id wiadomości!");

                    }

                } else {
                    message.channel.send("Podaj id wiadomosci, którą chcesz znaleść.");
                }

            }

        } else {
            message.channel.send("Aby zobaczyć opcje tej komendy wpisz 'ab!wiadomosci -help'");
        }

    }
    
}