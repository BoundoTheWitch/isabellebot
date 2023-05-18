const { Events, EmbedBuilder } = require('discord.js');
const { urlFilter } = require('../misc/utility');
const { messageDeleted } = require('../database');

module.exports = {
    name: Events.MessageDelete,
    async execute(msg) {
        const client = require('../app');
        const logchannel = client.channels.cache.find(ch => ch.name === "event-logs" && ch.guild.id === process.env.SERVER.toString());
        const details = await messageDeleted(msg.id);

        const embed = new EmbedBuilder()
            .setColor(0xf16363)
            .setTitle(`Message was deleted`)

        try {
            if (details) {
                embed.setFooter({ text: `From #${details.channel}\nBy ${details.username}` });
                const msgLength = details.content.length;
                const maxChars = msgLength > 1024 ? true : false;
                if (maxChars) {
                    let previewStart = urlFilter(details.content.slice(0, 100));
                    let previewEnd = urlFilter(details.content.slice(msgLength - 100, msgLength));
                    embed
                        .addFields({ name: 'Long version', value: `The message deleted was a bit long. Here's a snippet of what that message was.` })
                        .addFields({ name: 'Preview', value: `${previewStart}\n(...)\n${previewEnd}` });
                } else {
                    embed
                        .addFields({ name: 'Message Deleted', value: urlFilter(details.content) })
                }
            } else {
                return;
                // embed
                //     .addFields({ name: 'Too Old', value: `A message was deleted, but it was from before what the database recorded.\nFor reference, the ID was *${msg.id}*` });
            }

            await logchannel.send({ embeds: [embed] });
        } catch (err) {
            console.error("Something went wrong when a message was deleted", err);
        }
    }
}