/*jshint node:true, globalstrict:true, es5:true, devel:true*/
'use strict';

var optimist = require('optimist'),
    options = optimist
        .usage('Usage: $0 path/to/presentation')
        .demand(1)
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
    app,
    io;

// fast exit when demanding help ...
if (options.help) {
    optimist.showHelp();
    process.exit(1);
}

app = express.createServer();
io = require('socket.io').listen(app);

// Configuration
app.configure('all', function () {
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(app.router);
    app.use('/nerdshow', express['static'](__dirname + '/htdocs'));
    app.use(express['static'](__dirname + '/../../examples')); // TODO use path
});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

app.listen(options.port);

if (options.debug) {
    console.log('Express server listening on port %d in %s mode',
        app.address().port, app.settings.env);
}

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
