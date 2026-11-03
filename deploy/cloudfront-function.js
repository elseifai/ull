// CloudFront Function (viewer request) for the S3 origin: serve /path/ as /path/index.html.
// A link without a trailing slash is redirected to the slashed URL, and the query string
// (UTM and ad click ids) is kept. Without this, the 301 drops the campaign.
function query(qs) {
  var parts = [];
  for (var k in qs) {
    var v = qs[k];
    if (v && v.multiValue && v.multiValue.length) {
      for (var i = 0; i < v.multiValue.length; i++) parts.push(encode(k, v.multiValue[i].value));
    } else parts.push(encode(k, v && v.value));
  }
  return parts.length ? "?" + parts.join("&") : "";
}

function encode(key, value) {
  return value ? key + "=" + value : key;
}

function handler(event) {
  var req = event.request;
  var uri = req.uri;
  if (uri.endsWith("/")) req.uri += "index.html";
  else if (!uri.split("/").pop().includes(".")) {
    return { statusCode: 301, statusDescription: "Moved Permanently", headers: { location: { value: uri + "/" + query(req.querystring) } } };
  }
  return req;
}
