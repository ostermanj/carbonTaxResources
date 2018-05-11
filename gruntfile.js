module.exports = function(grunt){
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
       
        htmlhint: {
            index: {
                options: {
                    'tag-pair': true,
                    'tagname-lowercase': true,
                    'attr-lowercase': true,
                    'attr-value-double-quotes': true,
                    'doctype-first': false,
                    'spec-char-escape': true,
                    'id-unique': true,
                    'attr-no-duplication': true,
                    'tag-self-close': true,
                    'style-disabled': true
                },
                src: ['index.php']
            }
        },
        jshint: {
            options: {
                
              curly: true,
              eqeqeq: true,
              esversion: 6,
              eqnull: true,
              browser: true,
              devel: true,
              globals: {
                d3:true
              },
              undef: true,
              unused: true
            },
            files: {
                src: ['dev-js/scripts.es6']
            }

        },
        browserify: {
            dist: {
                files: {
                    // destination for transpiled js : source js
                    'js/scripts.js': 'dev-js/scripts.es6'
                },
                options: {
                    transform: [['babelify', { presets: "env" }]],
                    browserifyOptions: {
                        debug: true
                    }
                }
            }
        },
        uglify: {
            options: {
              mangle: {
                except: []
              }
            },
            min: {
                files: grunt.file.expandMapping(['js/**/*.js'], 'js/min/', {
                    rename: function(destBase, destPath) {
                        return destBase+destPath.replace('.js', '.min.js');
                    }
                }),
                options: {
                    sourcemap: 'auto'
                }
            }
        },
        sass: {
            build: {
                files: grunt.file.expandMapping(['dev-css/*.scss'], '', {
                    rename: function(destBase, destPath) {
                        return destBase+destPath.replace('.scss', '.css');
                    }
                })
            }
        },
        cssmin: {
            build: {
                files: [{
                  expand: true,
                  cwd: 'css',
                  src: ['css/prefixed/*.css', '!*.min.css'],
                  dest: 'css/min',
                  ext: '.min.css'
                }]
            }
        },
        watch: {
            html: {
                files: ['*.html','*.php'],
                tasks: ['htmlhint']
            },
            js: {
                files: ['dev-js/*.es6'],
                tasks: ['jshint','browserify']
            },
            scss: {
                files: ['dev-css/*.scss'], 
                tasks: ['sass']
            }
        },
        
        postcss: {
            options: {
                 processors: [require('autoprefixer')({browsers:['>1%','last 2 versions']})]
            },
            dist: {
                 src: 'dev-css/styles.css',
                dest: 'css/styles.css'
            }
        }
    });

    grunt.registerTask('default', []);

};