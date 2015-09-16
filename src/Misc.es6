'use strict';

import DockerBase from './DockerBase';

/**
 * Misc API endpoint
 */
export default class Misc extends DockerBase {
  constructor(serverIp, port) {
    super(serverIp, port);
  }

  /**
   * Check auth configuration
   * POST /auth
   * @param options
   * @returns {{}}
   */
  checkAuthConfig(options = {}) {
    return {};
  }

  /**
   * Display system-wide information
   * GET /info
   * @param options
   * @returns {*}
   */
  getInfo(options = {}) {
    return super.getRemote(
      super.getDefaultOption(options, {
        url: '/info'
      })
    );
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
        url: '/version'
      })
    );
  }

  /**
   * Ping the docker server
   * GET /_ping
   * @param options
   * @returns {{}}
   */
  pingDockerServer(options = {}) {
    return {};
  }

  /**
   * Create a new image from a container’s changes
   * POST /commit
   * @param options
   * @returns {{}}
   */
  createNewImageFromContainerChanges(options = {}) {
    return {};
  }

  /**
   * Monitor Docker’s events
   * GET /events
   * @param options
   * @returns {{}}
   */
  monitorDockerEvents(options = {}) {
    return {};
  }

  /**
   * Get a tarball containing all images in a repository
   * GET /images/(name)/get
   * @param options
   * @returns {{}}
   */
  getTarballImagesInRepository(options = {}) {
    return {};
  }

  /**
   * Get a tarball containing all images
   * GET /images/get
   * @param options
   * @returns {{}}
   */
  getTarballImages(options = {}) {
    return {};
  }

  /**
   * Load a tarball with a set of images and tags into docker
   * POST /images/load
   * @param options
   * @returns {{}}
   */
  loadTarballImagesTagsIntoDocker(options = {}) {
    return {};
  }

  /**
   * Image tarball format
   * @param options
   * @returns {{}}
   */
  imageTarballFormat(options = {}) {
    return {};
  }

  /**
   * Exec Create
   * POST /containers/(id)/exec
   * @param options
   * @returns {{}}
   */
  execCreate(options = {}) {
    return {};
  }

  /**
   * Exec Start
   * POST /exec/(id)/start
   * @param options
   * @returns {{}}
   */
  execStart(options = {}) {
    return {};
  }

  /**
   * Exec Resize
   * POST /exec/(id)/resize
   * @param options
   * @returns {{}}
   */
  execResize(options = {}) {
    return {};
  }

  /**
   * Exec Inspect
   * GET /exec/(id)/json
   * @param options
   * @returns {{}}
   */
  execInspect(options = {}) {
    return {};
  }
}
