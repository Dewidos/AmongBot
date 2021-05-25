module.exports = {

    "name": "tempmute",
    "description": "czasowo wycisz jakiegoś użytkownika!",

    execute(message, args, client) {

        var punishments = client.punishments.find(e => e.guildId == message.guild.id);

        if (typeof punishments === 'undefined') {
            message.channel.send("Błąd konfiguracji! Nic nie zrobisz, możesz tylko kopać lub rzuać...");
            return;
        }

        if (typeof args[0] !== 'undefined' && args[0] != "") {

            if (typeof args[1] !== 'undefined' && args[1] != "") {

                var czas = args[1];

                if (czas.content.endsWith("m")) {
                    
                    czas = czas.replace("m", "");

                    console.log(czas);
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
                
                var user = message.guild.members.cache.get(id);
                if (typeof duration !== 'undefined' && duration != "") {
                    punishments.mutes.push({

                        "userId": user,
                        "issuerId": message.author.id,
                        "duration": duration,
                        "reason": reason,

                    });
                } else {
                    message.channel.send("Musisz podać czas na ile chcesz go wyciszyć!");
                }
                    
    

                //mute na minuty
                /*if (args[1].content.endsWith("m")) {
                    
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

                } */

            } else {

                message.channel.send("Musisz podać powód lub czas :unamused:")

            }


        } else {

            message.channel.send("Musisz podać ID gracza!");

        }

    }

}