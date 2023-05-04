'use strict'
var RestServiceExtension = require('*/cartridge/scripts/service/RestServiceExtension');

function asyncData(asyncData)
{
	var service=RestServiceExtension.asyncDataExtensionService(asyncData.items,asyncData.dataType);
	var dataToSend = asyncData.items;
	var result=service.call(dataToSend);
	return result;
}

module.exports={
		asyncData:asyncData
}