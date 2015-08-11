'use strict';

import _ from 'lodash';
import utils from './utils';

const IMAGE_ALL_PATH = '/images/json';

export default class DockerImage {

    constructor(serverIp, port) {
        this.serverIp = serverIp;
        this.port = port;
    }

    getAllImages(options) {
        options = options || {};
        _.assign(options, {
            serverIp: this.serverIp,
            port: this.port,
            getUrl: IMAGE_ALL_PATH
        });

        return utils.getRemote(options);
    }

}