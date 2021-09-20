require('dotenv').config();

const config = require('./configs/bot_configs.json');
const twitterStream = require('./features/twitter');
const youtubeStream = require('./features/youtube');

const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection;

const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const twitterConfigFiles = fs.readdirSync('./configs/twitter_configs').filter(file => file.endsWith('.json'));
const youtubeConfigs = fs.readdirSync('./configs/youtube_configs').filter(file => file.endsWith('.json'));

for(const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.tag}!`);
	setBotStatus();
	twitterStream(bot, twitterConfigFiles);
	startStreamYoutube();
});

function setBotStatus() {
	RandomStatus();
	setInterval(RandomStatus, 60 * 1000);
}

function RandomStatus() {
	const allGames = config.games;
	const game = allGames[Math.floor(Math.random() * allGames.length)];
	bot.user.setActivity(game, { type: 'PLAYING' });
}

function startStreamYoutube() {
	for(const file of youtubeConfigs) {
		const typeConfig = require(`./configs/youtube_configs/${file}`);
		youtubeStream.check(bot, typeConfig);
		console.log(file.request_Interval);
		setInterval(function() {youtubeStream.check(bot, typeConfig);}, 11000 * 1000);
	}
}

bot.on('message', message => {

	const supportsChannelID = '833996664850088017';
	const adminDm = '434076000733888526';

	if(message.channel.id === supportsChannelID && !message.author.bot) {
		const user = bot.users.cache.get(adminDm);
		if(!user) return message.channel.send('@Netry, возник вопрос, который решить сможет твоя супер сила!');

		const supportChannel = message.guild.channels.cache.get(supportsChannelID);
		const notifaction = `Новое сообщение на канале ${supportChannel}, у ${message.author}, возник вопрос.`;
		const data = message.content;

		user.send(notifaction);
		user.send(data);

		const reply = `Ваше сообщение было перенаправлено лично ${user}, вскорее с Вами свяжуться высшие силы. \n\n С ув. Администрация сервера!`;

		return message.reply(reply);
	}


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