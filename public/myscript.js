var path = require('path');
var http = require('http');
var fs = require('fs');
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED04 = new Gpio(4, 'out'), //use GPIO pin 4 as output
    LED17 = new Gpio(17, 'out'),
    LED27 = new Gpio(27, 'out'),
    LED22 = new Gpio(22, 'out'),
    LED18 = new Gpio(18, 'out'),
    LED23 = new Gpio(23, 'out'),
    LED24 = new Gpio(24, 'out'),
    LED25 = new Gpio(25, 'out');

//Put all the LED variables in an array
var lampen = [LED04, LED17, LED27, LED22, LED18, LED23, LED24, LED25];

var dir = path.join(__dirname, 'public');

var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};

var server = http.createServer(function (req, res) {
    var reqpath = req.url.toString().split('?')[0];
    if (req.method !== 'GET') {
        res.statusCode = 501;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('Method not implemented');
    }
    var file = path.join(dir, reqpath.replace(/\/$/, '/index.html'));
    if (file.indexOf(dir + path.sep) !== 0) {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('Forbidden');
    }
    var type = mime[path.extname(file).slice(1)] || 'text/plain';
    var s = fs.createReadStream(file);
    s.on('open', function () {
        res.setHeader('Content-Type', type);
        s.pipe(res);
    });
    s.on('error', function () {
        res.setHeader('Content-Type', 'text/plain');
        res.statusCode = 404;
        res.end('Not found');
    });
});

server.listen(8080, function () {
    console.log('Listening on http://localhost:8080/');
});

io.listen(9000);

io.sockets.on('connection', function (socket) {// WebSocket Connection
    var lamps = 0;
    socket.on('lamps', function(lamps){
        console.log("het aantal lampen die branden",lamps+1);
            for (let i = 0; i < lamps; i++) {
                lampen[i].writeSync(1);
                
            }
            for (let i = (10-lamps); i < 11; i++) {
                lampen[i].writeSync(0);
                
            }
    })
});