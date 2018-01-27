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

CSecretEndsErrors.ERROR_ENCRYPTSECRET_PARAM_MESSAGE						= 1000;
CSecretEndsErrors.ERROR_ENCRYPTSECRET_CREATEKEY							= 1010;
CSecretEndsErrors.ERROR_ENCRYPTSECRET_CONVERT_MESSAGE_TO_BYTES			= 1011;
CSecretEndsErrors.ERROR_ENCRYPTSECRET_AES_CTR_MODE_ENCRYPT				= 1012;
CSecretEndsErrors.ERROR_ENCRYPTSECRET_CONVERT_ENCRYPTED_BYTES_TO_HEX	= 1013;

CSecretEndsErrors.ERROR_DECRYPTSECRET_PARAM_ENCRYPTED_HEX 				= 2000;
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
		_initVersion( nVersion );
	}

	/**
	 *	get last error id
	 */
	get lastErrorId()
	{
		return m_nLastErrorId;
	}
	set lastErrorId( nErrorId )
	{
		m_nLastErrorId = nErrorId;
	}


	/**
	 *	@ public
	 *
	 *	@param	string	sMessage
	 *	@param	string	sPassword
	 *	@param	int		nTimestampStart
	 *	@param	int		nExpireInSeconds
	 *	@return	string	encrypted hex string
	 */
	encryptSecret( sMessage, sPassword, nTimestampStart, nExpireInSeconds )
	{
		var sRet;
		let arrKey;
		let arrMessageBytes;
		let oAesCtrMode;
		let arrEncryptedBytes;
		let sEncryptedHex;

		if ( 0 === wlib.getStrLen( sMessage ) )
		{
			lastErrorId = CSecretEndsErrors.ERROR_ENCRYPTSECRET_PARAM_MESSAGE;
			return null;
		}

		//	...
		sRet	= null;
		arrKey	= _createKey( sPassword, nTimestampStart, nExpireInSeconds );
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
						lastErrorId = CSecretEndsErrors.ERROR_SUCCESS;
					}
					else
					{
						lastErrorId = CSecretEndsErrors.ERROR_ENCRYPTSECRET_CONVERT_ENCRYPTED_BYTES_TO_HEX;
					}
				}
				else
				{
					lastErrorId = CSecretEndsErrors.ERROR_ENCRYPTSECRET_AES_CTR_MODE_ENCRYPT;
				}
			}
			else
			{
				lastErrorId = CSecretEndsErrors.ERROR_ENCRYPTSECRET_CONVERT_MESSAGE_TO_BYTES;
			}
		}
		else
		{
			lastErrorId = CSecretEndsErrors.ERROR_ENCRYPTSECRET_CREATEKEY;
		}

		return sRet;
	}


	/**
	 *	@ public
	 *
	 *	@param	string	sEncryptedHex
	 *	@param	string	sPassword
	 *	@param	int		nTimestampStart
	 *	@param	int		nExpireInSeconds
	 *	@return	string	decrypted message
	 */
	decryptSecret( sEncryptedHex, sPassword, nTimestampStart, nExpireInSeconds )
	{
		var sRet;
		let arrKey;
		let oAesCtrMode;
		let arrEncryptedBytes;
		let arrDecryptedBytes;
		let sDecryptedText;

		if ( 0 === wlib.getStrLen( sEncryptedHex ) )
		{
			lastErrorId = CSecretEndsErrors.ERROR_DECRYPTSECRET_PARAM_ENCRYPTED_HEX;
			return null;
		}

		//	...
		sRet	= null;
		arrKey	= _createKey( sPassword, nTimestampStart, nExpireInSeconds );
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
						lastErrorId = CSecretEndsErrors.ERROR_SUCCESS;
					}
					else
					{
						lastErrorId = CSecretEndsErrors.ERROR_DECRYPTSECRET_CONVERT_DECRYPTED_BYTES_TO_TEXT;
					}
				}
				else
				{
					lastErrorId = CSecretEndsErrors.ERROR_DECRYPTSECRET_AES_CTR_MODE_DECRYPT;
				}
			}
			else
			{
				lastErrorId = CSecretEndsErrors.ERROR_ENCRYPTSECRET_CONVERT_ENCRYPTED_HEX_TO_BYTES;
			}
		}
		else
		{
			lastErrorId = CSecretEndsErrors.ERROR_DECRYPTSECRET_CREATEKEY
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
			wlib.isObjectWithKeys( m_arrVersionList, nVersion ) )
		{
			m_nVersion = nVersion;
		}
	}

	/**
	 *	create a 256-bits key by sha256
	 *
	 *	@param	string	sPassword
	 *	@param	int		nTimestampStart
	 *	@param	int		nExpireInSeconds
	 *	@return	array	256-bits key
	 */
	_createKey( sPassword, nTimestampStart, nExpireInSeconds )
	{
		var arrRet;
		let sSource;
		let arrKey;

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
		sSource += new String( m_nVersion );
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


