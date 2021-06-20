module.exports = async (message, client) => {
    var guildsToSend = [];

    for (var guildConfig of client.configFile) {
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

    console.log(guildsToSend);
};