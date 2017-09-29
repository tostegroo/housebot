var promise = require('bluebird');
var Speech = require('@google-cloud/speech');
var record = require('node-record-lpcm16');
var fs = require('fs');

var speech = Speech(
{
	projectId: 'api-project-1024391696837',
	keyFilename: './config/key.json'
});

var sampleRateHertz = 16000;
var languageCode = 'en-US';

var options = {
	encoding: 'LINEAR16',
	sampleRateHertz: sampleRateHertz,
	languageCode: languageCode
};

var request = {
	config: options,
	interimResults: false
};

var fileRecordingPath = false;
var botcontroller = false;

exports = module.exports = createApplication;

/**
 * @constructs NGINB
 * @public
 * @param  {Object} bot - Bot object
 * @return {Object} A bot instance
 */
function createApplication(bot)
{
    return new Voicectl(bot);
}

/**
 * @constructor
 * @class
 * @param  {Options} options - Options object
 * @return {Object} A bot instance
 */
function Voicectl(bot)
{
	var self = this;
	botcontroller = bot;

	return this;
}

Voicectl.prototype.getTextFromAudioStream = function(recordTime)
{
	return new promise(function(resolve, reject)
	{
	    var recognizeStream = speech.createRecognizeStream(request)
	    .on('error', (err) => {console.log(err);})
	    .on('data', (data) =>
	    {
	        var text = data.results;
	        sendMessageTobot(text)
			.then(function(response)
			{
				resolve({status: true, text: text, data:response});
			});

	        console.log('Transcription: ' + text);
	    });

	    record.start(
	    {
	    	sampleRateHertz: sampleRateHertz,
	    	verbose: true,
	    	recordProgram: 'sox'
	    })
	    .on('error', (err) => {console.log(err);})
	    .pipe(recognizeStream);

	    console.log('Start speaking!');

		if(recordTime>0)
		{
		    setTimeout(function ()
		    {
				if(record)
		    		record.stop();
		    }, recordTime);
		}
	});
}

Voicectl.prototype.getTextFromAudioFileStream = function(recordTime, filePath)
{
	return new promise(function(resolve, reject)
	{
		var file = fs.createWriteStream(filePath, { encoding: 'binary' });

		record.start({
    	sampleRateHertz: 16000,
    	verbose: true,
    	recordProgram: 'rec',
    	file: filePath
    }).pipe(file);
		//.on('error', function(error){console.log(error);});

		fileRecordingPath = filePath;
		if(recordTime>0)
		{
			setTimeout(function ()
		  {
				if(record) record.stop();

		    speech.recognize(fileRecordingPath, options)
		    .then((results) => {

		    	var text = results[0];

		     	sendMessageTobot(text)
					.then(function(response){
						resolve({status: true, text: text, data:response});
					});

		      console.log('Transcription: ' + text);
		    })
		    .catch((err) => {console.error('ERROR:', err);});

			}, recordTime);
		}
		else
		{
			resolve({status: true});
		}
	});
}

Voicectl.prototype.stopRecording = function()
{
	return new promise(function(resolve, reject)
	{
		if(record)
			record.stop();

		if(fileRecordingPath)
		{
			speech.recognize(fileRecordingPath, options)
			.then((results) =>
			{
				fileRecordingPath = false;

				var text = results[0];
				sendMessageTobot(text)
				.then(function(response)
				{
					resolve({status: true, text: text, data:response});
				});
				console.log('Transcription: ' + text);
			})
			.catch((err) => {
				console.error('ERROR:', err);
			});
		}else
		{
			resolve({status: true});
		}
	});
}

function sendMessageTobot(text)
{
	return new promise(function(resolve, reject)
	{
	    event = {
	        fb_page: {},
	        sender: "housebot",
	        type: "message",
	        text: text,
	        id: "",
	        lang: "en"
	    }

		if(botcontroller)
		{
		    botcontroller.getBotResponse(event)
		    .then(function(response)
		    {
				resolve(response.reply);

		        console.log(response.reply);
		    });
		}
		else
		{
			resolve(null);
		}
	});
}
