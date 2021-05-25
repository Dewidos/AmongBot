module.exports = {
    "name": "warn",
    "description": "Nadaje ostrzeżenie użytkownikowi",
    execute(message, args, client)
    {
        if (!(typeof args[0] !== 'undefined' && args[0] != "")) {
            message.channel.send("Musisz podać id bądź oznaczyć gracza w tej komendzie!");
            return;
        }

        var id = args[0].replace(/[\\<>@#&!]/g, "");
        var reason = "";

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