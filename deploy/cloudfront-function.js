// CloudFront Function (viewer request) for the S3 origin: serve /path/ as /path/index.html,
// and 301 the pre-umbrella Auremont paths to their place under /auremont/ (plan 05).
// Keep `moved` in step with cms/src/migrations/20261028_120000_umbrella_paths.ts.
var moved = [
  ["/about/", "/auremont/about/"],
  ["/academics/", "/auremont/academics/"],
  ["/student-life/", "/auremont/student-life/"],
  ["/admissions/", "/auremont/admissions/"],
  ["/parents/", "/auremont/parents/"],
  ["/campus/", "/auremont/bengaluru/nagarbhavi/facilities/"],
  ["/auremont/nagarbhavi/", "/auremont/bengaluru/nagarbhavi/"],
];

function query(qs) {
  var parts = [];
  for (var k in qs) {
    var v = qs[k];
    parts.push(v.value ? k + "=" + v.value : k);
  }
  return parts.length ? "?" + parts.join("&") : "";
}

function redirect(location) {
  return { statusCode: 301, statusDescription: "Moved Permanently", headers: { location: { value: location } } };
}

function handler(event) {
  var req = event.request;
  var uri = req.uri;
  var file = uri.split("/").pop().includes(".");
  var dir = uri.endsWith("/") || file ? uri : uri + "/";
  for (var i = 0; i < moved.length; i++) {
    if (dir.indexOf(moved[i][0]) === 0) return redirect(moved[i][1] + dir.slice(moved[i][0].length) + query(req.querystring));
  }
  if (uri.endsWith("/")) req.uri += "index.html";
  else if (!file) return redirect(uri + "/" + query(req.querystring));
  return req;
}
