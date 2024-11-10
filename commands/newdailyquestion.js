const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('newqotd')
        .setDescription('Need a new question of the day? Try this out!'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0xd8cd2d)
            .setTitle(`Another Question of the Day`)
            .setDescription(`What...is your favorite COLOUR!`);
        await interaction.reply({ embeds: [embed], ephemeral: false });
    }
};