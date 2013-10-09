var mongo = require('mongodb');
var http= require('http'), url = require('url'), fs = require('fs');;
var serverIP='0.0.0.0', port=8124;
var mongoIP='127.0.0.1', mongoPort=27017;

http.createServer(function (req, res) {
  var dt=new Date().toISOString();
  var path = url.parse(req.url, true);
  //res.writeHead(200, {'Content-Type': 'text/plain'});
  switch (path.pathname) {
  case '/':
    res.setHeader("Content-Type", "text/html; charset=UTF-8");
    fs.createReadStream('index.html').pipe(res);
    break;
  case '/js/':
    //console.log(Object.keys(path.query)[0]);
    if(fs.existsSync('js/'+Object.keys(path.query)[0]+'.js')) {
        res.setHeader("Content-Type", "application/x-javascript");
        fs.createReadStream('js/'+Object.keys(path.query)[0]+'.js').pipe(res);
    } else {
      res.writeHead(404);
      res.end();
    }
    break;
  case '/submit/':
    var task=Object.keys(path.query)[0];
    //console.log(task);
    var body='';
    req.on('data', function (data) { body+=data; });
    req.on('end', function () { 
        r=JSON.parse(body)['body'];
        //console.log(r['cypher']+':'+r['encrypt']);
        res.writeHead(200,{'Content-Type': 'text/plain'});
        res.end();
        var db=new mongo.Db('ranbow', new mongo.Server(mongoIP, mongoPort, {}), {safe:false});
        db.open(function(err,db) { 
          db.collection(task, function(err,collection) {
            collection.insert(r, function(err, docs) {
              console.log(task+')'+JSON.stringify(docs));
              db.close();
            });
          });
        });
    });
    break;
  case '/get/':
    var gtask=Object.keys(path.query)[0];
    var db=new mongo.Db('ranbow', new mongo.Server(mongoIP, mongoPort, {}), {safe:false});
    db.open(function(err,db) { 
      db.collection(gtask, function(err,collection) {
        collection.findOne({}, {'sort':[['_id','desc']]}, function(err, docs) {
          console.log(gtask+'('+JSON.stringify(docs));
          var r=JSON.stringify(docs);
          res.writeHead(200,{'Content-Type': 'application/json'});
          res.end(r);
          db.close();
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
