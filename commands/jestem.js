module.exports = {
    "name": "jestem",
    "description": "Komenda witająca danego gracza",
    execute(message, args) {
        var preparedMessage = 'Witaj ' + message.author.username;

        if (message.member.roles.cache.has("844291472739795005"))
        {
            preparedMessage = preparedMessage.concat(', członku zarządu!');
        }
        else
        {
            preparedMessage = preparedMessage.concat('!');
        }

        message.channel.send(preparedMessage);
    }
};