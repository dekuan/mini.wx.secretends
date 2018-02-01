//
//	create.js
//
var wurl		= require( '../../libs/wurl.js' );
var wlib		= require( '../../libs/wlib.js' );
var wchar		= require( '../../libs/wchar.js' );
var wdatetime	= require( '../../libs/wdatetime.js' );
var msecret		= require( '../../models/secret/CSecretEnds.js' );
var mhint		= require( '../../models/secret/CEncryptHint.js' );
var msign		= require( '../../models/secret/CSignature.js' );

const app		= getApp();
var m_oTopToast	= null;



/**
 *	Page
 */
Page({

	data:
	{
		bFocusMessage		: true,
		bFocussPassword		: false,
		bFocussPasswordHint	: false
	},

	onReady: function ()
	{
		//	获得 dialog组件
		m_oTopToast	= this.selectComponent( "#id-top-toast" );
	},
	onLoad: function ( oOptions )
	{
	},


	onTopToastCancel: function( oEvent )
	{
		console.log( "onTopToastCancel", oEvent );
		m_oTopToast.hideTopToast();
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

		//	...
		console.log( "onFormCreateSubmit", oEvent );

		if ( ! wlib.isObjectWithKeys( oEvent, 'detail' ) ||
			! wlib.isObjectWithKeys( oEvent.detail, 'value' ) ||
			! wlib.isObjectWithKeys( oEvent.detail.value, [ 'message', 'password', 'password_hint' ] ) )
		{
			m_oTopToast.showTopToast( 'err', '参数错误，无法继续' );
			return false;
		}

		//	...
		sMessage		= oEvent.detail.value.message;
		sPassword		= oEvent.detail.value.password;
		sPasswordHint	= oEvent.detail.value.password_hint;

		if ( 0 == wlib.getStrLen( sMessage, true ) )
		{
			this.setData({
				bFocusMessage: true,
				bFocussPassword: false,
				bFocussPasswordHint: false
			});
			m_oTopToast.showTopToast( 'err', '请输入纸条内容，最多 128 个字符' );
			return false;
		}
		if ( ! wchar.isChineseChars( sMessage ) )
		{
			this.setData({
				bFocusMessage: true,
				bFocussPassword: false,
				bFocussPasswordHint: false
			});
			m_oTopToast.showTopToast( 'err', '纸条内容只能是中文、符号、英文数字符号。不能含有表情符');
			return false;
		}
		if ( 0 == wlib.getStrLen( sPassword, true ) )
		{
			this.setData({
				bFocusMessage: false,
				bFocussPassword: true,
				bFocussPasswordHint: false
			});
			m_oTopToast.showTopToast( 'err', '请输入密码，最多 32 个字符' );
			return false;
		}
		if ( 0 == wlib.getStrLen( sPasswordHint, true ) )
		{
			this.setData({
				bFocusMessage: false,
				bFocussPassword: false,
				bFocussPasswordHint: true
			});
			m_oTopToast.showTopToast( 'err', '请输入解密提示文字，最多 64 个字符' );
			return false;
		}

		//
		//	begin the encryption
		//
		wx.navigateTo({
			url: '/pages/done/done?' + this._encryptMessage( sMessage, sPassword, sPasswordHint )
		});
	},

	/**
	 *	@private
	 */
	_encryptMessage: function( sMessage, sPassword, sPasswordHint )
	{
		var sRet;
		let oMSecret;
		let oMHint;
		let oMSign;

		let nSecretId;
		let nTimestampStart;
		let nExpireInSeconds;
		let sEncryptedHex;
		let sSignature;

		//
		//	todo
		//	1, AES password hint
		//
		oMSecret			= new msecret.CSecretEnds();
		oMHint 				= new mhint.CEncryptHint();
		oMSign				= new msign.CSignature();

		nSecretId			= wdatetime.getCurrentTimestamp();
		nTimestampStart		= wdatetime.getCurrentTimestamp();
		nExpireInSeconds	= 0;
		sEncryptedHex		= oMSecret.encryptSecret(
			nSecretId, sMessage, sPassword, nTimestampStart, nExpireInSeconds
		);
		sSignature			= oMSign.createSignature([
			nSecretId, sMessage, sPassword, nTimestampStart, nExpireInSeconds
		]);

		//	...
		sRet	= ""
		+ "v=" + new String( oMSecret.version ) + "&"
		+ "i=" + new String( nSecretId ) + "&"
		+ "m=" + new String( sEncryptedHex ) + "&"
		+ "s=" + new String( sSignature ) + "&"
		+ "h=" + new String( oMHint.encryptHint( sPasswordHint ) ) + "&"
		+ "ts=" + new String( nTimestampStart ) + "&"
		+ "te=" + new String( nExpireInSeconds ) + "&"
		+ "_=" + new String( wdatetime.getCurrentTimestamp() )
		;

		return sRet;
	}

})