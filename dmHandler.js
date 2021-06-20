const { MessageEmbed } = require("discord.js");

module.exports = async (message, client) => {
    if (message.author.bot) return;
    
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
        let date = messageSendDate.getUTCDate();

        let hours = messageSendDate.getUTCHours();
        let minutes = messageSendDate.getUTCMinutes();
        let seconds = messageSendDate.getUTCSeconds();

        if (month < 10) month = `0${month}`;
        if (date < 10) date = `0${date}`;

        if (hours < 10) hours = `0${hours}`;
        if (minutes < 10) minutes = `0${minutes}`;
        if (seconds < 10) seconds = `0${seconds}`;

        embed.addField("Treść wiadomości", message.content, false);
        embed.addField("Data wysłania wiadomości (UTC)", `**Data:** ${date}.${month}.${messageSendDate.getUTCFullYear()}\n**Godzina:** ${hours}:${minutes}:${seconds}`)
        
        sendChannel.send(embed);
    }
};