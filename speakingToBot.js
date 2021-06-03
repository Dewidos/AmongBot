const Discord = require('discord.js');

module.exports = (message, client, channelToSpeakId, StringPrefix) => {

    if (message.content.startsWith(client.prefix)) return;

    if (message.channel.id != channelToSpeakId || message.author.bot) return;

    var messageContent = message.content.toLowerCase();
    messageContent = messageContent.replace(/[\\<>@#&!?]/g, "");

    messageContent = messageContent.replace("ą", "a");
    messageContent = messageContent.replace("ę", "e");
    messageContent = messageContent.replace("ć", "c");
    messageContent = messageContent.replace("ł", "l");
    messageContent = messageContent.replace("ń", "n");
    messageContent = messageContent.replace("ś", "s");
    messageContent = messageContent.replace("ż", "z");
    messageContent = messageContent.replace("ź", "z");

    var forFun = client.forFun.find(d => d.guildID == message.guild.id);
    var array = new Array();

    var functionObject = forFun.dialogs.find(d => d.message.includes(messageContent));
    
    if (message.content == "pls meme") {
      return;
    }

    if (!functionObject) {
        message.channel.send("Przepraszam, ale nie rozumiem :(");
        
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