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
    const moreOptions = {
      getUrl: `/${IMAGE_PATH}/${IMAGE_ALL}`
    };
    const assignedOptions = super.getDefaultOptions(options, moreOptions);
    return super.getRemote(assignedOptions);
  }

  queryInspectImage(options = {}) {
    if (!options || !options.queryData || !options.queryData.imageId) {
      console.error('ImageId is empty');
    }

    const imageId = options.queryData.imageId;
    const moreOptions = {
      getUrl: `/${IMAGE_PATH}/${imageId}/json`
    };
    const assignedOptions = super.getDefaultOptions(options, moreOptions);
    return super.getRemote(assignedOptions);
  }

  searchImages(options = {}) {
    if (!options || !options.queryData || !options.queryData.imageName) {
      console.error('ImageId is empty');
    }

    const moreOptions = {
      getUrl: `/${IMAGE_PATH}/${IMAGE_SEARCH}`
    };
    const assignedOptions = super.getDefaultOptions(options, moreOptions);
    return super.getRemote(assignedOptions);
  }

  createImage(options = {}) {
    const moreOptions = {
      postUrl: `/${IMAGE_PATH}/${IMAGE_CREATE}`
    };
    const assignedOptions = super.getDefaultOptions(options, moreOptions);
    return super.postRemote(assignedOptions);
  }
}
