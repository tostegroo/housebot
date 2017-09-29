var JSONbig 		= require('json-bigint');
var environment 	= require('../config/environment');

module.exports = function(app)
{
	app.get('/facebook/set/:type/:page_id?', function(req, res, next)
	{
		var type = req.params.type;
		var page_id = req.params.page_id;

		app.bot.getPageController().getFacebookPageInfo(page_id, type)
		.then(function(response)
		{
			if(response)
			{
				var lang = response.page.language;
				lang = (!lang) ? 'en' : lang;
				type = response.data;

				if(type=='menu')
				{
					var menu = (req.query['menu']!=undefined) ? req.query['menu'] : 'persistent_menu';

					app.bot.getMenuController().getMenu(menu, lang)
					.then(function(menu_response)
					{
						if(menu_response)
						{
							app.bot.getFacebookController().setPersistentMenu(response.page, menu_response)
							.then(function(response)
							{
								res.send(response);
							});
						}
						else
						{
							res.status(200).json(
				            {
				                status: false,
				                error_code: 0000,
				                message: "No menu found"
				            });
						}
					});
				}
				else if(type=='startbutton')
				{
					var payload = (req.query['payload']!=undefined) ? req.query['payload'] : 'cmdstart';

					app.bot.getFacebookController().setStartButton(response.page, payload)
					.then(function(response)
					{
						res.send(response);
					});
				}
				else if(type=='whitelist')
				{
					var whitelist = '';

					if(req.query['url']!=undefined)
						whitelist = req.query['url'].split(',');

					app.bot.getFacebookController().domainWhitelisting(response.page, whitelist)
					.then(function(response)
					{
						res.send(response);
					});
				}
				else if(type=='subscribe')
				{
					app.bot.getFacebookController().doSubscribeRequest(response.page)
					.then(function(response)
					{
						res.send(response);
					});
				}
				else
				{
					res.status(200).json(
		            {
		                status: false,
		                error_code: 0000,
		                message: "No config type set"
		            });
				}
			}
			else
			{
				res.status(200).json(
	            {
	                status: false,
	                error_code: 0000,
	                message: "Page not found"
	            });
			}
		});
	});

	app.get('/facebook/delete/:type/:page_id?', function(req, res, next)
	{
		var type = req.params.type;
		var page_id = req.params.page_id;

		app.bot.getPageController().getFacebookPageInfo(page_id, type)
		.then(function(response)
		{
			if(response)
			{
				if(type=='menu')
				{
					app.bot.getFacebookController().deleteMessengerProfile(response.page, ["persistent_menu"])
					.then(function(response)
					{
						res.send(response);
					});
				}
				else if(type=='startbutton')
				{
					app.bot.getFacebookController().deleteMessengerProfile(response.page, ["get_started"])
					.then(function(response)
					{
						res.send(response);
					});
				}
				else if(type=='whitelist')
				{
					app.bot.getFacebookController().deleteMessengerProfile(response.page, ["whitelisted_domains"])
					.then(function(response)
					{
						res.send(response);
					});
				}
				else
				{
					res.status(200).json(
		            {
		                status: false,
		                error_code: 0000,
		                message: "No config type set"
		            });
				}
			}
			else
			{
				res.status(200).json(
	            {
	                status: false,
	                error_code: 0000,
	                message: "Page not found"
	            });
			}
		});
	});

	app.get('/facebook/webhook', function(req, res, next)
	{
		var token = false;

		if(app.bot && app.bot.config && app.bot.config.facebook && app.bot.config.facebook.verify_token)
			token = app.bot.config.facebook.verify_token;

		if (req.query['hub.verify_token'] == token)
	        res.send(req.query['hub.challenge']);
	    else
		{
			res.status(200).json(
            {
                status: false,
                error_code: 0000,
                message: "Wrong validation token"
            });
		}
	});

	app.post('/facebook/webhook', function(req, res, next)
	{
	    try
	    {
	        var data = req.body;

	        if(typeof(data)=='string')
	        	data = JSONbig.parse(data);

			app.bot.getFacebookController().messengerEvent(data)
			.then(function(facebook_events)
			{
				var event_count = facebook_events.length;
				if(event_count>0)
				{
					for(var i=0; i<event_count; i++)
						app.bot.sendMessageEvent(facebook_events[i]);
				}
			});

			res.status(200).json(
			{
				status: true,
				data: 'Data received'
			});
	    }
	    catch (err)
	    {
			res.status(200).json(
            {
                status: false,
                error_code: 0000,
                message: "Error on receive facebook data"
            });
	    }
	});
}
