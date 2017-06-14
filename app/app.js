var express       	= require('express');
var session       	= require('express-session');
var path          	= require('path');
var favicon       	= require('serve-favicon');
var logger        	= require('morgan');
var cookieParser  	= require('cookie-parser');
var bodyParser    	= require('body-parser');
var flash         	= require('connect-flash');
var device 		  	= require('express-device');
var bot 			= require('rivescript-nginb-js');

var environment		= require('./config/environment');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.environment = environment;
app.bot = bot(
{
	env: 'dev',
	instances:
	[
		{
			language: "en",
			path: path.join(__dirname, "brains"),
			config:
			{
				utf8: true,
	            errors:
				{
	                replyNotMatched: "",
	                replyNotFound: "",
	                objectNotFound: "[ERR: Objeto não encontrado]",
	                deepRecursion: "ERR: Recursão detectada"
	            }
			},
			unicodePunctuation: new RegExp(/[.,!?;:]/g),
			variables: require('./resources/variables')
		}
	],
	accept_commands_from_user: true
});

app.voiceController = require('./controllers/voicectl.js')(app.bot);
//app.voiceController.getTextFromAudioFileStream(6000, 'C:/house-bot/files/audio.wav');
//app.voiceController.getTextFromAudioStream(10000);

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(device.capture());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Session configuration
app.use(session(
{
	secret: 'timemessager',
	resave: true,
	saveUninitialized: false
}));

app.use(function(req, res, next)
{
	res.setHeader('Access-Control-Allow-Origin', '*');

	var protocol = (req.headers['x-forwarded-proto']==undefined) ? 'http://' : req.headers['x-forwarded-proto'] + "://";
	var host = req.headers.host;
	host = (!host) ? 'localhost' : host;

	app.environment.set(protocol, host);

	next();
});

//Passport configuration
app.use(flash());

//Routes
require('./routes/index')(app);
require('./routes/facebook')(app);

//Pos Routes
app.use(function(req, res, next)
{
	var title = (req.title) ? req.title : 'Home';
	var page = (req.page && req.page!='') ? req.page : '';
	var params = (req.render_params) ? req.render_params : {};

	for (var attrname in params)
		res.locals[attrname] = params[attrname];

	res.locals.title = title;
	res.locals.environment = app.environment;

    if(page != "")
        res.render(page);
    else
        next();
});

require('./routes/api/api')(app);

app.use(function(req, res, next)
{
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next)
{
	res.status(err.status || 500).json(
    {
    	status: false,
    	error: err,
    	message: err.message
    });
});

module.exports = app;
