const Discord = require('discord.js');
const channelID = '833668196992942103';

module.exports = (bot) =>{

	const message =
    '**1.** Запрещается рассылка спама, рекламы или незаконной деятельности.\n' +
    '**2.** Никаких ненавистных или неприемлемых сообщений.\n' +
    '**3.** Запрещается чрезмерно проклинать или проклинать другого участника неуважительно.\n' +
    '**4.** Задавая вопросы, предоставьте как можно больше информации.\n' +
    '**5.** По возможности используйте каналы, соответствующие вашей теме.\n' +
    '**6.** Не пингуйте людей из ниоткуда, если у вас нет уважительной причины.\n' +
    '**7.** Не выдавайте себя за кого-либо, особенно за персонал.\n' +
    '**8.** Если увидите нарушение правил или что-то, что вас смущает, - сообщите администрацию. Мы хотим, чтобы сервер был комфортным местом для общения!\n\n' +

    '**Главный Боба, по всем вопросам можно найти здесь и в ЛС Discord**\n' +
    '<:instagram_icon:> **Instagram** https://www.instagram.com/illya_liebiediev\n\n' +
    '<:telegram_icon:> **Telegram**  https://t.me/LitLOs\n' +

    '**Нет твоего друга, не беда, просто отправь ему это:**\n' +
    '<:discord_icon:> **Discord** https://discord.gg/hYCXEZ9D6C]\n';

	const rulesEmbed = new Discord.MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Правила')
		.setAuthor('Добро Пожаловать на сервер Biba&Boba!')
		.setDescription(message)
		.attachFiles(['../logo_server.png'])
		.setThumbnail('attachment://logo_server.png')
		.setTimestamp()
		.setFooter(bot.user.username, bot.user.avatrURL);

	const channel = bot.channels.cache.get(channelID);
	channel.send(rulesEmbed);
};