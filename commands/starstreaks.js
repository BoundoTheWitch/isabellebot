const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('starstreaks')
        .setDescription('A "leader board" of sorts for the Star Streaks.'),
    async execute(interaction) {
        const stars = await db.getStars();
        const embed = new EmbedBuilder()
            .setColor(0xd8cd2d)
            .setTitle(`<:stars:1053218314211557456> Stars Streak Leader Board <:stars:1053218314211557456>`)
            .setDescription(`${stars}`);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};