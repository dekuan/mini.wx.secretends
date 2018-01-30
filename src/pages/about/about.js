/**
 *	about
 */
const app		= getApp();




Page({

	data:
	{
	},

	onLoad: function ( oOptions )
	{
	},

	onShareAppMessage : function( res )
	{
		if ('button' === res.from )
		{
			// 来自页面内转发按钮
			console.log( res.target );
		}

		return {
			title : '关于「加密纸条」',
			path : '/pages/about/about',
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