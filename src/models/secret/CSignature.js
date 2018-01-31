var wlib		= require( '../../libs/wlib.js' );
var wdatetime	= require( '../../libs/wdatetime.js' );
var wsha256		= require( '../../libs/cipher/wsha256.js' );




/**
 *	CSignature
 */
class CSignature
{
	constructor()
	{
	}


	/**
	 *	@ public
	 *
	 * 	@param	array	arrSourceList
	 *	@return	string	signature string
	 */
	createSignature( arrSourceList )
	{
		var sRet;
		let i;
		let sSource;

		if ( ! wlib.isArray( arrSourceList ) || 0 == arrSourceList.length )
		{
			return null;
		}

		//	...
		sRet	= null;
		sSource = '';

		for ( i = 0; i < arrSourceList.length; i ++ )
		{
			sSource += '..........,..........';
			sSource += new String( arrSourceList[ i ] );
			sSource += '..........,..........';
		}

		//	...
		return wsha256.hex( sSource );
	}

}




/**
 *	exports
 */
module.exports =
{
	CSignature	: CSignature
};