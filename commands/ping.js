module.exports = {
	name: 'ping',
	descrition: 'Ping!',
	execute(message) {
		message.channel.send('Pong!');
	},
};