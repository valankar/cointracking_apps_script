function coinTrackingGains() {
  const url = "https://cointracking.info/api/v1/";
  const cacheId = "CointrackingApiCache_XXX";
  const cacheDuration = 60 * 60;
  const method = "getGains";
  const key = "COINTRACKING_KEY"
  const secret = "COINTRACKING_SECRET";
  var response;

  var cache = CacheService.getDocumentCache();
  var response = cache.get(cacheId);
  if (response != null) {
    Logger.log("Using cached: " + response)
  } else {
    var nonce = Math.floor(Date.now() / 100).toString();
    var encodedParams = "nonce=" + nonce + "&method=" + method;
    var byteSignature = Utilities.computeHmacSignature(
      Utilities.MacAlgorithm.HMAC_SHA_512,
      encodedParams,
      secret);
    var signature = byteSignature.reduce(function (str, chr) {
      chr = (chr < 0 ? chr + 256 : chr).toString(16);
      return str + (chr.length == 1 ? '0' : '') + chr;
    }, '');

    var options = {
      'method': 'post',
      'payload': encodedParams,
      'headers': {
        'Key': key,
        'Sign': signature,
      }
    };
    response = UrlFetchApp.fetch(url, options).getContentText();
    cache.put(cacheId, response, cacheDuration);
    Logger.log("Fetched URL: " + response);
  }
  Utilities.sleep(1000);
  return JSON.parse(response).gains;
}

function getGains() {
  var gains = coinTrackingGains();
  return [
    ["Gold", parseFloat(gains["XAU"]["amount"]), parseFloat(gains["XAU"]["current_value"]), parseFloat(gains["XAU"]["cost"])], 
    ["Silver", parseFloat(gains["XAG"]["amount"]), parseFloat(gains["XAG"]["current_value"]), parseFloat(gains["XAG"]["cost"])], 
  ];
}
