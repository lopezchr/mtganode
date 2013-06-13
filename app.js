var querystring = require('querystring')
	util = require('util'),
	http = require('http'),
	gcm = require('node-gcm'),
	sqlite3 = require('sqlite3').verbose(),
	db = new sqlite3.Database('mtga.db');

db.serialize(function(){
	db.run('CREATE TABLE IF NOT EXISTS users(name UNIQUE)');
});

db.close();
/*var mysql = require('mysql');
var client = mysql.createClient({
    user: 'root',
    password: 'admin',
});*/

server = http.createServer(function (req, res) {

	console.log('::::::::: Nueva peticion: '+req.url);

	var fullbody ='';
	
	switch(req.url){
		case "/":
			res.writeHead(200,{'Content-Type': 'text/plain'});
			res.end('Hello Node.js\n');
			break;
		case "/register":
			if(req.method = "POST"){
				req.on('data',function(chuck){
					console.log('::::::::: Reseived body data:');
					console.log(chuck);
					fullbody += chuck;
				});
				req.on('end',function(){
					registerdata(fullbody);
				});
				req.on('response',function(){
					console.log("respuesta!!");
					res.writeHead(200, "OK", {'Content-Type': 'application/json'});
					res.end();
				});
			}
			break;
		case "/update":
			if(req.method = "POST"){
				req.on('data',function(chuck){
					console.log('::::::::: Reseived body data:');
					console.log(chuck);
					fullbody += chuck;
				});
				req.on('end',function(){
					res.writeHead(200, "OK", {'Content-Type': 'application/json'});
					updatedata(fullbody);
					res.end();
				});
			}
			break;
	}

	/*
	// create a message with default values
	var message = new gcm.Message();

	// or with object values
	var message = new gcm.Message({
	    collapseKey: 'demo',
	    delayWhileIdle: true,
	    timeToLive: 3,
	    data: {
	        key1: 'message1',
	        key2: 'message2'
	    }
	});
	var sender = new gcm.Sender('AIzaSyBNW_xECtb8N32bE-arSYKfnPN4jAXlR4o');
	var registrationIds = [];

	sender.send(message, registrationIds, 4, function (err, result) {
    	console.log(result);
	});
	*/

}).listen(8124, "127.0.0.1");

function registerdata(broutedata){
	var data = querystring.parse(broutedata);
	console.log('////////////////////data parsed')
	console.log(data);
	db = new sqlite3.Database('mtga.db');
	db.run('INSERT INTO users(name) VALUES ("'+data.postmsn+'")');
	db.each('SELECT * FROM users',function(err,row){
		console.log(row);
	});
	db.close();
}

function updatedata(broutedata){
	var data = querystring.parse(broutedata);
	console.log(data);
}

console.log('Server running at http://127.0.0.1:8124/');