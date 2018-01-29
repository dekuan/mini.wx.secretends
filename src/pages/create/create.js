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


	onMessageInput: function( oEvent )
	{
		console.log("onMessageInput", oEvent);
	},

	onFormCreateSubmit: function( oEvent )
	{
		console.log("onFormCreateSubmit", oEvent);
	}

})