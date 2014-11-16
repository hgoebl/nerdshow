/*jshint node:true, globalstrict:true, devel:true*/
'use strict';

var fs = require('fs'),
    path = require('path'),
    marked = require('marked'),
    mote = require('mote');


function md2html(md) {
    var html = marked.lexer(md);

    html.forEach(function (item) {
        if (item.type === 'paragraph' && item.text.match(/^\./)) {
            item.type = 'html';
            item.text = item.text.slice(1);
        }
    });

    html = marked.parser(html);

    return html;
}

function prepareMustacheHash(input) {
    var hash = {};
    Object.keys(input).forEach(function (key) {
        hash[key.replace('-', '_')] = input[key];
    });
    return hash;
}

function generateSlideshow(directory, config) {
    var template, html, slides, templatePath;

    if (config.template.match(/^\w+$/)) {
        templatePath = path.join(__dirname, 'templates', config.template + '-template.html');
    }
    else {
        templatePath = config.template; // TODO distinguish between relative (directory+) and absolute paths
    }

    template = fs.readFileSync(templatePath, 'utf8');

    slides = config.source.map(function (fileName) {
        var file = path.join(directory, fileName),
            content = fs.readFileSync(file, 'utf8');

        if (path.extname(file) === '.md') {
            return md2html(content);
        }
        return content; // probably a html file
    });

    if (config.head_include) {
        if (!Array.isArray(config.head_include)) {
            config.head_include = [config.head_include];
        }
        config.head_include = config.head_include.map(function (fileName) {
            return fs.readFileSync(path.join(directory, fileName), 'utf8');
        }).join('\n');
    }

    config.slides = slides.join('\n');

    html = mote.compile(template)(prepareMustacheHash(config));
    fs.writeFileSync(path.join(directory, config.destination), html, 'utf8');
}

exports.generateSlideshow = generateSlideshow;
