describe("Misc", function () {
  var DockerApi = require('../index.js')
    , config = require('./config')
    , utils = require('./utils')
    , miscInstance = null;

  beforeEach(function () {
    miscInstance = new DockerApi.Misc(config.server, config.port);
  });

  it('should be able to get version', function (done) {
    utils.test(
      miscInstance.getVersion()
      , expect
      , done
    );
  });

  it('should be able to get wide system info', function (done) {
    utils.test(
      miscInstance.getInfo()
      , expect
      , done
    );
  })
});
