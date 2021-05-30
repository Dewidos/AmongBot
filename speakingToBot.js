module.exports = (message, client) => {

    var forfun = client.forFun.find(d => d.guildID == message.guild.id);
    
    message.channel.send("cos tam"); 

}