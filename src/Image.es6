'use strict';

import DockerBase from './DockerBase';

/**
 * Image API endpoint
 */
export default class DockerImage extends DockerBase {
  constructor(serverIp, port) {
    super(serverIp, port);
  }

  /**
   * List Images
   * GET /images/json
   * @param options
   * @returns {*}
   */
  getImages(options = {}) {
    return super.getRemote(
      super.getDefaultOption(options, {
        url: '/images/json'
      })
    );
  }

  /**
   * Build image from a Dockerfile
   * POST /build
   * @param options
   * @returns {{}}
   */
  buildImage(options = {}) {
    return {};
  }

  /**
   * Create an image
   * POST /images/create
   * @param options
   * @returns {*}
   */
  createImage(options = {}) {
    return super.postRemote(
      super.getDefaultOption(options, {
        url: '/images/create'
      })
    );
  }

  /**
   * Inspect an image
   * GET /images/(name)/json
   * @param options
   * @returns {*}
   */
  inspectImage(options = {}) {
    if (!options.queryData
      || !options.queryData.imageId
      || options.queryData.imageId <= 0) {
      console.error('ImageId should be assigned.');
    }

    return super.getRemote(
      super.getDefaultOption(options, {
        url: `/images/${options.queryData.imageId}/json`
      })
    );
  }

  /**
   * Get the history of an image
   * GET /images/(name)/history
   * @param options
   * @returns {*}
   */
  getImageHistory(options = {}) {
    if (!options.queryData
      || !options.queryData.imageName) {
      console.error('ImageId should be assigned.');
    }

    return super.getRemote(
      super.getDefaultOption(options, {
        url: `/images/${options.queryData.imageName}/history`
      })
    );
  }

  /**
   * Push an image on the registry
   * POST /images/(name)/push
   * @param options
   * @returns {{}}
   */
  pushImageToRegistry(options = {}) {
    return {};
  }

  /**
   * Tag an image into a repository
   * POST /images/(name)/tag
   * @param options
   * @returns {{}}
   */
  tagImageIntoRegistry(options = {}) {
    return {};
  }

  /**
   * Remove an image
   * DELETE /images/(name)
   * @param options
   * @returns {*}
   */
  removeImage(options) {
    if (!options.imageId || options.imageId <= 0) {
      console.error('ImageId should be assigned.');
    }

    return super.deleteRemote(
      super.getDefaultOption(options, {
        url: `/images/${options.imageId}`
      })
    );
  }

  /**
   * Search images
   * GET /images/search
   * @param options
   * @returns {*}
   */
  searchImages(options = {}) {
    return super.getRemote(
      super.getDefaultOption(options, {
        url: '/images/search'
      })
    );
  }
}
