const Twitter = require('twit');

module.exports = (bot, twitterConfigFiles) => {

	const Twit = new Twitter({
		consumer_key: process.env.TWITTER_API_TOKEN,
		consumer_secret: process.env.TWITTER_API_SECRET_KEY,
		access_token:process.env.TWITTER_ACCES_KEY,
		access_token_secret: process.env.TWITTER_ACCES_SECRET_TOKEN,
		bearer_token: process.env.TWITTER_BEARER_TOKEN,
		timeout_ms: 60 * 1000,
	});

	for(const file of twitterConfigFiles) {
		const twitterConfig = require(`../configs/twitter_configs/${file}`);

		twitterConfig.accountsID.forEach((accountID) => {
			try{
				const stream = Twit.stream('statuses/filter', { follow: accountID });
				stream.on('tweet', (tweet)=>{
					if (tweet.user.id == accountID) {
						const link = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
						const message = twitterConfig.message.replace('{link}', link);
						bot.channels.cache.get(twitterConfig.channelId).send(message);
					}
				});
			}
			catch(err) {
				console.log(err);
			}
		});
	}
};