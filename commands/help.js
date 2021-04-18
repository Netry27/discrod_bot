const prefix = require('../configs/bot_configs.json').prefix;

module.exports = {
	name: 'help',
	aliases: ['commands'],
	usage: ['commands name'],
	cooldown: 5,

	// eslint-disable-next-line space-before-blocks
	execute(message, args){
		const data = [];
		const { commands } = message.client;

		if(!args.length) {
			data.push('Здесь все мои команды');
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\n Ты можешь отправить \`${prefix}help [command name]\` что бы узнать о команде подробнее`);
			return message.author.send(data, { split: true })
				.then(()=>{
					if(message.channel.type === 'dm') return;
					message.reply('Я отправил все команды в ЛС!');
				})
				.catch(error => {
					console.error(`Не удалось отправить справку в ЛС для ${message.author.tag}`, error);
					message.reply('Кажется я не могу писать в ЛС');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if(!command) return message.reply('Не обладаю такой способностью');

		if(command.aliases) data.push(`**Псевдномы** ${command.aliases.join(', ')}`);
		if(command.desciption) data.push(`**Описание** ${command.description}`);
		if(command.usage) data.push(`**Использование** ${prefix}${command.name} ${command.usage}`);

		data.push(`**Отдых команды** ${command.cooldown || 3} second(s)`);
		message.channel.send(data, { split: true });
	},
};