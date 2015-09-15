'use strict';

import _ from 'lodash';
import request from 'axios';
import qs from 'querystring';

/**
 * DockerBase abstract class
 */
export default class DockerBase {
  constructor(serverIp, port) {
    this.serverIp = serverIp;
    this.port = port;
  }

  /**
   * Get remote method
   * @param options
   * @returns {*}
   */
  getRemote(options = {}) {
    return this.doRemoteRequest(
      request.get,
      DockerBase.validateOption(options)
    );
  }

  /**
   * Post remote method
   * @param options
   * @returns {*}
   */
  postRemote(options = {}) {
    return this.doRemoteRequest(
      request.post,
      DockerBase.validateOption(options),
      true
    );
  }

  /**
   * Delete remote method
   * @param options
   * @returns {*}
   */
  deleteRemote(options = {}) {
    return this.doRemoteRequest(
      request.delete,
      DockerBase.validateOption(options),
      true
    );
  }

  /**
   * Merging default options with extend options
   * @param options
   * @param sources
   * @returns {{}}
   */
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

  /**
   * Doing a remote request
   * @param requestFunc
   * @param o
   * @param withDataQuery
   * @returns {Promise}
   */
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

  /**
   * Validate default option
   * @param o
   * @returns {
   *  {
   *    serverIp: (*|string),
   *    serverPort: (*|number),
   *    url: *, urlWithQueryData: *,
   *    queryData: (*|options.queryData|{all}|{imageId}|{fromImage}|{})
   *  }
   * }
   */
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

  /**
   * Build static Url
   * @param serverIp
   * @param port
   * @param path
   * @param queryString
   * @returns {*}
   */
  static buildUrl(serverIp, port, path, queryString) {
    const url = `http://${serverIp}:${port}${path}`;
    return queryString == undefined || queryString === ''
      ? url
      : url + `?${queryString}`;
  }
}
