
var url = 'https://api.weixin.qq.com'

module.exports = {
	accessTokenUrl: `${url}/cgi-bin/token?grant_type=client_credential`,
	jsapiTicketUrl: `${url}/cgi-bin/ticket/getticket`,
	createMenuUrl: `${url}/cgi-bin/menu/create`,
	deleteMenuUrl: `${url}/cgi-bin/menu/delete`,
	authAccessTokenUrl: `${url}/sns/oauth2/access_token`,
	refreshAccessTokenUrl: `${url}/sns/oauth2/refresh_token`,
	userInfoUrl: `${url}/sns/userinfo`
}