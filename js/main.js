$(document).ready(function () {

    const CURRENCY = [
        {"pair":"USD CHF", "buy":0.99143, "sell":0.99043},
        {"pair":"GBP USD", "buy":1.28495, "sell":1.2836},
        {"pair":"GBP CHF", "buy":1.27378, "sell":1.27147},
        {"pair":"EUR SEK", "buy":9.63200, "sell":9.6055},
        {"pair":"USD JPY", "buy":110.467, "sell":110.417},
        {"pair":"EUR JPY", "buy":120.589, "sell":120.491}
    ];

    const OPTIONS = {
        METHOD: 'GET',
        URL: 'http://www.currency-fake-data-api.com',
        CONTENT_TYPE: 'application/json',
        DATA_TYPE: 'json',
        TIMEOUT: 1500
    }


    // fake ajax response
    $.ajax = function(options) {
        const deferred = $.Deferred();

        if (options.method !== OPTIONS.METHOD) {
            setTimeout(function() {
                console.error(options.method, options.url, 400, '(Bad Request)')
                deferred.reject({status: 400, statusText: 'Bad Request'});
            }, OPTIONS.TIMEOUT);
            return deferred.promise();
        }

        if (options.url !== OPTIONS.URL) {
            setTimeout(function() {
                console.error(options.method, options.url, 404, '(Not Found)')
                deferred.reject({status: 404, statusText: 'Not Found'});
            }, OPTIONS.TIMEOUT);
            return deferred.promise();
        }

        setTimeout(function() {
            deferred.resolve(CURRENCY);
        }, OPTIONS.TIMEOUT);
        return deferred.promise();
    };


    // changing random currency prices
    function changeRandomPrices(data) {
        const buyPriceIndex = Math.floor(Math.random() * data.length);
        const sellPriceIndex = Math.floor(Math.random() * data.length);

        const buyPrice = data[buyPriceIndex].buy;
        const sellPrice = data[sellPriceIndex].sell;

        const newBuyPrice = Math.random() < 0.5 ? buyPrice + buyPrice * 0.1 : buyPrice - buyPrice * 0.1;
        const newSellPrice = Math.random() < 0.5 ? sellPrice + sellPrice * 0.1 : sellPrice - sellPrice * 0.1;

        data[buyPriceIndex].buy = Number(newBuyPrice.toFixed(5));
        data[sellPriceIndex].sell = Number(newSellPrice.toFixed(5));
    }


    // inserting data to the html DOM document
    function insertCurrency(data) {
        let header = $('.container').find('.header h3');
        let sellH4 = $('.container').find('.sell h4');
        let buyH4 = $('.container').find('.buy h4');

        let triangleUp = $('.container').find('.triangle-up');
        let triangleDown = $('.container').find('.triangle-down');

        let sellPrice = $('.container').find('.sell h2');
        let sellPart1 = sellPrice.find('.sell-part-1');
        let sellPart2 = sellPrice.find('.sell-part-2');
        let sellPart3 = sellPrice.find('.sell-part-3');

        let buyPrice = $('.container').find('.buy h2');
        let buyPart1 = buyPrice.find('.buy-part-1');
        let buyPart2 = buyPrice.find('.buy-part-2');
        let buyPart3 = buyPrice.find('.buy-part-3');

        for (let i=0; i<data.length; i++) {
            //arrows conditions
            const currentBuyPriceVal = Number($(buyPrice[i]).text());
            const newBuyPriceVal = data[i].buy;

            if(currentBuyPriceVal == newBuyPriceVal || currentBuyPriceVal == 0) {
                $(triangleUp[i]).css('display', 'none');
                $(triangleDown[i]).css('display', 'none');
            }
            else if(currentBuyPriceVal > newBuyPriceVal) {
                $(triangleUp[i]).css('display', 'none');
                $(triangleDown[i]).css('display', 'block');
            }
            else if(currentBuyPriceVal < newBuyPriceVal) {
                $(triangleUp[i]).css('display', 'block');
                $(triangleDown[i]).css('display', 'none');
            }

            //inserts buy prices
            const newBuyPrice = data[i].buy.toString();

            $(buyPart1[i]).text(newBuyPrice.slice(0, newBuyPrice.length-3));
            $(buyPart2[i]).text(newBuyPrice.slice(newBuyPrice.length-3, newBuyPrice.length-1));
            $(buyPart3[i]).text(newBuyPrice.charAt(newBuyPrice.length-1));

            //inserts sell prices
            const newSellPrice = data[i].sell.toString();

            $(sellPart1[i]).text(newSellPrice.slice(0, newSellPrice.length-3));
            $(sellPart2[i]).text(newSellPrice.slice(newSellPrice.length-3, newSellPrice.length-1));
            $(sellPart3[i]).text(newSellPrice.charAt(newSellPrice.length-1));

            //inserts currencies
            const currency = data[i].pair.split(' ');
            
            $(header[i]).text(data[i].pair);
            $(sellH4[i]).text('Sell ' + currency[0]);
            $(buyH4[i]).text('Buy ' + currency[0]);
        }
    }

    // fetching data from fake api
    function fetchCurrecyData() {
        $.ajax({
            method: OPTIONS.METHOD,
            url: OPTIONS.URL,
            contentType: OPTIONS.CONTENT_TYPE,
            dataType: OPTIONS.DATA_TYPE
        }).done(function (response) {
            console.info('connected to:', OPTIONS.URL);
            changeRandomPrices(CURRENCY);
            insertCurrency(response);
            fetchCurrecyData();
        }).fail(function (error) {
            console.error('connecting error:', error.status, error.statusText);
        });
    }


    // setting the initial data on website
    insertCurrency(CURRENCY);

    // starting application
    fetchCurrecyData();

    // fixing :hover on touchscreen
    (function(l){let i,s={touchend:function(){}};for(i in s)l.addEventListener(i,s)})(document);
});