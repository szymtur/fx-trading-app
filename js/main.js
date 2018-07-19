console.log('the application is worning by 120 seconds - setTimeout = 120000 ms');

const currency = [
  {"pair":"USD CHF", "buy":0.99143, "sell":0.99043},
  {"pair":"GBP USD", "buy":1.28495, "sell":1.2836},
  {"pair":"GBP CHF", "buy":1.27378, "sell":1.27147},
  {"pair":"EUR SEK", "buy":9.632, "sell":9.6055},
  {"pair":"USD JPY", "buy":110.467, "sell":110.417},
  {"pair":"EUR JPY", "buy":120.589, "sell":120.491}
];


//change random prices
function changePrice(data) {
    let array = ['+', '-'];
    let randomBuySign = array[Math.floor(Math.random() * array.length)];
    let randomSellSign = array[Math.floor(Math.random() * array.length)];
        
    let randomBuy = Math.floor(Math.random() * data.length);     
    let randomSell = Math.floor(Math.random() * data.length);     
    
    let newBuyPrice = eval(`${data[randomBuy].buy} ${randomBuySign} ${(data[randomBuy].buy * 0.1)}`);     
    let newSellPrice = eval(`${data[randomSell].sell} ${randomSellSign} ${(data[randomSell].sell * 0.1)}`);     
        
    data[randomBuy].buy = Number(newBuyPrice.toFixed(5));
    data[randomSell].sell = Number(newSellPrice.toFixed(5));
}


//insert data to website
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

    for (let i=0; i<data.length; i++){
        let currency = (data[i].pair).split(' ');
        let buyPriceVal = Number($(buyPrice[i]).text());
        
        //arrows conditions
        if (buyPriceVal < data[i].buy){
            $(triangleUp[i]).css('display', 'block');
            $(triangleDown[i]).css('display', 'none');
        }
        else if(buyPriceVal > data[i].buy){
            $(triangleUp[i]).css('display', 'none');
            $(triangleDown[i]).css('display', 'block');
        }
        else if(buyPriceVal == data[i].buy){
            $(triangleUp[i]).css('display', 'none');
            $(triangleDown[i]).css('display', 'none');
        }
        
        //insert buy price 
        let buyPriceFormServer = data[i].buy.toString();
        let buyPricePart1 = buyPriceFormServer.slice(0, buyPriceFormServer.length-3);
        let buyPricePart2 = buyPriceFormServer.slice(buyPriceFormServer.length-3, buyPriceFormServer.length-1);
        let buyPricePart3 = buyPriceFormServer.charAt(buyPriceFormServer.length-1);
        
        $(buyPart1[i]).text(buyPricePart1);
        $(buyPart2[i]).text(buyPricePart2);
        $(buyPart3[i]).text(buyPricePart3);
        
        //insert sell price
        let sellPriceFormServer = data[i].sell.toString();
        let sellPricePart1 = sellPriceFormServer.slice(0, sellPriceFormServer.length-3);
        let sellPricePart2 = sellPriceFormServer.slice(sellPriceFormServer.length-3, sellPriceFormServer.length-1);
        let sellPricePart3 = sellPriceFormServer.charAt(sellPriceFormServer.length-1);
     
        $(sellPart1[i]).text(sellPricePart1);
        $(sellPart2[i]).text(sellPricePart2);
        $(sellPart3[i]).text(sellPricePart3);
        
        //insert currency
        $(header[i]).text(data[i].pair);
        $(sellH4[i]).text('Sell ' + currency[0]);
        $(buyH4[i]).text('Buy ' + currency[0]);
    }
}


function postData() {
    //send data to JSON Server
    $.ajax({
        url: "https://api.myjson.com/bins/",
        method: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(currency)
    }).done(function (response) {
        console.log(response.uri);
        url = response.uri;
        
        let interval = setInterval(function () {
            getData(url);
        }, 1000);

        let timeout = setTimeout(function () {
            clearInterval(interval);
        }, 120000);
    }).fail(function (error) {
        console.log('connecting ' + error.statusText);
    });
};
postData();

// get data from JSON Server
function getData(url) {
    $.ajax({
        method: "GET",
        url: url,
        dataType: "json"
    }).done(function (response) {
        console.log('connected');
        changePrice(response);
        insertCurrency(response);
        putData(response);
    }).fail(function (error) {
        console.log('connecting ' + error.statusText);
    });
}

//put modificated data to JSON Server
function putData(data) {
    $.ajax({
        url: url,
        method: "PUT",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data)
    }).done(function (response) {
        console.log('data updated');
    }).fail(function (error) {
        console.log('connecting ' + error.statusText);
    });
}

