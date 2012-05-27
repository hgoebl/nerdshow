# nerdshow

Generate HTML presentations, serve presentation files and control presentation with mobile device.

 * create your presentation by editing Markdown and/or HTML snippets
 * Syntax highlighting (by now only for JavaScript)
 * remote control your presentation with your smartphone
 * share a presentation across many browser instances (on distributed PCs)

**Not for:**
 * Internet Explorer users (please use a real browser like e.g. Chrome, Safari, Firefox, ...)

## The name?

This tool will probably only be used by nerds and the presentations will be for nerds ==> nerdshow!

## Generate Presentations

 * Copy examples/empty to local folder
 * Edit presentation.json
 * add Markdown and/or html files and add them to presentation.json (slides array)
 * Markdown extension: insert raw html by placing '.' in the first column, e.g. `.</div><div class="slide">`
 * Run generator `nerdshow-generate presentation.json`
 * Run presentation `nerdshow . --debug`
 * Open a html5 browser <http://localhost:8008/>
 * Open remote control <http://localhost:8008/nerdshow/rc/remote.html>

## Usage

### Run Generator

```
Usage: nerdshow-generate <path/to/presentation.json>
```

### Run Presentation

```
Usage: nerdshow path/to/presentation [options]

Options:
  --port          TCP port of web server        [default: "8008"]
  --encoding, -e  character-set of stdin input  [default: "utf8"]
  --debug         output for easier debugging   [default: false]
  --help, -h      show help and exit
```

## Installation

You can install `nerdshow` locally or globally. This depends how much your presentations are spread across your
file system. If you put them in one location, I would install it locally, if not, then globally (add option `-g`):

    npm install nerdshow [-g]

## TODO / Bugs

  * When zooming (Ctrl+Click Source-Code) all images disappear (background + img)
  * HowTo documentation + enhance example
  * Provide a boilerplate/template for new presentation (nerdshow-create)
  * Implement/Test incremental page updates (ul/li elements coming item by item)
  * Switch to Full-Screen-Mode when presentation starts (or when pressing F5)
  * Place a loading div hiding all slides
  * Isolate different presentations delivered by the same server
  * Generate a QR-Code for the remote control URL
  * Add support for SyntaxHighlighter (from Alex Gorbatschev)
  * Output error message when used with IE <= 9
  * Write some test code
  * Generate impress.js Slides (Positioning slides along paths/patterns)
  * Provide CSS for print (showing all slides and div.class='handout'

## License

MIT (see LICENSE file)

# Credits

  * S5 Presentation `diascope` Original Source comes from [minad/diascope](https://github.com/minad/diascope)
  * JavaScript Syntax Highlighter `hijs` from [cloudhead](http://cloudhead.io/)
  * See package.json (marked, express, socket-io, optimist, mustache, jsdom)
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
  * <https://github.com/imakewebthings/deck.js>
  * <http://goessner.net/articles/slideous/slideous.html>
  * <https://github.com/hakimel/reveal.js>
