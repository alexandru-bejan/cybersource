function getReOrderStatus(orderID) {
	var OrderMgr = require('dw/order/OrderMgr');
	var ProductMgr = require('dw/catalog/ProductMgr');
	var order = OrderMgr.getOrder(orderID);
	var isOrderOOS = true;
	for each(var lineItem in order.getAllProductLineItems()) {
		var productId = lineItem.productID;
		var product = ProductMgr.getProduct(productId);
		if (!product || !product.online) {
			continue;
		}
		var availableQty = product.availabilityModel.inventoryRecord.ATS.value;
		var reqQuantity = lineItem.quantityValue;
		var inventoryCheckPDP = dw.system.Site.current.getCustomPreferenceValue('isInventoryCheckEnabled');
		if (inventoryCheckPDP) {
			if (availableQty > reqQuantity) {
				isOrderOOS = false;
				break;
			}
		}
		else{
			isOrderOOS=false;
		}
	}
	return isOrderOOS;
}
exports.getReOrderStatus = getReOrderStatus;