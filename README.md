# nerdshow

Generate HTML presentations, serve presentation files and control presentation with mobile device.

 * create your presentation by editing Markdown and/or HTML snippets
 * Syntax highlighting (by now only for JavaScript)
 * remote control your presentation with your smartphone
 * share a presentation across many browser instances (on distributed PCs)

## The name?

This tool will probably only be used by nerds and the presentations will be for nerds ==> nerdshow!

## Demo

### Slides

 * <http://hgoebl.github.io/nerdshow>
 * <http://www.goebl.com/slides/>

### Remote Control

The remote control software only works when pages are served by node.js. In this demo you can see only the
mobile application. It is not connected with a presentation.

 * <http://hgoebl.github.io/nerdshow/rt/0.4.0/rc/?/nerdshow>

## Generate Presentations

 * Copy examples/empty to local folder
 * Edit presentation.json
 * add Markdown and/or html files and add them to presentation.json (slides array)
 * Markdown extension: insert raw html by placing '.' in the first column, e.g. `.</div><div class="slide">`
 * Since v0.4.0: `<div class="slide">` are generated automatically by runtime (from `<h1>` until next `<h1>`)
 * Run generator `nerdshow-generate presentation.json`
 * Run presentation `nerdshow . --debug`
 * Open an html5 browser <http://localhost:8008/>
 * Open remote control <http://localhost:8008/nerdshow/rc/>

## Usage

### Run Generator

```
Usage: nerdshow-generate <path/to/presentation.json> [options]

Options:
  --nerdshow-folder   base url for nerdshow runtime      [default: "/nerdshow"]
  --socketio-enabled  disable socket-io for static html  [default: true]
  --hijs-enabled      highlight code as javascript       [default: true]
  --zoom-enabled      enable zoom.js (Ctrl+Click)        [default: false]
  --help, -h          show help and exit
```

To disable an option, enter `--no-<option>`, e.g. `--no-socketio-enabled`.

If you want to host a presentation on a web-server, you can save space when you
reference the nerdshow runtime-files:

  * Either hard-wired in you presentation.json file: `"nerdshow-folder": "http://hgoebl.github.io/nerdshow/rt/0.4.0"`
  * or as a command-line option: `--nerdshow-folder http://hgoebl.github.io/nerdshow/rt/0.4.0`

Be aware that github.io will not serve files over `https` so if your presentation
is served via https, this won't work.

### Run Presentation

```
Usage: nerdshow path/to/presentation [options]

Options:
  --port          TCP port of web server        [default: "8008"]
  --encoding, -e  character-set of stdin input  [default: "utf8"]
  --debug         output for easier debugging   [default: false]
  --help, -h      show help and exit
```

If you run 'nerdshow' w/out a path to a presentation folder, it will serve the examples folder: <http://localhost:8008/>

## Installation

You can install `nerdshow` locally or globally. This depends on how much your presentations are spread across your
file system. If you put them in one location, I would install it locally, if not, then globally (add option `-g`):

    npm install nerdshow [-g]

## TODO / Bugs

  * Provide a boilerplate/template for new presentation (nerdshow-create)
  * Provide CSS for print (showing all slides and div.class='handout'
  * Add support for SyntaxHighlighter (from Alex Gorbatschev)
  * Migrate generation code to [assemble](http://assemble.io/) or provide an assemble plugin
  * Provide grunt plugin (and gulp.js)
  * When zooming (Ctrl+Click Source-Code) all images disappear (background + img)
  * HowTo documentation + enhance example
  * Implement/Test incremental page updates (ul/li elements coming item by item)
  * Isolate different presentations delivered by the same server
  * Generate a QR-Code for the remote control URL
  * Output error message when used with IE <= 9
  * Write some test code
  * Generate impress.js Slides (Positioning slides along paths/patterns)

## License

MIT (see LICENSE file)

# Credits

  * S5 Presentation `diascope` Original Source comes from [minad/diascope](https://github.com/minad/diascope)
  * JavaScript Syntax Highlighter `hijs` from [cloudhead](http://cloudhead.io/)
  * See package.json (marked, express, socket-io, optimist, mote, cheerio)
  * jQuery and jQuery Mobile

## See also

Here you can find information about similar tools, the S5 format and some fancy new alternative implementations for
HTML-based slide shows:

### General / Overviews ###

  * <http://en.wikipedia.org/wiki/Web_Based_Slideshow>
  * <http://icant.co.uk/domslides/>
  * <http://www.mulberrytech.com/walkthewalk.html>

### S5 ###

  * <http://en.wikipedia.org/wiki/S5_%28file_format%29>
  * <http://www.w3.org/Talks/Tools/Slidy2/>
  * <http://www.netzgesta.de/S5/>
  * <http://meyerweb.com/eric/tools/s5/>

### Utilities / Helpers ###

  * <http://fittextjs.com/>
  * <http://eikes.github.com/jquery.fullscreen.js/>
  * <http://leeoniya.github.com/reMarked.js/>
  * <https://github.com/hakimel/zoom.js>

### Similar Tools and Utilities ###

  * <http://bartaz.github.com/impress.js/>
    * <http://www.cubewebsites.com/blog/guides/how-to-use-impress-js/>
    * <http://bartaz.github.com/meetjs/css3d-summit/#/title>
    * <http://www.andismith.com/blog/2012/01/impress-with-impress/>
    * <http://tympanus.net/codrops/2012/04/05/slideshow-with-jmpress-js>
  * <https://github.com/Seldaek/slippy>
  * <https://github.com/jtrussell/bedecked>
  * <https://github.com/imakewebthings/deck.js>
  * <http://goessner.net/articles/slideous/slideous.html>
  * <https://github.com/hakimel/reveal.js>
