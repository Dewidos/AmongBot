module.exports = {

    "name": "pkn",
    "description": "zagraj w papier, kamień nożyce!",

    execute(message, args, client) {

        if(typeof args[0] !== 'undefined') {

            var forfun = client.forFun.find(e => e.guildID == message.guild.id);

            var argument = args[0];

            var tickTacToeOptions = forfun.pkn.find(e => e.argument !== 'undefined');

            if (typeof tickTacToeOptions === 'undefined') {
                message.channel.send("Podaj prawidłowy argument");
                return;
            }

            var tickTacToe = Math.floor(Math.random()*3+1);

            if (tickTacToe = 1) {
                var botOption = "papier";
            } else if (tickTacToe = 2) {
                var botOption = "kamień";
            } else if (tickTacToe = 3) {
                var botOption = "nożyce";
            }

            console.log(botOption);

            if (tickTacToeOptions === 'paper' && botOption === 'kamień') {
                message.channel.send(`**Brawo wygrałeś ${message.author}. Papier bije kamień!**`);
                return;
            } else if (tickTacToeOptions === 'scisors' && botOption === 'kamień') {
                message.channel.send(`**Niestety przegrałeś ${message.author}. Kamień bije nożyczki!**`);
                return;
            } else if (tickTacToeOptions === 'stone' && botOption === 'nożyce') {
                message.channel.send(`**Brawo wygrałeś ${message.author}. Kamień bije nożyce!**`);
                return;
            } else if (tickTacToeOptions === 'paper' && botOption === 'nożyce') {
                message.channel.send(`**Niestety przegrałeś ${message.author}. Nożyce biją papier!**`);
                return;
            } else if (tickTacToeOptions === 'stone' && botOption === 'papier') {
                message.channel.send(`**Niestety przegrałeś ${message.author}. Papier bije kamień!**`);
                return;
            } else if (tickTacToeOptions === 'scisors' && botOption === 'papier') {
                message.channel.send(`**Brawo wygrałeś ${message.author}. Nożyce bije papier!**`);
                return;
            }

        }


    }

}