var environment = {};

environment.local = "home";

environment.set = function(protocol, host)
{
    //LOCALE
    environment.locale = 'pt_BR';
    environment.default_timezone = 'America/Sao_Paulo';

    //SESSION
    environment.MAX_LOGIN_ATTEMPTS = 10;
    environment.LOGIN_INTERVAL = 60*24;
    environment.SESSION_NAME = '';
    environment.PREFIX_TABLES = '';

    //EVENTS
    environment.USE_CRON = true;

    //AWS
    environment.AWS_ACCESS_KEY_ID = '';
    environment.AWS_SECRET_ACCESS_KEY = '';
    environment.EMAIL_TITLE = '';
    environment.EMAIL_ADDRESS = '';
    environment.SAC_EMAIL = '';

    environment.env = "dev";

    //PROTOCOL
    environment.PROTOCOL = protocol;

    //SERVER
    environment.SERVER = host;

    //PATHS
    environment.ROOT_PATH = environment.PROTOCOL + environment.SERVER;
    environment.ROOT_FOLDER = "";
    environment.STATIC_FOLDER = "";
    environment.CONTROLLERS_PATH = environment.ROOT_FOLDER + "/app/controllers";
    environment.ENVIRONMENT_PATH = environment.ROOT_FOLDER + "/app/environment";
    environment.LIBS_PATH = environment.ROOT_FOLDER + "/app/libs";
    environment.VIEWS_PATH = environment.ROOT_FOLDER + "/app/views";
    environment.STATIC_PATH = environment.ROOT_PATH + environment.ROOT_FOLDER + "" + environment.STATIC_FOLDER;

    environment.ASSETS_URL = environment.STATIC_PATH;

    //MYSQL
    environment.DATABASE =
    {
        host     : "localhost",
        port 	 : "3306",
        user     : "root",
        password : "",
        database : "template",
        debug    : false
    }
}

environment.set("http://", "localhost");

module.exports = environment;
