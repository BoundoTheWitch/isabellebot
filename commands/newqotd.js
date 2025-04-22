const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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
        let question;
        let qotdCount = qotd.questions.length - 1;
        let lastUpdated = qotd.lastupdated;

        if (counter === null) {
            counter = -1;
        }

        if (counter < qotdCount)
            counter++;
        else
            counter = 0;

        question = qotd.questions[counter];
        localStorage.setItem('qotdCounter', counter);

        // if (localStorage.getItem('qotdCounter') === null) {
        //     counter = 0;
        //     console.log(`Counter does not exsist. Creating one...`);
        // }

        // if (counter < qotdCount) {
        //     question = qotd.questions[counter];
        //     counter++;

        // }  else
        //     counter = 0;        
        
        const embed = new EmbedBuilder()
            .setColor(0xd8cd2d)
            .setTitle(`Another Question of the Day!`)
            .setDescription(`${question}`)
            .setFooter({text: `Questions last edited on ${lastUpdated} - ${qotdCount} total questions`});
        await interaction.reply({ embeds: [embed], ephemeral: false });
    }
};