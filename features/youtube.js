const Youtube = require('simple-youtube-api');
const Parser = require('rss-parser');

const parser = new Parser();
const youtube = new Youtube(process.env.YOUTUBE_TOKEN);

const startAt = Date.now;
const lastVideos = {};
module.exports = { check : check };

async function check(bot, youtubeConfig) {
	youtubeConfig.youtubers.forEach(async (youtuber) => {
		try{
			console.log(`[${youtuber.length >= 10 ? youtuber.slice(0, 10) + '...' : youtuber}] | Start cheking...`);
			const channelInfos = await getYoutubeChannelInfos(youtuber);
			if(!channelInfos) return console.log(`Invalid name youtuber: ${youtuber}`);

			const rssURL = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelInfos.id}`;
			const video = await checkVideos(channelInfos.raw.snippet.title, rssURL);
			if(!video) return console.log(`[${channelInfos.raw.snippet.title}] | No notification`);

			const channel = bot.channels.cache.get(youtubeConfig.channel);
			if(!channel) return console.log(`Channel ${youtubeConfig.channel} not found`);

			const duplicateMessage = await isDuplicateVideo(channel, video);
			if(duplicateMessage) return console.log(`Bot already publish video with name ${video.title}`);

			channel.send(
				youtubeConfig.message
					.replace('{videoURL}', video.link)
					.replace('{videoAuthorName}', video.author)
					.replace('{videoTitle}', video.title),
			);
			formatDate(new Date(video.pubDate));
			console.log('Notification Send!');
			lastVideos[channelInfos.raw.snippet.title] = video;
		}
		catch(err) {
			console.log(err);
		}
	});
}

async function isDuplicateVideo(channel, video) {
	const finalArray = [];
	channel.messages.fetch({ limit: 10 }).then(async messages => {
		const putInArray = async (data) => finalArray.push(data);

		for (const message of messages.array()) {
			await putInArray(`${message.author.username} : ${message.content}`);
			console.log(`${message.content} === ${video.title}`);
			return message.content.includes(video.title);
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

	console.log(`[${name.length >= 10 ? name.slice(0, 10) + '...' : name}] | Title of the resolved channel: ${channel.raw ? channel.raw.snippet.title : 'err'}`);
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
	console.log(`[${youtubeChannelName}]  | Getting videos...`);
	const content = await parser.parseURL(rssURL);
	console.log(`[${youtubeChannelName}]  | ${content.items.length} videos found`);
	const tLastVideos = content.items.sort((a, b) => {
		const aPubDate = new Date(a.pubDate || 0).getTime();
		const bPubDate = new Date(b.pubDate || 0).getTime();
		return bPubDate - aPubDate;
	});
	console.log(`[${youtubeChannelName}]  | The last video is "${tLastVideos[0] ? tLastVideos[0].title : 'err'}"`);
	return tLastVideos[0];
}