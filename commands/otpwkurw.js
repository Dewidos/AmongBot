const YtdlCore = require('ytdl-core');

module.exports = {
    "name": "otpwkurw",
    "description": "Maszynka do wkurwiania otp.",
    execute(message, args, client) {
        if (typeof args[0] === 'undefined' || args[0] == "") args[0] = "ni";

        if (message.member.voice.channel == null) return;

        switch (args[0]) {
            case "tak":
                client.wkurwEnabled = true;
                break;
            default:
                client.wkurwEnabled = false;
                break;
        }

        this.wkurwHandler(message.member.voice.channel, client);
    },
    async wkurwHandler(channel, client) {
        if (!client.wkurwEnabled) return;
        channel.join().then(() => setTimeout(() => {
            channel.leave();
            if (!client.wkurwEnabled) return;
            setTimeout(() => {
                this.wkurwHandler(channel, client);
            }, 500);
        }, 500));
    }
}