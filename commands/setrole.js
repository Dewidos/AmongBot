module.exports = {

    "name": "setrole",
    "description": "Pozwala ustawic role",

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

        var id = args[0].replace(/[\\<>@#&!]/g, "");

        var gracz = message.guild.members.cache.get(id);

        if(typeof gracz !== 'undefined') {

            var roleId = args[1].replace(/[\\<>@#&!]/g, "");

            var role = message.guild.roles.cache.get(roleId);

            if (typeof role !== 'undefined') {

                gracz.roles.add(roleId);

                message.channel.send(`Nadałem graczowi **<@${gracz.id}>** role **${role.name}**`);

            } else {
                message.channel.send("Podaj prawidłowe id roli!");
                return;
            }

        } else {
            message.channel.send("Podaj prawidłowe id/nick gracza!");
            return;
        }

    }

}