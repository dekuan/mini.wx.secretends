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
		console.log( "##########" );
		console.log( oOptions );
		console.log("wurl.getCurrentPageUrl() = " + wurl.getCurrentPageUrl());
		console.log("wurl.getCurrentPageArgs() = ", wurl.getCurrentPageArgs());
		console.log("wurl.getCurrentPageUrlWithArgs() = " + wurl.getCurrentPageUrlWithArgs());
		console.log( "##########" );
	},

	onShareAppMessage : function( res )
	{
		if ('button' === res.from )
		{
			// 来自页面内转发按钮
			console.log( res.target );
		}

		return {
			title : '「加密纸条」',
			path : '/pages/index/index?fp=share',
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