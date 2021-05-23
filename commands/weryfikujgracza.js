module.exports = {
    "name": "weryfikujgracza",
    "description": "Komenda weryfikująca danego gracza",
    execute(message, args, client) {             
        var roles = [
            '844199150878064683',
            '841576908248449055',
            '844464566346973224',
            '840960529191403580'
        ];
        
        if (!(typeof args[0] !== 'undefined' && args[0] != "")) {
            message.channel.send("Musisz podać id bądź oznaczyć gracza w tej komendzie!");
            return;
        }

        var hasPermission = false;

        roles.forEach(role => {
            if (message.member.roles.cache.has(role)) {
                hasPermission = true;
            }
        });

        if (hasPermission == false) {
            message.channel.send("Nie masz wystarczających uprawnień!");
            return;
        }

        var id = args[0].replace(/[\\<>@#&!]/g, "");

        try {
            var user = message.guild.members.cache.get(id);
            var verifiedRoleId = '844214020123000893';

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