'use strict';
// karma.conf.js
module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        reporters: ['spec'],
        browsers: ['PhantomJS'],
        files: [
            'build/js/lib.js',
            'build/js/app.js',
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
