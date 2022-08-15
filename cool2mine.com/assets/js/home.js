

var WebURL         = "https://coolmine.com/";
var API            = "https://coolmine.com/api/";
var stratumAddress = "stratum+tcp://coolmine.com";
var defaultPool = 'rvn'; 
var currentPool = defaultPool;

console.log('MiningCore.WebUI : ', WebURL);		                      // Returns website URL
console.log('API address used : ', API);                                      // Returns API URL
console.log('Stratum address  : ', "stratum+tcp://" + stratumAddress + ":");  // Returns Stratum URL
console.log('Page Load        : ', window.location.href);                     // Returns full URL

// Check browser compatibility
var nua = navigator.userAgent;
var is_IE = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Trident') > -1) && !(nua.indexOf('Chrome') > -1));
if(is_IE) {console.log('Running in IE browser is not supported - ', nua);}

// General formatter function
function _formatter(value, decimal, unit) {
	if (value === 0) {
		return "0 " + unit;
	} else {
		var si = [
			{ value: 1, symbol: "" },
			{ value: 1e3, symbol: "k" },
			{ value: 1e6, symbol: "M" },
			{ value: 1e9, symbol: "G" },
			{ value: 1e12, symbol: "T" },
			{ value: 1e15, symbol: "P" },
			{ value: 1e18, symbol: "E" },
			{ value: 1e21, symbol: "Z" },
			{ value: 1e24, symbol: "Y" }
		];
		for (var i = si.length - 1; i > 0; i--) {
			if (value >= si[i].value) {
				break;
			}
		}
		return ((value / si[i].value).toFixed(decimal).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + " " + si[i].symbol + unit);
	}
}

// Time convert Local -> UTC
function convertLocalDateToUTCDate(date, toUTC) {
	date = new Date(date);
	var localOffset = date.getTimezoneOffset() * 60000;
	var localTime = date.getTime();
	if (toUTC) {
		date = localTime + localOffset;
	} else {
		date = localTime - localOffset;
	}
	newDate = new Date(date);
	return newDate;
}

// Time convert UTC -> Local
function convertUTCDateToLocalDate(date) {
	var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
	var localOffset = date.getTimezoneOffset() / 60;
	var hours = date.getUTCHours();
	newDate.setHours(hours - localOffset);
	return newDate;
}

// String convert -> Date
function dateConvertor(date) {
	var options = {  
		year: "numeric",  
		month: "numeric",  
		day: "numeric"
	};
	var newDateFormat = new Date(date).toLocaleDateString("en-US", options); 
	var newTimeFormat = new Date(date).toLocaleTimeString();  
	var dateAndTime = newDateFormat +' '+ newTimeFormat        
	return dateAndTime
}

// Converts seconds
function readableSeconds(t) {
	var seconds = Math.round(t);
	var minutes = Math.floor(seconds/60);
	var hours = Math.floor(minutes/60);
	var days = Math.floor(hours/24);
	if (days === Infinity) days = 0;
	hours = hours-(days*24);
        if (isNaN(hours)) hours = 0;
        if (hours === Infinity) hours = 0;
	minutes = minutes-(days*24*60)-(hours*60);
        if (isNaN(minutes)) minutes = 0;
        if (minutes === Infinity) minutes = 0;
	seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);
        if (isNaN(seconds)) seconds = 0;
        if (seconds === Infinity) seconds = 0;
	if (days > 0) {
		return (days + "d " + hours + "h " + minutes + "m " + seconds + "s");
	}
	if (hours > 0) {
		return (hours + "h " + minutes + "m " + seconds + "s");
	}
	if (minutes > 0) {
		return (minutes + "m " + seconds + "s");
	}
	return (seconds + "s");
}

// Time different calculation
function timeDiff( tstart, tend ) {
	var diff = Math.floor((tend - tstart) / 1000), units = [
		{ d: 60, l: "s" },
		{ d: 60, l: "m" },
		{ d: 24, l: "h" },
		{ d: 7, l: "d" }
	];
	var s = '';
	for (var i = 0; i < units.length; ++i) {
		s = (diff % units[i].d) + units[i].l + " " + s;
		diff = Math.floor(diff / units[i].d);
	}
	return s;
}

// Scroll to top of the page
function scrollPageTop() {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
	var elmnt = document.getElementById("page-scroll-top");
	elmnt.scrollIntoView();
}

// Check if file exits
function doesFileExist(urlToFile) {
	var xhr = new XMLHttpRequest();
	xhr.open('HEAD', urlToFile, false);
	xhr.send();
	if (xhr.status == "404") {
		return false;
	} else {
		return true;
	}
}


