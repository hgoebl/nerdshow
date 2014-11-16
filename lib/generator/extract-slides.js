/*jshint node:true, globalstrict:true*/
"use strict";

var fs = require("fs"),
    cheerio = require("cheerio");

function extractSlides(directory, config) {
    var html, slides, $;

    html = fs.readFileSync(directory + '/' + config.destination, 'utf8');
    $ = cheerio.load(html);

    slides = $('.presentation h1').map(function () {
        return $(this).text();
    });

    return slides;
}

exports.extractSlides = extractSlides;
