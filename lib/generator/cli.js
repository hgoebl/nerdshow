/*jshint node:true, nomen:false, globalstrict:true*/
'use strict';

var fs = require('fs'),
    path = require('path'),
    optimist = require('optimist'),
    options = optimist
        .usage('Usage: $0 <path/to/presentation.json> [options]')
        .demand(1)
        .options('nerdshow-folder', {
            'default': '/nerdshow',
            describe: 'base url for nerdshow runtime'
        })
        .options('socketio-enabled', {
            'default': true,
            describe: 'disable socket-io for static html'
        })
        .options('hijs-enabled', {
            'default': true,
            describe: 'highlight code as javascript'
        })
        .options('zoom-enabled', {
            'default': false,
            describe: 'enable zoom.js (Ctrl+Click)'
        })
        .options('help', {
            alias: 'h',
            describe: 'show help and exit'
        })
        .argv,
    generate = require('./generate-slideshow.js').generateSlideshow,
    extractSlides = require('./extract-slides.js').extractSlides,
    _ = require('underscore');

function main(configFileName, options) {
    var directory = path.dirname(configFileName),
        config, slides;

    config = JSON.parse(fs.readFileSync(configFileName, 'utf8'));
    _.extend(config, options);

    generate(directory, config);

    slides = extractSlides(directory, config);
    fs.writeFileSync(directory + '/slides.json', JSON.stringify(slides));
}

// fast exit when demanding help ...
if (options.help) {
    optimist.showHelp();
    process.exit(1);
}

main(options._[0], options);
