module.exports = {

    "name": "top",
    "description": "Ranking roli",

    execute(message, args, client) {

        var rank = client.rank.find(e => e.guildID == message.guild.id);

        if (typeof rank === 'undefined') {

            message.channel.send("**Wystąpił błąd konfiguracji! Prawdopodobnie nie istnieje plik rank.json**");
            return;
        }

        var sortTest = [2, 4, 4, 9, 1, 4];

        for (let i = 0; i < sortTest.length; i++) {
            for (let j = sortTest.length - 1; j >= 0; j--) {
                const index = sortTest.indexOf(xpObject);

                let firstXp = xpObject;
                let secondXp = sortTest[index - 1];

                if (firstXp > secondXp) {
                    sortTest[index] = secondXp;
                    sortTest[index - 1] = firstXp;
                }
            }
        }

        message.channel.send(sortTest);

    }


}