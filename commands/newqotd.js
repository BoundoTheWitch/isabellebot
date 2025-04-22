const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database');
const qotd = require('../misc/qotd.json');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('newqotd')
        .setDescription('Need a new question of the day? Use this!'),
    async execute(interaction) {
        // TODO: Implement node-localstorage
        const embed = new EmbedBuilder()
            .setColor(0xd8cd2d)
            .setTitle(`Another Question of the Day!`)
            .setDescription(`${question}`)
            .setFooter({text: `Questions last edited on ${qotd.lastupdated} - ${qotd.questions.length} total questions`});
        await interaction.reply({ embeds: [embed], ephemeral: false });
    }
};