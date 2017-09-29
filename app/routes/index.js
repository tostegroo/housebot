var environment = require('../config/environment');

module.exports = function(app)
{
	app.get('/', function(req, res, next)
	{
		req.page = 'index';
		req.title = "Home";

		next();
	});

	app.post('/start', function(req, res, next)
	{
		var data = req.body;

		if(data.filePath)
		{
			app.voiceController.getTextFromAudioFileStream(0, data.filePath)
			.then(function(response)
			{
				res.send(response);
			});
		}
		else
		{
			app.voiceController.getTextFromAudioStream(0)
			.then(function(response)
			{
				res.send(response);
			});
		}
	});

	app.post('/stop', function(req, res, next)
	{
		app.voiceController.stopRecording()
		.then(function(response)
		{
			res.send(response);
		});
	});

	app.post('/message', function(req, res, next)
	{
	    try
	    {
	        var data = req.body;

	        if(typeof(data)=='string')
	        	data = JSONbig.parse(data);

			event = {
				fb_page: {},
				sender: "housebot",
				type: "message",
				text: data.text,
				id: "",
				lang: "en"
			}

			app.bot.getBotResponse(event)
			.then(function(response)
			{
				res.status(200).json(
				{
					status: true,
					reply: response.reply
				});

				console.log(response.reply);
				
			}).error(function()
			{
				res.status(200).json(
				{
					status: false,
	                error_code: 0000,
					reply: "Error trying to get a response"
				});
			});
	    }
	    catch (err)
	    {
			res.status(200).json(
            {
                status: false,
                error_code: 0000,
                message: "Error trying to get a response"
            });
	    }
	});
}
