module.exports = {

    "name": "top",
    "description": "Ranking roli",

    execute(message, args, client) {

        var rank = client.rank.find(e => e.guildID == message.guild.id);

        if (typeof rank === 'undefined') {

            message.channel.send("**Wystąpił błąd konfiguracji! Prawdopodobnie nie istnieje plik rank.json**");
            return;
        }

        var sortTest = [2, 4, 4, 9, 1, 4, 18, 9, 128, 26, 7];

        for (let i = 0; i < sortTest.length; i++) {
            for (let j = sortTest.length - 1; j >= 0; j--) {
                let firstXp = sortTest[j];
                let secondXp = sortTest[j - 1];

                if (firstXp > secondXp) {
                    sortTest[j] = secondXp;
                    sortTest[j - 1] = firstXp;
                }
            }
        }

        message.channel.send(sortTest);

    }


}