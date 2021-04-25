module.exports = {
	name: 'send',
	args: true,
	usage: '<channelID>',

	execute(message, args) {

		const targetChannelID = args[0];
		const channel = message.guild.channels.cache.get(targetChannelID);

		if(!channel) {
			message.reply(`Не правильный ID канала: ${targetChannelID}`);
			return console.log(`Not found channel with ID ${targetChannelID}`);
		}

		const finalArray = [];

		message.channel.messages.fetch({ limit: 2 }).then(async messages => {
			const putInArray = async (data) => finalArray.push(data);

			for (const msg of messages.array().reverse()) {
				await putInArray(msg.id);
				console.log(msg.content);
			}
			console.log('Start');
			const targetMessage = finalArray[0];
			const botMessage = '[BOT_MESSAGE]';
			const content = message.channel.messages.cache.get(targetMessage);
			if(!content.content.startsWith(botMessage)) {
				message.reply(`Для отправки сообщения от имени бота, сообщение должно начинаться с ${botMessage}`);
				return console.log('Incorrrect bot message');
			}
			let targetContent = content.content.slice(botMessage.length);
			targetContent += '\n\n С ув. Администрация Сервера!';

			channel.send(targetContent);
		});
	},
};