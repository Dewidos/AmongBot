module.exports = {

    "name": "tmute",
    "description": "czasowo wycisz jakiegoś użytkownika!",

    execute(message, args, client) {

        var punishments = client.punishments.find(e => e.guildId == message.guild.id);

        if (typeof punishments === 'undefined') {
            message.channel.send("Błąd konfiguracji! Nic nie zrobisz, możesz tylko kopać lub rzuać...");
            return;
        }

        if (typeof args[0] !== 'undefined' && args[0] != "") {

            if (typeof args[1] !== 'undefined' && args[1] != "") {
                if (args[1].endsWith("m")) {
                    
                    try {
                        var Czas = args[1].replace("m", "");
                        Czas = parseInt(Czas);
                        if (Czas === null) {
                            message.channel.send("Wprowadź prawidłowy czas!");
                            return;
                        }
                        Czas = Czas * 60000;
                        console.log(Czas);
                    } catch (error) {
                        message.channel.send("Wystąpił błąd, prosze spróbuj ponownie.");
                        console.error(error);
                    }

                //mute na godziny
                } else if (args[1].endsWith("h")) {

                    try {
                        var Czas = args[1].replace("h", "");
                        Czas = parseInt(Czas);
                        if (Czas === null) {
                            message.channel.send("Wprowadź prawidłowy czas!");
                            return;
                        }
                        Czas = Czas * 3600000;
                        console.log(Czas);
                    } catch (error) {
                        message.channel.send("Wystąpił błąd, prosze spróbuj ponownie.");
                    }

                //mute na dni
                } else if (args[1].endsWith("d")) {

                    try {
                        var Czas = args[1].replace("d", "");
                        Czas = parseInt(Czas);
                        if (Czas === null) {
                            message.channel.send("Wprowadź prawidłowy czas!");
                            return;
                        }
                        Czas = Czas * 86400000;
                        console.log(Czas);
                    } catch (error) {
                        message.channel.send("Wystąpił błąd, prosze spróbuj ponownie.");
                    }

                }

                //ustalamy powód
                var reason = "";

                if (typeof args[2] !== 'undefined' && args[2] != "") {
                    var length = args.length - 1;
        
                    for (let i = 1; i <= length; i++) {
                        reason = reason + args[i];
                        if (i != length) reason = reason + " ";
                    }
                }

                var id = args[0].replace(/[\\<>@#&!]/g, "");
                
                if (Czas !== null) {
                    punishments.mutes.push({

                        "userId": id,
                        "issuerId": message.author.id,
                        "duration": Czas,
                        "reason": reason,

                    });
                } else {
                    message.channel.send("Podaj prawidłowy czas!");
                    return;
                }
                    

            } else {

                message.channel.send("Musisz podać czas :unamused:")

            }


        } else {

            message.channel.send("Musisz podać ID gracza!");

        }

    }

}