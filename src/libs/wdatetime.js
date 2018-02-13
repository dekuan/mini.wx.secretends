const formatDateTime = oDate =>
{
	return formatDate( oDate ) + ' ' + formatTime( oDate );
}

const formatDate = oDate =>
{
	const nYear		= oDate.getFullYear();
	const nMonth	= oDate.getMonth() + 1;
	const nDay		= oDate.getDate();

	return [ nYear, nMonth, nDay ].map( _formatNumber ).join( '-' );
}

const formatTime = oDate =>
{
	const nHour		= oDate.getHours();
	const nMinute	= oDate.getMinutes();
	const nSecond	= oDate.getSeconds();

	return [ nHour, nMinute, nSecond ].map( _formatNumber ).join( ':' );
}

function getCurrentTimestamp()
{
	return ( new Date() ).getTime();
}



/**
 *	@ private
 */
const _formatNumber = nItem =>
{
	return nItem > 9 ? new String( nItem ) : '0' + new String( nItem );
}




/**
 *	exports
 */
module.exports =
{
	formatDateTime		: formatDateTime,
	formatDate			: formatDate,
	formatTime			: formatTime,
	getCurrentTimestamp	: getCurrentTimestamp
};