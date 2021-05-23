const Discord = require('discord.js');

module.exports = {
    "name": "info",
    "description": "Komenda wypisuje krótką informację o bocie.",
    execute(message, args, client) {
        var description = "Nazywam się **AmongBot**. Zostałem stworzony przez gracza, zwanego **Dewidos**, z tagiem **8177**.\n\n**__Moje aktualne zadania to:__**\n\n**1.** Informowanie Ciebie o zwolnieniu miejsca na kanale głosowym, za pomocą komendy **ab!slotalert**.\n**2.** Powiadamianie Ciebie o nowej wersji modyfikacji Town Of Us oraz Town Of Impostors.\n\n**Mój twórca na bieżąco mnie rozwija, więc będę robił coraz więcej rzeczy :P**\n\n**P.S.** Mojemu autorowi pomaga także **Otptrashuo#7163**, który jest jak Robin dla Batmana :laughing:. Pomaga wyłapywać błędy w kodzie, testować mnie oraz podsuwać nowe pomysły na moje funkcje :) Bardzo kocham swoich właścicieli :smiley:.";
        
        var infoEmbed = new Discord.MessageEmbed()
        .setColor('#34c6eb')
        .setTitle("**Informacje o mnie :smiley:**")
        .setDescription(description);

        message.channel.send(infoEmbed);
    }
};