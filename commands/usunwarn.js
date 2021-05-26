const giveWarnRole = require('./warn').giveWarnRole;

module.exports = {
    "name": "usunwarn",
    "description": "Usuwa ostrzeżenie o podanym identyfikatorze",
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
            message.channel.send("Musisz podać id ostrzeżenia w tej komendzie!");
            return;
        }
        
        var punishments = client.punishments.find(e => e.guildId == message.guild.id);

        if (typeof punishments === 'undefined') {
            message.channel.send("Błąd konfiguracji! Nic nie zrobisz, możesz tylko kopać lub rzuać...");
            return;
        }

        if (punishments.warnings.length <= 0) {
            message.channel.send("Nikt na tym serwerze nie otrzymał jeszcze ostrzeżenia!");
            return;
        }

        var warn = punishments.warnings.find(w => w.warnId == args[0]);

        if (typeof warn === 'undefined') {
            message.channel.send("Nie znalazłem ostrzeżenia o podanym id!");
            return;
        }

        var player = message.guild.members.cache.get(warn.userId);

        try {
            punishments.warnings.splice(punishments.warnings.indexOf(warn), 1);
        } catch (error) {
            message.channel.send("Z niewiadomych przyczyn nie udało się usunąć tego ostrzeżenia!");
            console.error(error);
            return;
        }

        var returnMessage = `Ostrzeżenie o id **${warn.warnId}** zostało usunięte :smiley:`;

        if (typeof player === 'undefined') {
            returnMessage = returnMessage + "\nUżytkownik jednak wyszedł już z serwera, więc był to nie potrzebny warn.";
        } else {
            giveWarnRole(punishments.warnings.filter(w => w.userId == player.id).length, player, config.warningRoles);
        }

        message.channel.send(returnMessage);
    }
}