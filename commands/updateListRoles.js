const Discord = require('discord.js');

module.exports = {
	name: 'updatelistroles',

	execute(message) {
		let rolemap = message.guild.roles.cache
			.sort((a, b) => b.position - a.position)
			.map(r => r)
			.join('\n\n');
		if (rolemap.length > 1024) rolemap = 'To many roles to display';
		if (!rolemap) rolemap = 'No roles';
		const embed = new Discord.MessageEmbed()
			.addField('Role List', rolemap);
		message.channel.send(embed);
	},
};