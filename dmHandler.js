const { MessageEmbed } = require("discord.js");

module.exports = async (message, client) => {
    var guildsToSend = [];

    for (const guildConfig of client.configFile) {
        let guild = client.guilds.cache.get(guildConfig.guildId);

        if (typeof guild === 'undefined') continue;

        let guildMember = await guild.members.fetch(message.author.id);

        if (typeof guildMember === 'undefined') continue;

        if (isNaN(parseInt(guildConfig.botDmForwardChannel)) || parseInt(guildConfig.botDmForwardChannel) <= 0) {
            console.error("Błąd konfiguracji dla serwera o ID: " + guildConfig.guildId);
            continue;
        }
        
        guildsToSend.push([guild, guildConfig.botDmForwardChannel]);
    }

    if (guildsToSend.length <= 0) return;

    for (const sendInfoArray of guildsToSend) {
        let sendChannel = await sendInfoArray[0].channels.cache.get(sendInfoArray[1]);

        if (typeof sendChannel === 'undefined') {
            console.error("Błędne ID kanału do przekierowania wiadomości z pw dla serwera o ID: " + guildConfig.guildId);
            continue;
        }

        let embed = new MessageEmbed()
        .setColor('#34c6eb')
        .setFooter("Polecam się na przyszłość :)")
        .setTitle("Wiadomość do administracji")
        .setAuthor(message.author.username, `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`);

        let messageSendDate = new Date(message.createdAt);
        let month = messageSendDate.getUTCMonth() + 1;

        if (month < 10) month = `0${month}`;

        embed.addField("Treść wiadomości", message.content, false);
        embed.addField("Data wysłania wiadomości (UTC)", `${messageSendDate.getUTCDate()}.${month}.${messageSendDate.getUTCFullYear()}\n${messageSendDate.getUTCHours()}:${messageSendDate.getUTCMinutes()}:${messageSendDate.getUTCSeconds()}`)
        
        sendChannel.send(embed);
    }
};