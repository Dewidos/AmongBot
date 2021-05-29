module.exports = {

    "name": "top",
    "description": "Ranking roli",

    execute(message, args, client) {

        if (typeof args[0] === 'undefined' || args[0] == "") {

            var rank = client.rank.find(e => e.guildID == message.guild.id);

            if (typeof rank === 'undefined') {

                message.channel.send("**Wystąpił błąd konfiguracji! Prawdopodobnie nie istnieje plik rank.json**");
                return;
            }


        } else {

            message.channel.send("**Ta komenda nie wymaga żadnego argumentu!**");

        }

    }


}