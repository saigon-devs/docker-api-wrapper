describe("Container", function () {
  var DockerApi = require('../index.js')
    , config = require('./config')
    , containerInstance = null
    , containerId = 'b300dab8fffd9936eef122e2e34e683';

  beforeEach(function () {
    containerInstance = new DockerApi.Container(config.server, config.port);
  });

  afterEach(function () {
  });

  it("should be able to get all containers", function (done) {
    var options = {
      queryData: {
        all: 1
      }
    };

    var promise = containerInstance.getAllContainers(options);
    promise.then(function (res) {
      // console.log(res);
      expect(res).toBeDefined();
      done();
    }).catch(function (err) {
      expect(err).toThrow();
      done();
    });
  });

  it("should be able to query running process", function (done) {
    done();
    /*
     var options = {
     containerName: 'hello1'
     };

     var promise = containerInstance.queryRunningProcess(options);
     promise.then(function (res) {
     console.log(res);
     expect(res).toBeDefined();
     done();
     }).catch(function (err) {
     expect(err).toThrow();
     done();
     }); */
  });

  it("should be able to query changes from specific container", function (done) {
    var options = {
      containerId: containerId
    };

    var promise = containerInstance.queryContainerChanges(options);
    promise.then(function (res) {
      // console.log(res);
      expect(res).toBeDefined();
      done();
    }).catch(function (err) {
      expect(err).toThrow();
      done();
    });
  });

  it("should be able to query inspection from specific container", function (done) {
    var options = {
      containerId: containerId
    };

    var promise = containerInstance.queryInspectContainer(options);
    promise.then(function (res) {
      // console.log(res);
      expect(res).toBeDefined();
      done();
    }).catch(function (err) {
      expect(err).toThrow();
      done();
    });
  });
});