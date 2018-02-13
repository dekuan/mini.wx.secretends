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
		bFocussPasswordHint	: false,

		sPasswordHint		: '',

		bPasswordHintDlgShow	: false,
		arrPasswordHintList		: [
			"密码排行榜上排名第一的密码",
			"我们第一次遇见的城市名",
			"我们第一次看的电影名",
			"我们第一次阅读的书名",
			"我身上的纹身图案什么含义",
			"最难忘，爱你的那首歌",
			"挖掘机技术哪家强",
			"一棵藤上七个瓜，风吹雨打都不怕",
			"啊…… 啊啊啊 ……，电影名",
			"长江长江！我是黄河！",
			"空气在颤抖，天空在燃烧，是啊",
			"鸳鸯茶，鸳鸯茶，你爱我……",
			"天王盖地虎，宝塔镇河妖",
			"坦白从宽，抗拒从严"
		],
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
		//console.log( "onTopToastCancel", oEvent );
		m_oTopToast.hideTopToast();
	},
	onMessageInput: function( oEvent )
	{
		//console.log("onMessageInput", oEvent);
	},

	/**
	 *	show password hint
	 */
	onTapShowPasswordHintDlg: function( oEvent )
	{
		this.setData({
			bPasswordHintDlgShow: true,
		});
	},
	onTapHidePasswordHintDlg: function( oEvent )
	{
		this.setData({
			bPasswordHintDlgShow: false
		});
	},
	onTapPasswordHintItem: function( oEvent )
	{
		let nIndex;

		//	...
		nIndex	= parseInt( oEvent.currentTarget.dataset.index );

		if ( nIndex >= 0 && nIndex < this.data.arrPasswordHintList.length )
		{
			this.setData({
				sPasswordHint: this.data.arrPasswordHintList[ nIndex ],
			});
		}

		this.setData({
			bPasswordHintDlgShow: false
		});

		//	...
		//console.log( "onTapPasswordHintItem", oEvent );
	},


	onFormCreateSubmit: function( oEvent )
	{
		var sMessage;
		var sPassword;
		var sPasswordHint;

		//	...
		//console.log( "onFormCreateSubmit", oEvent );

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
			m_oTopToast.showTopToast( 'err', '纸条内容不能含有表情符等其他特殊字符');
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
		if ( ! wchar.isChineseChars( sPassword ) )
		{
			this.setData({
				bFocusMessage: false,
				bFocussPassword: true,
				bFocussPasswordHint: false
			});
			m_oTopToast.showTopToast( 'err', '密码不能含有表情符等其他特殊字符' );
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
		if ( ! wchar.isChineseChars( sPasswordHint ) )
		{
			this.setData({
				bFocusMessage: false,
				bFocussPassword: false,
				bFocussPasswordHint: true
			});
			m_oTopToast.showTopToast( 'err', '密码提示文字不能含有表情符等其他特殊字符');
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