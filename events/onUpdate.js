const { Events, EmbedBuilder } = require('discord.js');
const util = require('../util');


module.exports = {
    name: Events.MessageUpdate,
    async execute(oldMsg, newMsg) {
        const client = require('../app');
        const logchannel = await client.channels.cache.find(ch => ch.name === "event-logs" && ch.guild.id === process.env.SERVER.toString());
        try {
            if (oldMsg.author.id === client.user.id) {
                return;
            } else {
                if (oldMsg === newMsg) {
                    return;
                } else {
                    const embed = new EmbedBuilder()
                        .setColor(0x4781f0)
                        .setTitle("Message was edited")
                        .addFields({ name: "Old message", value: util.urlFilter(oldMsg.content) })
                        .addFields({ name: "New message", value: util.urlFilter(newMsg.content) })
                        .setFooter({ text: "From #" + oldMsg.channel.name + "\nBy " + oldMsg.author.username });
                    await logchannel.send({ embeds: [embed] });
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
}