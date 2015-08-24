describe("Misc", function () {
  var DockerApi = require('../index.js')
    , config = require('./config')
    , miscInstance = null;

  beforeEach(function () {
    miscInstance = new DockerApi.Misc(config.server, config.port);
  });

  it('should be able to get version', function (done) {
    var promise = miscInstance.getVersion();
    promise.then(function (res) {
      //console.log(res);
      expect(res).toBeDefined();
      done();
    }).catch(function (err) {
      expect(err).toThrow();
      done();
    })
  });

  it('should be able to get wide system info', function (done) {
    var promise = miscInstance.getSystemWideInfo();
    promise.then(function (res) {
      //console.log(res);
      expect(res).toBeDefined();
      done();
    }).catch(function (err) {
      expect(err).toThrow();
      done();
    })
  })

});
