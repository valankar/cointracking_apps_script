function coinTracking() {
  const url = "https://cointracking.info/api/v1/";
  const cacheId = "CointrackingApiCache_XXX";
  const cacheDuration = 60 * 60;
  const method = "getGains";
  const key = "COINTRACKING_KEY"
  const secret = "COINTRACKING_SECRET";
  var response;

  let cache = CacheService.getDocumentCache();
  var response = cache.get(cacheId);
  if (response != null) {
    Logger.log("Using cached: " + response)
  }
  if (response == null) {
    var date = new Date();
    var nonce = Math.floor((date.getTime()/100)).toString();
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
    Logger.log("Fetched URL: " + response);
    cache.put(cacheId, response, cacheDuration);
  }
  return JSON.parse(response).gains
}

function getXAUAmount() {
  var data = coinTracking();
  return parseFloat(data["XAU"]["amount"]);
}

function getXAUCost() {
  var data = coinTracking();
  return parseFloat(data["XAU"]["cost"]);
}

function getXAUValue() {
  var data = coinTracking();
  return parseFloat(data["XAU"]["current_value"]);
}

function getXAGAmount() {
  var data = coinTracking();
  return parseFloat(data["XAG"]["amount"]);
}

function getXAGCost() {
  var data = coinTracking();
  return parseFloat(data["XAG"]["cost"]);
}

function getXAGValue() {
  var data = coinTracking();
  return parseFloat(data["XAG"]["current_value"]);
}
