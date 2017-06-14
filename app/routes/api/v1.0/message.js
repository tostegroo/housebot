var JSONbig = require('json-bigint');

module.exports = function(app)
{
	/**
	 * @api {get} /api/v1.0/message
	 * @apiVersion 1.0.0
	 * @apiDescription Gets the paged user list
	 * @apiGroup User
	 *
	 * @apiParam {String} sender
	 * @apiParam {String} page_id
	 * @apiParam {String} message
	 *
	 * @apiSuccess {JSON} a json object with the user list
	 *
	 * @apiError {JSON} a json object with the error description
	*/
	app.get('/api/v1.0/message', function(req, res, next)
	{
        var sender = (req.query.hasOwnProperty('sender')) ? req.query.sender : false;
        var page_id = (req.query.hasOwnProperty('page_id')) ? req.query.page_id : false;
        var message = (req.query.hasOwnProperty('message')) ? req.query.message : false;

        if(page_id&&sender&&message)
        {
			app.bot.getPageController().getFacebookPageInfo(page_id)
			.then(function(response)
			{
				var event =
	            {
	               	fb_page: response.page,
	               	sender: sender,
	               	type: 'message',
	               	text: message,
					id: '',
	               	lang: response.page.language
	            }

	            app.bot.sendMessageEvent(event);

				res.status(200).json(
	            {
	                status: true,
	                message: 'Message sent'
	            });
			});

        }
        else
        {
			res.status(200).json(
            {
                status: false,
                error_code: 1000,
                message: "Error on send Message"
            });
        }
	});

	/**
	 * @api {get} /api/v1.0/message
	 * @apiVersion 1.0.0
	 * @apiDescription Gets the paged user list
	 * @apiGroup User
	 *
	 * @apiParam {String} name
	 * @apiParam {String} language
	 *
	 * @apiSuccess {JSON} a json object with the user list
	 *
	 * @apiError {JSON} a json object with the error description
	*/
	app.get('/api/v1.0/message/:name', function(req, res, next)
	{
        var name = (req.params.hasOwnProperty('name')) ? req.params.name : false;
		var message = (req.query.hasOwnProperty('message')) ? req.query.message : '';
        var language = (req.query.hasOwnProperty('language')) ? req.query.language : false;
		language = language || 'pt';

		if(name)
		{
			app.bot.getUserController().getUserByName(name)
			.then(function(response)
			{
				if(response.hasOwnProperty('page_id')&&response.hasOwnProperty('sender_id'))
		        {
					app.bot.getPageController().getFacebookPageInfo(response.page_id)
					.then(function(page_response)
					{
			            var event =
			            {
			               	fb_page: page_response.page,
			               	sender: response.sender_id,
			               	type: 'message',
			               	text: message,
							id: '',
			               	lang: page_response.page.language
			            }

						app.bot.sendMessageEvent(event);

						res.status(200).json(
			            {
			                status: true,
			                message: 'Message sent'
			            });
					});
		        }
		        else
		        {
					res.status(200).json(
		            {
		                status: false,
		                error_code: 1000,
		                message: "Error on send Message"
		            });
		        }
			});
		}
		else
		{
			res.status(200).json(
			{
				status: false,
				error_code: 1000,
				message: "Error on send Message"
			});
		}
	});

    /**
     * Event Template
     var event = {
    	page_id: 'page id',
    	sender: 'user pid',
    	type: 'message', //type: message|payload|attachment
    	text: 'message text',
    	lang: 'message language'
     }
    */

	/**
	 * @api {post} /api/v1.0/message
	 * @apiVersion 1.0.0
	 * @apiDescription Gets the paged user list
	 * @apiGroup User
	 *
	 * @apiParam {JSON} a json object with an event template
	 *
	 * @apiSuccess {JSON} a json with status and message
	 *
	 * @apiError {JSON} a json object with the error description
	*/
	app.post('/api/v1.0/message', function(req, res, next)
	{
        try
	    {
	        var data = req.body;

	        if(typeof(data)=='string')
	        	data = JSONbig.parse(data);

	        app.bot.sendMessageEvent(data);

			res.status(200).json(
			{
				status: true,
				message: 'Message sent'
			});
	    }
	    catch (err)
	    {
			res.status(200).json(
            {
                status: false,
                error_code: 1000,
                message: "Error on send Message"
            });
	    }
	});
}
