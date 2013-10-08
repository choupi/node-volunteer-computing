var mongo = require('mongodb');
var http= require('http'), url = require('url'), fs = require('fs');;
var serverIP='0.0.0.0', port=8124;
var mongoIP='127.0.0.1', mongoPort=27017;
var db=new mongo.Db('ranbow', new mongo.Server(mongoIP, mongoPort, {}), {});

http.createServer(function (req, res) {
  var dt=new Date().toISOString();
  var path = url.parse(req.url);
  //res.writeHead(200, {'Content-Type': 'text/plain'});
  switch (path.pathname) {
  case '/':
    res.setHeader("Content-Type", "text/html; charset=UTF-8");
    fs.createReadStream('index.html').pipe(res);
    break;
  case '/submit':
    //console.log(req.body.cypher);
    var body='';
    req.on('data', function (data) { body+=data; });
    req.on('end', function () { 
        r=JSON.parse(body)['body'];
        //console.log(r['cypher']+':'+r['encrypt']);
        res.writeHead(200,{'Content-Type': 'text/plain'});
        res.end();
        db.open(function(err,db) { 
          db.collection('ranbow', function(err,collection) {
            collection.insert(r, function(err, docs) {
              console.log(docs);
              db.close();
            });
          });
        });
    });
    break;
  default:
    res.writeHead(404);
    res.end();
    break;
  }
  //console.log(req.headers);
  console.log(req.connection.remoteAddress+' - - ['+dt+'] '+req.method+' "'+req.url+'" "'+req.headers['user-agent']+'"');
}).listen(port, serverIP);
