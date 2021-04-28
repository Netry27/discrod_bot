const Youtube = require('simple-youtube-api');
const Parser = require('rss-parser');

const parser = new Parser();
const startAt = Date.now;
const lastVideos = {};
const youtube = new Youtube(process.env.YOUTUBE_TOKEN);
module.exports = { check : check };

async function check(bot, youtubeConfig) {
	const time = new Date;
	const hours = time.getHours();

	console.log(`Hours now ${hours}`);
	if(hours < 6 || hours > 18) {
		return console.log('Youtubers Sleep');
	}

	youtubeConfig.youtubers.forEach(async (youtuber) => {
		try{
			console.log(`[${youtuber.length >= 15 ? youtuber.slice(0, 15) + '...' : youtuber}] | Start cheking...`);
			const channelInfos = await getYoutubeChannelInfos(youtuber);
			if(!channelInfos) return console.log(`Invalid name youtuber: ${youtuber}`);

			const rssURL = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelInfos.id}`;
			const video = await checkVideos(channelInfos.raw.snippet.title, rssURL);
			if(!video) return console.log(`[${channelInfos.raw.snippet.title}] | No notification`);

			const channel = bot.channels.cache.get(youtubeConfig.channel);
			if(!channel) return console.log(`Channel ${youtubeConfig.channel} not found`);

			const title = youtubeConfig.message
				.replace('{videoURL}', video.link)
				.replace('{videoAuthorName}', video.author)
				.replace('{videoTitle}', video.title);

			const oldMessages = await channel.messages.fetch({ limit: 10 }).then(async messages => {
				const final = [];
				const putInArray = async (data) => final.push(data);

				for (const message of messages.array()) {
					await putInArray(message.content);
				}
				return final;
			});

			const msg = oldMessages.find(msgs => {
				if(msgs == title) {
					return msgs;
				}
			});
			console.log(msg);
			if(msg) return console.log(`Video from YouTuber ${video.author} already published`);

			channel.send(title);
			formatDate(new Date(video.pubDate));
			console.log('Notification Send!');
			lastVideos[channelInfos.raw.snippet.title] = video;
		}
		catch(err) {
			console.log(err);
		}
	});
}

async function getYoutubeChannelInfos(name) {
	console.log(`[${name.length >= 10 ? name.slice(0, 10) + '...' : name}]`);
	let channel = null;
	const id = getYoutubeChannelIdFromURL(name);
	if(id) {
		channel = await youtube.getChannelByID(id);
	}

	if(!channel) {
		const channels = await youtube.searchChannels(name);
		if(channels.length > 0) {
			channel = channels[0];
		}
	}
	return channel;
}

function formatDate(date) {
	const monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
	const day = date.getDate(), month = date.getMonth(), year = date.getFullYear();
	return `${day} ${monthNames[parseInt(month, 10)]} ${year}`;
}

function getYoutubeChannelIdFromURL(url) {
	let id = null;
	url = url.replace(/(>|<)/gi, '').split(/(\/channel\/|\/user\/)/);

	if(url[2]) {
		id = url[2].split(/[^0-9a-z_-]/i)[0];
	}
	return id;
}

async function checkVideos(youtubeChannelName, rssURL) {
	console.log(`[${youtubeChannelName}] | Get the last video..`);
	const lastVideo = await getLastVideo(youtubeChannelName, rssURL);
	if(!lastVideo) return console.log('[ERR] | No video found for ' + lastVideo);
	if(new Date(lastVideo.pubDate).getTime() < startAt) return console.log(`[${youtubeChannelName}] | Last video was uploaded before the bot starts`);
	const lastSavedVideo = lastVideos[youtubeChannelName];
	if(lastSavedVideo && (lastSavedVideo.id === lastVideo.id)) return console.log(`[${youtubeChannelName}] | Last video is the same as the last saved`);
	return lastVideo;
}

async function getLastVideo(youtubeChannelName, rssURL) {
	const content = await parser.parseURL(rssURL);
	const tLastVideos = content.items.sort((a, b) => {
		const aPubDate = new Date(a.pubDate || 0).getTime();
		const bPubDate = new Date(b.pubDate || 0).getTime();
		return bPubDate - aPubDate;
	});
	console.log(`[${youtubeChannelName}]  | The last video is "${tLastVideos[0] ? tLastVideos[0].title : 'err'}"`);
	return tLastVideos[0];
}