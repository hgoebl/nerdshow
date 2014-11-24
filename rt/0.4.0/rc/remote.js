/*jshint jquery:true, browser:true*/
/*globals io:false, alert:false*/
// requires: jQuery

(function (window, document, undefined) {
    'use strict';

    function Remote(options) {
        this.options = options;
        this.eventCreator = Math.round(Math.random() * Math.pow(2, 16)).toString(36);
    }

    Remote.prototype.load = function (callback) {
        var self = this,
            slidesUrl = this.options.slideShow + 'slides.json';

        // get list of slides and fill select options
        $.getJSON(slidesUrl, null, function (data, status) {
            if (status !== 'success') {
                callback('Unable to load necessary slides data.');
                return;
            }
            if (!Array.isArray(data)) {
                callback('Wrong data loaded (not an array).');
                return;
            }

            self.slides = data;

            $('#slides')
                .empty()
                .append(data.map(function (el, index) {
                    return '<option value="' + (index + 1) + '">' + el + '</option>';
                }).join(''))
                .selectmenu('refresh');

            callback(null);
        });
    };

    Remote.prototype.jump = function (slide) {
        slide = parseInt(slide, 10);
        $('#slides option')
            .eq(slide - 1).attr('selected', 'selected')
            .parent().selectmenu('refresh');
    };

    Remote.prototype.currentSlide = function () {
        return parseInt($('#slides').val(), 10);
    };

    Remote.prototype.publishJump = function () {
        var slide = this.currentSlide();
        $(document).trigger('jump-pub', {
            slide: slide,
            eventCreator: remote.eventCreator
        });
    };

    Remote.prototype.nextSlide = function () {
        var slide = this.currentSlide();
        if (slide <= this.slides.length) {
            this.jump(slide + 1);
            this.publishJump();
        }
    };

    Remote.prototype.prevSlide = function () {
        var slide = this.currentSlide();
        if (slide > 1) {
            this.jump(slide - 1);
            this.publishJump();
        }
    };

    var remote = new Remote({
        slideShow: (function (window, undefined) {
            var slideShow = window.location.search;
            return (/^\?.*$/.test(slideShow)) ? slideShow.substring(1) + '/' : '/';
        })(window)
    });

    $('#home').live('pagebeforecreate', function (/*event*/) {

        $.mobile.showPageLoadingMsg();
        remote.load(function (error) {
            $.mobile.hidePageLoadingMsg();
            if (error) {
                alert(error);
            }
        });

        $(document).ajaxError(function (event, request, settings) {
            $.mobile.hidePageLoadingMsg();
            alert('Error requesting ' + settings.url);
        });
    });

    // connect behavior to form elements
    $(function () {

        $('#slides').change(function () {
            remote.publishJump();
        });

        $('#btn-next').click(function () {
            remote.nextSlide();
        });

        $('#btn-prev').click(function () {
            remote.prevSlide();
        });

        $(document).bind('swiperight', function () {
            remote.nextSlide();
        });

        $(document).bind('swipeleft', function () {
            remote.prevSlide();
        });

        // handle incoming jump events
        $(document).bind('jump-sub', function (e, data) {
            if (data.eventCreator !== remote.eventCreator) {
                remote.jump(data.slide);
            }
        });
    });

    // activate WebSockets and translate from/to document-events
    $(function () {
        if (typeof io === 'undefined') {
            alert('socket.io not loaded -> remote control won\'t work!');
            return;
        }
        var socket = io.connect();
        socket.on('jump', function (data) {
            // console.log('remote.html -- jump event received from socket', data);
            $(document).trigger('jump-sub', data);
        });
        $(document).bind('jump-pub', function (e, data) {
            // console.log('remote.html -- jump event received from local', e, data);
            socket.emit('jump', data);
        });
    });

}(window, document));
