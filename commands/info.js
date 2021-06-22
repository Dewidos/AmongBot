const Discord = require('discord.js');

module.exports = {
    "name": "info",
    "description": "Komenda wypisuje krótką informację o bocie.",
    execute(message, args, client) {
        var infoEmbed = new Discord.MessageEmbed().setColor('#34c6eb');

        if (args[0] == "-komendy") {
            infoEmbed.setTitle("Moje komendy :smiley:");

            for (const command of client.commands) {
                infoEmbed.addField(client.prefix + command[0], command[1].description, false);
            }
        } else {
            var description = `Nazywam się **${client.user.username}**. Zostałem stworzony przez gracza, zwanego **Dewidos**, z tagiem **8177**.\n\n**__Moje aktualne zadania to:__**\n\n**1.** Informowanie Ciebie o zwolnieniu miejsca na kanale głosowym, za pomocą komendy **${client.prefix}slotalert**.\n**2.** Powiadamianie Ciebie o nowej wersji modyfikacji Town Of Us oraz Town Of Impostors.\n**3.** Pomaganie moderatorom w weryfikowaniu Ciebie za pomocą komendy **${client.prefix}weryfikujgracza**.\n**4.** Pomaganie administracji w moderowaniu serwera.\n\n**Mój twórca na bieżąco mnie rozwija, więc będę robił coraz więcej rzeczy :P**\n\n**P.S.** Mojemu autorowi pomaga także **Otptrashuo#7163**, który jest jak Robin dla Batmana :laughing:. Pomaga wyłapywać błędy w kodzie, testować mnie oraz podsuwać nowe pomysły na moje funkcje :) Bardzo kocham swoich właścicieli :smiley:.`;

            infoEmbed.setTitle("**Informacje o mnie :smiley:**")
            .setDescription(description);
        }

        infoEmbed.setFooter("Polecam się na przyszłość :)");
        message.channel.send(infoEmbed);
    }
};