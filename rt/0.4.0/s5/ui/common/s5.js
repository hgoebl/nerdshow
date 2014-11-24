/*jshint browser:true, jquery:true, plusplus:false*/
/*global Hammer*/
(function ($, hammer, window, document) {
    'use strict';
    var fadeDuration = 100,
        incrDuration = 100,
        controlsDuration = 200,
        controlsTimeout = null,
        projectionMode = false,
        currentSlide = 1,
        currentStep = 0,
        slideCount = 0,
        incrementals = [],
        currentHash = location.hash,
        transitions = false,
        mobileAndTouch,
        slideDurations = [],
        startTime = new Date().getTime(),
        eventCreator = Math.round(Math.random() * Math.pow(2, 16)).toString(36); // hgoebl

    function log(text) {
        if (window.console) {
            window.console.log(text);
        }
    }

    function rescale() {
        var factor = 1, fontSize = 1, unit = 'em',
            vScale = 48, hScale = 64, vSize, hSize, em;
        if (projectionMode) {
            if (window.innerHeight) {
                vSize = window.innerHeight;
                hSize = window.innerWidth;
            } else if (document.documentElement.clientHeight) {
                vSize = document.documentElement.clientHeight;
                hSize = document.documentElement.clientWidth;
            } else if (document.body.clientHeight) {
                vSize = document.body.clientHeight;
                hSize = document.body.clientWidth;
            } else {
                vSize = 700;
                hSize = 1024;
            }
            fontSize = Math.min(Math.round(vSize / vScale), Math.round(hSize / hScale));
            unit = 'px';

            em = $('<div style="display: none; font-size: 1em; margin: 0; padding:0; height: auto; line-height: 1; border:0;">&#160;</div>').appendTo('body');
            factor = fontSize / em.height();
            em.remove();
        }
        $('body').css({fontSize: fontSize + unit});
        $('img.scale').each(function () {
            var img = $(this), w = img.attr('width'), h = img.attr('height');
            if (w && h) {
                img.css({width: Math.floor(w * factor) + 'px',
                    height: Math.floor(h * factor) + 'px'});
            }
        });
        return false;
    }

    function trackTime() {
        var now = new Date().getTime(),
            duration = now - startTime;
        slideDurations[currentSlide] = (slideDurations[currentSlide] || 0) + duration;
        startTime = now;
    }

    function logTime() {
        var sum = 0;
        $('.slide').each(function (i) {
            var slide = i + 1, duration = Math.round((slideDurations[slide] || 0) / 1000);
            log('' + slide + ': ' + duration + ' [' + $('h1,h2,h3,h4,h5,h6', this).first().text() + ']');
            sum += duration;
        });
        log('all: ' + sum + 'sec (' + (sum/60).toFixed(1) + 'min)');
    }

    function setSlide(slide, backward) {
        trackTime();
        location.hash = currentHash = '' + slide;
        currentSlide = slide;
        currentStep = backward ? incrementals[currentSlide - 1].length : 0;
        $('#slideList').val('' + slide);
        $('#currentSlide').html('<span id="csHere">' + currentSlide +
            '</span><span id="csSep">/</span><span id="csTotal">' + slideCount + '</span>');
    }

    function jump(slide, backward, immediately, dontpublish) {
        if (!projectionMode || slide < 1 || slide > slideCount || slide === currentSlide) {
            return;
        }

        // hgoebl begin
        if (dontpublish !== true) {
            $(document).trigger('jump-pub', {
                slide: slide,
                backward: !!backward,
                immediately: !!immediately,
                eventCreator: eventCreator
            });
        }
        // hgoebl end

        incrementals[currentSlide - 1].removeClass('current');

        var i = incrementals[slide - 1];
        if (backward) {
            i.eq(i.size() - 1).addClass('current');
            i.css({visibility: 'visible', opacity: 1});
        } else {
            i.css({visibility: 'hidden', opacity: 0});
        }

        if (transitions && !immediately) {
            $('.slide').stop(true, true);
            $('#slide' + currentSlide).fadeOut(fadeDuration, function () {
                $('#slide' + slide).fadeIn(fadeDuration);
            });
        } else {
            $('#slide' + currentSlide).hide();
            $('#slide' + slide).show();
        }
        setSlide(slide, backward);
    }

    function first() {
        jump(1);
        return false;
    }

    function last() {
        jump(slideCount);
        return false;
    }

    function next() {
        if (!projectionMode) {
            return;
        }
        if (currentStep === incrementals[currentSlide - 1].size()) {
            jump(currentSlide + 1);
        } else {
            var i = incrementals[currentSlide - 1];
            i.eq(currentStep - 1).removeClass('current');
            i = i.eq(currentStep++).addClass('current');
            if (transitions) {
                i.css({visibility: 'visible'}).stop(true).animate({opacity: 1}, incrDuration);
            } else {
                i.css({visibility: 'visible', opacity: 1});
            }
        }
        return false;
    }

    function previous() {
        if (!projectionMode) {
            return;
        }
        if (currentStep === 0) {
            jump(currentSlide - 1, true);
        } else {
            var i = incrementals[currentSlide - 1];
            i.eq(currentStep - 2).addClass('current');
            if (transitions) {
                i.eq(--currentStep).stop(true).animate({opacity: 0}, incrDuration, function () {
                    $(this).css({visibility: 'hidden'}).removeClass('current');
                });
            } else {
                i.eq(--currentStep).css({visibility: 'hidden', opacity: 0}).removeClass('current');
            }
        }
        return false;
    }

    function showControls() {
        if (controlsTimeout) {
            clearTimeout(controlsTimeout);
            controlsTimeout = null;
        }
        $('#controlsBar').css({visibility: 'visible', opacity: 1});
    }

    function hideControls() {
        controlsTimeout = null;
        $('#controlsBar').stop(true).animate({opacity: 0}, controlsDuration, function () {
            $(this).css({visibility: 'hidden'});
        });
    }

    function hideControlsDelayed() {
        controlsTimeout = setTimeout(hideControls, 8000);
    }

    function toggleControls() {
        var controls = $('#controlsBar');
        if (controls.css('visibility') === 'visible' && controls.css('opacity') === '1') {
            controls.css({visibility: 'hidden', opacity: 0});
        } else {
            controls.css({visibility: 'visible', opacity: 1});
        }
    }

    function toggleTransitions() {
        transitions = !transitions;
        $('#navTransitions').html(transitions ? '&#9639;' : '&#9634;');
        return false;
    }

    function keyup(key) {
        if (!key) {
            key = event;
            key.which = key.keyCode;
        }
        switch (key.which) {
            case 34: // page down
                jump(currentSlide + 1);
                break;
            case 32: // spacebar
            case 39: // rightkey
            case 40: // downkey
                next();
                break;
            case 13: // enter
                next();
                break;
            case 33: // page up
                jump(currentSlide - 1);
                break;
            case 37: // leftkey
            case 38: // upkey
                previous();
                break;
            case 36: // home
                first();
                break;
            case 35: // end
                last();
                break;
            case 67: // c
                toggleControls();
                break;
            case 84: // t
                logTime();
                break;
        }
        return false;
    }

    function pageLoaded() {
        projectionMode = true;
        $('.presentation').show();
        $('#loading').hide();
        $('.slide').hide();
        $('.navigation, #currentSlide, #slide' + currentSlide).show();
        rescale();
    }

    function directExternalLinksToBlank() {
        $('a[href ^= "http://"], a[href ^= "https://"]')
            .filter(':not([target])')
            .each(function () {
            $(this).attr('target', '_blank');
        });
    }

    function wrapSimpleStructureToSlides() {
        var presentation = $('.presentation');
        if (presentation.has('.slide').length) {
            return; // already has slides marked
        }
        presentation.find('h1').each(function () {
            var $set = $(this);
            var $nxt = $set.next();
            while ($nxt.length && !$($nxt).is('h1')) {
                $set = $set.add($nxt);
                $nxt = $nxt.next();
            }
            $set.wrapAll('<div class="slide"/>');
        });
    }

    function initSlides() {
        var $slides = $('.slide');

        if ($('#currentSlide').size() === 0) {
            $('.layout').append('<div id="currentSlide"/>');
        }
        $slides.each(function (i) {
            $(this).attr('id', 'slide' + (i + 1));
            incrementals[i] = $(':not(ul, ol).incremental,' +
                'ul.incremental:not(.show-first) > li,' +
                'ol.incremental:not(.show-first) > li,' +
                'ul.incremental.show-first > li:not(:first-child),' +
                'ul.incremental.show-first > li:not(:first-child)', this);
        });
        $('a[href^=#slide]').each(function () {
            var match;
            if ((match = this.href.match(/#slide(\d+)$/))) {
                this.href = '#';
                match = parseInt(match[1], 10);
                $(this).click(function () {
                    jump(match);
                    return false;
                });
            }
        });

        slideCount = $slides.size();

        var match;
        if ((match = location.hash.match(/^#(\d+)$/))) {
            currentSlide = parseInt(match[1], 10);
        }
        setSlide(currentSlide);
    }

    function checkHash() {
        var match;
        if (currentHash !== location.hash) {
            currentHash = location.hash;
            if ((match = currentHash.match(/^#(\d+)$/))) {
                jump(parseInt(match[1], 10), false, true);
            }
        }
        setTimeout(checkHash, 250);
    }

    function initControls() {
        if ($('#controls').size() === 0) {
            $('.layout').append('<div id="controls"/>');
        }
        $('#controls').html('<div id="controlsBar" style="visibility: hidden"><div id="controlsContainer">' +
            '<a class="navigation" id="navFirst" href="#">&#9646;&#9664;</a>' +
            '<a class="navigation" id="navPrevious" href="#">&#9664;</a>' +
            '<a class="navigation" id="navNext" href="#">&#9654;</a>' +
            '<a class="navigation" id="navLast" href="#">&#9654;&#9646;</a>' +
            '<a class="navigation" id="navTransitions" href="#">&#' + (transitions ? '9639' : '9634') + ';</a>' +
            '<select class="navigation" id="slideList"/>' +
            '<a class="navigation" id="navClose" href="#">&#10006;</a></div></div>')
            .mouseenter(showControls).mouseleave(hideControlsDelayed);
        $('#navPrevious').click(previous);
        $('#navNext').click(next);
        $('#navFirst').click(first);
        $('#navLast').click(last);
        $('#navTransitions').click(toggleTransitions);
        $('#navClose').click(hideControls);
        var $slideList = $('#slideList');
        $slideList.change(function () {
            jump(parseInt($slideList.val(), 10));
        });

        var list = $slideList.get(0);
        $('.slide').each(function (i) {
            var nr = (i + 1).toString();
            list.options[list.length] = new Option(nr + ' : ' + $('h1,h2,h3,h4,h5,h6', this).first().text(), nr);
        });
    }

    function init() {
        transitions = $('meta[name=transitions]').attr('content') === 'yes';
        fadeDuration = parseInt($('meta[name=fadeDuration]').attr('content') || fadeDuration, 10);
        incrDuration = parseInt($('meta[name=incrDuration]').attr('content') || incrDuration, 10);
        mobileAndTouch = /android|bada|blackberry|iemobile|ip(hone|od|ad)|opera m(ob|in)i|windows phone/i.
            test(navigator.userAgent || navigator.vendor || window.opera) &&
            ('ontouchstart' in document.documentElement);

        directExternalLinksToBlank();
        wrapSimpleStructureToSlides();
        initSlides();
        initControls();

        $(document).keyup(keyup);

        if (mobileAndTouch) {
            $(document).click(function (event) {
                var n = event.target.nodeName.toLowerCase();
                return event.button !== 0 || n === 'a' || n === 'select' || n === 'button' || n === 'option' ? true : next();
            });
        } else {
            $(document).click(function (event) {
                // non-mobile browsers: only a left-mouse-click in the header jumps to the next page
                var header = $('div#header').get(0);
                return event.button === 0 && event.target === header ? next() : true;
            });
        }

        if (typeof hammer !== 'undefined') {
            var bodyElt = $('body').get(0);
            hammer(bodyElt).on('swipeleft', next);
            hammer(bodyElt).on('swiperight', previous);
        }

        $(window).resize(rescale);
        checkHash();

        // hgoebl begin
        $(document).bind('jump-sub', function (e, data) {
            if (data.eventCreator !== eventCreator) {
                jump(data.slide, data.backward, data.immediately, true);
            }
        });
        // hgoebl end

        pageLoaded();
    }

    $(init);

})(jQuery, Hammer, window, document);
