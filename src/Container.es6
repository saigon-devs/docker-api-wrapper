'use strict';

import _ from 'lodash';
import utils from './utils';

const CONTAINER_PATH = '/containers';
const CONTAINER_ALL_PATH = '/containers/json';

export default class DockerContainer {

  constructor(serverIp, port) {
    this.serverIp = serverIp;
    this.port = port;
  }

  getAllContainers(options) {
    options = options || {};
    _.assign(options, {
      serverIp: this.serverIp,
      port: this.port,
      getUrl: CONTAINER_ALL_PATH
    });

    return utils.getRemote(options);
  }

  queryRunningProcess(options) {
    options = options || {};
    const containerId = options.containerId || '';
    _.assign(options, {
      serverIp: this.serverIp,
      port: this.port,
      getUrl: `${CONTAINER_PATH}/${containerId}/stats`
    });

    return utils.getRemote(options);
  }

  queryContainerChanges(options) {
    options = options || {};
    const containerId = options.containerId || '';
    _.assign(options, {
      serverIp: this.serverIp,
      port: this.port,
      getUrl: `${CONTAINER_PATH}/${containerId}/changes`
    });

    return utils.getRemote(options);
  }

  queryInspectContainer(options) {
    options = options || {};
    const containerId = options.containerId || '';
    _.assign(options, {
      serverIp: this.serverIp,
      port: this.port,
      getUrl: `${CONTAINER_PATH}/${containerId}/json`
    });

    return utils.getRemote(options);
  }
}
