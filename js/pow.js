// need
// https://raw.github.com/blueimp/JavaScript-MD5/master/js/md5.min.js

var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
//self.setTimeout(function () { job() }, 3000);
function sign(input) {
    var encrypt='';
    while(!encrypt.match('00000')) {
      var cypher='', clen=8;
      for (var i=0; i<clen; i++) {
          var rnum = Math.floor(Math.random() * chars.length);
          cypher += chars.substring(rnum,rnum+1);
      }
      var cypher=cypher+':'+input;
      encrypt = md5(cypher);
    }

    document.getElementById('output').innerHTML=cypher+'=>'+encrypt;
    var http = new XMLHttpRequest();
    http.open('POST', '/submit/?pow');
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    http.send(JSON.stringify({body: {cypher: cypher, encrypt: encrypt}}));
    self.setTimeout(function () { job() }, 3000);
}

function job () {
    var ht = new XMLHttpRequest();
    ht.onreadystatechange=function () {
      if(ht.readyState==4 && ht.status==200) {
        sign(JSON.parse(ht.responseText)['encrypt']);
    }};
    ht.open('GET', '/get/?pow');
    ht.send();
}
