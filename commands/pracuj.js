module.exports = {
    "name": "pracuj",
    "description": "Użyj tej komendy aby pracować i coś zarobić!",
    execute(message, args, client) {
        var economy = client.economy.find(e => e.guildId == message.guild.id);

        if (typeof economy === 'undefined') {
            message.channel.send("Wystąpił błąd konfiguracji ekonomii! Skontaktuj się z administracją.");
            return;
        }

        var id = message.author.id;
        var user = message.member;

        var dateNow = new Date();
        
        var nextWorkTime = new Date();
        nextWorkTime.setHours(nextWorkTime.getHours() + 1);

        var userBalance = economy.playerBalance.find(b => b.playerId == id);

        if (typeof userBalance === 'undefined') {
            userBalance = economy.playerBalance.push({
                "playerId": id,
                "walletMoney": "0",
                "bankMoney": "0",
                "nextPossibleWorkTime": nextWorkTime.toJSON()
            });

            var walletMoney = 0;
            var bankMoney = 0;
        } else {
            let nextPossibleWorkTime = new Date(userBalance.nextPossibleWorkTime);
            
            if (nextPossibleWorkTime > dateNow) {
                let timeToNextWork = nextPossibleWorkTime - dateNow;
                let minutesLeft = timeToNextWork.getMinutes();
                
                message.channel.send(`Nie możesz jeszcze pracować! Poczekaj jeszcze **${minutesLeft}**.`);
                return;
            }
            
            var walletMoney = parseInt(userBalance.walletMoney);
            var bankMoney = parseInt(userBalance.bankMoney);
        }

        var salary = Math.floor(Math.random() * 150 + 1);

        userBalance.walletMoney = (walletMoney + salary).toString();

        userBalance.nextPossibleWorkTime = nextWorkTime.toJSON();

        var embed = new Discord.MessageEmbed()
        .setColor('#34c6eb')
        .setTitle(`Ciężka praca się opłaca!`)
        .setDescription(`Pracodawca zapłacił Tobie **${salary} ${economy.currency.symbol}**. Brawo!`)
        .setFooter("Polecam się na przyszłość :)");

        message.channel.send(embed);
    }
}