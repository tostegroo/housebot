var promise 	= require('bluebird');

var botctl = {};
botctl.scripts = false;

/**
 * Function to get the botcontroller of the app
 * @param {Object} bot_controller created by rivescript-nginb-js
 */
botctl.setBotController = function setBotController(bot_controller)
{
    if(bot_controller)
    {
        botctl.bot = bot_controller;

        botctl.getEntities()
        .then(function(response)
        {
            botctl.bot.setEntities(response, 'pt')
            .then(function(response)
            {
                console.log(response);
            });
        });

        botctl.bot.addEventListener('FinishMessageDispatch', botctl.onFinishMessageDispatch);
        botctl.bot.addEventListener('FinishAllMessageDispatch', botctl.onFinishAllMessageDispatch);
        botctl.bot.addEventListener('HandleCustomMessageReplyItems', botctl.handleMessageReplyItems);
    }
}

/**
 * Function callback to put custom attributes to message object before send the message
 * @param {Object} message - The reply message object returned by rivescript
 * @param {Object} event - The event object sent by the message controller
 */
botctl.handleMessageReplyItems = function handleMessageReplyItems(message, event)
{

}

/**
 * Function callback to do anything after one message is dispatched
 * @param {Object} data - The data object returned by rivescript
 */
botctl.onFinishMessageDispatch = function onFinishMessageDispatch(data)
{

}

/**
 * Function callback to do anything after all messages are dispatched
 * @param {Object} data - The data object returned by rivescript
 */
botctl.onFinishAllMessageDispatch = function onFinishAllMessageDispatch(data)
{

}

/**
 * Function to customize entities on bot controller (template)
 * @return {Promisse} a bluebird promise response
 */
botctl.getEntities = function getEntities()
{
    return new promise(function(resolve, reject)
	{
        resolve({});
    });
}

exports = module.exports = botctl;
