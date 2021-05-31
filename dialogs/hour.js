module.exports = (message, client) => {
    var messageToSend = "Mamy teraz ";

    var date = new Date();
    date.setHours(date.getHours() + 2);
    var time = date.toTimeString().split(" ")[0];

    messageToSend = messageToSend + `**${time}**.`;

    message.channel.send(messageToSend);
};