'use strict';

var shoovWebdrivercss = require('shoov-webdrivercss');
var request = require('request');

// This can be executed by passing the environment argument like this:
// PROVIDER_PREFIX=browserstack SELECTED_CAPS=chrome mocha
// PROVIDER_PREFIX=browserstack SELECTED_CAPS=ie11 mocha
// PROVIDER_PREFIX=browserstack SELECTED_CAPS=iphone5 mocha

var capsConfig = {
  'chrome': {
    'browser' : 'Chrome',
    'browser_version' : '42.0',
    'os' : 'OS X',
    'os_version' : 'Yosemite',
    'resolution' : '1024x768'
  },
  'ie11': {
    'browser' : 'IE',
    'browser_version' : '11.0',
    'os' : 'Windows',
    'os_version' : '7',
    'resolution' : '1024x768'
  },
  'iphone5': {
    'browser' : 'Chrome',
    'browser_version' : '42.0',
    'os' : 'OS X',
    'os_version' : 'Yosemite',
    'chromeOptions': {
      'mobileEmulation': {
        'deviceName': 'Apple iPhone 5'
      }
    }
  }
};

var selectedCaps = process.env.SELECTED_CAPS || undefined;
var caps = selectedCaps ? capsConfig[selectedCaps] : undefined;

var providerPrefix = process.env.PROVIDER_PREFIX ? process.env.PROVIDER_PREFIX + '-' : '';
var testName = selectedCaps ? providerPrefix + selectedCaps : providerPrefix + 'default';

var baseUrl = process.env.BASE_URL ? process.env.BASE_URL : 'http://yoursite.me';

var resultsCallback = process.env.DEBUG ? console.log : shoovWebdrivercss.processResults;

describe('Homepage', function() {

  this.timeout(99999999);
  var client = {};

  before(function(done){
    client = shoovWebdrivercss.before(done, caps, {
      screenshotRoot: 'homepage'
    });
  });

  after(function(done) {
    shoovWebdrivercss.after(done);
  });

  it('should show the home page',function(done) {
    client
      .url(baseUrl)
      .webdrivercss(testName + 'home#page', {
        name: '1',
        exclude: [],
        remove: [],
        hide: [],
        screenWidth: selectedCaps == 'chrome' ? [640, 900, 1200] : undefined,
      }, resultsCallback)
      .call(done);
  });

  it('should show the home page after login',function(done) {
    client
      .url(baseUrl + '/user')
      .setValue('#user-login #edit-name', 'ADMIN')
      .setValue('#user-login #edit-pass', 'XXXXX')
      .click('#user-login #edit-submit')
      .then(function(res) {
        client
          .url(baseUrl + '/manager-content')
          .webdrivercss(testName + 'login-home#page', {
            name: '1',
            exclude: [],
            remove: [],
            hide: [],
            screenWidth: selectedCaps == 'chrome' ? [600, 1200] : undefined,
          }, resultsCallback)
          .call(done);
      });
  });

});

describe('User', function() {

  this.timeout(99999999);
  var client = {};

  before(function(done){
    client = shoovWebdrivercss.before(done, caps, {
      screenshotRoot: 'user'
    });

  });

  after(function(done) {
    shoovWebdrivercss.after(done);
  });

  it('should show the login page',function(done) {
    client
      .url(baseUrl + '/user')
      .webdrivercss(testName + 'user#page', {
        name: '2',
        exclude: [],
        remove: [],
        hide: [],
        screenWidth: selectedCaps == 'chrome' ? [1200] : undefined,
      }, resultsCallback)
      .call(done);
  });
});
