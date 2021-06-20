module.exports = {
    "name": "otpwkurw",
    "description": "Maszynka do wkurwiania otp.",
    execute(message, args, client) {
        if (typeof args[0] === 'undefined' || args[0] == "") return;

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
        if (client.wkurwEnabled) {
            channel.join().then(() => setTimeout(() => {
                channel.leave();
                setTimeout(() => {
                    this.wkurwHandler(channel, client);
                }, 800);
            }, 800));
        }
    }
}