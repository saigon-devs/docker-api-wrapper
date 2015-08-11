'use strict';

import request from 'superagent';

class Utils {

    buildUrl(serverIp, port, path) {
        return `http://${serverIp}:${port}${path}`;
    }

    getRemote(options) {
        let serverIp = options.serverIp || '';
        let port  = options.port || 80;
        let getUrl = options.getUrl || '';
        let queryData = options.queryData || {};
        let fullUrl = this.buildUrl(serverIp, port, getUrl);
        console.log(fullUrl);

        return new Promise((resolve, reject) => {
            request.get(fullUrl)
                .query(queryData)
                .end((err, res) => {
                    err ? reject(err) : resolve(res);
                });
        });
    }

}

export default new Utils();