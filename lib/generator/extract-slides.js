/*jshint node:true, globalstrict:true*/
"use strict";

var jsdom = require("jsdom");

function extractSlides(directory, config, callback) {
    var slides = [];

    jsdom.env(directory + '/' + config.destination,
        [ config.jquery ],
        function (error, window) {
            var $ = window.$;
            if (error) {
                callback(error);
                return;
            }

            $('div.slide').find('h1:first').each(function (index) {
                slides.push($(this).text());
            });

            callback(null, slides);
        });
}

exports.extractSlides = extractSlides;
