const { Events, EmbedBuilder } = require('discord.js');
const { urlFilter } = require('../misc /utility');

module.exports = {
    name: Events.MessageDelete,
    async execute(msg) {
        const client = require('../app');
        const logchannel = await client.channels.cache.find(ch => ch.name === "event-logs" && ch.guild.id === process.env.SERVER.toString());
        try {
            if (msg.author.bot) {
                return;
            } else {
                let str;
                const embed = new EmbedBuilder()
                    .setColor(0xf16363)
                    .setTitle(`Message was deleted`)
                    .setFooter({ text: "From #" + msg.channel.name + "\nBy " + msg.author.username });
                if (msg.content.length > 1024) {
                    str = msg.content;
                }
                else {
                    embed.addFields({ name: "Message", value: urlFilter(msg.content) });
                }
                await logchannel.send({ embeds: [embed] });
                if (str)
                    await logchannel.send(urlFilter(str));
            }
        } catch (err) {
            console.log(err);
        }
    }
}