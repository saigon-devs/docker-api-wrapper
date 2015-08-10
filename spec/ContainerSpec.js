describe("Container", function() {
    var DockerApi = require('../index.js')
        , config = require('./config')
        , dockerApiInstance = null;

    beforeEach(function() {
        dockerApiInstance = new DockerApi.Container(config.server, config.port);
    });

    it("should be able to get all containers", function(done) {
        var promise = dockerApiInstance.getAllContainers();
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