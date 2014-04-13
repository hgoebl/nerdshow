'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        // Project metadata
        pkg: grunt.file.readJSON('package.json'),
        ghPagesDir: '../nerdshow@gh-pages',
        ghRuntimeDir: '<%= ghPagesDir %>/rt/<%= pkg.version %>',

        jshint: {
            all: [
                'Gruntfile.js',
                // client
                'lib/server/htdocs/s5/ui/common/s5.js',
                'lib/server/htdocs/rc/remote.js',
                // server
                'lib/server.js',
                'lib/generator/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        run: {
            "generate-examples-about": {
                args: [
                    'bin/nerdshow-generate',
                    'examples/about/presentation.json'
                ]
            },
            "generate-gh-pages-about": {
                args: [
                    'bin/nerdshow-generate',
                    'examples/about/presentation.json',
                    '--nerdshow-folder', 'rt/<%= pkg.version %>',
                    '--no-socketio-enabled',
                    '--no-zoom-enabled'
                ]
            }
        },

        copy: {
            "gh-pages": {
                files: [
                    {   // runtime
                        expand: true,
                        cwd: 'lib/server/htdocs',
                        src: ['**'],
                        dest: '<%= ghRuntimeDir %>/'
                    },
                    {   // examples
                        expand: true,
                        cwd: 'examples/about',
                        src: ['**', '!*.md'],
                        dest: '<%= ghPagesDir %>/'
                    }
                ]
            }
        },

        clean: {
            "gh-pages-runtime": {
                options: {
                    force: true
                },
                src: ['<%= ghRuntimeDir %>']
            }
        }
    });

    // Load npm plugins to provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-run');

    // Default tasks to be run.
    grunt.registerTask('default', ['jshint']);

    grunt.registerTask('gh-pages', [
        'clean:gh-pages-runtime',
        'run:generate-gh-pages-about',
        'copy:gh-pages',
        'run:generate-examples-about'
    ]);

};
