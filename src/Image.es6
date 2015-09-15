'use strict';

import DockerBase from './DockerBase';

const IMAGE_PATH = 'images';
const IMAGE_ALL = 'json';
const IMAGE_SEARCH = 'search';
const IMAGE_CREATE = 'create';

export default class DockerImage extends DockerBase {
  constructor(serverIp, port) {
    super(serverIp, port);
  }

  getAllImages(options = {}) {
    return super.getRemote(
      super.getDefaultOption(options, {
        url: `/${IMAGE_PATH}/${IMAGE_ALL}`
      })
    );
  }

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

  searchImages(options = {}) {
    return super.getRemote(
      super.getDefaultOption(options, {
        url: `/${IMAGE_PATH}/${IMAGE_SEARCH}`
      })
    );
  }

  createImage(options = {}) {
    return super.postRemote(
      super.getDefaultOption(options, {
        url: `/${IMAGE_PATH}/${IMAGE_CREATE}`
      })
    );
  }

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
