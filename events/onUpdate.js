const { Events, EmbedBuilder } = require('discord.js');
const { urlFilter } = require('../misc /utility');
const { messageUpdated } = require('../database');

module.exports = {
    name: Events.MessageUpdate,
    async execute(oldMsg, newMsg) {
        const client = require('../app');
        const logchannel = await client.channels.cache.find(ch => ch.name === "event-logs" && ch.guild.id === process.env.SERVER.toString());
        const details = await messageUpdated(oldMsg.id, newMsg.content);
        
        const embed = new EmbedBuilder()
            .setColor(0x4781f0)
            .setTitle(`Message was edited`)

        try {
            if (details) {
                const maxChars = details.oldmessage.length > 1024 || newMsg.content.length > 1024 ? true : false;
                embed.setFooter({ text: `From #${details.channel}\nBy ${details.username}` });

                if (maxChars) {
                    let previewStart = urlFilter(newMsg.content.slice(0, 50));
                    let previewEnd = urlFilter(newMsg.content.slice(newMsg.content.length - 50, newMsg.content.length));
                    embed
                        .addFields({ name: 'Too long', value: 'The message was unfortunately too long to show. Here is a slice of what the message was' })
                        .addFields({ name: 'Preview', value: `${previewStart}\n(...)\n${previewEnd}` });
                } else {
                    embed
                        .addFields({ name: 'Old Message', value: urlFilter(details.oldmessage) })
                        .addFields({ name: 'New Message', value: urlFilter(newMsg.content) })
                }
            } else {
                embed.addFields({ name: 'Too Old', value: `A message was edited but is from before what the database recorded.\nFor reference, the ID of the message is *${oldMsg.id}*` })
            }

            await logchannel.send({ embeds: [embed] });
        } catch (err) {
            console.error("Something went wrong when a message was updated", err);
        }
    }
}