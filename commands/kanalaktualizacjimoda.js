module.exports = {
    "name": "kanalaktualizacjimoda",
    "description": "Komenda ustawiająca kanał do wysyłania informacji o aktualizacji modyfikacji.",
    execute(message, args, client) {        
        client.configFile.find(e => e.guildId == message.guild.id).modUpdateChannelId = message.channel.id;

        message.channel.send("Zmieniłem kanał do wysyłania informacji o nowej wersji modyfikacji.");
    }
}