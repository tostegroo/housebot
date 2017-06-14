var promise 		= require('bluebird');
var environment 	= require('../config/environment');

var menus = {};
menus.data =
{
	persistent_menu:
	{
		type: 'persistent_menu',
		data:
		[
			{
				locale:"default",
				composer_input_disabled:true,
				call_to_actions:[
				{
					title:"title",
					type:"nested",
					call_to_actions:[
						{
							title:"title",
							type:"postback",
							payload:"PAYLOAD"
						}]
					},
					{
						type:"web_url",
						title:"title",
						url:"http://url",
						webview_height_ratio:"full"
					}
				]
			},
			{
				locale:"zh_CN",
				composer_input_disabled:false
			}
		]
	}
}

/**
 * Function to process and get menus from any source you want
 * @param {string} menu_name, name of the menu
 */
menus.getMenu = function(menu_name)
{
	return new promise(function(resolve, reject)
	{
		var menu = false;
		resolve(menu);
	});
}

module.exports = menus
