var wlib		= require( '../../libs/wlib.js' );
var wdatetime	= require( '../../libs/wdatetime.js' );
var waes		= require( '../../libs/cipher/waes.js' );
var wsha256		= require( '../../libs/cipher/wsha256.js' );


/**
 *	secret ends errors
 */
class CSecretEndsErrors {
}
CSecretEndsErrors.ERROR_SUCCESS	= 0;
CSecretEndsErrors.ERROR_UNKNOWN	= -1;

CSecretEndsErrors.ERROR_ENCRYPTSECRET_PARAM_SECRET_ID					= 1000;
CSecretEndsErrors.ERROR_ENCRYPTSECRET_PARAM_MESSAGE						= 1001;
CSecretEndsErrors.ERROR_ENCRYPTSECRET_CREATEKEY							= 1010;
CSecretEndsErrors.ERROR_ENCRYPTSECRET_CONVERT_MESSAGE_TO_BYTES			= 1011;
CSecretEndsErrors.ERROR_ENCRYPTSECRET_AES_CTR_MODE_ENCRYPT				= 1012;
CSecretEndsErrors.ERROR_ENCRYPTSECRET_CONVERT_ENCRYPTED_BYTES_TO_HEX	= 1013;

CSecretEndsErrors.ERROR_DECRYPTSECRET_PARAM_SECRET_ID					= 2000;
CSecretEndsErrors.ERROR_DECRYPTSECRET_PARAM_ENCRYPTED_HEX 				= 2001;
CSecretEndsErrors.ERROR_DECRYPTSECRET_CREATEKEY 						= 2010;
CSecretEndsErrors.ERROR_ENCRYPTSECRET_CONVERT_ENCRYPTED_HEX_TO_BYTES	= 1011;
CSecretEndsErrors.ERROR_DECRYPTSECRET_AES_CTR_MODE_DECRYPT				= 2012;
CSecretEndsErrors.ERROR_DECRYPTSECRET_CONVERT_DECRYPTED_BYTES_TO_TEXT	= 2013;



/**
 *	secret ends core model
 */
class CSecretEnds
{
	//	version
	m_nVersion			= 1;
	m_arrVersionList	= { 1 : 1 };

	//	last error id
	m_nLastErrorId		= -1;


	constructor( nVersion )
	{
		this._initVersion( nVersion );
	}


	/**
	 *	get/set version
	 */
	get version()
	{
		return this.m_nVersion;
	}
	set version( nVersion )
	{
		this._initVersion( nVersion );
	}


	/**
	 *	get last error id
	 */
	get lastErrorId()
	{
		return this.m_nLastErrorId;
	}
	set lastErrorId( nErrorId )
	{
		this.m_nLastErrorId = nErrorId;
	}


	/**
	 *	@ public
	 *
	 * 	@param	int		nSecretId
	 *	@param	string	sMessage
	 *	@param	string	sPassword
	 *	@param	int		nTimestampStart
	 *	@param	int		nExpireInSeconds
	 *	@return	string	encrypted hex string
	 */
	encryptSecret( nSecretId, sMessage, sPassword, nTimestampStart, nExpireInSeconds )
	{
		var sRet;
		let arrKey;
		let arrMessageBytes;
		let oAesCtrMode;
		let arrEncryptedBytes;
		let sEncryptedHex;

		if ( ! wlib.isNumeric( nSecretId ) || nSecretId <= 0 )
		{
			this.lastErrorId = CSecretEndsErrors.ERROR_ENCRYPTSECRET_PARAM_SECRET_ID;
			return null;
		}
		if ( 0 === wlib.getStrLen( sMessage ) )
		{
			this.lastErrorId = CSecretEndsErrors.ERROR_ENCRYPTSECRET_PARAM_MESSAGE;
			return null;
		}

		//	...
		sRet	= null;
		arrKey	= this._createKey( nSecretId, sPassword, nTimestampStart, nExpireInSeconds );
		if ( wlib.isArray( arrKey ) && 32 === arrKey.length )
		{
			//	Convert sMessage to bytes
			arrMessageBytes = waes.utils.utf8.toBytes( sMessage );
			if ( wlib.isArray( arrMessageBytes ) )
			{
				// The counter is optional, and if omitted will begin at 1
				oAesCtrMode			= new waes.ModeOfOperation.ctr( arrKey, new waes.Counter( 1 ) );
				arrEncryptedBytes	= oAesCtrMode.encrypt( arrMessageBytes );
				if ( wlib.isArray( arrEncryptedBytes ) )
				{
					//	To print or store the binary data, you may convert arrEncryptedBytes to hex
					sEncryptedHex	= waes.utils.hex.fromBytes( arrEncryptedBytes );
					if ( wlib.getStrLen( sEncryptedHex ) > 0 )
					{
						//	...
						sRet = sEncryptedHex;

						//	...
						this.lastErrorId = CSecretEndsErrors.ERROR_SUCCESS;
					}
					else
					{
						this.lastErrorId = CSecretEndsErrors.ERROR_ENCRYPTSECRET_CONVERT_ENCRYPTED_BYTES_TO_HEX;
					}
				}
				else
				{
					this.lastErrorId = CSecretEndsErrors.ERROR_ENCRYPTSECRET_AES_CTR_MODE_ENCRYPT;
				}
			}
			else
			{
				this.lastErrorId = CSecretEndsErrors.ERROR_ENCRYPTSECRET_CONVERT_MESSAGE_TO_BYTES;
			}
		}
		else
		{
			this.lastErrorId = CSecretEndsErrors.ERROR_ENCRYPTSECRET_CREATEKEY;
		}

		return sRet;
	}


