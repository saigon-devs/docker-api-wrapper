'use strict';

import _ from 'lodash';
import request from 'axios';
import qs from 'querystring';

export default class DockerBase {
  constructor(serverIp, port) {
    this.serverIp = serverIp;
    this.port = port;
  }

  getDefaultOptions(options = {}, sources = {}) {
    // assign server options
    _.assign(options, {
      serverIp: this.serverIp,
      port: this.port
    });

    // assign custom options
    if (sources) {
      _.assign(options, sources);
    }

    return options;
  }

  getRemote(options = {}) {
    const serverIp = options.serverIp || '';
    const port = options.port || 80;
    const getUrl = options.getUrl || '';
    const queryData = options.queryData || {};
    const fullUrl = DockerBase.buildUrl(serverIp, port, getUrl);
    console.info(fullUrl);

    return new Promise((resolve, reject) => {
      return request.get(fullUrl, {
        params: queryData
      }).then(function (response) {
        resolve(response);
      }).catch(function (error) {
        reject(error);
      });
    });
  }

  postRemote(options = {}) {
    const serverIp = options.serverIp || '';
    const port = options.port || 80;
    const postUrl = options.postUrl || '';
    const queryData = options.queryData || {};
    const fullUrl = DockerBase.buildUrl(serverIp, port, postUrl, qs.stringify(queryData));
    console.info(fullUrl);

    return new Promise((resolve, reject) => {
      return request.post(fullUrl
      ).then(function (response) {
          resolve(response);
        }).catch(function (error) {
          reject(error);
        });
    });
  }

  deleteRemote(options = {}) {
    const serverIp = options.serverIp || '';
    const port = options.port || 80;
    const deleteUrl = options.deleteUrl || '';
    const queryData = options.queryData || {};
    const fullUrl = DockerBase.buildUrl(serverIp, port, deleteUrl, qs.stringify(queryData));
    console.info(fullUrl);

    return new Promise((resolve, reject) => {
      return request.delete(fullUrl
      ).then(function (response) {
          resolve(response);
        }).catch(function (error) {
          reject(error);
        });
    });
  }

  static buildUrl(serverIp, port, path, queryString) {
    const url = `http://${serverIp}:${port}${path}`;
    return queryString == undefined || queryString === ''
      ? url
      : url + `?${queryString}`;
  }
}
