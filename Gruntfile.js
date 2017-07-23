module.exports = function(grunt){

  require('time-grunt')(grunt);

  var projectName = 'ROOSTR';
  var projectNameLC = projectName.toLowerCase();

  var port      = 3007;
  var host      = 'localhost';

  var srcDir    = 'src/';
  var distDir   = 'dist/';
  var webDir    = 'website/';
  var publicDir = webDir + 'public/';
  var nodeDir   = 'node_modules/';
  var docDir    = 'doc/';
  var zipDir    = 'zip/';

  //var src       = [ srcDir + projectNameLC + '.js'
  //                ];

  var banner    = '/** MIT License\n' +
    '* \n' +
    '* Copyright (c) 2015 Ludovic CLUBER \n' +
    '* \n' +
    '* Permission is hereby granted, free of charge, to any person obtaining a copy\n' +
    '* of this software and associated documentation files (the "Software"), to deal\n' +
    '* in the Software without restriction, including without limitation the rights\n' +
    '* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n' +
    '* copies of the Software, and to permit persons to whom the Software is\n' +
    '* furnished to do so, subject to the following conditions:\n' +
    '*\n' +
    '* The above copyright notice and this permission notice shall be included in all\n' +
    '* copies or substantial portions of the Software.\n' +
    '*\n' +
    '* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n' +
    '* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n' +
    '* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n' +
    '* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n' +
    '* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n' +
    '* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\n' +
    '* SOFTWARE.\n' +
    '*\n' +
    '* http://' + projectNameLC + 'js.lcluber.com\n' +
    '*/\n';

  //i18n configuration for static website translations
  var i18n = require('i18next');
  i18n.init({
    lng: 'en',
    resources: {
      en: {
        translation: grunt.file.readJSON( webDir + 'locales/en/translation.json' )
      }
    }
  });
  grunt.option('stack', true);
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      lib:{
        src: [  distDir + '*',
                docDir  + '*',
              ]
      },
      web:{
        src: [  zipDir + '*',
                webDir + 'static/*',
                webDir + 'sass/build/*',
        ]
      },
      public: {
        src: [  publicDir + 'js/*',
                publicDir + 'css/*',
                publicDir + 'fonts/*'
        ]
      }
    },
    jshint: {
      options: {
        jshintrc: 'config/.jshintrc'
      },
      lib: [ 'Gruntfile.js', srcDir + '**/*.js'],
      web: [ webDir + 'js/*.js'],
    },
    sass: {
      dist: {
        options: {
          trace:true
        },
        files: [{
          expand: true,
          cwd: webDir + 'sass/',
          src: ['*.scss'],
          dest: webDir + 'sass/build/',
          ext: '.css'
        }]
      }
    },
    csslint: {
      dist: {
        options: {
          import: false
        },
        src: [webDir + 'sass/build/**/*.css']
      }
    },
    cssmin:{
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: [{
          src: webDir  + 'sass/build/**/*.css',
          dest: publicDir + 'css/style.min.css'
        }]
      }
    },
    jsdoc: {
      dist : {
        src: distDir + projectNameLC + '.js',
        config: 'config/jsdoc-conf.json'
      }
    },
    pug: {
      compile: {
        options: {
          namespace   : 'JST',
          separator   : '\n\n',
          amd         : false,
          client      : false,
          pretty      : true,
          self        : false,
          debug       : false,
          compileDebug: true,
          data: function() {
            return {
              t: i18n.t.bind(i18n)
            };
          }
        },
        files: [ {
          cwd: webDir + 'views',
          src: ['**/*.pug', '!**/_*.pug'],
          dest: webDir + 'static',
          expand: true,
          ext: '.htm'
        } ]
      }
    },
    htmlmin: {
      static: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        expand: true,
        cwd: webDir + 'static',
        src: ['**/*.htm'],
        dest: webDir + 'static/'
      }
    },
    rollup: {
      options: {
        format:'umd',
        moduleName: projectName
      },
      bundle:{
        files: [ {
          src : srcDir + projectNameLC + '.js', 
          dest : distDir + projectNameLC + '.js' 
        } ]
      }
    },
    bower_concat: {
      all: {
        dest: {
          'js': webDir + 'js/build/bower.js'
          //'css': 'build/_bower.css'
        },
        exclude: [
        ],
        dependencies: {
        },
        bowerOptions: {
          relative: false
        }
      }
    },
    uglify: {
      lib: {
        options: {
          beautify: true,
          banner: banner,
          mangle: false,
          compress:false,
        },
        src: distDir + projectNameLC + '.js',
        dest: distDir + projectNameLC + '.js'
      },
      libmin: {
        options: {
          sourceMap: false,
          sourceMapName: srcDir + 'sourcemap.map',
          banner: banner,
          mangle: {
            reserved: [projectName]
          },
          compress: {
            sequences: true,
            properties: true,
            dead_code: true,
            unsafe: false,
            conditionals:true,
            comparisons:true,
            booleans:true,
            loops:true,
            unused: true,
            hoist_funs:true,
            if_return:true,
            join_vars:true,
            cascade:true,
            warnings: true,
            drop_console: true,
            keep_fargs: false,
            keep_fnames: false
          }
        },
        src: distDir + projectNameLC + '.js',
        dest: distDir + projectNameLC + '.min.js'
      },
      web: {
        options: {
          sourceMap: false,
          sourceMapName: srcDir + 'sourcemap.map',
          banner: '',
          mangle: {
            reserved: ['jQuery']
          },
          compress: {
            sequences: true,
            properties: true,
            dead_code: true,
            unsafe: false,
            conditionals:true,
            comparisons:true,
            booleans:true,
            loops:true,
            unused: true,
            hoist_funs:true,
            if_return:true,
            join_vars:true,
            cascade:true,
            warnings: true,
            drop_console: false,
            keep_fargs: false,
            keep_fnames: false
          }
        },
        files: [{
          src  : [
            nodeDir + 'jquery-easing/jquery.easing.1.3.js',
            webDir + 'js/**/*.js'
          ],
          dest : publicDir + 'js/main.min.js'
        }]
      }
    },
    concat:{
      webjs: {
        options: {
          separator: '',
          stripBanners: true,
          banner: ''
        },
        src: [  nodeDir   + 'jquery/dist/jquery.min.js',
                nodeDir   + 'bootstrap/dist/js/bootstrap.min.js',
                distDir   + projectNameLC + '.min.js',
                publicDir + 'js/main.min.js'
            ],
        dest: publicDir + 'js/main.min.js'
      },
      webcss: {
        options: {
          separator: '',
          stripBanners: true,
          banner: ''
        },
        src: [nodeDir + 'font-awesome/css/font-awesome.min.css',
              nodeDir + 'bootstrap/dist/css/bootstrap.min.css',
              publicDir + 'css/style.min.css'
            ],
        dest: publicDir + 'css/style.min.css'
      }
    },
    symlink: {
      options: {
        overwrite: false,
        force: false
      },
      fonts:{
        expand: true,
        cwd: nodeDir + 'bootstrap/dist/',
        src: ['fonts/**/*'],
        dest: publicDir,
        filter: 'isFile'
      },
      fontAwesome:{
        expand: true,
        cwd: nodeDir + 'font-awesome/',
        src: ['fonts/**/*'],
        dest: publicDir,
        filter: 'isFile'
      },
      public: {
        expand: true,
        cwd: publicDir,
        src: ['**/*'],
        dest: webDir + 'static/public/'
      },
      doc: {
        expand: true,
        cwd: docDir,
        src: ['**/*'],
        dest: webDir + 'static/' + docDir
      }
    },
    compress: {
      main: {
        options: {
          archive: zipDir + projectNameLC + 'js.zip'
        },
        files: [
          {expand: true, cwd: webDir + 'static/', src: '**', dest: '/'},
          {expand: true, cwd: publicDir, src: '**', dest: '/public'},
          {src: [ distDir + '**',
                  docDir + '**',
                  'LICENCE.md',
                  'README.md',
                  'RELEASE_NOTES.md'
                ],
                dest: '/', filter: 'isFile'}
        ]
      }
    },
    nodemon: {
      dev: {
        script: 'bin/www',
        options: {
          //nodeArgs: ['--debug'],
          delay:1000,
          watch: ['website/routes', 'website/app.js'],
          ext: 'js,scss'
        }
      }
    },
    open: {
      all: {
        path: 'http://' + host + ':' + port
      }
    },
    watch: {
      lib: {
        files: srcDir + '**/*.js',
        tasks: ['dist'],  
      },
      webpug:{
        files: webDir + 'views/**/*.pug'
      },
      webjs: {
        files: webDir + 'js/**/*.js',
        tasks: ['website'],
      },
      webcss: {
        files: webDir + 'sass/**/*.scss',
        tasks: ['website'],
      },
      options: {
        interrupt: true,
        spawn: false,
        livereload: true,
        livereloadOnError:false
      }
    },
    // run watch and nodemon at the same time
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      tasks: [ 'nodemon', 'watch', 'open' ]
    }
  });

  grunt.loadNpmTasks( 'grunt-bower-concat' );
  grunt.loadNpmTasks( 'grunt-contrib-clean' );
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.loadNpmTasks( 'grunt-contrib-csslint' );
  grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
  grunt.loadNpmTasks( 'grunt-contrib-concat' );
  grunt.loadNpmTasks( 'grunt-contrib-pug' );
  grunt.loadNpmTasks( 'grunt-contrib-sass' );
  grunt.loadNpmTasks( 'grunt-contrib-htmlmin' );
  grunt.loadNpmTasks( 'grunt-contrib-symlink' );
  grunt.loadNpmTasks( 'grunt-contrib-compress' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.loadNpmTasks( 'grunt-jsdoc' );
  grunt.loadNpmTasks( 'grunt-concurrent' );
  grunt.loadNpmTasks( 'grunt-nodemon' );
  grunt.loadNpmTasks( 'grunt-open' );
  grunt.loadNpmTasks( 'grunt-rollup' );

  grunt.registerTask( 'lib',
                      'build the library in the dist/ folder',
                      [ 'jshint:lib',
                        'clean:lib',
                        'rollup',
                        'bower_concat',
                        'jsdoc',
                        'uglify:libmin', 'uglify:lib'
                      ]
                    );

  grunt.registerTask( 'doc',
                      'build jsdoc in the doc/ folder',
                      [ 'jsdoc' ]
                    );

  // grunt.registerTask( 'static',
  //                     'build static version of the website into /website/static',
  //                     [ 'pug',
  //                       'htmlmin',
  //                       'symlink:fonts', 'symlink:fontAwesome', 'symlink:public', 'symlink:doc'
  //                     ]
  //                   );
                    
  // grunt.registerTask( 'zip',
  //                     'create the zip package',
  //                     ['compress']
  //                   );

  grunt.registerTask( 'serve',
                      'launch server, open website and watch for changes',
                      [ 'concurrent' ]
                    );

  grunt.registerTask( 'website',
                      'build the website in the website/ folder',
                      [ 'jshint:web',
                        'clean:public', 'clean:web',
                        //js
                          'uglify:web',
                          'concat:webjs', 
                        //css
                          'sass',
                          'cssmin',
                          'symlink:fonts', 'symlink:fontAwesome',
                          'concat:webcss',
                        //static
                          'pug',
                          'htmlmin',
                          'symlink:public', 'symlink:doc',
                          'compress'
                      ]
                    );

  grunt.registerTask( 'dist',
                      'build library and website',
                      function() {
                        //build lib
                        grunt.task.run('lib');
                        //build site
                        grunt.task.run('website');
                      }
                    );

  grunt.registerTask( 'default',
                      'build library, website, launch server, open website and watch for changes.',
                      function() {
                        //build library and website
                        grunt.task.run('dist');
                        // launch server and watch for changes
                        grunt.task.run('serve');
                      }
                    );

};
