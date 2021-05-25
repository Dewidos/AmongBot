module.exports = {
    "name": "kick",
    "description": "Wyrzuca gracza z serwera.",
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

        if (!(typeof args[0] !== 'undefined' && args[0] != "")) {
            message.channel.send("Musisz podać id bądź oznaczyć gracza w tej komendzie!");
            return;
        }

        var id = args[0].replace(/[\\<>@#&!]/g, "");

        var player = message.guild.members.cache.get(id);

        if (typeof player === 'undefined') {
            message.channel.send("Podaj poprawne ID gracza!");
            return;
        }

        if (player.user.bot) {
            message.channel.send("Nie możesz wyrzucić bota!");
            return;
        }

        if (!player.kickable) {
            message.channel.send("Nie mogę wyrzucić tego gracza!");
            return;
        }

        var username = player.user.username;
        var discriminator = player.user.discriminator;
        
        player.kick();

        message.channel.send(`Wyrzucono gracza o nicku **${username}#${discriminator}**!`);
    }
}