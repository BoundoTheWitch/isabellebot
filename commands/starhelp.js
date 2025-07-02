const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('starhelp')
        .setDescription('Rules and info about the Stars Board.'),
    async execute(interaction) {
        let reading = new EmbedBuilder()
            .setColor(0xd8cd2d)
            .setTitle(`⭐ Reading Stars ⭐`)
            .setDescription(`The purpose of the Star Reading challenge is to encourage 30 minutes of reading every day. Reading material can include: textbooks, novels, mangas, long-winded pamphlets; anything that is meaningful reading. So no, unfortunately reading 100 fortune cookies does not count, though I would be very concerned if you did eat so many.\n\nFor each day you complete your reading, use \`/star\` in \`#the-library\` to leave your star for the day. If you miss a day, you will lose your streak. Don't be discouraged though, total number of stars are still recorded to track your progress!\n\nAlso, as a reminder: this is all for fun. Please don't get too competitive.`);
        let workout = new EmbedBuilder()
            .setColor(0xd8cd2d)
            .setTitle(`💪 Workout Stars 💪`)
            .setDescription(`The purpose of the Star Workout challenge is to encourage 30 minutes of workouts at least 4 times a week. Doing 4 workouts a week will earn you a Super Star ✨. Total number of stars earned will still be tracked.\n\nWhat consitutes a workout? Whatever is within your limitations. So general physical activities like long walks, cleaning, chasing your kid across the house because they found something they shouldn't be playing with--all still count, including regular workouts of course.`)
        await interaction.reply({ embeds: [reading, workout], flags: MessageFlags.Ephemeral })
    }
};