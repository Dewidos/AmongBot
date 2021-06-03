module.exports = {

    "name": "polecam",
    "description": "możesz polecić tym admina!",

    execute(message, args, client) {

        var config = client.configFile.find(c => c.guildId == message.guild.id);

        if (typeof args[0] !== 'undefined') {

            var id = args[0].replace(/[\\<>@#&!]/g, "");

            if (message.channel.id == config.polecAdminaChannelId) {
                
                if (typeof args[1] !== 'undefined') {

                    
                    if (!(isNaN(args[1]))) {

                        if (args[1] < 6 && args[1] > 0) {

                            if (typeof args[2] !== 'undefined') {

                                var powodPolecenia = "";

                                var length = args.length - 1;
                    
                                for (let i = 2; i <= length; i++) {
                                    powodPolecenia = powodPolecenia + args[i];
                                    if (i != length) powodPolecenia = powodPolecenia + " ";
                                }
                                message.channel.send(powodPolecenia);

                            } else {
                                message.channel.send("Powiedz dlaczego chcesz go polecić!");
                            }

                        } else {

                            message.channel.send("Ocena musi być w skali od 1 do 5 (napisz samą cyfre np. 2 a nie np. 2/5)");

                        }

                    } else {
                        message.channel.send("ocena musi być cyfrą!");
                    }

                } else {
                    message.channel.send("Podaj ocene w skali 1 do 5 (napisz samą cyfre a nie np. 2/5)")
                    return;
                }

            } else {
                message.channel.send(`Tej komendy można używać tylko na kanale <#${config.polecAdminaChannelId}>`);
            }

        } else {
            message.channel.send("Podaj prawidłowy nick admina, którego chcesz polecić!");
        }

    }

}