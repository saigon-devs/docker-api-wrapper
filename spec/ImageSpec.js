describe("Image", function() {
    var DockerApi = require('../index.js')
        , config = require('./config')
        , imageInstance = null;

    beforeEach(function() {
        imageInstance = new DockerApi.Image(config.server, config.port);
    });

    it("should be able to get all images", function(done) {
        var options = {
            queryData: {
                all: 1
            }
        };

        var promise = imageInstance.getAllImages(options);
        promise.then(function(res) {
            expect(res).toBeDefined();
            done();
        }).catch(function(err) {
            expect(err).toThrow();
            done();
        });
    });

    it("should be able to query inspect image", function(done) {
        var options = {
            queryData: {
                imageId: 'cf2616975b4a3cba083ca99bc3f0bf25f5f528c3c52be1596b30f60b0b1c37ff'
            }
        };

        var promise = imageInstance.queryInspectImage(options);
        promise.then(function(res) {
            console.log(res.body);
            expect(res).toBeDefined();
            done();
        }).catch(function(err) {
            expect(err).toThrow();
            done();
        });
    });
});