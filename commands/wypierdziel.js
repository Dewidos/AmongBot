module.exports = {
    "name": "wypierdziel",
    "description": "Wypierdziela kogoś na zbity pysk.",
    "aliases": [
        "wypierdol",
        "wyjeb"
    ],
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

        if (typeof args[0] === 'undefined' || args[0] == "") {
            message.channel.send("Musisz podać ID gracza!");
            return;
        }

        var id = args[0].replace(/[\\<>@#&!]/g, "");

        var player = message.guild.members.cache.get(id);

        if (typeof player === 'undefined') {
            message.channel.send("Nie umiem znaleźć gracza o takim ID :(");
            return;
        }

        if (!player.bannable) {
            message.channel.send("Nie umiem wykonać tej komendy na tym graczu! *Ta owca jest jakaś niezniszczalna!*");
            return;
        }

        message.channel.send(`**${player.user.username}** has been wypierdzieloned.`);

        setTimeout(() => player.ban().then(() => message.channel.send("XD co za debil LOL :rofl:")), 3000);
    }
};