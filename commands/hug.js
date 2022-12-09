const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Give someone a hug!')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('(optional) Who you want to give a hug to.')
                .setRequired(false)),
    async execute(interaction) {
        // const outcome = 'You give a big hug to ' + interaction.options.getUser('user') + '!' ?? 'You give out a big hug!';
        const user = interaction.options.getUser('user');
        if (user === null)
            await interaction.reply('You give out a big hug!');
        else 
            await interaction.reply(`You give out a big hug to ${user}!`);
    }
};