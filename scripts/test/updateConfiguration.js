'use strict';
process.env.NODE_ENV = 'test';

var updateConfiguration = require('../updateConfiguration');
var tu = require('./test-utils');

var assert = require('assert');

var path = require('path');
var fs = require('fs');

var assetsDirectory = path.join(__dirname, 'assets');
var workingDirectory = path.join(__dirname, 'tmp');

function initializeContext(ctx) {
  if (!ctx) {
    ctx = {};
  }

  var requireCordovaModule = ctx.requireCordovaModule;

  ctx.requireCordovaModule = function(moduleName) {
    if (!moduleName) {
      if (requireCordovaModule) {
        return requireCordovaModule(moduleName);
      }
      else {
        return;
      }
    }

    if (moduleName === 'q') {
      return require('q');
    }

    if (moduleName === 'cordova-lib/src/cordova/util') {
      return require('cordova-lib/src/cordova/util');
    }

    if (moduleName === 'cordova-lib/src/configparser/ConfigParser') {
      return require('cordova-lib/src/configparser/ConfigParser');
    }

    if (moduleName === 'cordova-lib/node_modules/elementtree') {
      return require('cordova-lib/node_modules/elementtree');
    }

    if (requireCordovaModule) {
      return requireCordovaModule(moduleName);
    }
  };

  return ctx;
}

