'use strict';
// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    reporters: ['spec'],
    browsers: ['PhantomJS'],
    files: [
      'src/js/**/*.js',
      'tests/*.js'
    ]
  });
};