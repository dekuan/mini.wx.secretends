//
//	index.js
//	获取应用实例
//
var wurl		= require( '../../libs/wurl.js' );
var wlib		= require( '../../libs/wlib.js' );
const app		= getApp();



Page({

	data:
	{
	},

	onLoad: function ( oOptions )
	{
	},


	onMessageInput: function( oEvent )
	{
		console.log("onMessageInput", oEvent);
	},

	onFormCreateSubmit: function( oEvent )
	{
		var sMessage;
		var sPassword;
		var sPasswordHint;

		if ( ! wlib.isObjectWithKeys( oEvent, 'detail' ) ||
			! wlib.isObjectWithKeys( oEvent.detail, 'value' ) ||
			! wlib.isObjectWithKeys( oEvent.detail.value, [ 'message', 'password', 'password_hint' ] ) )
		{

		}

		//	...
		sMessage		= '';
		sPassword		= '';
		sPasswordHint	= '';



		console.log("onFormCreateSubmit", oEvent);

		wx.navigateTo({
			url: '/pages/done/done'
		});
	}

})