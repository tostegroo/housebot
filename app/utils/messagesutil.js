var messagesutil = {}

messagesutil.getMessageFromDataset = function getMessageFromDataset(data, dataset)
{
	var return_message = false;
	var optional = false;
	var optional_keys = '';
	var optional_code = 0000;
	var optionalcount = 0;
	var max_optional = 0;

	for(var k in dataset)
	{
		if(data[k]==undefined || String(data[k])=='' || data[k]==null)
		{
			return_message = {status: false};
			if(typeof(dataset[k])=='string')
			{
				return_message.message = dataset[k];
			}
			else
			{
				if(dataset[k].hasOwnProperty('msg'))
					return_message.message = dataset[k].msg;
				else if(dataset[k].hasOwnProperty('message'))
					return_message.message = dataset[k].message;
				else
					return_message.message = 'Favor informar a chave {'+k+'}, ela é obrigatória';

				if(dataset[k].hasOwnProperty('code'))
					return_message.error_code = dataset[k].code;

				if(dataset[k].hasOwnProperty('optional'))
				{
					var pre = (optionalcount==0) ? '' : ', ';
					return_message = false;
					optional = true;
					optional_keys += (pre + '{'+k+'}');

					if(dataset[k].hasOwnProperty('code'))
						optional_code = dataset[k].code;

					optionalcount ++;
				}
			}

			if(!optional)
				break;
		}

		if(dataset[k].hasOwnProperty('optional'))
			max_optional++;
	}

	if(!return_message && max_optional>0 && optionalcount>=max_optional)
	{
		return_message = {status: false};
		return_message.error_code = optional_code;
		return_message.message  = 'Favor informar pelo menos uma das chaves opicionais ' + optional_keys;
	}

	return return_message;
}

module.exports = messagesutil
