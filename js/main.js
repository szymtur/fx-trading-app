const url = "https://api.myjson.com/bins/15j70u";


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
    
function insertCurrency(data) {
    let header = $('.container').find('.header h3');
    let sellH4 = $('.container').find('.sell h4');
    let buyH4 = $('.container').find('.buy h4');
    let sell = $('.container').find('.sell h2');
    let buy = $('.container').find('.buy h2');
    
    for (let i=0; i<data.length; i++){
        let currency = (data[i].pair).split(' ');
        
        $(header[i]).text(data[i].pair);
        $(sell[i]).text(data[i].sell);
        $(sellH4[i]).text('Sell ' + currency[0]);
        $(buy[i]).text(data[i].buy);
        $(buyH4[i]).text('Buy ' + currency[0]);
    }
}




function getData() {

    $.ajax({
        method: "GET",
        url: url,
        dataType: "json"
    }).done(function (response) {
            let data = response;
            changePrice(data);
            insertCurrency(data);
        
            $.ajax({
                url: url,
                method: "PUT",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data)
            }).done(function (response) {
                    console.log(response);
            });
    });
}





let interval = setInterval(function () {
    getData();
}, 1000);

let timeout = setTimeout(function () {
    clearInterval(interval);
}, 60000);







/*
function changePrice(data) {
    for (let i = 0; i < data.length; i++) {
        let array = ['+', '-'];
        let random = array[Math.floor(Math.random() * array.length)];
        let newPrice = eval(`${data[i].buy} ${random} ${(data[i].buy * 0.1)}`);     
        data[i].buy = Number(newPrice.toFixed(5));
    }
    return data;
}
*/


/*
const currency = [
  {"pair":"USD CHF", "buy":0.99143, "sell":0.99043},
  {"pair":"GBP USD", "buy":1.28495, "sell":1.2836},
  {"pair":"GBP CHF", "buy":1.27378, "sell":1.27147},
  {"pair":"EUR SEK", "buy":9.632, "sell":9.6055},
  {"pair":"USD JPY", "buy":110.467, "sell":110.417},
  {"pair":"EUR JPY", "buy":120.589, "sell":120.491}
];
*/




/*
function modData() {
    //send data to JSON Server
    $.ajax({
            url: "https://api.myjson.com/bins/",
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(currency)
        })
        .done(function (response) {
            console.log(response.uri);
            url = response.uri;
            
            //get data from JSON Server
            $.ajax({
                method: "GET",
                url: url,
                dataType: "json"
            }).done(function (response) {
                let data = response;
                
                //changing currency prices
                for (let i = 0; i < data.length; i++) {
                    let array = ['+', '-'];
                    let random = array[Math.floor(Math.random() * array.length)];
                    let newPrice = eval(`${data[i].buy} ${random} ${(data[i].buy * 0.1)}`);
                    data[i].buy = Number(newPrice.toFixed(5));
                }
                //                        console.log(data);
                //send modi
                $.ajax({
                    url: url,
                    method: "PUT",
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(data)
                }).done(function (response) {
                    console.log(response);
                });
            });

        });
}

modData();
*/
