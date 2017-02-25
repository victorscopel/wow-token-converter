// ==UserScript==
// @name         WoW Token Converter
// @namespace    https://github.com/victorscopel/wow-token-converter
// @homepage https://github.com/victorscopel/wow-token-converter
// @supportURL https://github.com/victorscopel/wow-token-converter/issues
// @version      1.6.1
// @description  Returns the price and quantity in tokens for every product
// @author       Victor Scopel
// @match        https://*.battle.net/shop/*
// @updateURL https://raw.githubusercontent.com/victorscopel/wow-token-converter/master/converter.user.js
// @downloadURL https://raw.githubusercontent.com/victorscopel/wow-token-converter/master/converter.user.js
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    $.ajax ( {
        type:       'GET',
        url:        'https://wowtoken.info/snapshot.json',
        dataType:   'JSON',
        success:    function (apiJson) {
            //Currencies
            var currencies = {BRL: 24, USD: 15, AUD: 17, EUR: 13, GBP: 10};
            var balanceamount = $(".balance-amount").clone().children().remove().end().text().replace(',','.').replace(/[^\d.-]/g, '');
            var region = Core.region.toUpperCase().replace('US','NA');
            var tokenprice = currencies[Msg.userCurrency];
            var tokengold = eval("apiJson."+region+".raw.buy");

            $('.product-card-container li').each(function( index ) {
                var productprice = $(this).find(".product-price").clone().children().remove().end().text().replace(',','.').replace(/[^\d.-]/g, '');
                var goldvalue = (productprice-balanceamount)/tokenprice*tokengold;
                var goldfinal = Math.ceil(((productprice-balanceamount)/tokenprice))*tokengold;
                if (goldfinal > 0){
                   $(this).find(".thumbnail").append('<p style="color: #fff;position: absolute;font-size: 13px;top: 0;margin: 0;padding: 5px;line-height: 15px;background-color: #24364C;left: 1px;z-index: 100;">Gold: '+goldfinal.toLocaleString("us")+'</p>');
                   $(this).find(".thumbnail").append('<p style="color: #fff;position: absolute;font-size: 13px;top: 0;margin: 0;padding: 5px;line-height: 15px;background-color: #24364C;right: 1px;z-index: 100;">Tokens: '+(goldvalue/tokengold).toFixed(2)+'</p>');
                } else if (productprice !== '') {
                    $(this).find(".product-card-info").append('<p style="color:#FFD700;position:absolute;font-size: 13px;top:-1px;left:15px;">You have the money to buy this!</p>');
                }
            });
            $('.product-selection .radio-label').each(function( index ) {
                var productprice = $(this).find(".price-container").text().replace(',','.').replace(/[^\d.-]/g, '');
                var goldvalue = (productprice-balanceamount)/tokenprice*tokengold;
                var goldfinal = Math.ceil(((productprice-balanceamount)/tokenprice))*tokengold;
                if (goldfinal > 0){
                    $(this).append('<p style="bottom:-17px;margin:0;color:#FFD700;position:absolute;font-size: 13px;left:38px;">Gold: '+goldfinal.toLocaleString("us")+'</p>');
                    $(this).append('<p style="bottom:-17px;margin:0;color:red;position:absolute;font-size: 13px;left:138px;">Tokens: '+(goldvalue/tokengold).toFixed(2)+'</p>');
                } else if (productprice !== '') {
                    $(this).append('<p style="bottom:-17px;margin:0;color:#FFD700;position:absolute;font-size: 13px;left:38px;">You have the money to buy this!</p>');
                }
            });
            if ($('.single-product').length > 0) {
                var productprice = $(".product-price .price-container").text().replace(',','.').replace(/[^\d.-]/g, '');
                var goldvalue = (productprice-balanceamount)/tokenprice*tokengold;
                var goldfinal = Math.ceil(((productprice-balanceamount)/tokenprice))*tokengold;
                if (goldfinal > 0){
                    $('.product-price').after('<p style="margin:7px;float:right;color:#FFD700;font-size: 13px;">Gold: '+goldfinal.toLocaleString("us")+'</p>');
                    $('.product-price').after('<p style="margin:7px 0 0 0;float:right;color:red;font-size: 13px;">Tokens: '+(goldvalue/tokengold).toFixed(2)+'</p>');
                } else if (productprice !== '') {
                    $('.product-price').after('<p style="margin:7px;float:right;color:#FFD700;font-size: 13px;">You have the money to buy this!</p>');
                }
            }
        }
    } );

})();
