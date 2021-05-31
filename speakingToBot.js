const Discord = require('discord.js');

module.exports = (message, client, channelToSpeakId) => {

    var forfun = client.forFun.find(d => d.guildID == message.guild.id);
    
    if (message.channel.id === channelToSpeakId) {

        if (message.author.bot) return;
        
        var playerMessage = message.content.toLowerCase();

        playerMessage = playerMessage.replace(/[\\<>@#&!]/g, "");

        var MessageAtJSON = forfun.dialogs.find(d => d.messageOfPlayer == playerMessage);

        if (typeof MessageAtJSON !== 'undefined') {
            if (message.content === "która godzina") {
              var godzina = getHours();
              MessageAtJSON = (MessageAtJSON + `${godzina}`);
            }
            var embed = new Discord.MessageEmbed()
                    .setColor('#8B0000')
                    .setTitle(`Już rozumiem!`)
                    .setDescription(`**${MessageAtJSON.awanser}**`)
                    .setFooter("Nie ma sprawy.")
            message.channel.send(embed);
        } else {
            message.channel.send("**Przykro mi ale nie rozumiem o co ci chodzi**");
        }

    } else {
        return;
    }
}