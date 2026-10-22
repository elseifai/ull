// CloudFront Function (viewer request) for the S3 origin: serve /path/ as /path/index.html.
function handler(event) {
  var req = event.request;
  var uri = req.uri;
  if (uri.endsWith("/")) req.uri += "index.html";
  else if (!uri.split("/").pop().includes(".")) {
    return { statusCode: 301, statusDescription: "Moved", headers: { location: { value: uri + "/" } } };
  }
  return req;
}
