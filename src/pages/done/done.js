//
//	index.js
//	获取应用实例
//
var wurl		= require( '../../libs/wurl.js' );
var wlib		= require( '../../libs/wlib.js' );
var mhint		= require( '../../models/secret/CEncryptHint.js' );

const app		= getApp();

var m_oTopToast = null;



Page({

	data:
	{
		sPasswordHint	: ''
	},

	onReady: function()
	{
		//	获得 dialog组件
		m_oTopToast = this.selectComponent("#id-top-toast");

		//	...
		this._initPage();
	},

	onLoad: function( oOptions )
	{
		console.log( "DONE / wurl.getCurrentPageArgs() = ", wurl.getCurrentPageArgs() );
	},


	onTopToastCancel: function ( oEvent )
	{
		console.log( "onTopToastCancel", oEvent );
		m_oTopToast.hideTopToast();
	},
	onShareAppMessage: function( oArgs )
	{
		var oPageArgs;
		var sShareUrl;

		if ( 'button' === oArgs.from )
		{
			//	来自页面内转发按钮
			console.log( oArgs.target );
		}

		//	...
		oPageArgs	= wurl.getCurrentPageArgs();

		if ( ! wlib.isObjectWithKeys( oPageArgs, [ 'v', 'i', 'm', 'h', 'ts', 'te', '_' ] ) )
		{
			m_oTopToast.showTopToast( 'err', '参数错误，无法发送给朋友，请联系软件作者' );
			return false;
		}

		//	...
		sShareUrl	= "/pages/open/open?" + wurl.serializeArgs( oPageArgs );

		return {
			title: '收到一封「加密纸条」',
			path: sShareUrl,
			success: function( oRes )
			{
				console.log( "转发成功", oRes );
			},
			fail: function( oRes )
			{
				console.log( "转发失败", oRes );
			}
		};
	},


	/**
	 *	initalize page
	 */
	_initPage : function()
	{
		var oMHint;
		var oPageArgs;


		//	...
		oMHint		= new mhint.CEncryptHint();
		oPageArgs	= wurl.getCurrentPageArgs();

		if ( wlib.isObjectWithKeys( oPageArgs, 'h' ) )
		{
			this.setData({
				sPasswordHint: oMHint.decryptSecret( oPageArgs.h )
			});
		}
		else
		{
			m_oTopToast.showTopToast( 'err', '没有发现解密提示文字');
		}

	}

})