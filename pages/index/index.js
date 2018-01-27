//
//	index.js
//	获取应用实例
//
var wurl				= require( '../../libs/wurl.js' );
var aesjs				= require( '../../libs/waes.js' );
var wsha256 = require('../../libs/wsha256.js');

var CryptoJsAES 		= require('../../libs/crypto-js/aes.js');
var CryptoJsEncUtf8 	= require('../../libs/crypto-js/enc-utf8.js');
var CryptoJsEncBase64	= require('../../libs/crypto-js/enc-base64.js');
var CryptoJsEncHex = require('../../libs/crypto-js/enc-hex.js');


//var CryptoJsPbkdf2 		= require('../../libs/crypto-js/pbkdf2.js');


// var xxPbkdf2			= require( '../../libs/pbkdf2.js' );

const app		= getApp();




Page({

	data:
	{
		motto: 'Hello World',
		userInfo: {},
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo')
	},

	//	事件处理函数
	bindViewTap : function()
	{
		wx.navigateTo
		({
			url: '../logs/logs'
		});
	},
  
	doWAes : function()
	{
		var password = '18811070903';
		var salt	= '12323232323123123123123123123';

		console.log('^^^^^^wsha256 = ' + wsha256.hex( password ) );

		// An example 128-bit key (16 bytes * 8 bits/byte = 128 bits)
		var key = [0, 0, 0, 0, 0xFF, 255, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
		key = wsha256.array( password );

		// Convert text to bytes
		var text = '我爱你中国，我要把美好的青春先给你！';
		var textBytes = aesjs.utils.utf8.toBytes(text);

		// The counter is optional, and if omitted will begin at 1
		var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(1));
		var encryptedBytes = aesCtr.encrypt(textBytes);

		// To print or store the binary data, you may convert it to hex
		var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
		console.log('encryptedHex = ' + '(SRC TEXT LEN=' + text.length + ')' + encryptedHex );
		// "a338eda3874ed884b6199150d36f49988c90f5c47fe7792b0cf8c7f77eeffd87
		//  ea145b73e82aefcf2076f881c88879e4e25b1d7b24ba2788"

		// When ready to decrypt the hex string, convert it back to bytes
		var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);

		// The counter mode of operation maintains internal state, so to
		// decrypt a new instance must be instantiated.
		var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(1));
		var decryptedBytes = aesCtr.decrypt(encryptedBytes);

		// Convert our bytes back into text
		var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
		console.log('decryptedText = ' + decryptedText);
		// "Text may be any length you wish, no padding is required."
	},

	onLoad: function ( oOptions )
	{
		console.log( "##########" );
		console.log( oOptions );
		console.log("wurl.getCurrentPageUrl() = " + wurl.getCurrentPageUrl());
		console.log("wurl.getCurrentPageArgs() = ", wurl.getCurrentPageArgs());
		console.log("wurl.getCurrentPageUrlWithArgs() = " + wurl.getCurrentPageUrlWithArgs());

		this.doWAes();


		console.log( "##########" );

		if ( app.globalData.userInfo )
		{
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true
			});
		}
		else if ( this.data.canIUse )
		{
			//	由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
			//	所以此处加入 callback 以防止这种情况
			app.userInfoReadyCallback = res => {
				this.setData({
					userInfo: res.userInfo,
					hasUserInfo: true
				});
			};
		}
		else
		{
			// 在没有 open-type=getUserInfo 版本的兼容处理
			wx.getUserInfo
			({
				success: res => {
					app.globalData.userInfo = res.userInfo
					this.setData
					({
						userInfo: res.userInfo,
						hasUserInfo: true
					});
				}
			});
		}
	},

	getUserInfo : function( e )
	{
		console.log( e );
		
		app.globalData.userInfo = e.detail.userInfo;
		this.setData
		({
			userInfo: e.detail.userInfo,
			hasUserInfo: true
		});
	},


	onShareAppMessage : function( res )
	{
		if ('button' === res.from )
		{
			// 来自页面内转发按钮
			console.log( res.target );
		}

		return {
			title : '自定义转发标题',
			path : '/pages/index/index?id=1230993030303030303&t=12121212121212121212&c=asdfKiekkdkdkadfadf0a234234dfasdflkjas019873alskdjfhalskdjfhalsdkjfhakljsdhfaklshdf',
			success : function( res )
			{
				// 转发成功
			},
			fail : function( res )
			{
				// 转发失败
			}
		}
	}






})