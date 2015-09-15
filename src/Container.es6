'use strict';

import DockerBase from './DockerBase';

const CONTAINER = 'containers';
const CONTAINER_ALL = 'json';

export default class DockerContainer extends DockerBase {
  constructor(serverIp, port) {
    super(serverIp, port);
  }

  getAllContainers(options = {}) {
    return super.getRemote(
      super.getDefaultOption(options, {
        url: `/${CONTAINER}/${CONTAINER_ALL}`
      })
    );
  }

  queryRunningProcess(options = {}) {
    if (!options || !options.containerName) {
      console.error('ContainerName should be assigned.');
    }

    return super.getRemote(
      super.getDefaultOption(options, {
        url: `/${CONTAINER}/${options.containerName}/stats`
      })
    );
  }

  queryContainerChanges(options = {}) {
    if (!options || !options.containerId) {
      console.error('ContainerId should be assigned.');
    }

    return super.getRemote(
      super.getDefaultOption(options, {
        url: `/${CONTAINER}/${options.containerId}/changes`
      })
    );
  }

  queryInspectContainer(options = {}) {
    if (!options || !options.containerId) {
      console.error('ContainerId should be assigned.');
    }

    return super.getRemote(
      super.getDefaultOption(options, {
        url: `/${CONTAINER}/${options.containerId}/json`
      })
    );
  }
}
