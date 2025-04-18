const http = require('http');
const dt = require('./myfirstmodule.js ');
http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('The date and time are currently: ' + dt.myDateTime());
    res.end('Hello World\n');
}).listen(8000)