// Load Home page content
function loadHomePage() {
	setInterval(
		(function load() {
			loadStatsPriceETH();
			loadStatsPriceETC();
			loadStatsPriceRVN();
			loadStatsPriceBTC();
			loadStatsPriceXMR();
			loadStatsPriceQRL();
			return load;
		})(),10000
	);
}

// Load Stats price eth charts
function loadStatsPriceETH() {
	return $.ajax("https://api.coingecko.com/api/v3/coins/ethereum").done(function (data) {
		ethcoins= 2.000;
		ethprice = (data.market_data.current_price.usd).toFixed(2);
		ethBlockRewardUSD = (ethcoins * ethprice).toFixed(2);
		$("#coinEthToUSD").html("$ " + data.market_data.current_price.usd.toFixed(2));
		$("#coinEthToBTC").html(data.market_data.current_price.btc.toFixed(8));
		$("#priceEthHigh").html("$ " + data.market_data.high_24h.usd.toFixed(2));
		$("#priceEthHighBTC").html(data.market_data.high_24h.btc.toFixed(8));
		$("#priceEthLow").html("$ " + data.market_data.low_24h.usd.toFixed(2));
		$("#priceEthLowBTC").html(data.market_data.low_24h.btc.toFixed(8));
		$("#changeEthBTC").html(data.market_data.price_change_24h_in_currency.btc.toFixed(8));
		$("#changeEthBTCPercent").html(data.market_data.price_change_percentage_24h_in_currency.btc.toFixed(2) + " %");
		$("#marketCapEth").html(data.market_data.market_cap_rank);
		$("#genesisDateEth").html(data.genesis_date);
		$("#blockEthToUSD").html(ethBlockRewardUSD + " $");
		$("#lastBlockRewardEth").html(ethcoins + " ETH");
	});
}

// Load Stats price etc charts
function loadStatsPriceETC() {
	return $.ajax("https://api.coingecko.com/api/v3/coins/ethereum-classic").done(function (data) {
		etccoins= 3.200;
		etcprice = (data.market_data.current_price.usd).toFixed(2);
		etcBlockRewardUSD = (etccoins * etcprice).toFixed(2);
		$("#coinEtcToUSD").html("$ " + data.market_data.current_price.usd.toFixed(2));
		$("#coinEtcToBTC").html(data.market_data.current_price.btc.toFixed(8));
		$("#priceEtcHigh").html("$ " + data.market_data.high_24h.usd.toFixed(2));
		$("#priceEtcHighBTC").html(data.market_data.high_24h.btc.toFixed(8));
		$("#priceEtcLow").html("$ " + data.market_data.low_24h.usd.toFixed(2));
		$("#priceEtcLowBTC").html(data.market_data.low_24h.btc.toFixed(8));
		$("#changeEtcBTC").html(data.market_data.price_change_24h_in_currency.btc.toFixed(8));
		$("#changeEtcBTCPercent").html(data.market_data.price_change_percentage_24h_in_currency.btc.toFixed(2) + " %");
		$("#marketCapEtc").html(data.market_data.market_cap_rank);
		$("#genesisDateEtc").html(data.genesis_date);
		$("#blockEtcToUSD").html(etcBlockRewardUSD + " $");
		$("#lastBlockRewardEtc").html(etccoins + " ETC");
	});
}

// Load Stats price rvn charts
function loadStatsPriceRVN() {
	return $.ajax("https://api.coingecko.com/api/v3/coins/ravencoin").done(function (data) {
		rvncoins= 5000;
		rvnprice = (data.market_data.current_price.usd).toFixed(2);
		rvnBlockRewardUSD = (rvncoins * rvnprice).toFixed(2);
		$("#coinRvnToUSD").html("$ " + data.market_data.current_price.usd.toFixed(2));
		$("#coinRvnToBTC").html(data.market_data.current_price.btc.toFixed(8));
		$("#priceRvnHigh").html("$ " + data.market_data.high_24h.usd.toFixed(2));
		$("#priceRvnHighBTC").html(data.market_data.high_24h.btc.toFixed(8));
		$("#priceRvnLow").html("$ " + data.market_data.low_24h.usd.toFixed(2));
		$("#priceRvnLowBTC").html(data.market_data.low_24h.btc.toFixed(8));
		$("#changeRvnBTC").html(data.market_data.price_change_24h_in_currency.btc.toFixed(8));
		$("#changeRvnBTCPercent").html(data.market_data.price_change_percentage_24h_in_currency.btc.toFixed(2) + " %");
		$("#marketCapRvn").html(data.market_data.market_cap_rank);
		$("#genesisDateRvn").html(data.genesis_date);
		$("#blockRvnToUSD").html(rvnBlockRewardUSD + " $");
		$("#lastBlockRewardRvn").html(rvncoins + " RVN");
	});
}

