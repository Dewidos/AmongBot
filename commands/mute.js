module.exports = {

    "name": "mute",
    "description": "wycisz jakiegoś użytkownika!",

    execute(message, args, client) {

        var punishments = client.punishments.find(e => e.guildId == message.guild.id);

        if (typeof punishments === 'undefined') {
            message.channel.send("Błąd konfiguracji! Nic nie zrobisz, możesz tylko kopać lub rzuać...");
            return;
        }

        if (typeof args[0] !== 'undefined' && args[0] != "") {

            if (typeof args[1] !== 'undefined' && args[1] != "") {
                //mute na minuty
                if (args[1].content.endsWith("m")) {
                    
                    try {
                        var Czas = args[1].replace("m", "");
                        Czas = parseInt(Czas);
                        Czas = Czas * 60000;
                        console.log(Czas);
                    } catch (error) {
                        message.channel.send("Wystąpił błąd, prosze spróbuj ponownie.");
                    }

                //mute na godziny
                } else if (args[1].content.endsWith("h")) {

                    try {
                        var Czas = args[1].replace("h", "");
                        Czas = parseInt(Czas);
                        Czas = Czas * 3600000;
                        console.log(Czas);
                    } catch (error) {
                        message.channel.send("Wystąpił błąd, prosze spróbuj ponownie.");
                    }

                //mute na dni
                } else if (args[1].content.endsWith("d")) {

                    try {
                        var Czas = args[1].replace("d", "");
                        Czas = parseInt(Czas);
                        Czas = Czas * 86400000;
                        console.log(Czas);
                    } catch (error) {
                        message.channel.send("Wystąpił błąd, prosze spróbuj ponownie.");
                    }

                }

            } else {

                message.channel.send("Musisz podać powód lub czas :unamused:")

            }


        } else {

            message.channel.send("Musisz podać ID gracza!");

        }

    }

}