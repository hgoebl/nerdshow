/*jshint node:true, nomen:false, globalstrict:true*/
'use strict';

var fs = require('fs'),
    path = require('path'),
    argv = require('optimist')
        .usage('Usage: $0 <path/to/presentation.json>')
        .demand(1)
        .argv,
    generate = require('./generate-slideshow.js').generateSlideshow,
    extractSlides = require('./extract-slides.js').extractSlides;

function main(configFileName) {
    var directory = path.dirname(configFileName),
        config;

    config = JSON.parse(fs.readFileSync(configFileName, 'utf8'));

    generate(directory, config);

    extractSlides(directory, config, function (error, slides) {
        if (error) throw error;
        fs.writeFileSync(directory + '/' + 'slides.json', JSON.stringify(slides));
    });
}

main(argv._[0]);
