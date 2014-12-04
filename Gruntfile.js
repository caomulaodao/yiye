'use strict';

var paths = {
  js: ['*.js', 'test/**/*.js', '!test/coverage/**', '!bower_components/**', 'packages/server/*.js', '!packages/**/node_modules/**'],
  html: ['packages/**/public/**/views/**', 'packages/**/server/views/**'],
  css: ['!bower_components/**', 'packages/**/public/**/css/*.css']
};
var qiniu_url = '"http://yiye-test.qiniudn.com'
module.exports = function(grunt) {

  if (process.env.NODE_ENV !== 'production') {
    require('time-grunt')(grunt);
  }

  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    assets: grunt.file.readJSON('config/assets.json'),
    clean: ['bower_components/build'],
    copy: {
      //remove all static files to 'static_files' folder
      static: {
        files: [
          {expand: true, src: ['bower_components/**'], dest: 'static_files', nonull: true},
          {expand: true, cwd: 'packages/bookmarks/public', src: ['**'], dest: 'static_files/bookmarks', nonull: true},
          {expand: true, cwd: 'packages/channels/public', src: ['**'], dest: 'static_files/channels', nonull: true},
          {expand: true, cwd: 'packages/home/public', src: ['**'], dest: 'static_files/home', nonull: true},
          {expand: true, cwd: 'packages/person/public', src: ['**'], dest: 'static_files/person', nonull: true},
          {expand: true, cwd: 'packages/system/public', src: ['**'], dest: 'static_files/system', nonull: true},
          {expand: true, cwd: 'packages/users/public', src: ['**'], dest: 'static_files/users', nonull: true}
        ]
      }
    },
    watch: {
      js: {
        files: paths.js,
        tasks: ['jshint','concat'],
        options: {
          livereload: true
        }
      },
      html: {
        files: paths.html,
        options: {
          livereload: true,
          interval: 500
        }
      },
      css: {
        files: paths.css,
        tasks: ['csslint','concat'],
        options: {
          livereload: true
        }
      }
    },
    jshint: {
      all: {
        src: paths.js,
        options: {
          jshintrc: true
        }
      }
    },
    uglify: {
      core: {
        options: {
          mangle: false
        },
        files: '<%= assets.core.js %>'
      }
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      src: paths.css
    },
    cssmin: {
      core: {
        files: '<%= assets.core.css %>'
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          args: [],
          ignore: ['node_modules/**'],
          ext: 'js,html',
          nodeArgs: ['--debug'],
          delayTime: 1,
          cwd: __dirname
        }
      }
    },
    concurrent: {
      tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },
    mochaTest: {
      options: {
        reporter: 'spec',
        require: [
          'server.js',
          function() {
            require('meanio/lib/util').preload(__dirname + '/packages/**/server', 'model');
          }
        ]
      },
      src: ['packages/**/server/tests/**/*.js']
    },
    env: {
      test: {
        NODE_ENV: 'test'
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    shell: {
      qrsync: {
        command: 'tasks/qrsync tasks/conf.json'
      }
    },
    replace:{
      repHTML:{
        src:['packages/*/server/views/**/*.html'],
        overwrite: true,
        replacements: [{
          from: /["']\/.+?\/assets\/img\/.+?\.(jpg|jpeg|gif|png|ico)["']/g,
          to: function (matchedWord, index, fullText, regexMatches) {
            console.log(matchedWord);
            matchedWord = matchedWord.slice(1);
            return qiniu_url+matchedWord;   //
          }
        },{
          from: /["']\/bower_components\/.+?\/.+?\.(css|js)["']/g,
          to: function (matchedWord, index, fullText, regexMatches) {
            console.log(matchedWord);
            matchedWord = matchedWord.slice(1);
            return qiniu_url+matchedWord;   //
          }
        },{
          from: /["']\/.+\/assets\/.+?\/.+?\.(css|js)["']/g,
          to: function (matchedWord, index, fullText, regexMatches) {
            console.log(matchedWord);
            matchedWord = matchedWord.slice(1);
            return qiniu_url+matchedWord;   //
          }
        }]
      },
      repCSS:{
        src:['packages/*/public/assets/css/*.css'],
        overwrite: true,
        replacements: [{
          from: /["']\/.+?\/assets\/img\/.+?\.(jpg|jpeg|gif|png|ico)["']/g,
          to: function (matchedWord, index, fullText, regexMatches) {
            console.log(matchedWord);
            matchedWord = matchedWord.slice(1);
            return qiniu_url+matchedWord;   //
          }
        }]
      }
    },
  });

  //Load NPM tasks
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-text-replace');
  //Default task(s).
  if (process.env.NODE_ENV === 'production') {
    grunt.registerTask('default', ['clean', 'cssmin', 'uglify', 'concurrent']);
  } else {
    grunt.registerTask('default', ['clean', 'jshint', 'concurrent']);
  }

  //Test task.
  grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);
  grunt.registerTask('upload', ['shell:qrsync']);
};
