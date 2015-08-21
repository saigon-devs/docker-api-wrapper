'use strict';

import request from 'superagent';

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
    console.log(fullUrl);

    return new Promise((resolve, reject) => {
      request.get(fullUrl)
        .query(queryData)
        .end((err, res) => {
          return err ? reject(err) : resolve(res);
        });
    });
  }

}

export default new Utils();
