const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database');
const qotd = require('../misc/qotd.json');
if (typeof localStorage === 'undefined' || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('newqotd')
        .setDescription('Need a new question of the day? Use this!'),
    async execute(interaction) {
        let counter = localStorage.getItem('qotdCounter');
        let qotdCount = qotd.questions.length;
        let lastUpdated = qotd.lastupdated;
        let question;

        if (counter === null) {
            localStorage.setItem('qotdCounter', 0);
            counter = 0;
        }

        if (counter < qotdCount) {
            question = qotd.questions[counter];
            counter++;
        }
        else {
            localStorage.setItem('qotdCounter', counter);
            counter = 0;
        }
        

        
        const embed = new EmbedBuilder()
            .setColor(0xd8cd2d)
            .setTitle(`Another Question of the Day!`)
            .setDescription(`${question}`)
            .setFooter({text: `Questions last edited on ${lastUpdated} - ${qotdCount} total questions`});
        await interaction.reply({ embeds: [embed], ephemeral: false });
    }
};