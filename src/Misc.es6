'use strict';

import DockerBase from './DockerBase';

const VERSION_PATH = '/version';
const SYSTEM_WIDE_INFO_PATH = '/info';

export default class Misc extends DockerBase {
  constructor(serverIp, port) {
    super(serverIp, port);
  }

  getVersion(options = {}) {
    const moreOptions = {
      getUrl: VERSION_PATH
    };
    const assignedOptions = super.getDefaultOptions(options, moreOptions);
    return super.getRemote(assignedOptions);
  }

  getSystemWideInfo(options = {}) {
    const moreOptions = {
      getUrl: SYSTEM_WIDE_INFO_PATH
    };
    const assignedOptions = super.getDefaultOptions(options, moreOptions);
    return super.getRemote(assignedOptions);
  }
}
