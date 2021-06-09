const Discord = require('discord.js');

module.exports = {

    "name": "wiadomosci",
    "description": "Ta komenda pozwala zarzadac wiadomosciami na serverze",
    "aliases": ["messages"],

    async execute(message, args, client) {

        if (typeof args[0] === 'undefined') {
            message.channel.send(`Musisz jeszcze podać wybraną funkcję tej komendy! Aby wyświetlić ich listę, wpisz **${client.prefix}wiadomosci -funkcje**`);
            return;
        }

        switch (args[0]) {
            case "szukaj":
            case "search":
                if (typeof args[1] === 'undefined') {
                    message.channel.send("Ta funkcja wymaga podania ID szukanej wiadomości!");
                    return;
                }

                var waitMessage = await message.channel.send("Czekaj...");
                var foundMessage = null;

                for (var channelArray of message.guild.channels.cache) {
                    const channel = channelArray[1];

                    if (typeof channel !== 'TextChannel') continue;
                    else {
                        if (typeof foundMessage === 'undefined' || foundMessage == null) foundMessage = await channel.messages.fetch(args[1]).catch(error => {});
                        else if (typeof foundMessage === 'Message') break;
                    }
                }

                if (typeof foundMessage === 'undefined' || foundMessage == null) waitMessage.edit("Nie znalazłem wiadomości o danym ID!");
                else {
                    waitMessage.edit(foundMessage.content);
                    console.log(foundMessage);
                }

                break;

            default:
                break;
        }

    }

}