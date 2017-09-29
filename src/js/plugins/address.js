(function(window)
{
	var address = {};
	address.path = 'mentoring/public';

	address.onChangeUrl = function(value)
    {
    	var state = '';
    	if(value==undefined)
    		state = (history.state==null || history.state.value==undefined) ? '/' : history.state.value;
    	else
    		state = value;

    	state = state.replace('/', '');
    }

    address.changeUrl = function(url)
	{
        url = url.replace(root_path, '');
		url = address.path + url;
		url = (url==undefined) ? '/' : url;
		url = (url.substring(0, 1)!='/') ? '/' + url : url;

		history.pushState({value:url}, "", url);
	}
	
    window.address = address;
    window.onpopstate = history.onpushstate = address.onChangeUrl;

}(window));
