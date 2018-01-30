//
//	index.js
//	获取应用实例
//
var wurl		= require( '../../libs/wurl.js' );

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
		var sMessage = '❤️我爱你中国，我要把美好的青春先给你！';
		var sPassword	= '18811070903';
		var nTimestampStart	= 111;
		var nExpireInSeconds	= 111;
		var oMSecret	= new msecret.CSecretEnds();

		var sEncryptedHex	= oMSecret.encryptSecret( sMessage, sPassword, nTimestampStart, nExpireInSeconds );
		console.log('encryptedHex = ' + '(SRC TEXT LEN=' + sMessage.length + ')' + sEncryptedHex + ', lastErrorId=' + oMSecret.lastErrorId);

		var sDecryptedText	= oMSecret.decryptSecret( sEncryptedHex, sPassword, nTimestampStart, nExpireInSeconds );
		console.log('decryptedText = ' + sDecryptedText + ', lastErrorId=' + oMSecret.lastErrorId );
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