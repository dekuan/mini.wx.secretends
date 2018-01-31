function isNumeric( oObj )
{
	return ( "[object Number]" === Object.prototype.toString.call( oObj ) );
}

function isString( oObj )
{
	return ( "[object String]" === Object.prototype.toString.call( oObj ) );
}

function isBool( oObj )
{
	return ( "[object Boolean]" === Object.prototype.toString.call( oObj ) );
}

function isArray( oObj )
{
	return ( "[object Array]" === Object.prototype.toString.call( oObj ) ||
		"[object Uint8Array]" === Object.prototype.toString.call( oObj ) );
}

function isObject( oObj )
{
	return ( "[object Object]" === Object.prototype.toString.call( oObj ) ||
		"[object Blob]" === Object.prototype.toString.call( oObj ) );
}

function isFunction( oObj )
{
	return ( "[object Function]" === Object.prototype.toString.call( oObj ) );
}

function isValidDateObject( oObj )
{
	//	d.valueOf() could also work
	return ( "[object Date]" === Object.prototype.toString.call( oObj ) && ( ! isNaN( oObj.getTime() ) ) );
}

function isObjectWithKeys( oObj, vKey )
{
	var bRet;
	var vKeyKey;

	//	...
	bRet = false;

	if ( isObject( oObj ) )
	{
		if ( isArray( vKey ) )
		{
			bRet = true;
			for ( vKeyKey in vKey )
			{
				if ( ! oObj.hasOwnProperty( vKey[ vKeyKey ] ) )
				{
					bRet = false;
					break;
				}
			}
		}
		else if ( isString( vKey ) || isNumeric( vKey ) )
		{
			bRet = oObj.hasOwnProperty( vKey );
		}
		else if ( undefined === vKey )
		{
			bRet = true;
		}
	}

	return bRet;
}

function trimStr( sString )
{
	if ( ! isString( sString ) )
	{
		return '';
	}

	//
	//	Polyfill
	//
	if ( ! String.prototype.trim )
	{
		String.prototype.trim = function()
		{
			return this.replace( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '' );
		};
	}

	return ( new String( sString ) ).trim();
}

function getStrLen( sString, bTrim )
{
	var nRet;
	var sNewString;

	if ( ! isString( sString ) && ! isNumeric( sString ) )
	{
		return 0;
	}

	//	...
	nRet		= 0;
	sNewString	= new String( sString );

	if ( isBool( bTrim ) && bTrim )
	{
		nRet = trimStr( sNewString ).length;
	}
	else
	{
		nRet = sNewString.length;
	}

	return nRet;
}

function getRandomNumber( nLowerValue, nUpperValue )
{
	return Math.floor( Math.random() * ( nUpperValue - nLowerValue + 1 ) + nLowerValue );
}




/**
 *	exports
 */
module.exports =
{
	isNumeric: isNumeric,
	isString: isString,
	isBool: isBool,
	isArray: isArray,
	isObject: isObject,
	isFunction: isFunction,
	isValidDateObject: isValidDateObject,
	isObjectWithKeys: isObjectWithKeys,
	trimStr: trimStr,
	getStrLen: getStrLen,
	getRandomNumber: getRandomNumber
}