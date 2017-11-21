var assert = require('assert');
var biiif = require('../index');

describe('Directory', function() {
    it('should find testroot directory', function() {
        biiif('testroot', 'http://test.com/testroot');
    });
});