// Load Stats price btc charts
function loadStatsPriceBTC() {
	return $.ajax("https://api.coingecko.com/api/v3/coins/bitcoin").done(function (data) {
		btccoins= 6.25;
		btcprice = (data.market_data.current_price.usd).toFixed(2);
		btcBlockRewardUSD = (btccoins * btcprice).toFixed(2);
		$("#coinBtcToUSD").html("$ " + data.market_data.current_price.usd.toFixed(2));
		$("#coinBtcToBTC").html(data.market_data.current_price.btc.toFixed(8));
		$("#priceBtcHigh").html("$ " + data.market_data.high_24h.usd.toFixed(2));
		$("#priceBtcHighBTC").html(data.market_data.high_24h.btc.toFixed(8));
		$("#priceBtcLow").html("$ " + data.market_data.low_24h.usd.toFixed(2));
		$("#priceBtcLowBTC").html(data.market_data.low_24h.btc.toFixed(8));
		$("#changeBtcBTC").html(data.market_data.price_change_24h_in_currency.btc.toFixed(8));
		$("#changeBtcBTCPercent").html(data.market_data.price_change_percentage_24h_in_currency.btc.toFixed(2) + " %");
		$("#marketCapBtc").html(data.market_data.market_cap_rank);
		$("#genesisDateBtc").html(data.genesis_date);
		$("#blockBtcToUSD").html(btcBlockRewardUSD + " $");
		$("#lastBlockRewardBtc").html(btccoins + " BTC");
	});
}

// Load Stats price xmr charts
function loadStatsPriceXMR() {
	return $.ajax("https://api.coingecko.com/api/v3/coins/monero").done(function (data) {
		xmrcoins= 0.8833;
		xmrprice = (data.market_data.current_price.usd).toFixed(2);
		xmrBlockRewardUSD = (xmrcoins * xmrprice).toFixed(2);
		$("#coinXmrToUSD").html("$ " + data.market_data.current_price.usd.toFixed(2));
		$("#coinXmrToBTC").html(data.market_data.current_price.btc.toFixed(8));
		$("#priceXmrHigh").html("$ " + data.market_data.high_24h.usd.toFixed(2));
		$("#priceXmrHighBTC").html(data.market_data.high_24h.btc.toFixed(8));
		$("#priceXmrLow").html("$ " + data.market_data.low_24h.usd.toFixed(2));
		$("#priceXmrLowBTC").html(data.market_data.low_24h.btc.toFixed(8));
		$("#changeXmrBTC").html(data.market_data.price_change_24h_in_currency.btc.toFixed(8));
		$("#changeXmrBTCPercent").html(data.market_data.price_change_percentage_24h_in_currency.btc.toFixed(2) + " %");
		$("#marketCapXmr").html(data.market_data.market_cap_rank);
		$("#genesisDateXmr").html(data.genesis_date);
		$("#blockXmrToUSD").html(xmrBlockRewardUSD + " $");
		$("#lastBlockRewardXmr").html(xmrcoins + " XMR");
	});
}

// Load Stats price qrl charts
function loadStatsPriceQRL() {
	return $.ajax("https://api.coingecko.com/api/v3/coins/quantum-resistant-ledger").done(function (data) {
		qrlcoins= 5;
		qrlprice = (data.market_data.current_price.usd).toFixed(2);
		qrlBlockRewardUSD = (qrlcoins * qrlprice).toFixed(2);
		$("#coinQrlToUSD").html("$ " + data.market_data.current_price.usd.toFixed(2));
		$("#coinQrlToBTC").html(data.market_data.current_price.btc.toFixed(8));
		$("#priceQrlHigh").html("$ " + data.market_data.high_24h.usd.toFixed(2));
		$("#priceQrlHighBTC").html(data.market_data.high_24h.btc.toFixed(8));
		$("#priceQrlLow").html("$ " + data.market_data.low_24h.usd.toFixed(2));
		$("#priceQrlLowBTC").html(data.market_data.low_24h.btc.toFixed(8));
		$("#changeQrlBTC").html(data.market_data.price_change_24h_in_currency.btc.toFixed(8));
		$("#changeQrlBTCPercent").html(data.market_data.price_change_percentage_24h_in_currency.btc.toFixed(2) + " %");
		$("#marketCapQrl").html(data.market_data.market_cap_rank);
		$("#genesisDateQrl").html(data.genesis_date);
		$("#blockQrlToUSD").html(qrlBlockRewardUSD + " $");
		$("#lastBlockRewardQrl").html(qrlcoins + " QRL");
	});
}
