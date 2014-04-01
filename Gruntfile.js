module.exports = function(grunt) {

// Project configuration.
grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  clean: {
    options:{
      force: true
    },
    files: ['./build']
  },
  copy: {
    main: {
      files: [
      { expand: true, cwd: './src/js/', src: 'schedulrapp.js', dest: './build/js/'},
      { expand: true, cwd: './src/css/', src: ['*.css', '*.png'], dest: './build/css/' },
      { expand: true, cwd: './src/css/images/', src: ['*.png', '*.jpg', '*.gif', '*.jpeg'], dest: './build/css/images/' }
      ]
    }
  },
  concat:{
    options: {
      separator: ';',
    },
    build: {
      src: ['src/js/schedulr.js', 'src/js/modules/sortable.js', 'src/js/modules/moment.min.js'],
      dest: 'src/js/schedulrapp.js'
    }

  },
  htmlmin: {
    build: {
      options: {
        removeComments: true,
        collapseWhitespace: true
      },
      files: {
        './build/index.html': './src/index.html'
      }
    }
  },
  watch: {
        scss: {
          files: ['src/css/*.scss'],
          tasks: ['default']
        },
        html: {
          files: ['src/index.html', 'src/js/schedulr.js'],
          tasks: ['default']
        }
      },
      sass: {
        build: {
          options: {
            style: 'compressed',
            precision: 8
          },
          files: {
            './src/css/schedulr.css': './src/css/schedulr.scss'
          }
        }
      }
    });

// load all grunt tasks
require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

//if you choose to use scss, or any preprocessor, you can add it here
grunt.registerTask('default', ['clean', 'sass', 'concat', 'htmlmin', 'copy']);
};