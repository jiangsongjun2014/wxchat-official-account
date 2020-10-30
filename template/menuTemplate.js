module.exports = {
	"button":[
	    {   "type":"click", "name":"菜单五", "key":"CLICK" },
	    {   "name":"菜单二",
			"sub_button":[
				{ "type": "view", "name": "跳转链接", "url": "https://www.baidu.com/" },
				{ "type": "scancode_waitmsg", "name": "扫码带提示", "key": "rselfmenu_0_0" }, 
				{ "type": "scancode_push", "name": "扫码推事件", "key": "rselfmenu_0_1" }
			]
	    },
		{   "name": "菜单三", 
			"sub_button": [
				{ "type": "pic_sysphoto", "name": "相机", "key": "rselfmenu_1_0" },
				{ "type": "pic_weixin", "name": "相册", "key": "rselfmenu_1_2" },
				{ "type": "pic_photo_or_album", "name": "相机相册",  "key": "rselfmenu_1_1" }
			]
		}
	]
}