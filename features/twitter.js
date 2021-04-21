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

		twitterConfig.accountsID.forEach((config) => {
			try{
				const stream = Twit.stream('statuses/filter', {
					follow: config,
				});
				stream.on('tweet', (tweet)=>{

					if(isReply) {
						const twitterMessage = `**${tweet.user.name}**, только что опубликовал новый твит, здесь: \nhttps://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
						bot.channels.cache.get(twitterConfig.channelId).send(twitterMessage);
					}
				});
			}
			catch(err) {
				console.log(err);
			}
		});
	}

	function isReply(tweet) {
		if (tweet.retweeted_status
          || tweet.in_reply_to_status_id
          || tweet.in_reply_to_status_id_str
          || tweet.in_reply_to_user_id
          || tweet.in_reply_to_user_id_str
          || tweet.in_reply_to_screen_name) {return true;}
	}
};