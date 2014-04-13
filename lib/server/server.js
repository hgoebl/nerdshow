/*jshint node:true, globalstrict:true, devel:true*/
'use strict';

var optimist = require('optimist'),
    options = optimist
        .usage('Usage: $0 path/to/presentation [options]')
        .demand(0)
        .options('port', {
            'default': '8008',
            describe: 'TCP port of web server'
        })
        .options('encoding', {
            'default': 'utf8',
            alias: 'e',
            describe: 'character-set of stdin input'
        })
        .options('debug', {
            'default': false,
            describe: 'output for easier debugging'
        })
        .options('help', {
            alias: 'h',
            describe: 'show help and exit'
        })
        .argv,
    express = require('express'),
    http = require('http'),
    app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    path = require('path'),
    fs = require('fs'),
    htdocs,
    htdocsStats;

// fast exit when demanding help ...
if (options.help) {
    optimist.showHelp();
    process.exit(1);
}

if (options._.length > 0) {
    htdocs = path.normalize(path.resolve(options._[0]));
    try {
        htdocsStats = fs.statSync(htdocs);
    }
    catch (e) {
        if (e.code !== 'ENOENT') {
            throw e;
        }
    }
    if (!htdocsStats || !htdocsStats.isDirectory()) {
        console.log('not a valid directory: ' + htdocs, htdocsStats);
        optimist.showHelp();
        process.exit(1);
    }
}
else {
    htdocs = path.normalize(__dirname + '/../../examples');
    console.warn('No argument given for folder - taking examples...');
}

// Configuration
app.configure('all', function () {
    app.use(app.router);
    app.use('/nerdshow', express['static'](__dirname + '/htdocs'));
    app.use(express['static'](htdocs));
});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

server.listen(options.port);

console.log('Express serving `nerdshow` at http://localhost:%d/', options.port);
console.log('Serving files in', htdocs);

io.set('transports', ['websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
io.set('log level', options.debug ? 2 : 0);

io.sockets.on('connection', function (socket) {
    console.log('Socket connected! id:', socket.id);
    socket.on('jump', function (data) {
        if (options.debug) {
            console.log('on-message', data);
        }
        socket.broadcast.emit('jump', data);
    });
    socket.on('disconnect', function () {
        if (options.debug) {
            console.log('Socket with id %s disconnected.', socket.id);
        }
    });
});
