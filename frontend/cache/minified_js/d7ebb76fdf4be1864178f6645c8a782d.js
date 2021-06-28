var utils=
{
debug:false
}
utils.array=
{
inArray:function(needle,array)
{
for(var i in array)
{
if(array[i]==needle)return true}
return false}
}
utils.cookies=
{
isEnabled:function()
{
var cookiesEnabled=!!(navigator.cookieEnabled);
if(typeof navigator.cookieEnabled=='undefined'&&!cookiesEnabled)
{
document.cookie='testcookie';
cookiesEnabled=($.inArray('testcookie',document.cookie)!=-1)}
return cookiesEnabled},
readCookie:function(name)
{
var cookies=document.cookie.split(';');
name=name+'=';
for(var i=0;i<cookies.length;i++)
{
var cookie=cookies[i];
while(cookie.charAt(0)==' ')cookie=cookie.substring(1,cookie.length);
if(cookie.indexOf(name)==0)return cookie.substring(name.length,cookie.length)}
return null},
setCookie:function(name,value,days)
{
if(typeof days=='undefined')days=7;
var expireDate=new Date();
expireDate.setDate(expireDate.getDate()+days);
document.cookie=name+'='+escape(value)+';expires='+expireDate.toUTCString()+';path=/'}
}
utils.form=
{
isChecked:function(element)
{
return($('input[name="'+element.attr('name')+'"]:checked').length>=1)},
isEmail:function(element)
{
var regexp=/^[a-z0-9!#\$%&'*+-\/=?^_`{|}\.~]+@([a-z0-9]+([\-]+[a-z0-9]+)*\.)+[a-z]{2,7}$/i;
return regexp.test(element.val())},
isFilled:function(element)
{
return(utils.string.trim(element.val())!='')},
isNumber:function(element)
{
return(!isNaN(element.val())&&element.val()!='')},
isURL:function(element)
{
var regexp=/^((http|ftp|https):\/{2})?(([0-9a-zA-Z_-]+\.)+[0-9a-zA-Z]+)((:[0-9]+)?)((\/([~0-9a-zA-Z\#%@\.\/_-]+)?(\?[0-9a-zA-Z%@\/&=_-]+)?)?)$/i;
return regexp.test(element.val())}
}
utils.string=
{
div:false,
html5:function(html)
{
var html5='abbr article aside audio canvas datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video'.split(' ');
if(utils.string.div===false)
{
utils.string.div=document.createElement('div');
utils.string.div.innerHTML='<nav></nav>';
if(utils.string.div.childNodes.length!==1)
{
var fragment=document.createDocumentFragment();
var i=html5.length;
while(i--)fragment.createElement(html5[i]);
fragment.appendChild(utils.string.div)}
}
html=html.replace(/^\s\s*/,'').replace(/\s\s*$/,'')
.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,'');
var inTable=html.match(/^<(tbody|tr|td|th|col|colgroup|thead|tfoot)[\s\/>]/i);
if(inTable)utils.string.div.innerHTML='<table>'+html+'</table>';
else utils.string.div.innerHTML=html;
var scope;
if(inTable)scope=utils.string.div.getElementsByTagName(inTable[1])[0].parentNode;
else scope=utils.string.div;
var returnedFragment=document.createDocumentFragment();
var i=scope.childNodes.length;
while(i--)returnedFragment.appendChild(scope.firstChild);
return returnedFragment},
htmlEncode:function(value)
{
return $('<div/>').text(value).html()},
htmlDecode:function(value)
{
return $('<div/>').html(value).text()},
replaceAll:function(value,needle,replacement)
{
if(value==undefined)return'';
return value.replace(new RegExp(needle,'g'),replacement)},
sprintf:function(value)
{
if(arguments.length<2)return value;
else
{
value=value.replace(/\$s/g,'Ss');
for(var i=1;i<arguments.length;i++)
{
value=utils.string.replaceAll(value,'%'+i+'Ss',arguments[i])}
}
return value},
stripTags:function(value)
{
return value.replace(/<[^>]*>/ig,'')},
trim:function(value,charList)
{
if(value==undefined)return'';
if(charList==undefined)charList=' ';
var pattern=new RegExp('^['+charList+']*|['+charList+']*$','g');
return value.replace(pattern,'')},
urlEncode:function(value)
{
return encodeURIComponent(value).replace(/\%20/g,'+').replace(/!/g,'%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/\~/g, '%7E');
},
urlDecode:function(value)
{
return decodeURIComponent(value.replace(/\+/g,'%20').replace(/\%21/g,'!').replace(/\%27/g,"'").replace(/\%28/g,'(').replace(/\%29/g,')').replace(/\%2A/g,'*').replace(/\%7E/g,'~'))},
urlise:function(value)
{
reservedCharacters=new Array(
'/','?',':','@','#','[',']',
'!','$','&','\'','(',')','*',
'+',',',';','='
);
for(i in reservedCharacters)value=value.replace(reservedCharacters[i],' ');
value=utils.string.replaceAll(value,'"',' ');
value=utils.string.replaceAll(value,' ','-');
if(utils.string.urlDecode(value)==value)
{
value=value.toLowerCase();
value=utils.string.urlEncode(value)}
value=value.replace(/-+/,'-');
return utils.string.trim(value,'-')},
ucfirst:function(value)
{
return value.charAt(0).toUpperCase()+value.slice(1)},
xhtml:function(value)
{
value=value.replace(/<br>/g,'<br />');
value=value.replace(/<br?\/?>$/g,'');
value=value.replace(/^<br?\/?>/g,'');
value=value.replace(/(<img[^>]+[^\/])>/gi,'$1 />');
value=value.replace(/(<input[^>]+[^\/])>/gi,'$1 />');
value=value.replace(/<b\b[^>]*>(.*?)<\/b[^>]*>/g,'<strong>$1</strong>');
value=value.replace(/<i\b[^>]*>(.*?)<\/i[^>]*>/g,'<em>$1</em>');
value=value.replace(/<u\b[^>]*>(.*?)<\/u[^>]*>/g,'<span style="text-decoration:underline">$1</span>');
return value}
}
utils.url=
{
extractParamFromUri:function(uri,paramName)
{
if(!uri)return;
var uri=uri.split('#')[0];
var parts=uri.split('?');
if(parts.length==1)return;
var query=decodeURI(parts[1]);
paramName+='=';
var params=query.split('&');
for(var i=0,param;param=params[i];++i)
{
if(param.indexOf(paramName)===0)return unescape(param.split('=')[1])}
},
getGetValue:function(name)
{
var getValue='';
var hashes=window.location.search.slice(window.location.search.indexOf('?')+1).split('&');
$.each(hashes,function(index,value)
{
var chunks=value.split('=');
if(chunks[0]==name)
{
getValue=chunks[1];
return false}
});
return getValue}
}