# Isabelle Bot
## v3

Isabelle Bot is a Discord bot powered by [Discord.js](https://discord.js.org). It started out back in 2018 as a small project to replicate some of the fun commands from a Twitch channel I moderate for in her Discord server. After a while, more complexity was added, such as commands that had more interaction and even did a little bit of moderation such as banning users and auditing edited and deleted messages. With some of the major changes that came with Discord's own API and getting more free time in my personal life Isabelle Bot is being re-worked.

I continue to update and change Isabelle Bot to get more experience in developing Node.js applications and expanding my programming skills and knowhow along the way. As the community comes up with more features and requests I plan to add what I can and update where needed.

# What does she do?

## Basics

* Has basic commands (you can see how they work in the `commands` directory)
* - `/caw` - Will respond with "Caw caw, baby" (a reference to the streams)
* - `/hug $USER` - A way to send hugs to a user or just send out a hug in general if no user is mentioned
* Audits edited and deleted messages
* - She does not save images. If the post has an image then nothing will show up on the event logs except for whatever the message contains.

## Reading challenge

Several memebers of the community came up with a challenge that helps encourage users who wish to read more. Anyone in the server is welcomed to join in. The rules of the challenge is simple:

* Read 30 minutes a day.
* If you have done your reading then you leave a star.
* Miss a day and you will lose your streak.
* Only one star can be earned each day

Where Isabelle comes in is to help with tracking the stars. Originally a user was doing it all on their own updating a message to have a leaderboard on display. Isabelle helps with this.

* Leave a star with `/star` instead of the original method of everyone leaving in their own emojis
* Isabelle updates a local database including what time someone leaves a star
* Every day at 6am CST Isabelle will send a message to a specific channel reminding everyone that it's a new day and to leave their star. She also displays a leaderboard
* If users wish to see a current leaderboard before the start of a new day they can with the `/starstreaks` command.
