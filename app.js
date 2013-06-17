var querystring = require('querystring')
	util = require('util'),
	http = require('http'),
	gcm = require('node-gcm'),
	cronJob = require('cron').CronJob,
	sqlite3 = require('sqlite3').verbose();

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

}).listen(8124, "127.0.0.1");

job = new cronJob('*/1 * * * *', function(){
    console.log('===Usuarios actuales===');
    db = new sqlite3.Database('mtga.db');

	db.all('SELECT gcm_id FROM users WHERE status = 0',function(err,rows){

	    var registrationIds = [];
		rows.forEach(function(row){
			registrationIds.push(row.gcm_id);
		});
		console.log(registrationIds);

		if(registrationIds.length > 0){

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

			sender.send(message, registrationIds, 4, function (err, result) {
				console.log(err);
		    	console.log(result);
		    	/*
		    	registrationIds.forEach(function(id){
		    		db.run('UPDATE users SET status = 1 WHERE gcm_id = ?',id);
		    	});*/
				db.close();
				console.log('Fin del proceso')
			});
		}else{
			db.close();
		}

	});
}, function(){
	console.log('Tarea Principal finalizada');
}, true);

function registerdata(broutedata){
	var data = querystring.parse(broutedata);
	console.log('////////////////////data parsed')
	console.log(data);
	db = new sqlite3.Database('mtga.db');
	db.run('INSERT INTO users(gcm_id) VALUES ("'+data.postmsn+'")');
	db.close();
}

function updatedata(broutedata){
	var data = querystring.parse(broutedata);
	console.log(data);
}

console.log('Server running at http://127.0.0.1:8124/');