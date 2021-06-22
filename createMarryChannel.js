module.exports = (user1, user2, guild, client) => {
    guild.channels.create(`slub-${user1.user.username}-${user2.user.username}`, {
        type: 'text',
        permissionOverwrites: [
            {
                id: guild.roles.everyone.id,
                deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
            },
            {
                id: user1.id,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
            },
            {
                id: user2.id,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
            }
        ]
    });

    console.log("Created marry channel");
};