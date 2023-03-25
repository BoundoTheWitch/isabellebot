const { Events, EmbedBuilder } = require('discord.js');
const { urlFilter } = require('../misc /utility');

module.exports = {
    name: Events.MessageDelete,
    async execute(msg) {
        const client = require('../app');
        const logchannel = await client.channels.cache.find(ch => ch.name === "event-logs" && ch.guild.id === process.env.SERVER.toString());
        try {
            if (msg.author.id === client.user.id) {
                return;
            } else {
                const embed = new EmbedBuilder()
                .setColor(0xf16363)
                .setTitle(`Message was deleted`)
                if (msg.content.length > 1024) {
                    embed.addFields({ name: "Message", value: "Message was too long to log." });
                }
                else {
                    embed.addFields({ name: "Message", value: urlFilter(msg.content) });
                }
                logchannel.send({ embeds: [embed] });
            }
        } catch (err) {
            console.log(err);
        }
    }
}