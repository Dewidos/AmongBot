module.exports = {
    "name": "weryfikujgracza",
    "description": "Komenda weryfikująca danego gracza",
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

        try {
            var user = message.guild.members.cache.get(id);
            var verifiedRoleId = client.configFile.find(c => c.guildId == message.guild.id).verifiedRoleId;

            if (user.roles.cache.has(verifiedRoleId)) {
                user.roles.remove(verifiedRoleId);
                message.channel.send(`Usunąłem graczowi o id ${id} rolę **Zatwierdzony Gracz**.`);
            }
            else {
                user.roles.add(verifiedRoleId);
                message.channel.send(`Zweryfikowałem gracza o id ${id}!`);
            }
        }
        catch (error) {
            message.channel.send("Podaj prawidłowe id gracza!");
            console.error(error);
        }
    }
};