module.exports = (bot) => {
	const channelID = '833656933578833951';
	const targetChanelID = '833668196992942103';

	bot.on('guildMemberAdd', (member) => {
		console.log(member);
		const message = `**Добро Пожаловать**, <@${member.id}> на сервер! Условия пользования, здесь 
        ${member.guild.channels.cache.get(targetChanelID).toString()}`;

		const channel = member.guild.channels.cache.get(channelID);
		channel.send(message);
	});
};