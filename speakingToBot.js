const Discord = require('discord.js');

module.exports = (message, client, channelToSpeakId) => {

    if (message.channel.id != channelToSpeakId || message.author.bot) return;

    const messageContent = message.content.toLowerCase();
    
    var forFun = client.forFun.find(d => d.guildID == message.guild.id);
    var array = new Array();

    var functionObject = forFun.dialogs.find(d => d.message.includes(messageContent));
    console.log(messageContent);
    console.log(functionObject);

    if (!actionFunction) {
        message.channel.send("Przepraszam, ale nie rozumiem :(");
        
        return;
    }

    var actionFunction = client.speakFunctions[functionObject.functionName];

    actionFunction(message, client);
}