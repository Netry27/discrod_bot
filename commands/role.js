module.exports = {
	name: 'role',
	args: true,
	usage: 'name role',

	execute(message, args) {
		const rolesChannelID = '833992284563308554';
		const supportChannelID = '833996664850088017';
		const messageChannel = message.channel.id;
		const rolesChannel = message.guild.channels.cache.get(rolesChannelID);
		const supportChannel = message.guild.channels.cache.get(supportChannelID);

		if(messageChannel != rolesChannelID) {
			message.reply(`что бы получить роль напиши в этот чат ${rolesChannel}.`);
			return console.log('Incorrect channel for give roles');
		}

		const roleName = args.shift();
		const targetRole = message.guild.roles.cache.find((role) => {
			return role.name === roleName;
		});

		if(!targetRole) {
			message.reply(`Такой роли **${roleName}** еще нет, будь первым, напиши в ${supportChannel}`);
			return console.log(`Role ${roleName} incorrect`);
		}

		const forbidRoles = ['Admin', 'everyone', 'Пенетратор', 'Head'];
		const allowRoles = forbidRoles.find((role) => {
			return targetRole.name === role;
		});

		if(allowRoles) {
			let reply = `Извини, но ты не можешь получить роль: **${targetRole.name}**, так как она очень важна для сервера.`;
			if(allowRoles == 'Admin') {
				reply += `\n Если ты, считаешь что готов, напиши в ${supportChannel}`;
			}
			message.reply(reply);
			return console.log(`Trying to get the role: ${roleName}`);
		}

		const boosterRoles = ['Server Booster'];
		const allowBoostRole = boosterRoles.find((role) => {
			return targetRole.name === role;
		});
		if(allowBoostRole) {
			const replyBoost = `Извини, но ты не можешь получить роль: **${targetRole.name}**, для того что бы ее получить тебе нужно забустить, наш сервер.`;
			message.reply(replyBoost);
			return console.log(`Trying to get the role: ${roleName}`);
		}

		const targetUser = message.member;
		const isAlreadyRole = message.member.roles.cache.find((role) => {
			return role === targetRole;
		});

		if(isAlreadyRole) {
			message.reply(`Пользователь уже имеет роль ${targetRole}`);
			return console.log(`${targetUser} user already has role ${targetRole}`);
		}

		targetUser.roles.add(targetRole);
		message.reply(`Теперь у тебя есть роль ${targetRole}, **хорошей игры!**`);
		console.log(`${targetUser} give role ${targetRole}`);
	},
};