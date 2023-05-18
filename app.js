const dotenv = require('dotenv');
dotenv.config();
const fs = require('node:fs');
const path = require('path');
const cron = require('node-cron');
const db = require('./database');
const songs = require('./misc/songs.json');

// Discord.js
const { Client, GatewayIntentBits, Collection, ActivityType, EmbedBuilder, MessageManager, Partials } = require('discord.js');
const client = new Client({
    partials: [
        Partials.Message,
        Partials.Channel
    ],
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

// Load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// TODO come up with a better solution
let channelLibrary, channelWorkout

setTimeout(() => {
    channelLibrary = client.channels.cache.find(ch => ch.name === "the-library" && ch.guild.id === process.env.SERVER.toString());
    channelWorkout = client.channels.cache.find(ch => ch.name === 'diet-slash-exercise' && ch.guild.id === process.env.SERVER.toString());
}, 1000);
// TODO ------------------------------

let quoteCounter = -1;
let ranQuote = [
    "Hello everyone! It's the start of a new day.",
    "Greetings fellow reading pals, it's a new day!",
    "Random quote! I don't think I was supposed to read that. It's a new day!",
    "...oh, sorry, I was too busy reading. Speaking of which, it's a new day!",
    "What time is it? It's a new day!",
    "...zzz...zzz...HUH WHAT? Oh, I almost slept in. Uhhh...new day!",
    "Got another job for your crew, Tom.\nOh, I'm sorry, wrong chat. Ummm...new day!",
    "Day? Yes. New? Yes.",
    "New day? New day.",
    "Uhhhh...I can't think of anything clever to say. It's a new day! ⁽ʰᵉʸ ᵗʰᵃᵗ ʳʰʸᵐᵉˢᵎ⁾",
    "HEYEVERYONEIT'SANEWDAYHELPIHADTOOMUCHCOFFEE\n*shakes head*",
    "🎶Here comes the sun\n*(Doo-d-doo-doo)*\nHere comes the sun\nAnd I say, **\"It's a new day!\"**🎶",
    "They say the island is just a game.\nAnd everything we say? Or do?\nIt's just to amuse somebody else!\n...I'm sorry, I don't know what came over me. It's a new day!",
    "It's a new day! Let's get that reading...did I do the meme right?",
    "Good morning, everyone!\nRight now on *undefined*, it's *NaN AM* on *[object Object]*.\nHmmm...There really isn't any news to speak of today...\nError: Cannot find module './dryer/socks'",
    "ModuleNotFoundError: No module named 'quotes'\nJust kidding, I don't speak Python! It's a new *[object Object]*!",
    "Hello everyone! It's the day of a new start.\nWait, that wasn't right.",
    "*cough cough*\nS-sorry, my voice is still a bit raspy from karaoke last night. It's a new day!\n*cough cough*",
    "I was told to be sassy with this one. I can't do that. But I can tell you it's a new day!",
    "Breaking the fourth wall isn't funny. Because the roof would fall!\n...sorry. It's a new day!",
    "I caught a black bass! The most metal of all fish!\nSorry, wrong script. It's a new day!",
    "こんにちは、みんな！ 新しい日です！\nOops, forgot to change my language settings."
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


    channelWorkout.send({ content: `It's the start of a new week! Let's see how everyone did 👀`, embeds: [embed] })
        .then(async msg => await db.newWeek(msg.id));
});

// Winter (Spetember to March)
cron.schedule('0 0 0 1 9 *', async () => { await client.user.setAvatar('./images/pfp-fall-winter.png'); console.log('Avatar changed.') });

// Spring (March to May)
cron.schedule('0 0 0 1 3 *', async () => { await client.user.setAvatar('./images/pfp-spring-fall.png'); console.log('Avatar changed.') });

// Summer (May to June, then July to September)
cron.schedule('0 0 0 1 5,7-8 *', async () => { await client.user.setAvatar('./images/pfp-summer.png'); console.log('Avatar changed.') });

// Pride Month (June to July)
cron.schedule('0 0 0 1 6 *', async () => { await client.user.setAvatar('./images/pfp-pride.png'); console.log('Avatar changed.') });


// Random song every 30 minutes
cron.schedule('0 */30 * * * *', async () => {
    let ran = Math.floor(Math.random() * songs.list.length);
    let selectedSong = songs.list[ran];
    if (selectedSong === "Secret song") {
        ran = Math.floor(Math.random() * songs.secret.length);
        selectedSong = songs.secret[ran];
    }
    await client.user.setActivity(selectedSong, { type: ActivityType.Listening });
});

client.login(process.env.TOKEN);

module.exports = client;