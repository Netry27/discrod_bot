module.exports = {
	name: 'role',
	args: true,
	usage: '<name role>',

	execute(message, args) {
		const rolesChannelID = '833992284563308554';
		const supportChannelID = '833996664850088017';
		const messageChannel = message.channel.id;
		const rolesChannel = message.guild.channels.cache.get(rolesChannelID);

		if(messageChannel != rolesChannelID) {
			message.reply(`что бы получить роль напиши в этот чат ${rolesChannel}.`);
			return console.log('Incorrect channel for give roles');
		}

		const roleName = args.shift();
		const targetRole = message.guild.roles.cache.find((role) => {
			console.log(`${role.name} == ${roleName}`);
			return role.name === roleName;
		});

		if(!targetRole) {
			const supportChannel = message.guild.channels.cache.get(supportChannelID);
			message.reply(`такой роли **${roleName}** еще нет, будь первым, напиши в ${supportChannel}`);
			return console.log(`Role ${roleName} incorrect`);
		}

		const targetUser = message.member;

		const isAlreadyRole = message.member.roles.cache.find((role) => {
			return role === targetRole;
		});

		if(isAlreadyRole) {
			message.reply(`пользователь уже имеет роль ${targetRole}`);
			return console.log(`${targetUser} user already has role ${targetRole}`);
		}

		targetUser.roles.add(targetRole);
		message.reply(`теперь у тебя есть роль ${targetRole}, **хорошей игры!**`);
		console.log(`${targetUser} give role ${targetRole}`);
	},
};