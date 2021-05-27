module.exports = {

    "name": "clear",
    "description:": "możesz wyczyścić wiadomości",

    async execute(message, args, client) {

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
        
        if (typeof args[0] !== 'undefined' && args[0] != "") {
            if (isNaN(args[0])) {
                message.channel.send("**Podany argument musi być liczbą**");
                return;
            } else {
                if (args[0] > 100) {
                    message.channel.send("Nie możesz usunać wiecej niż 100 wiadomości!");
                }
                if (args[0] < 1) {
                    
                    message.channel.send("Nie mozesz usunac mniej niz 1 wiadomość!");
                    
                    return;
                };
                await message.channel.messages.fetch({Limit: args[0]}).then(messages => {

                    message.channel.bulkDelete(messages);
                    message.channel.send(`**Usuwanie ${args[0]} wiadomości**`);
                });
            }
        } else {
            message.channel.send("**Musisz podać ile wiadomości chcesz usunąć**");
        }

    }


}