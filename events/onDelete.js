const { Events, EmbedBuilder, MessageType } = require('discord.js');
const { urlFilter } = require('../misc /utility');
const { messageDeleted } = require('../stars-db');

module.exports = {
    name: Events.MessageDelete,
    async execute(msg) {
        let str;
        const client = require('../app');
        const logchannel = await client.channels.cache.find(ch => ch.name === "event-logs" && ch.guild.id === process.env.SERVER.toString());
        const details = await messageDeleted(msg.id);
        const embed = new EmbedBuilder()
            .setColor(0xf16363)
            .setTitle(`Message was deleted`);
        try {
            if (msg.partial) {
                if (details) {
                    if (details.content.length > 1024)
                        str = details.content;
                    else {
                        embed
                            .addFields({ name: 'Message', value: urlFilter(details.content) })
                            .setFooter({ text: `From #${details.channel}\nBy ${details.username}\n(Older message, some info may not be accurate)` });
                            
                            await logchannel.send({ embeds: [embed] })
        
                            if (str)
                                await logchannel.send(urlFilter(str));
                    }
                } else {
                    embed
                        .addFields({ name: 'Message too old', value: `The deleted message was too old as it was not in the cache or in the database.\nFor reference the ID of the message is *${msg.id}*` });
                    await logchannel.send({ embeds: [embed] });
                }
            } else {
                if (msg.author.bot)
                    return;
                else {
                    // TODO Change so that it displays as image instead of a second message
                    if (msg.content.length > 1024)
                        str = msg.content;
                    else {
                        embed
                            .addFields({ name: 'Message', value: urlFilter(msg.content) })
                            .setFooter({ text: `From #${msg.channel.name}\nBy ${msg.author.username}` });
                        
                        await logchannel.send({ embeds: [embed] });
                        if (str)
                            await logchannel.send(urlFilter(str));
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
}