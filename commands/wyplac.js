const Discord = require('discord.js');

module.exports = {
    "name": "wyplac",
    "description": "Wypłać pieniądze z banku do portfela.",
    execute(message, args, client) {
        var economy = client.economy.find(e => e.guildId == message.guild.id);

        if (typeof economy === 'undefined') {
            message.channel.send("Wystąpił błąd konfiguracji ekonomii! Skontaktuj się z administracją.");
            return;
        }

        var id = message.author.id;
        var user = message.member;

        var userBalance = economy.playerBalance.find(b => b.playerId == id);

        if (typeof userBalance === 'undefined') {
            message.channel.send(`Nie masz jeszcze żadnych pieniędzy! Użyj na przykład komendy **${client.prefix}pracuj** aby zdobyć swoje pierwsze pieniądze!`);
            return;
        }

        var walletMoney = userBalance.walletMoney;
        var bankMoney = userBalance.bankMoney;

        if (walletMoney <= 0) {
            message.channel.send(`Nie masz żadnych środków do wypłaty! Aby podejrzeć swój majątek, użyj komendy **${client.prefix}balance**.`);
            return;
        }

        if (typeof args[0] === 'undefined' || args[0] == "") {
            var moneyToTransfer = bankMoney;
        } else {
            try {
                var moneyToTransfer = parseInt(args[0]);
            } catch (error) {
                message.channel.send("Podano zły format ilości pieniędzy do wypłaty!");
                console.error(error);
                return;
            }
        }

        userBalance.bankMoney -= moneyToTransfer;
        userBalance.walletMoney += moneyToTransfer;

        var embed = new Discord.MessageEmbed()
        .setColor('#34c6eb')
        .setTitle(`Udało się!`)
        .setDescription(`Wypłacono **${moneyToTransfer} ${economy.currency.symbol}** z banku do portfela!`)
        .setFooter("Polecam się na przyszłość :)");

        message.channel.send(embed);
    }
};