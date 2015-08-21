'use strict';

import request from 'axios';

class Utils {
  buildUrl(serverIp, port, path) {
    return `http://${serverIp}:${port}${path}`;
  }

  getRemote(options) {
    const serverIp = options.serverIp || '';
    const port = options.port || 80;
    const getUrl = options.getUrl || '';
    const queryData = options.queryData || {};
    const fullUrl = this.buildUrl(serverIp, port, getUrl);
    console.info(fullUrl);

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

  postRemote(options) {
    const serverIp = options.serverIp || '';
    const port = options.port || 80;
    const postUrl = options.postUrl || '';
    const queryData = options.queryData || {};
    const fullUrl = this.buildUrl(serverIp, port, postUrl);
    console.info(fullUrl);

    return new Promise((resolve, reject) => {
      //todo: temporary hard code here
      return request.post(
        fullUrl + '?fromImage=hello-world'
      ).then(function (response) {
          console.log(response);
          resolve(response);
        }).catch(function (response) {
          reject(response);
        });
    });
  }
}

export default new Utils();
