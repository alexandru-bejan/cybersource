'use strict';

/**
 * Restores Quantity Selector to its original state.
 * @param {HTMLElement} $quantitySelect - The Quantity Select Element
 */
function restoreQuantityOptions($quantitySelect) {
    var originalHTML = $quantitySelect.data('originalHTML');
    if (originalHTML) {
        $quantitySelect.html(originalHTML);
    }
}

/**
 * Sets the data attribute of Quantity Selector to save its original state.
 * @param {HTMLElement} $quantitySelect - The Quantity Select Element
 */
function setOriginalQuantitySelect($quantitySelect) {
    if (!$quantitySelect.data('originalHTML')) {
        $quantitySelect.data('originalHTML', $quantitySelect.html());
    } // If it's already there, don't re-set it
}

/**
 * Updates the Quantity Selector based on the In Store Quantity.
 * @param {string} quantitySelector - Quantity Selector
 * @param {string} quantityOptionSelector - Quantity Option Selector
 * @param {number} productAtsValue - Inventory in the selected store
 */
function updateQOptions(quantitySelector, quantityOptionSelector, productAtsValue) {
    var selectedQuantity = $(quantitySelector).val();
    restoreQuantityOptions($(quantitySelector));
    for (var i = $(quantityOptionSelector).length - 1; i >= productAtsValue; i--) {
        $(quantityOptionSelector).eq(i).remove();
    }
    $(quantitySelector + ' option[value="' + selectedQuantity + '"]').attr('selected', 'selected');
}

/**
 * Update quantity options. Only display quantity options that are available for the store.
 * @param {sring} searchPID - The product ID of the selected product.
 * @param {number} storeId - The store ID selected for in store pickup.
 * @param {Object} storeAvailabilityStatus - Store's Availability Status
 */
function updateQuantityOptions(searchPID, storeId, storeAvailabilityStatus) {
    var selectorPrefix = '.product-detail[data-pid="' + searchPID + '"]';
    var productIdSelector = selectorPrefix + ' .product-id';
    var quantitySelector = selectorPrefix + ' .quantity-select';
    var quantityOptionSelector = quantitySelector + ' option';

    setOriginalQuantitySelect($(quantitySelector));

    var requestData = {
        pid: $(productIdSelector).text(),
        quantitySelected: $(quantitySelector).val(),
        storeId: storeId,
        availabilityStatus: storeAvailabilityStatus.status,
        ats: storeAvailabilityStatus.availableQty
    };

    $.ajax({
        url: $('.btn-get-in-store-inventory').data('ats-action-url'),
        data: requestData,
        method: 'GET',
        success: function (response) {
          // Update Quantity dropdown, Remove quantity greater than inventory
            var productAtsValue = response.atsValue;
            var availabilityValue = '';

            var $productContainer = $('.product-detail[data-pid="' + searchPID + '"]');

            if (!response.product.readyToOrder) {
                availabilityValue = '<div>' + response.resources.info_selectforstock + '</div>';
            } else {
                response.product.messages.forEach(function (message) {
                    availabilityValue += '<div>' + message + '</div>';
                });
            }

            $($productContainer).trigger('product:updateAvailability', {
                product: response.product,
                $productContainer: $productContainer,
                message: availabilityValue,
                resources: response.resources
            });

            $('button.add-to-cart, button.add-to-cart-global, button.update-cart-product-global').trigger('product:updateAddToCart', {
                product: response.product, $productContainer: $productContainer
            });

            updateQOptions(quantitySelector, quantityOptionSelector, productAtsValue);
        }
    });
}

try {
    var pdpInstoreInventory = require('instorepickup/product/pdpInstoreInventory');

    pdpInstoreInventory.selectStoreWithInventory = function () {
        $('body').off('store:selected').on('store:selected', function (e, data) {
            var searchPID = $('.btn-storelocator-search').attr('data-search-pid');
            var storeElement = $('.product-detail[data-pid="' + searchPID + '"]');
            $(storeElement).find('.selected-store-with-inventory .card-body').empty();
            $(storeElement).find('.selected-store-with-inventory .card-body').append(data.storeDetailsHtml);
            $(storeElement).find('.store-name').attr('data-store-id', data.storeID);
            $(storeElement).find('.selected-store-with-inventory').removeClass('display-none');

            var $changeStoreButton = $(storeElement).find('.change-store');
            $($changeStoreButton).data('postal', data.searchPostalCode);
            $($changeStoreButton).data('radius', data.searchRadius);

            $(storeElement).find('.btn-get-in-store-inventory').hide();

            var storeAvailabilityStatus = $('#inStoreInventoryModal').find('input[value=' + data.storeID + ']').data('store-info');
            updateQuantityOptions(searchPID, data.storeID, storeAvailabilityStatus);

            $('#inStoreInventoryModal').modal('hide');
            $('#inStoreInventoryModal').remove();
        });
    };

    pdpInstoreInventory.removeStoreId = function () {
        $(document).on('store:afterRemoveStoreSelection', function (e) {
            e.preventDefault();
            var storeElement = $('.selected-store-with-inventory');
            e.preventDefault();
            $.ajax({
                url: $(storeElement).find('.card-body').attr('data-unsetstore-url'),
                method: 'GET',
                success: function () {
                    return;
                }
            });
        });
    };

    pdpInstoreInventory.updateAddToCartFormData = function () {
        $('body').on('updateAddToCartFormData', function (e, form) {
            if (form.pidsObj) {
                var pidsObj = JSON.parse(form.pidsObj);
                pidsObj.forEach(function (product) {
                    var storeElement = $('.product-detail[data-pid="' +
                        product.pid +
                        '"]').find('.store-name');
                    product.storeId = $(storeElement).length // eslint-disable-line no-param-reassign
                        ?
                        $(storeElement).attr('data-store-id') :
                        null;
                });
                // Not allowing instorepick up from PDP
                form.pidsObj = JSON.stringify(pidsObj); // eslint-disable-line no-param-reassign
            }
        });
    };

    pdpInstoreInventory.initializeTooltip = function () {
        $('body').on('mouseenter focusin', '.info-icon', function () {
            $(this).find('.tooltip').removeClass('d-none');
        });

        $('body').on('mouseleave focusout', '.info-icon', function () {
            $(this).find('.tooltip').addClass('d-none');
        });
    };

    module.exports = pdpInstoreInventory;
} catch (ex) {
    if (ex instanceof Error && ex.code === 'MODULE_NOT_FOUND') {
        module.exports = {};
    } else {
        throw ex;
    }
}
