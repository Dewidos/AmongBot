module.exports = {

    "name": "ticket",
    "description": "utwórz ticket!",

    async execute(message, args, client) {

        const channel = await message.guild.channels.create(`${message.author.username} ticket`);
        channel.setParent('850050885338136576');

        channel.updateOverwrite(message.guild.id, {

            SEND_MESSAGE: false,
            VIEW_CHANNEL: false,
        });

        channel.updateOverwrite(message.author, {

            SEND_MESSAGE: true,
            VIEW_CHANNEL: true,

        });

        const reactionMessage = await channel.send("Dziękujemy za skontaktowaniem się z supportem. Zaraz ktoś z administracji ci pomoże! <@&850051899695693844>");

        try {

            await reactionMessage.react('🔒');
            await reactionMessage.react('⛔');

        } catch (error) {
            channel.send("Wystąpił błąd");
            throw error;
        }

        const collector = reactionMessage.createReactionCollector(
            (reaction, user) => message.guild.members.cache.find((member) => member.id === user.id).hasPermission('ADMINISTRATOR'),
            { dispose: true }
            
            
            );
        collector.on('collect', (reaction, user) => {

            switch (reaction.emoji.name) {
                case "🔒":
                    channel.updateOverwrite(message.author, { SEND_MESSAGE: false });
                    break;
                case "⛔":
                    channel.send("Dzieki za kontakt z nami! Kanał zostanie usunięty w ciągu 5 sekund");
                    setTimeout(() => channel.delete(), 5000);
                    break;
            }

        });

    }

}