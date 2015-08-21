'use strict';

import _ from 'lodash';
import utils from './utils';
import DockerApi from './DockerApi';

const IMAGE_ALL_PATH = '/images/json';
const IMAGE_PATH = '/images';
const IMAGE_SEARCH = '/images/search';
const IMAGE_CREATE = '/images/create?fromImage=hello-world'

export default class DockerImage extends DockerApi {

  constructor(serverIp, port) {
    super(serverIp, port);
  }

  getAllImages(options) {
    _.assign(options, super.getDefaultOptions());
    options.getUrl = IMAGE_ALL_PATH;

    return utils.getRemote(options);
  }

  queryInspectImage(options) {
    _.assign(options, super.getDefaultOptions());

    const imageId = options.queryData.imageId;
    options.getUrl = `${IMAGE_PATH}/${imageId}/json`;

    return utils.getRemote(options);
  }

  searchImages(imageName) {
    const options = super.getDefaultOptions();
    options.queryData = {
      term: imageName
    };
    options.getUrl = IMAGE_SEARCH;

    return utils.getRemote(options);
  }

  createImage(options) {
    _.assign(options, super.getDefaultOptions());
    options.postUrl = IMAGE_CREATE;

    return utils.postRemote(options);
  }
}
