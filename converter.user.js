// ==UserScript==
// @name         WoW Token Converter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Returns the price and quantity in tokens for every product
// @author       Victor Scopel
// @match        https://*.battle.net/shop/*
 //@require  http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @updateURL https://raw.githubusercontent.com/victorscopel/wow-token-converter/master/converter.user.js
// @downloadURL https://raw.githubusercontent.com/victorscopel/wow-token-converter/master/converter.user.js
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
        var url = window.location.href;
        
        if (url.search("us") >= 0) {
         var resultObj = apiJson.NA['raw'];
         var precotoken = 15;
         if ((url.search("pt") >= 0))
             var precotoken = 24;
        }
        else if (url.search("eu") >= 0){
         var resultObj = apiJson.EU['raw'];
         var precotoken = 13;
        }            
        
        var valortoken = resultObj.buy;
        $(".product-card-container li").each(function( index ) {
            var valor = $(this).find(".product-price").html().replace(',','.').replace(/[^\d.-]/g, '');
            var valorfinal = Math.ceil((valor/precotoken))*valortoken;
            if (valorfinal){
                $(this).find(".product-card-info").append('<p style="color:#FFD700;position:absolute;font-size: 13px;top:-1px;left:15px;">Gold: '+valorfinal.toLocaleString("us")+'</p>');
                $(this).find(".product-card-info").append('<p style="color:red;position:absolute;font-size: 13px;top:0;left:unset;right:15px;">Tokens: '+Math.ceil(valorfinal/valortoken)+'</p>');
            }
        });
    }
} );
    
})();
