/**
 *  获取当前页url
 */
function getCurrentPageUrl()
{
	var sRet;
	var arrPages;
	var oCurrentPage;

	//	...
	sRet	= '';
	arrPages		= getCurrentPages();				//	获取加载的页面
	oCurrentPage	= arrPages[ arrPages.length - 1 ];	//	获取当前页面的对象
	sRet			= oCurrentPage.route;				//	当前页面url

	return sRet;
}


/*获取当前页带参数的url*/
function getCurrentPageUrlWithArgs() {
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length - 1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  var options = currentPage.options    //如果要获取url中所带的参数可以查看options

  //拼接url的参数
  var urlWithArgs = url + '?'
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

  return urlWithArgs
}

module.exports = {
  getCurrentPageUrl: getCurrentPageUrl,
  getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs
}