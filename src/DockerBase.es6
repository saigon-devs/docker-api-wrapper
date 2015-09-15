'use strict';

import _ from 'lodash';
import request from 'axios';
import qs from 'querystring';

export default class DockerBase {
  constructor(serverIp, port) {
    this.serverIp = serverIp;
    this.port = port;
  }

  getRemote(options = {}) {
    return this.doRemoteRequest(
      request.get,
      DockerBase.validateOption(options)
    );
  }

  postRemote(options = {}) {
    return this.doRemoteRequest(
      request.post,
      DockerBase.validateOption(options),
      true
    );
  }

  deleteRemote(options = {}) {
    return this.doRemoteRequest(
      request.delete,
      DockerBase.validateOption(options),
      true
    );
  }

  getDefaultOption(options = {}, sources = {}) {
    _.assign(options, {
      serverIp: this.serverIp,
      port: this.port
    });
    if (sources) {
      _.assign(options, sources);
    }
    return options;
  }

  doRemoteRequest(requestFunc, o, withDataQuery = false) {
    let url = o.url;
    if (withDataQuery != undefined && withDataQuery == true) {
      url = o.urlWithQueryData;
    }
    console.info(url);
    return new Promise((resolve, reject) => {
      return requestFunc(url, {
        params: o.queryData
      }).then(function (response) {
        resolve(response);
      }).catch(function (error) {
        reject(error);
      });
    });
  }

  static validateOption(o) {
    return {
      serverIp: o.serverIp || '',
      serverPort: o.port || 80,
      url: DockerBase.buildUrl(
        o.serverIp,
        o.port,
        o.url),
      urlWithQueryData: DockerBase.buildUrl(
        o.serverIp,
        o.port,
        o.url,
        qs.stringify(o.queryData)),
      queryData: o.queryData || {}
    };
  }

  static buildUrl(serverIp, port, path, queryString) {
    const url = `http://${serverIp}:${port}${path}`;
    return queryString == undefined || queryString === ''
      ? url
      : url + `?${queryString}`;
  }
}
