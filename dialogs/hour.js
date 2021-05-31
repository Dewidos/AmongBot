module.exports = (message, client) => {
    var messageToSend = "Mamy teraz ";

    var date = new Date();
    var time = date.toTimeString();

    messageToSend = messageToSend + `**${time}**.`;

    message.channel.send(messageToSend);
};