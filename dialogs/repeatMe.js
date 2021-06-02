module.exports = (message, client) =>  {

  var forFun = client.forFun.find(d => d.guildID == message.guild.id);

  var prefix = forFun.dialogs.find(d => d.message.includes(messageContent));

}