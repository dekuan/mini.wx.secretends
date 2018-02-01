var wlib	= require('wlib.js');


/**
 *	check if the given string sString is a valid Chinese characters
 */
function isChineseChars( sString )
{
	let rePattern;
	let sNewString;

	if ( 0 === wlib.getStrLen( sString ) )
	{
		return false;
	}

	//
	//	/[\u4E00-\u9FA5\uF900-\uFA2D]/
	//	说明： u4e00 - u9fbf :  unicode CJK(中日韩)统一表意字符。u9fa5后至u9fbf为空
	//	uF900 - uFAFF :  为unicode  CJK 兼容象形文字  。uFA2D后至uFAFF为空
	//	具体可参考unicode编码表：http://www.nengcha.com/code/unicode/class/
	//

	//	\w		匹配 [0-9a-zA-Z_]
	//	" -~"	匹配所有可见的英文字符
	//	\uFF00-\uFFEF	部分中文全角符号

	//	下面是部分特殊的中文全角
	//
	//	¥	\xA5
	//	…	\u2026
	//	—	\u2014
	//	·	\xB7
	//
	//	【	\u3010
	//	】	\u3011
	//	、	\u3001
	//	；	\uFF1B
	//	‘	\u2018
	//	，	\uFF0C
	//	。	\u3002
	//	/   \x2F
	//	「   \u300C
	//	」   \u300D
	//	|   \x7C
	//	：   \uFF1A
	//	“   \u201C
	//	”   \u201D
	//	《   \u300A
	//	》   \u300B
	//	？   \uFF1F
	//	...
	rePattern	= /^[\u4E00-\u9FA5\uF900-\uFA2D\uFF00-\uFFEF\w -~\xA5\xB7\u2026\u2014\u3010\u3011\u3001\uFF1B\u2018\uFF0C\u3002\x2F\u300C\u300D\x7C\uFF1A\u201C\u201D\u300A\u300B\uFF1F]*$/mg;
	sNewString = ( new String( sString ) ).replace( /\r?\n/g, "" );

	return rePattern.test( sNewString );
}


/**
 *	exports
 */
module.exports =
{
	isChineseChars	: isChineseChars
}