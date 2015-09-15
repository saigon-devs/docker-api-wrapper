'use strict';

import DockerBase from './DockerBase';

const CONTAINER = 'containers';
const CONTAINER_ALL = 'json';

/**
 * Container API endpoint
 */
export default class DockerContainer extends DockerBase {
  constructor(serverIp, port) {
    super(serverIp, port);
  }

  /**
   * List containers
   * GET /containers/json
   * @param options
   * @returns {*}
   */
  getContainers(options = {}) {
    return super.getRemote(
      super.getDefaultOption(options, {
        url: `/${CONTAINER}/${CONTAINER_ALL}`
      })
    );
  }

  /**
   * Get container stats based on resource usage
   * GET /containers/(id)/stats
   * @param options
   * @returns {*}
   */
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

  /**
   * Inspect changes on a container’s filesystem
   * GET /containers/(id)/changes
   * @param options
   * @returns {*}
   */
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

  /**
   * Inspect a container
   * GET /containers/(id)/json
   * @param options
   * @returns {*}
   */
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