	/**
	 *	@ public
	 *
	 *	@param	int		nSecretId
	 *	@param	string	sEncryptedHex
	 *	@param	string	sPassword
	 *	@param	int		nTimestampStart
	 *	@param	int		nExpireInSeconds
	 *	@return	string	decrypted message
	 */
	decryptSecret( nSecretId, sEncryptedHex, sPassword, nTimestampStart, nExpireInSeconds )
	{
		var sRet;
		let arrKey;
		let oAesCtrMode;
		let arrEncryptedBytes;
		let arrDecryptedBytes;
		let sDecryptedText;

		if ( ! wlib.isNumeric( nSecretId ) || nSecretId <= 0 )
		{
			this.lastErrorId = CSecretEndsErrors.ERROR_DECRYPTSECRET_PARAM_SECRET_ID;
			return null;
		}
		if ( 0 === wlib.getStrLen( sEncryptedHex ) )
		{
			this.lastErrorId = CSecretEndsErrors.ERROR_DECRYPTSECRET_PARAM_ENCRYPTED_HEX;
			return null;
		}

		//	...
		sRet	= null;
		arrKey	= this._createKey( nSecretId, sPassword, nTimestampStart, nExpireInSeconds );
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

						//	...
						this.lastErrorId = CSecretEndsErrors.ERROR_SUCCESS;
					}
					else
					{
						this.lastErrorId = CSecretEndsErrors.ERROR_DECRYPTSECRET_CONVERT_DECRYPTED_BYTES_TO_TEXT;
					}
				}
				else
				{
					this.lastErrorId = CSecretEndsErrors.ERROR_DECRYPTSECRET_AES_CTR_MODE_DECRYPT;
				}
			}
			else
			{
				this.lastErrorId = CSecretEndsErrors.ERROR_ENCRYPTSECRET_CONVERT_ENCRYPTED_HEX_TO_BYTES;
			}
		}
		else
		{
			this.lastErrorId = CSecretEndsErrors.ERROR_DECRYPTSECRET_CREATEKEY
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
			this.m_nVersion = parseInt( nVersion );
		}
	}

	/**
	 *	create a 256-bits key by sha256
	 *
	 * 	@param 	int		nSecretId
	 *	@param	string	sPassword
	 *	@param	int		nTimestampStart
	 *	@param	int		nExpireInSeconds
	 *	@return	array	256-bits key
	 */
	_createKey( nSecretId, sPassword, nTimestampStart, nExpireInSeconds )
	{
		var arrRet;
		let sSource;
		let arrKey;

		if ( ! wlib.isNumeric( nSecretId ) || nSecretId <= 0 )
		{
			return null;
		}
		if ( 0 === wlib.getStrLen( sPassword ) )
		{
			return null;
		}
		if ( ! wlib.isNumeric( nTimestampStart ) || nTimestampStart <= 0 )
		{
			return null;	
		}
		if ( ! wlib.isNumeric( nExpireInSeconds ) || nExpireInSeconds < 0 )
		{
			return null;
		}

		//	...
		arrRet	= null;
		sSource	= '';

		sSource += '..........,..........';
		sSource += new String( nSecretId );
		sSource += ',';
		sSource += new String( this.m_nVersion );
		sSource += ',';
		sSource	+= new String( sPassword );
		sSource	+= ',';
		sSource += new String( nTimestampStart );
		sSource += ',';
		sSource += new String( nExpireInSeconds );
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
	Errors		: CSecretEndsErrors,
	CSecretEnds	: CSecretEnds
};