//
//	index.js
//	获取应用实例
//
var wurl		= require( '../../libs/wurl.js' );
var wlib		= require( '../../libs/wlib.js' );
var msecret		= require( '../../models/secret/CSecretEnds.js' );
var mhint		= require( '../../models/secret/CEncryptHint.js' );


const app		= getApp();

var m_oTopToast = null;



/**
 *	Page
 */
Page({

	data:
	{
		haveMessage		: false,
		sPasswordHint	: '没有提示文字',

		bFocussPassword	: false
	},

	onReady: function ()
	{
		//	获得 dialog组件
		m_oTopToast	= this.selectComponent( "#id-top-toast" );

		//	...
		this._initPage();
	},

	onLoad: function ( oOptions )
	{
		//	...
		console.log( "OPEN / wurl.getCurrentPageArgs() = ", wurl.getCurrentPageArgs() );
	},


	onFormOpenSubmit : function( oEvent )
	{
		var sPassword;
		var sDecryptedMessage;

		//	...
		console.log( "onFormOpenSubmit", oEvent );

		if ( ! wlib.isObjectWithKeys( oEvent, 'detail' ) ||
			! wlib.isObjectWithKeys(oEvent.detail, 'value') ||
			! wlib.isObjectWithKeys(oEvent.detail.value, [ 'password' ] ) )
		{
			m_oTopToast.showTopToast('err', '参数错误，无法继续');
			return false;
		}

		//	...
		sPassword	= oEvent.detail.value.password;

		if ( 0 == wlib.getStrLen( sPassword, true ) )
		{
			this.setData({
				bFocussPassword: true,
			});
			m_oTopToast.showTopToast('err', '请输入密码');
			return false;
		}

		//	...
		sDecryptedMessage	= this._decryptMessage( sPassword );
		if ( wlib.getStrLen( sDecryptedMessage ) > 0 )
		{
			wx.showModal({
				title: '纸条内容',
				content: sDecryptedMessage,
				success: function (res) {
					if (res.confirm) {
						console.log('用户点击确定')
					} else if (res.cancel) {
						console.log('用户点击取消')
					}
				}
			})
		}
		else
		{
			m_oTopToast.showTopToast( 'err', '解密失败，请输入正确的密码' );
		}

	},


	/**
	 *	initalize page
	 */
	_initPage : function ()
	{
		var oMHint;
		var oPageArgs;

		//	...
		oMHint		= new mhint.CEncryptHint();
		oPageArgs	= wurl.getCurrentPageArgs();

		if ( wlib.isObjectWithKeys( oPageArgs, 'h' ) )
		{
			this.setData({
				haveMessage:true,
				sPasswordHint: oMHint.decryptSecret( oPageArgs.h )
			});
		}
		else
		{
			this.setData({
				haveMessage: false
			});
		}

	},


	/**
	 *	@private
	 *	@return	string	decrypted message
	 */
	_decryptMessage: function ( sPassword )
	{
		var sRet;
		let oMSecret;

		let oPageArgs;
		let nVersion;
		let nSecretId;
		let sEncryptedHex;
		let nTimestampStart;
		let nExpireInSeconds;

		//
		//	...
		//
		sRet		= null;
		oMSecret	= new msecret.CSecretEnds();
		oPageArgs	= wurl.getCurrentPageArgs();

		if ( ! wlib.isObjectWithKeys( oPageArgs, [ 'v', 'i', 'm', 'h', 'ts', 'te', '_' ] ) )
		{
			m_oTopToast.showTopToast( 'err', '参数错误，无法解密，请联系软件作者' );
			return false;
		}

		//	...
		nVersion			= parseInt( oPageArgs.v );
		nSecretId			= parseInt( oPageArgs.i );
		sEncryptedHex		= oPageArgs.m;
		nTimestampStart		= parseInt( oPageArgs.ts );
		nExpireInSeconds	= parseInt( oPageArgs.te );

		oMSecret.version	= nVersion;
		sRet 				= oMSecret.decryptSecret
			(
				nSecretId,
				sEncryptedHex,
				sPassword,
				nTimestampStart,
				nExpireInSeconds
			);

		console.log("_decryptMessage = ", sRet, "lastErrorId = ", oMSecret.lastErrorId );

		return sRet;
	}

})