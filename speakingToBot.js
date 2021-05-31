module.exports = (message, client, channelToSpeakId) => {

    var forfun = client.forFun.find(d => d.guildID == message.guild.id);
    
    if (message.channel.id === channelToSpeakId) {
        
        var PlayerMessage = message.replace(/[\\<>@#&!?]/, "");

        PlayerMessage = PlayerMessage.toLowerCase();

        var MessageAtJSON = forfun.dialogs.find(d => d.messageOfPlayer == PlayerMessage);

        if (typeof MessageAtJSON !== 'undefined') {

            message.channel.send(MessageAtJSON.awanser);

        } else {
            message.channel.send("**Przykro mi ale nie rozumiem o co ci chodzi**");
        }

    } else {
        return;
    }

}