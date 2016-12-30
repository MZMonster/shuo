/*
 * Generated on 2015-12-07
 * generator-assemble v0.5.0
 * https://github.com/assemble/generator-assemble
 *
 * Copyright (c) 2015 Hariadi Hinta
 * Licensed under the MIT license.
 */

'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// '<%= config.src %>/templates/pages/{,*/}*.hbs'
// use this if you want to match all subfolders:
// '<%= config.src %>/templates/pages/**/*.hbs'

var version = require('./package.json').version;

module.exports = function(grunt) {

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({

    config: {
      src: 'src',
      dist: 'dist',
      version: version,
    },

    watch: {
      assemble: {
        files: ['<%= config.src %>/{content,data,templates,assets}/{,**/}*.{md,hbs,yml,js,css}'],
        tasks: ['assemble', 'copy:dev', 'concat']
      },
      css: {
        files: ['<%= config.src %>/assets/css/**/*.less'],
        tasks: ['less:dev']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.dist %>/{,*/}*.html',
          '<%= config.dist %>/assets/{,*/}*.css',
          '<%= config.dist %>/assets/{,*/}*.js',
          '<%= config.dist %>/assets/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '<%= config.dist %>'
          ]
        }
      }
    },

    assemble: {
      pages: {
        options: {
          flatten: true,
          assets: '<%= config.dist %>/assets',
          layout: '<%= config.src %>/templates/layouts/default.hbs',
          data: '<%= config.src %>/data/*.{json,yml}',
          partials: '<%= config.src %>/templates/partials/*.hbs'
        },
        files: {
          '<%= config.dist %>/': ['<%= config.src %>/templates/pages/*.hbs']
        }
      }
    },

    copy: {
      dev: {
        expand: true,
        cwd: 'src/assets/',
        src: '**/*.{css,js,eot,svg,ttf,woff,jpg,png,gif}',
        dest: '<%= config.dist %>/assets/'
      },
      emoji: {
        expand: true,
        cwd: 'bower_components/emoji-parser/emoji/',
        src: '**/*.{list,png}',
        dest: '<%= config.dist %>/assets/images/emoji/'
      },
      pro: {
        expand: true,
        cwd: '<%= config.dist %>/assets/',
        src: '**/*.{css,js,eot,svg,ttf,woff,jpg,png,gif}',
        dest: '<%= config.dist %>/pro/'
      },
      debug: {
        expand: true,
        cwd: '<%= config.dist %>/assets/',
        src: '**/*.{css,js,eot,svg,ttf,woff,jpg,png,gif}',
        dest: '<%= config.dist %>/debug'
      }
    },

    // Before generating any new files,
    // remove any previously-created files.
    clean: {
      base: ['<%= config.dist %>/**/*.{html,xml}',
             '<%= config.dist %>/pro/js/*.min.js',
             '<%= config.dist %>/pro/css/*.min.css'],
      build: ['<%= config.dist %>/pro/**/theme.css', '<%= config.dist %>/pro/**/jquery*.js',
              '<%= config.dist %>/debug/**/theme.css', '<%= config.dist %>/debug/**/jquery*.js',
              '<%= config.dist %>/debug/images/emoji*', '<%= config.dist %>/**/autosize.js']
    },

    mock: {
      userInfo: {
        options: {
          port: '9001',
          host: '127.0.0.1',
          route: {
            '/userInfo': {
              get : {
                //jsonp: 'callback',
                data: {
                  "is_login": 1,
                  "user": {
                    "avatar": "http://img.res.meizu.com/img/download/uc/85/27/06/80/00/8527068/w200h200",
                    "username": "EthanWu",
                    "remoteID": "e749e6bc-fa38-4c95-bdd9-6fe1f6522aee",
                    "homepage": "http://wan.meizu.com/people/N1AWDdP6"
                  },
                  "shuoCookie": {
                    "shuosession": "eyJyZW1vdGVJRCI6ImU3NDllNmJjLWZhMzgtNGM5NS1iZGQ5LTZmZTFmNjUyMmFlZSIsInRpbWVzdGFtcCI6MTQ1MDE2NzgxNjQyOCwic2lnbiI6ImZScHJtbzZhQUhCQ1lGcXJScGJPNUp5RVRkaz0ifQ==",
                    "shuoinfo": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdmF0YXIiOiJodHRwOi8vaW1nLnJlcy5tZWl6dS5jb20vaW1nL2Rvd25sb2FkL3VjLzg1LzI3LzA2LzgwLzAwLzg1MjcwNjgvdzIwMGgyMDAiLCJ1c2VybmFtZSI6IkV0aGFuV3UiLCJyZW1vdGVJRCI6ImU3NDllNmJjLWZhMzgtNGM5NS1iZGQ5LTZmZTFmNjUyMmFlZSIsImhvbWVwYWdlIjoiaHR0cDovL3dhbi5tZWl6dS5jb20vcGVvcGxlL04xQVdEZFA2IiwiaWF0IjoxNDUwMTY3ODE2fQ.lx9OWVoZ1NPtE9UChqlSdAKZS8OYKsgsEbcRv8mhMAg"
                  }
                }
              }
            },

            '/userInfo4Star': {
              get : {
                //jsonp: 'callback',
                data: {
                  "is_login": 1,
                  "user": {
                    "avatar": "http://img.res.meizu.com/img/download/uc/85/27/06/80/00/8527068/w200h200",
                    "username": "EthanWu",
                    "remoteID": "e749e6bc-fa38-4c95-bdd9-6fe1f6522aff",
                    "homepage": "http://wan.meizu.com/people/N1AWDdP6"
                  },
                  "shuoCookie": {
                    shuosession: 'eyJyZW1vdGVJRCI6ImU3NDllNmJjLWZhMzgtNGM5NS1iZGQ5LTZmZTFmNjUyMmFmZiIsInRpbWVzdGFtcCI6MTQ2NjQxNDgxOTcyMiwic2lnbiI6IlpFVkVKcUx4Z09SRTR3TnkzSld3T08vclQ5RT0ifQ==',
                    shuoinfo: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdmF0YXIiOiJodHRwOi8vaW1nLnJlcy5tZWl6dS5jb20vaW1nL2Rvd25sb2FkL3VjLzg1LzI3LzA2LzgwLzAwLzg1MjcwNjgvdzIwMGgyMDAiLCJ1c2VybmFtZSI6IkV0aGFuV3UiLCJyZW1vdGVJRCI6ImU3NDllNmJjLWZhMzgtNGM5NS1iZGQ5LTZmZTFmNjUyMmFmZiIsImhvbWVwYWdlIjoiaHR0cDovL3dhbi5tZWl6dS5jb20vcGVvcGxlL04xQVdEZFA2IiwiaWF0IjoxNDY2NDE0ODE5fQ.5FTDv24Y86uUuPjD5XmeZRTlUEYwZODXq3khjB5UztY'
                  }
                }
              }
            }
          }
        }
      }
    },

    less: {
      dev: {
        files: [
          {
            expand: true,
            cwd: 'src/assets/css/',
            src: 'shuo-default.less',
            dest: 'dist/assets/css/',
            ext: '.css'
          },
          {
            expand: true,
            cwd: 'src/assets/css/',
            src: 'shuo-new.less',
            dest: 'dist/assets/css/',
            ext: '.css'
          }
        ],
      }
    },

    concat: {
      dev: {
        files: {
          '<%= config.dist %>/assets/js/shuo.api.js': [
            '<%= config.src %>/assets/js/jquery.js',
            '<%= config.src %>/assets/js/jquery.extends.js',
            '<%= config.src %>/assets/js/autosize.js',
            '<%= config.src %>/assets/js/jquery.caret.min.js',
            '<%= config.src %>/assets/js/jquery.atwho.min.js',
            '<%= config.src %>/assets/js/shuo.api.js',
            '<%= config.src %>/assets/js/emoji-picker/nanoscroller.min.js',
            '<%= config.src %>/assets/js/emoji-picker/tether.min.js',
            '<%= config.src %>/assets/js/emoji-picker/config.js',
            '<%= config.src %>/assets/js/emoji-picker/util.js',
            '<%= config.src %>/assets/js/emoji-picker/jquery.emojiarea.js',
            '<%= config.src %>/assets/js/emoji-picker/emoji-picker.js'
          ],
          '<%= config.dist %>/assets/css/shuo-default.css': [
            '<%= config.dist %>/assets/css/emoji-picker/nanoscroller.css',
            '<%= config.dist %>/assets/css/emoji-picker/emoji.css',
            '<%= config.dist %>/assets/css/jquery.atwho.css',
            '<%= config.dist %>/assets/css/shuo-default.css'
          ],
          '<%= config.dist %>/assets/js/shuo.star.js': [
            '<%= config.src %>/assets/js/jquery.js',
            '<%= config.src %>/assets/js/shuo.react.js'
          ],
          '<%= config.dist %>/assets/js/shuo.react.js': [
            '<%= config.src %>/assets/js/jquery.js',
            '<%= config.src %>/assets/js/shuo.react.js'
          ]
        }
      }
    },

    uglify: {
      pro: {
        files: {
          '<%= config.dist %>/pro/js/shuo.api.<%= config.version %>.min.js': '<%= config.dist %>/pro/js/shuo.api.js',
          '<%= config.dist %>/pro/js/shuo.render.<%= config.version %>.min.js': '<%= config.dist %>/pro/js/shuo.render.js',
          '<%= config.dist %>/pro/js/shuo.new.<%= config.version %>.min.js': '<%= config.dist %>/pro/js/shuo.new.js',
          '<%= config.dist %>/pro/js/shuo.react.min.js': '<%= config.dist %>/pro/js/shuo.react.js',
        }
      }
    },

    cssmin: {
      compress: {
        files: {
          '<%= config.dist %>/pro/css/shuo-default.<%= config.version %>.min.css': ['<%= config.dist %>/pro/css/shuo-default.css'],
          '<%= config.dist %>/pro/css/shuo-new.<%= config.version %>.min.css': ['<%= config.dist %>/pro/css/shuo-new.css']
        }
      }
    }

  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-restful-mock');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('server', [
    'build',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('mocker', [
    'mock'
  ]);

  grunt.registerTask('base', [
    'clean:base',
    'less',
    'copy:dev',
    'copy:emoji',
    'assemble'
  ]);

  grunt.registerTask('build', [
    'base',
    'concat',
    'copy:debug',
    'copy:pro',
    'uglify',
    'cssmin',
    'clean:build'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

};
