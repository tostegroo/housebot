var JSONbig = require('json-bigint');

module.exports = function(app)
{
	/**
	 * @api {get} /api/v1.0/user/list
	 * @apiVersion 1.0.0
	 * @apiDescription Gets the paged user list
	 * @apiGroup User
	 *
	 * @apiParam {Number} page
	 *
	 * @apiSuccess {JSON} a json object with the user list
	 *
	 * @apiError {JSON} a json object with the error description
	*/
	app.get('/api/v1.0/user/list', function(req, res, next)
	{
		var page = (req.query.hasOwnProperty('page')) ? req.query.page : 1;

		app.bot.getUserController().getUsers(page)
		.then(function(userlist)
		{
			if(userlist)
				res.status(200).json(userlist);
			else
			{
				res.status(200).json(
	            {
	                status: false,
	                error_code: 1000,
	                message: "User list not found"
	            });
			}
		});
	});

	/**
	 * @api {get} /api/v1.0/user/{user_id}
	 * @apiVersion 1.0.0
	 * @apiDescription Gets a single user
	 * @apiGroup User
	 *
	 * @apiSuccess {JSON} a json object with the user info
	 *
	 * @apiError {JSON} a json object with the error description
	*/
	app.get('/api/v1.0/user/:user_id', function(req, res, next)
	{
		var user_id = req.params.user_id;
		
		app.bot.getUserController().getUser(user_id)
		.then(function(user)
		{
			if(user)
				res.status(200).json(user);
			else
			{
				res.status(200).json(
	            {
	                status: false,
	                error_code: 1000,
	                message: "User not found"
	            });
			}
		});
	});

	/**
     * User Template
       var user = {
	    	sender_id: 'user pid',
			page_id: 'page id',
			facebook_id: 'user facebook id',
			email: 'user email',
			first_name: 'user first name',
			last_name: 'user last name',
			profile_pic: 'user profile picture',
			locale: 'user locale',
			gender: 'user gender',
			timezone: 'user timezone',
			status: 'user status' //use 0 to turn off the bot
     }
    */

	/**
	 * @api {post} /api/v1.0/user
	 * @apiVersion 1.0.0
	 * @apiDescription get a single user
	 * @apiGroup User
	 *
	 * @apiSuccess {Boolean} status Result for the request
	 * @apiSuccess {JSON} a json object with information about the added user
	 *
	 * @apiError {JSON} a json object with the error description
	*/
	app.post('/api/v1.0/user', function(req, res, next)
	{
		res.status(200).json(
		{
			status: true,
			message: 'add user'
		});
	});

	/**
	 * @api {put} /api/v1.0/user
	 * @apiVersion 1.0.0
	 * @apiDescription get a single user
	 * @apiGroup User
	 *
	 * @apiSuccess {Boolean} status Result for the request
	 * @apiSuccess {JSON} a json object with information about the update
	 *
	 * @apiError {JSON} a json object with the error description
	*/
	app.put('/api/v1.0/user', function(req, res, next)
	{
		res.status(200).json(
		{
			status: true,
			message: 'update user'
		});
	});

	/**
	 * @api {delete} /api/v1.0/user
	 * @apiVersion 1.0.0
	 * @apiDescription get a single user
	 * @apiGroup User
	 *
	 * @apiSuccess {Boolean} status Result for the request
	 * @apiSuccess {JSON} a json object with information about the delete
	 *
	 * @apiError {JSON} a json object with the error description
	*/
	app.delete('/api/v1.0/user', function(req, res, next)
	{
		res.status(200).json(
		{
			status: true,
			message: 'delete user'
		});
	});
}
