module.exports = (message, client) => {
    var config = client.configFile.find(c => c.guildId == message.guild.id);
    var punishments = client.punishments.find(p => p.guildId == message.guild.id);
    
    var msgContent = message.content;
    msgContent.toLowerCase();

    var counter = 0;
    for (const key of msgContent) {
        var index = msgContent.indexOf(key);

        console.log(`Dajs ki: ${key}`);

        if (message.content[index] != key) {
            counter++;
            console.log("wincyj");
        } else {
            counter = 0;
            console.log(`mniej, ${key + " - " + message.content[index]}`);
        }
    }

    console.log("Liczba capsów: " + counter);
};