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
                var foundMessage;

                message.guild.channels.cache.forEach(channel => {
                   if (typeof channel === 'VoiceChannel') console.log("kanał głosowy");
                   else {
                       if (typeof foundMessage === 'undefined') foundMessage = await channel.messages.fetch(args[1]);
                   }
                });

                if (typeof foundMessage === 'undefined') waitMessage.edit("Nie znalazłem wiadomości o danym ID!");
                else {
                    waitMessage.edit("Znalazłem!");
                    console.log(foundMessage);
                }

                break;
        
            default:
                break;
        }

    }
    
}