//
//	index.js
//	获取应用实例
//
var wurl		= require( '../../libs/wurl.js' );
var wlib		= require( '../../libs/wlib.js' );
var msecret		= require( '../../models/secret/CSecretEnds.js' );
var mhint		= require( '../../models/secret/CEncryptHint.js' );
var msign		= require( '../../models/secret/CSignature.js' );

var m_oTopToast 	= null;
var m_oHappyLoading	= null;
const app			= getApp();

/**
 *	open message status
 */
const _CONST_OPEN_MESSAGE_STATUS_EMPTY		= 1;
const _CONST_OPEN_MESSAGE_STATUS_DECRYPT	= 2;
const _CONST_OPEN_MESSAGE_STATUS_READ		= 3;




/**
 *	Page
 */
Page({

	data:
	{
		OPEN_MESSAGE_STATUS_EMPTY	: _CONST_OPEN_MESSAGE_STATUS_EMPTY,
		OPEN_MESSAGE_STATUS_DECRYPT	: _CONST_OPEN_MESSAGE_STATUS_DECRYPT,
		OPEN_MESSAGE_STATUS_READ	: _CONST_OPEN_MESSAGE_STATUS_READ,

		nOpenMessageStatus	: _CONST_OPEN_MESSAGE_STATUS_EMPTY,
		sPasswordHint		: '没有提示文字',
		sMessage			: '',

		bFocussPassword		: false,
		bDisabledSubmit		: false
	},

	onReady: function ()
	{
		//	获得 dialog组件
		m_oTopToast		= this.selectComponent( "#id-top-toast" );
		m_oHappyLoading	= this.selectComponent( "#id-happy-loading" );

		console.log("onReady / wurl.getCurrentPageArgs() = ", wurl.getCurrentPageArgs());
	},

	onLoad: function ( oOptions )
	{
		//	...
		console.log( "onLoad / wurl.getCurrentPageArgs() = ", wurl.getCurrentPageArgs() );

		//	...
		console.log("nOpenMessageStatus = ", this.data.nOpenMessageStatus);
		this._initPage();
		console.log("nOpenMessageStatus = ", this.data.nOpenMessageStatus);
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

		//	show loading
		m_oHappyLoading.showLoading();
		this.setData({
			bDisabledSubmit : true
		});

		//	...	
		sDecryptedMessage	= this._decryptMessage( sPassword );
		setTimeout( () =>
		{
			//	hide loading
			m_oHappyLoading.hideLoading();
			this.setData({
				bDisabledSubmit: false
			});

			if ( wlib.getStrLen( sDecryptedMessage ) > 0 )
			{
				this.setData({
					nOpenMessageStatus: this.data.OPEN_MESSAGE_STATUS_READ,
					sMessage: sDecryptedMessage
				});
			}
			else
			{
				m_oTopToast.showTopToast( 'err', '解密失败，请输入正确的密码' );
			}
		},
		wlib.getRandomNumber( 1000, 3000 ) );
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
				nOpenMessageStatus : this.data.OPEN_MESSAGE_STATUS_DECRYPT,
				sPasswordHint: oMHint.decryptSecret( oPageArgs.h )
			});
		}
		else
		{
			this.setData({
				nOpenMessageStatus: this.data.OPEN_MESSAGE_STATUS_EMPTY
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
		let oMSign;

		let oPageArgs;
		let nVersion;
		let nSecretId;
		let sEncryptedHex;
		let sSignature;
		let nTimestampStart;
		let nExpireInSeconds;
		let sSignatureCalc;
		let sMessage;

		//
		//	...
		//
		sRet		= null;
		oMSecret	= new msecret.CSecretEnds();
		oMSign		= new msign.CSignature();
		oPageArgs	= wurl.getCurrentPageArgs();

		if ( ! wlib.isObjectWithKeys( oPageArgs, [ 'v', 'i', 'm', 's', 'h', 'ts', 'te', '_' ] ) )
		{
			m_oTopToast.showTopToast( 'err', '参数错误，无法解密，请联系软件作者' );
			return null;
		}

		//	...
		nVersion			= parseInt( oPageArgs.v );
		nSecretId			= parseInt( oPageArgs.i );
		sEncryptedHex		= oPageArgs.m;
		sSignature			= oPageArgs.s;
		nTimestampStart		= parseInt( oPageArgs.ts );
		nExpireInSeconds	= parseInt( oPageArgs.te );

		oMSecret.version	= nVersion;
		sMessage			= oMSecret.decryptSecret(
				nSecretId, sEncryptedHex, sPassword, nTimestampStart, nExpireInSeconds
			);
		sSignatureCalc		= oMSign.createSignature([
			nSecretId, sMessage, sPassword, nTimestampStart, nExpireInSeconds
		]);

		if ( sSignature === sSignatureCalc )
		{
			sRet = sMessage;
		}

		console.log( "_decryptMessage = ", sRet, "lastErrorId = ", oMSecret.lastErrorId );

		//	...
		return sRet;
	}

})