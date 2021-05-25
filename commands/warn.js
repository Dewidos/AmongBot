module.exports = {
    "name": "warn",
    "description": "Nadaje ostrzeżenie użytkownikowi",
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
        var reason = "";

        var player = message.guild.members.cache.get(id);

        if (typeof player === 'undefined') {
            message.channel.send("Podaj poprawne ID gracza!");
            return;
        }

        if (player.user.bot) {
            message.channel.send("Nie możesz ostrzec bota!");
            return;
        }
        
        if (typeof args[1] !== 'undefined' && args[1] != "") {
            var length = args.length - 1;

            for (let i = 1; i <= length; i++) {
                reason = reason + args[i];
                if (i != length) reason = reason + " ";
            }
        }

        var punishments = client.punishments.find(e => e.guildId == message.guild.id);

        if (typeof punishments === 'undefined') {
            message.channel.send("Błąd konfiguracji! Nic nie zrobisz, możesz tylko kopać lub rzuać...");
            return;
        }

        punishments.warnings.push({
            "userId": id,
            "issuerId": message.author.id,
            "warnId": punishments.nextWarnId,
            "reason": reason
        });

        var nextId = parseInt(punishments.nextWarnId);
        nextId++;
        punishments.nextWarnId = nextId.toString();

        message.channel.send(`Nadałem warna graczowi o nicku <@${id}>`);
    }
}