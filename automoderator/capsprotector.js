module.exports = (message, client) => {
    var config = client.configFile.find(c => c.guildId == message.guild.id);
    var punishments = client.punishments.find(p => p.guildId == message.guild.id);
    
    var msgContent = message.content;
    msgContent = msgContent.toLowerCase();

    var counter = 0;
    var maxCapsCount = 0;
    for (const key of msgContent) {
        var index = msgContent.indexOf(key);

        if (message.content[index] != key) counter++;
        else counter = 0;

        if (counter > maxCapsCount) maxCapsCount = counter;
    }

    console.log("Liczba capsów: " + maxCapsCount);
};