'use strict';

import DockerBase from './DockerBase';

const VERSION_PATH = '/version';
const SYSTEM_WIDE_INFO_PATH = '/info';

export default class Misc extends DockerBase {
  constructor(serverIp, port) {
    super(serverIp, port);
  }

  getVersion(options = {}) {
    return super.getRemote(
      super.getDefaultOption(options, {
        url: VERSION_PATH
      })
    );
  }

  getSystemWideInfo(options = {}) {
    return super.getRemote(
      super.getDefaultOption(options, {
        url: SYSTEM_WIDE_INFO_PATH
      })
    );
  }
}
