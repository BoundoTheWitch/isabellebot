const util = require('./util');
const dotenv = require('dotenv');
dotenv.config();
const fs = require('node:fs');
const path = require('path');
const cron = require('node-cron');
const db = require('./database');

// Discord.js
const { Client, GatewayIntentBits, Collection, ActivityType, EmbedBuilder, MessageManager } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildEmojisAndStickers,
    ]
});
client.commands = new Collection();


// Populating commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
let list = []; // Empty list of commands to add to file later

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        list.push({name: command.data.name, desc: command.data.description});
    } else {
        console.log(`Command "/${filePath}" is missing 'data' or 'execute'. Skipping.`);
    }
}

// Write list to file
fs.writeFile('./commands/list.json', JSON.stringify(list), (err) => {
    if (err) return console.error(err);
});

// Grab channel IDs
let channelLibrary;
let channelWorkout;

// On startup
client.on('ready', () => {
    client.user.setActivity('the mayor', { type: ActivityType.Listening });
    console.log(`${client.user.tag} online.`);
    channelLibrary = client.channels.cache.find(ch => ch.name === "the-library" && ch.guild.id === process.env.SERVER.toString());
    channelWorkout = client.channels.cache.find(ch => ch.name === 'diet-slash-exercise' && ch.guild.id === process.env.SERVER.toString());
});

// Message posted
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`Invalid command ${interaction.commandName}.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (err) {
        console.error(err);
        await interaction.reply({ content: 'Hmmm...there was an error trying to do that command.', ephemeral: true });
    }
});


// Edited messages
client.on('messageUpdate', async (msg, newMsg) => {
    try {
        let _msg = await msg.toString();
        let _newMsg = await newMsg.toString();
        const logchannel = client.channels.cache.find(ch => ch.name === "event-logs" && ch.guild.id === process.env.SERVER.toString());
        if (msg.author.id === client.user.id) {
            return;
        } else {
            if (_msg === _newMsg) {
                return;
            } else {
                const embed = new EmbedBuilder()
                    .setColor(0x4781f0)
                    .setTitle("Message was edited")
                    .addFields({ name: "Old message", value: util.urlFilter(msg.content) })
                    .addFields({ name: "New message", value: util.urlFilter(newMsg.content) })
                    .setFooter({ text: "From #" + msg.channel.name + "\nBy " + msg.author.username });
                await logchannel.send({ embeds: [embed] });
            }
        }
    } catch (err) {
        console.log(err);
    }
});

// On message delete
client.on("messageDelete", msg => {
    try {
        if (msg.author.id === client.user.id) {
            return;
        } else {
            const logchannel = client.channels.cache.find(ch => ch.name === "event-logs" && ch.guild.id === process.env.SERVER.toString());
            const embed = new EmbedBuilder()
                .setColor(0xf16363)
                .setTitle("Message was deleted")
                .addFields({ name: "Message", value: util.urlFilter(msg.content) })
                .setFooter({ text: "From #" + msg.channel.name + "\nBy " + msg.author.username })
        
            logchannel.send({ embeds: [embed] });
        }
    } catch (err) {
        console.log(err);
    }
})

let quoteCounter = -1;
let ranQuote = [
    "Hello everyone! It's the start of a new day.",
    "Greetings fellow reading pals, it's a new day!",
    "It's a random quote! I don't think I was supposed to read that. It's a new day!",
    "...oh, sorry, I was too busy reading. Speaking of which, it's a new day!",
    "What time is it? It's a new day!",
    "...zzz...zzz...HUH WHAT? Oh, I almost slept in. Uhhh...new day!",
    "Got another job for your crew, Tom.\nOh, I'm sorry, wrong chat.",
    "Day? Yes...ish. New? Yes.",
    "New day? New day.",
    "Uhhhh...I can't think of anything clever to say. It's a new day! ⁽ʰᵉʸ ᵗʰᵃᵗ ʳʰʸᵐᵉˢᵎ⁾",
    "HEYEVERYONEIT'SANEWDAYHELPIHADTOOMUCHCOFFEE\n*shakes head*",
    "Here comes the sun\n(Doo-d-doo-doo)\nHere comes the sun\nAnd I say, **\"It's a new day!\"**",
    "They say the island is just a game.\nAnd everything we say? Or do?\nIt's just to amuse somebody else!\n...I'm sorry, I don't know what came over me. It's a new day!",
    "It's a new day! Let's get that reading...did I do the meme right?",
    "Good morning, everyone!\nRight now on undefined, it's *6:00 AM* on *[Object object]*.\nHmmm...There really isn't any news to speak of today...\nError: Cannot find module './dryer/socks"
];
ranQuote.sort(() => Math.random() - 0.5);

// Runs every day at 6am
cron.schedule('0 0 6 * * *', async () => {
    let quote;
    const lastPost = await db.getLastPost("READING");
    const stars = await db.getReadingStars();
    const embed = new EmbedBuilder()
        .setColor(0xf2cf74)
        .setTitle(`⭐ Reading Star Board ⭐`)
        .setDescription(`${stars}`);


    if (lastPost)
        channelLibrary.messages.fetch(lastPost).then(msg => msg.delete());


    if (quoteCounter > ranQuote.length - 2) {
        ranQuote.sort(() => Math.random() - 0.5);
        quoteCounter = -1;
    }
    quoteCounter++;
    quote = ranQuote[quoteCounter];
    
    channelLibrary.send({ content: `${quote}\nDon't forget to leave your star later if you have done your reading.`, embeds: [embed] })
        .then(async msg => await db.newDay(msg.id));

});


// Runs every week on Monday at 6am
cron.schedule('0 0 6 * * Mon', async () => {
    const lastPost = await db.getLastPost("WORKOUT");
    const stars = await db.getWorkoutStars();
    
    const embed = new EmbedBuilder()
        .setColor(0xf2cf74)
        .setTitle(`💪 Workout Star Board 💪`)
        .setDescription(`${stars}`);
    
    if (lastPost)
        channelWorkout.messages.fetch(lastPost).then(msg => msg.delete());


    channelWorkout.send({ content: `It's the start of a new week! Let's see how everyone's doing 👀`, embeds: [embed] })
        .then(async msg => await db.newWeek(msg.id));
});

client.login(process.env.TOKEN);