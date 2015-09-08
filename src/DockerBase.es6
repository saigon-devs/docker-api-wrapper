'use strict';

import _ from 'lodash';
import request from 'axios';
import querystring from 'querystring';

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
    const fullUrl = this.buildUrl(serverIp, port, getUrl);
    //console.info(fullUrl);

    return new Promise((resolve, reject) => {
      return request.get(fullUrl, {
        params: queryData
      }).then(function (response) {
        resolve(response);
      }).catch(function (response) {
        reject(response);
      });
    });
  }

  postRemote(options = {}) {
    const serverIp = options.serverIp || '';
    const port = options.port || 80;
    const postUrl = options.postUrl || '';
    const queryData = options.queryData || {};
    const fullUrl = this.buildUrl(serverIp, port, postUrl, querystring.stringify(queryData));
    console.info(fullUrl);

    return new Promise((resolve, reject) => {
      return request.post(fullUrl
      ).then(function (response) {
          console.log(response);
          resolve(response);
        }).catch(function (response) {
          console.log(response);
          reject(response);
        });
    });
  }

  buildUrl(serverIp, port, path, queryString) {
    return queryString != undefined
      ? `http://${serverIp}:${port}${path}?${queryString}`
      : `http://${serverIp}:${port}${path}`;
  }
}
