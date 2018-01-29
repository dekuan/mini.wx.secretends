//
//	index.js
//	获取应用实例
//
var wurl		= require( '../../libs/wurl.js' );
const app		= getApp();


Page({

	data:
	{
	},

	onLoad: function ( oOptions )
	{
	},


	onShareAppMessage: function (res)
	{
		if ('button' === res.from) {
			// 来自页面内转发按钮
			console.log(res.target);
		}

		return {
			title: '收到一封「加密纸条」',
			path: '/pages/index/index?id=1230993030303030303&t=12121212121212121212&c=asdfKiekkdkdkadfadf0a234234dfasdflkjas019873alskdjfhalskdjfhalsdkjfhakljsdhfaklshdf',
			success: function (res) {
				// 转发成功
			},
			fail: function (res) {
				// 转发失败
			}
		}
	},

	onFormCreateSubmit: function( oEvent )
	{
		console.log("onFormCreateSubmit", oEvent);
	}

})