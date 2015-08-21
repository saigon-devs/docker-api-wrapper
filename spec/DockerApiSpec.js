/**
 * Created by Phuong on 8/21/2015.
 */
describe("BaseDockerApi", function () {
  var DockerApi = require('../index.js')
    , config = require('./config')
    , apiInstance = null;

  beforeEach(function () {
    apiInstance = new DockerApi.BaseApi(config.server, config.port);
  });

  it('should be able to get version', function (done) {
    var promise = apiInstance.getVersion();
    promise.then(function (res) {
      expect(res).toBeDefined();
      done();
    }).catch(function (err) {
      expect(err).toThrow();
      done();
    })
  });

  it('should be able to get wide system info', function (done) {
    var promise = apiInstance.getSystemWideInfo();
    promise.then(function (res) {
      expect(res).toBeDefined();
      done();
    }).catch(function (err) {
      expect(err).toThrow();
      done();
    })
  })

})
