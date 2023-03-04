const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('starboard')
        .setDescription('A "leader board" of sorts for the Star Board.'),
    async execute(interaction) {
        const stars = interaction.channel.name === "the-library" ? await db.getReadingStars() : await db.getWorkoutStars();
        const embed = new EmbedBuilder()
            .setColor(0xd8cd2d)
            .setTitle(`<:stars:1053218314211557456> Star Board Leader Board <:stars:1053218314211557456>`)
            .setDescription(`${stars}`);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};