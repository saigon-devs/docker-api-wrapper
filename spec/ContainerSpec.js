describe("Container", function() {
    var DockerApi = require('../index.js')
        , config = require('./config')
        , containerInstance = null
        , containerId = '89f13a5c734c106d5c81276cafbc';

    beforeEach(function() {
        containerInstance = new DockerApi.Container(config.server, config.port);
    });

    it("should be able to get all containers", function(done) {
        var options = {
            queryData: {
                all: 1
            }
        };

        var promise = containerInstance.getAllContainers(options);
        promise.then(function(res) {
            // console.log(res.body);
            expect(res).toBeDefined();
            done();
        }).catch(function(err) {
            expect(err).toThrow();
            done();
        });
    });

    it("should be able to query running process", function(done) {
        done();
        /*var options = {
            containerId: containerId
        };

        var promise = containerInstance.queryRunningProcess(options);
        promise.then(function(res) {
            expect(res).toBeDefined();
            done();
        }).catch(function(err) {
            expect(err).toThrow();
            done();
        });*/
    });

    it("should be able to query changes from specific container", function(done) {
        var options = {
            containerId: containerId
        };

        var promise = containerInstance.queryContainerChanges(options);
        promise.then(function(res) {
            expect(res).toBeDefined();
            done();
        }).catch(function(err) {
            expect(err).toThrow();
            done();
        });
    });

    it("should be able to query inspection from specific container", function(done) {
        var options = {
            containerId: containerId
        };

        var promise = containerInstance.queryInspectContainer(options);
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