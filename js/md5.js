// need
// https://raw.github.com/blueimp/JavaScript-MD5/master/js/md5.min.js

var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
//self.setTimeout(function () { job() }, 3000);
function job () {
    var cypher='', clen=8;
    for (var i=0; i<clen; i++) {
	var rnum = Math.floor(Math.random() * chars.length);
	cypher += chars.substring(rnum,rnum+1);
    }
    var encrypt = md5(cypher);

    document.getElementById('output').innerHTML=cypher+':'+encrypt;
    var http = new XMLHttpRequest();
    http.open('POST', '/submit');
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    http.send(JSON.stringify({body: {cypher: cypher, encrypt: encrypt}}));
    self.setTimeout(function () { job() }, 3000);
}
