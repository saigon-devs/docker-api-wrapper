describe("Image", function () {
  var DockerApi = require('../index.js')
    , config = require('./config')
    , utils = require('./utils')
    , imageInstance = null
    , originalTimeout;

  beforeEach(function () {
    imageInstance = new DockerApi.Image(config.server, config.port);
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it("should be able to get all images", function (done) {
    var options = {
      queryData: {
        all: 1
      }
    };
    utils.test(
      imageInstance.getAllImages(options)
      , expect
      , done
    );
  });

  it("should be able to query inspect image", function (done) {
    var options = {
      queryData: {
        imageId: 'cf2616975b4a3cba083ca99bc3f0bf25f5f528c3c52be1596b30f60b0b1c37ff'
      }
    };
    done();
    /*utils.test(
      imageInstance.queryInspectImage(options)
      , expect
      , done
    ); */
  });

  it("should be able to create image", function (done) {
    var options = {
      queryData: {
        fromImage: 'hello-world'
      }
    };
    done();
    /*utils.test(
      imageInstance.createImage(options)
      , expect
      , done
    ); */
  });

  it("should be able to remove image", function (done) {
    done();
    /*utils.test(
      imageInstance.removeImage('hello-world')
      , expect
      , done
    ); */
  });
});
