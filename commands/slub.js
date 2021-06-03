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

            var userFromId = message.guild.members.cache.get(id);
            var authorUser = message.guild.members.cache.get(message.author.id);
            var marryChannel = message.guild.channels.cache.get(config.marryChannelId);

            if (!marryChannel) {
                console.error("I can't find marry channel!");
                return;
            }

            if (typeof userFromId !== 'undefined') {

                if (userFromId.bot) return;

                let embed = new Discord.MessageEmbed()
                    .setColor('#8B0000')
                    .setTitle(`Gracz: ${message.author.username} ci sie oświadczył!`)
                    .setDescription(`**Czy ty: <@${id}>, wyjdziesz za: ${message.author.username}?**`)
                    .setFooter("Wybierz emotke: ✅ oznacza ze sie zgadzasz, ❌ oznacza że nie.")

                let MessageEmbed = await userFromId.send(embed);
                MessageEmbed.react(yes);
                await MessageEmbed.react(no);

                var callback = async (reaction, user) => {
                    
                    if (reaction.message.partial) await reaction.message.fetch();
                    if (reaction.partial) await reaction.fetch();
                    if (userFromId.partial) await user.fetch();

                    if (reaction.message != MessageEmbed) return;

                    if (reaction.emoji.name === yes) {
                        authorUser.send(`${userFromId.user.username} zaakceptował Twoje oświadczyny!`);                        
                        marryChannel.send(`<@${userFromId.id}> zaakceptował oświadczyny <@${message.author.id}>!`);

                        createMarryChannel(userFromId, authorUser, message.guild, client);

                        return true;
                    } else if (reaction.emoji.name === no) {
                        authorUser.send(`${userFromId.user.username} odrzucił Twoje oświadczyny :(`);
                        marryChannel.send(`<@${userFromId.id}> odrzucił oświadczyny <@${message.author.id}> :(`);

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