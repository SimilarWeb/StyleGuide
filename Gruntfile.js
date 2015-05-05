module.exports = function (grunt) {


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        app: {
            bower: 'bower_components',
            cssDir: 'dist',
            cssFile: 'dist/main.css',
            scss: 'dev/*.sccs',
            js: 'scripts/*.js',
            html: '*.html'
        },
        
        sass: {
            dev: {
                options: {
                    style: 'expanded',
                    lineNumbers: true,
                    sourcemap: 'none',
                    update: true
                },
                files: {
                  'public/css/style.css': 'source/css/style.scss'
                }
            },
            release: {
                options: {
                    style: 'compressed',
                    sourcemap: 'inline'
                },
                files: {
                  'public/dist/main.css': 'source/css/sw-primer.scss'
                }
            }
        },

        clean: {
            options: {
                force: true
            },
            all: ['public/dist/style.*']
         
        },

        auto_install: {
            local: {}
        },
        gitadd: {
            task: {
              options: {
                force: true
              },
              files: {
                //src: ['dist/*.css','dev/*.scss', 'css/*.css','*.html']
                src: ['public','source']
              }
            }
          },
        gitcheckout: {
            //default - master
            master: {
              options: {
                branch: 'master'
              }
            },
            //GitHub Pages
            ghpages: {
              options: {
                branch: 'gh-pages'
              }
            }
          },      
        bump: {
            options: {
              files: ["bower.json"],
              updateConfigs: [],
              commit: true,
              commitMessage: 'Release v%VERSION%',
              commitFiles: ['-a'],
              createTag: true,
              tagName: 'v%VERSION%',
              tagMessage: 'Version %VERSION%',
              push: true,
              pushTo: 'origin',
              gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
              globalReplace: false,
              prereleaseName: false,
              regExp: false
            }
          },
      //integration with PatternLab
        shell: {
          patternlab: {
            command: "php core/builder.php -gp"
          }
        },
        watch: {
            options: {
                spawn: true,
                interrupt: true
            },

            styles: {
                files: ['source/css/scss/**/*.scss', 'source/css/scss/vendor/**/*.scss', 'source/css/scss/*.scss'],
                tasks: ['sass:dev']
            },

            html: {
              files: ['source/_patterns/**/*.mustache', 'source/_patterns/**/*.json', 'source/_data/*.json'],
              tasks: ['shell:patternlab'],
              options: {
                spawn: false
              }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-auto-install');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('default', ['auto_install', 'sass:dev', 'watch']);
    grunt.registerTask('release', ['clean:all', 'sass:release']);
    grunt.registerTask('public', ['sass:dev', 'shell:patternlab'] );

    grunt.registerTask('push',['gitcheckout:master','release', 'gitadd', 'bump']);
    grunt.registerTask('gh-pages',['gitcheckout:ghpages','release', 'gitadd', 'bump']);
};