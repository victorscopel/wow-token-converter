// ==UserScript==
// @name         WoW Token Converter
// @namespace    https://github.com/victorscopel/wow-token-converter
// @homepage https://github.com/victorscopel/wow-token-converter
// @supportURL https://github.com/victorscopel/wow-token-converter/issues
// @version      1.6.3
// @description  Returns the price and quantity in tokens for every product
// @author       Victor Scopel
// @match        https://*.shop.battle.net/*
// @updateURL https://raw.githubusercontent.com/victorscopel/wow-token-converter/master/converter.user.js
// @downloadURL https://raw.githubusercontent.com/victorscopel/wow-token-converter/master/converter.user.js
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// @run-at document-idle
// ==/UserScript==

/*
const observer = new MutationObserver(mutation => {
    mutation.forEach(function(mutation) {
    console.log(mutation.target.nodeValue);
  });
});

observer.observe(document.head, {
  childList: true,
  attributes: true,
  subtree: true,
  characterData: true
});

*/

function waitForAddedNode(params) {
    new MutationObserver(function(mutations) {
        var el = document.getElementsByClassName(params.id);
        if (el) {
            this.disconnect();
            params.done(el);
        }
    }).observe(params.parent || document, {
        subtree: !!params.recursive,
        childList: true,
    });
}
(function() {
    'use strict';
    waitForAddedNode({
        id: 'price',
        parent: document.querySelector('html'),
        recursive: false,
        done: function(el) {
            setTimeout( function() {
            var currencysymbol = $(el).find('span.price span.full').html().replace(/\d+/g,'').replace(',','').replace(" ","").replace(".","");
            $.ajax ( {
                type:       'GET',
                url:        'https://data.wowtoken.info/snapshot.json',
                dataType:   'JSON',
                success:    function (apiJson) {
                    //Currencies
                    var currencies = {'R$': 24, 'BRL': 24, '$': 15, 'USD': 15, 'AU$': 17, 'A$': 17, 'AUD': 17, '€': 13, 'EUR': 13, '£': 10, 'GBP': 10, 'ARS': 135.00};
                    var balanceamount = $(".balance-menu .balance-link").clone().children().remove().end().text().replace(',','.').replace(/[^\d.-]/g, '');
                    var region = $(".Navbar").data("region").toUpperCase().replace('US','NA');
                    var tokenprice = currencies[currencysymbol];
                    var tokengold = eval("apiJson."+region+".raw.buy");

$('.browsing-card').each(function( index ) {
                            var productprice = $(this).find(".price .full").clone().children().remove().end().text().replace(',','.').replace(/[^\d.-]/g, '');
                            var goldvalue = (productprice-balanceamount)/tokenprice*tokengold;
                            var goldfinal = Math.ceil(((productprice-balanceamount)/tokenprice))*tokengold;
                            if (goldfinal > 0){
                                $(this).append('<p style="color: #fff;position: absolute;font-size: 13px;top: 0;margin: 0;padding: 5px;line-height: 15px;background-color: #24364C;left: 0;z-index: 1000;">Gold: '+goldfinal.toLocaleString("us")+'</p>');
                                $(this).append('<p style="color: #fff;position: absolute;font-size: 13px;top: 0;margin: 0;padding: 5px;line-height: 15px;background-color: #24364C;right: 0;z-index: 1000;">Tokens: '+(goldvalue/tokengold).toFixed(2)+'</p>');
                            } else if (productprice !== '') {
                                $(this).append('<p style="color:#FFD700;position:absolute;font-size: 13px;top:-1px;left:15px;">You have the money to buy this!</p>');
                            }
                        });
                }
            });
                }, 2000 );
        }
    });

})();


