const Discord = require('discord.js');

module.exports = {
    "name": "balans",
    "description": "Sprawdź ile masz pieniędzy!",
    execute(message, args, client) {
        var economy = client.economy.find(e => e.guildId == message.guild.id);

        if (typeof economy === 'undefined') {
            message.channel.send("Wystąpił błąd konfiguracji ekonomii! Skontaktuj się z administracją.");
            return;
        }

        if (typeof args[0] === 'undefined' || args[0] == "") {
            var id = message.author.id;
            var user = message.member;
        } else {
            var id = args[0].replace(/[\\<>@#&!]/g, "");
            var user = message.guild.members.cache.get(id);
        }

        if (typeof user === 'undefined') {
            message.channel.send("Wystąpił nieznany błąd! Spróbuj ponownie później, powiadom developera o problemie.");
            return;
        }

        var userBalance = economy.playerBalance.find(b => b.playerId == id);

        if (typeof userBalance === 'undefined') {
            var walletMoney = 0;
            var bankMoney = 0;
        } else {
            var walletMoney = userBalance.walletMoney;
            var bankMoney = userBalance.bankMoney;
        }

        var embed = new Discord.MessageEmbed()
        .setColor('#34c6eb')
        .setTitle(`Majątek gracza ${user.user.username}`)
        .setDescription(`**Pieniądze w portfelu:** ${walletMoney} ${economy.currency.symbol}\n**Pieniądze w banku:** ${bankMoney} ${economy.currency.symbol}`)
        .setFooter("Polecam się na przyszłość :)");
        
        message.channel.send(embed);
    }
};