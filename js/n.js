var http = require('http');
var vm=require('vm');
var util=require('util');
hostname='10.1.148.32';
var options = {
  hostname: hostname,
  port: 8124,
  path: '/js/?node-md5',
};
var script;
function job() {
  var sandbox={http:http, console:console, hostname: hostname};
  vm.createContext(sandbox);
  script.runInNewContext(sandbox);
  //console.log(util.inspect(sandbox));
}
function dojob(body) {
  //console.log(body);
  script=vm.createScript(body, 'my.vm');
  setInterval(job, 2000);
}

var req = http.get(options, function(res) {
  var body='';
  res.on('data', function (chunk) {
    body+=chunk;
  });
  res.on('end', function () {
        dojob(body);
  });
});

