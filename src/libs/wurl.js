var wlib = require( 'wlib.js' );



/**
 *	get page url of current page
 */
function getCurrentPageUrl()
{
	var sRet;
	var arrPages;
	var oCurrentPage;

	//	...
	sRet		= '';

	//
	//	get stack array of current pages
	//
	arrPages	= getCurrentPages();
	if ( wlib.isArray( arrPages ) &&
		arrPages.length > 0 )
	{
		//
		//	get the object of current page
		//
		oCurrentPage = arrPages[ arrPages.length - 1 ];
		if ( wlib.isObjectWithKeys( oCurrentPage, [ 'route' ] ) )
		{
			//	url of current page
			sRet = oCurrentPage.route;
		}
	}

	return sRet;
}


/**
 *	get all arguments as an object from current page
 */
function getCurrentPageArgs()
{
	var oRet;
	var arrPages;
	var oCurrentPage;
	var oOptions;

	//	...
	oRet = null;

	//
	//	get stack array of current pages
	//
	arrPages = getCurrentPages();
	if ( wlib.isArray( arrPages ) && arrPages.length > 0 )
	{
		//
		//	get the object of current page
		//
		oCurrentPage = arrPages[ arrPages.length - 1 ];
		if ( wlib.isObjectWithKeys(oCurrentPage, [ 'options' ] ) )
		{
			//	all arguments with url
			oOptions = oCurrentPage.options;
			if ( wlib.isObject( oOptions ) )
			{
				//	yes, there are arguments with the url
				oRet = oOptions;
			}
		}
	}

	return oRet;
}


/**
 *	get current page url and its arguments
 */
function getCurrentPageUrlWithArgs()
{
	var sRet;
	var sUrl;
	var oOptions;
	var sKey;
	var sValue;

	//	...
	sRet		= '';

	//	...
	sUrl		= getCurrentPageUrl();
	oOptions	= getCurrentPageArgs();

	if ( wlib.getStrLen( sUrl ) > 0 )
	{
		//	...
		sRet	= sUrl;

		if ( wlib.isObject( oOptions ) )
		{
			//	yes, there are arguments with the url
			//	now we append them to the end of url
			sRet += '?';

			for ( sKey in oOptions )
			{
				sValue	= new String( oOptions[ sKey ] );
				sRet	+= ( sKey + '=' + sValue + '&' );
			}

			sRet = sRet.substring( 0, sRet.length - 1 );
		}
	}

	return sRet
}



/**
 *	exports
 */
module.exports =
{
	getCurrentPageUrl			: getCurrentPageUrl,
	getCurrentPageArgs			: getCurrentPageArgs,
	getCurrentPageUrlWithArgs	: getCurrentPageUrlWithArgs
}