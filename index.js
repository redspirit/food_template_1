var StaticServer = require('static-server');
var server = new StaticServer({
    rootPath: 'www',
    name: 'simple-server',
    port: 80,
    host: '127.0.0.1',
    followSymlink: true,
    index: 'index.html'
});

server.start(function () {
    console.log('Server listening to', server.port);
});