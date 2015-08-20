'use strict';

import _ from 'lodash'
import utils from './utils'
import BaseDockerApi from './BaseDockerApi'

const IMAGE_ALL_PATH = '/images/json'
const IMAGE_PATH = '/images'


export default class DockerImage extends BaseDockerApi {

	constructor(serverIp, port) {
		super(serverIp, port)
	}

	getAllImages(options) {
		options = options || {}
		_.assign(options, super.getDefaultOptions())
		options.getUrl = IMAGE_ALL_PATH

		return utils.getRemote(options)
	}

	queryInspectImage(options) {
		options = options || {}
		_.assign(options, super.getDefaultOptions())

		let imageId = options.queryData.imageId
		options.getUrl = `${IMAGE_PATH}/${imageId}/json`

		return utils.getRemote(options)
	}

}