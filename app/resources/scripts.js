
var environment = require('../config/environment');

var scripts = {};
scripts.action = {};
scripts.action["pause"] = {name: 'pause'};
scripts.action["restart"] = {name: 'restart'};

/**
 * Function to get the botcontroller of the app
 * @param {Object} bot_controller created by rivescript-nginb-js
 */
scripts.setBotController = function setBotController(bot_controller)
{
	if(bot_controller)
	{
		userctl = bot_controller.getUserController();
		utils = bot_controller.utils;
	}
}

/**
 * Scripts function
 * @exports {FUNCTION} any function to be used in rivescript bot
 * @param {Object} botData
 * @param {Object} params
 */
scripts.anyfunction = function anyfunction(botData, params)
{

}

module.exports = scripts
