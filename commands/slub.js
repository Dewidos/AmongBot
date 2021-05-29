const Discord = require('discord.js');
module.exports = {

    "name": "slub",
    "description": "weźmij ślub z innym graczem!",

    async execute(message, args, client) {

        if (typeof args[0] !== 'undefined' && args[0] != "") {

            var id = args[0].replace(/[\\<>@#&!]/g, "");

            var user = message.guild.members.cache.get(id);

            if (typeof user !== 'undefined') {
                
                var embed = Discord.MessageEmbed()
                .setColor('#8B0000')
                .setTitle(`Gracz: ${message.author.username} ci sie oświadczył!`)
                .setDescription(`**Czy ty: <@${id}>, wyjdziesz za: ${message.author.username}?**`)
                .setFooter("Wybierz emotke: ✅ oznacza ze sie zgadzasz, ❌ oznacza że nie.")

                user.send(embed);

            } else {
                message.channel.send("**Podaj poprawny nick/id!**");
            }

        } else {
            message.channel.send("**Podaj osobe, której chcesz się oświadczyć!**")
        }


    }

}