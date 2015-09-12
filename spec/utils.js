'use strict';

module.exports = {
  test: function(testFunc, expect, done, showLog) {
    testFunc.then(function (res) {
      if(showLog !== undefined && showLog == true) {
        console.log(res);
      }
      expect(res).toBeDefined();
      done();
    }).catch(function (err) {
      if(showLog !== undefined && showLog == true) {
        console.log(err);
      }
      expect(err).toThrow();
      done();
    });
  }
};