describe('updateConfiguration.js', function (){
  beforeEach(function () {
    tu.copyRecursiveSync(assetsDirectory, workingDirectory);
  });

  it('Should update name with short_name value from manifest.json', function (done){
    var testDir = path.join(workingDirectory, 'normalFlow');
    var configXML = path.join(testDir, 'config.xml');
    var ctx = {
                opts : {
                  projectRoot : testDir
                }
              };
    initializeContext(ctx);

    updateConfiguration(ctx).then(function() {
      var content = fs.readFileSync(configXML).toString();
      assert(content.indexOf('<name>WAT Docs</name>') > -1);
      
      done();
    });
  });

  it('Should update name with name value from manifest.json if short_name is missing', function (done){
    var testDir = path.join(workingDirectory, 'shortNameMissing');
    var configXML = path.join(testDir, 'config.xml');
    var ctx = {
                opts : {
                  projectRoot : testDir
                }
              };
    initializeContext(ctx);

    updateConfiguration(ctx).then(function() {
      var content = fs.readFileSync(configXML).toString();
      assert(content.indexOf('<name>WAT Documentation</name>') > -1);
      
      done();
    });
  });
  
  it('Should ignore slashes when updating name from manifest.json', function (done) {
    var testDir = path.join(workingDirectory, 'shortNameWithSlashes');
    var configXML = path.join(testDir, 'config.xml');
    var ctx = {
                opts : {
                  projectRoot : testDir
                }
              };
    initializeContext(ctx);

    updateConfiguration(ctx).then(function () {
      var content = fs.readFileSync(configXML).toString();
      assert(content.indexOf('<name>WAT Docs</name>') > -1);
      
      done();
    });
  });

  it('Should not update name if it is missing in manifest.json', function (done) {
    var testDir = path.join(workingDirectory, 'jsonEmpty');
    var configXML = path.join(testDir, 'config.xml');
    var ctx = {
                opts : {
                  projectRoot : testDir
                }
              };
    initializeContext(ctx);

    updateConfiguration(ctx).then(function () {
      var content = fs.readFileSync(configXML).toString();
      assert(content.indexOf('<name>HelloWorld</name>') > -1);
      
      done();
    });
  });

  it('Should add name if XML element is missing', function (done){
    var testDir = path.join(workingDirectory, 'xmlEmptyWidget');
    var configXML = path.join(testDir, 'config.xml');
    var ctx = {
                opts : {
                  projectRoot : testDir
                }
              };
    initializeContext(ctx);

    updateConfiguration(ctx).then(function () {
      var content = fs.readFileSync(configXML).toString();
      assert(content.indexOf('<name>WAT Documentation</name>') > content.indexOf('<widget id="com.example.hello" version="0.0.1">'));
      assert(content.indexOf('<name>WAT Documentation</name>') < content.indexOf('</widget>'));
      done();
    });
  });

 
  it('Should update orientation with value from manifest.json', function (done){
    var testDir = path.join(workingDirectory, 'normalFlow');
    var configXML = path.join(testDir, 'config.xml');
    var ctx = {
                opts : {
                  projectRoot : testDir
                }
              };
    initializeContext(ctx);

    updateConfiguration(ctx).then(function () {
      var content = fs.readFileSync(configXML).toString();
      assert(content.indexOf('<preference name="Orientation" value="landscape" />') > -1);
      
      done();
    });


  });

  it('Should not update orientation if it is missing in manifest.json', function (done){
    var testDir = path.join(workingDirectory, 'jsonEmpty');
    var configXML = path.join(testDir, 'config.xml');
    var ctx = {
                opts : {
                  projectRoot : testDir
                }
              };
    initializeContext(ctx);

    updateConfiguration(ctx).then(function () {
      var content = fs.readFileSync(configXML).toString();
      assert(content.indexOf('<preference name="Orientation" value="default" />') > content.indexOf('<widget id="com.example.hello" version="0.0.1">'));
      assert(content.indexOf('<preference name="Orientation" value="default" />') < content.indexOf('</widget>'));
      
      done();
    });
  });

  it('Should add orientation if XML element element is missing', function (done){
    var testDir = path.join(workingDirectory, 'xmlEmptyWidget');
    var configXML = path.join(testDir, 'config.xml');
    var ctx = {
                opts : {
                  projectRoot : testDir
                }
              };
    initializeContext(ctx);

    updateConfiguration(ctx).then(function () {
      var content = fs.readFileSync(configXML).toString();
      assert(content.indexOf('<preference name="Orientation" value="landscape" />') > content.indexOf('<widget id="com.example.hello" version="0.0.1">'));
      assert(content.indexOf('<preference name="Orientation" value="landscape" />') < content.indexOf('</widget>'));
      
      done();
    });
  });

  it('Should update fullscreen with value from manifest.json', function (done){
    var testDir = path.join(workingDirectory, 'normalFlow');
    var configXML = path.join(testDir, 'config.xml');
    var ctx = {
                opts : {
                  projectRoot : testDir
                }
              };
    initializeContext(ctx);

    updateConfiguration(ctx).then(function () {
      var content = fs.readFileSync(configXML).toString();
      assert(content.indexOf('<preference name="Fullscreen" value="true" />') > -1);    
    
      done();
    });
  });

  it('Should not update fullscreen if it is missing in manifest.json', function (done){
    var testDir = path.join(workingDirectory, 'jsonEmpty');
    var configXML = path.join(testDir, 'config.xml');
    var ctx = {
                opts : {
                  projectRoot : testDir
                }
              };
    initializeContext(ctx);

    updateConfiguration(ctx).then(function () {
      var content = fs.readFileSync(configXML).toString();
      assert(content.indexOf('<preference name="Fullscreen" value="true" />') > -1);
    
      done();
    });
  });

  it('Should add fullscreen if XML element is missing', function (done){
    var testDir = path.join(workingDirectory, 'xmlEmptyWidget');
    var configXML = path.join(testDir, 'config.xml');
    var ctx = {
                opts : {
                  projectRoot : testDir
                }
              };
    initializeContext(ctx);

    updateConfiguration(ctx).then(function () {
      var content = fs.readFileSync(configXML).toString();
      assert(content.indexOf('<preference name="Fullscreen" value="true" />') > content.indexOf('<widget id="com.example.hello" version="0.0.1">'));
      assert(content.indexOf('<preference name="Fullscreen" value="true" />') < content.indexOf('</widget>'));
    
      done();
    });
  });

  it('Should keep existing access rules unchanged in config.xml', function (done){
    var testDir = path.join(workingDirectory, 'jsonEmpty');
    var configXML = path.join(testDir, 'config.xml');
    var ctx = {
                opts : {
                  projectRoot : testDir
                }
              };
    initializeContext(ctx);

    updateConfiguration(ctx).then(function () {
      var content = fs.readFileSync(configXML).toString();
      assert(content.indexOf('<allow-navigation href="general-navigation-rule" />') > -1);        
      assert(content.indexOf('<allow-intent href="general-intent-rule" />') > -1); 
      assert(content.indexOf('<access origin="ios-access-rule" />') > -1); 
               
      done();
    });
  });

  it('Should remove "root" full access rules from config.xml', function (done){
    var testDir = path.join(workingDirectory, 'fullAccessRules');
    var configXML = path.join(testDir, 'config.xml');
    var ctx = {
                opts : {
                  projectRoot : testDir
                }
              };
    initializeContext(ctx);

    updateConfiguration(ctx).then(function () {
      var content = fs.readFileSync(configXML).toString();
      assert(content.indexOf('<allow-navigation href="http://*/*\" />') === -1);
      assert(content.indexOf('<allow-navigation href="https://*/*\" />') === -1);
      assert(content.indexOf('<allow-navigation href="*" />') === -1);
      assert(content.indexOf('<allow-intent href="https://*/*\" />') === -1);
      assert(content.indexOf('<allow-intent href="http://*/*\" />') === -1);
      assert(content.indexOf('<allow-intent href="*" />') === -1);
      assert(content.indexOf('<access origin="https://*/*\" />') === -1);
      assert(content.indexOf('<access origin="http://*/*\" />') === -1);
      
      done();
    });
  });

  it('Should add full access network request whitelist rule for android in config.xml', function (done){
    var testDir = path.join(workingDirectory, 'normalFlow');
    var configXML = path.join(testDir, 'config.xml');
    var ctx = {
                opts : {
                  projectRoot : testDir
                }
              };
    initializeContext(ctx);

    updateConfiguration(ctx).then(function () {
      var content = fs.readFileSync(configXML).toString();
      assert(content.replace(/[\t\r\n\s]/g, '').indexOf('<platformname="android"><accesshap-rule="yes"origin="*"/></platform>') > -1);
      
      done();
    });
  });

  it('Should add access rules for web site domain in config.xml', function (done){
    var testDir = path.join(workingDirectory, 'normalFlow');
    var configXML = path.join(testDir, 'config.xml');
    var ctx = {
                opts : {
                  projectRoot : testDir
                }
              };
    initializeContext(ctx);

    updateConfiguration(ctx).then(function () {
      var content = fs.readFileSync(configXML).toString();
      assert(content.indexOf('<allow-navigation hap-rule="yes" href="http://wat-docs.azurewebsites.net/*" />') > -1);
      assert(content.replace(/[\t\r\n\s]/g, '').indexOf('<platformname="ios"><accesshap-rule="yes"origin="http://wat-docs.azurewebsites.net/*"/></platform>') > -1);
      
      done();
    });
  });

  it('Should add navigation whitelist rules from mjs_access_whitelist list and scope', function (done){
    var testDir = path.join(workingDirectory, 'xmlEmptyWidget');
    var configXML = path.join(testDir, 'config.xml');
    var ctx = {
                opts : {
                  projectRoot : testDir
                }
              };
    initializeContext(ctx);

    updateConfiguration(ctx).then(function () {
      var content = fs.readFileSync(configXML).toString();
      assert(content.indexOf('<allow-navigation hap-rule="yes" href="scope-rule" />') > -1);   
      assert(content.indexOf('<allow-navigation hap-rule="yes" href="internal-rule" />') > -1);   
    
      done();
    });
  });

  it('Should add intent whitelist rules from mjs_access_whitelist list', function (done){
    var testDir = path.join(workingDirectory, 'xmlEmptyWidget');
    var configXML = path.join(testDir, 'config.xml');
    var ctx = {
                opts : {
                  projectRoot : testDir
                }
              };
    initializeContext(ctx);

    updateConfiguration(ctx).then(function () {
      var content = fs.readFileSync(configXML).toString();
      assert(content.indexOf('<allow-intent hap-rule="yes" href="external-rule" />') > -1);   
  
      done();
    });
  });

  it('Should add access rules for ios from mjs_access_whitelist list and scope', function (done){
    var testDir = path.join(workingDirectory, 'xmlEmptyWidget');
    var configXML = path.join(testDir, 'config.xml');
    var ctx = {
                opts : {
                  projectRoot : testDir
                }
              };
    initializeContext(ctx);

    updateConfiguration(ctx).then(function () {
      var content = fs.readFileSync(configXML).toString();
      assert(content.replace(/[\t\r\n\s]/g, '').indexOf('<platformname="ios"><accesshap-rule="yes"origin="http://wat-docs.azurewebsites.net/*"/><accesshap-rule="yes"origin="internal-rule"/><accesshap-rule="yes"origin="scope-rule"/></platform>') > -1);    
      done();
    });
  });

  afterEach(function () {
    tu.deleteRecursiveSync(workingDirectory);
  });
});
