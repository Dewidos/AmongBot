const Discord = require('discord.js');

module.exports = (message, client, channelToSpeakId, StringPrefix, prefix) => {

    if (message.content.startsWith(prefix)) return;

    if (message.channel.id != channelToSpeakId || message.author.bot) return;

    var messageContent = message.content.toLowerCase();
    messageContent = messageContent.replace(/[\\<>@#&!?]/g, "");

    var forFun = client.forFun.find(d => d.guildID == message.guild.id);
    var array = new Array();

    var functionObject = forFun.dialogs.find(d => d.message.includes(messageContent));
    
    if (!functionObject) {
        message.channel.send("Przepraszam, ale nie rozumiem :(");
        
        return;
    }

    if (message.content === "pls meme") {
      return;
    }

    if (functionObject.functionName.startsWith(StringPrefix)) {

      var thisString = functionObject.functionName;

      var messageToSend = thisString.slice(StringPrefix.length);

      message.channel.send(messageToSend);

      return;

    }

    var actionFunction = client.speakFunctions[functionObject.functionName];

    actionFunction(message, client); 

    client.lastExecutedSpeakingAction = functionObject;

}