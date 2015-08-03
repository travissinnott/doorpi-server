var nconf = require('nconf').file({file:'config.json'}),
	bunyan = require('bunyan'),
	log = bunyan.createLogger({name:'server'}),
	express = require('express'),
	app = express(),
	http = require('http'),
	server = http.createServer(app),
	io = require('socket.io')(server);

// Serve static assets from /public
app.use(express.static(__dirname + '/public'));

//nconf.set('http:port', 8880);
//nconf.save();

// GET /doors returns a list of namespaces
app.get('/doors', function(req, res){
	res.json(Object.keys(io.nsps));
});

app.put('/doors/:id', function(req, res){
	log.info({id:req.id}, "Open Door!");
	io.of(req.id).emit('open');
	res.end("ok");
});

io.on('connection', function(socket){
	socket.on('register', function(data){
		log.info({socket:socket, data:data}, "Pi Registered!");
	});
});

server.listen(nconf.get('http:port'));
log.info(nconf.get('http'), "Server started.");