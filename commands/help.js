const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const list = require('./list.json');

let outcome = "";
for (let i in list) {
    outcome += "/" + list[i].name + " ------ " + list[i].desc + "\n";
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Display list of Isabelle\'s commands'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0xf2cf74)
            .setTitle("Isabelle Bot Help commands")
            .setDescription(outcome)
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};