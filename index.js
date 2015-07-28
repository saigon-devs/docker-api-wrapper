/**
 * Created by JackyPhuong on 25/05/15.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var DockerApi = (function () {
    function DockerApi(serverIp, port) {
        _classCallCheck(this, DockerApi);

        this.serverIp = serverIp;
        this.port = port;
    }

    _createClass(DockerApi, [{
        key: 'performRequest',
        value: function performRequest(endpoint, method, querydata, postdata, callback) {
            var querydataString = _querystring2['default'].stringify(querydata);
            var postdataString = JSON.stringify(postdata) || {};
            var headers = {
                'Content-Type': 'application/json',
                'Content-Length': postdataString.length
            };

            if (querydataString != '') {
                endpoint += '?' + querydataString;
            }

            var options = {
                host: this.serverIp,
                port: this.port,
                path: endpoint,
                method: method,
                headers: headers
            };

            console.log(options);
            var req = _http2['default'].request(options, function (res) {
                res.setEncoding('utf-8');
                var responseString = '';

                res.on('data', function (data) {
                    responseString += data;
                });
                res.on('end', function () {
                    if (callback != null) {
                        var resData = {
                            statusCode: res.statusCode,
                            data: responseString
                        };
                        callback(resData);
                    }
                });
            });
            req.write(postdataString);
            req.end();
        }

        // container api
    }, {
        key: 'getAllContainers',
        value: function getAllContainers(querydata, callback) {
            this.performRequest('/containers/json', 'GET', querydata, null, callback);
        }
    }, {
        key: 'queryRunningProcess',
        value: function queryRunningProcess(containerId, callback) {
            this.performRequest(_util2['default'].format('/containers/%s/stats', containerId), 'GET', null, null, callback);
        }
    }, {
        key: 'queryContainerChanges',
        value: function queryContainerChanges(containerId, callback) {
            this.performRequest(_util2['default'].format('/containers/%s/changes', containerId), 'GET', null, null, callback);
        }
    }, {
        key: 'queryInspectContainer',
        value: function queryInspectContainer(containerId, callback) {
            this.performRequest(_util2['default'].format('/containers/%s/json', containerId), 'GET', null, null, callback);
        }
    }, {
        key: 'stopContainer',
        value: function stopContainer(containerId, callback) {
            this.performRequest(_util2['default'].format('/containers/%s/stop', containerId), 'POST', null, null, callback);
        }
    }, {
        key: 'stopAllContainers',
        value: function stopAllContainers(callback) {
            var that = this;
            _async2['default'].series([function (cb) {
                that.performRequest('/containers/json', 'GET', { all: 0 }, null, function (data) {
                    cb(null, data);
                });
            }], function (err, results) {
                if (err) throw err;
                var containers = JSON.parse(results[0].data);
                if (containers.length == 0) {
                    var resData = {
                        statusCode: 304,
                        data: 'containers already stopped'
                    };
                    callback(resData);
                } else {
                    _async2['default'].each(containers, function (container, cb) {
                        that.stopContainer(container.Id, function (data) {
                            cb();
                        });
                    }, function (err) {
                        if (err) throw err;
                        var resData = {
                            statusCode: 200,
                            data: 'done'
                        };
                        callback(resData);
                    });
                }
            });
        }
    }, {
        key: 'startContainer',
        value: function startContainer(containerId, callback) {
            var that = this;
            var inspectedContainers = [];
            _async2['default'].series([function (cb) {
                that.performRequest('/containers/json', 'GET', { all: 1 }, null, function (data) {
                    cb(null, data);
                });
            }], function (err, results) {
                if (err) throw err;
                var containers = JSON.parse(results[0].data);
                _async2['default'].each(containers, function (container, cb) {
                    that.queryInspectContainer(container.Id, function (inspectedCont) {
                        inspectedContainers.push(JSON.parse(inspectedCont.data));
                        cb();
                    });
                }, function (err) {
                    if (err) throw err;
                    that.beginStartContainer(containerId, inspectedContainers, that);
                    var resData = {
                        statusCode: 200,
                        data: 'done'
                    };
                    callback(resData);
                });
            });
        }
    }, {
        key: 'beginStartContainer',
        value: function beginStartContainer(containerId, inspectedContainers, scope) {
            scope.performRequest(_util2['default'].format('/containers/%s/json', containerId), 'GET', null, null, function (container) {
                var inspectInfo = JSON.parse(container.data);
                if (inspectInfo.HostConfig.Links == null) {
                    console.log('Starting Id: ' + containerId);
                    scope.performRequest(_util2['default'].format('/containers/%s/start', containerId), 'POST', null, null, null);
                } else {
                    inspectInfo.HostConfig.Links.forEach(function (link) {
                        for (var index = 0; index < inspectedContainers.length; index++) {
                            var inspectedCont = inspectedContainers[index];
                            if (inspectedCont.Name === link.split(':')[0]) {
                                console.log('Starting Id: ' + inspectedCont.Id);
                                scope.beginStartContainer(inspectedCont.Id, inspectedContainers, scope);
                                break;
                            }
                        }
                    });
                    console.log('Starting Id: ' + containerId);
                    scope.performRequest(_util2['default'].format('/containers/%s/start', containerId), 'POST', null, null, null);
                }
            });
        }
    }, {
        key: 'createContainer',
        value: function createContainer(createdRequest, callback) {
            console.log(JSON.stringify(createdRequest));
            this.performRequest('/containers/create', 'POST', null, createdRequest, callback);
        }

        //image api
    }, {
        key: 'getAllImages',
        value: function getAllImages(querydata, callback) {
            this.performRequest('/images/json', 'GET', querydata, null, callback);
        }
    }, {
        key: 'removeImage',
        value: function removeImage(imageId, callback) {
            this.performRequest(_util2['default'].format('/images/%s', imageId), 'DELETE', null, null, callback);
        }
    }, {
        key: 'createImage',
        value: function createImage(querydata, callback) {
            this.performRequest('/images/create', 'POST', querydata, null, callback);
        }
    }, {
        key: 'buildImage',
        value: function buildImage(filePath, callback) {
            var endpoint = '/build';
            var options = {
                hostname: this.serverIp,
                port: this.port,
                path: endpoint,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/tar'
                }
            };
            var req = _http2['default'].request(options, function (res) {
                console.log('STATUS: ' + res.statusCode);
                console.log('HEADERS: ' + JSON.stringify(res.headers));
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    console.log('BODY: ' + chunk);
                });
                res.on('end', function () {
                    callback();
                });
            });
            _fs2['default'].createReadStream(filePath).pipe(req);
        }
    }, {
        key: 'searchImage',
        value: function searchImage(imageName, callback) {
            this.performRequest('/images/search', 'GET', { term: imageName }, null, callback);
        }
    }, {
        key: 'queryInspectImage',
        value: function queryInspectImage(imageName, callback) {
            this.performRequest(_util2['default'].format('/images/%s/json', imageName), 'GET', null, null, callback);
        }

        //misc api
    }, {
        key: 'getVersion',
        value: function getVersion(callback) {
            this.performRequest('/version', 'GET', null, null, callback);
        }
    }, {
        key: 'getSystemWideInfo',
        value: function getSystemWideInfo(callback) {
            this.performRequest('/info', 'GET', null, null, callback);
        }
    }]);

    return DockerApi;
})();

exports['default'] = DockerApi;
module.exports = exports['default'];
