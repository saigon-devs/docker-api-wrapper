'use strict';

import DockerBase from './DockerBase';

const CONTAINER = 'containers';
const CONTAINER_ALL = 'json';

export default class DockerContainer extends DockerBase {
  constructor(serverIp, port) {
    super(serverIp, port);
  }

  getAllContainers(options = {}) {
    const moreOptions = {
      getUrl: `/${CONTAINER}/${CONTAINER_ALL}`
    };
    const assignedOptions = super.getDefaultOptions(options, moreOptions);
    return super.getRemote(assignedOptions);
  }

  queryRunningProcess(options = {}) {
    if(!options || !options.containerName) {
      console.error('ContainerName is empty');
    }
    const moreOptions = {
      getUrl: `/${CONTAINER}/${options.containerName}/stats`
    };
    const assignedOptions = super.getDefaultOptions(options, moreOptions);
    return super.getRemote(assignedOptions);
  }

  queryContainerChanges(options = {}) {
    if(!options || !options.containerId) {
      console.error('ContainerId is empty');
    }
    const moreOptions = {
      getUrl: `/${CONTAINER}/${options.containerId}/changes`
    };
    const assignedOptions = super.getDefaultOptions(options, moreOptions);
    return super.getRemote(assignedOptions);
  }

  queryInspectContainer(options = {}) {
    if(!options || !options.containerId) {
      console.error('ContainerId is empty');
    }
    const moreOptions = {
      getUrl: `/${CONTAINER}/${options.containerId}/json`
    };
    const assignedOptions = super.getDefaultOptions(options, moreOptions);
    return super.getRemote(assignedOptions);
  }
}
