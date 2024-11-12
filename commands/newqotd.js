const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const qotd = require('../misc/qotd.json')

/// TODO: Update database.js to include interacting with database. (table: qotd --- cols: qotd_counter | qotd_used)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('newqotd')
        .setDescription('Need a new question of the day? Try this out!'),
    async execute(interaction) {
        const ranNum = Math.floor(Math.random() * qotd.questions.length);
        const question = qotd.questions[ranNum];
        const embed = new EmbedBuilder()
            .setColor(0xd8cd2d)
            .setTitle(`Another Question of the Day!`)
            .setDescription(`${question}`)
            .setFooter({text: `Questions last edited on ${qotd.lastupdated}`});
        await interaction.reply({ embeds: [embed], ephemeral: false });
    }
};