module.exports = {
	name: 'kick',
	description: 'Пенетрирование участника',
	guildOnly: true,

	execute(message) {
		if(!message.mentions.users.size) {
			return message.reply('Кого отпенетрировать, я так и не понял?');
		}

		const taggedUser = message.mentions.users.first();
		message.channel.send(`${taggedUser} Отпенетрирован`);
	},
};