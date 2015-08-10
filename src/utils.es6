'use strict';

export default {
    buildUrl: (serverIp, port, path) => {
        return `http://${serverIp}:${port}${path}`;
    }
};
