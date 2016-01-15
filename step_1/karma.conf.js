'use strict';
// karma.conf.js
module.exports = function(config) {
    config.set({
        frameworks: ['jasmine-ajax', 'jasmine'],
        reporters: ['spec'],
        browsers: ['PhantomJS'],
        files: [
            'src/js/**/*.js',
            'spec/tests/*.js', {
                pattern: 'spec/fixtures/*.json',
                served: true,
                included: false
            }
        ],
        proxies: {
            '/spec/fixtures/': '/base/spec/fixtures/'
        }

    });
};
