module.exports = option => {
	var sendmessage = `
		<xml>
			<ToUserName><![CDATA[${option.toUserName}]]></ToUserName>
			<FromUserName><![CDATA[${option.fromUserName}]]></FromUserName>
			<CreateTime>${option.createTime}</CreateTime>
			<MsgType><![CDATA[${option.msgType}]]></MsgType>
	`
	// 处理不同的消息回复
	if (option.msgType == 'text') {
		sendmessage += `<Content><![CDATA[${option.content}]]></Content>`
	} else if (option.msgType == 'image') {
		sendmessage += `<Image>
			<MediaId><![CDATA[${option.mediaId}]]></MediaId>
		</Image>`
	} else if (option.msgType == 'voice') {
		sendmessage += `<Voice>
			<MediaId><![CDATA[option.mediaId]]></MediaId>
		</Voice>`
	} else if (option.msgType == 'video') {
		sendmessage += `<Video>
			<MediaId><![CDATA[option.mediaId]]></MediaId>
			<Title><![CDATA[option.title]]></Title>
			<Description><![CDATA[option.description]]></Description>
		</Video>`
	} else if (option.msgType == 'music') {
		sendmessage += `<Music>
			<Title><![CDATA[option.title]]></Title>
			<Description><![CDATA[option.description]]></Description>
			<MusicUrl><![CDATA[option.musicUrl]]></MusicUrl>
			<HQMusicUrl><![CDATA[option.hQMusicUrl]]></HQMusicUrl>
			<ThumbMediaId><![CDATA[option.thumbMediaId]]></ThumbMediaId>
		</Music>`
	} else if (option.msgType == 'news') {
		sendmessage += `<ArticleCount>${option.content.length}</ArticleCount><Articles>`
		
		option.content.forEach(item => {
			sendmessage += `<item>
				<Title><![CDATA[${item.title}]]></Title>
				<Description><![CDATA[${item.description}]]></Description>
				<PicUrl><![CDATA[${item.picurl}]]></PicUrl>
				<Url><![CDATA[${item.url}]]></Url>
			</item>`
		})
			
		sendmessage += `</Articles>`
	}
	
	sendmessage += `</xml>`
	
	return sendmessage
}