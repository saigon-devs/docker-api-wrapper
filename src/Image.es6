'use strict';

import DockerBase from './DockerBase';

const IMAGE_PATH = 'images';
const IMAGE_ALL = 'json';
const IMAGE_SEARCH = 'search';
const IMAGE_CREATE = 'create';

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
        url: `/${IMAGE_PATH}/${IMAGE_ALL}`
      })
    );
  }

  /**
   * Inspect an image
   * GET /images/(name)/json
   * @param options
   * @returns {*}
   */
  queryInspectImage(options = {}) {
    if (!options.queryData
      || !options.queryData.imageId
      || options.queryData.imageId <= 0) {
      console.error('ImageId should be assigned.');
    }

    return super.getRemote(
      super.getDefaultOption(options, {
        url: `/${IMAGE_PATH}/${options.queryData.imageId}/json`
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
        url: `/${IMAGE_PATH}/${IMAGE_SEARCH}`
      })
    );
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
        url: `/${IMAGE_PATH}/${IMAGE_CREATE}`
      })
    );
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
        url: `/${IMAGE_PATH}/${options.imageId}`
      })
    );
  }
}
