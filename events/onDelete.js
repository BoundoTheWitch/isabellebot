const { Events, EmbedBuilder } = require('discord.js');
const util = require('../util');


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
                    .setTitle("Message was deleted")
                    .addFields({ name: "Message", value: util.urlFilter(msg.content) })
                    .setFooter({ text: "From #" + msg.channel.name + "\nBy " + msg.author.username })
            
                logchannel.send({ embeds: [embed] });
            }
        } catch (err) {
            console.log(err);
        }
    }
}