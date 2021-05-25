module.exports = {
    "name": "usunwarn",
    "descriptions": "Usuwa ostrzeżenie o podanym identyfikatorze, bądź usuwa wszystkie ostrzeżenia danego gracza.",
    execute(message, args, client) {
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

        try {
            punishments.warnings.splice(punishments.warnings.indexOf(warn), 1);
        } catch (error) {
            message.channel.send("Z niewiadomych przyczyn nie udało się usunąć tego ostrzeżenia!");
            console.error(error);
            return;
        }

        message.channel.send(`Ostrzeżenie o id **${warn.warnId}** zostało usunięte :smiley:`);
    }
}