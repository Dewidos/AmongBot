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

                message.guild.channels.cache.forEach(channel => {
                   console.log(channel[1]); 
                });

                message.channel.send("Work in progress!");

                break;
        
            default:
                break;
        }

    }
    
}