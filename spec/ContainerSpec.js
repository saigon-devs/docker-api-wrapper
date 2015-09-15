describe("Container", function () {
  var DockerApi = require('../index.js')
    , config = require('./config')
    , utils = require('./utils')
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
    utils.test(
      containerInstance.getContainers(options)
      , expect
      , done
    );
  });

  it("should be able to query running process", function (done) {
    done();
    /*
     var options = {
     containerName: 'hello1'
     };
     utils.test(
        containerInstance.queryRunningProcess(options)
       , expect
       , done
     ); */
  });

  it("should be able to query changes from specific container", function (done) {
    var options = {
      containerId: containerId
    };
    utils.test(
      containerInstance.queryContainerChanges(options)
      , expect
      , done
    );
  });

  it("should be able to query inspection from specific container", function (done) {
    var options = {
      containerId: containerId
    };
    utils.test(
      containerInstance.queryInspectContainer(options)
      , expect
      , done
    );
  });
});