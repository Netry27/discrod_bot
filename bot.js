const Discord = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const config = require('./configs/bot_configs.json');
const youtubeFeature = require('./features/youtube_fetures.js');

const bot = new Discord.Client();
bot.commands = new Discord.Collection;
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const youtubeConfigs = fs.readdirSync('./configs/youtube_configs').filter(file => file.endsWith('.json'));

for(const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.tag}!`);
	StartCheckYoutube();
});

function StartCheckYoutube() {
	for(const file of youtubeConfigs) {
		const typeConfig = require(`./configs/youtube_configs/${file}`);
		youtubeFeature.check(bot, typeConfig);
		setInterval(function() {youtubeFeature.check(bot, typeConfig);}, 60 * 1000);
	}
}

bot.on('message', message => {

	if(!message.content.startsWith(config.prefix) || message.author.bot) return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	if(!bot.commands.has(commandName)) return;
	const command = bot.commands.get(commandName);

	try{
		command.execute(message, args);
	}
	catch(error) {
		console.error(error);
		message.reply('Что пошло не так!');
	}
});

bot.login(process.env.BOT_TOKEN);