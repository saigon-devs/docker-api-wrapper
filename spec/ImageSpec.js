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
            // console.log(res.body);
            expect(res).toBeDefined();
            done();
        }).catch(function(err) {
            expect(err).toThrow();
            done();
        });
    });
});