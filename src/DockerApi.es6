'use strict';

import utils from './utils';

const VERSION_PATH = '/version';
const SYSTEM_WIDE_INFO_PATH = '/info';

export default class BaseDockerApi {
  constructor(serverIp, port) {
    this.serverIp = serverIp;
    this.port = port;
  }

  getDefaultOptions() {
    return {
      serverIp: this.serverIp,
      port: this.port
    };
  }

  getVersion() {
    const options = this.getDefaultOptions();
    options.getUrl = VERSION_PATH;

    return utils.getRemote(options);
  }

  getSystemWideInfo() {
    const options = this.getDefaultOptions();
    options.getUrl = SYSTEM_WIDE_INFO_PATH;

    return utils.getRemote(options);
  }
}
