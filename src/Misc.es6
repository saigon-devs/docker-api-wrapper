'use strict';

import DockerBase from './DockerBase';

const VERSION_PATH = '/version';
const SYSTEM_WIDE_INFO_PATH = '/info';

/**
 * Misc API endpoint
 */
export default class Misc extends DockerBase {
  constructor(serverIp, port) {
    super(serverIp, port);
  }

  /**
   * Show the docker version information
   * GET /version
   * @param options
   * @returns {*}
   */
  getVersion(options = {}) {
    return super.getRemote(
      super.getDefaultOption(options, {
        url: VERSION_PATH
      })
    );
  }

  /**
   * Display system-wide information
   * GET /info
   * @param options
   * @returns {*}
   */
  getSystemWideInfo(options = {}) {
    return super.getRemote(
      super.getDefaultOption(options, {
        url: SYSTEM_WIDE_INFO_PATH
      })
    );
  }
}
