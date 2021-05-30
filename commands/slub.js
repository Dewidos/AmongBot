const Discord = require('discord.js');
module.exports = {

    "name": "slub",
    "description": "weźmij ślub z innym graczem!",

    async execute(message, args, client) {

        if (typeof args[0] !== 'undefined' && args[0] != "") {

            const yes = '✅';
            const no = '❌'

            var id = args[0].replace(/[\\<>@#&!]/g, "");

            var user = message.guild.members.cache.get(id);

            if (typeof user !== 'undefined') {
                
                let embed = new Discord.MessageEmbed()
                    .setColor('#8B0000')
                    .setTitle(`Gracz: ${message.author.username} ci sie oświadczył!`)
                    .setDescription(`**Czy ty: <@${id}>, wyjdziesz za: ${message.author.username}?**`)
                    .setFooter("Wybierz emotke: ✅ oznacza ze sie zgadzasz, ❌ oznacza że nie.")

                let MessageEmbed = await user.send(embed);
                MessageEmbed.react(yes);
                MessageEmbed.react(no);

                client.on('messageReactionAdd', async (reaction, user) =>{

                    if (reaction.message.partial) await reaction.message.fetch();
                    if (reaction.partial) await reaction.fetch();
                    if (user.bot) return;
                    if (!reaction.message.guild) return;

                    if (user.id = id) {
                        if (reaction.emoji.name === yes) {
                            message.channel.send("cos");
                        } else if (reaction.name == no){

                        } else {
                            return;
                        }
                    } else {
                        return
                    }
                });


            } else {
                message.channel.send("**Podaj poprawny nick/id!**");
            }

        } else {
            message.channel.send("**Podaj osobe, której chcesz się oświadczyć!**")
        }


    }

}