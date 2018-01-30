var wlib		= require( '../../libs/wlib.js' );
var wdatetime	= require( '../../libs/wdatetime.js' );
var waes		= require( '../../libs/cipher/waes.js' );
var wsha256		= require( '../../libs/cipher/wsha256.js' );




/**
 *	CEncryptHint
 */
class CEncryptHint
{
	//	version
	m_nVersion			= 1;
	m_arrVersionList	= { 1 : 1 };


	constructor( nVersion )
	{
		this._initVersion( nVersion );
	}

	/**
	 *	@ public
	 *
	 *	@param	string	sHint
	 *	@return	string	encrypted hex string
	 */
	encryptHint( sHint )
	{
		var sRet;
		let arrKey;
		let arrHintBytes;
		let oAesCtrMode;
		let arrEncryptedBytes;
		let sEncryptedHex;

		//	...
		sRet	= null;
		arrKey	= this._createKey();
		if ( wlib.isArray( arrKey ) && 32 === arrKey.length )
		{
			//	Convert sMessage to bytes
			arrHintBytes = waes.utils.utf8.toBytes( sHint );
			if ( wlib.isArray( arrHintBytes ) )
			{
				// The counter is optional, and if omitted will begin at 1
				oAesCtrMode			= new waes.ModeOfOperation.ctr( arrKey, new waes.Counter( 1 ) );
				arrEncryptedBytes = oAesCtrMode.encrypt(arrHintBytes );
				if ( wlib.isArray( arrEncryptedBytes ) )
				{
					//	To print or store the binary data, you may convert arrEncryptedBytes to hex
					sEncryptedHex	= waes.utils.hex.fromBytes( arrEncryptedBytes );
					if ( wlib.getStrLen( sEncryptedHex ) > 0 )
					{
						//	...
						sRet = sEncryptedHex;
					}
				}
			}
		}

		return sRet;
	}


	/**
	 *	@ public
	 *
	 *	@param	string	sEncryptedHex
	 *	@return	string	decrypted message
	 */
	decryptSecret( sEncryptedHex )
	{
		var sRet;
		let arrKey;
		let oAesCtrMode;
		let arrEncryptedBytes;
		let arrDecryptedBytes;
		let sDecryptedText;

		if ( 0 === wlib.getStrLen( sEncryptedHex ) )
		{
			return null;
		}

		//	...
		sRet	= null;
		arrKey	= this._createKey();
		if ( wlib.isArray( arrKey ) && 32 === arrKey.length )
		{
			//	When ready to decrypt the hex string, convert it back to bytes
			arrEncryptedBytes	= waes.utils.hex.toBytes( sEncryptedHex );
			if ( wlib.isArray( arrEncryptedBytes ) )
			{
				//
				//	The counter mode of operation maintains internal state, so to
				//	decrypt a new instance must be instantiated.
				//
				oAesCtrMode			= new waes.ModeOfOperation.ctr( arrKey, new waes.Counter( 1 ) );
				arrDecryptedBytes	= oAesCtrMode.decrypt( arrEncryptedBytes );
				if ( wlib.isArray( arrDecryptedBytes ) )
				{
					//	Convert our arrDecryptedBytes back into text
					sDecryptedText	= waes.utils.utf8.fromBytes( arrDecryptedBytes );
					if ( wlib.getStrLen( sDecryptedText ) > 0 )
					{
						//	...
						sRet = sDecryptedText;
					}
				}
			}
		}

		return sRet;
	}



	/**
	 *	@ private
	 *	init version
	 */
	_initVersion( nVersion )
	{
		//
		//	set version
		//
		if ( wlib.isNumeric( nVersion ) &&
			wlib.isObjectWithKeys( this.m_arrVersionList, nVersion ) )
		{
			this.m_nVersion = nVersion;
		}
	}

	/**
	 *	create a 256-bits key by sha256
	 *
	 *	@return	array	256-bits key
	 */
	_createKey()
	{
		var arrRet;
		let sSource;
		let arrKey;

		//	...
		arrRet	= null;
		sSource	= '';

		sSource += '..........,..........';
		sSource += new String( this.m_nVersion );
		sSource += ',';
		sSource += wdatetime.formatDate( new Date() );
		sSource += '..........,..........';

		//	...
		arrKey	= wsha256.array( sSource );
		if ( wlib.isArray( arrKey ) && 32 === arrKey.length )
		{
			arrRet = arrKey;			
		}

		return arrRet;
	}


}





/**
 *	exports
 */
module.exports =
{
	CEncryptHint	: CEncryptHint
};