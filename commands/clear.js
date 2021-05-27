module.exports = {

    "name": "clear",
    "description:": "możesz wyczyścić wiadomości",

    async execute(message, args, client) {

        if (typeof args[0] !== 'undefined' && args[0] != "") {
            if (isNaN(args[0])) {
                message.channel.send("**Podany argument musi być liczbą**");
                return;
            } else {
                if (args[0] > 100) {
                    message.channel.send("Nie możesz usunać wiecej niż 100 wiadomości!");
                }
                if (args[0] < 1) {
                    
                    message.channel.send("Nie mozesz usunac mniej niz 1 wiadomość!");
                    
                    return;
                };
                await message.channel.messages.fetch({Limit: args[0]}).then(messages => {

                    message.channel.bulkDelete(messages);
                    message.channel.send(`**Usuwanie ${args[0]} wiadomości**`);
                });
            }
        } else {
            message.channel.send("**Musisz podać ile wiadomości chcesz usunąć**");
        }

    }


}