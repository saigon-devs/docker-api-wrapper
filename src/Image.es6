'use strict';

import _ from 'lodash';
import utils from './utils';
import DockerApi from './DockerApi';

const IMAGE_PATH = 'images';
const IMAGE_ALL = 'json';
const IMAGE_SEARCH = 'search';
const IMAGE_CREATE = 'create';

export default class DockerImage extends DockerApi {

  constructor(serverIp, port) {
    super(serverIp, port);
  }

  getAllImages(options) {
    _.assign(options, super.getDefaultOptions());
    options.getUrl = `/${IMAGE_PATH}/${IMAGE_ALL}`;

    return utils.getRemote(options);
  }

  queryInspectImage(options) {
    _.assign(options, super.getDefaultOptions());

    const imageId = options.queryData.imageId;
    options.getUrl = `/${IMAGE_PATH}/${imageId}/json`;

    return utils.getRemote(options);
  }

  searchImages(imageName) {
    const options = super.getDefaultOptions();
    options.queryData = {
      term: imageName
    };
    options.getUrl = `/${IMAGE_PATH}/${IMAGE_SEARCH}`;

    return utils.getRemote(options);
  }

  createImage(options) {
    _.assign(options, super.getDefaultOptions());
    options.postUrl = `/${IMAGE_PATH}/${IMAGE_CREATE}`;

    return utils.postRemote(options);
  }
}
