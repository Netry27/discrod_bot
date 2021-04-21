const Discord = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const config = require('./configs/bot_configs.json');
const twitterStream = require('./features/twitter');
// const youtubeFeature = require('./features/youtube_fetures.js');

const bot = new Discord.Client();
bot.commands = new Discord.Collection;
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const twitterConfigFiles = fs.readdirSync('./configs/twitter_configs').filter(file => file.endsWith('.json'));
// const youtubeConfigs = fs.readdirSync('./configs/youtube_configs').filter(file => file.endsWith('.json'));

for(const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.tag}!`);
	RandomStatus();
	setInterval(RandomStatus, 360 * 1000);
	twitterStream(bot, twitterConfigFiles);
	// StartCheckYoutube();
});

function RandomStatus() {
	const allGames = config.games;
	const game = allGames[Math.floor(Math.random() * allGames.length)];
	bot.user.setActivity(game, { type: 'PLAYING' });
}
// function StartCheckYoutube() {
// for(const file of youtubeConfigs) {
// const typeConfig = require(`./configs/youtube_configs/${file}`);
// youtubeFeature.check(bot, typeConfig);
// setInterval(function() {youtubeFeature.check(bot, typeConfig);}, 1200 * 1000);
// }
// }

bot.on('message', message => {

	if(!message.content.startsWith(config.prefix) || message.author.bot) return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const commandName = args.shift().toLowerCase();
	if(!bot.commands.has(commandName)) {
		message.reply(`В списке команд нет, введенной команды ${commandName}`);
		return console.log(`Dont have command ${commandName}`);
	}
	const command = bot.commands.get(commandName);

	if (command.args && !args.length) {
		let reply = 'ты не указал аргументы!';

		if (command.usage) {
			reply += `\nПравильное использование было бы \`${config.prefix}${command.name} ${command.usage}\``;
		}

		return message.reply(reply);
	}

	try{
		command.execute(message, args);
	}
	catch(error) {
		console.error(error);
		message.reply('Что пошло не так!');
	}
});

bot.login(process.env.BOT_TOKEN);