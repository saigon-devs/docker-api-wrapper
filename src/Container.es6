'use strict';

import DockerBase from './DockerBase';

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
        url: '/containers/json'
      })
    );
  }

  /**
   * Create a container
   * POST /containers/create
   * @param options
   * @returns {{}}
   */
  createContainer(options = {}) {
    return {};
  }

  /**
   * Inspect a container
   * GET /containers/(id)/json
   * @param options
   * @returns {*}
   */
  inspectContainer(options = {}) {
    if (!options || !options.containerId) {
      console.error('ContainerId should be assigned.');
    }

    return super.getRemote(
      super.getDefaultOption(options, {
        url: `/containers/${options.containerId}/json`
      })
    );
  }

  /**
   * List processes running inside a container
   * GET /containers/(id)/top
   * @param options
   * @returns {{}}
   */
  getRunningProcess(options = {}) {
    return {};
  }

  /**
   * Get container logs
   * GET /containers/(id)/logs
   * @param options
   * @returns {{}}
   */
  getContainerLogs(options = {}) {
    return {};
  }

  /**
   * Inspect changes on a container’s filesystem
   * GET /containers/(id)/changes
   * @param options
   * @returns {*}
   */
  inspectContainerChanges(options = {}) {
    if (!options || !options.containerId) {
      console.error('ContainerId should be assigned.');
    }

    return super.getRemote(
      super.getDefaultOption(options, {
        url: `/containers/${options.containerId}/changes`
      })
    );
  }

  /**
   * Export a container
   * GET /containers/(id)/export
   * @param options
   * @returns {{}}
   */
  exportContainer(options = {}) {
    return {};
  }

  /**
   * Get container stats based on resource usage
   * GET /containers/(id)/stats
   * @param options
   * @returns {{}}
   */
  getContainerResourceStats(options = {}) {
    if (!options || !options.containerName) {
      console.error('ContainerName should be assigned.');
    }

    return super.getRemote(
      super.getDefaultOption(options, {
        url: `/containers/${options.containerName}/stats`
      })
    );
  }

  /**
   * Resize a container TTY
   * POST /containers/(id)/resize?h=<height>&w=<width>
   * @param options
   * @returns {{}}
   */
  resizeTTYContainer(options = {}) {
    return {};
  }

  /**
   * Start a container
   * POST /containers/(id)/start
   * @param options
   * @returns {{}}
   */
  startContainer(options = {}) {
    return {};
  }

  /**
   * Stop a container
   * POST /containers/(id)/stop
   * @param options
   * @returns {{}}
   */
  stopContainer(options = {}) {
    return {};
  }

  /**
   * Restart a container
   * POST /containers/(id)/restart
   * @param options
   * @returns {{}}
   */
  restartContainer(options = {}) {
    return {};
  }

  /**
   * Kill a container
   * POST /containers/(id)/kill
   * @param options
   * @returns {{}}
   */
  killContainer(options = {}) {
    return {};
  }

  /**
   * Rename a container
   * POST /containers/(id)/rename
   * @param options
   * @returns {{}}
   */
  renameContainer(options = {}) {
    return {};
  }

  /**
   * Pause a container
   * POST /containers/(id)/pause
   * @param options
   * @returns {{}}
   */
  pauseContainer(options = {}) {
    return {};
  }

  /**
   * Unpause a container
   * POST /containers/(id)/unpause
   * @param options
   * @returns {{}}
   */
  unpauseContainer(options = {}) {
    return {};
  }

  /**
   * Attach to a container
   * POST /containers/(id)/attach
   * @param options
   * @returns {{}}
   */
  attachContainer(options = {}) {
    return {};
  }

  /**
   * Attach to a container (websocket)
   * GET /containers/(id)/attach/ws
   * @param options
   * @returns {{}}
   */
  attachContainerWebSocket(options = {}) {
    return {};
  }

  /**
   * Wait a container
   * POST /containers/(id)/wait
   * @param options
   * @returns {{}}
   */
  waitContainer(options = {}) {
    return {};
  }

  /**
   * Remove a container
   * DELETE /containers/(id)
   * @param options
   * @returns {{}}
   */
  removeContainer(options = {}) {
    return {};
  }

  /**
   * Copy files or folders from a container
   * POST /containers/(id)/copy
   * @param options
   * @returns {{}}
   */
  copyContainer(options = {}) {
    return {};
  }
}
