// ==UserScript==
// @name         WoW Token Converter
// @namespace    https://github.com/victorscopel/wow-token-converter
// @homepage https://github.com/victorscopel/wow-token-converter
// @supportURL https://github.com/victorscopel/wow-token-converter/issues
// @version      1.3.1
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

            var region = Core.region.toUpperCase().replace('US','NA');
            var tokenprice = currencies[Msg.userCurrency];
            var tokengold = eval("apiJson."+region+".raw.buy");


            $('.product-card-container li').each(function( index ) {
                var productprice = $(this).find(".product-price").clone().children().remove().end().text().replace(',','.').replace(/[^\d.-]/g, '');
                var goldfinal = Math.ceil((productprice/tokenprice))*tokengold;
                if (goldfinal){
                    $(this).find(".product-card-info").append('<p style="color:#FFD700;position:absolute;font-size: 13px;top:-1px;left:15px;">Gold: '+goldfinal.toLocaleString("us")+'</p>');
                    $(this).find(".product-card-info").append('<p style="color:red;position:absolute;font-size: 13px;top:0;left:unset;right:15px;">Tokens: '+Math.ceil(goldfinal/tokengold)+'</p>');
                }
            });
        }
    } );

})();
