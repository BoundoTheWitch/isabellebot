const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('starstreaks')
        .setDescription('A "leaderboard" of sorts for the Star Streaks.'),
    async execute(interaction) {
        const stars = await db.getStars();
        const embed = new EmbedBuilder()
            .setColor(0xd8cd2d)
            .setTitle(`Stars Streak Leadboard`)
            .setDescription(`NAME --- CURRENT STARS --- HIGHEST STREAK\n${stars}`);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};