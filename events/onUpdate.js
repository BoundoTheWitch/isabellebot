const { Events, EmbedBuilder } = require('discord.js');
const { urlFilter } = require('../misc /utility');
const { messageUpdated } = require('../stars-db');

module.exports = {
    name: Events.MessageUpdate,
    async execute(oldMsg, newMsg) {
        const client = require('../app');
        const logchannel = await client.channels.cache.find(ch => ch.name === "event-logs" && ch.guild.id === process.env.SERVER.toString());
        const details = await messageUpdated(oldMsg.id, newMsg.content);
        const embed = new EmbedBuilder()
            .setColor(0x4781f0)
            .setTitle(`Message was edited`);

        try {
            if (oldMsg.partial) {
                // Partial
            } else {
                if (oldMsg.author.bot)
                    return;
                else {
                    if (oldMsg === newMsg)
                        return;
                    else {
                        if (oldMsg.content.length > 1024 || newMsg.content.length > 1024) {
                            await logchannel.send(`**Old Message**\n${urlFilter(oldMsg.content)}`);
                            await logchannel.send(`**New Message**\n${urlFilter(newMsg.content)}`);
                        } else {
                            embed
                                .addFields({ name: 'Old Message', value: urlFilter(oldMsg.content) })
                                .addFields({ name: 'New Message', value: urlFilter(newMsg.content) })
                                .setFooter({ text: `From #${oldMsg.channel.name}\nBy "${oldMsg.author.username}` });
                            await logchannel.send({ embeds: [embed] });
                        }
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
}