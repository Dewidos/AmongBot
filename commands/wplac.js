const Discord = require('discord.js');

module.exports = {
    "name": "wplac",
    "description": "Wpłać pieniądze do banku.",
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

        var walletMoney = parseInt(userBalance.walletMoney);
        var bankMoney = parseInt(userBalance.bankMoney);

        if (walletMoney <= 0) {
            message.channel.send(`Nie masz żadnych środków do wpłaty! Aby podejrzeć swój majątek, użyj komendy **${client.prefix}balans**.`);
            return;
        }

        if (typeof args[0] === 'undefined' || args[0] == "") {
            var moneyToTransfer = walletMoney;
        } else {
            try {
                var moneyToTransfer = parseInt(args[0]);
                if (Number.isNaN(moneyToTransfer)) throw new Error();
            } catch (error) {
                message.channel.send("Podano zły format ilości pieniędzy do wpłaty!");
                console.error(error);
                return;
            }
        }

        if (walletMoney < moneyToTransfer) {
            message.channel.send(`Nie masz wystarczającej ilości środków do wpłaty! Aby podejrzeć swój majątek, użyj komendy **${client.prefix}balans**.`);
            return;
        }

        userBalance.bankMoney = (bankMoney + moneyToTransfer).toString();
        userBalance.walletMoney = (walletMoney - moneyToTransfer).toString();

        var embed = new Discord.MessageEmbed()
        .setColor('#34c6eb')
        .setTitle(`Udało się!`)
        .setDescription(`Wpłacono **${moneyToTransfer} ${economy.currency.symbol}** na konto w banku!`)
        .setFooter("Polecam się na przyszłość :)");

        message.channel.send(embed);
    }
};