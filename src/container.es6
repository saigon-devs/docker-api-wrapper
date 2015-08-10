'use strict';

import request from 'superagent';
import utils from './utils';

const CONTAINER_ALL = '/containers/json';

export default class DockerContainer {

    constructor(serverIp, port) {
        this.serverIp = serverIp;
        this.port = port;
    }

    getAllContainers(querydata) {
        if(querydata) {

        }
        return new Promise((resolve, reject) => {
            request.get(utils.buildUrl(this.serverIp, this.port, CONTAINER_ALL))
                .query('all=1')
                .end((err, res) => {
                    err ? reject(err) : resolve(res);
                });
        });
    }

}