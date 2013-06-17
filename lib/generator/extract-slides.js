/*jshint node:true, globalstrict:true*/
"use strict";

var fs = require("fs"),
    cheerio = require("cheerio");

function extractSlides(directory, config) {
    var html, slides, $;

    html = fs.readFileSync(directory + '/' + config.destination, 'utf8');
    $ = cheerio.load(html);

    slides = $('div.slide').map(function () {
        return $(this).find('h1').eq(0).text();
    });

    return slides;
}

exports.extractSlides = extractSlides;
