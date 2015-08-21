'use strict';

import DockerApi from './lib/DockerApi';
import DockerContainer from './lib/Container';
import DockerImage from './lib/Image';

export var BaseApi = DockerApi;
export var Container = DockerContainer;
export var Image = DockerImage;


/* todo: will migrate in next version
 import http from 'http';
 import util from 'util';
 import queryString from 'querystring';
 import async from 'async';
 import fs from 'fs';
 import request from 'superagent';

 export default class DockerApi {
 constructor(serverIp, port) {
 this.serverIp = serverIp;
 this.port = port;
 }

 performRequest(endpoint, method, querydata, postdata, callback) {
 let querydataString = queryString.stringify(querydata);
 let postdataString = JSON.stringify(postdata) || {};
 let headers = {
 'Content-Type': 'application/json',
 'Content-Length': postdataString.length
 };

 if (querydataString != '') {
 endpoint += '?' + querydataString;
 }

 let options = {
 host: this.serverIp,
 port: this.port,
 path: endpoint,
 method: method,
 headers: headers
 };

 console.log(options);
 var req = http.request(options, (res) => {
 res.setEncoding('utf-8');
 var responseString = '';

 res.on('data', (data) => {
 responseString += data;
 });
 res.on('end', () => {
 if (callback != null) {
 let resData = {
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

 queryRunningProcess(containerId, callback) {
 this.performRequest(util.format('/containers/%s/stats', containerId), 'GET', null, null, callback);
 }

 queryContainerChanges(containerId, callback) {
 this.performRequest(util.format('/containers/%s/changes', containerId), 'GET', null, null, callback);
 }

 queryInspectContainer(containerId, callback) {
 this.performRequest(util.format('/containers/%s/json', containerId), 'GET', null, null, callback);
 }

 stopContainer(containerId, callback) {
 this.performRequest(util.format('/containers/%s/stop', containerId), 'POST', null, null, callback);
 }

 stopAllContainers(callback) {
 var that = this;
 async.series([
 (cb) => {
 that.performRequest('/containers/json', 'GET', {all: 0}, null, (data) => {
 cb(null, data);
 });
 }
 ], (err, results) => {
 if (err) throw err;
 let containers = JSON.parse(results[0].data);
 if (containers.length == 0) {
 let resData = {
 statusCode: 304,
 data: 'containers already stopped'
 };
 callback(resData);
 }
 else {
 async.each(containers, (container, cb) => {
 that.stopContainer(container.Id, (data) => {
 cb();
 });
 }, (err) => {
 if (err) throw err;
 let resData = {
 statusCode: 200,
 data: 'done'
 };
 callback(resData);
 });
 }
 });
 }

 startContainer(containerId, callback) {
 let that = this;
 let inspectedContainers = [];
 async.series([
 (cb) => {
 that.performRequest('/containers/json', 'GET', {all: 1}, null, (data) => {
 cb(null, data);
 });
 }
 ], (err, results) => {
 if (err) throw err;
 var containers = JSON.parse(results[0].data);
 async.each(containers, (container, cb) => {
 that.queryInspectContainer(container.Id, (inspectedCont) => {
 inspectedContainers.push(JSON.parse(inspectedCont.data));
 cb();
 });
 }, (err) => {
 if (err) throw err;
 that.beginStartContainer(containerId, inspectedContainers, that);
 let resData = {
 statusCode: 200,
 data: 'done'
 };
 callback(resData);
 });
 });
 }

 beginStartContainer(containerId, inspectedContainers, scope) {
 scope.performRequest(util.format('/containers/%s/json', containerId), 'GET', null, null, (container) => {
 var inspectInfo = JSON.parse(container.data);
 if (inspectInfo.HostConfig.Links == null) {
 console.log('Starting Id: ' + containerId);
 scope.performRequest(util.format('/containers/%s/start', containerId), 'POST', null, null, null);
 }
 else {
 inspectInfo.HostConfig.Links.forEach((link) => {
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
 scope.performRequest(util.format('/containers/%s/start', containerId), 'POST', null, null, null);
 }
 });
 }

 createContainer(createdRequest, callback) {
 console.log(JSON.stringify(createdRequest));
 this.performRequest('/containers/create', 'POST', null, createdRequest, callback);
 }

 //image api
 getAllImages(querydata, callback) {
 this.performRequest('/images/json', 'GET', querydata, null, callback);
 }

 removeImage(imageId, callback) {
 this.performRequest(util.format('/images/%s', imageId), 'DELETE', null, null, callback);
 }

 createImage(querydata, callback) {
 this.performRequest('/images/create', 'POST', querydata, null, callback);
 }

 buildImage(filePath, callback) {
 let endpoint = '/build';
 let options = {
 hostname: this.serverIp,
 port: this.port,
 path: endpoint,
 method: 'POST',
 headers: {
 'Content-Type': 'application/tar'
 }
 };
 let req = http.request(options, (res) => {
 console.log('STATUS: ' + res.statusCode);
 console.log('HEADERS: ' + JSON.stringify(res.headers));
 res.setEncoding('utf8');
 res.on('data', (chunk) => {
 console.log('BODY: ' + chunk);
 });
 res.on('end', () => {
 callback();
 });
 });
 fs.createReadStream(filePath).pipe(req);
 }

 searchImage(imageName, callback) {
 this.performRequest('/images/search', 'GET', {term: imageName}, null, callback);
 }

 queryInspectImage(imageName, callback) {
 this.performRequest(util.format('/images/%s/json', imageName), 'GET', null, null, callback);
 }

 //misc api
 getVersion(callback) {
 this.performRequest('/version', 'GET', null, null, callback);
 }

 getSystemWideInfo(callback) {
 this.performRequest('/info', 'GET', null, null, callback);
 }
 }
 */