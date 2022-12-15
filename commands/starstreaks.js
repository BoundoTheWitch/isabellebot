const { SlashCommandBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('starstreaks')
        .setDescription('A "leaderboard" of sorts for the Star Streaks.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0xd8cd2d)
            .setTitle(`Stars Streak Leadboard`)
            .setDescription(`Build here`)
        await interaction.reply({ embed: [embed], ephemeral: true });
    }
};