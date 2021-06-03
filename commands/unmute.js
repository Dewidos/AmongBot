module.exports = {

    "name": "unmute",
    "description": "pozwala odciszyć wyciszonego gracza.",

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

        //implemetowanie punishments.json
        var punishments = client.punishments.find(e => e.guildId == message.guild.id);

        if (typeof args[1] === 'undefined') {

            var id = args[0].replace(/[\\<>@#&!]/g, "");

            var user = message.guild.members.cache.get(id);

            if (typeof user !== 'undefined') {
                if (typeof punishments.mutes.find(m => m.userId == id) !== 'undefined') {

                    var mute = punishments.mutes.find(m => m.userId == id);

                    try {
                        punishments.mutes.splice(punishments.mutes.indexOf(mute), 1);
                        client.updateConfig();
                        message.channel.send(`**Odciszyłem gracza:** *__${user.user.username}__*`);
                    } catch (error) {
                        console.error(error);
                    }

                    user.roles.remove(config.muteRole);

                } else {
                    if (user.roles.cache.has(config.muteRole)) {
                        user.roles.remove(config.muteRole);
                        message.channel.send(`**Odciszyłem gracza:** *__${user.user.username}__*`);
                        return;
                    }
                    
                    message.channel.send("**Ten gracz nie jest wyciszony!**");
                    return;
                }
            } else {
                message.channel.send("**Podaj prawidłową nazwę gracza!**");
            }

        } else {

            message.channel.send("**W tej komendzie możesz podać tylko gracza!**");

        }


    }

}