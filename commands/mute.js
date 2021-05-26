const Discord = require('discord.js')

module.exports = {

    "name": "mute",
    "description": "wycisz gracza na nieograniczony czas",

    execute(message, args, client) {

        var config = client.configFile.find(c => c.guildId == message.guild.id);

        if (config.moderatorRoles.length <= 0) {
            message.channel.send("Błąd konfiguracji! Nikt nie skonfigurował roli moderatorskich.");
            return;
        }

        var hasPermission = false;

        config.moderatorRoles.forEach(role => {
            if (message.member.roles.cache.has(role)) {
                hasPermission = true;
            }
        });

        if (!hasPermission) {
            message.channel.send("Nie masz wystarczających uprawnień!");
            return;
        }
        
        var punishments = client.punishments.find(e => e.guildId == message.guild.id);

        if (typeof args[0] !== 'undefined' && args[0] != "") {

            if (typeof args[1] !== 'undefined' || args[1] == "") {
                
                var reason = "";

                var length = args.length - 1;
    
                for (let i = 1; i <= length; i++) {
                    reason = reason + args[i];
                    if (i != length) reason = reason + " ";
                }
                
                var id = args[0].replace(/[\\<>@#&!]/g, "");
                var player = message.guild.members.cache.get(id);

                if (typeof player !== 'undefined') {
                    
                    var embed = new Discord.MessageEmbed()
                    .setColor('#34c6eb')
                    .setTitle("Wykonano!")
                    .setDescription(`**Wyciszyłem gracza o nicku: **<@${id}>\n\n**Za: **__${reason}__`)
                    .setFooter("Polecam się na przyszłość!");

                    message.channel.send(embed);
                    try {
                        punishments.mutes.push({
                            "userId": id,
                            "issuerId": message.author.id,
                            "reason": reason,
                        });
    
                        player.roles.add('841617507168288798');
                    } catch (error) {
                        console.error(error);
                    }
                    

                } else {
                    message.channel.send("**Podaj prawidłową nazwę gracza!**");
                }
            } else {

                var id = args[0].replace(/[\\<>@#&!]/g, "");
                var player = message.guild.members.cache.get(id);

                if (typeof player !== 'undefined') {
                    
                    var embed = new Discord.MessageEmbed()
                    .setColor('#34c6eb')
                    .setTitle("Wykonano!")
                    .setDescription(`**Wyciszyłem gracza o nicku: **<@${id}>\n\n**Za: **__Powód nie został określony__`)
                    .setFooter("Polecam się na przyszłość!");

                    message.channel.send(embed);
                    try {
                        punishments.mutes.push({
                            "userId": id,
                            "issuerId": message.author.id,
                            "reason": "Powód nie został określony",
                        });
    
                        player.roles.add('841617507168288798');
                    } catch (error) {
                        console.error(error);
                    }

                }
            }
        } else {
            message.channel.send("**Musisz podać nazwe gracza, krórego chcesz wyciszyć!**")
        }

    }

}