module.exports = function(grunt)
{
    grunt.template.addDelimiters('handlebars-like-delimiters', '{{', '}}');

    var grunt_config =
    {
        pkg : grunt.file.readJSON('package.json'),

        watch:
        {
            css:
            {
                files: ['./css/**/*.styl'],
                tasks: ['stylus']
            },

            js:
            {
                files: ['./js/**/*.js'],
                tasks: ['concat:dev']
            }
        },

        stylus:
        {
            compile:
            {
                options:
                {
                    compress:true,
                    paths: [],
                    relativeDest: '../app/public/css',
                    use:[],
                    import: []
                },

                files: {
                'style.css': './css/*.styl',
                }
            }
        },

        concat:
        {
            options:
            {
                separator: ';',
            },

            dist:
            {
                src: [
                    './js/libs/*.js',
                    './js/plugins/*.js',
                    './js/controllers/*.js',
                    './js/views/*.js',
                    './js/*.js'
                ],
                dest: './temp.js',
            },
            dev:
            {
                src: [
                    './js/libs/*.js',
                    './js/plugins/*.js',
                    './js/controllers/*.js',
                    './js/views/*.js',
                    './js/*.js'
                ],
                dest: '../app/public/js/scripts.js',
            }
        },

        uglify:
        {
            all:
            {
                files:
                {
                    '../app/public/js/scripts.js' : ['./temp.js']
                }
            }
        }
    };

    grunt.initConfig(grunt_config);

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('dev', ['stylus' , 'concat:dev', 'watch']);
    grunt.registerTask('prod', ['stylus' , 'concat:dist', 'uglify']);
};
