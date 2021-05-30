const Discord = require('discord.js');
const createMarryChannel = require('./../createMarryChannel');

module.exports = {

    "name": "slub",
    "description": "weźmij ślub z innym graczem!",

    async execute(message, args, client) {

        if (typeof args[0] !== 'undefined' && args[0] != "") {

            const yes = '✅';
            const no = '❌'

            var id = args[0].replace(/[\\<>@#&!]/g, "");

            var user = message.guild.members.cache.get(id);
            var authorUser = message.guild.members.cache.get(message.author.id);
            var marryChannel = message.guild.channels.cache.get('848277078058860584');

            if (!marryChannel) {
                console.error("I can't find marry channel!");
                return;
            }

            if (typeof user !== 'undefined') {

                if (user.bot) return;

                let embed = new Discord.MessageEmbed()
                    .setColor('#8B0000')
                    .setTitle(`Gracz: ${message.author.username} ci sie oświadczył!`)
                    .setDescription(`**Czy ty: <@${id}>, wyjdziesz za: ${message.author.username}?**`)
                    .setFooter("Wybierz emotke: ✅ oznacza ze sie zgadzasz, ❌ oznacza że nie.")

                let MessageEmbed = await user.send(embed);
                MessageEmbed.react(yes);
                MessageEmbed.react(no);

                var callback = async (reaction, user) => {
                    
                    if (reaction.message.partial) await reaction.message.fetch();
                    if (reaction.partial) await reaction.fetch();
                    if (user.bot) return;

                    if (reaction.message != MessageEmbed) return;

                    if (reaction.emoji.name === yes) {
                        authorUser.send(`${user.user.username} zaakceptował Twoje oświadczyny!`);                        
                        marryChannel.send(`<@${user.id}> zaakceptował oświadczyny <@${message.author.id}>!`);

                        createMarryChannel(user, authorUser, message.guild, client);

                        return true;
                    } else if (reaction.emoji.name === no) {
                        authorUser.send(`${user.user.username} odrzucił Twoje oświadczyny :(`);
                        marryChannel.send(`<@${user.id}> odrzucił oświadczyny <@${message.author.id}> :(`);

                        return true;
                    }

                    return false;
                };

                client.reactionCallbacks.push(callback);


            } else {
                message.channel.send("**Podaj poprawny nick/id!**");
            }

        } else {
            message.channel.send("**Podaj osobe, której chcesz się oświadczyć!**")
        }


    }

}